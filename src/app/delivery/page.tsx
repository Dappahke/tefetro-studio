// src/app/delivery/page.tsx
import { Calendar, FileText, Clock, Mail, Phone, MapPin, Download, Package, Wrench, AlertTriangle, CheckCircle, RefreshCw, HelpCircle, Zap, Users } from 'lucide-react';

export const metadata = {
  title: 'Delivery Policy | Tefetro Studios',
  description: 'Learn how Tefetro Studios delivers architectural drawings, add-ons, and professional services — including timelines, download instructions, and support.',
};

export default function DeliveryPage() {
  const lastUpdated = "April 25, 2026";
  const effectiveDate = "April 25, 2026";

  const deliveryTypes = [
    {
      icon: <Zap className="w-6 h-6" />,
      dot: "bg-green-500",
      badge: "Instant",
      badgeColor: "bg-green-100 text-green-700",
      title: "Standard Architectural Drawings",
      description:
        "Our ready-made architectural drawing packages are delivered instantly upon confirmed payment. You will receive a secure download link via email within minutes of your transaction being processed.",
      details: [
        "Delivered via secure email download link",
        "Download link valid for 24 hours from time of issue",
        "Files provided in PDF and/or DWG format as specified",
        "Up to 3 download attempts per link",
        "Contact us immediately if your link expires before downloading",
      ],
      timeline: "Immediate — within minutes of payment confirmation",
    },
    {
      icon: <Package className="w-6 h-6" />,
      dot: "bg-yellow-500",
      badge: "2–5 Business Days",
      badgeColor: "bg-yellow-100 text-yellow-700",
      title: "Add-on Deliverables",
      description:
        "Add-ons such as Bills of Quantities (BOQs), interior design drawings, landscape plans, and structural engineering documents require preparation time after your order is confirmed.",
      details: [
        "Bill of Quantities (BOQ): 2–3 business days",
        "Interior Design Drawings: 3–5 business days",
        "Landscape Plans: 2–4 business days",
        "Structural Engineering Documents: 3–5 business days",
        "Delivered via secure email link or client portal",
      ],
      timeline: "2–5 business days from order confirmation",
    },
    {
      icon: <Wrench className="w-6 h-6" />,
      dot: "bg-blue-500",
      badge: "By Agreement",
      badgeColor: "bg-blue-100 text-blue-700",
      title: "Professional Services",
      description:
        "Site supervision, project management, and turnkey contracting services are bespoke engagements. Timelines are project-specific and will be agreed upon in writing during your consultation.",
      details: [
        "Initial consultation scheduled within 2 business days of enquiry",
        "Formal proposal and timeline provided within 5 business days",
        "Milestone-based delivery schedule outlined in your service contract",
        "Progress updates provided at agreed intervals",
        "Final deliverables subject to project scope and complexity",
      ],
      timeline: "Agreed in writing per project scope",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Complete Your Purchase",
      description: "Select your product or add-on and complete payment via card, M-Pesa, or bank transfer. You will receive an order confirmation email immediately.",
    },
    {
      number: "02",
      title: "Payment Verification",
      description: "Our system automatically verifies your payment. For M-Pesa and bank transfers, verification may take up to 30 minutes during business hours.",
    },
    {
      number: "03",
      title: "Receive Your Download Link",
      description: "Once payment is confirmed, a secure download link is sent to your registered email address. Check your spam or junk folder if you do not see it within 15 minutes.",
    },
    {
      number: "04",
      title: "Download Your Files",
      description: "Click the link in your email to access your files. Download links are valid for 24 hours and allow up to 3 download attempts. Save your files immediately to a secure location.",
    },
    {
      number: "05",
      title: "Access Your Account",
      description: "All purchased files are also accessible via your Tefetro Studios account dashboard under 'My Orders,' providing a permanent record of your purchases.",
    },
  ];

  const faqs = [
    {
      q: "What happens if my download link expires?",
      a: "If your 24-hour download link expires before you have successfully downloaded your files, contact us at hello@tefetro.studio with your order number. We will issue a new link within 1 business day at no charge.",
    },
    {
      q: "What file formats will I receive?",
      a: "Standard architectural drawings are delivered as high-resolution PDF files. Where specified in the product listing, DWG (AutoCAD) files may also be included. BOQs are delivered in PDF and/or Excel format.",
    },
    {
      q: "Can I request delivery to a different email address?",
      a: "Yes. If you need files sent to a different email address from your registered account, contact us before placing your order or immediately after. We cannot redirect delivery links after they have been issued.",
    },
    {
      q: "My files appear corrupted or won't open — what do I do?",
      a: "Contact our support team at hello@tefetro.studio within 7 days of purchase. Provide your order number and describe the issue. We will investigate and either re-issue your files or arrange a replacement at no cost.",
    },
    {
      q: "Do you deliver outside Kenya?",
      a: "Yes. Our digital products are delivered globally via email. There are no geographic restrictions on downloading our files. Payment methods available to international customers may vary.",
    },
    {
      q: "Can I share my downloaded files with my contractor or engineer?",
      a: "Yes. Your license permits sharing files with contractors, engineers, and other authorised professionals directly involved in your specific construction project. Redistribution to third parties not involved in your project is prohibited.",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blueprint-900 to-blueprint-800 text-white py-16 lg:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <Download className="w-8 h-8 text-accent-500" />
            <h1 className="text-3xl lg:text-4xl font-bold">Delivery Policy</h1>
          </div>
          <p className="text-blueprint-200 text-lg max-w-2xl">
            Everything you need to know about how we deliver architectural drawings,
            add-ons, and professional services — and what to do if something goes wrong.
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
              <span>Version 1.0</span>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">

          {/* Notice Banner */}
          <div className="bg-blue-50 border-b border-blue-200 px-6 py-4">
            <p className="text-blue-800 text-sm">
              <span className="font-semibold">📦 Digital Delivery Only: </span>
              All Tefetro Studios products are delivered digitally. We do not ship physical prints or
              hard-copy documents. Files are sent via secure email download links and accessible
              through your account dashboard.
            </p>
          </div>

          {/* Table of Contents */}
          <div className="bg-neutral-50 border-b border-neutral-200 p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-3">Contents</h2>
            <div className="grid md:grid-cols-2 gap-2 text-sm">
              {[
                "1. Overview",
                "2. Delivery Methods by Product Type",
                "3. How the Delivery Process Works",
                "4. Download Instructions",
                "5. Business Hours and Processing Times",
                "6. International Delivery",
                "7. Failed or Missing Deliveries",
                "8. File Formats",
                "9. Sharing Your Files",
                "10. Frequently Asked Questions",
                "11. Contact and Support",
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
              <h2 className="text-xl font-bold text-neutral-900 mb-4">1. Overview</h2>
              <p className="text-neutral-600 leading-relaxed mb-3">
                Tefetro Studios is a fully digital architecture studio. All of our products — including
                architectural drawing packages, bills of quantities, interior design drawings, landscape
                plans, and structural documents — are delivered electronically.
              </p>
              <p className="text-neutral-600 leading-relaxed mb-3">
                Delivery timelines vary depending on the product type. Instant digital products are
                available for download within minutes of payment confirmation. Add-on deliverables
                requiring preparation are completed within 2–5 business days. Professional service
                engagements operate on timelines agreed in writing during consultation.
              </p>
              <div className="grid sm:grid-cols-3 gap-4 mt-5">
                {[
                  { icon: <Zap className="w-5 h-5 text-green-600" />, label: "Instant Products", sub: "Within minutes", bg: "bg-green-50 border-green-200" },
                  { icon: <Package className="w-5 h-5 text-yellow-600" />, label: "Add-on Products", sub: "2–5 business days", bg: "bg-yellow-50 border-yellow-200" },
                  { icon: <Wrench className="w-5 h-5 text-blue-600" />, label: "Professional Services", sub: "By agreement", bg: "bg-blue-50 border-blue-200" },
                ].map((card) => (
                  <div key={card.label} className={`rounded-xl border p-4 ${card.bg} flex flex-col items-center text-center gap-2`}>
                    {card.icon}
                    <p className="font-semibold text-neutral-800 text-sm">{card.label}</p>
                    <p className="text-neutral-500 text-xs">{card.sub}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 2 */}
            <section id="section-2">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">2. Delivery Methods by Product Type</h2>
              <p className="text-neutral-600 leading-relaxed mb-5">
                The delivery method and timeline for your order depends on what you have purchased.
                All timelines below run from the point of confirmed payment receipt.
              </p>
              <div className="space-y-5">
                {deliveryTypes.map((type) => (
                  <div key={type.title} className="rounded-xl border border-neutral-200 overflow-hidden">
                    <div className="bg-neutral-50 border-b border-neutral-200 px-5 py-4 flex items-center justify-between gap-4 flex-wrap">
                      <div className="flex items-center gap-3">
                        <div className="text-blueprint-700">{type.icon}</div>
                        <div>
                          <p className="font-semibold text-neutral-900">{type.title}</p>
                          <p className="text-neutral-500 text-xs mt-0.5">{type.timeline}</p>
                        </div>
                      </div>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${type.badgeColor}`}>
                        {type.badge}
                      </span>
                    </div>
                    <div className="px-5 py-4">
                      <p className="text-neutral-600 text-sm leading-relaxed mb-3">{type.description}</p>
                      <ul className="space-y-1.5">
                        {type.details.map((d) => (
                          <li key={d} className="flex items-start gap-2 text-neutral-600 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                            {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 3 */}
            <section id="section-3">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">3. How the Delivery Process Works</h2>
              <p className="text-neutral-600 leading-relaxed mb-5">
                From the moment you complete your purchase to receiving your files, here is exactly
                what happens at each step:
              </p>
              <div className="space-y-4">
                {steps.map((step, i) => (
                  <div key={step.number} className="flex gap-5">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-blueprint-900 text-white text-sm font-bold flex items-center justify-center shrink-0">
                        {step.number}
                      </div>
                      {i < steps.length - 1 && (
                        <div className="w-px flex-1 bg-neutral-200 mt-2"></div>
                      )}
                    </div>
                    <div className="pb-6">
                      <p className="font-semibold text-neutral-800 mb-1">{step.title}</p>
                      <p className="text-neutral-600 text-sm leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 4 */}
            <section id="section-4">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">4. Download Instructions</h2>
              <p className="text-neutral-600 leading-relaxed mb-4">
                To ensure a smooth download experience, please follow these instructions:
              </p>
              <ul className="list-disc list-inside text-neutral-600 space-y-2 ml-4 mb-4">
                <li>Check your inbox for an email from <span className="font-medium text-neutral-800">hello@tefetro.studio</span> immediately after purchase</li>
                <li>If you do not see the email within 15 minutes, check your spam or junk folder</li>
                <li>Click the download link in the email — do not forward the link to others</li>
                <li>Save your files to a secure local or cloud storage location immediately</li>
                <li>Download links expire after <span className="font-medium text-neutral-800">24 hours</span> and allow a maximum of <span className="font-medium text-neutral-800">3 download attempts</span></li>
                <li>All purchases are also accessible via your account dashboard under <span className="font-medium text-neutral-800">My Orders</span></li>
              </ul>
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4">
                <p className="text-amber-800 text-sm">
                  <span className="font-semibold">⚠ Important: </span>
                  Download links are single-use per device session. If your link expires or you exhaust
                  your download attempts, contact us at{" "}
                  <a href="mailto:hello@tefetro.studio" className="underline font-medium">hello@tefetro.studio</a>{" "}
                  and we will issue a replacement link within 1 business day.
                </p>
              </div>
            </section>

            {/* Section 5 */}
            <section id="section-5">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">5. Business Hours and Processing Times</h2>
              <p className="text-neutral-600 leading-relaxed mb-4">
                Our automated systems process instant digital product deliveries 24 hours a day, 7 days
                a week. However, for orders requiring manual preparation or payment verification, our
                team operates during the following hours:
              </p>
              <div className="overflow-hidden rounded-xl border border-neutral-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-blueprint-900 text-white">
                      <th className="text-left px-5 py-3 font-semibold">Day</th>
                      <th className="text-left px-5 py-3 font-semibold">Hours (EAT)</th>
                      <th className="text-left px-5 py-3 font-semibold">Support Available</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { day: "Monday – Friday", hours: "8:00 AM – 6:00 PM", support: "Full support" },
                      { day: "Saturday", hours: "9:00 AM – 1:00 PM", support: "Limited support" },
                      { day: "Sunday", hours: "Closed", support: "Email only — next business day response" },
                      { day: "Public Holidays", hours: "Closed", support: "Email only — next business day response" },
                    ].map((row, i) => (
                      <tr key={row.day} className={i % 2 === 0 ? "bg-white" : "bg-neutral-50"}>
                        <td className="px-5 py-3 text-neutral-700 font-medium">{row.day}</td>
                        <td className="px-5 py-3 text-neutral-600">{row.hours}</td>
                        <td className="px-5 py-3 text-neutral-600">{row.support}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-neutral-500 text-xs mt-3">
                All times are in East Africa Time (EAT, UTC+3). Business days exclude weekends and Kenyan public holidays.
              </p>
            </section>

            {/* Section 6 */}
            <section id="section-6">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">6. International Delivery</h2>
              <p className="text-neutral-600 leading-relaxed mb-3">
                We deliver our digital products to customers worldwide. Since all deliveries are electronic,
                there are no geographic restrictions on receiving your files. International customers should
                note the following:
              </p>
              <ul className="list-disc list-inside text-neutral-600 space-y-2 ml-4 mb-3">
                <li>All prices are listed in Kenyan Shillings (KES). Your bank or payment provider will apply the applicable exchange rate at the time of transaction.</li>
                <li>Payment method availability may vary by country. Card payments are accepted globally. M-Pesa is available for Kenyan customers only.</li>
                <li>Our architectural drawings are designed in accordance with Kenyan building standards. International customers are responsible for verifying compliance with their local building codes and regulations.</li>
                <li>Support is provided in English. Response times may vary due to time zone differences.</li>
              </ul>
            </section>

            {/* Section 7 */}
            <section id="section-7">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">7. Failed or Missing Deliveries</h2>
              <p className="text-neutral-600 leading-relaxed mb-4">
                If you do not receive your delivery as expected, please follow the steps below before
                contacting our support team:
              </p>
              <div className="space-y-3 mb-4">
                {[
                  { step: "1", text: "Wait 15 minutes after payment confirmation — automated systems may occasionally experience brief delays." },
                  { step: "2", text: "Check your spam, junk, or promotions folder for an email from hello@tefetro.studio." },
                  { step: "3", text: "Log into your Tefetro Studios account and check 'My Orders' — your files may be accessible directly from your dashboard." },
                  { step: "4", text: "Ensure you are checking the email address you used to register or complete your purchase." },
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-3 p-3 rounded-lg bg-neutral-50 border border-neutral-100">
                    <div className="w-6 h-6 rounded-full bg-blueprint-900 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {item.step}
                    </div>
                    <p className="text-neutral-600 text-sm">{item.text}</p>
                  </div>
                ))}
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 text-sm">
                  <span className="font-semibold">Still not received? </span>
                  Contact us at{" "}
                  <a href="mailto:hello@tefetro.studio" className="underline font-medium">hello@tefetro.studio</a>{" "}
                  with your order number and the email address used at checkout. We will investigate
                  and resolve the issue within <span className="font-semibold">1 business day</span>.
                </p>
              </div>
            </section>

            {/* Section 8 */}
            <section id="section-8">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">8. File Formats</h2>
              <p className="text-neutral-600 leading-relaxed mb-4">
                The file formats included in your delivery depend on the product purchased.
                Specific formats are listed in each product description before purchase.
              </p>
              <div className="overflow-hidden rounded-xl border border-neutral-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-blueprint-900 text-white">
                      <th className="text-left px-5 py-3 font-semibold">Product Type</th>
                      <th className="text-left px-5 py-3 font-semibold">Formats Included</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { type: "Architectural Drawing Packages", formats: "PDF (high-resolution), DWG (where specified)" },
                      { type: "Bill of Quantities (BOQ)", formats: "PDF, Excel (.xlsx)" },
                      { type: "Interior Design Drawings", formats: "PDF (high-resolution)" },
                      { type: "Landscape Plans", formats: "PDF (high-resolution)" },
                      { type: "Structural Engineering Documents", formats: "PDF (high-resolution)" },
                    ].map((row, i) => (
                      <tr key={row.type} className={i % 2 === 0 ? "bg-white" : "bg-neutral-50"}>
                        <td className="px-5 py-3 text-neutral-700 font-medium">{row.type}</td>
                        <td className="px-5 py-3 text-neutral-600">{row.formats}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-neutral-500 text-xs mt-3">
                To open DWG files, you will need AutoCAD or a compatible viewer such as DWG TrueView (free).
                PDF files can be opened with any standard PDF reader including Adobe Acrobat Reader (free).
              </p>
            </section>

            {/* Section 9 */}
            <section id="section-9">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">9. Sharing Your Files</h2>
              <p className="text-neutral-600 leading-relaxed mb-3">
                Your purchase license permits you to share your downloaded files with professionals directly
                involved in your construction project, including:
              </p>
              <ul className="list-disc list-inside text-neutral-600 space-y-2 ml-4 mb-4">
                <li>Licensed contractors and builders engaged for your project</li>
                <li>Structural or civil engineers consulting on your build</li>
                <li>Local authority planners reviewing your permit application</li>
                <li>Quantity surveyors and project managers for your specific project</li>
              </ul>
              <div className="bg-red-50 border-l-4 border-red-500 p-4">
                <p className="text-red-800 text-sm">
                  <span className="font-semibold">🚫 Prohibited: </span>
                  You may not resell, redistribute, sublicense, or share your files with any person or
                  entity not directly involved in your specific construction project. Each purchase covers
                  single-project use only. Unauthorised sharing is a breach of your license and may result
                  in legal action. See our{" "}
                  <a href="/terms" className="underline font-medium">Terms of Service</a>{" "}
                  for full details.
                </p>
              </div>
            </section>

            {/* Section 10 — FAQ */}
            <section id="section-10">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">10. Frequently Asked Questions</h2>
              <div className="space-y-4">
                {faqs.map((faq) => (
                  <div key={faq.q} className="rounded-xl border border-neutral-200 overflow-hidden">
                    <div className="bg-neutral-50 border-b border-neutral-200 px-5 py-3 flex items-start gap-3">
                      <HelpCircle className="w-4 h-4 text-blueprint-600 mt-0.5 shrink-0" />
                      <p className="font-semibold text-neutral-800 text-sm">{faq.q}</p>
                    </div>
                    <div className="px-5 py-4">
                      <p className="text-neutral-600 text-sm leading-relaxed">{faq.a}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 11 */}
            <section id="section-11">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">11. Contact and Support</h2>
              <p className="text-neutral-600 leading-relaxed mb-4">
                If you experience any issues with your delivery or have questions not answered above,
                our support team is ready to help. Please include your order number in all correspondence
                to help us resolve your query as quickly as possible.
              </p>
              <div className="bg-neutral-50 rounded-xl p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blueprint-600" />
                  <div>
                    <p className="text-sm font-medium text-neutral-700">Delivery Support</p>
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
                  <Clock className="w-5 h-5 text-blueprint-600" />
                  <div>
                    <p className="text-sm font-medium text-neutral-700">Response Time</p>
                    <p className="text-neutral-600">Within 1 business day for delivery issues</p>
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
            This Delivery Policy forms part of our{" "}
            <a href="/terms" className="underline hover:text-neutral-600">Terms of Service</a> and should be read alongside our{" "}
            <a href="/privacy" className="underline hover:text-neutral-600">Privacy Policy</a>.
          </p>
          <p>This Delivery Policy was last updated on {lastUpdated} and supersedes all previous versions.</p>
        </div>
      </section>
    </main>
  );
}
