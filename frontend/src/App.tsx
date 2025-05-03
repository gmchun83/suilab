import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import CreateCoin from './pages/CreateCoin'
import CoinDetails from './pages/CoinDetails'
import Explore from './pages/Explore'
import Portfolio from './pages/Portfolio'
import CreatorDashboard from './pages/CreatorDashboard'

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
        </Routes>
      </main>
      <footer className="bg-gray-100 py-6">
        <div className="container text-center text-gray-600">
          <p>© 2023 PumpSui - Meme Coin Launch Platform</p>
        </div>
      </footer>
    </div>
  )
}

export default App
