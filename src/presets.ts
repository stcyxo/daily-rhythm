import type { Task } from './types';

const earlyBirdTasks: Task[] = [
  { id: 't1', name: '起床 & 喝杯水', startTime: '06:30', duration: 15, category: '健康', icon: 'Sunrise', color: '#f59e0b', enabled: true },
  { id: 't2', name: '晨间运动', startTime: '06:45', duration: 30, category: '健康', icon: 'Dumbbell', color: '#10b981', enabled: true },
  { id: 't3', name: '冥想 / 写日记', startTime: '07:15', duration: 15, category: '成长', icon: 'BookOpen', color: '#8b5cf6', enabled: true },
  { id: 't4', name: '营养早餐', startTime: '07:30', duration: 30, category: '健康', icon: 'Coffee', color: '#f59e0b', enabled: true },
  { id: 't5', name: '深度工作', startTime: '08:00', duration: 120, category: '工作', icon: 'Briefcase', color: '#3b82f6', enabled: true },
  { id: 't6', name: '休息 & 喝水', startTime: '10:00', duration: 15, category: '健康', icon: 'GlassWater', color: '#06b6d4', enabled: true },
  { id: 't7', name: '画画创作', startTime: '10:15', duration: 90, category: '创作', icon: 'Palette', color: '#ec4899', enabled: true },
  { id: 't8', name: '午餐', startTime: '12:00', duration: 45, category: '健康', icon: 'Utensils', color: '#f59e0b', enabled: true },
  { id: 't9', name: '午休', startTime: '12:45', duration: 30, category: '休息', icon: 'Moon', color: '#6366f1', enabled: true },
  { id: 't10', name: '阅读时间', startTime: '14:00', duration: 60, category: '成长', icon: 'BookMarked', color: '#8b5cf6', enabled: true },
  { id: 't11', name: '下午工作', startTime: '15:00', duration: 120, category: '工作', icon: 'Briefcase', color: '#3b82f6', enabled: true },
  { id: 't12', name: '散步 / 运动', startTime: '17:00', duration: 45, category: '健康', icon: 'Footprints', color: '#10b981', enabled: true },
  { id: 't13', name: '晚餐', startTime: '18:00', duration: 45, category: '健康', icon: 'Utensils', color: '#f59e0b', enabled: true },
  { id: 't14', name: '自由时间', startTime: '19:00', duration: 90, category: '休息', icon: 'Music', color: '#ec4899', enabled: true },
  { id: 't15', name: '阅读 / 学习', startTime: '20:30', duration: 60, category: '成长', icon: 'BookOpen', color: '#8b5cf6', enabled: true },
  { id: 't16', name: '准备睡觉', startTime: '22:00', duration: 30, category: '休息', icon: 'Moon', color: '#6366f1', enabled: true },
  { id: 't17', name: '睡觉', startTime: '22:30', duration: 480, category: '休息', icon: 'BedDouble', color: '#475569', enabled: true },
];

const normalTasks: Task[] = [
  { id: 't1', name: '起床 & 喝水', startTime: '07:30', duration: 15, category: '健康', icon: 'Sunrise', color: '#f59e0b', enabled: true },
  { id: 't2', name: '早餐', startTime: '08:00', duration: 30, category: '健康', icon: 'Coffee', color: '#f59e0b', enabled: true },
  { id: 't3', name: '深度工作', startTime: '09:00', duration: 120, category: '工作', icon: 'Briefcase', color: '#3b82f6', enabled: true },
  { id: 't4', name: '休息', startTime: '11:00', duration: 15, category: '健康', icon: 'GlassWater', color: '#06b6d4', enabled: true },
  { id: 't5', name: '画画创作', startTime: '11:15', duration: 90, category: '创作', icon: 'Palette', color: '#ec4899', enabled: true },
  { id: 't6', name: '午餐', startTime: '12:45', duration: 45, category: '健康', icon: 'Utensils', color: '#f59e0b', enabled: true },
  { id: 't7', name: '午休', startTime: '13:30', duration: 30, category: '休息', icon: 'Moon', color: '#6366f1', enabled: true },
  { id: 't8', name: '阅读时间', startTime: '14:30', duration: 60, category: '成长', icon: 'BookMarked', color: '#8b5cf6', enabled: true },
  { id: 't9', name: '下午工作', startTime: '15:30', duration: 90, category: '工作', icon: 'Briefcase', color: '#3b82f6', enabled: true },
  { id: 't10', name: '运动', startTime: '17:00', duration: 45, category: '健康', icon: 'Dumbbell', color: '#10b981', enabled: true },
  { id: 't11', name: '晚餐', startTime: '18:30', duration: 45, category: '健康', icon: 'Utensils', color: '#f59e0b', enabled: true },
  { id: 't12', name: '自由时间', startTime: '20:00', duration: 120, category: '休息', icon: 'Music', color: '#ec4899', enabled: true },
  { id: 't13', name: '准备睡觉', startTime: '23:00', duration: 30, category: '休息', icon: 'Moon', color: '#6366f1', enabled: true },
  { id: 't14', name: '睡觉', startTime: '23:30', duration: 480, category: '休息', icon: 'BedDouble', color: '#475569', enabled: true },
];

const nightOwlTasks: Task[] = [
  { id: 't1', name: '起床 & 喝水', startTime: '09:30', duration: 15, category: '健康', icon: 'Sunrise', color: '#f59e0b', enabled: true },
  { id: 't2', name: '早餐', startTime: '10:00', duration: 30, category: '健康', icon: 'Coffee', color: '#f59e0b', enabled: true },
  { id: 't3', name: '深度工作', startTime: '10:30', duration: 180, category: '工作', icon: 'Briefcase', color: '#3b82f6', enabled: true },
  { id: 't4', name: '午餐', startTime: '13:30', duration: 45, category: '健康', icon: 'Utensils', color: '#f59e0b', enabled: true },
  { id: 't5', name: '画画创作', startTime: '14:30', duration: 120, category: '创作', icon: 'Palette', color: '#ec4899', enabled: true },
  { id: 't6', name: '运动', startTime: '17:00', duration: 45, category: '健康', icon: 'Dumbbell', color: '#10b981', enabled: true },
  { id: 't7', name: '晚餐', startTime: '18:30', duration: 45, category: '健康', icon: 'Utensils', color: '#f59e0b', enabled: true },
  { id: 't8', name: '阅读', startTime: '20:00', duration: 60, category: '成长', icon: 'BookOpen', color: '#8b5cf6', enabled: true },
  { id: 't9', name: '自由时间', startTime: '21:00', duration: 120, category: '休息', icon: 'Music', color: '#ec4899', enabled: true },
  { id: 't10', name: '创作灵感时间', startTime: '23:00', duration: 90, category: '创作', icon: 'Palette', color: '#ec4899', enabled: true },
  { id: 't11', name: '准备睡觉', startTime: '01:00', duration: 30, category: '休息', icon: 'Moon', color: '#6366f1', enabled: true },
  { id: 't12', name: '睡觉', startTime: '01:30', duration: 480, category: '休息', icon: 'BedDouble', color: '#475569', enabled: true },
];

export const presetTasks = {
  early: earlyBirdTasks,
  normal: normalTasks,
  night: nightOwlTasks,
}