import { useState, useRef, useEffect } from 'react';
import { ModuleLayout } from '../ModuleLayout';
import { Bot, User, Send, CheckCircle2, AlertTriangle, ShieldCheck, Mic, MicOff, Volume2 } from 'lucide-react';
import { useTraining } from '../../context/TrainingContext';

// Add TypeScript support for Web Speech API if needed
declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}

export function Module7() {
    const { toggleChecklistItem, checklistItems } = useTraining();
    const [messages, setMessages] = useState<{ role: 'ai' | 'user'; content: string }[]>([
        {
            role: 'ai',
            content: "Hi there. I heard you guys are selling some sort of digital gold bond? I usually invest exclusively in Bloomberg Securities or traditional municipal bonds. Why should I lock my money up with Goldbackbond instead of a standard 5% yielding treasury? Convince me."
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isSimulating, setIsSimulating] = useState(false);
    const [evaluation, setEvaluation] = useState<{ passed: boolean; feedback: string } | null>(null);
    const [isListening, setIsListening] = useState(false);
    const [ttsEnabled, setTtsEnabled] = useState(true);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const recognitionRef = useRef<any>(null);

    const contractItem = checklistItems.find(i => i.id === 'contract');
    const isContractSigned = contractItem?.completed ?? false;
    const currentModule = checklistItems.find(i => i.id === 'module-7');
    const isCompleted = currentModule?.completed ?? false;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Initialize Speech Recognition
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setInputValue(prev => prev + (prev ? ' ' : '') + transcript);
                setIsListening(false);
            };

            recognitionRef.current.onerror = (event: any) => {
                console.error('Speech recognition error', event.error);
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }
    }, []);

    const toggleListening = () => {
        if (!recognitionRef.current) {
            alert("Speech recognition is not supported in this browser.");
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    const speakText = (text: string) => {
        if ('speechSynthesis' in window && ttsEnabled) {
            window.speechSynthesis.cancel(); // stop any current speech
            const utterance = new SpeechSynthesisUtterance(text);
            
            // Try to find a male/authoritative voice for "Mr. Skeptical Buyer"
            const voices = window.speechSynthesis.getVoices();
            const preferredVoice = voices.find(v => (v.name.includes("Male") || v.name.includes("David") || v.name.includes("Google UK English Male"))) || voices[0];
            
            if (preferredVoice) {
                utterance.voice = preferredVoice;
            }
            
            utterance.rate = 1.0;
            utterance.pitch = 0.9;
            
            window.speechSynthesis.speak(utterance);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || isSimulating) return;

        const userMessage = inputValue.trim();
        setInputValue('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsSimulating(true);

        try {
            const response = await fetch('/api/ai-coach', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: [...messages, { role: 'user', content: userMessage }]
                }),
            });

            if (!response.ok) {
                throw new Error('AI Coach unavailable');
            }

            const data = await response.json();

            setMessages(prev => [...prev, { role: 'ai', content: data.reply }]);
            
            // AI Speaks the reply out loud
            speakText(data.reply);

            if (data.evaluation) {
                setEvaluation(data.evaluation);
                if (data.evaluation.passed && !isCompleted) {
                    toggleChecklistItem('module-7');
                }
                // Speak the evaluation feedback as the "Coach"
                setTimeout(() => {
                    speakText(data.evaluation.feedback);
                }, 1000); 
            }

        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, {
                role: 'ai',
                content: "I'm having trouble connecting to my central servers. (Error: AI Coach Offline). Please try again later."
            }]);
        } finally {
            setIsSimulating(false);
        }
    };

    return (
        <ModuleLayout
            moduleId="module-7"
            moduleNumber={7}
            title="AI Sales Simulator (Voice Enabled)"
            description="Practice your pitches and handle tough objections with our advanced AI prospect. Use your microphone to practice your tonality."
        >
            <div className="space-y-8">

                {/* Simulator Rules */}
                <section>
                    <div className="bg-neutral-50 rounded-xl p-6 border border-neutral-200">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-gold-600" />
                                Simulator Rules of Engagement
                            </h3>
                            <button 
                                onClick={() => setTtsEnabled(!ttsEnabled)}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${ttsEnabled ? 'bg-gold-100 text-gold-800 border-gold-300' : 'bg-neutral-200 text-neutral-600 border-neutral-300'} border`}
                            >
                                <Volume2 className="w-4 h-4" />
                                {ttsEnabled ? 'AI Voice: ON' : 'AI Voice: OFF'}
                            </button>
                        </div>
                        <ul className="space-y-2 text-neutral-700">
                            <li className="flex items-start gap-2">
                                <span className="text-gold-600 font-bold">1.</span>
                                The AI acts as a highly skeptical, high-net-worth individual.
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-gold-600 font-bold">2.</span>
                                To pass, you must successfully navigate objections regarding SEC compliance (utility token vs security), locking terms (1/3/5/10 years), and the 30-day grace period.
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-gold-600 font-bold">3.</span>
                                Utilize the Elite Coaching principles: <strong>Conviction, Risk Reversal, and Assumptive Close</strong>.
                            </li>
                        </ul>
                    </div>
                </section>

                {/* Lock State */}
                {!isContractSigned ? (
                    <div className="bg-warning/10 border-2 border-warning/30 rounded-xl p-6">
                        <div className="flex items-start gap-4">
                            <AlertTriangle className="w-6 h-6 text-warning flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-semibold text-neutral-900 mb-2">Contract Requires Signature</h3>
                                <p className="text-neutral-700">
                                    You must execute your Independent Contractor Agreement before accessing the AI Simulator.
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="border border-neutral-200 rounded-2xl overflow-hidden bg-white shadow-sm flex flex-col h-[600px]">

                        {/* Chat Title bar */}
                        <div className="bg-neutral-900 px-6 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gold-600 flex items-center justify-center flex-shrink-0">
                                    <Bot className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold flex items-center gap-2">
                                        Mr. Skeptical Buyer
                                        <span className="text-[10px] uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded text-white/90">AI Model</span>
                                    </h3>
                                    <p className="text-neutral-400 text-xs text-left">Level: Advanced Investor</p>
                                </div>
                            </div>

                            {evaluation && (
                                <div className={`px-4 py-1.5 rounded-full flex items-center gap-2 border ${evaluation.passed ? 'bg-success/20 border-success/50 text-success' : 'bg-error/20 border-error/50 text-error'}`}>
                                    {evaluation.passed ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                                    <span className="font-semibold text-sm">{evaluation.passed ? 'Simulator Passed' : 'Simulator Failed'}</span>
                                </div>
                            )}
                        </div>

                        {/* Chat Messages */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-neutral-50 relative">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${msg.role === 'ai' ? 'bg-neutral-900' : 'bg-gold-600'
                                        }`}>
                                        {msg.role === 'ai' ? <Bot className="w-5 h-5 text-white" /> : <User className="w-5 h-5 text-white" />}
                                    </div>

                                    <div className={`px-5 py-3.5 rounded-2xl max-w-[80%] ${msg.role === 'user'
                                            ? 'bg-gold-600 text-white rounded-tr-none'
                                            : 'bg-white border border-neutral-200 text-neutral-800 rounded-tl-none shadow-sm'
                                        }`}>
                                        <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                                    </div>
                                </div>
                            ))}

                            {isSimulating && (
                                <div className="flex items-start gap-4">
                                    <div className="w-8 h-8 rounded-full bg-neutral-900 flex items-center justify-center flex-shrink-0 mt-1">
                                        <Bot className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="px-5 py-4 bg-white border border-neutral-200 rounded-2xl rounded-tl-none shadow-sm text-neutral-500 flex items-center gap-1.5">
                                        <div className="w-2 h-2 rounded-full bg-neutral-300 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-2 h-2 rounded-full bg-neutral-300 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-2 h-2 rounded-full bg-neutral-300 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Evaluation Alert */}
                        {evaluation && (
                            <div className={`border-t border-b p-4 ${evaluation.passed ? 'bg-success/10 border-success/20' : 'bg-error/10 border-error/20'}`}>
                                <div className="flex items-start gap-3">
                                    {evaluation.passed ? <CheckCircle2 className="w-5 h-5 text-success mt-0.5 flex-shrink-0" /> : <AlertTriangle className="w-5 h-5 text-error mt-0.5 flex-shrink-0" />}
                                    <div>
                                        <h4 className={`font-semibold ${evaluation.passed ? 'text-success' : 'text-error'}`}>
                                            Elite Sales Coach Feedback
                                        </h4>
                                        <p className={`text-sm mt-1 whitespace-pre-wrap ${evaluation.passed ? 'text-success/90' : 'text-error/90'}`}>
                                            {evaluation.feedback}
                                        </p>
                                        <button
                                            onClick={() => {
                                                setEvaluation(null);
                                                window.speechSynthesis.cancel();
                                                setMessages([{ role: 'ai', content: "Let's try this again. Convince me why I shouldn't just keep my money in Bloomberg Securities." }]);
                                            }}
                                            className={`mt-3 text-sm font-medium underline underline-offset-2 ${evaluation.passed ? 'text-success hover:text-success/80' : 'text-error hover:text-error/80'}`}
                                        >
                                            Start New Roleplay
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Chat Input */}
                        <div className="p-4 bg-white border-t border-neutral-200">
                            <form onSubmit={handleSendMessage} className="relative flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={toggleListening}
                                    className={`p-4 rounded-xl flex-shrink-0 transition-all ${isListening ? 'bg-error text-white animate-pulse shadow-lg shadow-error/30' : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200 hover:text-neutral-700'}`}
                                    title={isListening ? "Stop Listening" : "Start Speaking"}
                                >
                                    {isListening ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
                                </button>
                                
                                <div className="relative flex-1">
                                    <input
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        placeholder={
                                            evaluation?.passed ? "Simulator complete." : 
                                            isListening ? "Listening... Speak now." : 
                                            "Type your response or use the microphone..."
                                        }
                                        disabled={isSimulating || evaluation?.passed}
                                        className={`w-full pl-4 pr-14 py-4 bg-neutral-100 border-transparent focus:bg-white focus:border-gold-500 focus:ring-2 focus:ring-gold-200 rounded-xl transition-all outline-none disabled:opacity-60 ${isListening ? 'border-error/50 bg-error/5 placeholder-error/60' : ''}`}
                                    />
                                    <button
                                        type="submit"
                                        disabled={!inputValue.trim() || isSimulating || evaluation?.passed}
                                        className="absolute right-2 top-2 bottom-2 aspect-square p-2 bg-gold-600 text-white rounded-lg hover:bg-gold-700 disabled:opacity-50 disabled:hover:bg-gold-600 transition-colors flex items-center justify-center"
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </ModuleLayout>
    );
}
