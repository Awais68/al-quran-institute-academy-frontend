import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SiteSettings {
  whatsappNumber: string;
  facebookUrl: string;
  instagramUrl: string;
  twitterUrl: string;
  youtubeUrl: string;
  email: string;
  phone: string;
}

interface SettingsStore {
  settings: SiteSettings;
  updateSettings: (settings: Partial<SiteSettings>) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: {
        whatsappNumber: '+1234567890',
        facebookUrl: 'https://facebook.com/alquran-institute',
        instagramUrl: 'https://instagram.com/alquran_institute',
        twitterUrl: 'https://twitter.com/alquran_institute',
        youtubeUrl: 'https://youtube.com/@alquran-institute',
        email: 'aqionline786@gmail.com',
        phone: '+1234567890',
      },
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
    }),
    {
      name: 'site-settings',
    }
  )
);
