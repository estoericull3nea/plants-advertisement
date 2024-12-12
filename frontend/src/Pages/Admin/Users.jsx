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
  const [showValidIdDialog, setShowValidIdDialog] = useState(false)
  const [validIdUrl, setValidIdUrl] = useState('')

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

  const toggleVerificationStatus = (user) => {
    const updatedUser = { ...user, isVerified: !user.isVerified }
    axios
      .put(
        `${import.meta.env.VITE_DEV_BACKEND_URL}/users/${user._id}`,
        updatedUser
      )
      .then((response) => {
        setUsers(users.map((u) => (u._id === user._id ? response.data : u)))
        toast.success(
          `User ${user.firstName} ${
            user.isVerified ? 'unverified' : 'verified'
          } successfully!`
        )
      })
      .catch((error) => {
        console.error('Error updating user verification status:', error)
        toast.error('Could not update user verification status!')
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
        <Button
          label='View Valid ID'
          icon='pi pi-eye'
          className='p-button-rounded p-button-info'
          onClick={() => {
            setValidIdUrl(rowData.validIdUrl)
            setShowValidIdDialog(true)
          }}
        />
        <Button
          label={rowData.isVerified ? 'Make Unverified' : 'Make Verified'}
          icon={rowData.isVerified ? 'pi pi-times' : 'pi pi-check'}
          className={`p-button-rounded ${
            rowData.isVerified
              ? 'p-button-danger bg-red-200 p-3 text-black'
              : 'p-button-success bg-green-200 p-3 text-black'
          }`}
          onClick={() => toggleVerificationStatus(rowData)}
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
      style={{ width: '450px' }}
      header={isEditing ? 'Edit User' : 'Add User'}
      modal
      onHide={() => setShowDialog(false)}
    >
      <div className='p-fluid'>
        {/* Existing fields */}
        <div className='p-field'>
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
        <div className='p-field'>
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
        <div className='p-field'>
          <label htmlFor='email'>Email</label>
          <input
            id='email'
            type='email'
            value={isEditing ? selectedUser.email : newUser.email}
            onChange={(e) =>
              isEditing
                ? setSelectedUser({ ...selectedUser, email: e.target.value })
                : setNewUser({ ...newUser, email: e.target.value })
            }
            className='input input-bordered w-full'
          />
        </div>
        <div className='p-field'>
          <label htmlFor='contactNumber'>Contact Number</label>
          <input
            id='contactNumber'
            type='text'
            value={
              isEditing ? selectedUser.contactNumber : newUser.contactNumber
            }
            onChange={(e) =>
              isEditing
                ? setSelectedUser({
                    ...selectedUser,
                    contactNumber: e.target.value,
                  })
                : setNewUser({ ...newUser, contactNumber: e.target.value })
            }
            className='input input-bordered w-full'
          />
        </div>
        <div className='p-field'>
          <label htmlFor='municipality'>Municipality</label>
          <input
            id='municipality'
            type='text'
            value={isEditing ? selectedUser.municipality : newUser.municipality}
            onChange={(e) =>
              isEditing
                ? setSelectedUser({
                    ...selectedUser,
                    municipality: e.target.value,
                  })
                : setNewUser({ ...newUser, municipality: e.target.value })
            }
            className='input input-bordered w-full'
          />
        </div>
        <div className='p-field'>
          <label htmlFor='barangay'>Barangay</label>
          <input
            id='barangay'
            type='text'
            value={isEditing ? selectedUser.barangay : newUser.barangay}
            onChange={(e) =>
              isEditing
                ? setSelectedUser({ ...selectedUser, barangay: e.target.value })
                : setNewUser({ ...newUser, barangay: e.target.value })
            }
            className='input input-bordered w-full'
          />
        </div>
        <div className='p-field'>
          <label htmlFor='dateOfBirth'>Date of Birth</label>
          <input
            id='dateOfBirth'
            type='date'
            value={
              isEditing
                ? selectedUser.dateOfBirth
                  ? new Date(selectedUser.dateOfBirth)
                      .toISOString()
                      .split('T')[0]
                  : ''
                : newUser.dateOfBirth
            }
            onChange={(e) =>
              isEditing
                ? setSelectedUser({
                    ...selectedUser,
                    dateOfBirth: e.target.value,
                  })
                : setNewUser({ ...newUser, dateOfBirth: e.target.value })
            }
            className='input input-bordered w-full'
          />
        </div>
        {/* <div className='p-field'>
          <label htmlFor='age'>Age</label>
          <input
            id='age'
            type='number'
            value={isEditing ? selectedUser.age : newUser.age}
            onChange={(e) =>
              isEditing
                ? setSelectedUser({ ...selectedUser, age: e.target.value })
                : setNewUser({ ...newUser, age: e.target.value })
            }
            className='input input-bordered w-full'
          />
        </div> */}
        {/* <div className='p-field'>
          <label htmlFor='isVerified'>Verified</label>
          <select
            id='isVerified'
            value={isEditing ? selectedUser.isVerified : newUser.isVerified}
            onChange={(e) =>
              isEditing
                ? setSelectedUser({
                    ...selectedUser,
                    isVerified: e.target.value,
                  })
                : setNewUser({ ...newUser, isVerified: e.target.value })
            }
            className='select select-bordered w-full'
          >
            <option value='true'>Verified</option>
            <option value='false'>Not Verified</option>
          </select>
        </div> */}

        {/* Password Fields for Edit User */}
        {isEditing && (
          <>
            <div className='p-field'>
              <label htmlFor='newPassword'>New Password</label>
              <input
                id='newPassword'
                type='password'
                value={selectedUser.newPassword || ''}
                onChange={(e) =>
                  setSelectedUser({
                    ...selectedUser,
                    newPassword: e.target.value,
                  })
                }
                className='input input-bordered w-full'
                placeholder='Enter new password (leave blank to keep current)'
              />
            </div>
          </>
        )}

        {/* Password Fields for Add User */}
        {!isEditing && (
          <>
            <div className='p-field'>
              <label htmlFor='password'>Password</label>
              <input
                id='password'
                type='password'
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
                className='input input-bordered w-full'
              />
            </div>
            <div className='p-field'>
              <label htmlFor='confirmPassword'>Confirm Password</label>
              <input
                id='confirmPassword'
                type='password'
                value={newUser.confirmPassword}
                onChange={(e) =>
                  setNewUser({ ...newUser, confirmPassword: e.target.value })
                }
                className='input input-bordered w-full'
              />
            </div>
          </>
        )}
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
        />
      </div>

      <Dialog
        visible={showValidIdDialog}
        style={{ width: '50vw' }}
        header='Valid ID'
        modal
        onHide={() => setShowValidIdDialog(false)}
      >
        <div className='p-d-flex p-jc-center'>
          <img
            src={validIdUrl}
            alt='Valid ID'
            className='w-full max-h-96 object-contain'
          />
        </div>
      </Dialog>

      {loading ? (
        skeletonLoader
      ) : (
        <DataTable
          value={users}
          paginator
          rows={10}
          globalFilter={globalFilter}
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
          {/* <Column
            field='age'
            header='Age'
            sortable
            body={(rowData) => (rowData.age != null ? rowData.age : 'N/A')} // Display 'N/A' if age is null/undefined
          /> */}
          <Column
            field='isVerified'
            header='Verified'
            sortable
            body={(rowData) => (
              <span
                className={
                  rowData.isVerified ? 'text-green-500' : 'text-red-500'
                }
              >
                {rowData.isVerified ? 'Yes' : 'No'}
              </span>
            )}
          />
          {/* <Column
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
          /> */}

          <Column header='Actions' body={actionBodyTemplate} />
        </DataTable>
      )}

      {userDialog}
    </div>
  )
}

export default Users
