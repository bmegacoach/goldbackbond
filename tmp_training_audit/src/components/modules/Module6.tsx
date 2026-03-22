import { ExternalLink, Cpu, LayoutDashboard, Users, FileText, TrendingUp, Wallet, HeadphonesIcon, BarChart3, Zap, CheckCircle2, Award } from 'lucide-react';
import { ModuleLayout } from '../ModuleLayout';
import { Quiz, Question } from '../Quiz';

const module6Questions: Question[] = [
  {
    id: 1,
    question: "When adding a new Lead, what specific 'Goldbackbond Allocation Data' is marked as CRITICAL to capture?",
    options: [
      "The client's favorite color and hobbies",
      "Only the estimated pipeline value",
      "Buyer Wallet Address, Allocation Amount, Sales Terms, and Payment Type",
      "Their social security number and blood type"
    ],
    correctAnswer: 2,
    explanation: "Capturing the Buyer Wallet Address, Allocation Amount, Sales Terms, and Payment Type is critical because this data syncs directly to the Owner's smart contract deployment dashboard for token minting."
  },
  {
    id: 2,
    question: "How are CRM subscriptions handled for Independent Sales Agents?",
    options: [
      "Agents must pay $50/month upfront before they can access the leads dashboard",
      "Agents must buy their own external CRM license",
      "Access is complimentary as part of the contractor agreement, including all premium features",
      "Agents get a 7-day free trial, then it's deducted from commissions"
    ],
    correctAnswer: 2,
    explanation: "All Independent Sales Agents receive complimentary access to the CRM platform with unlimited storage and premium features out-of-the-box."
  },
  {
    id: 3,
    question: "What is the security protocol regarding Payment Processing?",
    options: [
      "Agents should securely write down the client's credit card number on a notepad",
      "Payments are handled through Stripe (PCI-DSS compliant). Agents never handle sensitive payment info directly.",
      "Agents process payments only using their personal Venmo",
      "Clients email their banking details to the agent's inbox"
    ],
    correctAnswer: 1,
    explanation: "All payments route through Stripe. An agent simply generates the payment link via the CRM, and the client securely enters their own details."
  }
];

