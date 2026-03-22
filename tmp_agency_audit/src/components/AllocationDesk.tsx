import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Package, Lock, ShieldCheck, ArrowUpRight, Zap } from 'lucide-react';
import { useAuth } from '@/lib/firebase/auth-context';

export function AllocationDesk() {
  const { isPaid } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 600);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-gold-500/30 border-t-gold-500 rounded-full animate-spin mx-auto" />
          <p className="text-slate-400 animate-pulse font-medium tracking-wider">SYNCING ALLOCATION DESK</p>
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
            Private Allocation Desk
            {!isPaid && (
              <Badge variant="warning" className="bg-gold-500/10 text-gold-400 border border-gold-500/20 text-xs">Sandbox</Badge>
            )}
          </h1>
          <p className="text-slate-400 mt-2 text-lg">
            Manage Private Offer Caps & Active Tranches
          </p>
        </div>
      </div>

      {/* Constraints Banner */}
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex items-start gap-4 backdrop-blur-sm">
        <Lock className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-amber-500 font-bold mb-1">Global Offer Constraints Active</h4>
          <p className="text-amber-500/80 text-sm">
            The agency system is currently locked to the Phase 15 Smart Contract rules. All new client allocations issued from the CRM must meet the <strong className="text-amber-400">$10,000 USD</strong> minimum buy-in. Token issuance is hardcoded to <strong className="text-amber-400">$0.80 / USDGB</strong>.
          </p>
        </div>
      </div>

      {/* Primary Allocation Tier */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-slate-900/60 backdrop-blur-xl border-gold-500/30 overflow-hidden relative shadow-[0_0_30px_rgba(184,141,46,0.1)]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 blur-3xl rounded-full" />
          <CardHeader className="border-b border-slate-800/50 pb-6">
            <div className="flex justify-between items-start">
              <div>
                <Badge variant="default" className="bg-gold-500/10 text-gold-400 border-gold-500/20 mb-3 uppercase tracking-widest text-[10px]">Active Tranche</Badge>
                <CardTitle className="text-2xl text-slate-100 font-heading">Q1 Private Placement</CardTitle>
                <p className="text-slate-400 text-sm mt-2 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-green-400" />
                  Whitelisted Addresses Only
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500 font-medium">Fixed Price</p>
                <p className="text-2xl font-bold text-gold-400">$0.80<span className="text-sm text-slate-500">/token</span></p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                  <p className="text-xs text-slate-500 uppercase tracking-widest mb-1 font-bold">Minimum Buy</p>
                  <p className="text-xl font-bold text-slate-200">$10,000</p>
               </div>
               <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                  <p className="text-xs text-slate-500 uppercase tracking-widest mb-1 font-bold">Total Cap</p>
                  <p className="text-xl font-bold text-slate-200">$25,000,000</p>
               </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Allocated to date</span>
                <span className="text-gold-400 font-bold">14% ($3.5M)</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                <div className="bg-gradient-to-r from-gold-600 to-gold-400 h-2.5 rounded-full" style={{ width: '14%' }}></div>
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 space-y-3">
              <div className="flex gap-3">
                <Zap className="w-5 h-5 text-gold-500 shrink-0" />
                <p className="text-sm text-slate-300">Phase 17 Auto-Closing Wizard is enabled for this allocation. Agents can trigger the guided onboarding directly from a Lead record.</p>
              </div>
              <div className="flex gap-3">
                <Zap className="w-5 h-5 text-gold-500 shrink-0" />
                <p className="text-sm text-slate-300">OpenSign API is actively gating final funding instructions until the PDF is digitally executed.</p>
              </div>
            </div>
            
            <Button variant="gold" className="w-full justify-between" disabled>
               Issue Custom Allocation
               <ArrowUpRight className="w-4 h-4" />
            </Button>
            <p className="text-xs text-center text-slate-500">Manual allocation issuance disabled. To ensure Ethscription alignment, you must route clients through the Closing Wizard on their Lead profile.</p>

          </CardContent>
        </Card>

        {/* Uniswap CCA Preview */}
        <Card className="bg-slate-900/40 backdrop-blur-xl border-slate-800/50 opacity-75">
          <CardHeader className="border-b border-slate-800/50 pb-6">
            <div className="flex justify-between items-start">
              <div>
                <Badge variant="default" className="bg-slate-800 text-slate-400 border-slate-700 mb-3 uppercase tracking-widest text-[10px]">Upcoming</Badge>
                <CardTitle className="text-2xl text-slate-300 font-heading">Public CCA (Uniswap V4)</CardTitle>
                <p className="text-slate-500 text-sm mt-2">Self-Service DeFi Entry</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500 font-medium">Starting Price</p>
                <p className="text-2xl font-bold text-slate-300">$0.85<span className="text-sm text-slate-500">/token</span></p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 flex flex-col items-center justify-center min-h-[250px] text-center space-y-4">
             <Package className="w-12 h-12 text-slate-600 mb-2" />
             <p className="text-slate-400">The public Continuous Clearing Auction is currently inactive. This tier will automatically unlock once the $25M Private Allocation is fully subscribed.</p>
             <Button variant="secondary" disabled>Monitor Network Status</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

