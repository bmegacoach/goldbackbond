import { db } from '../lib/firebase/config';
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';

class AgencyBackendService {
  async updateLeadToPending(leadId: string, signatureId: string) {
    try {
      const leadRef = doc(db, 'leads', leadId);
      await updateDoc(leadRef, {
        status: 'Contract Pending Execution',
        openSignDocumentId: signatureId,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating lead signature:', error);
      return { success: false, error };
    }
  }

  async createLead(leadData: any) {
    try {
      const leadsRef = collection(db, 'leads');
      const docRef = await addDoc(leadsRef, {
        ...leadData,
        status: 'New',
        source: 'Training Academy Wizard',
        createdAt: serverTimestamp()
      });
      return { success: true, leadId: docRef.id };
    } catch (error) {
      console.error('Error creating live lead:', error);
      return { success: false, error };
    }
  }
}

export default new AgencyBackendService();
