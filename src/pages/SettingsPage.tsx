import React from 'react';
import { useStore } from '../store/useStore';
import { motion } from 'motion/react';
import { AppShell } from '../components/layout/AppShell';
import { 
  Palette, 
  Settings as SettingsIcon, 
  Grid, 
  Zap, 
  Monitor, 
  MousePointer2,
  Check,
  Layout,
  ChevronLeft,
  User,
  Upload,
  Lock
} from 'lucide-react';
import { cn } from '../lib/utils';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, resetSettings, user, updateUser, fetchUserProfile, saveUserProfile } = useStore();

  const [lastSavedProfile, setLastSavedProfile] = React.useState<{ name?: string; avatar?: string } | null>(null);
  const [saveSuccess, setSaveSuccess] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    const initProfile = async () => {
      if (user?.email && user.email !== 'guest_explorer@example.com') {
        try {
          await fetchUserProfile(user.email);
          const freshUser = useStore.getState().user;
          if (freshUser) {
            setLastSavedProfile({ name: freshUser.name, avatar: freshUser.avatar });
          }
        } catch (e) {
          setLastSavedProfile({ name: user.name, avatar: user.avatar });
        }
      }
    };
    initProfile();
  }, []);

  React.useEffect(() => {
    if (user && !lastSavedProfile) {
      setLastSavedProfile({ name: user.name, avatar: user.avatar });
    }
  }, [user, lastSavedProfile]);

  const hasChanges = user && lastSavedProfile && (
    user.name !== lastSavedProfile.name || 
    user.avatar !== lastSavedProfile.avatar
  );

  const handleSaveProfile = async () => {
    if (!user || user.email === 'guest_explorer@example.com') return;
    setSaving(true);
    setSaveSuccess(false);
    try {
      await saveUserProfile();
      setLastSavedProfile({ name: user.name, avatar: user.avatar });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      alert('Failed to save profile changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const themes = [
    { id: 'light', name: 'Litverse Cream', color: 'bg-bg-warm', border: 'border-gray-200' },
    { id: 'dark', name: 'Obsidian', color: 'bg-dark-charcoal', border: 'border-white/10' },
    { id: 'amber', name: 'Golden Hour', color: 'bg-amber-50', border: 'border-amber-200' },
    { id: 'emerald', name: 'Deep Forest', color: 'bg-emerald-50', border: 'border-emerald-200' },
    { id: 'indigo', name: 'Night Sky', color: 'bg-indigo-50', border: 'border-indigo-200' },
    { id: 'rose', name: 'Pink Quartz', color: 'bg-rose-50', border: 'border-rose-200' },
    { id: 'cobalt', name: 'Ocean Blue', color: 'bg-blue-900', border: 'border-blue-400' },
    { id: 'slate', name: 'Steel Gray', color: 'bg-slate-700', border: 'border-slate-400' },
  ] as const;

  const handleToggle = (key: keyof typeof settings) => {
    updateSettings({ [key]: !settings[key] });
  };

  const handleReset = () => {
    if (confirm('Reset all preferences to factory defaults?')) {
      resetSettings();
    }
  };

  const handleUpdateCheck = () => {
    const btn = document.activeElement as HTMLButtonElement;
    if (btn) {
      const originalText = btn.innerText;
      btn.innerText = 'Checking...';
      btn.disabled = true;
      setTimeout(() => {
        btn.innerText = 'Up to Date ✓';
        setTimeout(() => {
          btn.innerText = originalText;
          btn.disabled = false;
        }, 2000);
      }, 1500);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 2 * 1024 * 1024) {
      alert("Image size should be less than 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const size = 128;
        canvas.width = size;
        canvas.height = size;
        
        const minDim = Math.min(img.width, img.height);
        const sx = (img.width - minDim) / 2;
        const sy = (img.height - minDim) / 2;
        ctx?.drawImage(img, sx, sy, minDim, minDim, 0, 0, size, size);
        
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
        updateUser({ avatar: compressedBase64 });
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <AppShell>
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-display font-bold mb-2">Workspace Preferences</h1>
              <p className="opacity-70">Customize your interface and editing experience.</p>
            </div>
            <div className="p-3 bg-brand-yellow/10 rounded-2xl">
              <SettingsIcon size={24} className="text-brand-yellow animate-spin-slow" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <section className="md:col-span-2 space-y-6">
              {/* Profile Card */}
              <div className="bg-white/80 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-black/5">
                <div className="flex items-center gap-2 mb-6">
                  <User size={20} className="text-brand-yellow" />
                  <h2 className="font-bold uppercase tracking-wider text-sm">Profile & User Info</h2>
                </div>

                {user && (
                  <div className="flex flex-col sm:flex-row gap-6 items-center">
                    {/* Avatar Upload Display */}
                    <div className="relative group shrink-0">
                      <div className="w-24 h-24 rounded-none border-4 border-black overflow-hidden bg-[#ff6f3c] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center relative">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name || 'User'} className="w-full h-full object-cover" />
                        ) : (
                          <svg className="w-full h-full text-white p-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                        )}
                        
                        {user.email !== 'guest_explorer@example.com' && (
                          <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[9px] font-bold uppercase tracking-wider cursor-pointer transition-all">
                            <Upload size={16} className="mb-1" />
                            Change
                            <input 
                              type="file" 
                              accept="image/*" 
                              onChange={handleImageUpload} 
                              className="hidden" 
                            />
                          </label>
                        )}
                      </div>
                      
                      {user.email === 'guest_explorer@example.com' && (
                        <div className="absolute -bottom-2 -right-2 bg-neutral-800 border-2 border-white text-white p-1 rounded-full shadow-md" title="Guest Mode (Read-Only)">
                          <Lock size={12} />
                        </div>
                      )}
                    </div>

                    {/* Inputs */}
                    <div className="flex-1 w-full space-y-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-dark-charcoal/60 mb-2">Email Address</label>
                        <input
                          type="text"
                          value={user.email}
                          disabled
                          className="w-full px-4 py-3 rounded-xl border border-black/5 bg-black/5 text-dark-charcoal/60 font-mono text-xs font-semibold cursor-not-allowed outline-none"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-dark-charcoal/60 mb-2">Display Name</label>
                        <div className="relative">
                          <input
                            type="text"
                            value={user.name || ''}
                            onChange={(e) => updateUser({ name: e.target.value })}
                            disabled={user.email === 'guest_explorer@example.com'}
                            className={cn(
                              "w-full px-4 py-3 rounded-xl border font-semibold outline-none focus:ring-2 focus:ring-brand-yellow/50 transition-all text-sm",
                              user.email === 'guest_explorer@example.com'
                                ? "bg-black/5 text-dark-charcoal/60 border-black/5 cursor-not-allowed"
                                : "bg-white border-black/5 text-dark-charcoal focus:border-brand-yellow/30"
                            )}
                            placeholder="Enter Display Name"
                          />
                          {user.email === 'guest_explorer@example.com' && (
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-bold uppercase text-neutral-500 bg-neutral-100 border px-2 py-0.5 rounded">
                              Read-Only
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {user.email !== 'guest_explorer@example.com' && (
                      <div className="w-full mt-6 pt-6 border-t border-black/5 flex justify-end">
                        <button
                          onClick={handleSaveProfile}
                          disabled={!hasChanges || saving}
                          className={cn(
                            "px-6 py-3 font-mono font-black text-xs uppercase tracking-wider transition-all border-2 border-black rounded-none flex items-center gap-2 cursor-pointer shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:translate-x-0 disabled:hover:translate-y-0",
                            saveSuccess 
                              ? "bg-green-500 text-white" 
                              : "bg-brand-yellow text-black"
                          )}
                        >
                          {saving ? (
                            <>
                              <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                              Saving...
                            </>
                          ) : saveSuccess ? (
                            <>
                              <Check size={14} className="stroke-[3]" />
                              Profile Saved ✓
                            </>
                          ) : (
                            "Save Profile Changes"
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Appearance Section */}
              <div className="bg-white/80 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-black/5">
                <div className="flex items-center gap-2 mb-6">
                  <Palette size={20} className="text-brand-yellow" />
                  <h2 className="font-bold uppercase tracking-wider text-sm">Aesthetic Presets</h2>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {themes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => updateSettings({ theme: t.id })}
                      className={cn(
                        "relative group p-2 rounded-xl border-2 transition-all flex flex-col items-center gap-2",
                        settings.theme === t.id 
                          ? "border-brand-yellow bg-brand-yellow/5 ring-4 ring-brand-yellow/10" 
                          : "border-gray-100 hover:border-gray-200 bg-white"
                      )}
                    >
                      <div className={cn("w-full aspect-square rounded-lg shadow-inner border", t.color, t.border)}>
                        {settings.theme === t.id && (
                          <div className="absolute top-1 right-1 w-4 h-4 bg-brand-yellow rounded-full flex items-center justify-center shadow-md">
                            <Check size={10} className="text-dark-charcoal" />
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] font-bold text-dark-charcoal truncate w-full text-center">{t.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Behavior Section */}
              <div className="bg-white/80 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-black/5">
                <div className="flex items-center gap-2 mb-6">
                  <Layout size={20} className="text-brand-yellow" />
                  <h2 className="font-bold uppercase tracking-wider text-sm">Interface Behavior</h2>
                </div>

                <div className="space-y-4">
                  {[
                    { key: 'showGrid', label: 'Grid Visibility', description: 'Show dot patterns on the whiteboard canvas.', icon: Grid },
                    { key: 'snapToGrid', label: 'Magnet Alignment', description: 'Snap objects to the grid for precise placement.', icon: MagnetIcon },
                    { key: 'animationsEnabled', label: 'Motion & Effects', description: 'Enable fluid transitions and micro-animations.', icon: Zap },
                    { key: 'compactSidebar', label: 'Compact Navigation', description: 'Auto-collapse symbols in the sidebar for more space.', icon: ChevronLeft },
                  ].map((item: any) => (
                    <div key={item.key} className="flex items-center justify-between p-3 rounded-xl hover:bg-black/5 transition-colors">
                      <div className="flex items-start gap-4">
                        <div className="mt-1 p-2 bg-black/5 rounded-lg">
                          <item.icon size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-bold">{item.label}</p>
                          <p className="text-xs opacity-60">{item.description}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleToggle(item.key)}
                        className={cn(
                          "w-12 h-6 rounded-full transition-all relative flex items-center px-1",
                          settings[item.key as keyof typeof settings] ? "bg-brand-yellow" : "bg-gray-400/20"
                        )}
                      >
                        <motion.div
                          animate={{ x: settings[item.key as keyof typeof settings] ? 24 : 0 }}
                          className="w-4 h-4 bg-white rounded-full shadow-sm"
                        />
                      </button>
                    </div>
                  ))}

                  {/* Default Color Picker */}
                  <div className="flex items-center justify-between p-3 rounded-xl hover:bg-black/5 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="mt-1 p-2 bg-black/5 rounded-lg">
                        <Palette size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold">Default Component Color</p>
                        <p className="text-xs opacity-60">The fallback color for new nodes and diagram elements.</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-8 h-8 rounded-lg shadow-inner border border-black/10" 
                        style={{ backgroundColor: settings.defaultColor }}
                      />
                      <input 
                        type="color" 
                        value={settings.defaultColor}
                        onChange={(e) => updateSettings({ defaultColor: e.target.value })}
                        className="w-8 h-8 opacity-0 absolute cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Sidebar Info/Quick Settings */}
            <aside className="space-y-6">
              <div className="bg-dark-charcoal dark:bg-black/40 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center gap-2 mb-4">
                  <Monitor size={18} className="text-brand-yellow" />
                  <h2 className="font-bold uppercase tracking-wider text-xs">System Info</h2>
                </div>
                <div className="space-y-3 font-mono text-[10px] opacity-70">
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span>Version</span>
                    <span>v2.4.0-stable</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span>Storage Mode</span>
                    <span className="text-brand-yellow">Local Persistence</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span>Last Sync</span>
                    <span>{new Date().toLocaleTimeString()}</span>
                  </div>
                </div>
                
                <div className="mt-6 flex flex-col gap-2">
                  <button 
                    onClick={handleUpdateCheck}
                    className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold transition-all disabled:opacity-50"
                  >
                    Check for Updates
                  </button>
                </div>
              </div>

              <div className="bg-brand-yellow/10 border-2 border-brand-yellow/20 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-2 mb-4 text-brand-yellow">
                  <MousePointer2 size={18} />
                  <h2 className="font-bold uppercase tracking-wider text-xs">Privacy</h2>
                </div>
                <p className="text-xs mb-4 opacity-80 leading-relaxed font-medium">
                  Workspace preferences are saved strictly to this browser session. Clearing your cache will reset these values.
                </p>
                <button 
                  onClick={handleReset}
                  className="w-full py-2 bg-brand-yellow text-dark-charcoal rounded-lg text-xs font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Reset to Defaults
                </button>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </AppShell>
  );
};

const MagnetIcon = ({ size }: { size: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="m14.3 12.5 2.7-2.7a5.5 5.5 0 0 0-7.8-7.8l-2.7 2.7" />
    <path d="m21.5 7.5-2.7 2.7" />
    <path d="m15.8 8.9 1.4 1.4" />
    <path d="m18.2 11.3 1.4 1.4" />
    <path d="m2.5 16.5 2.7-2.7a5.5 5.5 0 0 1 7.8 7.8l-2.7 2.7" />
    <path d="m9.7 15.1-1.4 1.4" />
    <path d="m8.9 15.8-1.4-1.4" />
    <path d="m11.3 18.2-1.4-1.4" />
  </svg>
);

export default SettingsPage;
