// src/app/file-formats/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { 
  FileImage, 
  FileText, 
  File, 
  Download, 
  CheckCircle,
  AlertCircle,
  FileCheck,
  Eye,
  Printer,
  Share2,
  HardDrive,
  Cloud,
  Lock,
  Globe,
  Smartphone,
  Monitor,
  FileSpreadsheet,
  FileJson,
  FileArchive,
  BookOpen
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Supported File Formats | Tefetro Studios - Architectural Plans',
  description: 'Learn about the file formats we support for architectural drawings, 3D models, and documentation. CAD, PDF, BIM, and more formats for house plans in Kenya.',
  keywords: 'architectural file formats, CAD files, PDF house plans, BIM files, DWG files, architectural drawing formats, Kenya architecture',
  openGraph: {
    title: 'Supported File Formats | Tefetro Studios',
    description: 'Professional architectural plans in multiple formats for your convenience',
    type: 'website',
    url: 'https://tefetrostudios.com/file-formats',
    images: [{ url: '/file-formats-og.jpg', width: 1200, height: 630 }],
  },
  alternates: {
    canonical: 'https://tefetrostudios.com/file-formats',
  },
};

const formatCategories = [
  {
    title: '2D CAD Drawings',
    icon: FileText,
    description: 'Industry-standard CAD formats for professional use',
    formats: [
      { name: 'DWG', extension: '.dwg', description: 'AutoCAD native format', usage: 'Editing & modifications', size: 'Compact', icon: File },
      { name: 'DXF', extension: '.dxf', description: 'Drawing Exchange Format', usage: 'Cross-platform compatibility', size: 'Compact', icon: File },
      { name: 'PDF', extension: '.pdf', description: 'Portable Document Format', usage: 'Printing & viewing', size: 'Small', icon: FileText },
    ]
  },
  {
    title: '3D Models',
    icon: FileImage,
    description: 'Three-dimensional models for visualization',
    formats: [
      { name: 'SKP', extension: '.skp', description: 'SketchUp format', usage: '3D visualization', size: 'Large', icon: FileImage },
      { name: 'OBJ', extension: '.obj', description: 'Universal 3D format', usage: 'Rendering software', size: 'Large', icon: FileImage },
      { name: 'FBX', extension: '.fbx', description: 'Filmbox format', usage: 'Animation & gaming', size: 'Large', icon: FileImage },
    ]
  },
  {
    title: 'Documentation',
    icon: FileText,
    description: 'Project documentation and reports',
    formats: [
      { name: 'DOCX', extension: '.docx', description: 'Microsoft Word', usage: 'Specifications', size: 'Small', icon: FileText },
      { name: 'XLSX', extension: '.xlsx', description: 'Microsoft Excel', usage: 'BOQs & schedules', size: 'Small', icon: FileSpreadsheet },
      { name: 'TXT', extension: '.txt', description: 'Plain text', usage: 'Notes & logs', size: 'Tiny', icon: FileText },
    ]
  },
  {
    title: 'Images & Renders',
    icon: FileImage,
    description: 'High-quality visual outputs',
    formats: [
      { name: 'JPEG', extension: '.jpg', description: 'Compressed image', usage: 'Web & preview', size: 'Medium', icon: FileImage },
      { name: 'PNG', extension: '.png', description: 'Lossless image', usage: 'High quality', size: 'Large', icon: FileImage },
      { name: 'WEBP', extension: '.webp', description: 'Modern web format', usage: 'Fast loading', size: 'Small', icon: FileImage },
    ]
  }
];

const deliveryOptions = [
  {
    icon: Download,
    title: 'Digital Download',
    description: 'Instant access to your files after purchase',
    features: ['Unlimited downloads', '24/7 access', 'Cloud storage'],
  },
  {
    icon: Cloud,
    title: 'Cloud Delivery',
    description: 'Access your plans from anywhere',
    features: ['Google Drive', 'Dropbox', 'OneDrive support'],
  },
  {
    icon: HardDrive,
    title: 'USB Drive',
    description: 'Physical delivery option',
    features: ['Preloaded USB drive', 'Secure packaging', 'Delivery tracking'],
  },
  {
    icon: Printer,
    title: 'Printed Copies',
    description: 'Physical blueprints delivered',
    features: ['Professional printing', 'Rolled packaging', 'Express shipping'],
  },
];

const faqs = [
  {
    question: 'Can I convert files to different formats?',
    answer: 'Yes! We can provide your plans in multiple formats upon request. Additional fees may apply for extensive format conversions.',
  },
  {
    question: 'Which format is best for printing?',
    answer: 'PDF is the most reliable for printing as it preserves formatting across all devices. We recommend high-resolution PDF for best results.',
  },
  {
    question: 'Are the files editable?',
    answer: 'DWG and DXF files are fully editable in CAD software. PDF files can be edited with professional PDF software, but for major changes we recommend the CAD formats.',
  },
  {
    question: 'How do I open DWG files?',
    answer: 'DWG files require AutoCAD or free alternatives like DraftSight, nanoCAD, or Autodesk Viewer (web-based).',
  },
  {
    question: 'What\'s the best format for 3D visualization?',
    answer: 'SKP (SketchUp) is great for quick visualizations, while FBX and OBJ are better for professional rendering software.',
  },
  {
    question: 'Do you provide source files?',
    answer: 'Yes, source files (DWG, SKP) are included in premium packages. Basic packages include PDF and images.',
  },
];

