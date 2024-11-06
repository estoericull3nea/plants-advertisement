import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { InputText } from 'primereact/inputtext'
import { Toast } from 'primereact/toast'

// Skeleton component for loading state
const Skeleton = () => (
  <div className='flex w-full flex-col gap-4'>
    <div className='skeleton h-32 w-full bg-gray-300 animate-pulse'></div>
    <div className='skeleton h-4 w-28 bg-gray-300 animate-pulse'></div>
    <div className='skeleton h-4 w-full bg-gray-300 animate-pulse'></div>
    <div className='skeleton h-4 w-full bg-gray-300 animate-pulse'></div>
  </div>
)

const CropsPlanning = () => {
  const [crops, setCrops] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [toast] = useState(null)

  // Fetch crops data from the backend API
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_DEV_BACKEND_URL}/plants`) // Replace with the appropriate backend URL
      .then((response) => {
        setCrops(response.data)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching crops:', error)
        setLoading(false)
        toast?.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load data.',
        })
      })
  }, [toast])

  // Global search handler
  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  return (
    <div className='container mx-auto p-6'>
      <Toast ref={toast} />

      <h1 className='text-3xl font-bold mb-6'>Crops Planning</h1>

      {/* Global Search Input */}
      <div className='mb-6 flex items-center space-x-2'>
        <InputText
          value={searchTerm}
          onChange={handleSearch}
          placeholder='Search...'
          className='w-full md:w-3/4 lg:w-1/2 p-2 border border-gray-300 rounded-md'
        />
      </div>

      {/* Show Skeleton loading while fetching data */}
      {loading ? (
        <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </div>
      ) : (
        // DataTable with sorting, pagination, and filtering
        <DataTable
          value={crops.filter((crop) => {
            // Filter the crops based on the search term
            return (
              crop.cropName.toLowerCase().includes(searchTerm.toLowerCase()) ||
              crop.timeOfPlanting
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              crop.plantPopulation
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              crop.maturity.toLowerCase().includes(searchTerm.toLowerCase()) ||
              crop.volumeOfProduction
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              crop.distanceOfPlanting.hill.toString().includes(searchTerm) ||
              crop.distanceOfPlanting.rows.toString().includes(searchTerm)
            )
          })}
          paginator
          rows={10}
          loading={loading}
          responsiveLayout='scroll'
          globalFilter={searchTerm}
        >
          <Column field='cropName' header='Crop Name' sortable />
          <Column field='timeOfPlanting' header='Time of Planting' sortable />
          <Column field='plantPopulation' header='Plant Population' sortable />
          <Column field='maturity' header='Maturity' sortable />
          <Column
            field='volumeOfProduction'
            header='Volume of Production'
            sortable
          />
          <Column
            header='Distance of Planting'
            body={(rowData) =>
              `Hill: ${rowData.distanceOfPlanting.hill} cm, Rows: ${rowData.distanceOfPlanting.rows} cm`
            }
          />
        </DataTable>
      )}
    </div>
  )
}

export default CropsPlanning
