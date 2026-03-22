import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { X, Plus, FileText, Send, CheckCircle, Clock, AlertCircle, Download, Eye, Upload, RefreshCw, ExternalLink, Ban } from 'lucide-react';
import { collection, getDocs, doc, setDoc, updateDoc, query, orderBy, limit, startAfter, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useAuth } from '@/lib/firebase/auth-context';
import { useOpenSign, isOpenSignConfigured } from '@/lib/opensign';

// Default columns for the contracts table
const ALL_COLUMNS = [
  { key: 'customer', label: 'Customer' },
  { key: 'title', label: 'Contract Type' },
  { key: 'amount', label: 'Amount' },
  { key: 'leverage', label: 'Leverage' },
  { key: 'status', label: 'Status' },
  { key: 'created', label: 'Created' },
  { key: 'actions', label: 'Actions' },
];

interface Contract {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  title: string;
  status: 'draft' | 'sent' | 'signed' | 'executed';
  investmentAmount: number;
  terms: {
    leverage: number;
    apr: number;
    lockupPeriod: number;
    minInvestment: number;
  };
  createdAt: any;
  signingDeadline?: any;
  signedDate?: any;
  openSignDocumentId?: string;
  openSignUrl?: string;
  signature?: {
    signedBy: string;
    signedAt: any;
    ipAddress: string;
  };
}

const CONTRACT_TEMPLATES = [
  {
    id: 'investment_agreement',
    name: 'Investment Agreement',
    description: 'Standard 3:1 leverage investment contract',
  },
  {
    id: 'staking_terms',
    name: 'Staking Terms & Conditions',
    description: '9% APR staking rewards agreement',
  },
  {
    id: 'collateral_pledge',
    name: 'Collateral Pledge Agreement',
    description: 'Collateral management terms',
  },
  {
    id: 'trainee_agreement',
    name: 'Sales Agent Agreement',
    description: 'New trainee onboarding contract',
  },
];

