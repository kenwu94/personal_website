const express = require('express');
const router = express.Router();
const pdfService = require('./services/pdfService');
require('dotenv').config();

router.post('/', async (req, res) => {
  try {
    const { messages } = req.body;
    
    // Get the user's latest message
    const userMessage = messages.filter(msg => msg.role === 'user').pop();
    
    // Get relevant content from PDFs based on the user's query using OpenAI
    const relevantContent = await pdfService.getRelevantContent(userMessage.content);
    
    // Create a system message with context from PDFs
    let systemMessage = {
      role: "system",
      content: `You are an AI assistant representing the portfolio owner. Respond in first person as if you are the portfolio owner yourself, using "I", "my", "me", etc.

IMPORTANT RESPONSE STYLE:
- Keep responses brief and concise (2-3 sentences maximum) unless the user explicitly asks for more detail
- When the user asks for more detail or says things like "tell me more," "elaborate," or "explain further," then provide comprehensive information
- Be conversational but efficient with words

Base your responses on the information provided below. If asked about something not covered in this information, politely explain that you'd be happy to discuss that when you connect in person or via a meeting.

Information about me (Ken):
`
    };
    
    // Add relevant PDF content to system message
    if (relevantContent.length > 0) {
      relevantContent.forEach(item => {
        systemMessage.content += `\nFrom ${item.source}:\n${item.content}\n`;
      });
    } else {
      systemMessage.content += `\nI don't have specific information about that topic in my database. Feel free to ask about something else.`;
    }
    
    // Add additional instructions
    systemMessage.content += `\n\nAdditional guidelines:
- Keep initial responses short (2-3 sentences)
- Only provide detailed responses when explicitly asked
- Use first person perspective consistently
- Be direct and to the point
- For contact information requests, briefly direct to the contact section or LinkedIn
- For topics not in your knowledge base, be brief: "I'd be happy to discuss that when we connect. Feel free to ask about something else."`;
    
    // Call OpenAI API with system message + user messages
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [systemMessage, ...messages],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Send response back to client
    res.json({
      message: data.choices[0].message.content
    });
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ 
      error: 'Failed to process request',
      message: 'I encountered a technical issue. Please try again shortly.'
    });
  }
});

module.exports = router;