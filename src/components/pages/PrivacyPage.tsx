import { motion } from 'framer-motion'
import { Shield, Lock, FileText, Users, AlertTriangle, Mail } from 'lucide-react'

const PrivacyPage = () => {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-500/20 rounded-full mb-6">
              <Shield className="h-8 w-8 text-amber-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Your privacy and data security are fundamental to our mission of providing trusted financial services.
            </p>
          </motion.div>

        {/* Privacy Policy Content */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="bg-slate-800/60 backdrop-blur-sm border border-amber-500/20 rounded-3xl p-8 md:p-12"
          >
            <div className="prose prose-lg prose-invert max-w-none">
              
              {/* Header */}
              <div className="mb-8 p-6 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                <h2 className="text-2xl font-bold text-white mb-2">GoldBackBond Privacy Policy</h2>
                <p className="text-amber-300 mb-0"><strong>Effective Date:</strong> July 10, 2025</p>
              </div>

              {/* Section 1: Introduction */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <FileText className="h-5 w-5 text-amber-400 mr-2" />
                  1. Introduction
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  This Privacy Policy describes how Goldbackbond Inc., a Texas Corporation ("Company," "we," "us," or "our"), collects, uses, shares, and protects your personal information when you use our website, mobile application, and all related tools and services (collectively, the "Services").
                </p>
                <p className="text-gray-300 leading-relaxed">
                  By creating an account or using our Services, you agree to the collection, use, and disclosure of your information as described in this Privacy Policy. If you do not agree, please do not use the Services.
                </p>
              </div>

              {/* Section 2: Information We Collect */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Users className="h-5 w-5 text-amber-400 mr-2" />
                  2. Information We Collect
                </h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  We collect information to provide and improve our Services, to comply with our legal obligations, and to keep our platform secure. We collect the following types of information:
                </p>

                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-white mb-3">A. Information You Provide Directly:</h4>
                  <ul className="space-y-2 text-gray-300">
                    <li><strong>Account Registration Information:</strong> When you open an account, we collect your name, email address, password, and phone number.</li>
                    <li><strong>Identity Verification Information (KYC/AML):</strong> To comply with federal and state laws and regulations, we are required to collect identity verification information. This may include your full legal name, physical address, date of birth, Social Security Number, and a copy of your government-issued identification (e.g., passport or driver's license). We may use trusted third-party services to verify this information.</li>
                    <li><strong>Financial Information:</strong> To facilitate transactions, we may collect bank account information, debit card details, and other payment information required to fund your account.</li>
                    <li><strong>Communications:</strong> We collect information you provide when you contact our customer support team or communicate with us in any other way.</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">B. Information We Collect Automatically:</h4>
                  <ul className="space-y-2 text-gray-300">
                    <li><strong>Transactional Information:</strong> We collect information about the transactions you conduct on our platform, including the types of trades you make, staking and lending activity, account balances, and public wallet addresses. Note that blockchain transactions are, by their nature, public.</li>
                    <li><strong>Usage and Device Information:</strong> We automatically collect information about your device and how you interact with our Services. This includes your IP address, browser type, operating system, device identifiers, pages viewed, and the dates and times of your visits.</li>
                    <li><strong>Cookies and Tracking Technologies:</strong> We use cookies, web beacons, and similar technologies to help us operate our Services, enhance your experience, and collect usage data. You can control the use of cookies at the individual browser level.</li>
                  </ul>
                </div>
              </div>

              {/* Section 3: How We Use Your Information */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Lock className="h-5 w-5 text-amber-400 mr-2" />
                  3. How We Use Your Information
                </h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  We use the information we collect for the following purposes:
                </p>
                <ul className="space-y-2 text-gray-300">
                  <li><strong>To Provide and Maintain the Services:</strong> To create and manage your account, process your transactions, and provide you with customer support.</li>
                  <li><strong>For Legal and Compliance Obligations:</strong> To verify your identity in accordance with Anti-Money Laundering (AML), Know-Your-Customer (KYC), and Counter-Financing of Terrorism (CFT) requirements, and to respond to legal requests and prevent fraud.</li>
                  <li><strong>For Security:</strong> To protect the security and integrity of our platform, our users' accounts, and to prevent fraudulent or unauthorized activity.</li>
                  <li><strong>To Communicate with You:</strong> To send you administrative notifications, service updates, security alerts, and support messages.</li>
                  <li><strong>For Marketing:</strong> To send you promotional materials about new products or other information we think you may find interesting. You may opt out of receiving marketing communications at any time.</li>
                  <li><strong>To Improve Our Services:</strong> To analyze usage trends and user behavior in order to improve the functionality and user experience of our platform.</li>
                </ul>
              </div>

              {/* Section 4: How We Share Your Information */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Shield className="h-5 w-5 text-amber-400 mr-2" />
                  4. How We Share Your Information
                </h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  We do not sell your personal information. We may share your information only in the following circumstances:
                </p>
                <ul className="space-y-2 text-gray-300">
                  <li><strong>With Service Providers:</strong> We share information with third-party vendors and service providers who perform services on our behalf, such as identity verification, cloud hosting, payment processing, and data analytics. These providers are contractually obligated to protect your information and may not use it for any other purpose.</li>
                  <li><strong>With Financial Partners:</strong> To the extent necessary to facilitate lending or other financial transactions you initiate, we may share information with the transaction counterparties.</li>
                  <li><strong>For Legal and Law Enforcement Purposes:</strong> We may disclose your information to law enforcement, government officials, or other third parties if we are compelled to do so by a subpoena, court order, or similar legal procedure, or if we believe in good faith that the disclosure is necessary to prevent physical harm or financial loss or to report suspected illegal activity.</li>
                  <li><strong>In Connection with a Business Transfer:</strong> If we are involved in a merger, acquisition, financing, or sale of all or a portion of our assets, your information may be shared or transferred as part of that transaction.</li>
                  <li><strong>With Your Consent:</strong> We may share your information with other third parties with your explicit consent.</li>
                </ul>
              </div>

              {/* Section 5: Data Security and Retention */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Lock className="h-5 w-5 text-amber-400 mr-2" />
                  5. Data Security and Retention
                </h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  We implement and maintain reasonable administrative, physical, and technical security safeguards to help protect your information from loss, theft, misuse, and unauthorized access. However, no security system is impenetrable, and we cannot guarantee the security of our systems 100%.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  We will retain your personal information for as long as your account is active and for a period of at least five (5) years after your account is closed to comply with our legal obligations, such as record-keeping and AML requirements.
                </p>
              </div>

              {/* Section 6: Your Privacy Rights and Choices */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Users className="h-5 w-5 text-amber-400 mr-2" />
                  6. Your Privacy Rights and Choices
                </h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Depending on your jurisdiction, you may have certain rights regarding your personal information. These may include the right to:
                </p>
                <ul className="space-y-2 text-gray-300">
                  <li>Access the personal information we hold about you.</li>
                  <li>Request that we correct any inaccurate personal information.</li>
                  <li>Request that we delete your personal information, subject to our legal and regulatory retention obligations.</li>
                  <li>Opt out of marketing communications by following the unsubscribe instructions in the emails we send.</li>
                </ul>
                <p className="text-gray-300 leading-relaxed mt-4">
                  To exercise these rights, please contact us using the information below.
                </p>
              </div>

              {/* Section 7: Children's Privacy */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <AlertTriangle className="h-5 w-5 text-amber-400 mr-2" />
                  7. Children's Privacy
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  Our Services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children under 18. If we become aware that we have inadvertently collected such information, we will take steps to delete it.
                </p>
              </div>

              {/* Section 8: Changes to This Privacy Policy */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <FileText className="h-5 w-5 text-amber-400 mr-2" />
                  8. Changes to This Privacy Policy
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  We may update this Privacy Policy from time to time. If we make material changes, we will notify you by email or by posting a notice on our website prior to the change becoming effective. We encourage you to review this policy periodically.
                </p>
              </div>

              {/* Section 9: Contact Us */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Mail className="h-5 w-5 text-amber-400 mr-2" />
                  9. Contact Us
                </h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:
                </p>
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                  <p className="text-amber-300 font-medium">privacy@goldbackbond.com</p>
                </div>
              </div>

            </div>
          </motion.div>
      </div>
    </div>
  )
}

export default PrivacyPage