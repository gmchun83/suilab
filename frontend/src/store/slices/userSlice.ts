import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface NotificationPreferences {
  priceAlerts: boolean
  transactionUpdates: boolean
  marketingEmails: boolean
}

interface DisplaySettings {
  darkMode: boolean
  compactView: boolean
  showBalances: boolean
}

export interface UserProfile {
  displayName: string
  avatarUrl: string
  email: string
  notificationPreferences: NotificationPreferences
  displaySettings: DisplaySettings
}

interface UserState {
  profile: UserProfile | null
  loading: boolean
  error: string | null
}

const initialState: UserState = {
  profile: null,
  loading: false,
  error: null
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    fetchUserProfileStart(state) {
      state.loading = true
      state.error = null
    },
    fetchUserProfileSuccess(state, action: PayloadAction<UserProfile>) {
      state.profile = action.payload
      state.loading = false
    },
    fetchUserProfileFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    },
    updateUserProfile(state, action: PayloadAction<UserProfile>) {
      state.profile = action.payload
    },
    clearUserProfile(state) {
      state.profile = null
    }
  }
})

export const {
  fetchUserProfileStart,
  fetchUserProfileSuccess,
  fetchUserProfileFailure,
  updateUserProfile,
  clearUserProfile
} = userSlice.actions

export default userSlice.reducer
