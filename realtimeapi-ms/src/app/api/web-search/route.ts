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

          // Use OpenAI Responses API directly for web search with streaming
          const openaiApiKey = process.env.OPENAI_API_KEY;
          if (!openaiApiKey) {
            throw new Error('OpenAI API key not configured');
          }

          const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${openaiApiKey}`,
            },
            body: JSON.stringify({
              model: 'gpt-4o',
              messages: [
                {
                  role: 'system',
                  content: 'You are a helpful AI assistant that can search the web for current information. When users ask you to search for something, provide comprehensive and accurate information based on your knowledge. Format your responses clearly with relevant details.'
                },
                {
                  role: 'user',
                  content: `Please search for and provide comprehensive information about: ${query}

Please provide:
1. A clear overview of the topic
2. Key facts and current information
3. Relevant details that would be helpful
4. Any important context or background

Format your response in a clear, organized manner.`
                }
              ],
              stream: true,
              temperature: 0.7,
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
                    message: '✅ Search completed!',
                    fullContent: fullContent
                  })}\n\n`);
                  safeClose();
                  return;
                }

                if (data === '') continue;

                try {
                  const parsed = JSON.parse(data);
                  
                  // Check for content in the response (OpenAI Chat Completions format)
                  if (parsed.choices && parsed.choices[0] && parsed.choices[0].delta && parsed.choices[0].delta.content) {
                    const content = parsed.choices[0].delta.content;
                    hasContent = true;
                    fullContent += content;
                    
                    safeEnqueue(`data: ${JSON.stringify({
                      type: 'content',
                      text: content
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