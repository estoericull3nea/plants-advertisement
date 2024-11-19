// Users.js
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { toast } from 'react-hot-toast'
import { InputNumber } from 'primereact/inputnumber'
import { Calendar } from 'primereact/calendar'
import { formatDate } from '../../utils/formatDate'

const Users = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState(null)
  const [showDialog, setShowDialog] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    contactNumber: '',
    municipality: '',
    barangay: '',
    password: '',
    idImage: '',
    dateOfBirth: null,
    age: null,
    picture: '',
    lastActive: new Date(),
    isVerified: true,
  })

  const [globalFilter, setGlobalFilter] = useState('') // Global search state

  // Fetch users from backend
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_DEV_BACKEND_URL}/users`)
      .then((response) => {
        setUsers(response.data)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching users:', error)
        setLoading(false)
      })
  }, [])

  // Handle adding a new user
  const addUser = () => {
    axios
      .post(`${import.meta.env.VITE_DEV_BACKEND_URL}/users`, newUser)
      .then((response) => {
        setUsers([...users, response.data])
        toast.success(`User ${response.data.firstName} added successfully!`)
        setShowDialog(false)
        setNewUser({
          firstName: '',
          lastName: '',
          email: '',
          contactNumber: '',
          municipality: '',
          barangay: '',
          password: '',
          idImage: '',
          dateOfBirth: null,
          age: null,
          picture: '',
          lastActive: new Date(),
          isVerified: true,
        })
      })
      .catch((error) => {
        console.error('Error adding user:', error)
        toast.error('Could not add user!')
      })
  }

  // Handle deleting a user
  const deleteUser = (userId) => {
    axios
      .delete(`${import.meta.env.VITE_DEV_BACKEND_URL}/users/${userId}`)
      .then(() => {
        setUsers(users.filter((user) => user._id !== userId))
        toast.success('User deleted successfully!')
      })
      .catch((error) => {
        console.error('Error deleting user:', error)
        toast.error('Could not delete user!')
      })
  }

  // Handle updating a user
  const updateUser = () => {
    axios
      .put(
        `${import.meta.env.VITE_DEV_BACKEND_URL}/users/${selectedUser._id}`,
        selectedUser
      )
      .then((response) => {
        setUsers(
          users.map((user) =>
            user._id === response.data._id ? response.data : user
          )
        )
        toast.success('User updated successfully!')
        setShowDialog(false)
      })
      .catch((error) => {
        console.error('Error updating user:', error)
        toast.error('Could not update user!')
      })
  }

  // Handle viewing a single user
  const viewUser = (userId) => {
    axios
      .get(`${import.meta.env.VITE_DEV_BACKEND_URL}/users/${userId}`)
      .then((response) => {
        setSelectedUser(response.data)
        setShowDialog(true)
        setIsEditing(false) // Set to view mode
      })
      .catch((error) => {
        console.error('Error fetching user details:', error)
        toast.error('Could not fetch user details!')
      })
  }

  // Table Action Buttons
  const actionBodyTemplate = (rowData) => {
    return (
      <div className='flex gap-2'>
        {/* <Button
          icon='pi pi-eye'
          className='p-button-rounded p-button-info'
          onClick={() => viewUser(rowData._id)}
        /> */}
        <Button
          icon='pi pi-pencil'
          className='p-button-rounded p-button-warning'
          onClick={() => {
            setSelectedUser(rowData)
            setIsEditing(true)
            setShowDialog(true)
          }}
        />
        <Button
          icon='pi pi-trash'
          className='p-button-rounded p-button-danger'
          onClick={() => deleteUser(rowData._id)}
        />
      </div>
    )
  }

  // Skeleton loading while fetching users
  const skeletonLoader = (
    <div className='flex w-full flex-col gap-4'>
      <div className='skeleton h-32 w-full'></div>
      <div className='skeleton h-4 w-28'></div>
      <div className='skeleton h-4 w-full'></div>
      <div className='skeleton h-4 w-full'></div>
    </div>
  )

  // Dialog for adding or updating a user
  const userDialog = (
    <Dialog
      visible={showDialog}
      style={{ width: '90vw', maxWidth: '450px' }} // Make dialog width responsive
      header={isEditing ? 'Edit User' : 'Add User'}
      modal
      onHide={() => setShowDialog(false)}
    >
      <div className='p-fluid grid'>
        <div className='p-field col-12 md:col-6'>
          <label htmlFor='firstName'>First Name</label>
          <input
            id='firstName'
            type='text'
            value={isEditing ? selectedUser.firstName : newUser.firstName}
            onChange={(e) =>
              isEditing
                ? setSelectedUser({
                    ...selectedUser,
                    firstName: e.target.value,
                  })
                : setNewUser({ ...newUser, firstName: e.target.value })
            }
            className='input input-bordered w-full'
          />
        </div>
        <div className='p-field col-12 md:col-6'>
          <label htmlFor='lastName'>Last Name</label>
          <input
            id='lastName'
            type='text'
            value={isEditing ? selectedUser.lastName : newUser.lastName}
            onChange={(e) =>
              isEditing
                ? setSelectedUser({ ...selectedUser, lastName: e.target.value })
                : setNewUser({ ...newUser, lastName: e.target.value })
            }
            className='input input-bordered w-full'
          />
        </div>
      </div>

      <div className='p-d-flex p-jc-between'>
        <Button
          label={isEditing ? 'Update' : 'Add'}
          icon='pi pi-check'
          onClick={isEditing ? updateUser : addUser}
          className='p-button-success'
        />
        <Button
          label='Cancel'
          icon='pi pi-times'
          onClick={() => setShowDialog(false)}
          className='p-button-secondary'
        />
      </div>
    </Dialog>
  )

  return (
    <div>
      <Button
        label='Add User'
        icon='pi pi-plus'
        className='p-button-primary mb-4 border p-3'
        onClick={() => {
          setIsEditing(false)
          setShowDialog(true)
        }}
      />

      {/* Global Search Field */}
      <div className='p-inputgroup mb-4'>
        <span className='p-inputgroup-addon'>
          <i className='pi pi-search'></i>
        </span>
        <InputText
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder='Search users...'
          className='w-full' // Ensure input takes full width on smaller screens
        />
      </div>

      {loading ? (
        skeletonLoader
      ) : (
        <DataTable
          value={users}
          paginator
          rows={10}
          globalFilter={globalFilter}
          scrollable
          scrollHeight='400px' // Adjust as needed for mobile screens
          className='p-datatable-responsive' // Add this class for additional responsiveness
        >
          <Column
            field='firstName'
            header='First Name'
            sortable
            body={(rowData) => rowData.firstName || 'N/A'}
          />
          <Column
            field='lastName'
            header='Last Name'
            sortable
            body={(rowData) => rowData.lastName || 'N/A'}
          />
          <Column
            field='email'
            header='Email'
            sortable
            body={(rowData) => rowData.email || 'N/A'}
          />
          <Column
            field='contactNumber'
            header='Contact Number'
            sortable
            body={(rowData) => rowData.contactNumber || 'N/A'}
            className='md:col-6' // Make the column visible only on medium and larger screens
          />

          <Column
            field='municipality'
            header='Municipality'
            sortable
            body={(rowData) => rowData.municipality || 'N/A'} // Display 'N/A' if municipality is null/undefined
          />
          <Column
            field='barangay'
            header='Barangay'
            sortable
            body={(rowData) => rowData.barangay || 'N/A'} // Display 'N/A' if barangay is null/undefined
          />
          <Column
            field='dateOfBirth'
            header='Date of Birth'
            sortable
            body={(rowData) =>
              rowData.dateOfBirth ? formatDate(rowData.dateOfBirth) : 'N/A'
            } // If dateOfBirth is null/undefined, show 'N/A'
          />
          <Column
            field='age'
            header='Age'
            sortable
            body={(rowData) => (rowData.age != null ? rowData.age : 'N/A')} // Display 'N/A' if age is null/undefined
          />
          <Column
            field='isVerified'
            header='Verified'
            sortable
            body={(rowData) =>
              rowData.isVerified != null
                ? rowData.isVerified
                  ? 'Yes'
                  : 'No'
                : 'N/A'
            } // Display 'Yes'/'No' based on isVerified, 'N/A' if null
          />

          <Column header='Actions' body={actionBodyTemplate} />
        </DataTable>
      )}

      {userDialog}
    </div>
  )
}

export default Users
