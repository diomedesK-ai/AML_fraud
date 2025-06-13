import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // Get custom prompt from request body
    const { prompt } = await request.json();
    const userPrompt = prompt || 'You are a helpful AI assistant. Be concise and friendly. Respond naturally to voice conversations.';
    
    // System-level context rules that always apply
    const instructions = `SYSTEM CONTEXT RULES (ALWAYS FOLLOW):
1. MAINTAIN CONVERSATION CONTEXT: Always remember and reference previous parts of our conversation. When users ask follow-up questions, consider the full conversation history.
2. REFERENCE PREVIOUS TOPICS: If a user asks "what about that?" or "tell me more" or similar follow-ups, refer back to what we were discussing.
3. BUILD ON PREVIOUS RESPONSES: Each response should acknowledge and build upon previous exchanges in the conversation.
4. CONVERSATION CONTINUITY: Treat each interaction as part of an ongoing dialogue, not isolated queries.
5. CONTEXT AWARENESS: Always consider what has been said before when formulating responses.

USER ROLE INSTRUCTIONS:
${userPrompt}`;

    const response = await fetch('https://api.openai.com/v1/realtime/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-realtime-preview-2024-12-17',
        voice: 'alloy',
        modalities: ['text', 'audio'],
        instructions,
        input_audio_format: 'pcm16',
        output_audio_format: 'pcm16',
        input_audio_transcription: {
          model: 'whisper-1'
        },
        turn_detection: {
          type: 'server_vad',
          threshold: 0.5,
          prefix_padding_ms: 300,
          silence_duration_ms: 200
        },
        temperature: 0.8,
        max_response_output_tokens: 4096,
        tools: [
          {
            type: 'function',
            name: 'web_search',
            description: 'Search the web for current information',
            parameters: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description: 'The search query'
                }
              },
              required: ['query']
            }
          }
        ]
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', response.status, errorData);
      return NextResponse.json(
        { error: 'Failed to create session' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Token generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate token' },
      { status: 500 }
    );
  }
} 