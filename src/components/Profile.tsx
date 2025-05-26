import React, { useState } from 'react';
import { Camera, Eye, EyeOff, Bell, Mail, MessageSquare, Calendar, Clock, AlertTriangle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

interface ProfileData {
  name: string;
  email: string;
  role: string;
  profilePicture: string;
  notifications: {
    email: {
      examResults: boolean;
      newSubmissions: boolean;
      systemUpdates: boolean;
    };
    sms: {
      examResults: boolean;
      newSubmissions: boolean;
      urgentAlerts: boolean;
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
      newSubmissions: true,
      systemUpdates: false
    },
    sms: {
      examResults: false,
      newSubmissions: true,
      urgentAlerts: true
    }
  }
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

  const handleNotificationChange = (
    type: 'email' | 'sms',
    setting: keyof ProfileData['notifications']['email'] | keyof ProfileData['notifications']['sms'],
    value: boolean
  ) => {
    setEditData({
      ...editData,
      notifications: {
        ...editData.notifications,
        [type]: {
          ...editData.notifications[type],
          [setting]: value
        }
      }
    });
  };

  return (
    <div className="h-[calc(100vh-60px)] overflow-y-auto px-4 py-8">
      <div className="container max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'view' | 'edit')} className="w-full">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="view" className="flex-1">View Profile</TabsTrigger>
            <TabsTrigger value="edit" className="flex-1">Edit Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="view">
            <Card className="p-6">
              <div className="flex items-center gap-6">
                <img
                  src={profileData.profilePicture}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover"
                />
                <div>
                  <h2 className="text-xl font-semibold">{profileData.name}</h2>
                  <p className="text-muted-foreground">{profileData.email}</p>
                  <span className="inline-block mt-2 text-sm text-primary">{profileData.role}</span>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="edit">
            <Card className="p-6">
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="flex items-center gap-6 mb-8">
                  <div className="relative group">
                    <img
                      src={editData.profilePicture}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover group-hover:opacity-75 transition-opacity"
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
                  <div className="space-y-4 flex-1">
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
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      Notification Settings
                    </h3>
                    
                    <div className="space-y-6">
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <Mail className="h-5 w-5 text-primary" />
                          <h4 className="font-medium">Email Notifications</h4>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Exam Results</p>
                              <p className="text-sm text-muted-foreground">Get notified when exam results are published</p>
                            </div>
                            <Switch
                              checked={editData.notifications.email.examResults}
                              onCheckedChange={(checked) => handleNotificationChange('email', 'examResults', checked)}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">New Submissions</p>
                              <p className="text-sm text-muted-foreground">Get notified when students submit their exams</p>
                            </div>
                            <Switch
                              checked={editData.notifications.email.newSubmissions}
                              onCheckedChange={(checked) => handleNotificationChange('email', 'newSubmissions', checked)}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">System Updates</p>
                              <p className="text-sm text-muted-foreground">Receive updates about system maintenance and new features</p>
                            </div>
                            <Switch
                              checked={editData.notifications.email.systemUpdates}
                              onCheckedChange={(checked) => handleNotificationChange('email', 'systemUpdates', checked)}
                            />
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <MessageSquare className="h-5 w-5 text-primary" />
                          <h4 className="font-medium">SMS Notifications</h4>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Exam Results</p>
                              <p className="text-sm text-muted-foreground">Get SMS alerts when exam results are published</p>
                            </div>
                            <Switch
                              checked={editData.notifications.sms.examResults}
                              onCheckedChange={(checked) => handleNotificationChange('sms', 'examResults', checked)}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">New Submissions</p>
                              <p className="text-sm text-muted-foreground">Get SMS alerts for new exam submissions</p>
                            </div>
                            <Switch
                              checked={editData.notifications.sms.newSubmissions}
                              onCheckedChange={(checked) => handleNotificationChange('sms', 'newSubmissions', checked)}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Urgent Alerts</p>
                              <p className="text-sm text-muted-foreground">Receive SMS for critical system notifications</p>
                            </div>
                            <Switch
                              checked={editData.notifications.sms.urgentAlerts}
                              onCheckedChange={(checked) => handleNotificationChange('sms', 'urgentAlerts', checked)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button type="submit" className="w-full">Save Changes</Button>
                </div>
              </form>

              <div className="mt-8 pt-6 border-t">
                <h3 className="text-lg font-medium mb-4">Change Password</h3>
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
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;