"use server"

/**
 * ⚠️  Stubbed implementations
 * These no-op functions exist only to satisfy existing imports after
 * we simplified the execution logic.  Replace or extend as needed.
 */

export async function executeLeadResearch(leadId: string) {
  console.log(`[stub] executeLeadResearch called for lead ${leadId}`)
  return { success: true }
}

export async function executeCampaign(campaignId: string) {
  console.log(`[stub] executeCampaign called for campaign ${campaignId}`)
  return { success: true }
}
