import { useState, useEffect, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Badge } from './ui/Badge';
import { Search, Plus, Filter, Trash2, Edit2, Settings, Download, Upload, Zap } from 'lucide-react';
import { LeadFormModal } from './forms/LeadFormModal';
import { useDataStore } from '@/hooks/useDataStore';
import { useSchema, DynamicColumn } from '@/hooks/useSchema';
import { useAuth } from '@/lib/firebase/auth-context';
import { CSVService, CSVColumn } from '@/utils/CSVService';

interface Lead {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  priority: 'high' | 'medium' | 'low';
  source: string;
  stage?: number;
  estimatedValue?: number;
  closeDate?: string;
  createdAt?: Date;
  updatedAt?: Date;
  [key: string]: any;
}

export function LeadsManager() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isImporting, setIsImporting] = useState(false);

  const [showColumnCreator, setShowColumnCreator] = useState(false);
  const [newColName, setNewColName] = useState('');
  const [newColType, setNewColType] = useState<DynamicColumn['type']>('text');

  const dataStore = useDataStore<Lead>({ collectionName: 'leads' });
  const schema = useSchema({ collectionName: 'leads' });
  const { user: _user } = useAuth();

  useEffect(() => {
    let isMounted = true;
    let abortController = new AbortController();

    const loadLeads = async () => {
      try {
        setIsLoading(true);
        await dataStore.fetchAll();
        if (isMounted) {
          setIsLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Failed to load leads:', error);
          setIsLoading(false);
        }
      }
    };

    loadLeads();

    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, []);

  const leads = dataStore.data || [];

  const handleSubmit = async (formData: any) => {
    try {
      setFormError(null);
      if (editingLead?.id) {
        const current = await dataStore.fetchById(editingLead.id);
        if (current?.updatedAt !== editingLead.updatedAt) {
          throw new Error('Data has been modified by another user. Please refresh and try again.');
        }
        await dataStore.update(editingLead.id, formData);
      } else {
        await dataStore.create(formData);
      }
      setEditingLead(null);
      setIsModalOpen(false);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to save lead';
      setFormError(errorMsg);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this lead? This action cannot be undone.')) {
      try {
        await dataStore.remove(id);
      } catch (error) {
        console.error('Delete failed:', error);
        setFormError('Failed to delete lead. Please try again.');
      }
    }
  };

  const handleAddColumn = () => {
    if (!newColName.trim()) {
      setFormError('Column name is required');
      return;
    }
    const exists = schema.columns.some(col => col.label.toLowerCase() === newColName.trim().toLowerCase());
    if (exists) {
      setFormError('A column with this name already exists');
      return;
    }
    const reserved = ['id', 'firstName', 'lastName', 'email', 'phone', 'company', 'status', 'priority', 'source', 'createdAt', 'updatedAt'];
    if (reserved.includes(newColName.trim())) {
      setFormError('This field name is reserved and cannot be used');
      return;
    }

    schema.addColumn({
      label: newColName,
      type: newColType,
    });
    setNewColName('');
    setShowColumnCreator(false);
    setFormError(null);
  };

  const handleRemoveColumn = (id: string) => {
    if (window.confirm('Remove this column? Data will remain but column will be hidden.')) {
      schema.removeColumn(id);
    }
  };

  const handleEdit = (lead: Lead) => {
    setEditingLead(lead);
    setIsModalOpen(true);
  };

  const handleNewLead = () => {
    setEditingLead(null);
    setIsModalOpen(true);
  };

  const handleLaunchClosingWizard = (lead: Lead) => {
    // Inject the payload and trigger the phase 17 standalone App router flow.
    alert(`Initializing Smart Contract Deal Flow Payload for: ${lead.email}`);
    const params = new URLSearchParams({
       leadId: lead.id || '',
       name: `${lead.firstName} ${lead.lastName}`,
       email: lead.email,
       amount: lead.estimatedValue?.toString() || '10000',
    });
    const wizardUrl = import.meta.env.DEV 
      ? `http://localhost:5173/app/buy-wizard?${params.toString()}` 
      : `https://goldbackbond.vercel.app/app/buy-wizard?${params.toString()}`;
    window.open(wizardUrl, '_blank');
  };

  const filteredLeads = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return leads.filter((lead) => {
      const firstName = lead.firstName || '';
      const lastName = lead.lastName || '';
      const email = lead.email || '';
      const company = lead.company || '';

      const matchesSearch = !term ||
        firstName.toLowerCase().includes(term) ||
        lastName.toLowerCase().includes(term) ||
        email.toLowerCase().includes(term) ||
        company.toLowerCase().includes(term);

      const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || lead.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [leads, searchTerm, statusFilter, priorityFilter]);

  const statusBadgeVariant = (status: string) => {
    switch (status) {
      case 'converted': return 'success';
      case 'lost': return 'error';
      case 'qualified': return 'info';
      default: return 'outline';
    }
  };

  const priorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 font-bold';
      case 'medium': return 'text-amber-400 font-bold';
      default: return 'text-green-400 font-bold';
    }
  };

  const getExportColumns = (): CSVColumn[] => {
    const baseCols: CSVColumn[] = [
      { key: 'firstName', label: 'First Name' },
      { key: 'lastName', label: 'Last Name' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone' },
      { key: 'company', label: 'Company' },
      { key: 'status', label: 'Status' },
      { key: 'priority', label: 'Priority' },
      { key: 'source', label: 'Source' },
    ];

    const dynamicCols = schema.columns.map(col => ({
      key: col.key,
      label: col.label,
      isDynamic: true
    }));

    return [...baseCols, ...dynamicCols];
  };

  const handleExport = () => {
    CSVService.exportData(filteredLeads, getExportColumns(), `leads_export_${Date.now()}`);
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsImporting(true);
      setFormError(null);
      const importedData = await CSVService.importData(file, getExportColumns());

      let successCount = 0;
      for (const item of importedData) {
        try {
          if (!item.firstName || !item.lastName || !item.email) continue;
          await dataStore.create({
            ...item,
            status: item.status || 'new',
            priority: item.priority || 'medium',
            source: item.source || 'CSV Import',
            stage: Number(item.stage) || 1,
            estimatedValue: Number(item.estimatedValue) || 0,
            closeDate: item.closeDate || ''
          });
          successCount++;
        } catch (err) {
          console.error('Failed to import lead:', item, err);
        }
      }

      alert(`Successfully imported ${successCount} leads.`);
      await dataStore.refreshData();
    } catch (error) {
      setFormError('Failed to import CSV file. Please check the format.');
      console.error(error);
    } finally {
      setIsImporting(false);
      if (event.target) event.target.value = '';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-gold-500/30 border-t-gold-500 rounded-full animate-spin mx-auto" />
          <p className="text-slate-400 animate-pulse font-medium tracking-wider">LOADING LEADS...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-100">Leads Manager</h1>
          <p className="text-slate-400 mt-2">
            Manage and track your private pipeline
            {!dataStore.isPaid && (
              <Badge variant="warning" className="ml-2 bg-amber-500/10 text-amber-500 border border-amber-500/20">Demo Mode</Badge>
            )}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <input
            type="file"
            id="csv-import-leads"
            className="hidden"
            accept=".csv"
            onChange={handleImport}
          />
          <Button className="bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700" onClick={() => document.getElementById('csv-import-leads')?.click()} disabled={isImporting}>
            <Upload className="w-4 h-4 mr-2" />
            {isImporting ? 'Importing...' : 'Import CSV'}
          </Button>
          <Button className="bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button className="bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700" onClick={() => setShowColumnCreator(!showColumnCreator)}>
            <Settings className="w-4 h-4 mr-2" />
            Columns
          </Button>
          <Button variant="gold" size="lg" onClick={handleNewLead} className="shadow-lg shadow-gold-500/20">
            <Plus className="w-5 h-5 mr-2" />
            New Lead
          </Button>
        </div>
      </div>

      {showColumnCreator && (
        <Card className="bg-slate-900/60 border-dashed border-slate-700/50 backdrop-blur-xl">
          <CardContent className="py-4 flex flex-col md:flex-row items-end gap-4">
            <div className="flex-1 w-full">
              <label className="text-sm font-medium mb-1 block text-slate-300">Column Name</label>
              <Input 
                value={newColName} 
                onChange={(e) => setNewColName(e.target.value)} 
                placeholder="e.g. KYC Status, ETH Wallet..." 
                className="bg-slate-800 border-slate-700 text-slate-100"
              />
            </div>
            <div className="w-full md:w-48">
              <label className="text-sm font-medium mb-1 block text-slate-300">Type</label>
              <Select
                options={[
                  { label: 'Text', value: 'text' },
                  { label: 'Number', value: 'number' },
                  { label: 'Date', value: 'date' },
                  { label: 'Email', value: 'email' },
                  { label: 'Phone', value: 'phone' },
                ]}
                value={newColType}
                onChange={(e) => setNewColType(e.target.value as any)}
              />
            </div>
            <Button variant="primary" onClick={handleAddColumn} disabled={!newColName} className="w-full md:w-auto">
              <Plus className="w-4 h-4 mr-2" /> Add Field
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card className="bg-slate-900/40 backdrop-blur-xl border-slate-800/50">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2 bg-slate-800/50 rounded-lg px-3 border border-slate-700/50">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="search"
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-transparent border-none text-slate-100 placeholder:text-slate-500 focus:ring-0 text-sm py-2 outline-none"
              />
            </div>
            <Select
              label=""
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Statuses' },
                { value: 'new', label: 'New' },
                { value: 'contacted', label: 'Contacted' },
                { value: 'qualified', label: 'Qualified' },
                { value: 'converted', label: 'Converted' },
                { value: 'lost', label: 'Lost' },
              ]}
            />
            <Select
              label=""
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Priorities' },
                { value: 'high', label: 'High' },
                { value: 'medium', label: 'Medium' },
                { value: 'low', label: 'Low' },
              ]}
            />
            <Button className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {formError && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3">
           <Zap className="text-red-400 w-5 h-5 shrink-0" />
          <p className="text-red-400 text-sm font-medium">{formError}</p>
        </div>
      )}

      {/* Leads Table */}
      <Card className="bg-slate-900/40 backdrop-blur-xl border-slate-800/50 overflow-hidden">
        <CardHeader className="border-b border-slate-800/50 bg-slate-800/20">
          <CardTitle className="text-slate-100">Active Leads ({filteredLeads.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredLeads.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500">No leads found. Create your first Private Lead.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-800/40 text-slate-400 text-sm">
                    <th className="py-3 px-4 font-semibold uppercase tracking-wider text-xs">Name</th>
                    <th className="py-3 px-4 font-semibold uppercase tracking-wider text-xs">Email</th>
                    <th className="py-3 px-4 font-semibold uppercase tracking-wider text-xs">Company</th>
                    <th className="py-3 px-4 font-semibold uppercase tracking-wider text-xs">Status</th>
                    <th className="py-3 px-4 font-semibold uppercase tracking-wider text-xs">Priority</th>
                    <th className="py-3 px-4 font-semibold uppercase tracking-wider text-xs">Source</th>

                    {schema.columns.map(col => (
                      <th key={col.id} className="py-3 px-4 font-semibold uppercase tracking-wider text-xs group whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {col.label}
                          {showColumnCreator && (
                            <button onClick={() => handleRemoveColumn(col.id)} className="text-slate-500 hover:text-red-400 transition-colors">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </th>
                    ))}
                    <th className="py-3 px-4 font-semibold uppercase tracking-wider text-xs text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-800/30 transition-colors group">
                      <td className="py-4 px-4">
                        <p className="font-bold text-slate-200">
                          {lead.firstName} {lead.lastName}
                        </p>
                      </td>
                      <td className="py-4 px-4 text-slate-400 text-sm">{lead.email}</td>
                      <td className="py-4 px-4 text-slate-400 text-sm">{lead.company || '-'}</td>
                      <td className="py-4 px-4">
                        <Badge variant={statusBadgeVariant(lead.status)} className="capitalize bg-slate-800 text-slate-300">
                          {lead.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`text-sm tracking-wider uppercase ${priorityColor(lead.priority)}`}>
                          {lead.priority}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-400 text-sm capitalize">{lead.source}</td>

                      {schema.columns.map(col => (
                        <td key={col.id} className="py-4 px-4 text-slate-400 text-sm">
                          {lead[col.key] || '-'}
                        </td>
                      ))}

                      <td className="py-4 px-4">
                        <div className="flex gap-2 justify-end opacity-60 group-hover:opacity-100 transition-opacity">
                          
                          {/* NEW INTEGRATION: Phase 17 Deal Wizard Launch */}
                          <Button
                             variant="gold"
                             size="sm"
                             className="gap-2 shadow-[0_0_10px_rgba(184,141,46,0.2)]"
                             onClick={() => handleLaunchClosingWizard(lead)}
                           >
                             <Zap className="w-3.5 h-3.5" />
                             <span className="hidden xl:inline">Closing Wizard</span>
                           </Button>

                          <Button
                            className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2"
                            size="sm"
                            onClick={() => handleEdit(lead)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            className="bg-slate-800 hover:bg-red-900/50 text-slate-500 hover:text-red-400 px-2"
                            size="sm"
                            onClick={() => lead.id && handleDelete(lead.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <LeadFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingLead(null);
          setFormError(null);
        }}
        onSubmit={handleSubmit}
        loading={dataStore.loading}
        initialData={editingLead}
        error={formError}
        dynamicColumns={schema.columns}
      />
    </div>
  );
}
