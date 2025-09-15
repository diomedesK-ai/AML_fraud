# Web Search Debug Instructions

## Issue Diagnosed
The web search functionality IS implemented but may not be triggering. Here's what I've done to fix it:

## 🔧 Changes Made

1. **Enhanced Wealth Advisor Prompt** - Added explicit web search instructions:
   - ALWAYS search for current market data, rates, financial news
   - IMMEDIATELY use web_search for market conditions
   - Clear instructions to search online for real-time data

2. **Added Debug Logging**:
   - Function call detection logging
   - Web search API response status logging
   - Visible search messages in main chat

3. **Improved Error Handling**:
   - Better error messages for web search failures
   - Console logging for debugging

## 🧪 How to Test

1. **Start a voice call**
2. **Ask a market-related question** like:
   - "What are the current interest rates?"
   - "What's happening in the stock market today?"
   - "Check the latest EUR/USD exchange rate"
   - "Search for recent Fed policy updates"

3. **Watch the console** for these messages:
   - `🔧 Function call detected: web_search`
   - `🌐 AI is searching the web for: [query]`
   - `🚀 Starting web search for: [query]`
   - `📡 Web search API response status: 200`

4. **Look for visual indicators**:
   - "🔍 Searching the web for..." message in chat
   - Search progress in call transcript

## 🚨 Potential Issues to Check

### 1. Environment Variables
Make sure these are set in `.env`:
```
OPENAI_API_KEY=your_key_here
```

### 2. API Rate Limits
- OpenAI API might be rate limited
- Web search API (internal) might be slow

### 3. Prompt Not Triggering Search
Try being MORE explicit:
- "Search the web for current Bitcoin prices"
- "Look up online the latest Federal Reserve rates"
- "Check online what happened to Tesla stock today"

### 4. Function Not Registered
Check browser console for any errors during session creation

## 🎯 Expected Behavior

When working correctly, you should see:
1. User asks about current market info
2. AI responds with "Let me search for current information..."
3. Console shows function call detection
4. Search progress appears in transcript
5. Results stream back in real-time
6. AI provides updated response with current data

## 🔍 Browser Console Commands

To debug manually, open browser console and check:
```javascript
// Check if WebSocket is connected
console.log('WebSocket ready state:', [your websocket variable]);

// Check if functions are properly configured
console.log('Session tools:', [session configuration]);
```

If web search still doesn't work after these changes, the issue might be:
- OpenAI API key permissions
- Network connectivity 
- Rate limiting
- AI model not recognizing the search triggers

Try the explicit search phrases above and check browser console for error messages.

