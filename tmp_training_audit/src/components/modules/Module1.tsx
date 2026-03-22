import { ModuleLayout } from '../ModuleLayout';
import {
  FileText,
  Briefcase,
  ClipboardCheck,
  Calendar,
  Clock,
  UserX,
  Lock,
  Shield,
  Users,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useTraining } from '../../context/TrainingContext';
import { Quiz, Question } from '../Quiz';

const module1Questions: Question[] = [
  {
    id: 1,
    question: "What is your primary relationship with Goldbackbond Inc. under this agreement?",
    options: [
      "W-2 Employee with full benefits",
      "Independent Contractor (1099)",
      "Executive Board Member",
      "Registered Investment Advisor (RIA)"
    ],
    correctAnswer: 1,
    explanation: "You are an Independent Contractor. You are responsible for your own taxes, insurance, and business expenses. You are not a W-2 employee."
  },
  {
    id: 2,
    question: "For how long does the Non-Disclosure (Confidentiality) obligation last?",
    options: [
      "1 year",
      "Only during the active contract term",
      "5 years",
      "Indefinitely"
    ],
    correctAnswer: 2,
    explanation: "The Confidentiality obligation lasts for 5 years and covers all proprietary information, trade secrets, and business processes."
  },
  {
    id: 3,
    question: "Under the Contractor Services Scope, which of the following are you authorized to sell directly?",
    options: [
      "Secured Debentures",
      "Federal Reserve Gold Bars",
      "USDGB Token Allocations",
      "Company Stock Options"
    ],
    correctAnswer: 2,
    explanation: "Your primary authorized activity is facilitating sales of USDGB token allocations. You may only refer Secured Debentures and 70% LTV Loans to the appropriate licensed partners; you cannot sell them directly."
  }
];

