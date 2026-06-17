import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Task, CompletionRecord, Settings, CheerImage, CheerAudio, CustomVideo } from './types';
import { presetTasks } from './presets';
import { getTodayString } from './utils';

interface AppState {
  tasks: Task[];
  completions: CompletionRecord[];
  settings: Settings;
  customCheerImages: CheerImage[]; // 自定义应援图
  customCheerAudios: CheerAudio[]; // 自定义应援音频
  customVideos: CustomVideo[]; // 自定义激励视频
  
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  loadPreset: (preset: 'early' | 'normal' | 'night') => void;
  
  markCompleted: (taskId: string) => void;
  markSkipped: (taskId: string) => void;
  resetToday: () => void;
  
  updateSettings: (updates: Partial<Settings>) => void;
  resetAllData: () => void;
  
  // 应援图相关actions
  addCheerImage: (image: Omit<CheerImage, 'id'>) => void;
  removeCheerImage: (id: string) => void;
  clearCheerImages: () => void;
  
  // 应援音频相关actions
  addCheerAudio: (audio: Omit<CheerAudio, 'id'>) => void;
  removeCheerAudio: (id: string) => void;
  clearCheerAudios: () => void;
  
  // 自定义视频actions
  addCustomVideo: (video: Omit<CustomVideo, 'id'>) => void;
  removeCustomVideo: (id: string) => void;
  clearCustomVideos: () => void;
  
  // 数据导入导出
  exportData: () => void;
  importData: (jsonString: string) => { success: boolean; error?: string };
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      tasks: presetTasks.normal,
      completions: [],
      settings: {
        notificationsEnabled: false,
        preset: 'normal',
        warnMinutes: 5,
        favoriteStar: 'zhaolusi',
      },
      customCheerImages: [], // 初始化为空数组
      customCheerAudios: [], // 初始化为空数组
      customVideos: [], // 初始化为空数组
      
      addTask: (task) => {
        const newTask: Task = {
          ...task,
          id: `task-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        };
        set((state) => ({ tasks: [...state.tasks, newTask] }));
      },
      
      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        }));
      },
      
      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        }));
      },
      
      toggleTask: (id) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, enabled: !t.enabled } : t
          ),
        }));
      },
      
      loadPreset: (preset) => {
        set({
          tasks: presetTasks[preset].map((t) => ({
            ...t,
            id: `task-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          })),
          settings: { ...get().settings, preset },
        });
      },
      
      markCompleted: (taskId) => {
        const today = getTodayString();
        set((state) => {
          const filtered = state.completions.filter(
            (c) => !(c.date === today && c.taskId === taskId)
          );
          return {
            completions: [
              ...filtered,
              { date: today, taskId, completed: true, skipped: false },
            ],
          };
        });
      },
      
      markSkipped: (taskId) => {
        const today = getTodayString();
        set((state) => {
          const filtered = state.completions.filter(
            (c) => !(c.date === today && c.taskId === taskId)
          );
          return {
            completions: [
              ...filtered,
              { date: today, taskId, completed: false, skipped: true },
            ],
          };
        });
      },
      
      resetToday: () => {
        const today = getTodayString();
        set((state) => ({
          completions: state.completions.filter((c) => c.date !== today),
        }));
      },
      
      updateSettings: (updates) => {
        set((state) => ({
          settings: { ...state.settings, ...updates },
        }));
      },
      
      resetAllData: () => {
        set({
          tasks: presetTasks.normal,
          completions: [],
          settings: {
            notificationsEnabled: false,
            preset: 'normal',
            warnMinutes: 5,
            favoriteStar: 'zhaolusi',
          },
          customCheerImages: [],
          customCheerAudios: [],
          customVideos: [],
        });
      },
      
      // 应援图相关actions
      addCheerImage: (image) => {
        const newImage: CheerImage = {
          ...image,
          id: `cheer-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        };
        set((state) => ({ customCheerImages: [...state.customCheerImages, newImage] }));
      },
      
      removeCheerImage: (id) => {
        set((state) => ({
          customCheerImages: state.customCheerImages.filter((img) => img.id !== id),
        }));
      },
      
      clearCheerImages: () => {
        set({ customCheerImages: [] });
      },
      
      // 应援音频相关actions
      addCheerAudio: (audio) => {
        const newAudio: CheerAudio = {
          ...audio,
          id: `audio-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        };
        set((state) => ({ customCheerAudios: [...state.customCheerAudios, newAudio] }));
      },
      
      removeCheerAudio: (id) => {
        set((state) => ({
          customCheerAudios: state.customCheerAudios.filter((aud) => aud.id !== id),
        }));
      },
      
      clearCheerAudios: () => {
        set({ customCheerAudios: [] });
      },
      
      // 自定义视频actions
      addCustomVideo: (video) => {
        const newVideo: CustomVideo = {
          ...video,
          id: `custom-video-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        };
        set((state) => ({ customVideos: [...state.customVideos, newVideo] }));
      },
      
      removeCustomVideo: (id) => {
        set((state) => ({
          customVideos: state.customVideos.filter((v) => v.id !== id),
        }));
      },
      
      clearCustomVideos: () => {
        set({ customVideos: [] });
      },
      
      // 导出数据
      exportData: () => {
        const state = get();
        const data = {
          tasks: state.tasks,
          completions: state.completions,
          settings: state.settings,
          customCheerImages: state.customCheerImages,
          customCheerAudios: state.customCheerAudios,
          customVideos: state.customVideos,
          exportTime: new Date().toISOString(),
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `daily-rhythm-backup-${getTodayString()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      },
      
      // 导入数据
      importData: (jsonString: string) => {
        try {
          const data = JSON.parse(jsonString);
          if (data.tasks) set({ tasks: data.tasks });
          if (data.completions) set({ completions: data.completions });
          if (data.settings) set({ settings: { ...get().settings, ...data.settings } });
          if (data.customCheerImages) set({ customCheerImages: data.customCheerImages });
          if (data.customCheerAudios) set({ customCheerAudios: data.customCheerAudios });
          if (data.customVideos) set({ customVideos: data.customVideos });
          return { success: true };
        } catch (error) {
          return { success: false, error: '文件格式不正确' };
        }
      },
    }),
    {
      name: 'daily-rhythm-storage',
    }
  )
);
