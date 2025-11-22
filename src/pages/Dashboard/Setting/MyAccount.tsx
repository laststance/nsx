import { zodResolver } from '@hookform/resolvers/zod'
import React, { memo, useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import type { FieldValues } from 'react-hook-form'
import { useSelector } from 'react-redux'

import Button from '@/src/components/Button'
import Input from '@/src/components/Input/Input'
import { selectUser, updateProfile } from '@/src/redux/adminSlice'
import {
  useGetHoverColorPreferenceQuery,
  useUpdateHoverColorPreferenceMutation,
  useUpdateProfileMutation,
} from '@/src/redux/API'
import { enqueSnackbar } from '@/src/redux/snackbarSlice'
import { dispatch } from '@/src/redux/store'

import { updateProfileValidator } from '../../../../validator'

interface FormInput extends FieldValues {
  name?: User['name']
  password?: string
}

const MyAccount: React.FC = memo(() => {
  const currentUser = useSelector(selectUser)
  const [updateProfileMutation, { isLoading: isUpdatingProfile }] =
    useUpdateProfileMutation()

  const {
    formState: { errors },
    handleSubmit,
    register,
    setValue,
  } = useForm<FormInput>({
    resolver: zodResolver(updateProfileValidator),
  })

  // Load current user name into form
  useEffect(() => {
    if (currentUser.name) {
      setValue('name', currentUser.name)
    }
  }, [currentUser.name, setValue])

  const onSubmit = async (data: FormInput) => {
    try {
      // Prepare update data (only include fields that are filled and changed)
      const updateData: { name?: string; password?: string } = {}

      // Only include name if it's changed
      if (data.name && data.name.trim() && data.name !== currentUser.name) {
        updateData.name = data.name
      }

      // Only include password if it's provided
      if (data.password && data.password.trim()) {
        updateData.password = data.password
      }

      // Check if there's anything to update
      if (Object.keys(updateData).length === 0) {
        dispatch(
          enqueSnackbar({
            color: 'green',
            message: 'No changes to save',
          }),
        )
        return
      }

      const result = await updateProfileMutation(updateData).unwrap()

      // Update Redux state with new user data
      dispatch(updateProfile(result))

      // Clear password field after successful update
      setValue('password', '')

      dispatch(
        enqueSnackbar({
          color: 'green',
          message: 'Profile updated successfully',
        }),
      )
    } catch (error) {
      console.error('Failed to update profile:', error)
      dispatch(
        enqueSnackbar({
          color: 'red',
          message: 'Failed to update profile',
        }),
      )
    }
  }

  const { data: preferenceData, isLoading: isLoadingPreference } =
    useGetHoverColorPreferenceQuery()
  const [updatePreference, { isLoading: isUpdating }] =
    useUpdateHoverColorPreferenceMutation()

  const [useLegacyColors, setUseLegacyColors] = useState(false)

  useEffect(() => {
    if (preferenceData) {
      setUseLegacyColors(preferenceData.useLegacyHoverColors)
    }
  }, [preferenceData])

  const handleToggleChange = async () => {
    const newValue = !useLegacyColors
    setUseLegacyColors(newValue)

    try {
      await updatePreference(newValue).unwrap()
      dispatch(
        enqueSnackbar({
          color: 'green',
          message: 'Hover color preference updated successfully',
        }),
      )
    } catch (error) {
      console.error('Failed to update preference:', error)
      // Revert on error
      setUseLegacyColors(!newValue)
      dispatch(
        enqueSnackbar({
          color: 'red',
          message: 'Failed to update hover color preference',
        }),
      )
    }
  }

  return (
    <>
      <h1
        className="text-color-primary text-center text-3xl"
        data-testid="my-account-setting"
      >
        My Account
      </h1>
      <form
        className="mx-auto w-full max-w-sm"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="mb-6 md:flex md:items-center">
          <div className="md:w-1/3">
            <label
              className="mb-1 block pr-4 font-bold text-gray-500 md:mb-0 md:text-right"
              htmlFor="name"
            >
              Name
            </label>
          </div>
          <div className="md:w-2/3">
            <Input
              placeholder="name"
              reactHookFormParams={{
                name: 'name',
                fieldError: errors['name'],
                register,
              }}
              data-testid="name-input"
            />
          </div>
        </div>
        <div className="mb-6 md:flex md:items-center">
          <div className="md:w-1/3">
            <label
              className="mb-1 block pr-4 font-bold text-gray-500 md:mb-0 md:text-right"
              htmlFor="password"
            >
              Password
            </label>
          </div>
          <div className="md:w-2/3">
            <Input
              type="password"
              placeholder="leave blank to keep current"
              reactHookFormParams={{
                name: 'password',
                fieldError: errors['password'],
                register,
              }}
              data-testid="password-input"
            />
          </div>
        </div>
        <div className="mb-6 md:flex md:items-center">
          <div className="md:w-1/3">
            <label
              className="mb-1 block pr-4 font-bold text-gray-500 md:mb-0 md:text-right"
              htmlFor="legacy-colors"
            >
              Legacy Hover Colors
            </label>
          </div>
          <div className="md:w-2/3">
            <button
              type="button"
              role="switch"
              aria-checked={useLegacyColors}
              onClick={handleToggleChange}
              disabled={isLoadingPreference || isUpdating}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${
                useLegacyColors ? 'bg-indigo-600' : 'bg-gray-200'
              }`}
              data-testid="legacy-colors-toggle"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  useLegacyColors ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <p className="mt-1 text-xs text-gray-500">
              Use cyan/amber colors for dark theme hover buttons (legacy style)
            </p>
          </div>
        </div>
        <div className="md:flex md:items-center">
          <div className="md:w-1/3"></div>
          <div className="md:w-2/3">
            <Button
              type="submit"
              variant="secondary"
              data-testid="submit-btn"
              disabled={isUpdatingProfile}
            >
              {isUpdatingProfile ? 'Saving...' : 'Submit'}
            </Button>
          </div>
        </div>
      </form>
    </>
  )
})
MyAccount.displayName = 'MyAccount'

export default MyAccount
