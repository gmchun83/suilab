import React from 'react'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import { Link } from 'react-router-dom'

const About: React.FC = () => {
  return (
    <div className="space-y-8">
      <section className="text-center py-12 bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg text-white">
        <h1 className="text-4xl font-bold mb-4">About PumpSui</h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          The premier meme coin launch platform on the Sui blockchain
        </p>
      </section>

      <section>
        <Card>
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-gray-700 mb-4">
            PumpSui is dedicated to democratizing meme coin creation and trading on the Sui blockchain.
            We believe that anyone should be able to launch their own meme coin with minimal technical knowledge,
            while providing a safe and transparent environment for traders and investors.
          </p>
          <p className="text-gray-700">
            Our platform leverages the power of Sui's fast and scalable blockchain to provide a seamless
            experience for creators and traders alike, with features like automatic liquidity pool creation,
            bonding curve trading, and comprehensive analytics.
          </p>
        </Card>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="text-center">
            <div className="h-12 w-12 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-2">Fast & Efficient</h3>
            <p className="text-gray-600">
              Launch your meme coin in minutes with minimal gas fees thanks to Sui's efficient blockchain.
            </p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="h-12 w-12 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-2">Secure & Transparent</h3>
            <p className="text-gray-600">
              All transactions are secured by the Sui blockchain with full transparency and auditability.
            </p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="h-12 w-12 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-2">Advanced Analytics</h3>
            <p className="text-gray-600">
              Track your coin's performance with comprehensive analytics and trading data.
            </p>
          </div>
        </Card>
      </section>

      <section>
        <Card>
          <h2 className="text-2xl font-bold mb-4">How It Works</h2>
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-start gap-4">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
                <span className="font-bold">1</span>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-1">Create Your Meme Coin</h3>
                <p className="text-gray-700">
                  Choose a name, symbol, and initial supply for your meme coin. Customize with a description and logo.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-start gap-4">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
                <span className="font-bold">2</span>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-1">Automatic Liquidity Pool</h3>
                <p className="text-gray-700">
                  Our platform automatically creates a liquidity pool on Cetus DEX, making your coin instantly tradable.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-start gap-4">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
                <span className="font-bold">3</span>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-1">Bonding Curve Trading</h3>
                <p className="text-gray-700">
                  Your coin's price is determined by a bonding curve algorithm, ensuring fair and predictable pricing.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-start gap-4">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
                <span className="font-bold">4</span>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-1">Monitor & Grow</h3>
                <p className="text-gray-700">
                  Use the creator dashboard to track your coin's performance and engage with your community.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </section>

      <section>
        <Card>
          <h2 className="text-2xl font-bold mb-4">Our Team</h2>
          <p className="text-gray-700 mb-6">
            PumpSui is built by a team of blockchain enthusiasts and developers passionate about the Sui ecosystem and meme culture.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="h-24 w-24 rounded-full bg-gray-200 mx-auto mb-4"></div>
              <h3 className="font-bold">John Doe</h3>
              <p className="text-gray-600">Founder & CEO</p>
            </div>
            <div className="text-center">
              <div className="h-24 w-24 rounded-full bg-gray-200 mx-auto mb-4"></div>
              <h3 className="font-bold">Jane Smith</h3>
              <p className="text-gray-600">CTO</p>
            </div>
            <div className="text-center">
              <div className="h-24 w-24 rounded-full bg-gray-200 mx-auto mb-4"></div>
              <h3 className="font-bold">Mike Johnson</h3>
              <p className="text-gray-600">Lead Developer</p>
            </div>
          </div>
        </Card>
      </section>

      <section className="text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to Launch Your Meme Coin?</h2>
        <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
          <Link to="/create" className="w-full sm:w-auto">
            <Button size="lg" fullWidth className="sm:w-auto">Create Coin</Button>
          </Link>
          <Link to="/explore" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" fullWidth className="sm:w-auto">Explore Coins</Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default About
