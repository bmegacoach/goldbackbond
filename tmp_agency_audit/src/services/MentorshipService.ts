import { db } from '@/lib/firebase/config';
import { doc, getDoc, setDoc, increment } from 'firebase/firestore';

export interface AgentMetrics {
    callsMade: number;
    targetCalls: number;
    appointmentsSet: number;
    closedDeals: number;
    pipelineValue: number;
    complianceCheckpointsPassed: number;
    lifestyleGoal: string;
    upcomingSession: {
        date: string;
        time: string;
        topic: string;
        status: 'pending' | 'accepted' | 'negotiating';
    } | null;
    aiStatus: string;
}

const initialMetrics: AgentMetrics = {
    callsMade: 0,
    targetCalls: 100,
    appointmentsSet: 0,
    closedDeals: 0,
    pipelineValue: 0,
    complianceCheckpointsPassed: 0,
    lifestyleGoal: "Buy a house for my parents",
    upcomingSession: null,
    aiStatus: 'Pending Daily Review'
};

export class MentorshipIntegration {
    private getTodayRef(uid: string) {
        const dateStr = new Date().toISOString().split('T')[0];
        return doc(db, 'users', uid, 'daily_metrics', dateStr);
    }
    
    private getGoalRef(uid: string) {
        return doc(db, 'users', uid, 'mentorship', 'profile');
    }

    async getMetrics(uid: string): Promise<AgentMetrics> {
        if (!uid) return initialMetrics;
        try {
            const todayRef = this.getTodayRef(uid);
            const goalRef = this.getGoalRef(uid);
            
            const [todayDoc, goalDoc] = await Promise.all([
                getDoc(todayRef),
                getDoc(goalRef)
            ]);
            
            let currentMetrics = { ...initialMetrics };
            
            if (goalDoc.exists()) {
                currentMetrics.lifestyleGoal = goalDoc.data().lifestyleGoal || currentMetrics.lifestyleGoal;
                currentMetrics.upcomingSession = goalDoc.data().upcomingSession || null;
                currentMetrics.aiStatus = goalDoc.data().aiStatus || currentMetrics.aiStatus;
            } else {
                // Initialize goal doc if it doesn't exist
                await setDoc(goalRef, {
                    lifestyleGoal: currentMetrics.lifestyleGoal,
                    aiStatus: currentMetrics.aiStatus,
                    upcomingSession: currentMetrics.upcomingSession
                }, { merge: true });
            }
            
            if (todayDoc.exists()) {
                const todayData = todayDoc.data();
                currentMetrics.callsMade = todayData.callsMade || 0;
                currentMetrics.appointmentsSet = todayData.appointmentsSet || 0;
                currentMetrics.closedDeals = todayData.closedDeals || 0;
                currentMetrics.pipelineValue = todayData.pipelineValue || 0;
                currentMetrics.complianceCheckpointsPassed = todayData.complianceCheckpointsPassed || 0;
            } else {
                // Initialize today's doc
                await setDoc(todayRef, {
                    callsMade: 0,
                    appointmentsSet: 0,
                    closedDeals: 0,
                    pipelineValue: 0,
                    complianceCheckpointsPassed: 0,
                }, { merge: true });
            }
            
            return currentMetrics;
        } catch (error) {
            console.error('Error fetching mentorship metrics', error);
            return initialMetrics;
        }
    }

    async logDial(uid: string) {
        if (!uid) return;
        try {
            const ref = this.getTodayRef(uid);
            await setDoc(ref, { callsMade: increment(1) }, { merge: true });
        } catch (error) {
            console.error('Error logging dial', error);
        }
    }

    async logAppointment(uid: string) {
        if (!uid) return;
        try {
            const ref = this.getTodayRef(uid);
            await setDoc(ref, { appointmentsSet: increment(1) }, { merge: true });
        } catch (error) {
            console.error('Error logging appointment', error);
        }
    }

    async logDeal(uid: string, value: number) {
        if (!uid) return;
        try {
            const ref = this.getTodayRef(uid);
            await setDoc(ref, { 
                closedDeals: increment(1),
                pipelineValue: increment(value)
            }, { merge: true });
        } catch (error) {
            console.error('Error logging deal', error);
        }
    }

    async updateLifestyleGoal(uid: string, goal: string) {
        if (!uid) return;
        try {
            const ref = this.getGoalRef(uid);
            await setDoc(ref, { lifestyleGoal: goal }, { merge: true });
        } catch (error) {
            console.error('Error updating lifestyle goal', error);
        }
    }
}

export const mentorshipService = new MentorshipIntegration();
