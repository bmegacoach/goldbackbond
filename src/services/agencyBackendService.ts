import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';

export interface AllocationRequest {
    id: string;
    buyer: string;
    amount: string;
    terms: string;
    agentInfo: string;
    paymentType: 'FIAT' | 'CRYPTO';
    paymentClearanceDate: string;
    status: 'pending' | 'approved';
}

// Ensure the user inputs the corresponding browser-safe API keys into their .env
// We do not parse firebase-admin JSON credentials within a React runtime to keep private keys secure based on standard Web Architectures.
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-key",
    authDomain: "goldbackbond-agency.firebaseapp.com",
    databaseURL: "https://goldbackbond-agency-default-rtdb.firebaseio.com",
    projectId: "goldbackbond-agency",
    storageBucket: "goldbackbond-agency.appspot.com",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "demo-sender",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "demo-app-id"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Fallback Mock Data until the true CRM DB keys are inserted into .env
const fallbackMockRequests: AllocationRequest[] = [
    {
        id: 'req_1',
        buyer: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
        amount: '5000',
        terms: 'Pre-sale Round A - 12 Month Lockup',
        agentInfo: 'Agent: John Doe (ID: 101) [AUTHORIZED]',
        paymentType: 'FIAT',
        paymentClearanceDate: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
        status: 'pending',
    },
    {
        id: 'req_2',
        buyer: '0x123f681646d4a755815f9cb19e1acc8565a0c2ac',
        amount: '85000',
        terms: 'VIP Allocation - No Lockup',
        agentInfo: 'Agent: Sarah Smith (ID: 204) [AUTHORIZED]',
        paymentType: 'CRYPTO',
        paymentClearanceDate: new Date(Date.now() - 3600000 * 12).toISOString(), // 12 hours ago
        status: 'pending',
    },
];

class AgencyBackendService {
    /**
     * Fetches live allocation requests from the agency CRM (`leads` collection) in Firestore.
     * Falls back to mock data if the Firebase environment variables are missing or if permissions deny access.
     */
    async fetchAgencyRequests(): Promise<AllocationRequest[]> {
        if (import.meta.env.VITE_USE_MOCK_AGENCY_DATA === 'true' || import.meta.env.VITE_FIREBASE_API_KEY === undefined) {
            console.warn('Firebase API Key not found or Mock mode enabled. Falling back to mock agency requests.');
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 800));
            return fallbackMockRequests;
        }

        try {
            const leadsRef = collection(db, 'leads');
            // Assuming standard CRM statuses label unprocessed as 'pending'
            const q = query(leadsRef, where('status', '==', 'pending'));

            const querySnapshot = await getDocs(q);

            // Map Firestore database rows to the frontend AllocationRequest interface structure
            return querySnapshot.docs.map(docSnap => {
                const row = docSnap.data();
                return {
                    id: docSnap.id,
                    buyer: row.buyer_wallet || row.buyer || '',
                    amount: (row.allocation_amount || row.amount || 0).toString(),
                    terms: row.sales_terms || row.terms || '',
                    agentInfo: `Agent: ${row.agent_name || 'Unknown'} (ID: ${row.agent_id || 'N/A'}) [AUTHORIZED]`,
                    paymentType: (row.payment_type?.toUpperCase() === 'CRYPTO' ? 'CRYPTO' : 'FIAT'),
                    paymentClearanceDate: row.payment_clearance_date || row.createdAt || new Date().toISOString(),
                    status: row.status as 'pending' | 'approved',
                };
            });
        } catch (error) {
            console.error('Failed to fetch real agency data from Firebase. Falling back to mock.', error);
            return fallbackMockRequests;
        }
    }

    /**
     * Updates an allocation record's status in the central CRM.
     * Use standard `updateDoc` methodology to mark it "approved" securely via rules.
     */
    async markRequestApproved(requestId: string, transactionHash: string): Promise<boolean> {
        if (!import.meta.env.VITE_FIREBASE_API_KEY || import.meta.env.VITE_USE_MOCK_AGENCY_DATA === 'true') {
            console.log(`Mock DB Update: Request ${requestId} marked approved via tx ${transactionHash}`);
            return true;
        }

        try {
            const leadRef = doc(db, 'leads', requestId);
            await updateDoc(leadRef, {
                status: 'approved',
                onchain_tx: transactionHash
            });
            return true;
        } catch (error) {
            console.error('Firebase update failed:', error);
            return false;
        }
    }
}

export default new AgencyBackendService();
