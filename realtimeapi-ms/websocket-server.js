const WebSocket = require('ws');
const https = require('https');
require('dotenv').config();

// Create WebSocket server on port 9000
const wss = new WebSocket.Server({ port: 9000 });

console.log('WebSocket server running on ws://localhost:9000');

wss.on('connection', function connection(clientWs) {
  console.log('Client connected');
  
  // Check if API key is loaded
  if (!process.env.OPENAI_API_KEY) {
    console.error('OPENAI_API_KEY not found in environment variables');
    clientWs.close();
    return;
  }
  
  console.log('API Key loaded:', process.env.OPENAI_API_KEY.substring(0, 20) + '...');

  // Add a small delay before connecting to OpenAI to ensure client is ready
  setTimeout(() => {
    // Create connection to OpenAI Realtime API
    const openaiWs = new WebSocket('wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01', {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'OpenAI-Beta': 'realtime=v1'
      }
    });

    // Handle OpenAI connection
    openaiWs.on('open', function open() {
      console.log('Connected to OpenAI Realtime API');
    });

    // Handle messages from OpenAI
    openaiWs.on('message', (data) => {
      try {
        const parsed = JSON.parse(data);
        console.log('🤖 OpenAI message type:', parsed.type);
        
        if (parsed.type === 'session.updated') {
          console.log('🎉 OpenAI confirmed session update');
          console.log('  - Session ID:', parsed.session?.id);
          console.log('  - Modalities:', parsed.session?.modalities);
          console.log('  - Voice:', parsed.session?.voice);
        } else if (parsed.type === 'error') {
          console.error('❌ OpenAI error:', parsed.error);
        } else if (parsed.type === 'session.created') {
          console.log('✅ OpenAI session created');
          console.log('  - Session ID:', parsed.session?.id);
        }
        
        // Forward OpenAI messages to client
        if (clientWs.readyState === WebSocket.OPEN) {
          console.log('📤 Forwarding to client:', parsed.type);
          clientWs.send(data);
        } else {
          console.error('❌ Client WebSocket not ready, message dropped:', parsed.type);
        }
      } catch (error) {
        console.error('❌ Error processing OpenAI message:', error);
        console.error('Raw data:', data.toString());
      }
    });

    openaiWs.on('close', function close(code, reason) {
      console.log('OpenAI connection closed:', code, reason.toString());
      console.log('Close code explanation:');
      switch(code) {
        case 1000: console.log('  - Normal closure'); break;
        case 1001: console.log('  - Going away'); break;
        case 1002: console.log('  - Protocol error'); break;
        case 1003: console.log('  - Unsupported data'); break;
        case 1005: console.log('  - No status received (abnormal closure)'); break;
        case 1006: console.log('  - Abnormal closure'); break;
        case 1007: console.log('  - Invalid frame payload data'); break;
        case 1008: console.log('  - Policy violation'); break;
        case 1009: console.log('  - Message too big'); break;
        case 1010: console.log('  - Mandatory extension'); break;
        case 1011: console.log('  - Internal server error'); break;
        default: console.log('  - Unknown code:', code);
      }
      
      // Only close client if it's still open
      if (clientWs.readyState === WebSocket.OPEN) {
        clientWs.close(code, reason);
      }
    });

    openaiWs.on('error', function error(err) {
      console.error('OpenAI WebSocket error:', err);
      console.error('Error details:', err.message);
      console.error('Full error object:', JSON.stringify(err, null, 2));
      
      // Send error to client before closing
      if (clientWs.readyState === WebSocket.OPEN) {
        clientWs.send(JSON.stringify({
          type: 'error',
          error: {
            message: err.message,
            code: err.code || 'WEBSOCKET_ERROR'
          }
        }));
        clientWs.close();
      }
    });

    // Handle client messages
    clientWs.on('message', function message(data) {
      let parsed = null;
      try {
        parsed = JSON.parse(data);
        console.log('📨 Client message type:', parsed.type);
        
        if (parsed.type === 'session.update') {
          console.log('🔧 Session update details:');
          console.log('  - Modalities:', parsed.session?.modalities);
          console.log('  - Voice:', parsed.session?.voice);
          console.log('  - Instructions length:', parsed.session?.instructions?.length);
          console.log('  - Audio formats:', parsed.session?.input_audio_format, '->', parsed.session?.output_audio_format);
          console.log('  - Turn detection:', parsed.session?.turn_detection?.type);
          console.log('  - Temperature:', parsed.session?.temperature);
          console.log('  - Max tokens:', parsed.session?.max_response_output_tokens);
          
          // Validate session structure
          if (!parsed.session) {
            console.error('❌ Invalid session.update: missing session object');
            return;
          }
          
          if (!parsed.session.modalities || !Array.isArray(parsed.session.modalities)) {
            console.error('❌ Invalid session.update: missing or invalid modalities');
            return;
          }
        }
      } catch (e) {
        console.log('📨 Received binary or malformed data from client');
      }
      
      // Forward client messages to OpenAI
      if (openaiWs.readyState === WebSocket.OPEN) {
        try {
          if (parsed) {
            console.log('📤 Forwarding to OpenAI:', parsed.type);
          } else {
            console.log('📤 Forwarding binary data to OpenAI');
          }
          openaiWs.send(data);
          console.log('✅ Message forwarded successfully');
        } catch (forwardError) {
          console.error('❌ Error forwarding to OpenAI:', forwardError);
        }
      } else {
        console.error('❌ OpenAI WebSocket not ready. State:', openaiWs?.readyState);
        console.error('   WebSocket.CONNECTING =', WebSocket.CONNECTING);
        console.error('   WebSocket.OPEN =', WebSocket.OPEN);
        console.error('   WebSocket.CLOSING =', WebSocket.CLOSING);
        console.error('   WebSocket.CLOSED =', WebSocket.CLOSED);
      }
    });

    clientWs.on('close', function close() {
      console.log('Client disconnected');
      if (openaiWs.readyState === WebSocket.OPEN) {
        openaiWs.close();
      }
    });

    clientWs.on('error', function error(err) {
      console.error('Client WebSocket error:', err);
      if (openaiWs.readyState === WebSocket.OPEN) {
        openaiWs.close();
      }
    });
  }, 50); // Small delay to ensure client is ready
}); 