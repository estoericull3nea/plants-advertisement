// src/components/ProductStats.js

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const ProductStats = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedOption, setSelectedOption] = useState('daily')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_DEV_BACKEND_URL}/datas/average-product-posts`
        )
        setData(response.data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching product post data:', error)
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const chartData =
    data && data[selectedOption]
      ? {
          labels: data[selectedOption].labels,
          datasets: [
            {
              label: `${
                selectedOption.charAt(0).toUpperCase() + selectedOption.slice(1)
              } Product Posts`,
              data: data[selectedOption].data,
              borderColor: 'rgba(75, 192, 192, 1)',
              fill: false,
            },
          ],
        }
      : {}

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Average Product Posts Over Time',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Number of Products Posted',
        },
        beginAtZero: true,
      },
    },
  }

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value)
  }

  return (
    <div className='product-stats'>
      {loading ? (
        <div className='flex w-full flex-col gap-4'>
          <div className='skeleton h-32 w-full'></div>
          <div className='skeleton h-4 w-28'></div>
          <div className='skeleton h-4 w-full'></div>
          <div className='skeleton h-4 w-full'></div>
        </div>
      ) : (
        <div>
          <div className='mb-4'>
            <label htmlFor='timeframe' className='mr-2'>
              Select Timeframe:
            </label>
            <select
              id='timeframe'
              value={selectedOption}
              onChange={handleOptionChange}
              className='p-2 border border-gray-300 rounded-md'
            >
              <option value='daily'>Daily</option>
              <option value='weekly'>Weekly</option>
              <option value='monthly'>Monthly</option>
              <option value='yearly'>Yearly</option>
            </select>
          </div>
          <Line data={chartData} options={options} />
        </div>
      )}
    </div>
  )
}

export default ProductStats
