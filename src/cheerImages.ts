import type { CheerImage } from './types';
import { useStore } from './store';

// 获取应援图列表（包括上传的图片）
export function getCheerImages(): CheerImage[] {
  const { customCheerImages } = useStore.getState();
  
  // 默认应援图（当没有上传图片时使用）
  const defaultImages: CheerImage[] = [
    // 赵露思
    {
      id: 'zhaolusi_default',
      starName: '赵露思',
      imageUrl: '',
      isPlaceholder: true,
    },
    // 李宏毅
    {
      id: 'lihongyi_default',
      starName: '李宏毅',
      imageUrl: '',
      isPlaceholder: true,
    },
  ];
  
  return customCheerImages.length > 0 ? customCheerImages : defaultImages;
}

// 随机获取一张应援图
export function getRandomCheerImage(): CheerImage {
  const images = getCheerImages();
  
  // 过滤掉没有图片的占位符
  const validImages = images.filter(img => !img.isPlaceholder || img.imageUrl);
  
  if (validImages.length === 0) {
    // 如果没有任何图片，返回一个默认的占位符
    return {
      id: 'default',
      starName: '小鸥',
      imageUrl: '',
      isPlaceholder: true,
    };
  }
  
  const index = Math.floor(Math.random() * validImages.length);
  return validImages[index];
}
