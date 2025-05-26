import React, { useState } from 'react';
import { Camera, Lock, Eye, EyeOff, Bell } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ProfileData {
  name: string;
  email: string;
  role: string;
  profilePicture: string;
  notifications: {
    email: {
      examResults: boolean;
      newStudents: boolean;
    };
    sms: {
      examResults: boolean;
      newStudents: boolean;
    };
  };
}

const defaultProfileData: ProfileData = {
  name: 'Admin User',
  email: 'admin@example.com',
  role: 'Administrator',
  profilePicture: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=150&h=150&fit=crop&crop=faces',
  notifications: {
    email: {
      examResults: true,
      newStudents: true,
    },
    sms: {
      examResults: false,
      newStudents: false,
    },
  },
};

const AdminProfile = () => {
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
  const [error, setError] = useState<string | null>(null);

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileData(editData);
    setActiveTab('view');
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setError(null);
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

  const handleNotificationChange = (type: 'email' | 'sms', setting: 'examResults' | 'newStudents') => {
    setEditData({
      ...editData,
      notifications: {
        ...editData.notifications,
        [type]: {
          ...editData.notifications[type],
          [setting]: !editData.notifications[type][setting]
        }
      }
    });
  };

  return (
    <div className="h-[calc(100vh-60px)] lg:h-[calc(100vh-120px)] overflow-y-auto">
      <div className="px-4 lg:px-8 py-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-8 text-foreground">Profile Settings</h1>

          <Card>
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

            <CardContent className="p-6">
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

                    <div className="pt-6 border-t border-border">
                      <div className="flex items-center gap-2 mb-6">
                        <Bell className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-medium text-card-foreground">Notification Settings</h3>
                      </div>

                      <div className="space-y-8">
                        <div className="bg-accent/50 rounded-lg p-4">
                          <h4 className="text-sm font-medium text-card-foreground mb-4">Email Notifications</h4>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-card-foreground">Exam Results</p>
                                <p className="text-sm text-muted-foreground">Get notified when exam results are published</p>
                              </div>
                              <Switch
                                checked={editData.notifications.email.examResults}
                                onCheckedChange={() => handleNotificationChange('email', 'examResults')}
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-card-foreground">New Students</p>
                                <p className="text-sm text-muted-foreground">Get notified when new students register</p>
                              </div>
                              <Switch
                                checked={editData.notifications.email.newStudents}
                                onCheckedChange={() => handleNotificationChange('email', 'newStudents')}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="bg-accent/50 rounded-lg p-4">
                          <h4 className="text-sm font-medium text-card-foreground mb-4">SMS Notifications</h4>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-card-foreground">Exam Results</p>
                                <p className="text-sm text-muted-foreground">Get SMS alerts when exam results are published</p>
                              </div>
                              <Switch
                                checked={editData.notifications.sms.examResults}
                                onCheckedChange={() => handleNotificationChange('sms', 'examResults')}
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-card-foreground">New Students</p>
                                <p className="text-sm text-muted-foreground">Get SMS alerts when new students register</p>
                              </div>
                              <Switch
                                checked={editData.notifications.sms.newStudents}
                                onCheckedChange={() => handleNotificationChange('sms', 'newStudents')}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Button type="submit" className="w-full">Save Changes</Button>
                  </form>

                  <div className="pt-6 border-t border-border">
                    <h3 className="text-lg font-medium text-card-foreground mb-4">Change Password</h3>
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                      {error && (
                        <Alert variant="destructive">
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      )}
                      
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

                      <Button type="submit" className="w-full">Update Password</Button>
                    </form>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;