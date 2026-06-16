import type { MotivationalVideo, CustomVideo } from './types';

// 激励视频数据 - 使用官方影视预告片和角色片段
export const motivationalVideos: MotivationalVideo[] = [
  {
    id: 'zhaolusi_dipai',
    name: '赵露思 - 活成自己的底牌',
    description: '在最烂的时候押上一切，把自己活成底牌',
    bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV1vJ5e6tEQA&auto_play=0',
  },
  {
    id: 'zhaolusi_zhulian_yumian',
    name: '赵露思 - 珠帘玉幕预告',
    description: '采珠奴端午逆袭成为一代女商人，官方预告片',
    bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV1eMGo67EBF&auto_play=0',
  },
  {
    id: 'zhaolusi_xinghan',
    name: '赵露思 - 星汉灿烂片段',
    description: '赵露思饰演程少商，古装女性成长故事',
    bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV1qK4y1t7fE&auto_play=0',
  },
  {
    id: 'lihongyi_shaoniansongxing',
    name: '李宏毅 - 少年歌行萧瑟预告',
    description: '萧瑟名场面 - 少年意气，热血武侠',
    bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV1eMGo67EBF&auto_play=0',
  },
  {
    id: 'lihongyi_xiaosegao',
    name: '李宏毅 - 萧瑟霸气语录',
    description: '"凭心而动"、"我输得起"少年人的江湖',
    bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV1uKQ1BqELt&auto_play=0',
  },
  {
    id: 'wuyan_tuili_official',
    name: '勿言推理 - 官方预告',
    description: '久能整的推理世界，解开事件也解开人心',
    bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV1Wh4y1n7Lh&auto_play=0',
  },
];

export function getVideoById(id: string): MotivationalVideo | undefined {
  return motivationalVideos.find((v) => v.id === id);
}

// 将用户输入的URL转换为可嵌入的iframe URL
export function convertToEmbedUrl(input: string, type: 'bilibili' | 'youtube' | 'tencent' | 'iframe'): string {
  if (type === 'iframe') {
    return input; // 直接使用完整iframe URL
  }
  
  if (type === 'bilibili') {
    // 提取BV号
    const bvMatch = input.match(/BV[a-zA-Z0-9]+/);
    if (bvMatch) {
      return `https://player.bilibili.com/player.html?bvid=${bvMatch[0]}&auto_play=0`;
    }
    // 尝试提取av号
    const avMatch = input.match(/av(\d+)/);
    if (avMatch) {
      return `https://player.bilibili.com/player.html?aid=${avMatch[1]}&auto_play=0`;
    }
    // 如果已经是完整URL
    if (input.startsWith('http')) {
      return input;
    }
  }
  
  if (type === 'youtube') {
    // 提取YouTube视频ID
    const ytMatch = input.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    if (ytMatch) {
      return `https://www.youtube.com/embed/${ytMatch[1]}`;
    }
    if (input.startsWith('http')) {
      return input;
    }
  }
  
  if (type === 'tencent') {
    // 腾讯视频嵌入URL处理
    if (input.startsWith('http')) {
      return input;
    }
  }
  
  return input;
}
