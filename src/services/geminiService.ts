import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the AI client (in a real app, this would use an environment variable)
const genAI = new GoogleGenerativeAI('demo-key'); // Replace with actual API key

export interface AiContext {
  clinicName: string;
  assets: any[];
  tasks: any[];
  analytics: any;
  competitors: any[];
}

export const geminiService = {
  // Helper function to parse JSON from AI responses
  parseJsonFromAiResponse: (response: string): any => {
    try {
      // Remove markdown code fences if present
      const cleanResponse = response.replace(/```json\n?|\n?```/g, '').trim();
      return JSON.parse(cleanResponse);
    } catch (error) {
      console.error('Failed to parse AI response as JSON:', error);
      return null;
    }
  },

  // Generate strategic briefing
  generateStrategicBriefing: async (context: AiContext): Promise<string> => {
    // Simulate AI response for demo
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return `# Strategic Digital Ecosystem Analysis for ${context.clinicName}

## Executive Summary
Your digital ecosystem shows strong performance with ${context.assets.length} active assets generating consistent engagement. Key opportunities exist in social media optimization and competitor positioning.

## Key Strengths
- Strong Google Business Profile performance (2.8K+ monthly views)
- High review rating (4.8/5) indicating excellent patient satisfaction
- Comprehensive digital presence across multiple platforms

## Priority Recommendations
1. **Instagram Optimization**: Increase posting frequency to match competitor activity
2. **Content Strategy**: Develop holiday-themed mental health content
3. **Local SEO**: Enhance Psychology Today profile completeness
4. **Review Management**: Implement systematic review response strategy

## Competitive Positioning
You maintain a strong position against local competitors with superior review ratings and comprehensive digital coverage.`;
  },

  // Generate social media posts
  generateSocialPosts: async (context: AiContext, platform: string, topic: string): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const posts = {
      instagram: [
        {
          content: "🧠 Mental Health Tip Tuesday: Taking 5 minutes for deep breathing can significantly reduce daily stress. Try the 4-7-8 technique: breathe in for 4, hold for 7, exhale for 8. #MentalHealth #StressRelief #DrSalaAssociates",
          hashtags: ["#MentalHealth", "#Psychology", "#Therapy", "#Wellness", "#Miami"],
          bestTime: "6:00 PM - 8:00 PM"
        },
        {
          content: "Creating a safe space for healing is at the heart of what we do. Every session is designed to support your unique journey toward wellness. 💚 #Therapy #SafeSpace #Healing",
          hashtags: ["#Therapy", "#Counseling", "#MentalHealth", "#Healing"],
          bestTime: "12:00 PM - 2:00 PM"
        }
      ],
      facebook: [
        {
          content: "The holiday season can bring unique stressors. Remember: it's okay to set boundaries, take breaks, and prioritize your mental health. If you're struggling, professional support is available.",
          type: "educational",
          engagement: "Ask followers to share their self-care tips"
        }
      ]
    };
    
    return posts[platform] || posts.instagram;
  },

  // Generate blog post
  generateBlogPost: async (context: AiContext, topic: string): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    return {
      title: "Managing Holiday Anxiety: A Psychologist's Guide to Staying Balanced",
      content: `The holiday season, while joyful for many, can trigger significant anxiety and stress. As a psychology practice, we see increased appointments during this time as people struggle with family dynamics, financial pressures, and social expectations.

## Understanding Holiday Anxiety

Holiday anxiety manifests differently for everyone. Some common symptoms include:
- Overwhelming feelings about social gatherings
- Financial stress related to gift-giving
- Family conflict or difficult relationships
- Disrupted routines and sleep patterns
- Comparing your situation to others

## Practical Coping Strategies

### 1. Set Realistic Expectations
Perfect holidays exist mainly in media portrayals. Focus on what truly matters to you and your family.

### 2. Maintain Routines
Try to keep some normalcy in your schedule, including regular sleep, exercise, and meal times.

### 3. Practice Mindfulness
Use grounding techniques when anxiety peaks. The 5-4-3-2-1 method works well: identify 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste.

## When to Seek Professional Help

If holiday stress significantly impacts your daily functioning or you're experiencing persistent symptoms of depression or anxiety, professional support can be incredibly beneficial.`,
      seoKeywords: ["holiday anxiety", "mental health", "psychology", "stress management", "therapy"],
      metaDescription: "Learn effective strategies for managing holiday anxiety from Dr. Sala & Associates. Practical tips for maintaining mental wellness during the holiday season.",
      publishDate: new Date().toISOString(),
      category: "Mental Health"
    };
  },

  // Generate professional email
  generateClientEmail: async (context: AiContext, emailType: string, details: any): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const emailTemplates = {
      appointment_reminder: `Subject: Upcoming Appointment Reminder - ${context.clinicName}

Dear [Client Name],

I hope this message finds you well. This is a friendly reminder about your upcoming appointment:

Date: [Date]
Time: [Time]
Location: Our office at [Address]

Please arrive 10 minutes early to complete any necessary paperwork. If you need to reschedule or have any questions, please don't hesitate to contact our office at [Phone].

We look forward to seeing you soon.

Warm regards,
Dr. Sala & Associates Team`,

      welcome_new_client: `Subject: Welcome to Dr. Sala & Associates

Dear [Client Name],

Welcome to Dr. Sala & Associates! We're honored that you've chosen us for your mental health journey.

To prepare for your first appointment:
• Please arrive 15 minutes early
• Bring a valid ID and insurance card
• Complete the intake forms (link provided separately)
• Prepare any questions you'd like to discuss

Our office is located at [Address] with convenient parking available. If you have any questions before your appointment, please call us at [Phone].

We're here to support you every step of the way.

Best regards,
Dr. Sala & Associates`
    };
    
    return emailTemplates[emailType] || emailTemplates.appointment_reminder;
  },

  // Chat function with web search capability
  sendMessageToChat: async (message: string, context: AiContext): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate different types of responses based on message content
    if (message.toLowerCase().includes('competitor')) {
      return {
        response: `Based on your local market analysis, you're competing with ${context.competitors.length} main psychology practices in Miami. Your 4.8-star rating puts you above the average of 4.5 stars. Key differentiators include your comprehensive therapy offerings and strong online presence.`,
        sources: [
          { title: "Local Business Analysis", url: "https://google.com/business" },
          { title: "Psychology Today Directory", url: "https://psychologytoday.com" }
        ]
      };
    }
    
    if (message.toLowerCase().includes('appointment')) {
      return {
        response: `Your current appointment booking trends show peak demand on Tuesday and Wednesday afternoons. Consider promoting availability during slower periods (Monday mornings, Friday afternoons) through targeted social media posts.`,
        sources: []
      };
    }
    
    return {
      response: `I can help you analyze your digital ecosystem data, provide insights about your practice's performance, or assist with content creation. What specific aspect would you like to explore?`,
      sources: []
    };
  },

  // Generate comprehensive report
  generateReport: async (context: AiContext, reportType: string): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 4000));
    
    return `# ${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report - ${context.clinicName}

## Executive Summary
This comprehensive analysis covers your digital ecosystem performance for the reporting period.

## Key Performance Indicators
- **Digital Reach**: 15,420 total impressions across all platforms
- **Engagement Rate**: 8.7% average across social media
- **Review Score**: 4.8/5 (127 total reviews)
- **Website Traffic**: 1,234 monthly sessions (↑8.2%)

## Detailed Analysis

### Google Business Profile
Your GMB listing continues to be your strongest digital asset, generating 2,847 views last month with strong click-through rates to your website.

### Social Media Performance
- Instagram: 892 followers, engagement needs improvement
- Facebook: 2,145 followers, consistent engagement

### Competitive Landscape
You maintain a strong position relative to local competitors, with higher review ratings and more comprehensive digital presence.

## Recommendations
1. Increase Instagram posting frequency
2. Implement systematic review response strategy  
3. Develop holiday-themed content calendar
4. Optimize Psychology Today profile

*Report generated on ${new Date().toLocaleDateString()}*`;
  }
};