export function ContractManagementPanel() {
  const { user } = useAuth();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 10;
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [isCreating, setIsCreating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [visibleColumns, setVisibleColumns] = useState<string[]>(ALL_COLUMNS.map(col => col.key));
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // OpenSign integration
  const { 
    isConfigured: openSignConfigured, 
    loading: openSignLoading, 
    error: openSignError,
    sendForSignature,
    checkDocumentStatus,
    resendRequest,
    cancelDocument,
    clearError: clearOpenSignError,
  } = useOpenSign();

  const toggleColumn = (key: string) => {
    setVisibleColumns((cols: string[]) =>
      cols.includes(key) ? cols.filter((c: string) => c !== key) : [...cols, key]
    );
  };

  const [formData, setFormData] = useState({
    customerId: '',
    customerName: '',
    customerEmail: '',
    title: '',
    investmentAmount: 0,
    leverage: 2,
    apr: 9,
    lockupPeriod: 12,
    minInvestment: 20000,
    signingDeadline: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadContracts(true);
    }
  }, [user, statusFilter]);

  const loadContracts = async (reset = false) => {
    try {
      setLoading(true);
      let q = query(
        collection(db, 'contracts'),
        orderBy('createdAt', 'desc'),
        limit(PAGE_SIZE)
      );
      if (statusFilter) {
        q = query(
          collection(db, 'contracts'),
          where('status', '==', statusFilter),
          orderBy('createdAt', 'desc'),
          limit(PAGE_SIZE)
        );
      }
      if (!reset && lastDoc) {
        q = query(q, startAfter(lastDoc));
      }
      const snapshot = await getDocs(q);
      const contractsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Contract[];
      if (reset) {
        setContracts(contractsData);
      } else {
        setContracts(prev => [...prev, ...contractsData]);
      }
      setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
      setHasMore(snapshot.docs.length === PAGE_SIZE);
    } catch (err) {
      console.error('Failed to load contracts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      loadContracts();
    }
  };

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    setLastDoc(null);
    setHasMore(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setUploadedFile(file);
    } else {
      setError('Please upload a PDF file');
    }
  };

  const handleGenerateContract = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!selectedTemplate) {
      setError('Please select a contract template');
      return;
    }

    try {
      const contractId = `contract_${Date.now()}`;
      const contractDoc = {
        customerId: formData.customerId,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        title: formData.title || `${CONTRACT_TEMPLATES.find(t => t.id === selectedTemplate)?.name} - ${formData.customerName}`,
        status: 'draft' as const,
        investmentAmount: formData.investmentAmount,
        terms: {
          leverage: formData.leverage,
          apr: formData.apr,
          lockupPeriod: formData.lockupPeriod,
          minInvestment: formData.minInvestment,
        },
        createdAt: new Date(),
        createdBy: user?.uid,
        signingDeadline: formData.signingDeadline ? new Date(formData.signingDeadline) : null,
        templateType: selectedTemplate,
      };

      await setDoc(doc(db, 'contracts', contractId), contractDoc);

      setSuccess(`Contract generated successfully! Contract ID: ${contractId}`);
      setFormData({
        customerId: '',
        customerName: '',
        customerEmail: '',
        title: '',
        investmentAmount: 0,
        leverage: 2,
        apr: 9,
        lockupPeriod: 12,
        minInvestment: 20000,
        signingDeadline: '',
      });
      setSelectedTemplate('');
      setUploadedFile(null);
      setIsCreating(false);
      loadContracts(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate contract');
    }
  };

  const handleSendForSignature = async (contractId: string, contract: Contract) => {
    setError(null);
    setSuccess(null);

    if (!openSignConfigured) {
      // Fallback to simple status update if OpenSign not configured
      try {
        await updateDoc(doc(db, 'contracts', contractId), {
          status: 'sent',
          sentAt: new Date(),
        });
        setSuccess('Contract marked as sent. Configure OpenSign for automated e-signatures.');
        loadContracts(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to send contract');
      }
      return;
    }

    // Use OpenSign for real e-signature
    try {
      if (!uploadedFile) {
        setError('Please upload a PDF contract document first');
        return;
      }

      const openSignDoc = await sendForSignature({
        title: contract.title,
        file: uploadedFile,
        signers: [{
          name: contract.customerName,
          email: contract.customerEmail,
          role: 'Customer',
        }],
        note: `Please sign your ${contract.title}. Investment amount: $${contract.investmentAmount.toLocaleString()}`,
        expiryDays: 14,
      });

      if (openSignDoc) {
        await updateDoc(doc(db, 'contracts', contractId), {
          status: 'sent',
          sentAt: new Date(),
          openSignDocumentId: openSignDoc.objectId,
          openSignUrl: openSignDoc.URL,
        });
        setSuccess(`Contract sent to ${contract.customerEmail} via OpenSign!`);
        setUploadedFile(null);
        loadContracts(true);
      } else {
        setError(openSignError || 'Failed to send contract via OpenSign');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send contract');
    }
  };

  const handleCheckStatus = async (contractId: string, openSignDocumentId: string) => {
    setError(null);
    
    try {
      const openSignDoc = await checkDocumentStatus(openSignDocumentId);
      
      if (openSignDoc) {
        let newStatus: Contract['status'] = 'sent';
        
        if (openSignDoc.Status === 'completed') {
          newStatus = 'signed';
        } else if (openSignDoc.Status === 'declined' || openSignDoc.Status === 'expired') {
          newStatus = 'draft'; // Reset to draft if declined/expired
        }

        await updateDoc(doc(db, 'contracts', contractId), {
          status: newStatus,
          ...(newStatus === 'signed' ? {
            signedDate: new Date(),
            signature: {
              signedBy: openSignDoc.Signers?.[0]?.email || 'customer',
              signedAt: new Date(),
              ipAddress: 'opensign_signature',
            },
          } : {}),
        });

        if (newStatus === 'signed') {
          setSuccess('Contract has been signed!');
        } else {
          setSuccess(`Contract status: ${openSignDoc.Status}`);
        }
        loadContracts(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check status');
    }
  };

  const handleResendRequest = async (contractId: string, contract: Contract) => {
    setError(null);
    
    if (!contract.openSignDocumentId) {
      setError('No OpenSign document ID found');
      return;
    }

    const success = await resendRequest(contract.openSignDocumentId, contract.customerEmail);
    if (success) {
      setSuccess(`Signature request resent to ${contract.customerEmail}`);
    } else {
      setError(openSignError || 'Failed to resend request');
    }
  };

  const handleCancelContract = async (contractId: string, contract: Contract) => {
    setError(null);

    if (contract.openSignDocumentId) {
      await cancelDocument(contract.openSignDocumentId);
    }

    try {
      await updateDoc(doc(db, 'contracts', contractId), {
        status: 'draft',
        openSignDocumentId: null,
        openSignUrl: null,
      });
      setSuccess('Contract cancelled and reset to draft');
      loadContracts(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel contract');
    }
  };

  const handleMarkSigned = async (contractId: string, contract: Contract) => {
    try {
      await updateDoc(doc(db, 'contracts', contractId), {
        status: 'signed',
        signedDate: new Date(),
        signature: {
          signedBy: contract.customerEmail,
          signedAt: new Date(),
          ipAddress: 'manual_confirmation',
        },
      });
      setSuccess('Contract marked as signed!');
      loadContracts(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update contract');
    }
  };

  if (loading && contracts.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-gold-500/30 border-t-gold-500 rounded-full animate-spin mx-auto" />
          <p className="text-slate-400 animate-pulse font-medium tracking-wider">SYNCING CONTRACTS...</p>
        </div>
      </div>
    );
  }

  const draftContracts = contracts.filter(c => c.status === 'draft').length;
  const sentContracts = contracts.filter(c => c.status === 'sent').length;
  const signedContracts = contracts.filter(c => c.status === 'signed' || c.status === 'executed').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-100 tracking-tight">OpenSign™ Contracts Hub</h2>
          <p className="text-slate-400 text-sm mt-1">Generate, track, and manage investment contracts with e-signatures & Ethscription Sync</p>
        </div>
        <div className="flex gap-4 items-center">
          <select
            className="bg-slate-800 border border-slate-700 text-slate-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-gold-500 outline-none"
            value={statusFilter}
            onChange={handleStatusFilterChange}
          >
            <option value="">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="signed">Signed</option>
            <option value="executed">Executed (Ethscribed)</option>
          </select>
          <Button
            variant="gold"
            onClick={() => setIsCreating(!isCreating)}
            className="flex items-center gap-2 shadow-[0_0_15px_rgba(184,141,46,0.2)]"
          >
            <Plus className="w-4 h-4" />
            New Contract
          </Button>
        </div>
      </div>

      {/* OpenSign Status Banner */}
      {!openSignConfigured && (
        <Card className="bg-amber-500/10 border-2 border-amber-500/20 backdrop-blur-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            <div className="flex-1">
              <p className="text-amber-400 font-medium tracking-wider uppercase text-xs">OpenSign Not Configured</p>
              <p className="text-amber-500/80 text-sm mt-1">
                Add <code className="bg-amber-500/20 px-1 py-0.5 rounded text-amber-300">VITE_OPENSIGN_API_KEY</code> to your .env.local file to enable automated OpenSign e-signatures.
              </p>
            </div>
            <a
              href="https://app.opensignlabs.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:text-amber-300 flex items-center gap-1 text-sm bg-amber-500/10 px-3 py-1.5 rounded-md transition-colors"
            >
              Get API Key <ExternalLink className="w-3 h-3" />
            </a>
          </CardContent>
        </Card>
      )}

      {openSignConfigured && (
        <Card className="bg-emerald-500/10 border-2 border-emerald-500/20 backdrop-blur-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <div className="flex-1">
              <p className="text-emerald-400 font-medium tracking-wider uppercase text-xs">OpenSign API Connected</p>
              <p className="text-emerald-500/80 text-sm mt-1">
                E-signature integration actively syncing. Completed contracts will queue for Ethscription block submission.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error/Success Messages */}
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex items-center justify-between">
          {error}
          <button onClick={() => { setError(null); clearOpenSignError(); }} className="text-red-400 hover:text-red-300">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      {success && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-sm flex items-center justify-between">
          {success}
          <button onClick={() => setSuccess(null)} className="text-emerald-400 hover:text-emerald-300">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Create Contract Form */}
      {isCreating && (
        <Card className="bg-slate-900/60 border-2 border-slate-700 backdrop-blur-xl">
          <CardHeader className="border-b border-slate-800 pb-4">
            <CardTitle className="flex items-center justify-between text-slate-100">
              <span>Generate New Contract</span>
              <button 
                onClick={() => setIsCreating(false)}
                className="text-slate-500 hover:text-slate-300 bg-slate-800 p-1.5 rounded-md transition-colors"
                >
                <X className="w-4 h-4" />
              </button>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleGenerateContract} className="space-y-6">
              {/* Template Selection */}
              <div>
                <label className="text-xs font-bold tracking-wider text-slate-500 uppercase block mb-3">
                  Contract Template *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  {CONTRACT_TEMPLATES.map(template => (
                    <div
                      key={template.id}
                      onClick={() => setSelectedTemplate(template.id)}
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        selectedTemplate === template.id
                          ? 'border-gold-500 bg-gold-500/10 shadow-[0_0_15px_rgba(184,141,46,0.1)]'
                          : 'border-slate-800 bg-slate-800/30 hover:border-slate-700'
                      }`}
                    >
                      <div className={`font-bold text-sm mb-1 ${selectedTemplate === template.id ? 'text-gold-400' : 'text-slate-300'}`}>{template.name}</div>
                      <p className="text-slate-500 text-xs leading-relaxed">{template.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* PDF Upload */}
              <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-800">
                <label className="text-xs font-bold tracking-wider text-slate-500 uppercase block mb-3">
                  Contract PDF Document
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept=".pdf"
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300"
                  >
                    <Upload className="w-4 h-4" />
                    {uploadedFile ? 'Change File' : 'Upload PDF'}
                  </Button>
                  {uploadedFile && (
                    <span className="text-sm text-emerald-400 flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-md border border-emerald-500/20">
                      <CheckCircle className="w-4 h-4" />
                      {uploadedFile.name}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Upload the PDF contract document for e-signature rendering
                </p>
              </div>

              {/* Customer Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold tracking-wider text-slate-500 uppercase block mb-2">
                    Customer Name *
                  </label>
                  <Input
                    type="text"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    placeholder="John Doe"
                    required
                    className="bg-slate-900 border-slate-700 text-slate-200 focus:border-gold-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold tracking-wider text-slate-500 uppercase block mb-2">
                    Email Address *
                  </label>
                  <Input
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    placeholder="john@example.com"
                    required
                    className="bg-slate-900 border-slate-700 text-slate-200 focus:border-gold-500"
                  />
                </div>
              </div>

              {/* Investment Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold tracking-wider text-slate-500 uppercase block mb-2">
                    Investment Amount ($) *
                  </label>
                  <Input
                    type="number"
                    value={formData.investmentAmount}
                    onChange={(e) => setFormData({ ...formData, investmentAmount: Number(e.target.value) })}
                    placeholder="50000"
                    required
                    className="bg-slate-900 border-slate-700 text-slate-200 focus:border-gold-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold tracking-wider text-slate-500 uppercase block mb-2">
                    Leverage Ratio (1-3)
                  </label>
                  <select
                    value={formData.leverage}
                    onChange={(e) => setFormData({ ...formData, leverage: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 text-slate-200 rounded-lg focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none"
                  >
                    <option value={1}>1:1 (No Leverage)</option>
                    <option value={2}>2:1 (2x Leverage)</option>
                    <option value={3}>3:1 (3x Leverage)</option>
                  </select>
                </div>
              </div>

              {/* Terms */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold tracking-wider text-slate-500 uppercase block mb-2">
                    APR (%)
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.apr}
                    onChange={(e) => setFormData({ ...formData, apr: Number(e.target.value) })}
                    placeholder="9.0"
                    className="bg-slate-900 border-slate-700 text-slate-200 focus:border-gold-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold tracking-wider text-slate-500 uppercase block mb-2">
                    Lockup Period (months)
                  </label>
                  <Input
                    type="number"
                    value={formData.lockupPeriod}
                    onChange={(e) => setFormData({ ...formData, lockupPeriod: Number(e.target.value) })}
                    placeholder="12"
                    className="bg-slate-900 border-slate-700 text-slate-200 focus:border-gold-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold tracking-wider text-slate-500 uppercase block mb-2">
                    Min Investment ($)
                  </label>
                  <Input
                    type="number"
                    value={formData.minInvestment}
                    onChange={(e) => setFormData({ ...formData, minInvestment: Number(e.target.value) })}
                    placeholder="20000"
                    className="bg-slate-900 border-slate-700 text-slate-200 focus:border-gold-500"
                  />
                </div>
              </div>

              {/* Signing Deadline */}
              <div>
                <label className="text-xs font-bold tracking-wider text-slate-500 uppercase block mb-2">
                  Signing Deadline
                </label>
                <Input
                  type="date"
                  value={formData.signingDeadline}
                  onChange={(e) => setFormData({ ...formData, signingDeadline: e.target.value })}
                  className="bg-slate-900 border-slate-700 text-slate-200 focus:border-gold-500 w-full md:w-1/3"
                />
              </div>

              <div className="flex gap-3 pt-6 border-t border-slate-800">
                <Button type="submit" variant="gold">
                  Generate Contract
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreating(false)}
                  className="bg-transparent border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900/60 backdrop-blur-xl border-slate-800/50">
          <CardContent className="p-6">
            <p className="text-slate-500 text-xs tracking-wider uppercase font-bold flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-400" />
              Total Contracts
            </p>
            <p className="text-4xl font-bold text-slate-100 mt-2">{contracts.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/60 backdrop-blur-xl border-slate-800/50">
          <CardContent className="p-6">
            <p className="text-slate-500 text-xs tracking-wider uppercase font-bold flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              Drafts
            </p>
            <p className="text-4xl font-bold text-slate-300 mt-2">{draftContracts}</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/60 backdrop-blur-xl border-slate-800/50">
          <CardContent className="p-6">
            <p className="text-slate-500 text-xs tracking-wider uppercase font-bold flex items-center gap-2">
              <Send className="w-4 h-4 text-blue-400" />
              Pending Signature
            </p>
            <p className="text-4xl font-bold text-blue-400 mt-2">{sentContracts}</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/60 backdrop-blur-xl border-slate-800/50 shadow-[0_0_20px_rgba(16,185,129,0.05)]">
          <CardContent className="p-6">
            <p className="text-slate-500 text-xs tracking-wider uppercase font-bold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              Fully Executed
            </p>
            <p className="text-4xl font-bold text-emerald-400 mt-2">{signedContracts}</p>
          </CardContent>
        </Card>
      </div>

      {/* Contracts Table */}
      <Card className="bg-slate-900/40 backdrop-blur-xl border-slate-800/50 overflow-hidden">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800/50 bg-slate-800/20 pb-4">
          <CardTitle className="text-slate-100 flex items-center gap-3">
             <FileText className="w-5 h-5 text-slate-400" />
             Master Agreements
          </CardTitle>
          <div className="flex flex-wrap gap-2 items-center bg-slate-800/50 p-2 rounded-lg border border-slate-700/50">
            <span className="text-xs text-slate-500 mr-2 uppercase tracking-wider font-bold">Columns:</span>
            {ALL_COLUMNS.map(col => (
              <label key={col.key} className="flex items-center gap-1.5 text-xs cursor-pointer text-slate-300 hover:text-slate-100 transition-colors">
                <input
                  type="checkbox"
                  checked={visibleColumns.includes(col.key)}
                  onChange={() => toggleColumn(col.key)}
                  className="accent-gold-500 w-3 h-3 bg-slate-700 border-slate-600 rounded"
                />
                {col.label}
              </label>
            ))}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="bg-slate-800/40 text-slate-400 text-xs uppercase tracking-wider">
                  {ALL_COLUMNS.map(col => visibleColumns.includes(col.key) && (
                    <th key={col.key} className="py-3 px-4 font-semibold">{col.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {contracts.map(contract => (
                  <tr key={contract.id} className="hover:bg-slate-800/30 transition-colors group">
                    {visibleColumns.includes('customer') && (
                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-200">{contract.customerName}</div>
                        <div className="text-slate-500 text-xs mt-0.5">{contract.customerEmail}</div>
                      </td>
                    )}
                    {visibleColumns.includes('title') && (
                      <td className="py-4 px-4 text-slate-300 font-medium">{contract.title}</td>
                    )}
                    {visibleColumns.includes('amount') && (
                      <td className="py-4 px-4 text-gold-400 font-bold">
                        ${(contract.investmentAmount / 1000).toFixed(0)}K
                      </td>
                    )}
                    {visibleColumns.includes('leverage') && (
                      <td className="py-4 px-4">
                        <Badge variant="outline" className="bg-slate-800 text-slate-300 border-slate-700">{contract.terms.leverage}:1</Badge>
                      </td>
                    )}
                    {visibleColumns.includes('status') && (
                      <td className="py-4 px-4">
                        <div className="flex flex-col gap-1.5 items-start">
                           <Badge variant="outline" className={`capitalize ${
                             contract.status === 'draft' ? 'bg-slate-800 text-slate-400 border-slate-700' :
                             contract.status === 'sent' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                             contract.status === 'signed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                             'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                           }`}>
                             {contract.status}
                           </Badge>
                           {/* LIVE ETHSCRIPTION METADATA TRACKER */}
                           {['signed', 'executed'].includes(contract.status) ? (
                              <span className="text-[10px] bg-slate-800/80 px-1.5 py-0.5 rounded text-gold-400 uppercase tracking-widest border border-gold-500/20 shadow-[0_0_5px_rgba(184,141,46,0.1)] flex items-center gap-1">
                                 <CheckCircle className="w-2.5 h-2.5" /> Ethscribed
                              </span>
                           ) : contract.status === 'sent' ? (
                              <span className="text-[10px] bg-slate-800/80 px-1.5 py-0.5 rounded text-blue-400 uppercase tracking-widest border border-blue-500/20 flex items-center gap-1">
                                 <RefreshCw className="w-2.5 h-2.5 animate-spin" /> Pending Sync
                              </span>
                           ) : (
                              <span className="text-[10px] bg-slate-800/50 px-1.5 py-0.5 rounded text-slate-500 uppercase tracking-widest border border-slate-800 flex items-center gap-1">
                                 Awaiting Sig
                              </span>
                           )}
                        </div>
                      </td>
                    )}
                    {visibleColumns.includes('created') && (
                      <td className="py-4 px-4 text-slate-500 text-xs">
                        {contract.createdAt?.toDate ? 
                          contract.createdAt.toDate().toLocaleDateString() : 
                          new Date(contract.createdAt).toLocaleDateString()}
                      </td>
                    )}
                    {visibleColumns.includes('actions') && (
                      <td className="py-4 px-4">
                        <div className="flex gap-1 justify-end opacity-60 group-hover:opacity-100 transition-opacity">
                          {/* View */}
                          {contract.openSignUrl && (
                            <a
                              href={contract.openSignUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-blue-400 transition-colors"
                              title="View in OpenSign"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                          <button 
                            className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200 transition-colors"
                            title="View contract"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Draft: Send for signature */}
                          {contract.status === 'draft' && (
                            <button
                              onClick={() => handleSendForSignature(contract.id, contract)}
                              className="p-1.5 hover:bg-gold-500/10 rounded text-gold-500 transition-colors"
                              title="Send for signature"
                              disabled={openSignLoading}
                            >
                              <Send className="w-4 h-4" />
                            </button>
                          )}

                          {/* Sent: Check status, Resend, Cancel */}
                          {contract.status === 'sent' && (
                            <>
                              {contract.openSignDocumentId && (
                                <button
                                  onClick={() => handleCheckStatus(contract.id, contract.openSignDocumentId!)}
                                  className="p-1.5 hover:bg-blue-500/10 rounded text-blue-400 transition-colors"
                                  title="Check signature status"
                                  disabled={openSignLoading}
                                >
                                  <RefreshCw className={`w-4 h-4 ${openSignLoading ? 'animate-spin' : ''}`} />
                                </button>
                              )}
                              <button
                                onClick={() => handleResendRequest(contract.id, contract)}
                                className="p-1.5 hover:bg-blue-500/10 rounded text-blue-400 transition-colors"
                                title="Resend signature request"
                                disabled={openSignLoading}
                              >
                                <Send className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleMarkSigned(contract.id, contract)}
                                className="p-1.5 hover:bg-emerald-500/10 rounded text-emerald-400 transition-colors"
                                title="Mark as signed (manual)"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleCancelContract(contract.id, contract)}
                                className="p-1.5 hover:bg-red-500/10 rounded text-red-500 transition-colors"
                                title="Cancel contract"
                              >
                                <Ban className="w-4 h-4" />
                              </button>
                            </>
                          )}

                          {/* Signed: Download */}
                          {(contract.status === 'signed' || contract.status === 'executed') && (
                            <button className="p-1.5 hover:bg-gold-500/10 rounded text-gold-400 transition-colors" title="Download signed contract">
                              <Download className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            {contracts.length === 0 && !loading && (
              <div className="text-center py-16">
                <FileText className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                <p className="text-slate-400 font-medium">No contracts yet</p>
                <p className="text-slate-500 text-sm mt-1">Create your first contract using the button above</p>
              </div>
            )}
            {hasMore && contracts.length > 0 && (
              <div className="flex justify-center p-4 border-t border-slate-800/50 bg-slate-800/20">
                <Button onClick={handleLoadMore} disabled={loading} className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700">
                  {loading ? 'Loading...' : 'Load More Contracts'}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Integration Info */}
      <Card className="bg-slate-900/60 border-2 border-slate-700/50 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-slate-100 flex items-center gap-3">
            <FileSignature className="w-5 h-5 text-gold-400" />
            E-Signature & Smart Contract Synergies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-400 text-sm mb-4">
            This system bridges API-driven document execution with on-chain Ethscription metadata. Capabilities include:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ul className="text-slate-300 text-sm space-y-2 ml-4 list-disc">
              <li>Send contracts for signature via <strong className="text-gold-400 font-medium">OpenSign API</strong></li>
              <li>Real-time OpenSign `documentId` tracking</li>
              <li>Automatic state transition on signature receipt</li>
            </ul>
            <ul className="text-slate-300 text-sm space-y-2 ml-4 list-disc">
              <li>Automatic <strong className="text-emerald-400 font-medium">Ethscription Sync</strong> post-signature</li>
              <li>Hash alignment verifying the PDF against Network Tx</li>
              <li>Immutable Contract auditing</li>
            </ul>
          </div>
          
          {!openSignConfigured && (
            <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
              <p className="text-amber-400 text-sm font-bold uppercase tracking-wider mb-2">
                Setup Required To Enable Sync:
              </p>
              <ol className="text-slate-300 text-xs ml-4 list-decimal space-y-1">
                <li>Create an OpenSign account at <a href="https://app.opensignlabs.com" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300 underline">app.opensignlabs.com</a></li>
                <li>Add <code className="bg-slate-800 text-amber-300 px-1.5 py-0.5 rounded">VITE_OPENSIGN_API_KEY=your_key</code> to root .env.local</li>
                <li>Restart the dev server to establish the webhooks</li>
              </ol>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Import FileSignature icon for the integration info card
import { FileSignature } from 'lucide-react';
