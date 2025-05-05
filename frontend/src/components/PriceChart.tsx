import React, { useState, useEffect } from 'react'
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  TimeScale,
  ChartOptions
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import Card from './common/Card'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
)

interface PriceChartProps {
  coinId: string
  coinSymbol: string
}

type TimeRange = '1h' | '24h' | '7d' | '30d' | 'all'

interface PriceData {
  timestamp: number
  price: number
}

const PriceChart: React.FC<PriceChartProps> = ({ coinId, coinSymbol }) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('7d')
  const [priceData, setPriceData] = useState<PriceData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPriceData(coinId, timeRange)
  }, [coinId, timeRange])

  const fetchPriceData = async (id: string, range: TimeRange) => {
    setLoading(true)
    setError(null)
    
    try {
      // In a real app, this would be an API call to fetch historical price data
      // For now, we'll generate mock data
      const mockData = generateMockPriceData(range)
      setPriceData(mockData)
    } catch (err) {
      console.error('Error fetching price data:', err)
      setError('Failed to load price data')
    } finally {
      setLoading(false)
    }
  }

  const generateMockPriceData = (range: TimeRange): PriceData[] => {
    const now = new Date().getTime()
    const data: PriceData[] = []
    
    // Set the number of data points and interval based on the time range
    let dataPoints = 0
    let interval = 0
    let basePrice = 0.05 // Starting price
    let volatility = 0.02 // Price volatility
    
    switch (range) {
      case '1h':
        dataPoints = 60
        interval = 60 * 1000 // 1 minute
        volatility = 0.005
        break
      case '24h':
        dataPoints = 24
        interval = 60 * 60 * 1000 // 1 hour
        volatility = 0.01
        break
      case '7d':
        dataPoints = 7 * 24
        interval = 60 * 60 * 1000 // 1 hour
        volatility = 0.02
        break
      case '30d':
        dataPoints = 30
        interval = 24 * 60 * 60 * 1000 // 1 day
        volatility = 0.03
        break
      case 'all':
        dataPoints = 90
        interval = 24 * 60 * 60 * 1000 // 1 day
        volatility = 0.04
        break
    }
    
    // Generate random price data with a slight upward trend
    for (let i = dataPoints - 1; i >= 0; i--) {
      const timestamp = now - (i * interval)
      const randomChange = (Math.random() - 0.4) * volatility // Slight upward bias
      basePrice = Math.max(0.001, basePrice * (1 + randomChange))
      
      data.push({
        timestamp,
        price: basePrice
      })
    }
    
    return data
  }

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp)
    
    switch (timeRange) {
      case '1h':
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      case '24h':
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      case '7d':
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' + 
               date.toLocaleTimeString([], { hour: '2-digit' })
      case '30d':
      case 'all':
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
    }
  }

  const chartData = {
    labels: priceData.map(data => formatDate(data.timestamp)),
    datasets: [
      {
        label: `${coinSymbol} Price`,
        data: priceData.map(data => data.price),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.1,
        pointRadius: timeRange === '1h' || timeRange === '24h' ? 2 : 0,
        pointHoverRadius: 5,
      },
    ],
  }

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: (context) => `Price: $${context.parsed.y.toFixed(6)}`,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 10,
        },
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          callback: (value) => `$${Number(value).toFixed(6)}`,
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
  }

  const timeRangeOptions: { value: TimeRange; label: string }[] = [
    { value: '1h', label: '1H' },
    { value: '24h', label: '24H' },
    { value: '7d', label: '7D' },
    { value: '30d', label: '30D' },
    { value: 'all', label: 'All' },
  ]

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Price Chart</h2>
        <div className="flex space-x-2">
          {timeRangeOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`px-3 py-1 text-sm rounded-md ${
                timeRange === option.value
                  ? 'bg-primary-100 text-primary-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setTimeRange(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="h-80">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="text-gray-500">Loading price data...</div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-full">
            <div className="text-red-500">{error}</div>
          </div>
        ) : (
          <Line data={chartData} options={chartOptions} />
        )}
      </div>
      
      {!loading && !error && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-gray-500 text-sm">Current Price</div>
              <div className="text-xl font-bold">
                ${priceData[priceData.length - 1]?.price.toFixed(6)}
              </div>
            </div>
            <div>
              <div className="text-gray-500 text-sm">Price Change ({timeRange})</div>
              {priceData.length > 1 && (
                <div className={`text-xl font-bold ${
                  priceData[priceData.length - 1].price > priceData[0].price
                    ? 'text-green-500'
                    : 'text-red-500'
                }`}>
                  {priceData[priceData.length - 1].price > priceData[0].price ? '+' : ''}
                  {(((priceData[priceData.length - 1].price - priceData[0].price) / priceData[0].price) * 100).toFixed(2)}%
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}

export default PriceChart
