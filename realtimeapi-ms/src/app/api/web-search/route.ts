import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();
    
    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
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
            message: `🔍 Searching for: ${query}...` 
          })}\n\n`);

          // Use OpenAI Responses API with web search for real-time search
          const openaiApiKey = process.env.OPENAI_API_KEY;
          if (!openaiApiKey) {
            throw new Error('OpenAI API key not configured');
          }

          const response = await fetch('https://api.openai.com/v1/responses', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${openaiApiKey}`,
              'OpenAI-Beta': 'assistants=v2',
            },
            body: JSON.stringify({
              model: 'gpt-4o',
              input: `Please search for current information about: ${query}

Provide comprehensive, up-to-date information including:
1. Current facts and data
2. Recent developments or news
3. Key details and context
4. Any relevant statistics or numbers

Please be thorough and accurate in your search.`,
              tools: [
                { 
                  type: 'web_search_preview',
                  search_context_size: 'medium'
                }
              ],
              stream: true,
              temperature: 0.7,
              max_output_tokens: 2000,
              parallel_tool_calls: true
            }),
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`OpenAI Responses API failed: ${response.status} - ${errorText}`);
          }

          // Handle streaming response from Responses API
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
                    message: '✅ Search completed!',
                    fullContent: fullContent
                  })}\n\n`);
                  safeClose();
                  return;
                }

                if (data === '') continue;

                try {
                  const parsed = JSON.parse(data);
                  
                  // Handle Responses API streaming format
                  if (parsed.output && Array.isArray(parsed.output)) {
                    for (const output of parsed.output) {
                      // Handle message content updates
                      if (output.type === 'message' && output.content) {
                        for (const content of output.content) {
                          if (content.type === 'output_text' && content.text) {
                            hasContent = true;
                            fullContent = content.text; // Use full text, not append
                            
                            safeEnqueue(`data: ${JSON.stringify({
                              type: 'content',
                              text: content.text
                            })}\n\n`);
                          }
                        }
                      }
                      // Handle web search status updates
                      else if (output.type === 'web_search_call') {
                        if (output.status === 'in_progress') {
                          safeEnqueue(`data: ${JSON.stringify({ 
                            type: 'status', 
                            message: '🌐 Searching the web...' 
                          })}\n\n`);
                        } else if (output.status === 'completed') {
                          console.log('✅ Web search completed');
                        }
                      }
                    }
                  }
                  
                  // Handle alternative delta format (fallback)
                  else if (parsed.type === 'response.output_text.delta' && parsed.delta) {
                    hasContent = true;
                    fullContent += parsed.delta;
                    
                    safeEnqueue(`data: ${JSON.stringify({
                      type: 'content',
                      text: parsed.delta
                    })}\n\n`);
                  } else if (parsed.type === 'response.completed') {
                    safeEnqueue(`data: ${JSON.stringify({ 
                      type: 'complete', 
                      message: '✅ Search completed!',
                      fullContent: fullContent
                    })}\n\n`);
                    safeClose();
                    return;
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
              message: '✅ Search completed!',
              fullContent: fullContent
            })}\n\n`);
            safeClose();
          }
          
        } catch (error) {
          console.error('Streaming error:', error);
          if (!isClosed) {
            safeEnqueue(`data: ${JSON.stringify({ 
              type: 'error', 
              message: `Search failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
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
    console.error('Web search error:', error);
    return NextResponse.json(
      { error: 'Failed to perform web search' },
      { status: 500 }
    );
  }
} 