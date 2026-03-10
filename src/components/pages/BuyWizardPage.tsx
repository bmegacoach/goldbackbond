import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, ShieldCheck, FileSignature, Wallet, CheckCircle, AlertTriangle, Building, ChevronRight, Lock } from 'lucide-react';
import { useAccount } from 'wagmi';

export const BuyWizardPage = () => {
    const [phase, setPhase] = useState<1 | 2>(1);
    const [orderData, setOrderData] = useState({ amount: 10000, paymentMethod: 'wire' });

    return (
        <div className="min-h-screen bg-slate-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Progress Header */}
                <div className="flex items-center justify-between mb-8 px-4">
                    <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${phase === 1 ? 'bg-gold-500 text-slate-900' : 'bg-emerald-500 text-white'}`}>
                            {phase === 1 ? '1' : <CheckCircle className="w-5 h-5" />}
                        </div>
                        <span className={`font-semibold ${phase === 1 ? 'text-gold-400' : 'text-emerald-400'}`}>Private Offer Education</span>
                    </div>
                    <div className="flex-1 h-px bg-slate-700 mx-4" />
                    <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${phase === 2 ? 'bg-gold-500 text-slate-900' : 'bg-slate-700 text-slate-400'}`}>
                            2
                        </div>
                        <span className={`font-semibold ${phase === 2 ? 'text-gold-400' : 'text-slate-500'}`}>Checkout & KYC</span>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {phase === 1 ? (
                        <Phase1Education 
                            key="phase1" 
                            onComplete={() => setPhase(2)} 
                        />
                    ) : (
                        <Phase2Closing 
                            key="phase2" 
                            orderData={orderData} 
                            setOrderData={setOrderData} 
                            onBack={() => setPhase(1)} 
                        />
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

const Phase1Education = ({ onComplete }: { onComplete: () => void }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            <div className="bg-slate-800 border border-gold-500/30 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gold-500/5 to-transparent pointer-events-none" />
                <Lock className="w-12 h-12 text-gold-400 mx-auto mb-6 opacity-80" />
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-amber-200">
                        $25M Private Allocation
                    </span>
                    <br />Now Open
                </h1>
                <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
                    Prior to the Uniswap CCA public launch at <strong className="text-emerald-400">$0.85/USDGB</strong>, accredited partners can access the private $25M tranche at a fixed price of <strong className="text-gold-400">$0.80/USDGB</strong>.
                </p>

                <div className="grid md:grid-cols-2 gap-6 text-left max-w-3xl mx-auto mb-10">
                    <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700">
                        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-emerald-400" /> Private Offer Terms</h3>
                        <ul className="space-y-3 text-slate-300 text-sm">
                            <li className="flex justify-between border-b border-slate-800 pb-2"><span>Price per USDGB:</span> <strong className="text-gold-400">$0.80</strong></li>
                            <li className="flex justify-between border-b border-slate-800 pb-2"><span>Minimum Order:</span> <strong className="text-white">$10,000 USD</strong></li>
                            <li className="flex justify-between border-b border-slate-800 pb-2"><span>Payment Methods:</span> <strong className="text-white">Wire T/T, USDC, USDT</strong></li>
                            <li className="flex justify-between"><span>Identity Verification:</span> <strong className="text-white">Required (Fast KYC)</strong></li>
                        </ul>
                    </div>
                    <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700 flex flex-col justify-center">
                        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-warning" /> Upcoming Public CCA</h3>
                        <p className="text-sm text-slate-300 mb-4">
                            The public Uniswap Liquidity Bootstrapping Pool (CCA) is scheduled to launch shortly. 
                        </p>
                        <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                            <div className="flex justify-between text-sm mb-1"><span className="text-slate-400">CCA Starting Price:</span> <strong className="text-white">$0.85</strong></div>
                            <div className="flex justify-between text-sm"><span className="text-slate-400">CCA Ending Price:</span> <strong className="text-white">$1.00</strong></div>
                        </div>
                    </div>
                </div>

                <button 
                    onClick={onComplete}
                    className="bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-400 hover:to-amber-500 text-slate-900 font-bold text-lg px-8 py-4 rounded-xl transition-all shadow-lg shadow-gold-500/20 flex items-center gap-2 mx-auto"
                >
                    I Understand, Proceed to Checkout <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        </motion.div>
    );
};

const Phase2Closing = ({ orderData, setOrderData, onBack }: { orderData: any, setOrderData: any, onBack: () => void }) => {
    const { address } = useAccount();
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [kycData, setKycData] = useState({ name: '', email: '', idUploaded: false });
    const [signatureId, setSignatureId] = useState<string | null>(null);

    const usdgbTokens = orderData.amount / 0.80;

    return (
        <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="grid md:grid-cols-3 gap-6"
        >
            {/* Left Column: Flow Controls */}
            <div className="md:col-span-2 space-y-6">
                
                {/* Step 1: Order Config */}
                <div className={`bg-slate-800 border ${step === 1 ? 'border-gold-500/50 shadow-[0_0_15px_rgba(234,179,8,0.1)]' : 'border-slate-700 opacity-60'} rounded-3xl p-8 transition-all`}>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3"><span className="w-8 h-8 rounded-full bg-slate-700 text-sm flex items-center justify-center">1</span> Configure Allocation</h2>
                        {step > 1 && <button onClick={() => setStep(1)} className="text-gold-400 text-sm font-semibold">Edit</button>}
                    </div>
                    {step === 1 ? (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Investment Amount (USD)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                                    <input 
                                        type="number" 
                                        min="10000"
                                        value={orderData.amount}
                                        onChange={(e) => setOrderData({ ...orderData, amount: Number(e.target.value) })}
                                        className="w-full bg-slate-900 border border-slate-600 rounded-xl py-3 pl-8 pr-4 text-white font-bold text-lg focus:outline-none focus:border-gold-500"
                                    />
                                </div>
                                {orderData.amount < 10000 && <p className="text-error text-xs mt-2 mt-1">Minimum private allocation is $10,000.</p>}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <button 
                                    onClick={() => setOrderData({ ...orderData, paymentMethod: 'wire' })}
                                    className={`py-3 rounded-xl font-semibold border-2 transition-all ${orderData.paymentMethod === 'wire' ? 'bg-gold-500/10 border-gold-500 text-gold-400' : 'bg-slate-900 border-slate-700 text-slate-400'}`}
                                >
                                    <Building className="w-5 h-5 mx-auto mb-1" />
                                    Bank Wire (T/T)
                                </button>
                                <button 
                                    onClick={() => setOrderData({ ...orderData, paymentMethod: 'crypto' })}
                                    className={`py-3 rounded-xl font-semibold border-2 transition-all ${orderData.paymentMethod === 'crypto' ? 'bg-gold-500/10 border-gold-500 text-gold-400' : 'bg-slate-900 border-slate-700 text-slate-400'}`}
                                >
                                    <Wallet className="w-5 h-5 mx-auto mb-1" />
                                    USDC / USDT
                                </button>
                            </div>
                            <button 
                                disabled={orderData.amount < 10000}
                                onClick={() => setStep(2)}
                                className="w-full py-3 bg-gold-500 hover:bg-gold-400 text-slate-900 font-bold rounded-xl transition-colors disabled:opacity-50"
                            >
                                Continue to KYC
                            </button>
                        </div>
                    ) : (
                        <div className="text-slate-300">
                            ${orderData.amount.toLocaleString()} via {orderData.paymentMethod === 'wire' ? 'Bank Wire' : 'Crypto'}
                        </div>
                    )}
                </div>

                {/* Step 2: KYC & Signing */}
                <div className={`bg-slate-800 border ${step === 2 ? 'border-gold-500/50 shadow-[0_0_15px_rgba(234,179,8,0.1)]' : 'border-slate-700 opacity-60'} rounded-3xl p-8 transition-all`}>
                     <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3"><span className="w-8 h-8 rounded-full bg-slate-700 text-sm flex items-center justify-center">2</span> KYC & Execution</h2>
                         {step > 2 && <span className="text-emerald-400 font-semibold text-sm flex items-center gap-1"><CheckCircle className="w-4 h-4"/> Verified</span>}
                    </div>
                    {step === 2 && (
                        <div className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-4">
                                <input type="text" placeholder="Legal Full Name" value={kycData.name} onChange={e => setKycData({...kycData, name: e.target.value})} className="bg-slate-900 border border-slate-600 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-gold-500" />
                                <input type="email" placeholder="Email Address" value={kycData.email} onChange={e => setKycData({...kycData, email: e.target.value})} className="bg-slate-900 border border-slate-600 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-gold-500" />
                            </div>
                            
                            <div className="border-2 border-dashed border-slate-600 rounded-xl p-6 text-center hover:border-gold-500/50 transition-colors cursor-pointer bg-slate-900/50" onClick={() => setKycData({...kycData, idUploaded: true})}>
                                {kycData.idUploaded ? (
                                    <div className="text-emerald-400 font-semibold flex items-center justify-center gap-2"><CheckCircle className="w-5 h-5"/> ID Document Attached</div>
                                ) : (
                                    <span className="text-slate-400">Click to upload Valid ID (Passport / Drivers License)</span>
                                )}
                            </div>

                            <div className="pt-4 border-t border-slate-700">
                                <h4 className="text-white font-semibold mb-3">OpenSign Digital Execution</h4>
                                <p className="text-sm text-slate-400 mb-4">By executing below, you agree to the Goldbackbond Independent Contractor & Private Token Allocation terms. This signature will be irrevocably inscribed on the blockchain.</p>
                                <button 
                                    disabled={!kycData.name || !kycData.email || !kycData.idUploaded}
                                    onClick={() => {
                                        setSignatureId(`OS-${Math.random().toString(36).substr(2, 9).toUpperCase()}`);
                                        setStep(3);
                                    }}
                                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20"
                                >
                                    <FileSignature className="w-5 h-5" /> Execute OpenSign Contract
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Step 3: Funding */}
                {step === 3 && (
                     <div className="bg-gradient-to-br from-gold-900/40 to-slate-800 border border-gold-500/50 rounded-3xl p-8 shadow-[0_0_20px_rgba(234,179,8,0.15)] animate-in slide-in-from-bottom-4">
                        <div className="flex items-center gap-3 mb-6">
                            <ShieldCheck className="w-8 h-8 text-emerald-400" />
                            <h2 className="text-2xl font-bold text-white">Allocation Secured</h2>
                        </div>
                        <p className="text-slate-300 mb-6">Your contract has been executed (ID: <strong className="text-white">{signatureId}</strong>). To finalize the minting of your {usdgbTokens.toLocaleString()} USDGB, please fund the protocol using the instructions below.</p>
                        
                        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-700 font-mono text-sm text-slate-300 mb-6 space-y-3">
                            {orderData.paymentMethod === 'wire' ? (
                                <>
                                    <div className="flex justify-between border-b border-slate-800 pb-2"><span className="text-slate-500">Bank Name:</span> <span>Chase Manhattan Bank</span></div>
                                    <div className="flex justify-between border-b border-slate-800 pb-2"><span className="text-slate-500">Routing:</span> <span>021000021</span></div>
                                    <div className="flex justify-between border-b border-slate-800 pb-2"><span className="text-slate-500">Account:</span> <span className="bg-slate-800 px-2 rounded">****4829</span></div>
                                    <div className="flex justify-between"><span className="text-slate-500">Reference/Memo:</span> <span className="text-gold-400">{signatureId}</span></div>
                                </>
                            ) : (
                                <>
                                    <div className="flex justify-between border-b border-slate-800 pb-2"><span className="text-slate-500">Network:</span> <span>Ethereum (ERC-20) / Base</span></div>
                                    <div className="flex justify-between border-b border-slate-800 pb-2"><span className="text-slate-500">Asset:</span> <span>USDC / USDT</span></div>
                                    <div className="space-y-1">
                                        <span className="text-slate-500 block">Deposit Address:</span>
                                        <div className="bg-slate-800 p-3 rounded break-all text-xs text-emerald-400">0x742d35Cc6634C0532925a3b844Bc454e4438f44e</div>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="text-center">
                            <Link to="/" className="text-gold-400 hover:text-gold-300 font-bold text-sm">Return to Dashboard</Link>
                        </div>
                     </div>
                )}
            </div>

            {/* Right Column: Order Summary */}
            <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 h-fit sticky top-24">
                <h3 className="font-bold text-white mb-6 uppercase tracking-wider text-sm flex justify-between items-center">
                    Order Summary
                    <span className="bg-gold-500/20 text-gold-400 px-2 py-0.5 rounded text-xs">Private</span>
                </h3>
                
                <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Rate Lock:</span>
                        <span className="text-white font-medium">$0.80 / USDGB</span>
                    </div>
                    {address && (
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Destination:</span>
                            <span className="text-emerald-400 font-medium font-mono text-xs">{address.slice(0,6)}...{address.slice(-4)}</span>
                        </div>
                    )}
                </div>

                <div className="bg-slate-800 rounded-xl p-4 mb-6 border border-slate-700">
                    <div className="text-center mb-2">
                        <span className="text-xs text-slate-400 uppercase font-bold tracking-wide">You Receive</span>
                    </div>
                    <div className="text-3xl font-black text-white text-center text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-amber-200">
                        {usdgbTokens.toLocaleString(undefined, {maximumFractionDigits: 0})} <span className="text-lg">USDGB</span>
                    </div>
                </div>

                <div className="border-t border-slate-700 pt-4 flex justify-between items-end">
                    <span className="text-slate-400 font-medium">Total Due:</span>
                    <span className="text-2xl font-bold text-white">${orderData.amount.toLocaleString()}</span>
                </div>
            </div>
        </motion.div>
    );
};
