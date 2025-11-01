-- Insert sample conversations for testing
INSERT INTO conversations (
  organization_id,
  campaign_id,
  ai_agent_id,
  agent_name,
  conversation_type,
  call_transcript,
  email_content,
  status,
  metadata,
  lead
) VALUES 
(
  '1',
  'campaign-1',
  'agent-1',
  'Sales Qualifier',
  'email',
  NULL,
  'Hi John! I noticed you downloaded our pricing guide. I''m Sarah, an AI assistant from Connected Sensors Demo. How can I help you today?',
  'active',
  '{
    "messages": [
      {
        "id": "1",
        "sender": "ai",
        "content": "Hi John! I noticed you downloaded our pricing guide. I''m Sarah, an AI assistant from Connected Sensors Demo. How can I help you today?",
        "timestamp": "2025-01-21T09:00:00Z"
      },
      {
        "id": "2",
        "sender": "user",
        "content": "Hi Sarah! Yes, I''m interested in your platform for our sales team. Can you tell me more about the enterprise features?",
        "timestamp": "2025-01-21T09:15:00Z"
      },
      {
        "id": "3",
        "sender": "ai",
        "content": "Our enterprise plan includes advanced AI agents, unlimited campaigns, custom integrations, and dedicated support. What size is your sales team?",
        "timestamp": "2025-01-21T09:16:00Z"
      },
      {
        "id": "4",
        "sender": "user",
        "content": "We have about 25 sales reps. The AI agents sound interesting - how do they work exactly?",
        "timestamp": "2025-01-21T09:30:00Z"
      },
      {
        "id": "5",
        "sender": "ai",
        "content": "Great question! Our AI agents can automatically qualify leads, schedule meetings, and follow up with prospects. They''re trained on your specific sales process and can handle initial conversations 24/7. Would you like to see a demo?",
        "timestamp": "2025-01-21T09:31:00Z"
      },
      {
        "id": "6",
        "sender": "user",
        "content": "Thanks for the information. I''d like to schedule a demo for next week.",
        "timestamp": "2025-01-21T10:30:00Z"
      }
    ]
  }',
  '{
    "contact_name": "John Smith",
    "email": "john@acme.com",
    "company_name": "Acme Corporation",
    "phone": "+1-555-0123"
  }'
),
(
  '1',
  'campaign-2',
  'agent-2',
  'Follow-up Agent',
  'phone',
  'Hi Sarah! This is Alex from Connected Sensors Demo. I tried calling you earlier but missed you. What''s the best time to connect?',
  NULL,
  'completed',
  '{
    "messages": [
      {
        "id": "1",
        "sender": "ai",
        "content": "Hi Sarah! This is Alex from Connected Sensors Demo. I tried calling you earlier but missed you. What''s the best time to connect?",
        "timestamp": "2025-01-21T08:00:00Z"
      },
      {
        "id": "2",
        "sender": "user",
        "content": "Hi Alex! Sorry I missed your call. I''m available most afternoons this week. What did you want to discuss?",
        "timestamp": "2025-01-21T08:30:00Z"
      },
      {
        "id": "3",
        "sender": "ai",
        "content": "No worries! I wanted to follow up on your interest in our sales automation platform. Would Thursday at 2 PM work for a quick 15-minute call?",
        "timestamp": "2025-01-21T08:31:00Z"
      },
      {
        "id": "4",
        "sender": "user",
        "content": "Thursday at 2 PM works perfectly!",
        "timestamp": "2025-01-21T09:00:00Z"
      },
      {
        "id": "5",
        "sender": "ai",
        "content": "Perfect! I''ve sent you the calendar link.",
        "timestamp": "2025-01-21T09:15:00Z"
      }
    ]
  }',
  '{
    "contact_name": "Sarah Johnson",
    "email": "sarah@globex.com",
    "company_name": "Globex Industries",
    "phone": "+1-555-0456"
  }'
),
(
  '1',
  'campaign-3',
  'agent-1',
  'Sales Qualifier',
  'email',
  NULL,
  'Hello Bruce! I''m reaching out because Wayne Enterprises fits the profile of companies that benefit most from our AI sales platform. Do you have 2 minutes to chat?',
  'active',
  '{
    "messages": [
      {
        "id": "1",
        "sender": "ai",
        "content": "Hello Bruce! I''m reaching out because Wayne Enterprises fits the profile of companies that benefit most from our AI sales platform. Do you have 2 minutes to chat?",
        "timestamp": "2025-01-20T15:00:00Z"
      },
      {
        "id": "2",
        "sender": "user",
        "content": "Hi! Sure, I have a few minutes. What makes you think we''d be a good fit?",
        "timestamp": "2025-01-20T15:30:00Z"
      },
      {
        "id": "3",
        "sender": "ai",
        "content": "Wayne Enterprises has a large sales organization, and I noticed you''re expanding globally. Our AI agents can help scale your sales efforts without proportionally increasing headcount. We''ve helped similar companies increase qualified leads by 300%.",
        "timestamp": "2025-01-20T15:31:00Z"
      },
      {
        "id": "4",
        "sender": "user",
        "content": "That''s impressive. Can you send me a detailed proposal with pricing for our size organization?",
        "timestamp": "2025-01-20T16:00:00Z"
      },
      {
        "id": "5",
        "sender": "ai",
        "content": "I''ll prepare a custom proposal for Wayne Enterprises and send it over by end of day. It will include pricing, implementation timeline, and ROI projections based on your company size.",
        "timestamp": "2025-01-20T16:01:00Z"
      },
      {
        "id": "6",
        "sender": "user",
        "content": "Sounds good, I''ll review the proposal and get back to you.",
        "timestamp": "2025-01-20T16:45:00Z"
      }
    ]
  }',
  '{
    "contact_name": "Bruce Wayne",
    "email": "bruce@wayne.com",
    "company_name": "Wayne Enterprises",
    "phone": "+1-555-0789"
  }'
);
