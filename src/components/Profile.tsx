import React, { useState } from 'react';
import { Camera, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface ProfileData {
  name: string;
  email: string;
  role: string;
  profilePicture: string;
}

const defaultProfileData: ProfileData = {
  name: 'Admin User',
  email: 'admin@example.com',
  role: 'Administrator',
  profilePicture: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=150&h=150&fit=crop&crop=faces',
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

  return (
    <div className="h-[calc(100vh-60px)] overflow-y-auto px-4 lg:px-0 pt-[88px]">
      <div className="max-w-4xl mx-auto py-6">
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
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={editData.name}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={editData.email}
                        onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full">Save Changes</Button>
                </form>

                <div className="pt-6 border-t border-border">
                  <h3 className="text-lg font-medium text-card-foreground mb-4">Change Password</h3>
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3"
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
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3"
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
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <Button type="submit" className="w-full">Update Password</Button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;