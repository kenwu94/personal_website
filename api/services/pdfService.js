const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
require('dotenv').config();

class PDFService {
  constructor() {
    this.pdfContent = {};
    this.embeddingsCache = {};
  }

  async loadPDFs(directory = path.join(__dirname, '../pdfs')) {
    try {
      // Ensure directory exists
      if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
        console.log(`Created PDF directory: ${directory}`);
        return [];
      }
      
      // Read all PDFs in directory
      const files = fs.readdirSync(directory).filter(file => file.endsWith('.pdf'));
      
      if (files.length === 0) {
        console.log('No PDFs found in directory');
        return [];
      }
      
      // Process each PDF
      for (const file of files) {
        const filePath = path.join(directory, file);
        try {
          const dataBuffer = fs.readFileSync(filePath);
          const pdfData = await pdfParse(dataBuffer);
          
          // Store parsed content with filename as key
          const fileName = path.basename(file, '.pdf');
          this.pdfContent[fileName] = pdfData.text;
          
          console.log(`Loaded PDF: ${file}, characters: ${pdfData.text.length}`);
        } catch (err) {
          console.error(`Failed to parse PDF ${file}:`, err);
        }
      }
      
      return Object.keys(this.pdfContent);
    } catch (error) {
      console.error('Error loading PDFs:', error);
      return [];
    }
  }

  getContent(name) {
    return this.pdfContent[name] || null;
  }

  getAllContent() {
    return Object.entries(this.pdfContent).map(([name, content]) => ({
      name,
      content: content.substring(0, 300) + '...' // Preview only
    }));
  }

  async getRelevantContent(query) {
    try {
      // Use OpenAI to extract relevant information from PDFs based on query
      const allContent = {};
      for (const [name, content] of Object.entries(this.pdfContent)) {
        allContent[name] = content;
      }

      // If there's no content, return empty results
      if (Object.keys(allContent).length === 0) {
        console.log('No PDF content available');
        return [];
      }

      // Use OpenAI to analyze query and extract relevant information
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo-16k",
          messages: [
            {
              role: "system",
              content: `You are an information retrieval assistant. Your task is to:
              1. Analyze the user's query
              2. Identify which document(s) contain relevant information
              3. Extract ONLY the specific information from those documents that relates to the query
              4. Format your response as JSON only with no explanations
              
              Available documents:
              ${Object.entries(allContent).map(([name, _]) => `- ${name}`).join("\n")}
              
              Respond with JSON in this format:
              {
                "relevantInformation": [
                  {
                    "source": "document_name",
                    "content": "The extracted relevant information that answers the query",
                    "relevance": 0.9 // relevance score between 0 and 1
                  }
                ]
              }
              
              If you find nothing relevant, return an empty array for relevantInformation.`
            },
            {
              role: "user",
              content: `Here's the user query: "${query}"\n\nDocument contents:\n${Object.entries(allContent).map(([name, content]) => `---${name}---\n${content.substring(0, 15000)}`).join("\n\n")}`
            }
          ],
          temperature: 0.3,
          response_format: { type: "json_object" }
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      
      try {
        const parsedResponse = JSON.parse(data.choices[0].message.content);
        return parsedResponse.relevantInformation || [];
      } catch (err) {
        console.error("Failed to parse OpenAI JSON response", err);
        return [];
      }
    } catch (error) {
      console.error('Error retrieving relevant content:', error);
      return [];
    }
  }
}

module.exports = new PDFService();