import React from 'react'
import Card from '../components/common/Card'
import { Link } from 'react-router-dom'

const Terms: React.FC = () => {
  return (
    <div className="space-y-8">
      <section className="text-center py-12 bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg text-white">
        <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Last updated: June 1, 2023
        </p>
      </section>

      <Card>
        <div className="prose max-w-none">
          <p>
            Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the PumpSui platform
            operated by PumpSui Inc. ("us", "we", "our").
          </p>

          <p>
            Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms.
            These Terms apply to all visitors, users, and others who access or use the Service.
          </p>

          <p>
            <strong>By accessing or using the Service you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the Service.</strong>
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">1. Definitions</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>"Service"</strong> refers to the PumpSui platform, accessible via https://pumpsui.com.</li>
            <li><strong>"User"</strong> refers to any individual or entity that accesses or uses the Service.</li>
            <li><strong>"Content"</strong> refers to all information, data, text, graphics, images, and other materials that may be created, posted, or otherwise made available through the Service.</li>
            <li><strong>"Meme Coin"</strong> refers to a cryptocurrency token created, traded, or otherwise interacted with through the Service.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">2. Use of the Service</h2>
          <p>
            The Service is provided for informational and entertainment purposes only. We do not provide financial advice, and nothing on the Service should be construed as financial advice. Users are solely responsible for their decisions regarding the creation, purchase, sale, or holding of any cryptocurrency or digital asset.
          </p>

          <p>
            Users must be at least 18 years old to use the Service. By using the Service, you represent and warrant that you are at least 18 years old.
          </p>

          <p>
            Users are responsible for maintaining the security of their wallet and private keys. We do not store private keys, recovery phrases, or passwords, and cannot recover lost or stolen assets.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">3. User Accounts</h2>
          <p>
            The Service does not require traditional account creation. Instead, users interact with the Service by connecting their cryptocurrency wallet. By connecting your wallet, you agree to be bound by these Terms.
          </p>

          <p>
            You are responsible for all activities that occur under your connected wallet. You must immediately notify us of any unauthorized use of your wallet or any other breach of security.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">4. Content and Conduct</h2>
          <p>
            Users may create and share Content through the Service, including but not limited to meme coin names, symbols, descriptions, and images. You retain all rights to any Content you submit, post, or display on or through the Service.
          </p>

          <p>
            By submitting, posting, or displaying Content on or through the Service, you grant us a worldwide, non-exclusive, royalty-free license to use, copy, reproduce, process, adapt, modify, publish, transmit, display, and distribute such Content in any and all media or distribution methods.
          </p>

          <p>
            You agree not to use the Service to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Violate any applicable laws or regulations.</li>
            <li>Infringe upon the rights of others, including intellectual property rights.</li>
            <li>Create or promote meme coins with names, symbols, or content that is defamatory, obscene, pornographic, or otherwise objectionable.</li>
            <li>Engage in market manipulation, fraud, or deceptive practices.</li>
            <li>Distribute malware, viruses, or other malicious code.</li>
            <li>Interfere with or disrupt the Service or servers or networks connected to the Service.</li>
            <li>Collect or track personal information of other users.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">5. Intellectual Property</h2>
          <p>
            The Service and its original content (excluding Content provided by users), features, and functionality are and will remain the exclusive property of PumpSui Inc. and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries.
          </p>

          <p>
            Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of PumpSui Inc.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">6. Disclaimer of Warranties</h2>
          <p>
            The Service is provided on an "AS IS" and "AS AVAILABLE" basis. PumpSui Inc. and its suppliers and licensors hereby disclaim all warranties of any kind, express or implied, including, without limitation, the warranties of merchantability, fitness for a particular purpose, and non-infringement.
          </p>

          <p>
            Neither PumpSui Inc. nor its suppliers and licensors makes any warranty that the Service will be error-free or that access thereto will be continuous or uninterrupted. You understand that you download from, or otherwise obtain content or services through, the Service at your own discretion and risk.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">7. Limitation of Liability</h2>
          <p>
            In no event will PumpSui Inc., or its suppliers or licensors, be liable with respect to any subject matter of these Terms under any contract, negligence, strict liability, or other legal or equitable theory for: (i) any special, incidental, or consequential damages; (ii) the cost of procurement of substitute products or services; (iii) for interruption of use or loss or corruption of data; or (iv) for any amounts that exceed the fees paid by you to PumpSui Inc. under these Terms during the twelve (12) month period prior to the cause of action.
          </p>

          <p>
            PumpSui Inc. shall have no liability for any failure or delay due to matters beyond their reasonable control. The foregoing shall not apply to the extent prohibited by applicable law.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">8. Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless PumpSui Inc., its contractors, and its licensors, and their respective directors, officers, employees, and agents from and against any and all claims and expenses, including attorneys' fees, arising out of your use of the Service, including but not limited to your violation of these Terms.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">9. Governing Law</h2>
          <p>
            These Terms shall be governed and construed in accordance with the laws of the State of California, United States, without regard to its conflict of law provisions.
          </p>

          <p>
            Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">10. Changes to Terms</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
          </p>

          <p>
            By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, please stop using the Service.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">11. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please <Link to="/contact" className="text-primary-600 hover:underline">contact us</Link>.
          </p>
        </div>
      </Card>
    </div>
  )
}

export default Terms
