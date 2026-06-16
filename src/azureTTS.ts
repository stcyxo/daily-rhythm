import type { VoiceOption } from './types';

// Azure TTS 可用的中文语音选项
export const voiceOptions: VoiceOption[] = [
  // 女声（适合赵露思）
  {
    id: 'zh-CN-XiaoxiaoNeural',
    name: '晓晓',
    description: '温柔甜美的女声',
    gender: 'female',
  },
  {
    id: 'zh-CN-XiaoyiNeural',
    name: '小艺',
    description: '活泼可爱的女声',
    gender: 'female',
  },
  {
    id: 'zh-CN-YunxiNeural',
    name: '云希',
    description: '清新自然的女声',
    gender: 'female',
  },
  {
    id: 'zh-CN-liaoning-XiaobaiNeural',
    name: '小白(东北话)',
    description: '东北口音女声',
    gender: 'female',
  },
  
  // 男声（适合李宏毅）
  {
    id: 'zh-CN-YunyangNeural',
    name: '云扬',
    description: '专业播报的男声',
    gender: 'male',
  },
  {
    id: 'zh-CN-YunfeiNeural',
    name: '云飞',
    description: '温和稳重的男声',
    gender: 'male',
  },
  {
    id: 'zh-CN-YunhaoNeural',
    name: '云皓',
    description: '成熟磁性的男声',
    gender: 'male',
  },
  {
    id: 'zh-CN-YunzeNeural',
    name: '云泽',
    description: '清澈温柔的男声',
    gender: 'male',
  },
];

// 获取女声列表（适合赵露思）
export function getFemaleVoices(): VoiceOption[] {
  return voiceOptions.filter(v => v.gender === 'female');
}

// 获取男声列表（适合李宏毅）
export function getMaleVoices(): VoiceOption[] {
  return voiceOptions.filter(v => v.gender === 'male');
}

// 微软Azure TTS 服务类
export class AzureTTSService {
  private subscriptionKey: string;
  private region: string;
  private audioContext: AudioContext | null = null;

  constructor(subscriptionKey: string, region: string) {
    this.subscriptionKey = subscriptionKey;
    this.region = region;
  }

  // 检查是否已配置
  isConfigured(): boolean {
    return !!(this.subscriptionKey && this.region);
  }

  // 合成语音
  async synthesizeSpeech(text: string, voiceName: string): Promise<void> {
    if (!this.isConfigured()) {
      console.warn('Azure TTS 未配置');
      return;
    }

    try {
      const url = `https://${this.region}.tts.speech.microsoft.com/cognitiveservices/v1`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': this.subscriptionKey,
          'Content-Type': 'application/ssml+xml',
          'X-Microsoft-OutputFormat': 'audio-16khz-32kbitrate-mono-mp3',
        },
        body: this.createSSML(text, voiceName),
      });

      if (!response.ok) {
        throw new Error(`TTS请求失败: ${response.status}`);
      }

      const audioData = await response.arrayBuffer();
      
      // 播放音频
      await this.playAudio(audioData);
    } catch (error) {
      console.error('TTS合成失败:', error);
      throw error;
    }
  }

  // 创建SSML
  private createSSML(text: string, voiceName: string): string {
    return `
      <speak version='1.0' xmlns='https://www.w3.org/2001/10/synthesis' xml:lang='zh-CN'>
        <voice name='${voiceName}'>
          ${text}
        </voice>
      </speak>
    `;
  }

  // 播放音频
  private async playAudio(audioData: ArrayBuffer): Promise<void> {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    const audioBuffer = await this.audioContext.decodeAudioData(audioData);
    const source = this.audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(this.audioContext.destination);
    source.start(0);
  }
}

// 全局TTS服务实例
let ttsService: AzureTTSService | null = null;

// 初始化TTS服务
export function initTTSService(subscriptionKey: string, region: string): AzureTTSService {
  ttsService = new AzureTTSService(subscriptionKey, region);
  return ttsService;
}

// 获取TTS服务实例
export function getTTSService(): AzureTTSService | null {
  return ttsService;
}

// 播放应援语音（使用Azure TTS）
export async function playAzureCheerText(text: string, starName: string, voiceName?: string): Promise<void> {
  if (!ttsService || !ttsService.isConfigured()) {
    console.warn('Azure TTS 未配置或未初始化');
    return;
  }

  // 根据明星选择默认声音
  const defaultVoice = voiceName || (starName === '赵露思' ? 'zh-CN-XiaoxiaoNeural' : 'zh-CN-YunzeNeural');
  
  // 添加情感
  const emotionalText = starName === '赵露思' 
    ? `加油，小鸥，我相信你可以的`
    : `加油，小鸥，你知道你可以的`;
  
  try {
    await ttsService.synthesizeSpeech(emotionalText, defaultVoice);
  } catch (error) {
    console.error('播放失败:', error);
    throw error;
  }
}
