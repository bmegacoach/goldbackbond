import { useState, useRef, useEffect } from 'react';
import { ModuleLayout } from '../ModuleLayout';
import { Bot, User, Send, Target, TrendingUp, AlertTriangle, ShieldCheck, Activity, Phone, Calendar, Briefcase, CheckCircle2 } from 'lucide-react';
import { useTraining } from '../../context/TrainingContext';
import agentCrmService, { AgentMetrics } from '../../services/agentCrmService';

export function Module8() {
    const { user, toggleChecklistItem, checklistItems } = useTraining();
    const [checkinMessages, setCheckinMessages] = useState<{ role: 'ai' | 'user'; content: string }[]>([]);
    const [testMessages, setTestMessages] = useState<{ role: 'ai' | 'user'; content: string }[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [testInputValue, setTestInputValue] = useState('');
    const [isSimulating, setIsSimulating] = useState(false);
    
    // Agent State
    const [currentTier, setCurrentTier] = useState(1);
    const [weakAreas, setWeakAreas] = useState<string[]>(['Federal Reserve Custody']);
    const [activeTab, setActiveTab] = useState<'hub' | 'checkin' | 'test'>('hub');
    const [testEvaluation, setTestEvaluation] = useState<{ passed: boolean; feedback: string } | null>(null);

    const checkinEndRef = useRef<HTMLDivElement>(null);
    const testEndRef = useRef<HTMLDivElement>(null);

    const contractItem = checklistItems.find(i => i.id === 'contract');
    const isContractSigned = contractItem?.completed ?? false;
    const currentModule = checklistItems.find(i => i.id === 'module-8');
    const isCompleted = currentModule?.completed ?? false;

    // Live CRM Data State
    const [crmData, setCrmData] = useState<AgentMetrics>(agentCrmService.getMetrics());

    const scrollToBottom = (ref: React.RefObject<HTMLDivElement>) => {
        ref.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom(checkinEndRef);
    }, [checkinMessages]);

    useEffect(() => {
        scrollToBottom(testEndRef);
    }, [testMessages]);

    const startCheckin = async () => {
        setActiveTab('checkin');
        if (checkinMessages.length === 0) {
            setIsSimulating(true);
            try {
                const response = await fetch('/api/ai-mentor-checkin', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ crmData, weakAreas, messages: [] }),
                });
                const data = await response.json();
                setCheckinMessages([{ role: 'ai', content: data.reply }]);
                if (data.scheduledNextSession) {
                    setCrmData(agentCrmService.scheduleSession(data.scheduledNextSession.date, data.scheduledNextSession.time, data.scheduledNextSession.topic));
                }
            } catch (err) {
                setCheckinMessages([{ role: 'ai', content: "Mentor offline. Let's hit the phones anyway." }]);
            } finally {
                setIsSimulating(false);
            }
        }
    };

    const handleCheckinSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || isSimulating) return;

        const userMessage = inputValue.trim();
        setInputValue('');
        const newMessages = [...checkinMessages, { role: 'user' as const, content: userMessage }];
        setCheckinMessages(newMessages);
        setIsSimulating(true);

        try {
            const response = await fetch('/api/ai-mentor-checkin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ crmData, weakAreas, messages: newMessages }),
            });
            const data = await response.json();
            setCheckinMessages(prev => [...prev, { role: 'ai', content: data.reply }]);
            if (data.scheduledNextSession) {
                setCrmData(agentCrmService.scheduleSession(data.scheduledNextSession.date, data.scheduledNextSession.time, data.scheduledNextSession.topic));
            }
        } finally {
            setIsSimulating(false);
        }
    };

    const startTest = async () => {
        setActiveTab('test');
        if (testMessages.length === 0) {
            setIsSimulating(true);
            try {
                const response = await fetch('/api/ai-tier-test', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ tier: currentTier, weakAreas, messages: [] }),
                });
                const data = await response.json();
                setTestMessages([{ role: 'ai', content: data.reply }]);
            } catch (err) {
                setTestMessages([{ role: 'ai', content: "Test server offline." }]);
            } finally {
                setIsSimulating(false);
            }
        }
    };

    const handleTestSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!testInputValue.trim() || isSimulating) return;

        const userMessage = testInputValue.trim();
        setTestInputValue('');
        const newMessages = [...testMessages, { role: 'user' as const, content: userMessage }];
        setTestMessages(newMessages);
        setIsSimulating(true);

        try {
            const response = await fetch('/api/ai-tier-test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tier: currentTier, weakAreas, messages: newMessages }),
            });
            const data = await response.json();
            setTestMessages(prev => [...prev, { role: 'ai', content: data.reply }]);

            if (data.evaluation) {
                setTestEvaluation(data.evaluation);
                if (data.evaluation.passed) {
                    if (currentTier < 3) setCurrentTier(prev => prev + 1);
                    if (!isCompleted) toggleChecklistItem('module-8');
                } else if (data.evaluation.newWeakArea) {
                    if (!weakAreas.includes(data.evaluation.newWeakArea)) {
                        setWeakAreas(prev => [...prev, data.evaluation.newWeakArea]);
                    }
                }
            }
        } finally {
            setIsSimulating(false);
        }
    };

    return (
        <ModuleLayout
            moduleId="module-8"
            moduleNumber={8}
            title="AI Mentorship Hub"
            description="Your daily check-in with the Elite Sales Coach. Review your CRM stats, get motivated, and pass tiered knowledge exams."
        >
            <div className="space-y-6">
                {(!isContractSigned && !user?.isUnrestricted) ? (
                    <div className="bg-warning/10 border-2 border-warning/30 rounded-xl p-6">
                        <div className="flex items-start gap-4">
                            <AlertTriangle className="w-6 h-6 text-warning flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-semibold text-neutral-900 mb-2">Contract Requires Signature</h3>
                                <p className="text-neutral-700">You must execute your Independent Contractor Agreement before accessing the Mentorship Hub.</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        {crmData.upcomingSession && crmData.upcomingSession.status === 'pending' && (
                            <div className="bg-gradient-to-r from-gold-600 to-gold-700 text-white rounded-xl p-4 mb-6 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                                <div className="flex items-start gap-3">
                                    <Calendar className="w-6 h-6 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-bold">Coach Alex Scheduled a Session</h4>
                                        <p className="text-sm text-gold-50 mt-0.5">
                                            {crmData.upcomingSession.date} at {crmData.upcomingSession.time} — <span className="font-semibold">Focus: {crmData.upcomingSession.topic}</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 w-full md:w-auto">
                                    <button 
                                        onClick={() => setCrmData(agentCrmService.acceptSession())}
                                        className="flex-1 md:flex-none px-4 py-2 bg-white text-gold-800 rounded-lg font-bold text-sm hover:bg-gold-50 transition-colors shadow-sm"
                                    >
                                        Accept
                                    </button>
                                    <button 
                                        onClick={() => {
                                            setActiveTab('checkin');
                                            setInputValue(`I am not available for the coaching session on ${crmData.upcomingSession?.date} at ${crmData.upcomingSession?.time}. Can we reschedule for `);
                                        }}
                                        className="flex-1 md:flex-none px-4 py-2 bg-gold-800 text-white border border-gold-500 rounded-lg font-bold text-sm hover:bg-gold-900 transition-colors shadow-sm"
                                    >
                                        Reschedule
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Tab Navigation */}
                        <div className="flex border-b border-neutral-200">
                            <button onClick={() => setActiveTab('hub')} className={`px-4 py-3 font-semibold text-sm border-b-2 transition-colors ${activeTab === 'hub' ? 'border-gold-600 text-gold-700' : 'border-transparent text-neutral-500 hover:text-neutral-800'}`}>Hub Dashboard</button>
                            <button onClick={() => setActiveTab('checkin')} className={`px-4 py-3 font-semibold text-sm border-b-2 transition-colors ${activeTab === 'checkin' ? 'border-gold-600 text-gold-700' : 'border-transparent text-neutral-500 hover:text-neutral-800'}`}>Daily Check-in</button>
                            <button onClick={() => setActiveTab('test')} className={`px-4 py-3 font-semibold text-sm border-b-2 transition-colors ${activeTab === 'test' ? 'border-gold-600 text-gold-700' : 'border-transparent text-neutral-500 hover:text-neutral-800'}`}>Tier Exam</button>
                        </div>

                        {activeTab === 'hub' && (
                            <div className="space-y-6">
                                {/* Proactive Action Bar */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-blue-600 text-white rounded-xl p-4 flex items-center justify-between shadow-lg animate-pulse-slow">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                                <Target className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase font-bold tracking-widest opacity-80">Next Required Action</p>
                                                <p className="font-bold text-sm">Pass Tier {currentTier} Exam</p>
                                            </div>
                                        </div>
                                        <button onClick={startTest} className="px-3 py-1.5 bg-white text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-50 transition-colors">START NOW</button>
                                    </div>
                                    <div className="bg-emerald-600 text-white rounded-xl p-4 flex items-center justify-between shadow-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                                <Activity className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase font-bold tracking-widest opacity-80">Training Health</p>
                                                <p className="font-bold text-sm">Optimal (Daily Streak: 3)</p>
                                            </div>
                                        </div>
                                        <div className="flex -space-x-2">
                                            {[1, 2, 3].map(i => <div key={i} className="w-6 h-6 rounded-full border-2 border-emerald-600 bg-emerald-400 flex items-center justify-center text-[10px] font-bold">✓</div>)}
                                        </div>
                                    </div>
                                    <div className="bg-neutral-900 text-white rounded-xl p-4 flex items-center justify-between shadow-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                                <TrendingUp className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase font-bold tracking-widest opacity-80">Earning Potential</p>
                                                <p className="font-bold text-sm">Tier {currentTier}: 4% Comm.</p>
                                            </div>
                                        </div>
                                        <div className="text-gold-400 font-bold text-xs">TIER {currentTier}</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* CRM Stats */}
                                    <div className="bg-white border rounded-xl p-6 shadow-sm">
                                        <div className="flex items-center gap-2 mb-4">
                                            <TrendingUp className="w-5 h-5 text-gold-600" />
                                            <h3 className="font-bold text-lg">Today's CRM Performance</h3>
                                        </div>
                                        {/* ... rest of CRM stats ... */}
                                        <div className="space-y-4">
                                            <div>
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="text-neutral-600">Dials ({crmData.callsMade}/{crmData.targetCalls})</span>
                                                    <span className="font-medium">{Math.round((crmData.callsMade / crmData.targetCalls) * 100)}%</span>
                                                </div>
                                                <div className="w-full bg-neutral-100 rounded-full h-2">
                                                    <div className="bg-gold-500 h-2 rounded-full" style={{ width: `${(crmData.callsMade / crmData.targetCalls) * 100}%` }}></div>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <button onClick={() => setCrmData(agentCrmService.setAppointment())} className="p-3 bg-neutral-50 hover:bg-neutral-100 rounded-lg border border-neutral-200 transition-colors text-left flex flex-col justify-between h-full">
                                                    <div className="flex items-center justify-between w-full mb-2">
                                                        <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Appts Set</p>
                                                        <Calendar className="w-4 h-4 text-neutral-400" />
                                                    </div>
                                                    <p className="text-2xl font-bold text-neutral-900">{crmData.appointmentsSet}</p>
                                                    <span className="text-[10px] text-neutral-400 mt-1 uppercase font-bold">+ Log Appt</span>
                                                </button>
                                                <button onClick={() => setCrmData(agentCrmService.logClosedDeal())} className="p-3 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors text-left flex flex-col justify-between h-full">
                                                    <div className="flex items-center justify-between w-full mb-2">
                                                        <p className="text-xs text-emerald-600 uppercase tracking-wider font-semibold">Closed Won</p>
                                                        <Briefcase className="w-4 h-4 text-emerald-500" />
                                                    </div>
                                                    <p className="text-2xl font-bold text-emerald-700">{crmData.closedDeals}</p>
                                                    <span className="text-[10px] text-emerald-600/70 mt-1 uppercase font-bold">+ Log Close</span>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3 mt-6">
                                            <button onClick={() => setCrmData(agentCrmService.logDial())} className="w-full py-2.5 bg-neutral-100 text-neutral-800 rounded-lg font-bold hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2">
                                                <Phone className="w-4 h-4" /> Log Dial
                                            </button>
                                            <button onClick={startCheckin} className="w-full py-2.5 bg-neutral-900 text-white rounded-lg font-bold hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2">
                                                <Activity className="w-4 h-4" /> Check-in
                                            </button>
                                        </div>
                                    </div>

                                    {/* Lifestyle & Knowledge */}
                                    <div className="space-y-6">
                                        <div className="bg-gradient-to-br from-gold-50 to-white border border-gold-100 rounded-xl p-6 shadow-sm">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Target className="w-5 h-5 text-gold-600" />
                                                <h3 className="font-bold text-lg">Your "Why" (Lifestyle Goal)</h3>
                                            </div>
                                            <p className="text-neutral-800 font-medium text-lg leading-snug">"{crmData.lifestyleGoal}"</p>
                                            <p className="text-xs text-neutral-500 mt-2 italic">The AI Coach uses this to push you when you're underperforming.</p>
                                        </div>

                                        <div className="bg-white border text-left rounded-xl p-6 shadow-sm relative overflow-hidden">
                                            {/* Decorative Background Icon */}
                                            <Bot className="absolute -bottom-4 -right-4 w-24 h-24 text-neutral-50 opacity-10 rotate-12" />
                                            
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="font-bold text-lg flex items-center gap-2"><Activity className="w-5 h-5 text-neutral-500" /> Knowledge Profile</h3>
                                                <span className="text-xs font-bold px-2 py-1 bg-neutral-900 text-white rounded">TIER {currentTier}</span>
                                            </div>
                                            {weakAreas.length > 0 ? (
                                                <div className="space-y-2">
                                                    <p className="text-sm text-neutral-500 mb-3">Identified Weak Areas:</p>
                                                    {weakAreas.map((area, i) => (
                                                        <div key={i} className="flex items-center gap-2 text-sm text-error bg-error/5 border border-error/10 px-3 py-2 rounded-lg translate-x-0 hover:translate-x-1 transition-transform">
                                                            <AlertTriangle className="w-4 h-4" /> {area}
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 text-sm text-success bg-success/5 border border-success/10 px-3 py-2 rounded-lg">
                                                    <ShieldCheck className="w-4 h-4" /> No weak areas detected. Master class.
                                                </div>
                                            )}
                                            <button onClick={startTest} className="w-full mt-6 py-3 bg-white border-2 border-neutral-900 text-neutral-900 rounded-xl font-bold hover:bg-neutral-900 hover:text-white transition-all transform active:scale-95 shadow-lg shadow-neutral-200/50">Take Tier {currentTier} Exam</button>
                                        </div>
                                    </div>
                                </div>

                                {/* Training Timeline */}
                                <div className="bg-white border rounded-xl p-6 shadow-sm">
                                    <h3 className="font-bold text-lg mb-6 flex items-center gap-2"><Calendar className="w-5 h-5 text-blue-600" /> Weekly Training Timeline</h3>
                                    <div className="relative">
                                        <div className="absolute left-[15px] top-0 bottom-0 w-0.5 bg-neutral-100"></div>
                                        <div className="space-y-8">
                                            {[
                                                { day: 'Monday', action: 'Daily CRM Check-in', status: 'completed' },
                                                { day: 'Tuesday', action: 'Objection Handling Workshop', status: 'completed' },
                                                { day: 'Wednesday', action: 'Tier 1 Knowledge Refresh', status: 'active' },
                                                { day: 'Thursday', action: 'Advanced Closing Roleplay', status: 'pending' },
                                                { day: 'Friday', action: 'Weekly Performance Review', status: 'pending' },
                                            ].map((item, idx) => (
                                                <div key={idx} className="relative flex items-center gap-6 group">
                                                    <div className={`w-8 h-8 rounded-full border-4 border-white shadow-md z-10 flex items-center justify-center transition-colors ${
                                                        item.status === 'completed' ? 'bg-success' : item.status === 'active' ? 'bg-blue-600 animate-pulse' : 'bg-neutral-200'
                                                    }`}>
                                                        {item.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-white" />}
                                                    </div>
                                                    <div className={`flex-1 p-4 rounded-xl border transition-all ${
                                                        item.status === 'active' ? 'border-blue-200 bg-blue-50/50 shadow-md' : 'border-neutral-100'
                                                    }`}>
                                                        <div className="flex justify-between items-center">
                                                            <div>
                                                                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{item.day}</p>
                                                                <p className={`font-bold ${item.status === 'active' ? 'text-blue-700' : 'text-neutral-700'}`}>{item.action}</p>
                                                            </div>
                                                            {item.status === 'active' && <button onClick={startCheckin} className="text-xs font-bold text-blue-600 hover:underline">RESUME</button>}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'checkin' && (
                            <div className="border border-neutral-200 rounded-2xl overflow-hidden bg-white shadow-sm flex flex-col h-[500px]">
                                <div className="bg-neutral-900 px-6 py-4 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gold-600 flex items-center justify-center flex-shrink-0"><Bot className="w-6 h-6 text-white" /></div>
                                    <div>
                                        <h3 className="text-white font-semibold">Elite Mentor</h3>
                                        <p className="text-neutral-400 text-xs">Accountability Session</p>
                                    </div>
                                </div>
                                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-neutral-50">
                                    {checkinMessages.map((msg, idx) => (
                                        <div key={idx} className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${msg.role === 'ai' ? 'bg-neutral-900' : 'bg-gold-600'}`}>
                                                {msg.role === 'ai' ? <Bot className="w-5 h-5 text-white" /> : <User className="w-5 h-5 text-white" />}
                                            </div>
                                            <div className={`px-5 py-3.5 rounded-2xl max-w-[80%] ${msg.role === 'user' ? 'bg-gold-600 text-white rounded-tr-none' : 'bg-white border border-neutral-200 text-neutral-800 rounded-tl-none shadow-sm'}`}>
                                                <p className="whitespace-pre-wrap leading-relaxed text-sm">{msg.content}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {isSimulating && <div className="text-neutral-400 text-xs px-12">Mentor is typing...</div>}
                                    <div ref={checkinEndRef} />
                                </div>
                                <div className="p-4 bg-white border-t border-neutral-200">
                                    <form onSubmit={handleCheckinSubmit} className="relative">
                                        <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} disabled={isSimulating} placeholder="Respond to your mentor..." className="w-full pl-4 pr-14 py-3 bg-neutral-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-gold-200 transition-all outline-none disabled:opacity-60" />
                                        <button type="submit" disabled={!inputValue.trim() || isSimulating} className="absolute right-2 top-2 p-1.5 bg-gold-600 text-white rounded-lg hover:bg-gold-700 disabled:opacity-50"><Send className="w-4 h-4" /></button>
                                    </form>
                                </div>
                            </div>
                        )}

                        {activeTab === 'test' && (
                             <div className="border border-neutral-200 rounded-2xl overflow-hidden bg-white shadow-sm flex flex-col h-[500px]">
                                <div className="bg-neutral-900 px-6 py-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-error flex items-center justify-center flex-shrink-0"><ShieldCheck className="w-6 h-6 text-white" /></div>
                                        <div>
                                            <h3 className="text-white font-semibold flex items-center gap-2">Tier {currentTier} Knowledge Exam</h3>
                                            <p className="text-neutral-400 text-xs">Targeting Weak Areas</p>
                                        </div>
                                    </div>
                                    {testEvaluation && (
                                        <div className={`px-3 py-1 rounded text-xs font-bold ${testEvaluation.passed ? 'bg-success/20 text-success' : 'bg-error/20 text-error'}`}>
                                            {testEvaluation.passed ? 'PASSED' : 'FAILED'}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-neutral-50">
                                    {testMessages.map((msg, idx) => (
                                        <div key={idx} className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${msg.role === 'ai' ? 'bg-error' : 'bg-gold-600'}`}>
                                                {msg.role === 'ai' ? <Bot className="w-5 h-5 text-white" /> : <User className="w-5 h-5 text-white" />}
                                            </div>
                                            <div className={`px-5 py-3.5 rounded-2xl max-w-[80%] ${msg.role === 'user' ? 'bg-gold-600 text-white rounded-tr-none' : 'bg-white border border-neutral-200 text-neutral-800 rounded-tl-none shadow-sm'}`}>
                                                <p className="whitespace-pre-wrap leading-relaxed text-sm">{msg.content}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {isSimulating && <div className="text-neutral-400 text-xs px-12">Assessing answer...</div>}
                                    <div ref={testEndRef} />
                                </div>
                                {testEvaluation && !testEvaluation.passed && (
                                    <div className="p-4 bg-error/10 border-t border-error/20 text-sm text-error">
                                        <strong>Critique:</strong> {testEvaluation.feedback}
                                        <button onClick={() => { setTestEvaluation(null); setTestMessages([]); startTest(); }} className="block mt-2 underline">Retry Topic</button>
                                    </div>
                                )}
                                {testEvaluation && testEvaluation.passed && (
                                    <div className="p-4 bg-success/10 border-t border-success/20 text-sm text-success">
                                        <strong>Feedback:</strong> {testEvaluation.feedback}
                                        {currentTier < 3 && <button onClick={() => { setTestEvaluation(null); setTestMessages([]); setActiveTab('hub'); }} className="block mt-2 underline">Return to Hub (Tier increased!)</button>}
                                    </div>
                                )}
                                <div className="p-4 bg-white border-t border-neutral-200">
                                    <form onSubmit={handleTestSubmit} className="relative">
                                        <input type="text" value={testInputValue} onChange={(e) => setTestInputValue(e.target.value)} disabled={isSimulating || !!testEvaluation} placeholder={testEvaluation ? "Test concluded" : "Submit answer..."} className="w-full pl-4 pr-14 py-3 bg-neutral-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-error focus:border-transparent transition-all outline-none disabled:opacity-60" />
                                        <button type="submit" disabled={!testInputValue.trim() || isSimulating || !!testEvaluation} className="absolute right-2 top-2 p-1.5 bg-error text-white rounded-lg hover:bg-red-700 disabled:opacity-50"><Send className="w-4 h-4" /></button>
                                    </form>
                                </div>
                            </div>
                        )}
                    </>
                )}
                {/* Universal Disclaimer */}
                <section className="mt-8">
                    <div className="bg-neutral-100 border border-neutral-300 rounded-xl p-5 text-xs text-neutral-500">
                        <p><strong>Disclosure:</strong> USDGB and sUSDGB are digital utility tokens and are not securities. The 9% annualized growth reward on sUSDGB is a current program target funded by treasury-management activities; it is not a guaranteed return, does not constitute interest income from a fixed-income instrument, and may be modified for future staking programs. sUSDGB is locked while staked and is subject to reassignment to a participating lender in the event of borrower default. Goldbackbond Secured Debentures are entirely separate instruments issued by Goldbackbond Ltd and are not referenced by or linked to USDGB token values. This document does not constitute an offer of securities. Consult your financial, legal, and tax advisors before participating.</p>
                    </div>
                </section>
            </div>
        </ModuleLayout>
    );
}
