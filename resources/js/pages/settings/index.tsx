import { Head, useForm, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
    User,
    Lock,
    Mail,
    Bell,
    Shield,
    Trash2,
    Camera,
    Save,
    Loader2,
} from 'lucide-react';
import { useState } from 'react';
import type { SharedData } from '@/types';

interface SettingsProps {
    user: {
        id: number;
        name: string;
        email: string;
        avatar: string | null;
        bio: string | null;
        location: string | null;
        website: string | null;
        twitter: string | null;
        github: string | null;
        created_at: string;
    };
    preferences: {
        email_notifications: boolean;
        email_comments: boolean;
        email_mentions: boolean;
        email_followers: boolean;
        email_newsletter: boolean;
        theme: string;
        language: string;
    };
    privacy: {
        profile_visible: boolean;
        show_email: boolean;
        show_activity: boolean;
    };
}

export default function Settings({ user, preferences, privacy }: SettingsProps) {
    const { auth } = usePage<SharedData>().props;
    const [activeTab, setActiveTab] = useState('profile');

    // Profile form
    const profileForm = useForm({
        name: user.name || '',
        bio: user.bio || '',
        location: user.location || '',
        website: user.website || '',
        twitter: user.twitter || '',
        github: user.github || '',
    });

    // Password form
    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    // Email preferences form
    const emailForm = useForm({
        email_notifications: preferences.email_notifications,
        email_comments: preferences.email_comments,
        email_mentions: preferences.email_mentions,
        email_followers: preferences.email_followers,
        email_newsletter: preferences.email_newsletter,
    });

    // Preferences form
    const preferencesForm = useForm({
        theme: preferences.theme,
        language: preferences.language,
    });

    // Privacy form
    const privacyForm = useForm({
        profile_visible: privacy.profile_visible,
        show_email: privacy.show_email,
        show_activity: privacy.show_activity,
    });

    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        profileForm.put('/settings/profile', {
            preserveScroll: true,
        });
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        passwordForm.put('/settings/password', {
            preserveScroll: true,
            onSuccess: () => {
                passwordForm.reset();
            },
        });
    };

    const handleEmailSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        emailForm.put('/settings/email-preferences', {
            preserveScroll: true,
        });
    };

    const handlePreferencesSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        preferencesForm.put('/settings/preferences', {
            preserveScroll: true,
        });
    };

    const handlePrivacySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        privacyForm.put('/settings/privacy', {
            preserveScroll: true,
        });
    };

    const handleDeleteAccount = () => {
        const password = prompt('Enter your password to confirm account deletion:');
        if (password) {
            router.delete('/settings/account', {
                data: { password },
            });
        }
    };

    return (
        <>
            <Head title="Settings" />

            <div className="min-h-screen bg-background">
                {/* Header */}
                <div className="border-b bg-card/50 backdrop-blur">
                    <div className="container mx-auto px-4 py-8">
                        <h1 className="text-3xl font-bold">Settings</h1>
                        <p className="text-muted-foreground mt-2">
                            Manage your account settings and preferences
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className="container mx-auto px-4 py-8">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                        <TabsList className="grid w-full grid-cols-5">
                            <TabsTrigger value="profile" className="gap-2">
                                <User className="w-4 h-4" />
                                <span className="hidden sm:inline">Profile</span>
                            </TabsTrigger>
                            <TabsTrigger value="password" className="gap-2">
                                <Lock className="w-4 h-4" />
                                <span className="hidden sm:inline">Password</span>
                            </TabsTrigger>
                            <TabsTrigger value="email" className="gap-2">
                                <Mail className="w-4 h-4" />
                                <span className="hidden sm:inline">Email</span>
                            </TabsTrigger>
                            <TabsTrigger value="preferences" className="gap-2">
                                <Bell className="w-4 h-4" />
                                <span className="hidden sm:inline">Preferences</span>
                            </TabsTrigger>
                            <TabsTrigger value="privacy" className="gap-2">
                                <Shield className="w-4 h-4" />
                                <span className="hidden sm:inline">Privacy</span>
                            </TabsTrigger>
                        </TabsList>

                        {/* Profile Tab */}
                        <TabsContent value="profile" className="space-y-6">
                            <Card className="p-6">
                                <h2 className="text-2xl font-bold mb-6">Profile Information</h2>

                                <form onSubmit={handleProfileSubmit} className="space-y-6">
                                    {/* Avatar */}
                                    <div>
                                        <Label>Profile Picture</Label>
                                        <div className="flex items-center gap-4 mt-2">
                                            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                                                {user.avatar ? (
                                                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <User className="w-10 h-10 text-muted-foreground" />
                                                )}
                                            </div>
                                            <div>
                                                <input
                                                    type="file"
                                                    id="avatar"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={(e) => {
                                                        if (e.target.files?.[0]) {
                                                            const formData = new FormData();
                                                            formData.append('avatar', e.target.files[0]);
                                                            router.post('/settings/avatar', formData);
                                                        }
                                                    }}
                                                />
                                                <Button type="button" variant="outline" size="sm" asChild>
                                                    <label htmlFor="avatar" className="cursor-pointer flex items-center gap-2">
                                                        <Camera className="w-4 h-4" />
                                                        Change Avatar
                                                    </label>
                                                </Button>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    JPG, PNG or GIF. Max 2MB.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <Separator />

                                    {/* Name */}
                                    <div>
                                        <Label htmlFor="name">Name *</Label>
                                        <Input
                                            id="name"
                                            value={profileForm.data.name}
                                            onChange={(e) => profileForm.setData('name', e.target.value)}
                                            placeholder="Your name"
                                            className="mt-2"
                                        />
                                        {profileForm.errors.name && (
                                            <p className="text-sm text-destructive mt-1">{profileForm.errors.name}</p>
                                        )}
                                    </div>

                                    {/* Bio */}
                                    <div>
                                        <Label htmlFor="bio">Bio</Label>
                                        <Textarea
                                            id="bio"
                                            value={profileForm.data.bio}
                                            onChange={(e) => profileForm.setData('bio', e.target.value)}
                                            placeholder="Tell us about yourself..."
                                            rows={4}
                                            className="mt-2"
                                        />
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {profileForm.data.bio?.length || 0}/500
                                        </p>
                                    </div>

                                    {/* Location */}
                                    <div>
                                        <Label htmlFor="location">Location</Label>
                                        <Input
                                            id="location"
                                            value={profileForm.data.location}
                                            onChange={(e) => profileForm.setData('location', e.target.value)}
                                            placeholder="City, Country"
                                            className="mt-2"
                                        />
                                    </div>

                                    {/* Website */}
                                    <div>
                                        <Label htmlFor="website">Website</Label>
                                        <Input
                                            id="website"
                                            type="url"
                                            value={profileForm.data.website}
                                            onChange={(e) => profileForm.setData('website', e.target.value)}
                                            placeholder="https://example.com"
                                            className="mt-2"
                                        />
                                    </div>

                                    {/* Social Links */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="twitter">Twitter</Label>
                                            <Input
                                                id="twitter"
                                                value={profileForm.data.twitter}
                                                onChange={(e) => profileForm.setData('twitter', e.target.value)}
                                                placeholder="@username"
                                                className="mt-2"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="github">GitHub</Label>
                                            <Input
                                                id="github"
                                                value={profileForm.data.github}
                                                onChange={(e) => profileForm.setData('github', e.target.value)}
                                                placeholder="username"
                                                className="mt-2"
                                            />
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="flex justify-end">
                                        <Button type="submit" disabled={profileForm.processing}>
                                            {profileForm.processing ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="w-4 h-4 mr-2" />
                                                    Save Changes
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </Card>
                        </TabsContent>

                        {/* Password Tab */}
                        <TabsContent value="password" className="space-y-6">
                            <Card className="p-6">
                                <h2 className="text-2xl font-bold mb-6">Change Password</h2>

                                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                                    <div>
                                        <Label htmlFor="current_password">Current Password *</Label>
                                        <Input
                                            id="current_password"
                                            type="password"
                                            value={passwordForm.data.current_password}
                                            onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                                            placeholder="Enter current password"
                                            className="mt-2"
                                        />
                                        {passwordForm.errors.current_password && (
                                            <p className="text-sm text-destructive mt-1">{passwordForm.errors.current_password}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="password">New Password *</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            value={passwordForm.data.password}
                                            onChange={(e) => passwordForm.setData('password', e.target.value)}
                                            placeholder="Enter new password"
                                            className="mt-2"
                                        />
                                        {passwordForm.errors.password && (
                                            <p className="text-sm text-destructive mt-1">{passwordForm.errors.password}</p>
                                        )}
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Must be at least 8 characters
                                        </p>
                                    </div>

                                    <div>
                                        <Label htmlFor="password_confirmation">Confirm New Password *</Label>
                                        <Input
                                            id="password_confirmation"
                                            type="password"
                                            value={passwordForm.data.password_confirmation}
                                            onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                                            placeholder="Confirm new password"
                                            className="mt-2"
                                        />
                                    </div>

                                    <div className="flex justify-end">
                                        <Button type="submit" disabled={passwordForm.processing}>
                                            {passwordForm.processing ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    Updating...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="w-4 h-4 mr-2" />
                                                    Update Password
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </Card>
                        </TabsContent>

                        {/* Email Preferences Tab */}
                        <TabsContent value="email" className="space-y-6">
                            <Card className="p-6">
                                <h2 className="text-2xl font-bold mb-6">Email Preferences</h2>

                                <form onSubmit={handleEmailSubmit} className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label>All Notifications</Label>
                                                <p className="text-sm text-muted-foreground">
                                                    Receive email notifications for all activities
                                                </p>
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={emailForm.data.email_notifications}
                                                onChange={(e) => emailForm.setData('email_notifications', e.target.checked)}
                                                className="w-4 h-4"
                                            />
                                        </div>

                                        <Separator />

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label>Comments</Label>
                                                <p className="text-sm text-muted-foreground">
                                                    Get notified when someone comments on your documents
                                                </p>
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={emailForm.data.email_comments}
                                                onChange={(e) => emailForm.setData('email_comments', e.target.checked)}
                                                className="w-4 h-4"
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label>Mentions</Label>
                                                <p className="text-sm text-muted-foreground">
                                                    Get notified when someone mentions you
                                                </p>
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={emailForm.data.email_mentions}
                                                onChange={(e) => emailForm.setData('email_mentions', e.target.checked)}
                                                className="w-4 h-4"
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label>New Followers</Label>
                                                <p className="text-sm text-muted-foreground">
                                                    Get notified when someone follows you
                                                </p>
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={emailForm.data.email_followers}
                                                onChange={(e) => emailForm.setData('email_followers', e.target.checked)}
                                                className="w-4 h-4"
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label>Newsletter</Label>
                                                <p className="text-sm text-muted-foreground">
                                                    Receive weekly newsletter with platform updates
                                                </p>
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={emailForm.data.email_newsletter}
                                                onChange={(e) => emailForm.setData('email_newsletter', e.target.checked)}
                                                className="w-4 h-4"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <Button type="submit" disabled={emailForm.processing}>
                                            {emailForm.processing ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="w-4 h-4 mr-2" />
                                                    Save Preferences
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </Card>
                        </TabsContent>

                        {/* Preferences Tab */}
                        <TabsContent value="preferences" className="space-y-6">
                            <Card className="p-6">
                                <h2 className="text-2xl font-bold mb-6">Preferences</h2>

                                <form onSubmit={handlePreferencesSubmit} className="space-y-6">
                                    <div>
                                        <Label htmlFor="theme">Theme</Label>
                                        <Select
                                            value={preferencesForm.data.theme}
                                            onValueChange={(value) => preferencesForm.setData('theme', value)}
                                        >
                                            <SelectTrigger className="mt-2">
                                                <SelectValue placeholder="Select theme" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="light">Light</SelectItem>
                                                <SelectItem value="dark">Dark</SelectItem>
                                                <SelectItem value="system">System</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Choose your preferred theme
                                        </p>
                                    </div>

                                    <div>
                                        <Label htmlFor="language">Language</Label>
                                        <Select
                                            value={preferencesForm.data.language}
                                            onValueChange={(value) => preferencesForm.setData('language', value)}
                                        >
                                            <SelectTrigger className="mt-2">
                                                <SelectValue placeholder="Select language" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="en">English</SelectItem>
                                                <SelectItem value="es">Español</SelectItem>
                                                <SelectItem value="fr">Français</SelectItem>
                                                <SelectItem value="de">Deutsch</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Choose your preferred language
                                        </p>
                                    </div>

                                    <div className="flex justify-end">
                                        <Button type="submit" disabled={preferencesForm.processing}>
                                            {preferencesForm.processing ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="w-4 h-4 mr-2" />
                                                    Save Preferences
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </Card>
                        </TabsContent>

                        {/* Privacy Tab */}
                        <TabsContent value="privacy" className="space-y-6">
                            <Card className="p-6">
                                <h2 className="text-2xl font-bold mb-6">Privacy Settings</h2>

                                <form onSubmit={handlePrivacySubmit} className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label>Public Profile</Label>
                                                <p className="text-sm text-muted-foreground">
                                                    Make your profile visible to everyone
                                                </p>
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={privacyForm.data.profile_visible}
                                                onChange={(e) => privacyForm.setData('profile_visible', e.target.checked)}
                                                className="w-4 h-4"
                                            />
                                        </div>

                                        <Separator />

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label>Show Email</Label>
                                                <p className="text-sm text-muted-foreground">
                                                    Display your email address on your profile
                                                </p>
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={privacyForm.data.show_email}
                                                onChange={(e) => privacyForm.setData('show_email', e.target.checked)}
                                                className="w-4 h-4"
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label>Show Activity</Label>
                                                <p className="text-sm text-muted-foreground">
                                                    Display your recent activity on your profile
                                                </p>
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={privacyForm.data.show_activity}
                                                onChange={(e) => privacyForm.setData('show_activity', e.target.checked)}
                                                className="w-4 h-4"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <Button type="submit" disabled={privacyForm.processing}>
                                            {privacyForm.processing ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="w-4 h-4 mr-2" />
                                                    Save Settings
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </Card>

                            {/* Danger Zone */}
                            <Card className="p-6 border-destructive">
                                <h3 className="text-lg font-semibold text-destructive mb-4">Danger Zone</h3>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label className="text-destructive">Delete Account</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Permanently delete your account and all data
                                        </p>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        onClick={handleDeleteAccount}
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete Account
                                    </Button>
                                </div>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </>
    );
}
