export default function PrivacyPolicy() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-12 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <p className="mb-4">
        Effective Date: {new Date().getFullYear()}
      </p>

      <p className="mb-4">
        Tefetro Studio ("we", "our", "us") respects your privacy and is committed
        to protecting your personal data. This Privacy Policy explains how we
        collect, use, and safeguard your information when you use our platform.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. Information We Collect</h2>
      <p className="mb-4">
        We may collect personal information such as your name, email address,
        and profile data when you sign in using Google or interact with our services.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. How We Use Your Information</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>To provide and maintain our services</li>
        <li>To improve user experience</li>
        <li>To communicate updates and support</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. Authentication</h2>
      <p className="mb-4">
        We use secure third-party authentication providers such as Google OAuth
        via Supabase. Your login credentials are never stored directly on our servers.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Data Sharing</h2>
      <p className="mb-4">
        We do not sell or rent your personal data. We may share data with trusted
        services required to operate our platform.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Data Security</h2>
      <p className="mb-4">
        We implement appropriate security measures to protect your data from
        unauthorized access, alteration, or disclosure.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">6. Your Rights</h2>
      <p className="mb-4">
        You have the right to access, update, or delete your personal data.
        Contact us to make such requests.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">7. Contact</h2>
      <p>
        If you have any questions, contact us at:
        <br />
        <strong>noelsyambi@gmail.com</strong>
      </p>
    </main>
  );
}