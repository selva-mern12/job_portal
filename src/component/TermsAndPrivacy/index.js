import "./index.css"; 

export const TermsOfUse = () => {
  return (
    <div className="terms-container">
      <h1 className="terms-title">Terms of Use</h1>
      <p className="terms-date"><strong>Last Updated: Mar 12, 2025</strong></p>

      <h2 className="terms-heading">1. Use of Services</h2>
      <p className="terms-text">By using this website, you agree to abide by these terms. Ensure that all provided information is accurate.</p>

      <h2 className="terms-heading">2. Prohibited Activities</h2>
      <ul className="terms-list">
        <li>Do not share false or misleading information.</li>
        <li>Do not engage in fraudulent job postings or applications.</li>
        <li>Do not violate any laws while using the platform.</li>
      </ul>

      <h2 className="terms-heading">3. Account Termination</h2>
      <p className="terms-text">Accounts found violating these terms may be suspended or terminated.</p>

      <h2 className="terms-heading">4. Liability</h2>
      <p className="terms-text">We are not responsible for any damages resulting from job applications or employment decisions.</p>

      <h2 className="terms-heading">5. Changes to Terms</h2>
      <p className="terms-text">These terms may be updated at any time. Continued use after updates constitutes acceptance.</p>
    </div>
  );
};

export const PrivacyPolicy = () => {
  return (
    <div className="privacy-container">
      <h1 className="privacy-title">Privacy Policy</h1>
      <p className="privacy-date"><strong>Last Updated: Mar 12, 2025</strong></p>

      <h2 className="privacy-heading">1. Data Collection</h2>
      <p className="privacy-text">We collect information related to job postings, applications, and website usage.</p>

      <h2 className="privacy-heading">2. Use of Data</h2>
      <ul className="privacy-list">
        <li>To operate and improve the platform.</li>
        <li>To facilitate job applications and postings.</li>
        <li>To enhance user experience.</li>
      </ul>

      <h2 className="privacy-heading">3. Data Protection</h2>
      <p className="privacy-text">Security measures are in place to protect your data. We do not share or sell data to third parties.</p>

      <h2 className="privacy-heading">4. Cookies</h2>
      <p className="privacy-text">Cookies may be used for functionality and analytics. Users can manage cookies in their browser settings.</p>

      <h2 className="privacy-heading">5. Policy Updates</h2>
      <p className="privacy-text">This policy may be updated periodically. Continued use indicates acceptance of any changes.</p>
    </div>
  );
};

