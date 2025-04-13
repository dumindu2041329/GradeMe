import React, { useState } from 'react';
import { User, Camera, Lock, Eye, EyeOff } from 'lucide-react';

interface ProfileData {
  name: string;
  email: string;
  role: string;
  profilePicture: string;
}

const Profile = () => {
  const [activeTab, setActiveTab] = useState<'view' | 'edit'>('view');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'Administrator',
    profilePicture: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=150&h=150&fit=crop&crop=faces'
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<ProfileData>(profileData);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    // Here you would typically make an API call to update the password
    alert('Password updated successfully');
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileData(editData);
    setIsEditing(false);
    // Here you would typically make an API call to update the profile
    alert('Profile updated successfully');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Here you would typically upload the image to a server
      // For now, we'll just create a local URL
      const url = URL.createObjectURL(file);
      setEditData({ ...editData, profilePicture: url });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-8 text-foreground">Profile Settings</h1>

      <div className="bg-card rounded-lg shadow-lg border border-border overflow-hidden">
        <div className="flex border-b border-border">
          <button
            className={`flex-1 px-6 py-3 text-sm font-medium ${
              activeTab === 'view'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent'
            }`}
            onClick={() => setActiveTab('view')}
          >
            View Profile
          </button>
          <button
            className={`flex-1 px-6 py-3 text-sm font-medium ${
              activeTab === 'edit'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent'
            }`}
            onClick={() => setActiveTab('edit')}
          >
            Edit Profile
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'view' ? (
            <div className="space-y-6">
              <div className="flex items-center gap-6">
                <img
                  src={profileData.profilePicture}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-primary/20"
                />
                <div>
                  <h2 className="text-xl font-semibold text-card-foreground">{profileData.name}</h2>
                  <p className="text-muted-foreground">{profileData.email}</p>
                  <span className="inline-block mt-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                    {profileData.role}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="relative group w-24 h-24">
                  <img
                    src={editData.profilePicture}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover border-4 border-primary/20 group-hover:opacity-75 transition-opacity"
                  />
                  <label className="absolute inset-0 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="h-8 w-8 text-white drop-shadow-lg" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-card-foreground mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      className="w-full px-4 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-card-foreground mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                      className="w-full px-4 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>

              <div className="pt-6 border-t border-border">
                <h3 className="text-lg font-medium text-card-foreground mb-4">Change Password</h3>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-card-foreground mb-1">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          setPasswordData({ ...passwordData, currentPassword: e.target.value })
                        }
                        className="w-full px-4 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-card-foreground"
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-card-foreground mb-1">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData({ ...passwordData, newPassword: e.target.value })
                        }
                        className="w-full px-4 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-card-foreground"
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-card-foreground mb-1">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                        }
                        className="w-full px-4 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-card-foreground"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                  >
                    <Lock className="h-4 w-4" />
                    Update Password
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;