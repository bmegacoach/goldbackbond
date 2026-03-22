import { AgentMetrics } from './agentCrmService';

class AgencyBackendService {
  async updateLeadToPending(leadId: string, signatureId: string) {
    console.log(`[Mock] Updating lead ${leadId} to pending with signature ${signatureId}`);
    return { success: true };
  }

  async createLead(leadData: any) {
    console.log('[Mock] Creating lead:', leadData);
    return { success: true, leadId: 'MOCK-LEAD-' + Math.random().toString(36).substr(2, 6) };
  }
}

export default new AgencyBackendService();
