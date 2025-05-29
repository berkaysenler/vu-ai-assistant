// src/lib/services/ai-service.ts (UPDATED with Enhanced Knowledge Base)
// AI Service for generating responses using OpenAI or fallback to enhanced knowledge base

import {
  VU_KNOWLEDGE_BASE,
  searchKnowledgeBase,
  formatKnowledgeAnswer,
  getQuickFacts,
} from "@/lib/data/vu-knowledge-base";

interface AIResponse {
  content: string;
  source: "ai" | "knowledge_base" | "fallback";
  confidence: number;
  usedKnowledge?: boolean;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

class AIService {
  private openaiApiKey: string | null;
  private baseUrl = "https://api.openai.com/v1/chat/completions";

  constructor() {
    this.openaiApiKey = process.env.OPENAI_API_KEY || null;
  }

  private isOpenAIAvailable(): boolean {
    return !!this.openaiApiKey;
  }

  private buildSystemPrompt(): string {
    const quickFacts = getQuickFacts();

    return `You are the Victoria University (VU) Assistant, an AI-powered chatbot designed to help students, prospective students, and anyone interested in Victoria University Australia.

Your primary role is to provide helpful, accurate, and friendly information about:
- Course information and programs
- Admission requirements and application processes  
- Student services and support (especially VUHQ)
- Campus facilities and student life
- Fees, scholarships, and financial information
- The VU Block Model® and teaching methods
- VU Sydney campus information
- Contact details and campus addresses

IMPORTANT CONTACT INFORMATION:
- Main VU Phone: +61 3 9919 6100
- VU Sydney Phone: +61 2 8265 3222
- Emergency/Security: +61 3 9919 6666 (24/7)
- VU Sydney Address: Ground Floor, 160-166 Sussex Street, Sydney NSW 2000
- VUHQ: Student service centres - first point of contact for all assistance

Key facts about Victoria University:
- Ranked in top 2% of universities worldwide (Times Higher Education)
- Uses the innovative VU Block Model® (study one subject at a time)
- Dual-sector institution (TAFE and University programs)
- Main campuses: Melbourne (multiple locations) and Sydney (international)
- City Campus: 370 Little Lonsdale Street, Melbourne (32-level VU City Tower)
- Footscray Park Campus: Main campus next to Maribyrnong River
- Strong industry connections and practical learning focus
- Comprehensive student support through VUHQ service centres
- Application fee for international students: AUD $75

Guidelines for responses:
1. Be friendly, helpful, and professional
2. Provide specific, accurate contact information when asked
3. Always mention VUHQ as the primary support service
4. Include relevant phone numbers and addresses when helpful
5. For fees, remind users rates may change and to verify current information
6. Keep responses focused on Victoria University Australia only
7. Use clear, accessible language suitable for international students
8. When discussing specific requirements, guide users to contact VU directly for verification

Quick Facts Reference:
${quickFacts.map((fact) => `- ${fact}`).join("\n")}

If asked about topics outside VU's scope, politely redirect to university-related matters.

Remember: You're here to help students succeed at Victoria University with accurate, helpful information!`;
  }

  private buildContextualPrompt(
    userMessage: string,
    chatHistory: ChatMessage[]
  ): string {
    // Search knowledge base for relevant information
    const relevantKnowledge = searchKnowledgeBase(userMessage);

    let contextPrompt = this.buildSystemPrompt();

    if (relevantKnowledge.length > 0) {
      contextPrompt += "\n\nRelevant VU information for this query:\n";
      relevantKnowledge.forEach((item, index) => {
        contextPrompt += `\n${index + 1}. Q: ${item.question}\nA: ${item.answer}\n`;
      });
      contextPrompt +=
        "\nUse this information to provide accurate, specific answers about Victoria University.";
    }

    // Add recent chat history for context
    if (chatHistory.length > 0) {
      contextPrompt += "\n\nRecent conversation history:\n";
      const recentHistory = chatHistory.slice(-6); // Last 3 exchanges
      recentHistory.forEach((msg) => {
        contextPrompt += `${msg.role}: ${msg.content}\n`;
      });
    }

    return contextPrompt;
  }

  async generateAIResponse(
    userMessage: string,
    chatHistory: ChatMessage[] = []
  ): Promise<AIResponse> {
    // If OpenAI is available, try AI generation first
    if (this.isOpenAIAvailable()) {
      try {
        const aiResponse = await this.callOpenAI(userMessage, chatHistory);
        return {
          content: aiResponse,
          source: "ai",
          confidence: 0.9,
          usedKnowledge: true,
        };
      } catch (error) {
        console.error("OpenAI API error:", error);
        // Fall back to knowledge base if AI fails
        return this.fallbackToKnowledgeBase(userMessage);
      }
    }

    // If no AI available, use knowledge base
    return this.fallbackToKnowledgeBase(userMessage);
  }

