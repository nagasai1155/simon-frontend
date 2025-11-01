-- Update campaigns table to include lead_list_id and proper structure
ALTER TABLE campaigns 
ADD COLUMN IF NOT EXISTS lead_list_id UUID REFERENCES lead_list(id),
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_lead_list_id ON campaigns(lead_list_id);

-- Update existing campaigns to have proper structure
UPDATE campaigns 
SET metadata = '{}'::jsonb 
WHERE metadata IS NULL;
