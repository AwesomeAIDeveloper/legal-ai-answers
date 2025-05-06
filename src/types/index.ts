
export interface LegalTopic {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  prompt_template: string;
  created_at: string;
  updated_at: string;
}

export interface LegalQuery {
  id: string;
  user_id: string | null;
  topic_id: string | null;
  query_text: string;
  query_document_url: string | null;
  ai_summary: string | null;
  ai_detailed_advice: string | null;
  legal_letter_url: string | null;
  is_paid: boolean;
  payment_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  is_subscribed: boolean;
  subscription_tier: string | null;
  subscription_ends_at: string | null;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}
