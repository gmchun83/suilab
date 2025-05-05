import { Routes, Route, Link } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import CreateCoin from './pages/CreateCoin'
import CoinDetails from './pages/CoinDetails'
import Explore from './pages/Explore'
import Portfolio from './pages/Portfolio'
import CreatorDashboard from './pages/CreatorDashboard'
import WalletConnection from './pages/WalletConnection'
import UserProfile from './pages/UserProfile'
import About from './pages/About'
import FAQ from './pages/FAQ'
import Contact from './pages/Contact'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'

function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateCoin />} />
          <Route path="/coins/:id" element={<CoinDetails />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/dashboard" element={<CreatorDashboard />} />
          <Route path="/wallet" element={<WalletConnection />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
        </Routes>
      </main>
      <footer className="bg-gray-100 py-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-600">© 2023 PumpSui - Meme Coin Launch Platform</p>
            </div>
            <div className="flex space-x-4">
              <Link to="/about" className="text-gray-600 hover:text-primary-600">About</Link>
              <Link to="/faq" className="text-gray-600 hover:text-primary-600">FAQ</Link>
              <Link to="/contact" className="text-gray-600 hover:text-primary-600">Contact</Link>
              <Link to="/terms" className="text-gray-600 hover:text-primary-600">Terms</Link>
              <Link to="/privacy" className="text-gray-600 hover:text-primary-600">Privacy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
