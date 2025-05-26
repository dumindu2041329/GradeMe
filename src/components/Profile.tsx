import React, { useState } from 'react';
import { Camera, Lock, Eye, EyeOff, Bell, BookOpen } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface ProfileData {
  name: string;
  email: string;
  role: string;
  profilePicture: string;
  notifications: {
    email: boolean;
    sms: boolean;
  };
}

const defaultProfileData: ProfileData = {
  name: 'Admin User',
  email: 'admin@example.com',
  role: 'Administrator',
  profilePicture: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=150&h=150&fit=crop&crop=faces',
  notifications: {
    email: true,
    sms: false,
  },
};

const Profile = () => {
  const [activeTab, setActiveTab] = useState<'view' | 'edit'>('view');
  const [profileData, setProfileData] = useState<ProfileData>(defaultProfileData);
  const [editData, setEditData] = useState(profileData);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileData(editData);
    setActiveTab('view');
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return;
    }
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setEditData({ ...editData, profilePicture: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNotificationChange = (type: 'email' | 'sms') => {
    setEditData({
      ...editData,
      notifications: {
        ...editData.notifications,
        [type]: !editData.notifications[type]
      }
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-primary">GradeMe</span>
        </div>
        <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
          AU
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 px-4 pb-6">
        <h1 className="text-2xl font-bold mb-6 text-foreground">Profile Settings</h1>

        <div className="max-w-3xl mx-auto">
          {/* Tabs */}
          <div className="flex border-b border-border mb-6">
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

          {/* Profile Content */}
          <div className="space-y-6">
            {activeTab === 'view' ? (
              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <img
                    src={profileData.profilePicture}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">{profileData.name}</h2>
                    <p className="text-muted-foreground">{profileData.email}</p>
                    <span className="inline-block mt-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                      {profileData.role}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                {/* Profile Image */}
                <div className="relative group w-24 h-24">
                  <img
                    src={editData.profilePicture}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                  <label className="absolute inset-0 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded-full">
                    <Camera className="h-8 w-8 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>

                {/* Profile Fields */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={editData.email}
                      onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* Notification Settings */}
                <div className="pt-6 border-t border-border">
                  <div className="flex items-center gap-2 mb-6">
                    <Bell className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-medium text-foreground">Notification Settings</h3>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive exam submission notifications via email</p>
                      </div>
                      <Switch
                        checked={editData.notifications.email}
                        onCheckedChange={() => handleNotificationChange('email')}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">SMS Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive exam submission notifications via SMS</p>
                      </div>
                      <Switch
                        checked={editData.notifications.sms}
                        onCheckedChange={() => handleNotificationChange('sms')}
                      />
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <Button type="submit" className="w-full bg-primary text-primary-foreground">
                  Save Changes
                </Button>

                {/* Password Change Section */}
                <div className="pt-6 border-t border-border">
                  <h3 className="text-lg font-medium text-foreground mb-4">Change Password</h3>
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                          className="mt-1"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                          {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="newPassword">New Password</Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showNewPassword ? 'text' : 'password'}
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                          className="mt-1"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                          className="mt-1"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <Button type="submit" className="w-full">
                      Update Password
                    </Button>
                  </form>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;