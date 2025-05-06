
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Create a Supabase client with the Auth context of the function
const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? '',
);

async function generateResponse(queryText: string, topicId?: string) {
  try {
    // In a real implementation, you would use OpenAI or another AI service
    const { data: topic } = await supabaseClient
      .from('legal_topics')
      .select('prompt_template')
      .eq('id', topicId)
      .single();

    // Mock AI response - in production replace with actual OpenAI API call
    const summary = `Based on the information provided, it appears you're dealing with a legal issue related to ${topicId ? 'a specific category' : 'general law'}. 

Here's a summary of your situation:
1. The facts you've presented suggest potential legal implications.
2. You may have certain rights under applicable laws.
3. There are several options available to you.

To get more detailed advice including specific legal provisions, remedies, and a formal legal assessment letter, consider upgrading to our full analysis.`;

    return { 
      success: true, 
      summary 
    };
  } catch (error) {
    console.error('Error generating AI response:', error);
    return { 
      success: false, 
      error: 'Failed to generate AI response' 
    };
  }
}

async function generateDetailedResponse(queryId: string) {
  try {
    // Get the query details
    const { data: query } = await supabaseClient
      .from('legal_queries')
      .select('query_text, topic_id, legal_topics(prompt_template)')
      .eq('id', queryId)
      .single();

    if (!query) {
      return { success: false, error: 'Query not found' };
    }

    // In a real implementation, you would use OpenAI or another AI service here
    const detailedAdvice = `# Detailed Legal Assessment

## Summary of Facts
Based on the information you provided, you're facing a situation regarding ${query.query_text.substring(0, 20)}...

## Legal Analysis
Under the applicable laws and regulations, your situation falls under [relevant legal framework].

The key considerations are:
1. Your rights include...
2. Potential remedies include...
3. Recommended next steps...

## Conclusion
Based on our analysis, you have several options to pursue. We recommend...

*Note: This is AI-generated legal information and should not substitute for professional legal advice.*`;

    // Update the query with the detailed advice
    await supabaseClient
      .from('legal_queries')
      .update({ 
        ai_detailed_advice: detailedAdvice,
        is_paid: true,
      })
      .eq('id', queryId);

    // Generate a legal letter URL (in production, this would create a PDF)
    const letterUrl = `https://example.com/legal-letter/${queryId}.pdf`;
    
    await supabaseClient
      .from('legal_queries')
      .update({
        legal_letter_url: letterUrl
      })
      .eq('id', queryId);

    return { 
      success: true, 
      detailedAdvice,
      letterUrl
    };
  } catch (error) {
    console.error('Error generating detailed response:', error);
    return { success: false, error: 'Failed to generate detailed response' };
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, queryText, queryId, topicId } = await req.json();

    if (action === 'generate_summary' && queryText) {
      const result = await generateResponse(queryText, topicId);
      return new Response(JSON.stringify(result), { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    } 
    else if (action === 'generate_detailed' && queryId) {
      const result = await generateDetailedResponse(queryId);
      return new Response(JSON.stringify(result), { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }
    else {
      return new Response(JSON.stringify({ error: 'Invalid action or missing parameters' }), { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { 
      status: 500, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }
});
