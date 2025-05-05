import React, { useState } from 'react'
import Card from '../components/common/Card'
import { Link } from 'react-router-dom'

interface FAQItem {
  question: string
  answer: string
  category: string
}

const FAQ: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>('all')

  const faqItems: FAQItem[] = [
    {
      question: 'What is PumpSui?',
      answer: 'PumpSui is a platform for creating and trading meme coins on the Sui blockchain. It allows anyone to launch their own meme coin with minimal technical knowledge, while providing a safe and transparent environment for traders and investors.',
      category: 'general'
    },
    {
      question: 'How do I create a meme coin?',
      answer: 'To create a meme coin, connect your Sui wallet, navigate to the Create page, fill in details like name, symbol, and initial supply, and confirm the transaction. Our platform handles the smart contract deployment and liquidity pool creation automatically.',
      category: 'creation'
    },
    {
      question: 'Is there a fee for creating a coin?',
      answer: 'Yes, there is a small fee for creating a coin to cover the gas costs of deploying the smart contract and setting up the liquidity pool. The exact fee depends on the current gas prices on the Sui network.',
      category: 'creation'
    },
    {
      question: 'How is the price of a coin determined?',
      answer: 'The price of a coin is determined by a bonding curve algorithm, which automatically adjusts the price based on the supply and demand. As more people buy the coin, the price increases, and as more people sell, the price decreases.',
      category: 'trading'
    },
    {
      question: 'What is a bonding curve?',
      answer: 'A bonding curve is a mathematical formula that determines the price of a token based on its supply. In our platform, we use a linear bonding curve, which means the price increases linearly with the supply.',
      category: 'trading'
    },
    {
      question: 'Can I customize my coin after creation?',
      answer: 'Yes, as the creator of a coin, you can update certain metadata like the description and logo through the Creator Dashboard. However, core parameters like the name, symbol, and bonding curve cannot be changed after creation.',
      category: 'creation'
    },
    {
      question: 'How do I buy or sell a meme coin?',
      answer: 'To buy or sell a meme coin, navigate to the coin\'s detail page, connect your wallet, enter the amount you want to buy or sell, and confirm the transaction. The platform will automatically execute the trade based on the current price.',
      category: 'trading'
    },
    {
      question: 'What wallets are supported?',
      answer: 'We currently support Sui Wallet, Ethos Wallet, and Suiet Wallet. More wallet integrations are planned for the future.',
      category: 'wallets'
    },
    {
      question: 'Is there a mobile app?',
      answer: 'Currently, PumpSui is a web application optimized for both desktop and mobile browsers. A dedicated mobile app is on our roadmap for future development.',
      category: 'general'
    },
    {
      question: 'How do I track my portfolio?',
      answer: 'You can track your portfolio by connecting your wallet and navigating to the Portfolio page. This will show all the meme coins you own, their current value, and your profit/loss.',
      category: 'trading'
    },
    {
      question: 'What happens if I lose access to my wallet?',
      answer: 'If you lose access to your wallet, you will lose access to your coins and creator privileges. We recommend following best practices for wallet security, including backing up your seed phrase in a secure location.',
      category: 'wallets'
    },
    {
      question: 'How can I contact support?',
      answer: 'You can contact our support team through the Contact page or by emailing support@pumpsui.com. We aim to respond to all inquiries within 24 hours.',
      category: 'general'
    }
  ]

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'general', name: 'General' },
    { id: 'creation', name: 'Coin Creation' },
    { id: 'trading', name: 'Trading' },
    { id: 'wallets', name: 'Wallets' }
  ]

  const filteredFAQs = activeCategory === 'all'
    ? faqItems
    : faqItems.filter(item => item.category === activeCategory)

  return (
    <div className="space-y-8">
      <section className="text-center py-12 bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg text-white">
        <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Find answers to common questions about PumpSui
        </p>
      </section>

      <section className="flex flex-col md:flex-row gap-6">
        {/* Mobile category selector */}
        <div className="md:hidden mb-4">
          <Card>
            <label htmlFor="category-select" className="block text-sm font-medium text-gray-700 mb-2">
              Select Category
            </label>
            <select
              id="category-select"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </Card>
        </div>

        {/* Desktop category sidebar */}
        <div className="hidden md:block md:w-1/4">
          <Card>
            <h2 className="text-lg font-bold mb-4">Categories</h2>
            <div className="space-y-2">
              {categories.map(category => (
                <button
                  type="button"
                  key={category.id}
                  className={`block w-full text-left px-3 py-2 rounded-md ${
                    activeCategory === category.id
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </Card>
        </div>

        <div className="md:w-3/4">
          <Card>
            <h2 className="text-2xl font-bold mb-6">
              {activeCategory === 'all' ? 'All Questions' : categories.find(c => c.id === activeCategory)?.name}
            </h2>
            <div className="space-y-4">
              {filteredFAQs.map((faq, index) => (
                <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                  <button
                    type="button"
                    className="flex justify-between items-center w-full text-left font-medium text-gray-900 py-2"
                    onClick={() => toggleFAQ(index)}
                  >
                    <span className="pr-2">{faq.question}</span>
                    <svg
                      className={`h-5 w-5 flex-shrink-0 text-gray-500 transition-transform ${
                        activeIndex === index ? 'transform rotate-180' : ''
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  {activeIndex === index && (
                    <div className="mt-2 text-gray-700">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      <section className="text-center py-8">
        <h2 className="text-2xl font-bold mb-4">Still Have Questions?</h2>
        <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
          If you couldn't find the answer to your question, feel free to reach out to our support team.
        </p>
        <Link to="/contact" className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700">
          Contact Us
        </Link>
      </section>
    </div>
  )
}

export default FAQ
