export interface Task {
  id: string;
  name: string;
  startTime: string;
  duration: number;
  category: string;
  icon: string;
  color: string;
  enabled: boolean;
}

export interface CompletionRecord {
  date: string;
  taskId: string;
  completed: boolean;
  skipped: boolean;
}
export interface Settings {
  notificationsEnabled: boolean;
  preset: 'early' | 'normal' | 'night';
  warnMinutes: number;
  favoriteStar: string;
}

export interface MotivationalVideo {
  id: string;
  name: string;
  description: string;
  bilibiliUrl: string;
}

// 应援图数据结构
export interface CheerImage {
  id: string;
  starName: string;
  imageUrl: string;
  isPlaceholder?: boolean;
}

// 应援音频数据结构
export interface CheerAudio {
  id: string;
  starName: string;
  audioUrl: string;
}

// 自定义激励视频
export interface CustomVideo {
  id: string;
  name: string;
  description: string;
  url: string; // B站BV号或完整URL
  videoType: 'bilibili' | 'youtube' | 'tencent' | 'iframe'; // 视频来源
}

// Azure TTS 配置
export interface AzureTTSConfig {
  subscriptionKey: string;
  region: string;
  voiceName: string;
}

// 语音选项
export interface VoiceOption {
  id: string;
  name: string;
  description: string;
  gender: 'female' | 'male';
}