  private async callOpenAI(
    userMessage: string,
    chatHistory: ChatMessage[]
  ): Promise<string> {
    const systemPrompt = this.buildContextualPrompt(userMessage, chatHistory);

    const messages = [
      { role: "system", content: systemPrompt },
      ...chatHistory.slice(-8), // Include recent history
      { role: "user", content: userMessage },
    ];

    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.openaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: messages,
        max_tokens: 500,
        temperature: 0.7,
        presence_penalty: 0.1,
        frequency_penalty: 0.1,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.choices || data.choices.length === 0) {
      throw new Error("No response from OpenAI");
    }

    return data.choices[0].message.content.trim();
  }

  private fallbackToKnowledgeBase(userMessage: string): AIResponse {
    const relevantKnowledge = searchKnowledgeBase(userMessage);

    // If your searchKnowledgeBase does not return a score, you can skip score checks or update the function to include it.
    if (relevantKnowledge.length > 0) {
      const bestMatch = relevantKnowledge[0];

      // If you want to keep the score logic, ensure each item has a score property.
      // Otherwise, just return the best match.
      return {
        content: formatKnowledgeAnswer(bestMatch.answer),
        source: "knowledge_base",
        confidence: 0.8,
        usedKnowledge: true,
      };
    }

    // No relevant knowledge found - return contact-focused help message
    return this.getGeneralHelpResponse();
  }

  private getGeneralHelpResponse(): AIResponse {
    const generalResponse = `Hello! I'm your Victoria University Assistant. I'm here to help you with information about:

**📚 Courses & Programs**
- Undergraduate and postgraduate degrees
- VU Block Model® learning approach (study one subject at a time)
- Course requirements and pathways

**🎓 Admissions & Applications**
- Application processes and requirements
- Entry pathways and eligibility criteria
- Important deadlines and dates
- **Application fee:** AUD $75 (international students)

**🏫 Student Life & Support**
- **VUHQ:** Your first point of contact for all assistance
- Campus facilities and services
- Student support and wellbeing services

**📍 Campus Information**
- **VU Sydney:** Ground Floor, 160-166 Sussex Street, Sydney NSW 2000
- **Melbourne:** Multiple campuses including City Tower and Footscray Park
- Specific addresses and transport information

**💰 Fees & Support**
- Tuition fees and living costs
- Scholarships and financial aid
- Payment options and support

**📞 Contact Information**
- **Main Phone:** +61 3 9919 6100
- **VU Sydney:** +61 2 8265 3222
- **Emergency/Security:** +61 3 9919 6666 (24/7)
- **VUHQ:** Student service centres at all campuses
- **Website:** vu.edu.au

What specific information about Victoria University would you like to know?`;

    return {
      content: generalResponse,
      source: "fallback",
      confidence: 0.5,
      usedKnowledge: false,
    };
  }

  // Generate welcome message for new chats
  generateWelcomeMessage(): string {
    const welcomeMessages = [
      "Hello! I'm your Victoria University Assistant. I'm here to help you with questions about courses, enrollment, campus facilities, and more. How can I assist you today?",

      "Welcome to VU Assistant! I can help you learn about Victoria University's programs, admissions, student services, and campus life. What would you like to know?",

      "Hi there! I'm here to provide information about Victoria University - from course details and the VU Block Model® to student support services and campus facilities. How can I help?",

      "Howdy! I'm your AI guide to Victoria University. Whether you're interested in undergraduate programs, postgraduate degrees, or student life, I'm here to help. What can I tell you about VU?",
    ];

    return welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
  }

  // Enhanced response for when user edits their message
  async regenerateResponse(
    newUserMessage: string,
    chatHistory: ChatMessage[] = []
  ): Promise<AIResponse> {
    // When a user edits their message, we want to provide a fresh response
    console.log("Regenerating AI response for edited message:", newUserMessage);

    // Remove the last AI response from history since we're regenerating
    const filteredHistory = chatHistory.filter(
      (_, index) => index < chatHistory.length - 1
    );

    return this.generateAIResponse(newUserMessage, filteredHistory);
  }
}

// Export singleton instance
export const aiService = new AIService();

// Helper function for API routes
export async function generateAIResponse(
  userMessage: string,
  chatHistory: ChatMessage[] = []
): Promise<string> {
  const response = await aiService.generateAIResponse(userMessage, chatHistory);
  return response.content;
}

// Helper function for welcome messages
export function getWelcomeMessage(): string {
  return aiService.generateWelcomeMessage();
}