export function Module1() {
  const { checklistItems, toggleChecklistItem } = useTraining();
  const contractItem = checklistItems.find(i => i.id === 'contract');
  const isContractSigned = contractItem?.completed ?? false;

  return (
    <ModuleLayout
      moduleId="module-1"
      moduleNumber={1}
      title="Contractor Master Agreement"
      description="Understanding your independent contractor relationship with Goldbackbond Inc. and key contract terms."
    >
      <div className="space-y-8">
        {/* Agreement Overview */}
        <section>
          <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
            <FileText className="w-6 h-6 text-gold-600" />
            Agreement Overview
          </h2>
          <div className="bg-neutral-50 rounded-xl p-6 border border-neutral-200">
            <p className="text-neutral-700 leading-relaxed">
              This agreement establishes an <strong>independent contractor relationship</strong> between
              you and Goldbackbond Inc. As a contractor, you will facilitate the sale and distribution
              of USDGB tokens and related services while maintaining compliance with all applicable
              regulations.
            </p>
          </div>
        </section>

        {/* Contractor Services Scope */}
        <section>
          <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-gold-600" />
            Contractor Services Scope
          </h2>
          <div className="space-y-4">
            <div className="p-5 bg-gold-50 rounded-xl border-2 border-gold-200">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-500 to-gold-400 flex items-center justify-center text-white font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-1">USDGB Token Allocations (Primary Activity)</h3>
                  <p className="text-neutral-600">Facilitating sales of USDGB tokens to qualified buyers</p>
                </div>
              </div>
            </div>
            <div className="p-5 bg-neutral-50 rounded-xl border border-neutral-200">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-neutral-300 flex items-center justify-center text-neutral-700 font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-1">70% LTV Lending Referrals</h3>
                  <p className="text-neutral-600">Introducing borrowers to participating lending partners</p>
                </div>
              </div>
            </div>
            <div className="p-5 bg-neutral-50 rounded-xl border border-neutral-200">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-neutral-300 flex items-center justify-center text-neutral-700 font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-1">Secured Debentures Referrals</h3>
                  <p className="text-neutral-600">Referring accredited investors to Broker-Dealer (referral only - no direct sales)</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Performance Standards */}
        <section>
          <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
            <ClipboardCheck className="w-6 h-6 text-gold-600" />
            Performance Standards
          </h2>
          <div className="bg-white rounded-xl border-2 border-neutral-200 overflow-hidden">
            <ul className="divide-y divide-neutral-200">
              <li className="flex items-start gap-4 p-4">
                <CheckCircle2 className="w-5 h-5 text-gold-600 flex-shrink-0 mt-0.5" />
                <span className="text-neutral-700">Must comply with all federal, state, and local laws</span>
              </li>
              <li className="flex items-start gap-4 p-4">
                <CheckCircle2 className="w-5 h-5 text-gold-600 flex-shrink-0 mt-0.5" />
                <span className="text-neutral-700">Must use Goldbackbond-affiliated email addresses for business communications</span>
              </li>
              <li className="flex items-start gap-4 p-4">
                <CheckCircle2 className="w-5 h-5 text-gold-600 flex-shrink-0 mt-0.5" />
                <span className="text-neutral-700">Must submit all marketing materials for approval before use</span>
              </li>
              <li className="flex items-start gap-4 p-4">
                <CheckCircle2 className="w-5 h-5 text-gold-600 flex-shrink-0 mt-0.5" />
                <span className="text-neutral-700">Must attend required training sessions and compliance updates</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Key Terms Grid */}
        <section>
          <h2 className="text-xl font-bold text-neutral-900 mb-4">Key Contract Terms</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {/* Training Period */}
            <div className="p-5 bg-neutral-50 rounded-xl border border-neutral-200">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="w-5 h-5 text-gold-600" />
                <h3 className="font-semibold text-neutral-900">Training Period</h3>
              </div>
              <p className="text-neutral-600">30 days from Effective Date to complete all required training modules</p>
            </div>

            {/* Term */}
            <div className="p-5 bg-neutral-50 rounded-xl border border-neutral-200">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-5 h-5 text-gold-600" />
                <h3 className="font-semibold text-neutral-900">Agreement Term</h3>
              </div>
              <p className="text-neutral-600">12 months with auto-renewal unless 60 days written notice provided</p>
            </div>

            {/* Termination */}
            <div className="p-5 bg-neutral-50 rounded-xl border border-neutral-200">
              <div className="flex items-center gap-3 mb-2">
                <UserX className="w-5 h-5 text-gold-600" />
                <h3 className="font-semibold text-neutral-900">Termination</h3>
              </div>
              <p className="text-neutral-600">For cause (violations) immediately, or without cause with 30 days written notice</p>
            </div>

            {/* Independent Contractor */}
            <div className="p-5 bg-neutral-50 rounded-xl border border-neutral-200">
              <div className="flex items-center gap-3 mb-2">
                <Briefcase className="w-5 h-5 text-gold-600" />
                <h3 className="font-semibold text-neutral-900">Independent Contractor Status</h3>
              </div>
              <p className="text-neutral-600">Not an employee; responsible for own taxes, insurance, and business expenses</p>
            </div>
          </div>
        </section>

        {/* Restrictive Covenants */}
        <section>
          <h2 className="text-xl font-bold text-neutral-900 mb-4">Restrictive Covenants</h2>
          <div className="space-y-4">
            <div className="p-5 bg-neutral-50 rounded-xl border border-neutral-200">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-gold-100 flex items-center justify-center flex-shrink-0">
                  <Lock className="w-5 h-5 text-gold-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-1">Confidentiality</h3>
                  <p className="text-neutral-600">5-year non-disclosure obligation covering all proprietary information, trade secrets, and business processes</p>
                </div>
              </div>
            </div>

            <div className="p-5 bg-neutral-50 rounded-xl border border-neutral-200">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-gold-100 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-gold-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-1">Non-Compete</h3>
                  <p className="text-neutral-600">During term only - expires immediately upon termination of agreement</p>
                </div>
              </div>
            </div>

            <div className="p-5 bg-neutral-50 rounded-xl border border-neutral-200">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-gold-100 flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-gold-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-1">Non-Solicitation</h3>
                  <p className="text-neutral-600">5 years post-termination - cannot solicit Goldbackbond clients or employees</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Important Notice */}
        <section>
          <div className="bg-warning/10 border-2 border-warning/30 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-warning flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-neutral-900 mb-2">Important</h3>
                <p className="text-neutral-700">
                  You must sign your individual Contractor Agreement via OpenSign before beginning any sales
                  activities. The agreement was sent to your email. Contact your supervisor if you have not
                  received it.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contract Confirmation Checkbox */}
        <section>
          <div className="bg-gradient-to-br from-gold-50 to-gold-100/50 rounded-2xl p-8 border-2 border-gold-300">
            <h2 className="text-xl font-bold text-neutral-900 mb-4 text-center">Contract Confirmation</h2>
            <label className="flex items-start gap-4 cursor-pointer group">
              <div className="relative flex-shrink-0 mt-1">
                <input
                  type="checkbox"
                  checked={isContractSigned}
                  onChange={() => toggleChecklistItem('contract')}
                  className="sr-only"
                />
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${isContractSigned
                      ? 'bg-success border-success'
                      : 'border-gold-400 bg-white group-hover:border-gold-500 group-hover:bg-gold-50'
                    }`}
                  style={{ borderWidth: '3px', borderStyle: 'solid', borderColor: isContractSigned ? '#10B981' : '#D4A633' }}
                >
                  {isContractSigned && (
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  )}
                </div>
              </div>
              <div>
                <span className="text-lg font-semibold text-neutral-900 block mb-1">
                  I confirm that I have received my individual Contractor Agreement via email and have executed it through OpenSign
                </span>
                <span className="text-sm text-neutral-500">
                  Check this box only after you have reviewed and signed your agreement
                </span>
              </div>
            </label>
          </div>
        </section>

        {/* Quiz Section */}
        {isContractSigned && (
          <Quiz
            moduleId="module-1"
            questions={module1Questions}
            passingScore={100}
          />
        )}
      </div>
    </ModuleLayout>
  );
}
