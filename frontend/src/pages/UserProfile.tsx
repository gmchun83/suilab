import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../store'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import { updateUserProfile } from '../store/slices/userSlice'

interface UserSettings {
  displayName: string
  avatarUrl: string
  email: string
  notificationPreferences: {
    priceAlerts: boolean
    transactionUpdates: boolean
    marketingEmails: boolean
  }
  displaySettings: {
    darkMode: boolean
    compactView: boolean
    showBalances: boolean
  }
}

const UserProfile: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { connected, address } = useSelector((state: RootState) => state.wallet)
  const { profile } = useSelector((state: RootState) => state.user)
  
  const [activeTab, setActiveTab] = useState<'profile' | 'settings' | 'activity'>('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Form state
  const [userSettings, setUserSettings] = useState<UserSettings>({
    displayName: '',
    avatarUrl: '',
    email: '',
    notificationPreferences: {
      priceAlerts: true,
      transactionUpdates: true,
      marketingEmails: false
    },
    displaySettings: {
      darkMode: false,
      compactView: false,
      showBalances: true
    }
  })
  
  // Activity history (mock data)
  const [activityHistory, setActivityHistory] = useState<any[]>([])
  
  useEffect(() => {
    if (!connected) {
      navigate('/wallet')
      return
    }
    
    // Load user profile data
    if (profile) {
      setUserSettings({
        displayName: profile.displayName || '',
        avatarUrl: profile.avatarUrl || '',
        email: profile.email || '',
        notificationPreferences: {
          priceAlerts: profile.notificationPreferences?.priceAlerts ?? true,
          transactionUpdates: profile.notificationPreferences?.transactionUpdates ?? true,
          marketingEmails: profile.notificationPreferences?.marketingEmails ?? false
        },
        displaySettings: {
          darkMode: profile.displaySettings?.darkMode ?? false,
          compactView: profile.displaySettings?.compactView ?? false,
          showBalances: profile.displaySettings?.showBalances ?? true
        }
      })
    }
    
    // Load activity history (mock data)
    loadActivityHistory()
  }, [connected, profile, navigate])
  
  const loadActivityHistory = () => {
    // This would be an API call in a real app
    const mockActivity = [
      {
        id: '1',
        type: 'TRANSACTION',
        action: 'BUY',
        coinSymbol: 'DOGE',
        amount: '1000',
        timestamp: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: '2',
        type: 'TRANSACTION',
        action: 'SELL',
        coinSymbol: 'SHIB',
        amount: '5000',
        timestamp: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: '3',
        type: 'PROFILE',
        action: 'UPDATE',
        details: 'Updated profile settings',
        timestamp: new Date(Date.now() - 172800000).toISOString()
      },
      {
        id: '4',
        type: 'WALLET',
        action: 'CONNECT',
        details: 'Connected wallet',
        timestamp: new Date(Date.now() - 259200000).toISOString()
      }
    ]
    
    setActivityHistory(mockActivity)
  }
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    
    if (type === 'checkbox') {
      // Handle checkbox inputs (nested properties)
      const [category, setting] = name.split('.')
      
      setUserSettings(prev => ({
        ...prev,
        [category]: {
          ...prev[category as keyof typeof prev],
          [setting]: checked
        }
      }))
    } else {
      // Handle text inputs (top-level properties)
      setUserSettings(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }
  
  const handleSaveProfile = async () => {
    try {
      setIsSaving(true)
      setError(null)
      setSaveSuccess(false)
      
      // This would be an API call in a real app
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Dispatch action to update profile in Redux store
      dispatch(updateUserProfile(userSettings))
      
      setIsEditing(false)
      setSaveSuccess(true)
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false)
      }, 3000)
    } catch (err) {
      setError('Failed to save profile settings')
    } finally {
      setIsSaving(false)
    }
  }
  
  if (!connected) {
    return null // Redirect handled in useEffect
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">User Profile</h1>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="md:w-1/4">
          <Card>
            <div className="flex flex-col items-center mb-6">
              <div className="h-24 w-24 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                {userSettings.avatarUrl ? (
                  <img 
                    src={userSettings.avatarUrl} 
                    alt="User avatar" 
                    className="h-24 w-24 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-primary-700 text-2xl font-bold">
                    {userSettings.displayName ? userSettings.displayName.charAt(0).toUpperCase() : address?.charAt(0)}
                  </span>
                )}
              </div>
              <div className="text-xl font-bold">
                {userSettings.displayName || 'Anonymous User'}
              </div>
              <div className="text-gray-500 font-mono text-sm mt-1">
                {address?.substring(0, 6)}...{address?.substring(address.length - 4)}
              </div>
            </div>
            
            <div className="space-y-1">
              <button
                type="button"
                className={`w-full text-left px-4 py-2 rounded-md ${
                  activeTab === 'profile'
                    ? 'bg-primary-100 text-primary-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('profile')}
              >
                Profile
              </button>
              <button
                type="button"
                className={`w-full text-left px-4 py-2 rounded-md ${
                  activeTab === 'settings'
                    ? 'bg-primary-100 text-primary-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('settings')}
              >
                Settings
              </button>
              <button
                type="button"
                className={`w-full text-left px-4 py-2 rounded-md ${
                  activeTab === 'activity'
                    ? 'bg-primary-100 text-primary-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('activity')}
              >
                Activity
              </button>
            </div>
          </Card>
        </div>
        
        {/* Main content */}
        <div className="md:w-3/4">
          <Card>
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Profile Information</h2>
                  {!isEditing ? (
                    <Button
                      variant="secondary"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex space-x-2">
                      <Button
                        variant="secondary"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                      >
                        {isSaving ? 'Saving...' : 'Save'}
                      </Button>
                    </div>
                  )}
                </div>
                
                {error && (
                  <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
                    {error}
                  </div>
                )}
                
                {saveSuccess && (
                  <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md">
                    Profile updated successfully!
                  </div>
                )}
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
                      Display Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        id="displayName"
                        name="displayName"
                        value={userSettings.displayName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Enter your display name"
                      />
                    ) : (
                      <div className="py-2">
                        {userSettings.displayName || 'Not set'}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="avatarUrl" className="block text-sm font-medium text-gray-700 mb-1">
                      Avatar URL
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        id="avatarUrl"
                        name="avatarUrl"
                        value={userSettings.avatarUrl}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        placeholder="https://example.com/avatar.jpg"
                      />
                    ) : (
                      <div className="py-2">
                        {userSettings.avatarUrl ? (
                          <a href={userSettings.avatarUrl} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                            {userSettings.avatarUrl}
                          </a>
                        ) : (
                          'Not set'
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={userSettings.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        placeholder="your.email@example.com"
                      />
                    ) : (
                      <div className="py-2">
                        {userSettings.email || 'Not set'}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-1">
                      Wallet Address
                    </div>
                    <div className="py-2 font-mono">
                      {address}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">User Settings</h2>
                  {!isEditing ? (
                    <Button
                      variant="secondary"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Settings
                    </Button>
                  ) : (
                    <div className="flex space-x-2">
                      <Button
                        variant="secondary"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                      >
                        {isSaving ? 'Saving...' : 'Save'}
                      </Button>
                    </div>
                  )}
                </div>
                
                {error && (
                  <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
                    {error}
                  </div>
                )}
                
                {saveSuccess && (
                  <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md">
                    Settings updated successfully!
                  </div>
                )}
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Notification Preferences</h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="priceAlerts"
                          name="notificationPreferences.priceAlerts"
                          checked={userSettings.notificationPreferences.priceAlerts}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <label htmlFor="priceAlerts" className="ml-2 block text-sm text-gray-700">
                          Price alerts
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="transactionUpdates"
                          name="notificationPreferences.transactionUpdates"
                          checked={userSettings.notificationPreferences.transactionUpdates}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <label htmlFor="transactionUpdates" className="ml-2 block text-sm text-gray-700">
                          Transaction updates
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="marketingEmails"
                          name="notificationPreferences.marketingEmails"
                          checked={userSettings.notificationPreferences.marketingEmails}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <label htmlFor="marketingEmails" className="ml-2 block text-sm text-gray-700">
                          Marketing emails
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">Display Settings</h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="darkMode"
                          name="displaySettings.darkMode"
                          checked={userSettings.displaySettings.darkMode}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <label htmlFor="darkMode" className="ml-2 block text-sm text-gray-700">
                          Dark mode
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="compactView"
                          name="displaySettings.compactView"
                          checked={userSettings.displaySettings.compactView}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <label htmlFor="compactView" className="ml-2 block text-sm text-gray-700">
                          Compact view
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="showBalances"
                          name="displaySettings.showBalances"
                          checked={userSettings.displaySettings.showBalances}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <label htmlFor="showBalances" className="ml-2 block text-sm text-gray-700">
                          Show balances
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Activity Tab */}
            {activeTab === 'activity' && (
              <div>
                <h2 className="text-xl font-bold mb-6">Activity History</h2>
                
                {activityHistory.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No activity yet
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activityHistory.map((activity) => (
                      <div key={activity.id} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                        <div className="flex items-start">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            activity.type === 'TRANSACTION' && activity.action === 'BUY'
                              ? 'bg-green-100 text-green-600'
                              : activity.type === 'TRANSACTION' && activity.action === 'SELL'
                                ? 'bg-red-100 text-red-600'
                                : 'bg-blue-100 text-blue-600'
                          }`}>
                            {activity.type === 'TRANSACTION' ? (
                              activity.action === 'BUY' ? '↑' : '↓'
                            ) : activity.type === 'PROFILE' ? (
                              'P'
                            ) : (
                              'W'
                            )}
                          </div>
                          <div className="ml-3 flex-grow">
                            <div className="flex justify-between">
                              <div className="font-medium">
                                {activity.type === 'TRANSACTION' ? (
                                  `${activity.action === 'BUY' ? 'Bought' : 'Sold'} ${activity.amount} ${activity.coinSymbol}`
                                ) : activity.type === 'PROFILE' ? (
                                  'Profile Update'
                                ) : (
                                  'Wallet Connection'
                                )}
                              </div>
                              <div className="text-sm text-gray-500">
                                {new Date(activity.timestamp).toLocaleString()}
                              </div>
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              {activity.details || (
                                activity.type === 'TRANSACTION' ? (
                                  `${activity.action === 'BUY' ? 'Purchased' : 'Sold'} ${activity.coinSymbol} tokens`
                                ) : ''
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}

export default UserProfile
