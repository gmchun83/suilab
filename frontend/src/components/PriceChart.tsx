import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
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
import { RootState } from '../store'
import { fetchCoinPriceHistoryAsync } from '../store/slices/coinsSlice'

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
  const dispatch = useDispatch()
  const { priceHistory, loading: reduxLoading, error: reduxError } = useSelector((state: RootState) => state.coins)
  const [timeRange, setTimeRange] = useState<TimeRange>('7d')
  const [priceData, setPriceData] = useState<PriceData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch price history when component mounts or timeRange changes
  useEffect(() => {
    fetchPriceData(coinId, timeRange)
  }, [coinId, timeRange, dispatch])

  // Update local state when Redux state changes
  useEffect(() => {
    setLoading(reduxLoading)
    setError(reduxError || null)

    if (priceHistory && priceHistory.length > 0) {
      // Convert the price history from the API to our local format
      const formattedData = priceHistory.map(point => ({
        timestamp: point.timestamp,
        price: parseFloat(point.price)
      }))

      setPriceData(formattedData)
    }
  }, [priceHistory, reduxLoading, reduxError])

  const fetchPriceData = async (id: string, range: TimeRange) => {
    try {
      // Convert our timeRange to the format expected by the API
      const period = range === 'all' ? '1y' : range

      // Dispatch the action to fetch price history
      await dispatch(fetchCoinPriceHistoryAsync({ id, period }) as any)
    } catch (err) {
      console.error('Error fetching price data:', err)
      setError('Failed to load price data')
      setLoading(false)
    }
  }

  // We no longer need the mock data generation function since we're using real data from the API

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
