export interface AgentMetrics {
    callsMade: number;
    targetCalls: number;
    appointmentsSet: number;
    closedDeals: number;
    complianceCheckpointsPassed: number;
    lifestyleGoal: string;
    upcomingSession: {
        date: string;
        time: string;
        topic: string;
        status: 'pending' | 'accepted' | 'negotiating';
    } | null;
}

const STORAGE_KEY = 'gbb-agent-crm-metrics';

const initialMetrics: AgentMetrics = {
    callsMade: 0,
    targetCalls: 100,
    appointmentsSet: 0,
    closedDeals: 0,
    complianceCheckpointsPassed: 0,
    lifestyleGoal: "Buy a house for my parents",
    upcomingSession: null
};

class AgentCrmService {
    getMetrics(): AgentMetrics {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch {
                return initialMetrics;
            }
        }
        return initialMetrics;
    }

    private saveMetrics(metrics: AgentMetrics) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(metrics));
    }

    logDial(): AgentMetrics {
        const metrics = this.getMetrics();
        metrics.callsMade += 1;
        this.saveMetrics(metrics);
        return metrics;
    }

    setAppointment(): AgentMetrics {
        const metrics = this.getMetrics();
        metrics.appointmentsSet += 1;
        this.saveMetrics(metrics);
        return metrics;
    }

    logClosedDeal(): AgentMetrics {
        const metrics = this.getMetrics();
        metrics.closedDeals += 1;
        this.saveMetrics(metrics);
        return metrics;
    }

    updateLifestyleGoal(goal: string): AgentMetrics {
        const metrics = this.getMetrics();
        metrics.lifestyleGoal = goal;
        this.saveMetrics(metrics);
        return metrics;
    }

    scheduleSession(date: string, time: string, topic: string): AgentMetrics {
        const metrics = this.getMetrics();
        metrics.upcomingSession = { date, time, topic, status: 'pending' };
        this.saveMetrics(metrics);
        return metrics;
    }

    acceptSession(): AgentMetrics {
        const metrics = this.getMetrics();
        if (metrics.upcomingSession) {
            metrics.upcomingSession.status = 'accepted';
            this.saveMetrics(metrics);
        }
        return metrics;
    }

    clearSession(): AgentMetrics {
        const metrics = this.getMetrics();
        metrics.upcomingSession = null;
        this.saveMetrics(metrics);
        return metrics;
    }

    resetDailyMetrics(): AgentMetrics {
        const metrics = this.getMetrics();
        const reset: AgentMetrics = {
            ...initialMetrics,
            lifestyleGoal: metrics.lifestyleGoal, // preserve goal
            upcomingSession: metrics.upcomingSession // preserve session
        };
        this.saveMetrics(reset);
        return reset;
    }
}

export default new AgentCrmService();
