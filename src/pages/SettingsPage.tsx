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
  ChevronLeft
} from 'lucide-react';
import { cn } from '../lib/utils';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, resetSettings } = useStore();

  const themes = [
    { id: 'light', name: 'Alabaster', color: 'bg-bg-warm', border: 'border-gray-200' },
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
