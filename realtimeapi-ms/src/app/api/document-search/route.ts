import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { query, vectorStoreId } = await request.json();
    
    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    if (!vectorStoreId) {
      return NextResponse.json(
        { error: 'Vector store ID is required' },
        { status: 400 }
      );
    }

    // Create a readable stream for real-time updates
    const encoder = new TextEncoder();
    
    const stream = new ReadableStream({
      async start(controller) {
        let isClosed = false;
        
        const safeEnqueue = (data: string) => {
          if (!isClosed) {
            try {
              controller.enqueue(encoder.encode(data));
            } catch (error) {
              console.error('Error enqueueing data:', error);
              isClosed = true;
            }
          }
        };
        
        const safeClose = () => {
          if (!isClosed) {
            try {
              controller.close();
              isClosed = true;
            } catch (error) {
              console.error('Error closing controller:', error);
            }
          }
        };
        
        try {
          // Send initial status
          safeEnqueue(`data: ${JSON.stringify({ 
            type: 'status', 
            message: `📄 Searching documents for: ${query}...` 
          })}\n\n`);

          // Use OpenAI Responses API directly for document search with streaming
          const openaiApiKey = process.env.OPENAI_API_KEY;
          if (!openaiApiKey) {
            throw new Error('OpenAI API key not configured');
          }

          const response = await fetch('https://api.openai.com/v1/beta/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${openaiApiKey}`,
              'OpenAI-Beta': 'assistants=v2'
            },
            body: JSON.stringify({
              model: 'gpt-4o',
              messages: [
                {
                  role: 'user',
                  content: query
                }
              ],
              tools: [
                {
                  type: 'file_search'
                }
              ],
              tool_resources: {
                file_search: {
                  vector_store_ids: [vectorStoreId]
                }
              },
              stream: true,
              temperature: 0.3,
              max_tokens: 2000
            }),
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`OpenAI API failed: ${response.status} - ${errorText}`);
          }

          // Handle streaming response
          const reader = response.body?.getReader();
          if (!reader) {
            throw new Error('No response body');
          }

          const decoder = new TextDecoder();
          let buffer = '';
          let hasContent = false;
          let fullContent = '';

          while (true && !isClosed) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              if (line.startsWith('data: ') && !isClosed) {
                const data = line.slice(6).trim();
                if (data === '[DONE]') {
                  safeEnqueue(`data: ${JSON.stringify({ 
                    type: 'complete', 
                    message: '✅ Document search completed!',
                    fullContent: fullContent
                  })}\n\n`);
                  safeClose();
                  return;
                }

                if (data === '') continue;

                try {
                  const parsed = JSON.parse(data);
                  
                  // Handle OpenAI Chat Completions streaming format
                  if (parsed.choices && parsed.choices[0] && parsed.choices[0].delta && parsed.choices[0].delta.content) {
                    const content = parsed.choices[0].delta.content;
                    hasContent = true;
                    fullContent += content;
                    
                    safeEnqueue(`data: ${JSON.stringify({
                      type: 'content',
                      text: content
                    })}\n\n`);
                  }
                  
                  // Handle tool calls (file search)
                  else if (parsed.choices && parsed.choices[0] && parsed.choices[0].delta && parsed.choices[0].delta.tool_calls) {
                    safeEnqueue(`data: ${JSON.stringify({ 
                      type: 'status', 
                      message: '🔍 Searching documents...' 
                    })}\n\n`);
                  }
                } catch (e) {
                  // Skip invalid JSON
                  console.log('JSON parse error:', e);
                }
              }
            }
          }

          // Only send completion if we haven't already
          if (!isClosed) {
            safeEnqueue(`data: ${JSON.stringify({ 
              type: 'complete', 
              message: '✅ Document search completed!',
              fullContent: fullContent
            })}\n\n`);
            safeClose();
          }
          
        } catch (error) {
          console.error('Document search streaming error:', error);
          if (!isClosed) {
            safeEnqueue(`data: ${JSON.stringify({ 
              type: 'error', 
              message: `Document search failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
            })}\n\n`);
            safeClose();
          }
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
    
  } catch (error) {
    console.error('Document search error:', error);
    return NextResponse.json(
      { error: 'Failed to perform document search' },
      { status: 500 }
    );
  }
} 