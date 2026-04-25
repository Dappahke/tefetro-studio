// src/app/privacy/page.tsx
import { Calendar, FileText, Shield, Clock, Mail, Phone, MapPin, Eye, Database, Lock, UserCheck, Globe, Bell, Trash2, Download } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | Tefetro Studios',
  description: 'Privacy Policy for Tefetro Studios. Learn how we collect, use, and protect your personal data in compliance with the Kenya Data Protection Act, 2019.',
};

export default function PrivacyPage() {
  const lastUpdated = "April 25, 2026";
  const effectiveDate = "April 25, 2026";

  const rights = [
    {
      icon: <Eye className="w-5 h-5" />,
      title: "Right of Access",
      description: "Request a copy of all personal data we hold about you at any time.",
    },
    {
      icon: <FileText className="w-5 h-5" />,
      title: "Right to Rectification",
      description: "Request correction of inaccurate or incomplete personal data.",
    },
    {
      icon: <Trash2 className="w-5 h-5" />,
      title: "Right to Erasure",
      description: "Request deletion of your data where no longer necessary or lawful.",
    },
    {
      icon: <Lock className="w-5 h-5" />,
      title: "Right to Restriction",
      description: "Request that we limit how we process your personal data.",
    },
    {
      icon: <Download className="w-5 h-5" />,
      title: "Right to Portability",
      description: "Receive your data in a structured, machine-readable format.",
    },
    {
      icon: <UserCheck className="w-5 h-5" />,
      title: "Right to Object",
      description: "Object to processing for direct marketing or legitimate interests.",
    },
  ];

  const retentionData = [
    { category: "Customer account data", period: "Duration of account + 3 years" },
    { category: "Transaction & payment records", period: "7 years (legal compliance)" },
    { category: "Project files & client briefs", period: "2 years post-completion" },
    { category: "Marketing consent records", period: "Until withdrawal + 1 year" },
    { category: "Support correspondence", period: "3 years" },
    { category: "Website analytics data", period: "26 months (rolling)" },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blueprint-900 to-blueprint-800 text-white py-16 lg:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-accent-500" />
            <h1 className="text-3xl lg:text-4xl font-bold">Privacy Policy</h1>
          </div>
          <p className="text-blueprint-200 text-lg max-w-2xl">
            We are committed to protecting your personal data and being fully transparent about
            how we collect, use, and safeguard your information.
          </p>
          <div className="flex flex-wrap gap-6 mt-6 text-sm text-blueprint-200">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Last Updated: {lastUpdated}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Effective: {effectiveDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>Ref: TEFETRO-PP-2026-001</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">

          {/* Important Notice Banner */}
          <div className="bg-amber-50 border-b border-amber-200 px-6 py-4">
            <p className="text-amber-800 text-sm">
              <span className="font-semibold">⚠ Important: </span>
              By accessing or using tefetro.studio, you acknowledge that you have read, understood, and agree to
              be bound by the terms of this Privacy Policy. If you do not agree, please discontinue use immediately.
            </p>
          </div>

          {/* Table of Contents */}
          <div className="bg-neutral-50 border-b border-neutral-200 p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-3">Contents</h2>
            <div className="grid md:grid-cols-2 gap-2 text-sm">
              {[
                "1. Introduction and Overview",
                "2. Data Controller Information",
                "3. Information We Collect",
                "4. How We Use Your Information",
                "5. Cookies and Tracking Technologies",
                "6. Data Sharing and Disclosure",
                "7. Payment Processing",
                "8. International Data Transfers",
                "9. Data Retention",
                "10. Data Security",
                "11. Your Rights as a Data Subject",
                "12. Children's Privacy",
                "13. Digital Products and Downloads",
                "14. AI-Powered Tools",
                "15. Third-Party Links",
                "16. Marketing Communications",
                "17. Changes to This Policy",
                "18. Governing Law",
                "19. Contact Us",
                "20. Definitions",
              ].map((item) => (
                <a
                  key={item}
                  href={`#${item.split('. ')[1].toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}
                  className="text-blueprint-600 hover:text-blueprint-700"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>

          <div className="p-6 lg:p-8 space-y-10">

            {/* Section 1 */}
            <section id="introduction-and-overview">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">1. Introduction and Overview</h2>
              <p className="text-neutral-600 leading-relaxed mb-3">
                Tefetro Studios ("we," "our," "us," or "the Company") is a creative architecture studio
                operating through its digital platform at <span className="font-medium text-neutral-800">https://tefetro.studio</span>. We are committed to protecting
                the privacy and personal data of every individual who interacts with our business —
                whether as a visitor, prospective client, paying customer, or subscriber.
              </p>
              <p className="text-neutral-600 leading-relaxed mb-3">
                This Privacy Policy has been prepared in accordance with the <span className="font-medium text-neutral-800">Kenya Data Protection Act,
                2019 (No. 24 of 2019)</span> and its associated regulations, as well as broadly recognised
                international standards including the General Data Protection Regulation (GDPR) of the
                European Union, where applicable to our international clients.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-3">
                <p className="text-blue-800 text-sm">
                  <span className="font-semibold">Our Core Commitment: </span>
                  We do not sell your personal information. We do not use it for purposes beyond what
                  is disclosed in this Policy. We maintain reasonable security practices to protect it at all times.
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section id="data-controller-information">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">2. Data Controller Information</h2>
              <p className="text-neutral-600 leading-relaxed mb-4">
                Tefetro Studios is the Data Controller responsible for your personal data.
                If you have any questions, concerns, or requests relating to your personal data,
                please contact us using the details below. We will respond within <span className="font-medium text-neutral-800">14 business days</span> of receipt.
              </p>
              <div className="bg-neutral-50 rounded-xl p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-blueprint-600" />
                  <div>
                    <p className="text-sm font-medium text-neutral-700">Website</p>
                    <a href="https://tefetro.studio" className="text-blueprint-600 hover:text-blueprint-700">https://tefetro.studio</a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blueprint-600" />
                  <div>
                    <p className="text-sm font-medium text-neutral-700">Privacy Contact</p>
                    <a href="mailto:privacy@tefetro.studio" className="text-blueprint-600 hover:text-blueprint-700">privacy@tefetro.studio</a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-blueprint-600" />
                  <div>
                    <p className="text-sm font-medium text-neutral-700">Jurisdiction</p>
                    <p className="text-neutral-600">Nairobi, Kenya</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section id="information-we-collect">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">3. Information We Collect</h2>
              <p className="text-neutral-600 leading-relaxed mb-4">
                We collect personal data through multiple channels and in various categories, as described below.
              </p>

              <h3 className="text-base font-semibold text-neutral-800 mb-2">3.1 Information You Provide Directly</h3>
              <div className="space-y-3 ml-1 mb-5">
                <div>
                  <span className="font-medium text-neutral-800">Contact and Identity Information: </span>
                  <span className="text-neutral-600 text-sm">Full name, email address, phone number, business name, and physical or mailing address where applicable to service delivery.</span>
                </div>
                <div>
                  <span className="font-medium text-neutral-800">Account and Registration Information: </span>
                  <span className="text-neutral-600 text-sm">Username, password (stored in encrypted form — we never store plain-text passwords), and account preferences.</span>
                </div>
                <div>
                  <span className="font-medium text-neutral-800">Transaction and Payment Information: </span>
                  <span className="text-neutral-600 text-sm">Billing name and address, payment method type, transaction history, and invoice information. We do not store full card details on our servers.</span>
                </div>
                <div>
                  <span className="font-medium text-neutral-800">Project and Client Briefs: </span>
                  <span className="text-neutral-600 text-sm">Design briefs, project requirements, creative instructions, uploaded files, feedback, and revision correspondence.</span>
                </div>
                <div>
                  <span className="font-medium text-neutral-800">Communications: </span>
                  <span className="text-neutral-600 text-sm">Emails, messages, survey responses, and contact form submissions you send us.</span>
                </div>
              </div>

              <h3 className="text-base font-semibold text-neutral-800 mb-2">3.2 Information Collected Automatically</h3>
              <p className="text-neutral-600 text-sm leading-relaxed mb-3">
                When you visit our Site, we automatically collect device and browser information (IP address,
                browser type, operating system), usage and navigation data (pages visited, time on page,
                referring URLs, clicks and scrolls), and session and analytics data through cookies and
                similar tracking technologies.
              </p>

              <h3 className="text-base font-semibold text-neutral-800 mb-2">3.3 Information from Third Parties</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                We may receive information from payment processors (transaction confirmations), social media
                platforms (where you engage with our content), referral partners, and analytics providers
                (aggregated, anonymised data).
              </p>
            </section>

            {/* Section 4 */}
            <section id="how-we-use-your-information">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">4. How We Use Your Information</h2>
              <p className="text-neutral-600 leading-relaxed mb-4">
                We process your personal data only where we have a lawful basis to do so. Below are our
                processing purposes and the lawful basis for each.
              </p>
              <div className="space-y-4">
                {[
                  {
                    title: "To Provide Our Services",
                    body: "Processing orders, delivering purchased products and project files, managing client relationships, issuing invoices and receipts, and providing access to licensed digital downloads.",
                    basis: "Performance of contract",
                  },
                  {
                    title: "To Communicate With You",
                    body: "Responding to inquiries and support requests, sending project updates and delivery notifications, and communicating important changes to our services.",
                    basis: "Legitimate interests and/or contract performance",
                  },
                  {
                    title: "To Improve Our Site and Services",
                    body: "Analysing how visitors use our Site, developing new features, and monitoring technical errors and performance issues.",
                    basis: "Legitimate interests",
                  },
                  {
                    title: "For Marketing and Promotional Purposes",
                    body: "Sending newsletters and promotional content about our products and services. You may withdraw consent at any time.",
                    basis: "Consent (direct marketing) or legitimate interests",
                  },
                  {
                    title: "For Legal and Compliance Purposes",
                    body: "Complying with applicable laws and regulations, preventing fraud, enforcing our Terms of Service, and responding to law enforcement where legally required.",
                    basis: "Legal obligation and/or legitimate interests",
                  },
                  {
                    title: "For Financial and Tax Record Keeping",
                    body: "Maintaining accurate financial records as required under Kenyan law and applicable tax regulations.",
                    basis: "Legal obligation",
                  },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-4 p-4 rounded-xl border border-neutral-100 bg-neutral-50">
                    <div className="flex-1">
                      <p className="font-semibold text-neutral-800 text-sm mb-1">{item.title}</p>
                      <p className="text-neutral-600 text-sm">{item.body}</p>
                    </div>
                    <div className="shrink-0">
                      <span className="inline-block bg-blueprint-100 text-blueprint-700 text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap">
                        {item.basis}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 5 */}
            <section id="cookies-and-tracking-technologies">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">5. Cookies and Tracking Technologies</h2>
              <p className="text-neutral-600 leading-relaxed mb-4">
                Cookies are small text files placed on your device when you visit our Site. We use the following types:
              </p>
              <div className="space-y-3">
                {[
                  {
                    dot: "bg-green-500",
                    title: "Strictly Necessary Cookies",
                    body: "Essential for core Site functions such as security, authentication, and checkout. Cannot be disabled without significantly affecting functionality.",
                  },
                  {
                    dot: "bg-yellow-500",
                    title: "Performance and Analytics Cookies",
                    body: "Collect aggregated, anonymous data about how visitors use our Site — such as which pages are visited most often.",
                  },
                  {
                    dot: "bg-blue-500",
                    title: "Functionality Cookies",
                    body: "Remember your preferences (language, region, display settings) to provide a personalised experience during future visits.",
                  },
                  {
                    dot: "bg-purple-500",
                    title: "Marketing and Targeting Cookies",
                    body: "Used to deliver advertisements relevant to your interests. Only deployed with your explicit consent.",
                  },
                ].map((c) => (
                  <div key={c.title} className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full ${c.dot} mt-2 shrink-0`}></div>
                    <div>
                      <span className="font-semibold text-neutral-800">{c.title}: </span>
                      <span className="text-neutral-600 text-sm">{c.body}</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-neutral-600 text-sm mt-4 leading-relaxed">
                You may accept or decline non-essential cookies when prompted by our cookie consent banner,
                adjust your browser settings, or delete cookies already stored on your device. For guidance,
                visit <span className="font-medium text-neutral-800">www.allaboutcookies.org</span>.
              </p>
            </section>

            {/* Section 6 */}
            <section id="data-sharing-and-disclosure">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">6. Data Sharing and Disclosure</h2>
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-4">
                <p className="text-amber-800 text-sm font-medium">We do not sell, rent, or trade your personal data.</p>
              </div>
              <p className="text-neutral-600 leading-relaxed mb-3">
                We may share your information only in the following limited circumstances:
              </p>
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-neutral-800">Service Providers and Processors: </span>
                  <span className="text-neutral-600 text-sm">Trusted third parties we engage for website hosting, payment processing, email delivery, analytics, cloud storage, and customer support. All processors are bound by data protection obligations and may only use your data to provide services to us.</span>
                </div>
                <div>
                  <span className="font-medium text-neutral-800">Legal Requirements: </span>
                  <span className="text-neutral-600 text-sm">When required by applicable law, regulation, or court order, or to protect our rights, prevent fraud, or ensure user safety.</span>
                </div>
                <div>
                  <span className="font-medium text-neutral-800">Business Transfers: </span>
                  <span className="text-neutral-600 text-sm">In the event of a merger, acquisition, or asset sale, personal data may be transferred to the relevant third party. We will notify you of any such transfer where required by law.</span>
                </div>
                <div>
                  <span className="font-medium text-neutral-800">With Your Consent: </span>
                  <span className="text-neutral-600 text-sm">In any other circumstance where we have obtained your explicit, informed consent.</span>
                </div>
              </div>
            </section>

            {/* Section 7 */}
            <section id="payment-processing">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">7. Payment Processing</h2>
              <p className="text-neutral-600 leading-relaxed mb-3">
                All payment transactions conducted through tefetro.studio are processed by trusted,
                <span className="font-medium text-neutral-800"> PCI DSS-compliant</span> third-party payment processors.
                We do not store, process, or transmit your full payment card information on our own servers.
              </p>
              <p className="text-neutral-600 leading-relaxed">
                When you submit payment information through our checkout, you are interacting directly with
                the payment processor's secure platform. We receive only limited confirmation data
                (amount, date, and a masked reference number) necessary for our records. We encourage you
                to review the privacy policy of any payment processor you use through our platform.
              </p>
            </section>

            {/* Section 8 */}
            <section id="international-data-transfers">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">8. International Data Transfers</h2>
              <p className="text-neutral-600 leading-relaxed mb-3">
                Tefetro Studios operates primarily from Kenya. Some of our third-party service providers
                may be located in, or process data in, other countries including the European Union or
                the United States.
              </p>
              <p className="text-neutral-600 leading-relaxed">
                Where personal data is transferred outside Kenya, we take steps to ensure adequate
                safeguards are in place, including contractual protections, use of service providers
                who comply with internationally recognised security standards, and reliance on adequacy
                decisions where applicable.
              </p>
            </section>

            {/* Section 9 */}
            <section id="data-retention">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">9. Data Retention</h2>
              <p className="text-neutral-600 leading-relaxed mb-4">
                We retain personal data only for as long as necessary to fulfil the stated purpose,
                or as required by applicable law. At the end of each retention period, data is securely
                deleted or anonymised.
              </p>
              <div className="overflow-hidden rounded-xl border border-neutral-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-blueprint-900 text-white">
                      <th className="text-left px-5 py-3 font-semibold">Category of Data</th>
                      <th className="text-left px-5 py-3 font-semibold">Retention Period</th>
                    </tr>
                  </thead>
                  <tbody>
                    {retentionData.map((row, i) => (
                      <tr key={row.category} className={i % 2 === 0 ? "bg-white" : "bg-neutral-50"}>
                        <td className="px-5 py-3 text-neutral-700">{row.category}</td>
                        <td className="px-5 py-3 text-neutral-600">{row.period}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section 10 */}
            <section id="data-security">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">10. Data Security</h2>
              <p className="text-neutral-600 leading-relaxed mb-4">
                We implement appropriate technical and organisational measures to protect your personal
                data against unauthorised access, loss, alteration, disclosure, or destruction:
              </p>
              <ul className="list-disc list-inside text-neutral-600 space-y-2 ml-4">
                <li><span className="font-medium text-neutral-800">SSL/TLS Encryption:</span> All data transmitted between your browser and our Site is encrypted via HTTPS.</li>
                <li><span className="font-medium text-neutral-800">Access Controls:</span> Personal data is accessible only to authorised personnel on a need-to-know basis.</li>
                <li><span className="font-medium text-neutral-800">Secure Storage:</span> Data is stored on secured servers with restricted access and active monitoring.</li>
                <li><span className="font-medium text-neutral-800">Password Security:</span> User passwords are stored in hashed form using industry-standard algorithms.</li>
                <li><span className="font-medium text-neutral-800">Incident Response:</span> We maintain a data breach response procedure and will notify affected individuals and authorities as required by law.</li>
              </ul>
              <p className="text-neutral-600 text-sm mt-4">
                While we take every reasonable precaution, no method of transmission or storage is completely secure.
                We cannot guarantee absolute security.
              </p>
            </section>

            {/* Section 11 */}
            <section id="your-rights-as-a-data-subject">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">11. Your Rights as a Data Subject</h2>
              <p className="text-neutral-600 leading-relaxed mb-5">
                Under the Kenya Data Protection Act, 2019, and applicable international law, you have the
                following rights with respect to your personal data:
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
                {rights.map((right) => (
                  <div key={right.title} className="p-4 rounded-xl border border-neutral-200 bg-neutral-50 hover:border-blueprint-300 hover:bg-blueprint-50 transition-colors">
                    <div className="flex items-center gap-2 mb-2 text-blueprint-700">
                      {right.icon}
                      <span className="font-semibold text-sm text-neutral-800">{right.title}</span>
                    </div>
                    <p className="text-neutral-600 text-xs leading-relaxed">{right.description}</p>
                  </div>
                ))}
              </div>
              <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-5 space-y-3">
                <h3 className="text-sm font-semibold text-neutral-800">How to Exercise Your Rights</h3>
                <p className="text-neutral-600 text-sm">
                  Email <a href="mailto:privacy@tefetro.studio" className="text-blueprint-600 hover:text-blueprint-700 font-medium">privacy@tefetro.studio</a> with
                  the subject line <span className="font-medium text-neutral-800">"Data Subject Request."</span> We may require identity verification.
                  We will respond within <span className="font-medium text-neutral-800">30 days</span> of receipt.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-blue-800 text-xs">
                    <span className="font-semibold">Supervisory Authority:</span> If you are dissatisfied with how we handle your data, you may lodge a complaint with the <span className="font-medium">Office of the Data Protection Commissioner (ODPC)</span> — <a href="https://www.odpc.go.ke" className="underline" target="_blank" rel="noopener noreferrer">www.odpc.go.ke</a>
                  </p>
                </div>
              </div>
            </section>

            {/* Section 12 */}
            <section id="childrens-privacy">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">12. Children's Privacy</h2>
              <p className="text-neutral-600 leading-relaxed mb-3">
                Our Site and services are not directed at or intended for use by children under the age of
                <span className="font-medium text-neutral-800"> 18</span>. We do not knowingly collect personal data from minors.
                If we become aware that a minor has submitted personal data without appropriate parental consent,
                we will take prompt steps to delete that information.
              </p>
              <p className="text-neutral-600 leading-relaxed">
                If you are a parent or guardian and believe a child under your care has provided us with personal
                data, please contact us immediately at <a href="mailto:privacy@tefetro.studio" className="text-blueprint-600 hover:text-blueprint-700">privacy@tefetro.studio</a>.
              </p>
            </section>

            {/* Section 13 */}
            <section id="digital-products-and-downloads">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">13. Digital Products and Downloads</h2>
              <p className="text-neutral-600 leading-relaxed mb-3">
                When you purchase digital products, architectural drawings, or other downloadable content from
                tefetro.studio, we collect and retain data about your purchase including:
              </p>
              <ul className="list-disc list-inside text-neutral-600 space-y-2 ml-4 mb-3">
                <li>The product(s) purchased and their associated license type</li>
                <li>Date and time of purchase</li>
                <li>Download history and access logs</li>
              </ul>
              <p className="text-neutral-600 leading-relaxed">
                This information is retained to verify legitimate ownership, administer license rights, resolve
                disputes, and comply with our intellectual property obligations. Please refer to our separate
                <span className="font-medium text-neutral-800"> Digital Product License Terms</span> for full details on permitted and prohibited uses of our downloadable content.
              </p>
            </section>

            {/* Section 14 */}
            <section id="ai-powered-tools">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">14. AI-Powered Tools and Features</h2>
              <p className="text-neutral-600 leading-relaxed mb-3">
                Where our Site incorporates AI-powered tools (including chatbots, generative features,
                or automated assistance), please note:
              </p>
              <ul className="list-disc list-inside text-neutral-600 space-y-2 ml-4 mb-3">
                <li>Conversations or inputs submitted to AI tools may be processed by third-party AI providers. We take reasonable steps to ensure such providers are bound by appropriate data protection obligations.</li>
                <li>AI tools are provided to assist and enhance your experience. They are <span className="font-medium text-neutral-800">not a substitute</span> for professional legal, architectural, financial, or other specialist advice.</li>
                <li>We do not use AI tools to make fully automated decisions that produce significant legal effects without human oversight.</li>
              </ul>
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4">
                <p className="text-amber-800 text-sm">
                  <span className="font-semibold">Recommendation: </span>
                  Do not submit sensitive personal, financial, health, or legal information through AI-powered chat interfaces on our Site.
                </p>
              </div>
            </section>

            {/* Section 15 */}
            <section id="third-party-links">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">15. Third-Party Links and External Platforms</h2>
              <p className="text-neutral-600 leading-relaxed">
                Our Site may contain links to third-party websites, platforms, or services. We are not responsible
                for the privacy practices, content, or security of those external sites. We encourage you to review
                the privacy policies of any third-party site you visit through a link on our platform.
                This Privacy Policy applies solely to <span className="font-medium text-neutral-800">tefetro.studio</span> and the data we collect and process directly.
              </p>
            </section>

            {/* Section 16 */}
            <section id="marketing-communications">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">16. Marketing Communications</h2>
              <p className="text-neutral-600 leading-relaxed mb-3">
                Where you have provided consent, or where we otherwise have a lawful basis to do so, we may send
                you marketing communications about our services, new products, promotions, and studio updates.
              </p>
              <p className="text-neutral-600 leading-relaxed">
                <span className="font-medium text-neutral-800">Opting Out: </span>
                You may unsubscribe from marketing emails at any time by clicking the "Unsubscribe" link in any
                marketing email, or by contacting us at <a href="mailto:privacy@tefetro.studio" className="text-blueprint-600 hover:text-blueprint-700">privacy@tefetro.studio</a>. Opting out of marketing does not
                affect transactional messages related to your purchases or account.
              </p>
            </section>

            {/* Section 17 */}
            <section id="changes-to-this-policy">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">17. Changes to This Privacy Policy</h2>
              <p className="text-neutral-600 leading-relaxed mb-3">
                We reserve the right to update or amend this Privacy Policy at any time to reflect changes in our
                practices, legal requirements, or operational needs. When material changes are made, we will:
              </p>
              <ul className="list-disc list-inside text-neutral-600 space-y-2 ml-4">
                <li>Update the "Last Updated" date at the top of this Policy</li>
                <li>Post the revised Policy on our Site</li>
                <li>Where appropriate, notify you by email or through a notice on our Site</li>
              </ul>
              <p className="text-neutral-600 leading-relaxed mt-3">
                Your continued use of our Site after the effective date of any revised Policy constitutes your
                acceptance of the changes.
              </p>
            </section>

            {/* Section 18 */}
            <section id="governing-law">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">18. Governing Law</h2>
              <p className="text-neutral-600 leading-relaxed mb-3">
                This Privacy Policy is governed by and shall be construed in accordance with the laws of the
                <span className="font-medium text-neutral-800"> Republic of Kenya</span>, including the Kenya Data Protection Act, 2019.
              </p>
              <p className="text-neutral-600 leading-relaxed">
                Any dispute arising out of or in connection with this Privacy Policy shall be subject to the exclusive
                jurisdiction of the courts of Kenya, unless otherwise required by applicable mandatory law in your jurisdiction.
              </p>
            </section>

            {/* Section 19 */}
            <section id="contact-us">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">19. Contact Us</h2>
              <p className="text-neutral-600 leading-relaxed mb-4">
                If you have any questions, concerns, or requests relating to your personal data or this Privacy Policy,
                please contact us. We aim to respond to all privacy-related inquiries within <span className="font-medium text-neutral-800">14 business days</span>.
              </p>
              <div className="bg-neutral-50 rounded-xl p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blueprint-600" />
                  <div>
                    <p className="text-sm font-medium text-neutral-700">Privacy Enquiries</p>
                    <a href="mailto:privacy@tefetro.studio" className="text-blueprint-600 hover:text-blueprint-700">privacy@tefetro.studio</a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blueprint-600" />
                  <div>
                    <p className="text-sm font-medium text-neutral-700">General Enquiries</p>
                    <a href="mailto:hello@tefetro.studio" className="text-blueprint-600 hover:text-blueprint-700">hello@tefetro.studio</a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-blueprint-600" />
                  <div>
                    <p className="text-sm font-medium text-neutral-700">Phone</p>
                    <a href="tel:+254791939235" className="text-blueprint-600 hover:text-blueprint-700">+254 791 939 235</a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-blueprint-600" />
                  <div>
                    <p className="text-sm font-medium text-neutral-700">Address</p>
                    <p className="text-neutral-600">Nairobi, Kenya</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 20 */}
            <section id="definitions">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">20. Definitions</h2>
              <div className="space-y-3">
                {[
                  { term: "Personal Data", def: "Any information relating to an identified or identifiable natural person." },
                  { term: "Processing", def: "Any operation performed on personal data, including collection, storage, use, disclosure, or deletion." },
                  { term: "Data Controller", def: "The entity that determines the purposes and means of processing personal data — in this case, Tefetro Studios." },
                  { term: "Data Processor", def: "A third party that processes personal data on behalf of the Data Controller." },
                  { term: "Data Subject", def: "The natural person to whom personal data relates — in this case, you." },
                  { term: "Consent", def: "A freely given, specific, informed, and unambiguous indication of agreement to the processing of personal data." },
                  { term: "Legitimate Interests", def: "A lawful basis for processing where our business interests are pursued in a way that does not override your fundamental rights and freedoms." },
                  { term: "Sensitive Personal Data", def: "Data revealing racial or ethnic origin, political opinions, religious beliefs, health data, biometric data, or other categories defined as sensitive under applicable law." },
                ].map((item) => (
                  <div key={item.term}>
                    <span className="font-semibold text-neutral-800">&ldquo;{item.term}&rdquo;</span>
                    <p className="text-neutral-600 text-sm mt-0.5">{item.def}</p>
                  </div>
                ))}
              </div>
            </section>

          </div>
        </div>

        {/* Fine Print Footer */}
        <div className="mt-8 text-center text-xs text-neutral-400 space-y-2">
          <p>© {new Date().getFullYear()} Tefetro Studios. All rights reserved.</p>
          <p>
            This Privacy Policy is governed by the Kenya Data Protection Act, 2019.
            Document Reference: TEFETRO-PP-2026-001 · Version 1.0 · Review Due: April 2027
          </p>
          <p>
            This Privacy Policy was last updated on {lastUpdated} and supersedes all previous versions.
          </p>
        </div>
      </section>
    </main>
  );
}
