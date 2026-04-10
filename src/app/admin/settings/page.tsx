"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Profile = {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
};

export default function SettingsPage() {
  const supabase = useMemo(() => createClient(), []);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 🔄 Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) {
        setProfile(data);
        setName(data.name || "");
        setPreview(data.avatar_url || null);
      }

      setLoading(false);
    };

    fetchProfile();
  }, [supabase]);

  // 📸 Handle image preview
  const handleAvatarChange = (file: File) => {
    setAvatar(file);
    setPreview(URL.createObjectURL(file));
  };

  // 💾 Save settings
  const handleSave = async () => {
    if (!profile) return;

    setSaving(true);

    let avatar_url = profile.avatar_url;

    // Upload avatar if changed
    if (avatar) {
      const fileExt = avatar.name.split(".").pop();
      const filePath = `${profile.id}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, avatar, { upsert: true });

      if (uploadError) {
        console.error(uploadError);
        alert("Image upload failed");
        setSaving(false);
        return;
      }

      const { data } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      avatar_url = data.publicUrl;
    }

    // Update profile
    const { error } = await supabase
      .from("profiles")
      .update({
        name,
        avatar_url,
      })
      .eq("id", profile.id);

    if (error) {
      console.error(error);
      alert("Failed to update profile");
    } else {
      alert("Profile updated successfully");
    }

    setSaving(false);
  };

  if (loading) {
    return <div className="p-6 text-gray-500">Loading settings...</div>;
  }

  return (
    <div className="p-6 max-w-4xl space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-gray-500">
          Manage your account and platform configuration
        </p>
      </div>

      {/* PROFILE CARD */}
      <div className="bg-white rounded-2xl shadow p-6 space-y-6">
        <h2 className="text-lg font-medium">Profile</h2>

        <div className="flex items-center gap-6">
          {/* Avatar */}
          <div>
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100">
              {preview ? (
                <img
                  src={preview}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              ) : null}
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                e.target.files && handleAvatarChange(e.target.files[0])
              }
              className="mt-2 text-sm"
            />
          </div>

          {/* Info */}
          <div className="flex-1 space-y-3">
            <div>
              <label className="text-sm text-gray-500">Email</label>
              <input
                value={profile?.email || ""}
                disabled
                className="w-full mt-1 px-3 py-2 border rounded-lg bg-gray-100 text-sm"
              />
            </div>

            <div>
              <label className="text-sm text-gray-500">Full Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-black text-white rounded-lg text-sm"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* ACCOUNT SECTION */}
      <div className="bg-white rounded-2xl shadow p-6 space-y-4">
        <h2 className="text-lg font-medium">Account</h2>

        <button
          onClick={async () => {
            const { error } = await supabase.auth.signOut();
            if (!error) window.location.href = "/login";
          }}
          className="px-4 py-2 border rounded-lg text-sm"
        >
          Sign Out
        </button>
      </div>

      {/* FUTURE EXPANSION */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-lg font-medium mb-2">
          Organization Settings
        </h2>
        <p className="text-sm text-gray-500">
          Coming next: branding, notifications, integrations, team roles.
        </p>
      </div>
    </div>
  );
}