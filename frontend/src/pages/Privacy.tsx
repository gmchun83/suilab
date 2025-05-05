import React from 'react'
import Card from '../components/common/Card'
import { Link } from 'react-router-dom'

const Privacy: React.FC = () => {
  return (
    <div className="space-y-8">
      <section className="text-center py-12 bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg text-white">
        <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Last updated: June 1, 2023
        </p>
      </section>

      <Card>
        <div className="prose max-w-none">
          <p>
            This Privacy Policy describes how PumpSui Inc. ("we", "us", or "our") collects, uses, and shares information
            about you when you use our website, mobile application, and other online products and services (collectively, the "Services").
          </p>

          <p>
            By using our Services, you agree to the collection, use, and sharing of your information as described in this Privacy Policy.
            If you do not agree with our policies and practices, do not use our Services.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">1. Information We Collect</h2>
          
          <h3 className="text-xl font-bold mt-6 mb-3">1.1 Information You Provide to Us</h3>
          <p>
            We collect information you provide directly to us when you use our Services, including:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Wallet Information:</strong> When you connect your cryptocurrency wallet to our Services, we collect your wallet address and transaction history related to our platform.</li>
            <li><strong>Content Information:</strong> When you create a meme coin, we collect the information you provide, such as the coin name, symbol, description, and any images you upload.</li>
            <li><strong>Communication Information:</strong> If you contact us directly, we may receive additional information about you, such as your name, email address, and the contents of your message.</li>
          </ul>

          <h3 className="text-xl font-bold mt-6 mb-3">1.2 Information We Collect Automatically</h3>
          <p>
            When you use our Services, we automatically collect certain information, including:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Device Information:</strong> We collect information about the device you use to access our Services, including the hardware model, operating system and version, unique device identifiers, and mobile network information.</li>
            <li><strong>Usage Information:</strong> We collect information about your usage of our Services, such as the pages or content you view, the time and duration of your visits, and the search terms you use.</li>
            <li><strong>Transaction Information:</strong> We collect information about the transactions you make on our Services, including the type of transaction, the date and time of the transaction, and the amount involved.</li>
            <li><strong>Log Information:</strong> We collect log information when you use our Services, including your IP address, browser type, access times, pages viewed, and the page you visited before navigating to our Services.</li>
          </ul>

          <h3 className="text-xl font-bold mt-6 mb-3">1.3 Information We Collect from Other Sources</h3>
          <p>
            We may also obtain information from other sources and combine that with information we collect through our Services. For example, we may collect information about you from blockchain analytics providers, public blockchain data, and other third parties.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">2. How We Use Information</h2>
          <p>
            We use the information we collect to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide, maintain, and improve our Services;</li>
            <li>Process transactions and send related information, including confirmations;</li>
            <li>Send technical notices, updates, security alerts, and support and administrative messages;</li>
            <li>Respond to your comments, questions, and requests;</li>
            <li>Communicate with you about products, services, offers, promotions, and events, and provide other news or information about us and our partners;</li>
            <li>Monitor and analyze trends, usage, and activities in connection with our Services;</li>
            <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities and protect the rights and property of PumpSui Inc. and others;</li>
            <li>Personalize and improve the Services and provide content or features that match user profiles or interests;</li>
            <li>Facilitate contests, sweepstakes, and promotions and process and deliver entries and rewards;</li>
            <li>Carry out any other purpose described to you at the time the information was collected.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">3. How We Share Information</h2>
          <p>
            We may share information about you as follows or as otherwise described in this Privacy Policy:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>With vendors, consultants, and other service providers who need access to such information to carry out work on our behalf;</li>
            <li>In response to a request for information if we believe disclosure is in accordance with, or required by, any applicable law, regulation, or legal process;</li>
            <li>If we believe your actions are inconsistent with our user agreements or policies, or to protect the rights, property, and safety of PumpSui Inc. or others;</li>
            <li>In connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business by another company;</li>
            <li>Between and among PumpSui Inc. and our current and future parents, affiliates, subsidiaries, and other companies under common control and ownership;</li>
            <li>With your consent or at your direction.</li>
          </ul>

          <p>
            We may also share aggregated or de-identified information, which cannot reasonably be used to identify you.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">4. Blockchain Data</h2>
          <p>
            Please note that blockchain technology, by its nature, is public and transparent. When you interact with the Sui blockchain through our Services, information such as your wallet address and transaction details are publicly visible on the blockchain. We do not control and are not responsible for any information you make public on the blockchain.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">5. Data Retention</h2>
          <p>
            We store the information we collect about you for as long as is necessary for the purpose(s) for which we originally collected it. We may retain certain information for legitimate business purposes or as required by law.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">6. Transfer of Information to the United States and Other Countries</h2>
          <p>
            PumpSui Inc. is based in the United States and the information we collect is governed by U.S. law. By accessing or using the Services or otherwise providing information to us, you consent to the processing, transfer, and storage of information in and to the U.S. and other countries, where you may not have the same rights and protections as you do under local law.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">7. Your Choices</h2>
          
          <h3 className="text-xl font-bold mt-6 mb-3">7.1 Cookies</h3>
          <p>
            Most web browsers are set to accept cookies by default. If you prefer, you can usually choose to set your browser to remove or reject browser cookies. Please note that if you choose to remove or reject cookies, this could affect the availability and functionality of our Services.
          </p>

          <h3 className="text-xl font-bold mt-6 mb-3">7.2 Promotional Communications</h3>
          <p>
            You may opt out of receiving promotional emails from us by following the instructions in those emails. If you opt out, we may still send you non-promotional emails, such as those about your account or our ongoing business relations.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">8. Children's Privacy</h2>
          <p>
            Our Services are not directed to children under 18 years of age, and we do not knowingly collect personal information from children under 18. If we learn we have collected or received personal information from a child under 18 without verification of parental consent, we will delete that information. If you believe we might have any information from or about a child under 18, please contact us.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">9. Changes to this Privacy Policy</h2>
          <p>
            We may change this Privacy Policy from time to time. If we make changes, we will notify you by revising the date at the top of the policy and, in some cases, we may provide you with additional notice (such as adding a statement to our website or sending you a notification). We encourage you to review the Privacy Policy whenever you access the Services or otherwise interact with us to stay informed about our information practices and the choices available to you.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">10. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please <Link to="/contact" className="text-primary-600 hover:underline">contact us</Link>.
          </p>
        </div>
      </Card>
    </div>
  )
}

export default Privacy
