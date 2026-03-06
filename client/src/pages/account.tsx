import { useState, useRef } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { useUpload } from "@/hooks/use-upload";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { CityPicker } from "@/components/city-picker";
import { UserAvatar } from "@/components/user-avatar";
import AppLayout from "@/components/app-layout";
import {
  Loader2,
  Camera,
  User,
  Bell,
  Lock,
  Calendar,
  Mail,
  MapPin,
  Save,
  Eye,
  EyeOff,
  Trophy,
  Star,
  Globe,
  Users,
  HandshakeIcon,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react";
import { SiInstagram, SiTiktok, SiYoutube } from "react-icons/si";

const USER_TYPE_LABELS: Record<string, string> = {
  individual: "Individual",
  professional: "Professional",
  influencer: "Influencer / Creator",
};

export default function AccountPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(user?.name || "");
  const [city, setCity] = useState(user?.city || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [userType, setUserType] = useState(user?.userType || "individual");

  const [primaryPlatform, setPrimaryPlatform] = useState(user?.primaryPlatform || "");
  const [platformHandle, setPlatformHandle] = useState(user?.platformHandle || "");
  const [followers, setFollowers] = useState(user?.followers?.toString() || "");
  const [contentNiche, setContentNiche] = useState(user?.contentNiche || "");

  const [instagramUrl, setInstagramUrl] = useState(user?.instagramUrl || "");
  const [tiktokUrl, setTiktokUrl] = useState(user?.tiktokUrl || "");
  const [youtubeUrl, setYoutubeUrl] = useState(user?.youtubeUrl || "");
  const [websiteUrl, setWebsiteUrl] = useState(user?.websiteUrl || "");

  const [notifyMatches, setNotifyMatches] = useState(user?.notifyMatches ?? true);
  const [notifyInterests, setNotifyInterests] = useState(user?.notifyInterests ?? true);
  const [notifyMessages, setNotifyMessages] = useState(user?.notifyMessages ?? true);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const { data: favorBalances } = useQuery<Array<{ userId: number; userName: string; balance: number }>>({
    queryKey: ["/api/favors"],
  });

  const { uploadFile, isUploading } = useUpload({
    onSuccess: async (response) => {
      await apiRequest("POST", "/api/users/me/avatar", {
        avatarUrl: response.objectPath,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      toast({ title: "Avatar updated" });
    },
    onError: () => {
      toast({ title: "Upload failed", description: "Could not upload avatar", variant: "destructive" });
    },
  });

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadFile(file);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const profileMutation = useMutation({
    mutationFn: async () => {
      const data: Record<string, any> = {
        name,
        city,
        bio: bio || null,
        userType,
      };
      if (userType === "influencer") {
        data.primaryPlatform = primaryPlatform || null;
        data.platformHandle = platformHandle || null;
        data.followers = followers ? parseInt(followers) : null;
        data.contentNiche = contentNiche || null;
      }
      data.instagramUrl = instagramUrl || null;
      data.tiktokUrl = tiktokUrl || null;
      data.youtubeUrl = youtubeUrl || null;
      data.websiteUrl = websiteUrl || null;
      const res = await apiRequest("PATCH", "/api/users/me", data);
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/auth/me"], data);
      toast({ title: "Profile updated" });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const notificationMutation = useMutation({
    mutationFn: async (data: { notifyMatches: boolean; notifyInterests: boolean; notifyMessages: boolean }) => {
      const res = await apiRequest("PATCH", "/api/users/me", data);
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/auth/me"], data);
      toast({ title: "Notification preferences saved" });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const passwordMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/users/me/password", {
        currentPassword,
        newPassword,
      });
      return res.json();
    },
    onSuccess: () => {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast({ title: "Password changed successfully" });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !city.trim()) {
      toast({ title: "Error", description: "Name and city are required", variant: "destructive" });
      return;
    }
    profileMutation.mutate();
  };

  const handleNotificationSave = () => {
    notificationMutation.mutate({ notifyMatches, notifyInterests, notifyMessages });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast({ title: "Error", description: "Please fill in all password fields", variant: "destructive" });
      return;
    }
    if (newPassword.length < 8) {
      toast({ title: "Error", description: "New password must be at least 8 characters", variant: "destructive" });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: "Error", description: "New passwords don't match", variant: "destructive" });
      return;
    }
    passwordMutation.mutate();
  };

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : "";

  const nonZeroFavors = (favorBalances || []).filter((f) => f.balance !== 0);

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-account-title">Account Settings</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your profile, preferences, and security</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="w-5 h-5 text-accent" />
              Profile
            </CardTitle>
            <CardDescription>Your public profile information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-5 mb-6">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                className="hidden"
                onChange={handleFileChange}
                data-testid="input-account-avatar-upload"
              />
              <button
                onClick={handleAvatarClick}
                className="relative group cursor-pointer shrink-0"
                disabled={isUploading}
                data-testid="button-account-avatar"
              >
                <UserAvatar
                  name={user?.name || "?"}
                  avatarUrl={user?.avatarUrl}
                  className="h-20 w-20 text-xl"
                />
                <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  {isUploading ? (
                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                  ) : (
                    <Camera className="w-5 h-5 text-white" />
                  )}
                </div>
              </button>
              <div>
                <p className="font-medium" data-testid="text-account-name">{user?.name}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" />
                  {user?.email}
                </p>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3.5 h-3.5" />
                  Member since {memberSince}
                </p>
                <div className="flex items-center gap-3 mt-1.5">
                  <Badge variant="secondary" className="text-xs" data-testid="badge-user-type">
                    <Users className="w-3 h-3 mr-1" />
                    {USER_TYPE_LABELS[user?.userType || "individual"]}
                  </Badge>
                  <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400" data-testid="badge-completed-barters">
                    <Trophy className="w-3 h-3 mr-1" />
                    {user?.completedBarters || 0} completed
                  </Badge>
                </div>
              </div>
            </div>

            <Separator className="mb-6" />

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Display Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                  data-testid="input-account-name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    City
                  </span>
                </Label>
                <CityPicker
                  id="city"
                  value={city}
                  onChange={setCity}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell others about yourself and your skills..."
                  rows={3}
                  maxLength={500}
                  data-testid="input-account-bio"
                />
                <p className="text-xs text-muted-foreground text-right">{bio.length}/500</p>
              </div>

              <div className="space-y-2">
                <Label>User Type</Label>
                <Select value={userType} onValueChange={setUserType}>
                  <SelectTrigger data-testid="select-user-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Individual</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="influencer">Influencer / Creator</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {userType === "influencer" && (
                <>
                  <div className="space-y-4 p-4 rounded-lg border bg-muted/30">
                    <p className="text-sm font-medium flex items-center gap-2">
                      <Star className="w-4 h-4 text-accent" />
                      Influencer Details
                    </p>

                    <div className="space-y-2">
                      <Label htmlFor="primaryPlatform">Primary Platform</Label>
                      <Select value={primaryPlatform} onValueChange={setPrimaryPlatform}>
                        <SelectTrigger data-testid="select-primary-platform">
                          <SelectValue placeholder="Select platform" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="instagram">Instagram</SelectItem>
                          <SelectItem value="tiktok">TikTok</SelectItem>
                          <SelectItem value="youtube">YouTube</SelectItem>
                          <SelectItem value="blog">Blog</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="platformHandle">Platform Handle</Label>
                      <Input
                        id="platformHandle"
                        value={platformHandle}
                        onChange={(e) => setPlatformHandle(e.target.value)}
                        placeholder="@yourhandle"
                        data-testid="input-platform-handle"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="followers">Followers</Label>
                      <Input
                        id="followers"
                        type="number"
                        value={followers}
                        onChange={(e) => setFollowers(e.target.value)}
                        placeholder="e.g., 24000"
                        min="0"
                        data-testid="input-followers"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contentNiche">Content Niche</Label>
                      <Input
                        id="contentNiche"
                        value={contentNiche}
                        onChange={(e) => setContentNiche(e.target.value)}
                        placeholder="e.g., Food, Fitness, Tech"
                        data-testid="input-content-niche"
                      />
                    </div>
                  </div>

                  <div className="space-y-4 p-4 rounded-lg border bg-muted/30">
                    <p className="text-sm font-medium flex items-center gap-2">
                      <Globe className="w-4 h-4 text-accent" />
                      Social Links
                    </p>

                    <div className="space-y-2">
                      <Label htmlFor="instagramUrl" className="flex items-center gap-1.5">
                        <SiInstagram className="w-3.5 h-3.5" />
                        Instagram
                      </Label>
                      <Input
                        id="instagramUrl"
                        value={instagramUrl}
                        onChange={(e) => setInstagramUrl(e.target.value)}
                        placeholder="https://instagram.com/yourhandle"
                        data-testid="input-instagram-url"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tiktokUrl" className="flex items-center gap-1.5">
                        <SiTiktok className="w-3.5 h-3.5" />
                        TikTok
                      </Label>
                      <Input
                        id="tiktokUrl"
                        value={tiktokUrl}
                        onChange={(e) => setTiktokUrl(e.target.value)}
                        placeholder="https://tiktok.com/@yourhandle"
                        data-testid="input-tiktok-url"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="youtubeUrl" className="flex items-center gap-1.5">
                        <SiYoutube className="w-3.5 h-3.5" />
                        YouTube
                      </Label>
                      <Input
                        id="youtubeUrl"
                        value={youtubeUrl}
                        onChange={(e) => setYoutubeUrl(e.target.value)}
                        placeholder="https://youtube.com/@yourchannel"
                        data-testid="input-youtube-url"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="websiteUrl" className="flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5" />
                        Website
                      </Label>
                      <Input
                        id="websiteUrl"
                        value={websiteUrl}
                        onChange={(e) => setWebsiteUrl(e.target.value)}
                        placeholder="https://yourwebsite.com"
                        data-testid="input-website-url"
                      />
                    </div>
                  </div>
                </>
              )}

              <Button type="submit" disabled={profileMutation.isPending} data-testid="button-save-profile">
                {profileMutation.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save Profile
              </Button>
            </form>
          </CardContent>
        </Card>

        {nonZeroFavors.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <HandshakeIcon className="w-5 h-5 text-accent" />
                Favor Ledger
              </CardTitle>
              <CardDescription>Track favor balances with people you've bartered with</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {nonZeroFavors.map((favor) => (
                <div
                  key={favor.userId}
                  className="flex items-center justify-between p-3 rounded-md bg-muted/50"
                  data-testid={`favor-balance-${favor.userId}`}
                >
                  <span className="text-sm font-medium">{favor.userName}</span>
                  <div className="flex items-center gap-1.5">
                    {favor.balance > 0 ? (
                      <>
                        <ArrowUpRight className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <span className="text-sm font-medium text-green-700 dark:text-green-400">
                          +{favor.balance} (they owe you)
                        </span>
                      </>
                    ) : favor.balance < 0 ? (
                      <>
                        <ArrowDownRight className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                        <span className="text-sm font-medium text-orange-700 dark:text-orange-400">
                          {favor.balance} (you owe them)
                        </span>
                      </>
                    ) : (
                      <>
                        <Minus className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Balanced</span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bell className="w-5 h-5 text-accent" />
              Notifications
            </CardTitle>
            <CardDescription>Choose what you want to be notified about</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">New Matches</p>
                <p className="text-xs text-muted-foreground">When someone matches your barter request</p>
              </div>
              <Switch
                checked={notifyMatches}
                onCheckedChange={setNotifyMatches}
                data-testid="switch-notify-matches"
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Interest Updates</p>
                <p className="text-xs text-muted-foreground">When someone sends or responds to an interest</p>
              </div>
              <Switch
                checked={notifyInterests}
                onCheckedChange={setNotifyInterests}
                data-testid="switch-notify-interests"
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Messages</p>
                <p className="text-xs text-muted-foreground">When you receive a new message</p>
              </div>
              <Switch
                checked={notifyMessages}
                onCheckedChange={setNotifyMessages}
                data-testid="switch-notify-messages"
              />
            </div>

            <Button
              onClick={handleNotificationSave}
              disabled={notificationMutation.isPending}
              data-testid="button-save-notifications"
            >
              {notificationMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Preferences
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Lock className="w-5 h-5 text-accent" />
              Change Password
            </CardTitle>
            <CardDescription>Update your password to keep your account secure</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    required
                    data-testid="input-current-password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    data-testid="button-toggle-current-password"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min. 8 characters)"
                    required
                    data-testid="input-new-password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    data-testid="button-toggle-new-password"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                  data-testid="input-confirm-password"
                />
              </div>

              <Button type="submit" disabled={passwordMutation.isPending} data-testid="button-change-password">
                {passwordMutation.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Lock className="w-4 h-4 mr-2" />
                )}
                Change Password
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
