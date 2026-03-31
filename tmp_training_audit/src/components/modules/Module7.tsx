import { useState, useRef, useEffect } from 'react';
import { ModuleLayout } from '../ModuleLayout';
import { Bot, User, Send, CheckCircle2, AlertTriangle, ShieldCheck, Mic, MicOff, Volume2 } from 'lucide-react';
import { useTraining } from '../../context/TrainingContext';

interface Message {
    role: 'ai' | 'user';
    content: string | any;
}

interface Evaluation {
    passed: boolean | null;
    feedback: string;
}

export function Module7() {
    const { toggleChecklistItem, checklistItems } = useTraining();
    const [messages, setMessages] = useState<Message[]>([
        { role: 'ai', content: "Welcome to the Goldbackbond Sales Simulator. I'm Mr. Skeptical Buyer. You have exactly 3 minutes to convince me that USDGB is the safest asset I've ever seen. Go." }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isSimulating, setIsSimulating] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [micError, setMicError] = useState<string | null>(null);
    const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
    const [ttsEnabled, setTtsEnabled] = useState(true);
    const [lastMeta, setLastMeta] = useState<{ modelId?: string, voiceType?: string }>({});

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const isListeningRef = useRef(false);
    const audioContextRef = useRef<AudioContext | null>(null);

    const playNativeAudio = async (base64Data: string) => {
        try {
            // Cancel any robotic fallback TTS if it started
            if ('speechSynthesis' in window) window.speechSynthesis.cancel();

            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            }
            const context = audioContextRef.current;
            await context.resume();

            const binaryString = window.atob(base64Data);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            const int16Data = new Int16Array(bytes.buffer);
            const float32Data = new Float32Array(int16Data.length);
            for (let i = 0; i < int16Data.length; i++) {
                float32Data[i] = int16Data[i] / 32768.0;
            }
            const audioBuffer = context.createBuffer(1, float32Data.length, 24000);
            audioBuffer.copyToChannel(float32Data, 0);
            const source = context.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(context.destination);
            source.start();
        } catch (err) {
            console.error("Native Audio Playback Failed:", err);
        }
    };

    const contractItem = checklistItems.find(i => i.id === 'contract');
    const isContractSigned = contractItem?.completed ?? false;
    const currentModule = checklistItems.find(i => i.id === 'module-7');
    const isModuleCompleted = currentModule?.completed ?? false;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const toggleListening = async () => {
        if (isListening) {
            if (mediaRecorderRef.current) {
                mediaRecorderRef.current.stop();
                setIsListening(false);
                isListeningRef.current = false;
            }
        } else {
            setMicError(null);
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                const mediaRecorder = new MediaRecorder(stream);
                mediaRecorderRef.current = mediaRecorder;
                audioChunksRef.current = [];

                mediaRecorder.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        audioChunksRef.current.push(event.data);
                    }
                };

                mediaRecorder.onstop = async () => {
                    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                    const reader = new FileReader();
                    reader.readAsDataURL(audioBlob);
                    reader.onloadend = () => {
                        const base64Audio = (reader.result as string).split(',')[1];
                        handleSendMessage(undefined, base64Audio);
                    };
                    stream.getTracks().forEach(track => track.stop());
                };

                mediaRecorder.start();
                setIsListening(true);
                isListeningRef.current = true;
            } catch (err: any) {
                console.error("Microphone Access Error:", err);
                setMicError("Microphone access denied or not found. Please allow access in browser settings.");
                setIsListening(false);
                isListeningRef.current = false;
            }
        }
    };

    const speakText = (text: string, role: 'buyer' | 'coach' = 'buyer') => {
        if (!('speechSynthesis' in window) || !ttsEnabled) return;

        const voices = window.speechSynthesis.getVoices();
        const speak = () => {
            window.speechSynthesis.cancel();
            const cleanText = text.replace(/[*_#`~]/g, '').trim();
            const utterance = new SpeechSynthesisUtterance(cleanText);
            
            let voiceFound = voices.find(v => (v.name.includes("Natural") || v.name.includes("Google")) && (v.name.includes("US") || v.name.includes("UK")));
            
            if (!voiceFound) {
                if (role === 'buyer') {
                    voiceFound = voices.find(v => v.name.includes("Male") || v.name.includes("David") || v.name.includes("James"));
                } else {
                    voiceFound = voices.find(v => v.name.includes("Female") || v.name.includes("Zira") || v.name.includes("Linda"));
                }
            }

            if (role === 'buyer') {
                utterance.pitch = 0.8;
                utterance.rate = 0.9;
            } else {
                utterance.pitch = 1.0;
                utterance.rate = 1.05;
            }

            if (voiceFound) utterance.voice = voiceFound;
            window.speechSynthesis.speak(utterance);
        };

        if (voices.length === 0) {
            window.speechSynthesis.onvoiceschanged = speak;
        } else {
            speak();
        }
    };

    const handleSendMessage = async (e?: React.FormEvent, audioBase64?: string) => {
        if (e) e.preventDefault();
        
        if (!audioBase64 && !inputValue.trim()) return;
        if (isSimulating) return;

        if (audioContextRef.current) audioContextRef.current.resume().catch(() => {});

        const userMessage = audioBase64 ? "(Voice Message)" : inputValue.trim();
        if (!audioBase64) setInputValue('');
        
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsSimulating(true);

        try {
            const response = await fetch('/api/ai-coach', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    messages: [...messages, { role: 'user', content: userMessage }].slice(-10),
                    audio: audioBase64 
                })
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.error || `HTTP ${response.status}`);
            }

            const data = await response.json();
            
            setMessages(prev => [...prev, { 
                role: 'ai', 
                content: data.reply
            }]);

            if (data.evaluation) {
                setEvaluation(data.evaluation);
                if (data.evaluation.passed) {
                    toggleChecklistItem('module-7');
                }
            }

            if (data.modelId || data.voiceType) {
                setLastMeta({ modelId: data.modelId, voiceType: data.voiceType });
            }

            if (data.audio) {
                playNativeAudio(data.audio);
            } else if (ttsEnabled) {
                speakText(data.reply);
            }

        } catch (error: any) {
            console.error("AI Coach Error:", error);
            setMessages(prev => [...prev, { 
                role: 'ai', 
                content: `I'm having trouble connecting to my central servers. (Error: ${error.message || 'AI Coach Offline'}). Please try again later.` 
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
                                To pass, you must successfully navigate objections regarding SEC compliance, locking terms, and the 30-day grace period.
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-gold-600 font-bold">3.</span>
                                Utilize the Elite Coaching principles: <strong>Conviction, Risk Reversal, and Assumptive Close</strong>.
                            </li>
                        </ul>
                    </div>
                </section>

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
                        <div className="bg-neutral-900 px-6 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gold-600 flex items-center justify-center flex-shrink-0">
                                    <Bot className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold flex items-center gap-2 text-left">
                                        Mr. Skeptical Buyer
                                        <span className="text-[10px] uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded text-white/90">Premium AI</span>
                                    </h3>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <p className="text-neutral-400 text-[10px] uppercase tracking-tighter">Level: Advanced</p>
                                        {lastMeta.modelId && (
                                            <p className="text-gold-400 text-[10px] uppercase tracking-tighter bg-gold-950/40 px-1.5 rounded border border-gold-900/50">
                                                Mod: {lastMeta.modelId.split('-')[1]}.{lastMeta.modelId.split('-')[2] || 'Flash'}
                                            </p>
                                        )}
                                        {lastMeta.voiceType && (
                                            <p className={`text-[10px] uppercase tracking-tighter px-1.5 rounded border ${lastMeta.voiceType === 'hd' ? 'text-success border-success/30 bg-success/10' : 'text-warning border-warning/30 bg-warning/10'}`}>
                                                Voice: {lastMeta.voiceType === 'hd' ? 'Flagship HD' : 'Standard'}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {evaluation && (
                                <div className={`px-4 py-1.5 rounded-full flex items-center gap-2 border ${evaluation.passed ? 'bg-success/20 border-success/50 text-success' : 'bg-error/20 border-error/50 text-error'}`}>
                                    {evaluation.passed ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                                    <span className="font-semibold text-sm">{evaluation.passed ? 'Simulator Passed' : 'Simulator Failed'}</span>
                                </div>
                            )}
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-neutral-50 relative">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${msg.role === 'ai' ? 'bg-neutral-900' : 'bg-gold-600'}`}>
                                        {msg.role === 'ai' ? <Bot className="w-5 h-5 text-white" /> : <User className="w-5 h-5 text-white" />}
                                    </div>

                                    <div className={`px-5 py-3.5 rounded-2xl max-w-[80%] ${msg.role === 'user' ? 'bg-gold-600 text-white rounded-tr-none' : 'bg-white border border-neutral-200 text-neutral-800 rounded-tl-none shadow-sm'}`}>
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

                        <div className="p-4 bg-white border-t border-neutral-200">
                            {micError && (
                                <div className="mb-3 px-4 py-2 bg-error/10 border border-error/20 rounded-lg flex items-center gap-2 text-error text-sm animate-in fade-in slide-in-from-top-1">
                                    <AlertTriangle className="w-4 h-4" />
                                    <span>{micError}</span>
                                    <button onClick={() => setMicError(null)} className="ml-auto underline">Dismiss</button>
                                </div>
                            )}
                            <form onSubmit={handleSendMessage} className="relative flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setMicError(null);
                                        toggleListening();
                                    }}
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
