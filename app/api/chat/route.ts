// File: app/api/chat/route.js
export async function POST(req :Request) {
  try {
    const { messages } = await req.json();
    
    // Get the last user message
    const lastUserMessage = messages[messages.length - 1];
    
    // Since we don't have the AI SDK integrated yet, 
    // here's a simple response function
    const getSimpleResponse = (userMessage : { content: string }) => {
      const content = userMessage.content.toLowerCase();
      
      if (content.includes("hello") || content.includes("hi")) {
        return "Hello! How can I assist you today?";
      }
      
      if (content.includes("machine learning")) {
        return "Machine learning is like teaching computers to learn from examples instead of explicitly programming them. Think of it as showing a child many pictures of dogs until they can recognize a dog on their own, rather than explaining all the features that make up a dog.";
      }
      
      if (content.includes("poem")) {
        return "Digital dreams in silicon sleep,\nWhispers of code that silently speak.\nIn circuits and wires, a new world grows,\nA future that only technology knows.";
      }
      
      if (content.includes("web development") || content.includes("best practices")) {
        return "Current web development best practices include: 1) Using responsive design for all devices, 2) Optimizing performance with code splitting and lazy loading, 3) Ensuring accessibility standards are met, 4) Implementing proper security measures, and 5) Using component-based architectures like React or Vue.";
      }
      
      return "Thank you for your message. When you integrate with a real AI model, you'll get more thoughtful responses here!";
    };
    
    // In a real implementation, you would call your AI service here
    // For now, we're using a simple function to generate responses
    const responseContent = getSimpleResponse(lastUserMessage);
    
    // Adding a small delay to simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return new Response(JSON.stringify({
      content: responseContent
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(JSON.stringify(
      { error: 'An error occurred during the conversation' }
    ), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}