export default function FileFormatsPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#0a1a2f] via-[#0f2a44] to-[#0a1a2f] overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-10 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 backdrop-blur-sm mb-6">
              <File className="w-4 h-4 text-orange-400" />
              <span className="text-orange-400 font-semibold text-sm tracking-wider uppercase">
                Supported Formats
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Professional Plans In{' '}
              <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                Multiple Formats
              </span>
            </h1>
            <p className="text-lg text-[#a0c4e8] mb-8 leading-relaxed">
              Choose the format that works best for your workflow. From editable CAD files 
              to print-ready PDFs, we've got you covered.
            </p>
          </div>
        </div>
      </section>

      {/* Format Categories */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0f2a44] mb-4">
              Available File Formats
            </h2>
            <p className="text-lg text-[#475569] max-w-2xl mx-auto">
              High-quality architectural plans delivered in your preferred format
            </p>
          </div>

          <div className="space-y-16">
            {formatCategories.map((category, idx) => (
              <div key={idx}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <category.icon className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#0f2a44]">{category.title}</h3>
                    <p className="text-[#475569]">{category.description}</p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6">
                  {category.formats.map((format, formatIdx) => (
                    <div key={formatIdx} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all group">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#0f2a44] to-[#1a3a5c] rounded-xl flex items-center justify-center">
                          <format.icon className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-orange-500">{format.extension}</span>
                      </div>
                      <h4 className="text-xl font-bold text-[#0f2a44] mb-2">{format.name}</h4>
                      <p className="text-[#475569] text-sm mb-3">{format.description}</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-[#475569]">Use: {format.usage}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <HardDrive className="w-4 h-4 text-blue-500" />
                          <span className="text-[#475569]">File size: {format.size}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Delivery Options */}
      <section className="py-20 bg-gradient-to-br from-[#eaf3fb] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0f2a44] mb-4">
              Delivery Options
            </h2>
            <p className="text-lg text-[#475569] max-w-2xl mx-auto">
              Get your plans delivered the way you prefer
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {deliveryOptions.map((option, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-xl transition-all">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                  <option.icon className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-[#0f2a44] mb-2">{option.title}</h3>
                <p className="text-[#475569] text-sm mb-4">{option.description}</p>
                <ul className="space-y-2">
                  {option.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-[#475569]">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Comparison Table */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0f2a44] mb-4">
              Format Comparison
            </h2>
            <p className="text-[#475569]">
              Which format is right for you?
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#0f2a44] text-white">
                  <th className="p-4 text-left rounded-l-xl">Feature</th>
                  <th className="p-4 text-center">PDF</th>
                  <th className="p-4 text-center">DWG</th>
                  <th className="p-4 text-center rounded-r-xl">SKP</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'Editable', pdf: '❌', dwg: '✅', skp: '✅' },
                  { feature: 'Print Ready', pdf: '✅', dwg: '⚠️', skp: '❌' },
                  { feature: '3D Viewing', pdf: '⚠️', dwg: '⚠️', skp: '✅' },
                  { feature: 'File Size', pdf: 'Small', dwg: 'Medium', skp: 'Large' },
                  { feature: 'Software Needed', pdf: 'Adobe Reader', dwg: 'AutoCAD', skp: 'SketchUp' },
                  { feature: 'Best For', pdf: 'Viewing/Printing', dwg: 'Editing', skp: 'Visualization' },
                ].map((row, idx) => (
                  <tr key={idx} className="border-b border-gray-200">
                    <td className="p-4 font-semibold text-[#0f2a44]">{row.feature}</td>
                    <td className="p-4 text-center">{row.pdf}</td>
                    <td className="p-4 text-center">{row.dwg}</td>
                    <td className="p-4 text-center">{row.skp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0f2a44] mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-[#475569]">
              Everything you need to know about file formats
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <details key={idx} className="group bg-white rounded-xl border border-gray-200">
                <summary className="flex justify-between items-center cursor-pointer p-6 font-semibold text-[#0f2a44] list-none">
                  <span>{faq.question}</span>
                  <span className="text-orange-500 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="px-6 pb-6 text-[#475569] border-t border-gray-100 pt-4">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-amber-500">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Your Plans?
          </h2>
          <p className="text-white/90 text-lg mb-8">
            Choose your preferred format and start your project today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 bg-white text-orange-600 font-semibold px-8 py-4 rounded-xl hover:shadow-xl transition-all"
            >
              Browse House Plans
              <FileText className="w-5 h-5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-xl transition-all border border-white/20"
            >
              Request Custom Format
              <Download className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}