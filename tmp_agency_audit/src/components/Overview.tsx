import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import {
  TrendingUp,
  Users,
  DollarSign,
  BarChart3,
  Activity,
  Target,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  BrainCircuit,
  PhoneCall,
  CalendarCheck2,
  Package, // Added
  FileSignature // Added
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/firebase/auth-context';
import { mentorshipService, AgentMetrics } from '@/services/MentorshipService';

export function Overview() {
  const { isPaid, user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  
  // Real LIVE metrics that sync to the Firebase daily_metrics struct
  // for the AI Sales Coach (Phase 18 Mentorship Integration)
  const [mentorshipStats, setMentorshipStats] = useState<AgentMetrics>({
    callsMade: 0,
    targetCalls: 100,
    appointmentsSet: 0,
    closedDeals: 0,
    pipelineValue: 0,
    complianceCheckpointsPassed: 0,
    lifestyleGoal: 'Loading...',
    aiStatus: 'Loading...',
    upcomingSession: null
  });

  const fetchMetrics = async () => {
    if (!user?.uid) return;
    setIsLoading(true);
    try {
      const liveMetrics = await mentorshipService.getMetrics(user.uid);
      setMentorshipStats(liveMetrics);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, [user?.uid]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-gold-500/30 border-t-gold-500 rounded-full animate-spin mx-auto" />
          <p className="text-slate-400 animate-pulse font-medium tracking-wider">SYNCING MENTORSHIP HUD</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
            Performance Hub
            {!isPaid && (
              <Badge variant="warning" className="bg-gold-500/10 text-gold-400 border border-gold-500/20 text-xs">Sandbox</Badge>
            )}
          </h1>
          <p className="text-slate-400 mt-2 text-lg">
            AI Sales Coach Sync & Live Metrics
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-900/40 p-3 pr-6 rounded-2xl border border-slate-800/60 backdrop-blur-xl">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 rounded-lg border border-green-500/20">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.6)]" />
            <span className="text-xs font-bold text-green-400 uppercase tracking-wider">Live Sync</span>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Coach Link</p>
            <p className="text-sm font-bold text-slate-200">Active</p>
          </div>
        </div>
      </div>

      {/* AI Mentorship Banner Strategy */}
      <Card className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-gold-500/20 shadow-premium overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]" />
        
        <CardContent className="p-8 relative">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 text-white">
            <div className="flex gap-6 items-center">
              <div className="p-4 bg-gradient-to-br from-gold-400 to-gold-600 rounded-2xl shadow-lg shadow-gold-500/20 border border-gold-300/30">
                <BrainCircuit className="w-8 h-8 text-white" />
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-bold font-heading text-slate-100">AI Sales Coach Integration</h3>
                <p className="text-gold-200/80 font-medium tracking-wide">
                  Your daily metrics are actively monitored by the Hormozi/Cardone AI Engine.
                </p>
                <div className="pt-2 flex items-center gap-2">
                  <Target className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-300">
                    <span className="text-slate-500 mr-2">Lifecycle Goal:</span> 
                    {mentorshipStats.lifestyleGoal}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {mentorshipStats.upcomingSession && mentorshipStats.upcomingSession.status === 'pending' && (
                <div className="bg-slate-950/50 backdrop-blur-md px-4 py-3 rounded-xl border border-gold-500/30 text-left animate-pulse">
                   <p className="text-xs text-gold-400 font-bold uppercase tracking-wider mb-1">Upcoming Session Requested</p>
                   <p className="text-sm font-medium text-slate-200">
                      {new Date(mentorshipStats.upcomingSession.date).toLocaleDateString()} at {mentorshipStats.upcomingSession.time}
                   </p>
                </div>
              )}
              <Button
                variant="gold"
                className="whitespace-nowrap shadow-[0_0_20px_rgba(184,141,46,0.2)]"
                onClick={() => window.open('https://bmegacoach.github.io/goldbackbond-training/', '_blank')}
              >
                Start Coaching Session
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Sync Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: PhoneCall, label: 'Dials Today', value: mentorshipStats.callsMade, color: 'blue', change: '+2', trend: 'up' },
          { icon: CalendarCheck2, label: 'Appointments Set', value: mentorshipStats.appointmentsSet, color: 'purple', change: '+1', trend: 'up' },
          { icon: Target, label: 'Deals Closed', value: mentorshipStats.closedDeals, color: 'green', change: '--', trend: 'neutral' },
          { icon: DollarSign, label: 'Pipeline Auth', value: `$${(mentorshipStats.pipelineValue / 1000).toFixed(1)}k`, color: 'gold', change: '+$10k', trend: 'up' }
        ].map((stat, i) => (
          <Card key={i} className="group relative overflow-hidden bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 hover:border-slate-700 transition-all duration-300">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <stat.icon className={`w-16 h-16 text-${stat.color}-500`} />
            </div>
            <CardContent className="p-6 relative">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2.5 rounded-xl bg-${stat.color}-500/10 border border-${stat.color}-500/20`}>
                  <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
                </div>
                <Badge variant="default" className={`bg-${stat.trend === 'up' ? 'green' : 'slate'}-500/10 text-${stat.trend === 'up' ? 'green' : 'slate'}-400 border-none px-2`}>
                  Live Sync
                </Badge>
              </div>
              <p className="text-slate-400 text-sm font-medium tracking-wide mb-1">{stat.label}</p>
              <h4 className="text-3xl font-bold text-slate-100">{stat.value}</h4>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action Desk */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Workflows */}
        <Card className="lg:col-span-2 bg-slate-900/40 backdrop-blur-2xl border-slate-800/60">
          <CardHeader className="border-b border-slate-800/50 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-slate-200">Execution Workflows</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              onClick={() => navigate('/dashboard/packages')}
              className="group cursor-pointer p-5 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900 border border-slate-700/50 hover:border-gold-500/30 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gold-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-start justify-between relative">
                <div>
                  <div className="p-2.5 bg-gold-500/10 rounded-xl inline-block mb-3 border border-gold-500/20">
                    <Package className="w-5 h-5 text-gold-400" />
                  </div>
                  <h4 className="text-slate-200 font-bold mb-1 group-hover:text-gold-400 transition-colors">Private Allocation Desk</h4>
                  <p className="text-slate-500 text-sm">Rigged for $25M Private constraints ($10K min @ $0.80).</p>
                </div>
                <ArrowUpRight className="text-slate-600 group-hover:text-gold-400 transition-colors w-5 h-5" />
              </div>
            </div>

            <div 
              onClick={() => navigate('/dashboard/contracts')}
              className="group cursor-pointer p-5 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900 border border-slate-700/50 hover:border-primary-500/30 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-primary-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-start justify-between relative">
                <div>
                  <div className="p-2.5 bg-primary-500/10 rounded-xl inline-block mb-3 border border-primary-500/20">
                    <FileSignature className="w-5 h-5 text-primary-400" />
                  </div>
                  <h4 className="text-slate-200 font-bold mb-1 group-hover:text-primary-400 transition-colors">OpenSign Contracts</h4>
                  <p className="text-slate-500 text-sm">Monitor live OpenSign statuses mapping to Ethscriptions.</p>
                </div>
                <ArrowUpRight className="text-slate-600 group-hover:text-primary-400 transition-colors w-5 h-5" />
              </div>
            </div>
            
             <div 
              onClick={() => navigate('/dashboard/customers')}
              className="group cursor-pointer p-5 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900 border border-slate-700/50 hover:border-slate-500 transition-all duration-300 relative overflow-hidden md:col-span-2"
            >
              <div className="flex items-center justify-between relative">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
                    <Users className="w-6 h-6 text-slate-300" />
                  </div>
                  <div>
                    <h4 className="text-slate-200 font-bold mb-0.5">Push Lead to Interactive Closing Wizard</h4>
                    <p className="text-slate-500 text-sm">Trigger the Phase 17 Guided Interactive sequence for a client on the phone.</p>
                  </div>
                </div>
                <div className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-sm font-medium border border-slate-700 group-hover:bg-slate-700 transition-colors">
                  Select Lead
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dynamic Coach Feedback Preview */}
        <Card className="bg-slate-900/40 backdrop-blur-2xl border-slate-800/60 flex flex-col">
          <CardHeader className="border-b border-slate-800/50 pb-4">
            <CardTitle className="text-slate-200 flex flex-col gap-1">
              AI Coach Status
              <div className="flex gap-2">
                 <Badge variant="default" className="opacity-50 text-[10px] uppercase font-bold tracking-widest border-transparent bg-slate-800 text-slate-400 mt-1">Profile: Active</Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 flex-1 flex flex-col">
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4 flex-1">
               <div className="flex gap-3 items-center mb-3">
                  <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Latest Sync</span>
               </div>
               <p className="text-sm text-slate-500 leading-relaxed italic border-l-2 border-slate-700 pl-3">
                 "{mentorshipStats.aiStatus}"
               </p>
            </div>
            <Button variant="secondary" className="w-full mt-4 justify-between group" onClick={fetchMetrics}>
              Manual Sync Pulse
              <ArrowUpRight className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
            </Button>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