export function Module6() {
  return (
    <ModuleLayout
      moduleId="module-6"
      moduleNumber={6}
      title="CRM Platform Training"
      description="Master the daily operations hub for managing leads, customers, and sales"
    >
      {/* CRM Platform Access Button */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-8">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Cpu className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-900">Access Your CRM Platform</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Open the live CRM platform in a new tab to follow along with this training and start managing your sales operations.
            </p>
            <a
              href="https://gold-back-bond-agency-firebase-2uji.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm hover:shadow-md"
            >
              Open CRM Platform
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Getting Started */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-6 h-6 text-blue-600" />
          Getting Started
        </h2>
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Account Setup</h3>
            <p className="text-gray-600 mb-3">
              Your CRM account credentials will be provided by your training coordinator. Once you receive your login information:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Navigate to the CRM platform using the button above</li>
              <li>Log in with your assigned email and temporary password</li>
              <li>Update your password on first login (required for security)</li>
              <li>Complete your profile information in Settings</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Subscription & Access</h3>
            <p className="text-gray-600">
              All Independent Sales Agents receive complimentary access to the CRM platform as part of their contractor agreement. Your subscription includes all premium features, unlimited data storage, and priority support.
            </p>
          </div>
        </div>
      </section>

      {/* Dashboard Overview */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <LayoutDashboard className="w-6 h-6 text-blue-600" />
          Dashboard Overview
        </h2>
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <p className="text-gray-600">
            The Dashboard is your command center, providing real-time insights into your sales performance and quick access to critical functions.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Key Performance Indicators (KPIs)</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• <strong>Total Leads:</strong> Active prospects in your pipeline</li>
                <li>• <strong>Active Customers:</strong> Clients with active investments</li>
                <li>• <strong>Revenue (MTD):</strong> Month-to-date earnings</li>
                <li>• <strong>Conversion Rate:</strong> Lead-to-customer percentage</li>
              </ul>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Quick Actions</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Add New Lead (quick capture form)</li>
                <li>• Create Customer Profile</li>
                <li>• Build Investment Package</li>
                <li>• Process Payment</li>
                <li>• Open Support Ticket</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Structure */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Navigation Structure</h2>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-gray-600 mb-4">
            The CRM uses a sidebar navigation system for easy access to all modules:
          </p>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <LayoutDashboard className="w-5 h-5 text-gray-600 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900">Dashboard</p>
                <p className="text-sm text-gray-600">Overview and quick actions</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Users className="w-5 h-5 text-gray-600 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900">Leads & Customers</p>
                <p className="text-sm text-gray-600">Manage your sales contacts</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <FileText className="w-5 h-5 text-gray-600 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900">Investment Packages</p>
                <p className="text-sm text-gray-600">Create and manage offerings</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-gray-600 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900">Pipeline</p>
                <p className="text-sm text-gray-600">Track deal progress</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Wallet className="w-5 h-5 text-gray-600 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900">Payments</p>
                <p className="text-sm text-gray-600">Process transactions</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <HeadphonesIcon className="w-5 h-5 text-gray-600 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900">Support</p>
                <p className="text-sm text-gray-600">Ticket management</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <BarChart3 className="w-5 h-5 text-gray-600 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900">Analytics</p>
                <p className="text-sm text-gray-600">Performance insights</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lead Management */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Users className="w-6 h-6 text-blue-600" />
          Lead Management - Lead Mastery
        </h2>
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <p className="text-gray-600">
            The Lead Mastery module is your first touchpoint with potential customers. Effective lead management is crucial for building a strong sales pipeline.
          </p>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Adding a New Lead</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
              <li>Click "Add New Lead" from the Dashboard or Leads page</li>
              <li>Enter required personal information: Name, Email, Phone</li>
              <li><strong>CRITICAL:</strong> Input the Goldbackbond Allocation Data: Buyer Wallet Address (0x...), Allocation Amount, Sales Terms, and Payment Type (FIAT/CRYPTO). This data is synced directly to the Owner's smart contract deployment dashboard.</li>
              <li>Set lead pipeline stage and estimated value</li>
              <li>Assign follow-up date and time</li>
            </ol>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Lead Status Workflow</h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between text-sm font-medium text-gray-700">
                <span className="px-3 py-1 bg-gray-200 rounded">New</span>
                <span className="text-gray-400">→</span>
                <span className="px-3 py-1 bg-blue-200 rounded">Contacted</span>
                <span className="text-gray-400">→</span>
                <span className="px-3 py-1 bg-green-200 rounded">Qualified</span>
                <span className="text-gray-400">→</span>
                <span className="px-3 py-1 bg-purple-200 rounded">Customer</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Best Practices</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
              <li>Log all interactions immediately (calls, emails, meetings)</li>
              <li>Update lead status after each touchpoint</li>
              <li>Set reminders for follow-ups (never let leads go cold)</li>
              <li>Use tags for easy filtering and segmentation</li>
              <li>Qualify leads early to focus on high-potential prospects</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Customer Management */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Users className="w-6 h-6 text-blue-600" />
          Customer Management - Client Intelligence
        </h2>
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <p className="text-gray-600">
            Once a lead converts, they move to Customer Management where you track their entire investment lifecycle.
          </p>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Customer Profile Components</h3>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="border border-gray-200 rounded p-3">
                <p className="font-medium text-gray-900 mb-1">Basic Information</p>
                <p className="text-sm text-gray-600">Name, contact details, location, preferred communication method</p>
              </div>
              <div className="border border-gray-200 rounded p-3">
                <p className="font-medium text-gray-900 mb-1">Investment Portfolio</p>
                <p className="text-sm text-gray-600">Active packages, total invested, maturity dates, ROI tracking</p>
              </div>
              <div className="border border-gray-200 rounded p-3">
                <p className="font-medium text-gray-900 mb-1">Transaction History</p>
                <p className="text-sm text-gray-600">All payments, withdrawals, and account activities</p>
              </div>
              <div className="border border-gray-200 rounded p-3">
                <p className="font-medium text-gray-900 mb-1">Communication Log</p>
                <p className="text-sm text-gray-600">Notes, emails, calls, meetings - complete interaction history</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Customer Lifecycle Management</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
              <li><strong>Onboarding:</strong> Welcome emails, initial setup, first investment</li>
              <li><strong>Growth:</strong> Additional investments, referrals, upsell opportunities</li>
              <li><strong>Retention:</strong> Regular check-ins, performance updates, relationship building</li>
              <li><strong>At-Risk:</strong> Proactive outreach if engagement drops</li>
              <li><strong>Win-Back:</strong> Re-engagement campaigns for inactive customers</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Investment Packages */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <FileText className="w-6 h-6 text-blue-600" />
          Investment Packages
        </h2>
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <p className="text-gray-600">
            The Package Builder allows you to create customized investment offerings for your clients based on the approved Goldbackbond products.
          </p>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Creating a Package</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
              <li>Navigate to Investment Packages → Create New</li>
              <li>Select package tier (Starter, Growth, Premium, Enterprise)</li>
              <li>Set investment amount (within approved ranges)</li>
              <li>Choose term length (1, 3, 5, or 10 years)</li>
              <li>Review projected returns based on Module 2 calculations</li>
              <li>Add any special notes or conditions</li>
              <li>Assign to specific customer or keep as template</li>
            </ol>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Package Management Features</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
              <li>Save packages as reusable templates</li>
              <li>Clone and modify existing packages</li>
              <li>Track package status (Draft, Active, Expired, Completed)</li>
              <li>Generate PDF proposals for client presentations</li>
              <li>Monitor performance metrics per package</li>
            </ul>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-800">
              <strong>Important:</strong> All package terms must comply with the Goldbackbond Investment Structure outlined in Module 2. The CRM automatically validates packages against approved parameters.
            </p>
          </div>
        </div>
      </section>

      {/* Sales Pipeline */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-blue-600" />
          Sales Pipeline Management
        </h2>
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <p className="text-gray-600">
            The Pipeline view provides a visual Kanban-style board to track deals from initial contact through closing.
          </p>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Pipeline Stages</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Initial Contact</p>
                  <p className="text-sm text-gray-600">First touchpoint, needs qualification</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded">
                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Qualification</p>
                  <p className="text-sm text-gray-600">Assessing fit and interest level</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded">
                <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Proposal</p>
                  <p className="text-sm text-gray-600">Package presented, awaiting decision</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-amber-50 rounded">
                <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Negotiation</p>
                  <p className="text-sm text-gray-600">Terms discussion, objection handling</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Closing</p>
                  <p className="text-sm text-gray-600">Final steps, contract signing, payment processing</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Pipeline Best Practices</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
              <li>Move deals between stages promptly to maintain accuracy</li>
              <li>Set expected close dates for forecasting</li>
              <li>Add detailed notes before moving to next stage</li>
              <li>Review pipeline weekly to identify bottlenecks</li>
              <li>Update deal values as negotiations progress</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Payment Processing */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Wallet className="w-6 h-6 text-blue-600" />
          Payment Processing
        </h2>
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <p className="text-gray-600">
            The CRM integrates with Stripe for secure payment processing. All transactions are automatically recorded and linked to customer profiles.
          </p>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Processing a Payment</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
              <li>Navigate to Payments → New Transaction</li>
              <li>Select customer (or create new customer record)</li>
              <li>Choose payment method (Card, Bank Transfer, ACH)</li>
              <li>Enter amount and add description</li>
              <li>Link to investment package if applicable</li>
              <li>Review and submit - customer receives payment link via email</li>
              <li>System auto-updates upon successful payment</li>
            </ol>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Management Features</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
              <li>View all transactions with advanced filtering</li>
              <li>Export payment reports for accounting</li>
              <li>Set up recurring payment schedules</li>
              <li>Track pending, completed, and failed transactions</li>
              <li>Issue refunds directly from the CRM</li>
              <li>Generate payment receipts and invoices</li>
            </ul>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800">
              <strong>Security Note:</strong> All payments are PCI-DSS compliant and processed through Stripe. Agents never handle sensitive payment information directly.
            </p>
          </div>
        </div>
      </section>

      {/* Support Ticket System */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <HeadphonesIcon className="w-6 h-6 text-blue-600" />
          Support Ticket System
        </h2>
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <p className="text-gray-600">
            The integrated support system helps you manage customer inquiries, technical issues, and service requests efficiently.
          </p>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Creating a Support Ticket</h3>
            <p className="text-gray-700 mb-2">Support tickets can be created in three ways:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
              <li><strong>Manual Creation:</strong> Click "New Ticket" and fill in details</li>
              <li><strong>Customer Portal:</strong> Customers can submit tickets directly</li>
              <li><strong>Email Integration:</strong> Emails to support@ auto-create tickets</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Ticket Priority Levels</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="border border-gray-300 rounded p-3 text-center">
                <p className="font-semibold text-gray-600">Low</p>
                <p className="text-xs text-gray-500">48hr response</p>
              </div>
              <div className="border border-blue-300 bg-blue-50 rounded p-3 text-center">
                <p className="font-semibold text-blue-700">Medium</p>
                <p className="text-xs text-blue-600">24hr response</p>
              </div>
              <div className="border border-amber-300 bg-amber-50 rounded p-3 text-center">
                <p className="font-semibold text-amber-700">High</p>
                <p className="text-xs text-amber-600">8hr response</p>
              </div>
              <div className="border border-red-300 bg-red-50 rounded p-3 text-center">
                <p className="font-semibold text-red-700">Critical</p>
                <p className="text-xs text-red-600">2hr response</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Ticket Resolution Workflow</h3>
            <ol className="list-decimal list-inside space-y-1 text-gray-700 ml-4">
              <li>Ticket created and assigned based on category</li>
              <li>Agent acknowledges and investigates issue</li>
              <li>Internal notes added for team collaboration</li>
              <li>Customer updates provided via ticket thread</li>
              <li>Issue resolved and solution documented</li>
              <li>Customer confirms resolution</li>
              <li>Ticket closed and archived</li>
            </ol>
          </div>
        </div>
      </section>

      {/* Analytics & Reporting */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-blue-600" />
          Analytics & Reporting
        </h2>
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <p className="text-gray-600">
            Comprehensive analytics help you understand your performance, identify trends, and make data-driven decisions to optimize your sales strategy.
          </p>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Key Reports Available</h3>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="border border-gray-200 rounded p-4">
                <p className="font-semibold text-gray-900 mb-2">Sales Performance</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Revenue by month/quarter/year</li>
                  <li>• Deal win rate and average deal size</li>
                  <li>• Sales cycle length analysis</li>
                  <li>• Top performing products</li>
                </ul>
              </div>
              <div className="border border-gray-200 rounded p-4">
                <p className="font-semibold text-gray-900 mb-2">Customer Analytics</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Customer acquisition cost (CAC)</li>
                  <li>• Lifetime value (LTV)</li>
                  <li>• Retention and churn rates</li>
                  <li>• Customer segmentation</li>
                </ul>
              </div>
              <div className="border border-gray-200 rounded p-4">
                <p className="font-semibold text-gray-900 mb-2">Pipeline Health</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Deals by stage distribution</li>
                  <li>• Conversion rates per stage</li>
                  <li>• Forecasted revenue</li>
                  <li>• Stalled deal identification</li>
                </ul>
              </div>
              <div className="border border-gray-200 rounded p-4">
                <p className="font-semibold text-gray-900 mb-2">Activity Reports</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Calls, emails, meetings logged</li>
                  <li>• Response time metrics</li>
                  <li>• Task completion rates</li>
                  <li>• Agent productivity scores</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Custom Report Builder</h3>
            <p className="text-gray-700 mb-2">Create custom reports tailored to your specific needs:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
              <li>Select data sources (Leads, Customers, Deals, Payments)</li>
              <li>Apply filters by date range, status, tags, or custom fields</li>
              <li>Choose visualization type (Table, Chart, Graph)</li>
              <li>Schedule automatic report generation and email delivery</li>
              <li>Export to PDF, Excel, or CSV for external use</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Smart Workflows */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Zap className="w-6 h-6 text-blue-600" />
          Smart Workflows & Automation
        </h2>
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <p className="text-gray-600">
            The CRM includes powerful automation features to reduce manual tasks and ensure consistent follow-up with leads and customers.
          </p>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Pre-Built Automation Workflows</h3>
            <div className="space-y-3">
              <div className="border border-gray-200 rounded-lg p-4">
                <p className="font-semibold text-gray-900 mb-1">Lead Nurture Sequence</p>
                <p className="text-sm text-gray-600 mb-2">Automatically sends a series of educational emails to new leads over 2 weeks</p>
                <p className="text-xs text-gray-500">Trigger: New lead added → Wait 1 day → Email 1 → Wait 3 days → Email 2 → Wait 3 days → Email 3</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <p className="font-semibold text-gray-900 mb-1">Customer Onboarding</p>
                <p className="text-sm text-gray-600 mb-2">Guides new customers through initial setup with automated tasks and welcome materials</p>
                <p className="text-xs text-gray-500">Trigger: Deal closed → Welcome email → Create onboarding tasks → Schedule kickoff call reminder</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <p className="font-semibold text-gray-900 mb-1">Follow-Up Reminders</p>
                <p className="text-sm text-gray-600 mb-2">Creates tasks when leads or customers haven't been contacted in X days</p>
                <p className="text-xs text-gray-500">Trigger: No activity for 7 days → Create follow-up task → Notify agent</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Benefits of Automation</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
              <li>Never miss a follow-up opportunity</li>
              <li>Maintain consistent communication with all contacts</li>
              <li>Free up time for high-value activities</li>
              <li>Improve response times and customer satisfaction</li>
              <li>Scale your operations without adding admin work</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Daily Workflow Checklist */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-6 h-6 text-blue-600" />
          Daily Workflow Checklist
        </h2>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-gray-600 mb-4">
            Follow this daily routine to maximize your effectiveness and ensure no opportunities slip through the cracks:
          </p>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-6 h-6 rounded border-2 border-gray-400 flex items-center justify-center mt-0.5">
                <span className="text-xs text-gray-600">1</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Review Dashboard (8:00 AM)</p>
                <p className="text-sm text-gray-600">Check overnight notifications, review KPIs, identify priorities for the day</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-6 h-6 rounded border-2 border-gray-400 flex items-center justify-center mt-0.5">
                <span className="text-xs text-gray-600">2</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Process New Leads (8:15 AM)</p>
                <p className="text-sm text-gray-600">Review and qualify new leads, assign priorities, schedule initial contact</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-6 h-6 rounded border-2 border-gray-400 flex items-center justify-center mt-0.5">
                <span className="text-xs text-gray-600">3</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Complete Scheduled Follow-Ups (9:00 AM - 12:00 PM)</p>
                <p className="text-sm text-gray-600">Work through today's task list, log all interactions immediately</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-6 h-6 rounded border-2 border-gray-400 flex items-center justify-center mt-0.5">
                <span className="text-xs text-gray-600">4</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Pipeline Review (12:00 PM)</p>
                <p className="text-sm text-gray-600">Update deal stages, identify stuck deals, adjust forecasts</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-6 h-6 rounded border-2 border-gray-400 flex items-center justify-center mt-0.5">
                <span className="text-xs text-gray-600">5</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Proactive Outreach (1:00 PM - 4:00 PM)</p>
                <p className="text-sm text-gray-600">Contact warm leads, check in with existing customers, nurture relationships</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-6 h-6 rounded border-2 border-gray-400 flex items-center justify-center mt-0.5">
                <span className="text-xs text-gray-600">6</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Administrative Tasks (4:00 PM - 5:00 PM)</p>
                <p className="text-sm text-gray-600">Process payments, update customer records, respond to support tickets</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-6 h-6 rounded border-2 border-gray-400 flex items-center justify-center mt-0.5">
                <span className="text-xs text-gray-600">7</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">End-of-Day Planning (5:00 PM)</p>
                <p className="text-sm text-gray-600">Review completed tasks, schedule tomorrow's activities, set follow-up reminders</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Certification Requirements */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Award className="w-6 h-6 text-blue-600" />
          CRM Training Certification
        </h2>
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
          <p className="text-gray-700 mb-4">
            To complete Module 6 and earn your CRM Platform certification, you must demonstrate practical proficiency:
          </p>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-gray-700"><strong>Access the CRM:</strong> Log in successfully and complete your profile</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-gray-700"><strong>Add 3 Test Leads:</strong> Create sample lead records with complete information</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-gray-700"><strong>Convert 1 Lead to Customer:</strong> Move through qualification and create a customer profile</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-gray-700"><strong>Build 1 Investment Package:</strong> Use the package builder to create a sample offering</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-gray-700"><strong>Create 1 Deal in Pipeline:</strong> Add a deal and move it through at least 2 stages</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-gray-700"><strong>Log Interactions:</strong> Add notes, calls, or emails to at least 2 contacts</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-gray-700"><strong>Generate 1 Report:</strong> Run any analytics report and review the data</p>
            </div>
          </div>
          <div className="mt-6 p-4 bg-white rounded-lg border border-blue-200">
            <p className="text-sm text-gray-700">
              <strong>Verification:</strong> Your training coordinator will review your CRM activity logs to confirm completion. Once verified, mark this module as complete using the button at the top of this page.
            </p>
          </div>
        </div>
      </section>

      {/* CRM Link Reminder */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-blue-600" />
          Ready to Get Started?
        </h3>
        <p className="text-gray-600 mb-4">
          Open the CRM platform and begin your hands-on training. Remember to follow the Daily Workflow Checklist and complete all certification requirements.
        </p>
        <a
          href="https://gold-back-bond-agency-firebase-2uji.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm hover:shadow-md"
        >
          Launch CRM Platform
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* Quiz Section */}
      <Quiz
        moduleId="module-6"
        questions={module6Questions}
        passingScore={100}
      />
    </ModuleLayout>
  );
}
