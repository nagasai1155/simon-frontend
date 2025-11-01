-- Create lead_research table to store research results
CREATE TABLE IF NOT EXISTS lead_research (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    lead_id UUID NOT NULL,
    research_data TEXT,
    urls TEXT[],
    success BOOLEAN DEFAULT false,
    error TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    ,FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_lead_research_lead_id ON lead_research(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_research_created_at ON lead_research(created_at);

-- Update lead_research table to store structured Gemini output
ALTER TABLE lead_research 
ADD COLUMN IF NOT EXISTS processed_data TEXT,
ADD COLUMN IF NOT EXISTS summary_insights TEXT,
ADD COLUMN IF NOT EXISTS decision_makers JSONB,
ADD COLUMN IF NOT EXISTS recent_triggers JSONB,
ADD COLUMN IF NOT EXISTS outreach_hooks JSONB;

-- Add indexes for the new fields
CREATE INDEX IF NOT EXISTS idx_lead_research_processed ON lead_research USING GIN (decision_makers);
CREATE INDEX IF NOT EXISTS idx_lead_research_triggers ON lead_research USING GIN (recent_triggers);

-- Add lead_list_id to campaigns table if not exists
ALTER TABLE campaigns 
ADD COLUMN IF NOT EXISTS lead_list_id UUID,
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- Create index for campaign lookups
CREATE INDEX IF NOT EXISTS idx_campaigns_lead_list_id ON campaigns(lead_list_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
