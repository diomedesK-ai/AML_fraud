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

          // Use OpenAI Responses API for web search with streaming
          const response = await fetch('http://localhost:5001/api/openai-responses', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              prompt: `Search for: ${query}`,
              stream: true
            }),
          });

          if (!response.ok) {
            throw new Error('OpenAI Responses API failed');
          }

          // Handle streaming response
          const reader = response.body?.getReader();
          if (!reader) {
            throw new Error('No response body');
          }

          const decoder = new TextDecoder();
          let buffer = '';
          let hasContent = false;

          while (true && !isClosed) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              if (line.startsWith('data: ') && !isClosed) {
                const data = line.slice(6);
                if (data === '[DONE]') {
                  safeEnqueue(`data: ${JSON.stringify({ 
                    type: 'complete', 
                    message: '✅ Search completed!' 
                  })}\n\n`);
                  safeClose();
                  return;
                }

                try {
                  const parsed = JSON.parse(data);
                  
                  // Check for content in the response
                  if (parsed.type === 'response.output_text.delta' && parsed.delta) {
                    hasContent = true;
                    safeEnqueue(`data: ${JSON.stringify({
                      type: 'content',
                      text: parsed.delta
                    })}\n\n`);
                  } else if (parsed.type === 'response.completed') {
                    safeEnqueue(`data: ${JSON.stringify({ 
                      type: 'complete', 
                      message: '✅ Search completed!' 
                    })}\n\n`);
                    safeClose();
                    return;
                  } else {
                    // Forward other streaming data
                    safeEnqueue(`data: ${JSON.stringify({
                      type: 'chunk',
                      data: parsed
                    })}\n\n`);
                  }
                } catch (e) {
                  // Skip invalid JSON
                }
              }
            }
          }

          // Only send completion if we haven't already
          if (!hasContent && !isClosed) {
            safeEnqueue(`data: ${JSON.stringify({ 
              type: 'complete', 
              message: '✅ Search completed!' 
            })}\n\n`);
          }
          
          // Close after a small delay to ensure all data is sent
          setTimeout(() => safeClose(), 100);
          
        } catch (error) {
          console.error('Streaming error:', error);
          if (!isClosed) {
            safeEnqueue(`data: ${JSON.stringify({ 
              type: 'error', 
              message: 'Search failed' 
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