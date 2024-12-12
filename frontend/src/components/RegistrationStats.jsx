import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const RegistrationStats = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedOption, setSelectedOption] = useState('daily') // default to daily

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_DEV_BACKEND_URL}/datas/registration-data`
        )
        setData(response.data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching registration data:', error)
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Chart data structure based on selected option
  const chartData =
    data && data[selectedOption]
      ? {
          labels: data[selectedOption].labels,
          datasets: [
            {
              label: `${
                selectedOption.charAt(0).toUpperCase() + selectedOption.slice(1)
              } Registrations`,
              data: data[selectedOption].data,
              backgroundColor: 'rgba(0, 0, 0, 0.7)', // Set bar color to black
              borderColor: 'rgba(0, 0, 0, 1)', // Set border color to black
              borderWidth: 1,
              barThickness: 20, // You can adjust the bar thickness
            },
          ],
        }
      : {}

  // Chart.js options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'User Registrations Over Time',
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
          text: 'Number of Registrations',
        },
        beginAtZero: true,
      },
    },
  }

  // Handle option change for dropdown
  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value)
  }

  return (
    <div className='registration-stats'>
      {loading ? (
        <div className='flex w-full flex-col gap-4'>
          <div className='skeleton h-32 w-full'></div>
          <div className='skeleton h-4 w-28'></div>
          <div className='skeleton h-4 w-full'></div>
          <div className='skeleton h-4 w-full'></div>
        </div>
      ) : (
        <div>
          {/* Dropdown to select daily, weekly, monthly, or yearly */}
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

          {/* Bar Chart component */}
          <Bar data={chartData} options={options} />
        </div>
      )}
    </div>
  )
}

export default RegistrationStats
