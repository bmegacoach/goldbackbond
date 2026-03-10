import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useToast } from '../ToastProvider';
import { ethers } from 'ethers';
import SmartContractDataService from '../../services/smartContractDataService';
import agencyBackendService, { AllocationRequest } from '../../services/agencyBackendService';
import GBBAllocationInscriptionABI from '../../lib/abis/GBBAllocationInscription.json';
import { CONTRACTS } from '../../lib/contractAddresses';
import { CheckCircle, Clock, Loader2 } from 'lucide-react';
import WalletStatus from '../WalletStatus';

const calculateCommission = (amountStr: string): string => {
    const amount = Number(amountStr) || 0;
    if (amount >= 100000) return '5.0% Partner Scale';
    if (amount >= 50000) return '4.5% VIP Scale';
    if (amount >= 10000) return '4.0% Standard Scale';
    return '3.0% Base Scale';
};

const AllocationApprovalPage: React.FC = () => {
    const { address, isConnected } = useAccount();
    const { showError, showSuccess, showInfo } = useToast();
    const [requests, setRequests] = useState<AllocationRequest[]>([]);
    const [isProcessing, setIsProcessing] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isOwner, setIsOwner] = useState(false);

    useEffect(() => {
        const fetchLeads = async () => {
            setIsLoading(true);
            const data = await agencyBackendService.fetchAgencyRequests();
            setRequests(data);
            setIsLoading(false);
        };
        fetchLeads();
    }, []);

    useEffect(() => {
        const checkOwner = async () => {
            if (isConnected && address) {
                try {
                    // Fallback to static provider for read
                    const provider = new ethers.JsonRpcProvider('https://mainnet.base.org');
                    const contract = new ethers.Contract(CONTRACTS.ALLOCATION_INSCRIPTION, GBBAllocationInscriptionABI, provider);
                    const ownerAddress = await contract.owner();
                    setIsOwner(ownerAddress.toLowerCase() === address.toLowerCase());
                } catch (error) {
                    console.error("Error checking owner status", error);
                }
            }
        };
        checkOwner();
    }, [isConnected, address]);

    const handleApprove = async (request: AllocationRequest) => {
        if (!isConnected || !window.ethereum) {
            showError('Error', 'Please connect your wallet.');
            return;
        }

        try {
            setIsProcessing(request.id);
            // Get Web3Provider from window.ethereum
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();

            const contract = new ethers.Contract(CONTRACTS.ALLOCATION_INSCRIPTION, GBBAllocationInscriptionABI, signer);

            const parsedAmount = ethers.parseUnits(request.amount, 18);

            const tx = await contract.issueAllocation(
                request.buyer,
                parsedAmount,
                request.terms,
                request.agentInfo,
                calculateCommission(request.amount),
                request.paymentType,
                request.openSignDocumentId
            );

            showInfo('Processing', 'Transaction submitted, awaiting confirmation...');
            const receipt = await tx.wait();

            // Register completion securely into Firebase Backend
            await agencyBackendService.markRequestApproved(request.id, receipt.hash);

            showSuccess('Success', `Allocation for ${request.buyer} approved and inscribed!`);

            setRequests(prev => prev.map(req => req.id === request.id ? { ...req, status: 'approved' } : req));
        } catch (error: any) {
            console.error('Approval failed', error);
            showError('Error', error.reason || 'Transaction failed');
        } finally {
            setIsProcessing(null);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-heading text-slate-100 uppercase tracking-wider">
                        Allocation <span className="text-amber-500">Approvals</span>
                    </h1>
                    <p className="text-slate-400 mt-2">
                        Review and inscribe Eth-Inscription allocation certificates for pre-sale buyers.
                    </p>
                </div>
                {!isConnected && (
                    <div className="flex items-center">
                        <WalletStatus />
                    </div>
                )}
            </div>

            {!isConnected ? (
                <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-8 border border-slate-700 text-center">
                    <p className="text-slate-300">You must connect your wallet to view and manage allocations.</p>
                </div>
            ) : isLoading ? (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                    <Loader2 className="w-10 h-10 animate-spin text-amber-500 mb-4" />
                    <p>Fetching agency leads from secure backend...</p>
                </div>
            ) : requests.length === 0 ? (
                <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-8 border border-slate-700 text-center">
                    <p className="text-slate-300">No pending allocation requests found.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {requests.map(request => {
                        const clearanceTime = new Date(request.paymentClearanceDate).getTime();
                        const slaHours = request.paymentType === 'FIAT' ? 72 : 24;
                        const deadlineTime = clearanceTime + (slaHours * 60 * 60 * 1000);
                        const isOverdue = Date.now() > deadlineTime;
                        const hoursRemaining = Math.max(0, Math.floor((deadlineTime - Date.now()) / (60 * 60 * 1000)));

                        return (
                            <div key={request.id} className={`bg-slate-800/80 backdrop-blur-md rounded-xl p-6 border transition-all hover:bg-slate-800 flex flex-col md:flex-row gap-6 items-center ${isOverdue && request.status === 'pending' ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'border-slate-700 shadow-xl'}`}>
                                <div className="flex-1 space-y-3 w-full">
                                    <div className="flex items-center justify-between">
                                        {request.status === 'pending' ? (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/20 text-amber-400 border border-amber-500/30">
                                                <Clock size={14} /> Pending Approval
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                                <CheckCircle size={14} /> Approved & Inscribed
                                            </span>
                                        )}
                                        <div className="text-right">
                                            <div className="flex items-center justify-end gap-2 mb-1">
                                                <span className={`px-2 py-0.5 rounded text-xs font-bold ${request.paymentType === 'FIAT' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'}`}>
                                                    {request.paymentType}
                                                </span>
                                                {request.status === 'pending' && (
                                                    <span className={`text-xs font-bold ${isOverdue ? 'text-red-400' : 'text-amber-400'}`}>
                                                        {isOverdue ? 'SLA OVERDUE' : `${hoursRemaining}h SLA`}
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-sm text-slate-400 uppercase tracking-wide block">Amount</span>
                                            <span className="text-xl font-bold text-amber-500">{request.amount} USDGB</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <span className="text-xs text-slate-500 uppercase">Buyer Address</span>
                                            <p className="text-slate-300 font-mono text-sm break-all bg-slate-900/50 p-2 rounded mt-1 border border-slate-700/50">
                                                {request.buyer}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-xs text-slate-500 uppercase">Sales Terms</span>
                                            <p className="text-slate-300 text-sm bg-slate-900/50 p-2 rounded mt-1 border border-slate-700/50">
                                                {request.terms}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-xs text-slate-500 uppercase">Agency Info</span>
                                            <p className="text-slate-300 text-sm bg-slate-900/50 p-2 rounded mt-1 border border-slate-700/50">
                                                {request.agentInfo}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-xs text-slate-500 uppercase">OpenSign Certificate ID</span>
                                            <div className="flex items-center gap-2 mt-1">
                                                <p className="text-blue-400 font-mono text-sm bg-blue-900/20 p-2 rounded border border-blue-500/20 flex-1 break-all">
                                                    {request.openSignDocumentId}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="md:col-span-2">
                                            <span className="text-xs text-slate-500 uppercase">Commission (Sliding Scale)</span>
                                            <p className="text-emerald-400 font-bold text-sm bg-slate-900/50 p-2 rounded mt-1 border border-emerald-500/20">
                                                {calculateCommission(request.amount)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full md:w-auto flex flex-col justify-center border-t md:border-t-0 md:border-l border-slate-700 pt-4 md:pt-0 md:pl-6">
                                    <button
                                        onClick={() => handleApprove(request)}
                                        disabled={request.status === 'approved' || isProcessing === request.id}
                                        className={`px-6 py-3 rounded font-bold shadow-lg transition-all flex items-center justify-center min-w-[200px] ${request.status === 'approved'
                                            ? 'bg-slate-700 text-slate-500 cursor-not-allowed border border-slate-600'
                                            : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white'
                                            }`}
                                    >
                                        {isProcessing === request.id ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 rounded-full border-2 border-slate-200 border-t-transparent animate-spin" />
                                                Inscribing...
                                            </div>
                                        ) : request.status === 'approved' ? (
                                            'Inscribed'
                                        ) : (
                                            'Approve & Inscribe'
                                        )}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default AllocationApprovalPage;
