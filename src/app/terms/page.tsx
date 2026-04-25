// src/app/terms/page.tsx
import { Calendar, FileText, Scale, Clock, Mail, Phone, MapPin, ShieldCheck, Ban, CreditCard, Package, Wrench, AlertTriangle, Gavel, RefreshCw, UserX, BookOpen } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service | Tefetro Studios',
  description: 'Legal terms and conditions for using Tefetro Studios platform. Read our terms for purchasing architectural drawings, add-ons, and services.',
};

export default function TermsPage() {
  const lastUpdated = "April 25, 2026";
  const effectiveDate = "April 25, 2026";

  const definitions = [
    { term: "Platform", def: "The Tefetro Studios website, including all pages, content, and functionality available at www.tefetro.studio." },
    { term: "Digital Products", def: "Architectural drawings, plans, BOQs, and other digital deliverables available for purchase on our platform." },
    { term: "Add-ons", def: "Additional deliverables such as interior design drawings, landscape plans, and structural engineering documents." },
    { term: "Services", def: "Professional services including site supervision and turnkey contracting." },
    { term: "Order", def: "Any purchase made through our platform, including products, add-ons, and services." },
    { term: "User / Customer / You", def: "Any individual or entity accessing or using the Platform or purchasing our products or services." },
    { term: "Company / We / Us / Our", def: "Tefetro Studios, the entity operating the Platform and providing the products and services described herein." },
  ];

  const prohibitedActions = [
    "Resell, redistribute, or sublicense purchased drawings to third parties not involved in your project",
    "Use our products for illegal construction or without obtaining the necessary permits and approvals",
    "Share download links or files with unauthorized individuals or entities",
    "Attempt to reverse-engineer, decompile, or extract source code from our platform",
    "Use automated bots, scrapers, or similar technology to extract content from our Site",
    "Impersonate Tefetro Studios or represent a false affiliation with our Company",
    "Upload or transmit malicious code, viruses, or any software that could damage our systems",
    "Engage in any activity that disrupts or interferes with the operation of our platform",
  ];

  const deliveryTimelines = [
    {
      dot: "bg-green-500",
      label: "Instant Digital Products",
      description: "Delivered immediately after payment confirmation via secure download links. Download links are valid for 24 hours from the time of issue.",
    },
    {
      dot: "bg-yellow-500",
      label: "Processing Add-ons",
      description: "Delivered within 2–5 business days after order confirmation. Examples include BOQs, interior design drawings, and structural documents.",
    },
    {
      dot: "bg-blue-500",
      label: "Professional Services",
      description: "Delivery timelines are project-specific and will be agreed upon during consultation. A separate service agreement will be provided.",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blueprint-900 to-blueprint-800 text-white py-16 lg:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <Scale className="w-8 h-8 text-accent-500" />
            <h1 className="text-3xl lg:text-4xl font-bold">Terms of Service</h1>
          </div>
          <p className="text-blueprint-200 text-lg max-w-2xl">
            These terms govern your use of Tefetro Studios&apos; platform, services, and products.
            Please read them carefully before making a purchase or using our services.
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
              <span>Version 2.0</span>
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
              By accessing or using www.tefetro.studio or purchasing any of our products or services, you agree to
              be bound by these Terms of Service. If you do not agree, please do not use our platform.
            </p>
          </div>

          {/* Table of Contents */}
          <div className="bg-neutral-50 border-b border-neutral-200 p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-3">Contents</h2>
            <div className="grid md:grid-cols-2 gap-2 text-sm">
              {[
                "1. Acceptance of Terms",
                "2. Definitions",
                "3. Digital Products License",
                "4. Purchases and Payments",
                "5. Delivery of Products",
                "6. Refund Policy",
                "7. Intellectual Property",
                "8. User Accounts",
                "9. Prohibited Use",
                "10. Add-ons and Services",
                "11. Limitation of Liability",
                "12. Disclaimer of Warranties",
                "13. Indemnification",
                "14. Governing Law",
                "15. Dispute Resolution",
                "16. Modifications to Terms",
                "17. Termination",
                "18. Contact Information",
              ].map((item) => (
                <a
                  key={item}
                  href={`#section-${item.split('.')[0].trim()}`}
                  className="text-blueprint-600 hover:text-blueprint-700"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>

          <div className="p-6 lg:p-8 space-y-10">

            {/* Section 1 */}
            <section id="section-1">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-neutral-600 leading-relaxed mb-3">
                By accessing or using the Tefetro Studios website (<span className="font-medium text-neutral-800">www.tefetro.studio</span>),
                purchasing any architectural drawings, add-ons, or services, you agree to be bound by these
                Terms of Service (&ldquo;Terms&rdquo;). If you do not agree to these Terms, please do not use our
                platform or purchase our products.
              </p>
              <p className="text-neutral-600 leading-relaxed mb-3">
                These Terms constitute a legally binding agreement between you (&ldquo;User,&rdquo; &ldquo;Customer,&rdquo; or &ldquo;You&rdquo;)
                and Tefetro Studios (&ldquo;Company,&rdquo; &ldquo;We,&rdquo; &ldquo;Us,&rdquo; or &ldquo;Our&rdquo;). By using our services, you represent that:
              </p>
              <ul className="list-disc list-inside text-neutral-600 space-y-2 ml-4">
                <li>You are at least <span className="font-medium text-neutral-800">18 years of age</span></li>
                <li>You have the legal capacity to enter into a binding agreement</li>
                <li>You are using our platform for lawful purposes only</li>
                <li>All information you provide to us is accurate and complete</li>
              </ul>
            </section>

            {/* Section 2 */}
            <section id="section-2">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">2. Definitions</h2>
              <div className="space-y-3">
                {definitions.map((item) => (
                  <div key={item.term}>
                    <span className="font-semibold text-neutral-800">&ldquo;{item.term}&rdquo;</span>
                    <p className="text-neutral-600 text-sm mt-0.5">{item.def}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 3 */}
            <section id="section-3">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">3. Digital Products License</h2>
              <p className="text-neutral-600 leading-relaxed mb-3">
                Upon successful purchase and receipt of payment, Tefetro Studios grants you a
                <span className="font-medium text-neutral-800"> non-exclusive, non-transferable, perpetual license</span> to
                use the purchased architectural drawings for the following permitted purposes:
              </p>
              <ul className="list-disc list-inside text-neutral-600 space-y-2 ml-4 mb-4">
                <li>Personal residential construction projects</li>
                <li>Commercial construction projects (with appropriate local licensing)</li>
                <li>Presentation and approval purposes with local authorities and planning bodies</li>
                <li>Sharing with contractors, engineers, and authorised professionals directly involved in your specific project</li>
              </ul>

              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                <p className="text-red-800 text-sm font-semibold mb-2">🚫 Prohibited Uses</p>
                <p className="text-red-700 text-sm">
                  You may <span className="font-bold">NOT</span> resell, redistribute, sublicense, or share the digital files
                  with any third party not directly involved in your construction project. Each purchase is for
                  <span className="font-bold"> single-project use only</span> unless otherwise agreed in writing by Tefetro Studios.
                </p>
              </div>

              <p className="text-neutral-600 text-sm leading-relaxed">
                All intellectual property rights in the drawings remain the exclusive property of Tefetro Studios.
                Your license to use the drawings does not transfer any ownership or intellectual property rights to you.
              </p>
            </section>

            {/* Section 4 */}
            <section id="section-4">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">4. Purchases and Payments</h2>
              <p className="text-neutral-600 leading-relaxed mb-3">
                All prices are listed in <span className="font-medium text-neutral-800">Kenyan Shillings (KES)</span> unless
                otherwise specified. We accept the following payment methods:
              </p>
              <div className="space-y-3 mb-4">
                {[
                  { dot: "bg-blue-500", label: "Credit and Debit Cards", detail: "Visa, Mastercard, and American Express" },
                  { dot: "bg-green-500", label: "M-Pesa", detail: "Available for customers in Kenya" },
                  { dot: "bg-neutral-500", label: "Bank Transfer", detail: "Available for enterprise clients upon request" },
                ].map((p) => (
                  <div key={p.label} className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full ${p.dot} mt-2 shrink-0`}></div>
                    <div>
                      <span className="font-medium text-neutral-800">{p.label}: </span>
                      <span className="text-neutral-600 text-sm">{p.detail}</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-neutral-600 leading-relaxed text-sm">
                Prices are subject to change without notice. We reserve the right to modify or discontinue any product
                or service at any time. In the event of a pricing error, we reserve the right to cancel your order
                and issue a full refund. All transactions are processed securely through our PCI DSS-compliant
                payment partners.
              </p>
            </section>

            {/* Section 5 */}
            <section id="section-5">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">5. Delivery of Products</h2>
              <p className="text-neutral-600 leading-relaxed mb-4">
                Delivery timelines vary by product type. All delivery timeframes run from the point of
                confirmed payment receipt.
              </p>
              <div className="space-y-4">
                {deliveryTimelines.map((item) => (
                  <div key={item.label} className="flex items-start gap-4 p-4 rounded-xl border border-neutral-100 bg-neutral-50">
                    <div className={`w-2.5 h-2.5 rounded-full ${item.dot} mt-1.5 shrink-0`}></div>
                    <div>
                      <p className="font-semibold text-neutral-800 text-sm mb-1">{item.label}</p>
                      <p className="text-neutral-600 text-sm">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-neutral-600 text-sm mt-4">
                If you experience any issues with delivery or have not received your files within the stated
                timeframe, please contact us at{" "}
                <a href="mailto:hello@tefetro.studio" className="text-blueprint-600 hover:text-blueprint-700">hello@tefetro.studio</a>.
              </p>
            </section>

            {/* Section 6 */}
            <section id="section-6">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">6. Refund Policy</h2>
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-4">
                <p className="text-amber-800 text-sm font-semibold">⚠ Important: All Sales of Digital Products Are Final</p>
              </div>
              <p className="text-neutral-600 leading-relaxed mb-3">
                Due to the digital nature of our products, <span className="font-medium text-neutral-800">all sales of digital architectural drawings
                and add-ons are final</span>. We do not offer refunds or exchanges once a product has been
                delivered or accessed.
              </p>
              <p className="text-neutral-600 leading-relaxed mb-3">
                However, we recognise that genuine issues may arise. We will consider refunds or credits
                on a case-by-case basis under the following circumstances:
              </p>
              <ul className="list-disc list-inside text-neutral-600 space-y-2 ml-4 mb-3">
                <li>The delivered file is corrupted or cannot be opened in standard software</li>
                <li>The product received is materially and significantly different from what was described</li>
                <li>A duplicate payment was processed for the same order</li>
              </ul>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 text-sm">
                  <span className="font-semibold">How to Request a Refund: </span>
                  Refund requests must be submitted within <span className="font-semibold">7 days</span> of purchase.
                  Contact our support team at{" "}
                  <a href="mailto:hello@tefetro.studio" className="underline">hello@tefetro.studio</a>{" "}
                  with your order number and a detailed description of the issue.
                </p>
              </div>
            </section>

            {/* Section 7 */}
            <section id="section-7">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">7. Intellectual Property</h2>
              <p className="text-neutral-600 leading-relaxed mb-3">
                All architectural drawings, designs, plans, elevations, sections, and associated content
                available on our platform are the exclusive intellectual property of Tefetro Studios and
                are protected by <span className="font-medium text-neutral-800">Kenyan and international copyright laws</span>,
                including the Copyright Act (Cap. 130, Laws of Kenya).
              </p>
              <p className="text-neutral-600 leading-relaxed mb-3">
                You may not reproduce, distribute, modify, create derivative works of, publicly display,
                or commercially exploit any of our intellectual property without our express prior written consent.
              </p>
              <p className="text-neutral-600 leading-relaxed">
                Tefetro Studios is a registered trademark. Unauthorised use of our brand, logo, or name
                in any commercial context is strictly prohibited and may result in legal action.
              </p>
            </section>

            {/* Section 8 */}
            <section id="section-8">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">8. User Accounts</h2>
              <p className="text-neutral-600 leading-relaxed mb-3">
                To access certain features of our platform, including downloading purchased files and
                managing orders, you may be required to create an account. You are responsible for:
              </p>
              <ul className="list-disc list-inside text-neutral-600 space-y-2 ml-4 mb-3">
                <li>Maintaining the confidentiality of your login credentials</li>
                <li>All activities that occur under your account, whether authorised by you or not</li>
                <li>Notifying us immediately of any unauthorised access or suspected security breach</li>
                <li>Ensuring your account information remains accurate and up to date</li>
              </ul>
              <p className="text-neutral-600 leading-relaxed">
                We reserve the right to suspend or permanently terminate accounts that violate these Terms,
                engage in fraudulent activity, or present a security risk to our platform or other users.
              </p>
            </section>

            {/* Section 9 */}
            <section id="section-9">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">9. Prohibited Use</h2>
              <p className="text-neutral-600 leading-relaxed mb-4">
                By using our platform, you agree that you will not engage in any of the following prohibited activities:
              </p>
              <div className="space-y-2">
                {prohibitedActions.map((action) => (
                  <div key={action} className="flex items-start gap-3 p-3 rounded-lg bg-neutral-50 border border-neutral-100">
                    <Ban className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                    <p className="text-neutral-600 text-sm">{action}</p>
                  </div>
                ))}
              </div>
              <p className="text-neutral-600 text-sm mt-4">
                Violation of any of the above may result in immediate account termination, legal proceedings,
                and claims for damages.
              </p>
            </section>

            {/* Section 10 */}
            <section id="section-10">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">10. Add-ons and Services</h2>
              <p className="text-neutral-600 leading-relaxed mb-3">
                Our add-ons and professional services are subject to additional terms disclosed at the
                time of purchase. By purchasing an add-on or service, you agree to:
              </p>
              <ul className="list-disc list-inside text-neutral-600 space-y-2 ml-4 mb-3">
                <li>Provide accurate and complete information required for service delivery</li>
                <li>Respond to our requests for additional information within a reasonable timeframe</li>
                <li>Accept that service-based add-ons may require extended delivery times as communicated at point of purchase</li>
              </ul>
              <p className="text-neutral-600 leading-relaxed">
                For <span className="font-medium text-neutral-800">turnkey contracting and site supervision services</span>, a separate
                written contract will be provided outlining specific terms, project milestones, payment schedules,
                and deliverables. Those services are governed by that contract in addition to these Terms.
              </p>
            </section>

            {/* Section 11 */}
            <section id="section-11">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">11. Limitation of Liability</h2>
              <p className="text-neutral-600 leading-relaxed mb-3">
                To the maximum extent permitted by applicable law, Tefetro Studios, its officers, directors,
                employees, agents, and affiliates shall not be liable for any:
              </p>
              <ul className="list-disc list-inside text-neutral-600 space-y-2 ml-4 mb-3">
                <li>Indirect, incidental, special, consequential, or punitive damages</li>
                <li>Loss of profits, revenue, data, goodwill, or business opportunities</li>
                <li>Damages arising from construction defects, planning decisions, or regulatory non-compliance</li>
                <li>Losses resulting from unauthorised access to your account or data</li>
              </ul>
              <p className="text-neutral-600 leading-relaxed">
                In all cases, our total aggregate liability to you shall not exceed the amount you paid
                for the specific product or service giving rise to the claim.
              </p>
            </section>

            {/* Section 12 */}
            <section id="section-12">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">12. Disclaimer of Warranties</h2>
              <p className="text-neutral-600 leading-relaxed mb-3">
                Our products and services are provided <span className="font-medium text-neutral-800">&ldquo;as is&rdquo; and &ldquo;as available&rdquo;</span> without
                warranties of any kind, either express or implied, including but not limited to warranties
                of merchantability, fitness for a particular purpose, or non-infringement.
              </p>
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4">
                <p className="text-amber-800 text-sm">
                  <span className="font-semibold">Construction Compliance Notice: </span>
                  We do not warrant that our architectural drawings will meet your specific construction
                  requirements or comply with all applicable local building codes, zoning laws, or planning
                  regulations. It is your sole responsibility to verify compliance with local regulations
                  and obtain all necessary permits and approvals before commencing construction.
                </p>
              </div>
            </section>

            {/* Section 13 */}
            <section id="section-13">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">13. Indemnification</h2>
              <p className="text-neutral-600 leading-relaxed">
                You agree to indemnify, defend, and hold harmless Tefetro Studios, its officers, directors,
                employees, agents, and affiliates from and against any and all claims, damages, losses,
                liabilities, costs, and expenses (including reasonable legal fees) arising from or relating to:
              </p>
              <ul className="list-disc list-inside text-neutral-600 space-y-2 ml-4 mt-3">
                <li>Your use of or access to our platform, products, or services</li>
                <li>Your violation of any provision of these Terms</li>
                <li>Your infringement of any third-party intellectual property, privacy, or other rights</li>
                <li>Any construction or development activities undertaken using our products</li>
              </ul>
            </section>

            {/* Section 14 */}
            <section id="section-14">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">14. Governing Law</h2>
              <p className="text-neutral-600 leading-relaxed mb-3">
                These Terms shall be governed by and construed in accordance with the laws of the
                <span className="font-medium text-neutral-800"> Republic of Kenya</span>, without regard to its conflict
                of law provisions. Any legal action or proceeding arising under these Terms shall be
                brought exclusively in the courts of <span className="font-medium text-neutral-800">Nairobi, Kenya</span>.
              </p>
              <p className="text-neutral-600 leading-relaxed">
                If you are accessing our services from outside Kenya, you do so at your own initiative and
                are responsible for compliance with your local laws to the extent applicable.
              </p>
            </section>

            {/* Section 15 */}
            <section id="section-15">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">15. Dispute Resolution</h2>
              <p className="text-neutral-600 leading-relaxed mb-3">
                Any dispute arising out of or in connection with these Terms shall first be attempted to
                be resolved through <span className="font-medium text-neutral-800">good-faith negotiation</span> between
                the parties. You agree to contact us at{" "}
                <a href="mailto:hello@tefetro.studio" className="text-blueprint-600 hover:text-blueprint-700">hello@tefetro.studio</a>{" "}
                before initiating any formal legal proceedings.
              </p>
              <p className="text-neutral-600 leading-relaxed mb-3">
                If the dispute cannot be resolved through negotiation within
                <span className="font-medium text-neutral-800"> 30 days</span>, it shall be submitted to binding
                arbitration in Nairobi, Kenya, in accordance with the
                <span className="font-medium text-neutral-800"> Arbitration Act of Kenya (Cap. 49)</span>.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 text-sm">
                  <span className="font-semibold">Consumer Protection: </span>
                  Kenyan consumers retain statutory rights under the Consumer Protection Act, 2012.
                  Nothing in these Terms is intended to limit or exclude those statutory rights where applicable.
                </p>
              </div>
            </section>

            {/* Section 16 */}
            <section id="section-16">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">16. Modifications to Terms</h2>
              <p className="text-neutral-600 leading-relaxed mb-3">
                We reserve the right to modify these Terms at any time. When material changes are made, we will:
              </p>
              <ul className="list-disc list-inside text-neutral-600 space-y-2 ml-4 mb-3">
                <li>Update the &ldquo;Last Updated&rdquo; date at the top of this page</li>
                <li>Post the revised Terms on our website</li>
                <li>Notify registered users of material changes via email or website notice</li>
              </ul>
              <p className="text-neutral-600 leading-relaxed">
                Your continued use of our platform after changes are posted constitutes your acceptance
                of the modified Terms. If you do not agree with any modification, you must discontinue
                use of our platform immediately.
              </p>
            </section>

            {/* Section 17 */}
            <section id="section-17">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">17. Termination</h2>
              <p className="text-neutral-600 leading-relaxed mb-3">
                We may terminate or suspend your access to our platform immediately, without prior notice
                or liability, for any reason, including but not limited to:
              </p>
              <ul className="list-disc list-inside text-neutral-600 space-y-2 ml-4 mb-3">
                <li>Breach of any provision of these Terms</li>
                <li>Fraudulent, abusive, or illegal activity</li>
                <li>Failure to make payment for purchased products or services</li>
                <li>Actions that may cause harm to Tefetro Studios, other users, or third parties</li>
              </ul>
              <p className="text-neutral-600 leading-relaxed">
                Upon termination, your right to use our platform ceases immediately. Provisions that by their
                nature should survive termination — including intellectual property rights, limitation of liability,
                indemnification, and governing law — shall survive any termination of these Terms.
              </p>
            </section>

            {/* Section 18 */}
            <section id="section-18">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">18. Contact Information</h2>
              <p className="text-neutral-600 leading-relaxed mb-4">
                If you have any questions about these Terms, need to report a violation, or wish to resolve
                a dispute, please contact us using the details below. We aim to respond within
                <span className="font-medium text-neutral-800"> 3 business days</span>.
              </p>
              <div className="bg-neutral-50 rounded-xl p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blueprint-600" />
                  <div>
                    <p className="text-sm font-medium text-neutral-700">General Enquiries</p>
                    <a href="mailto:hello@tefetro.studio" className="text-blueprint-600 hover:text-blueprint-700">hello@tefetro.studio</a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blueprint-600" />
                  <div>
                    <p className="text-sm font-medium text-neutral-700">Legal &amp; Compliance</p>
                    <a href="mailto:legal@tefetro.studio" className="text-blueprint-600 hover:text-blueprint-700">legal@tefetro.studio</a>
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

          </div>
        </div>

        {/* Fine Print Footer */}
        <div className="mt-8 text-center text-xs text-neutral-400 space-y-2">
          <p>© {new Date().getFullYear()} Tefetro Studios. All rights reserved.</p>
          <p>
            Tefetro Studios is a registered trademark of Tefetro Limited.
            Unauthorised reproduction of architectural plans is prohibited by law.
          </p>
          <p>
            These Terms were last updated on {lastUpdated} and supersede all previous versions.
          </p>
        </div>
      </section>
    </main>
  );
}
