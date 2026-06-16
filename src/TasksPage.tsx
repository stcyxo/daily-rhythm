import { useState } from 'react';
import { Plus, Trash2, Edit2, X, Check } from 'lucide-react';
import { useStore } from './store';
import type { Task } from './types';
import { TaskIcon } from './IconRenderer';

const CATEGORIES = ['健康', '工作', '创作', '成长', '休息', '其他'];
const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#6366f1', '#06b6d4', '#3b82f6'];
const ICON_OPTIONS = [
  'Sunrise', 'Coffee', 'Dumbbell', 'BookOpen', 'BookMarked', 'Briefcase',
  'Palette', 'GlassWater', 'Utensils', 'Moon', 'BedDouble', 'Music', 'Footprints'
];

interface EditState {
  isOpen: boolean;
  task: Partial<Task> | null;
  isNew: boolean;
}

export function TasksPage() {
  const { tasks, addTask, updateTask, deleteTask, toggleTask, loadPreset, settings } = useStore();
  const [edit, setEdit] = useState<EditState>({ isOpen: false, task: null, isNew: true });

  const sortedTasks = [...tasks].sort((a, b) => a.startTime.localeCompare(b.startTime));

  const openNew = () => {
    setEdit({
      isOpen: true,
      isNew: true,
      task: { name: '', startTime: '09:00', duration: 30, category: '健康', icon: 'Circle', color: COLORS[0], enabled: true },
    });
  };

  const openEdit = (task: Task) => setEdit({ isOpen: true, isNew: false, task: { ...task } });

  const save = () => {
    if (!edit.task || !edit.task.name) return;
    if (edit.isNew) addTask(edit.task as Omit<Task, 'id'>);
    else updateTask(edit.task.id!, edit.task);
    setEdit({ isOpen: false, task: null, isNew: true });
  };

  const handlePreset = (preset: 'early' | 'normal' | 'night') => {
    if (confirm('加载预设会覆盖当前任务列表，确定吗？')) loadPreset(preset);
  };

  return (
    <div className="space-y-4 animate-fade-in pb-4">
      <div className="flex items-center justify-between pt-2">
        <h1 className="text-2xl font-bold text-white">任务管理</h1>
        <button onClick={openNew} className="bg-sky-500 hover:bg-sky-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-sm font-medium">
          <Plus className="w-4 h-4" />添加
        </button>
      </div>

      <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
        <div className="text-xs text-slate-400 mb-2">快速加载作息模板</div>
        <div className="grid grid-cols-3 gap-2">
          {(['early', 'normal', 'night'] as const).map((p) => (
            <button key={p} onClick={() => handlePreset(p)}
              className={'text-xs py-2 rounded-lg border ' + (settings.preset === p ? 'bg-sky-500/20 border-sky-500/50 text-sky-300' : 'bg-slate-700/30 border-slate-600/50 text-slate-300')}>
              {p === 'early' ? '🌅 早起型' : p === 'normal' ? '☀️ 标准型' : '🌙 夜猫子'}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {sortedTasks.map((task) => (
          <div key={task.id} className={'rounded-xl p-3 border ' + (task.enabled ? 'bg-slate-800/50 border-slate-700/50' : 'bg-slate-800/20 border-slate-700/30 opacity-60')}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: task.color + '20' }}>
                <TaskIcon name={task.icon} className="w-5 h-5" style={{ color: task.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono text-slate-400">{task.startTime}</span>
                  <span className={'font-medium truncate ' + (task.enabled ? 'text-white' : 'text-slate-500')}>{task.name}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                  <span>{task.duration} 分钟</span>
                  <span className="px-1.5 py-0.5 rounded" style={{ backgroundColor: task.color + '20', color: task.color }}>{task.category}</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => toggleTask(task.id)} className={'w-8 h-8 rounded-lg flex items-center justify-center ' + (task.enabled ? 'bg-sky-500/20 text-sky-400' : 'bg-slate-700/50 text-slate-500')}>
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => openEdit(task)} className="w-8 h-8 rounded-lg bg-slate-700/50 text-slate-400 flex items-center justify-center">
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => { if (confirm('确定删除「' + task.name + '」吗？')) deleteTask(task.id); }} className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {sortedTasks.length === 0 && <div className="text-center text-slate-400 py-8">还没有任务，点击右上角添加</div>}
      </div>

      {edit.isOpen && edit.task && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-slate-800 rounded-t-2xl sm:rounded-2xl w-full max-w-md p-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">{edit.isNew ? '添加任务' : '编辑任务'}</h2>
              <button onClick={() => setEdit({ isOpen: false, task: null, isNew: true })} className="w-8 h-8 rounded-lg bg-slate-700/50 text-slate-400 flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">任务名称</label>
                <input type="text" value={edit.task.name || ''} onChange={(e) => setEdit({ ...edit, task: { ...edit.task!, name: e.target.value } })} placeholder="例如：晨间运动" className="w-full bg-slate-700/50 text-white px-3 py-2 rounded-lg border border-slate-600 focus:border-sky-500 focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">开始时间</label>
                  <input type="time" value={edit.task.startTime || '09:00'} onChange={(e) => setEdit({ ...edit, task: { ...edit.task!, startTime: e.target.value } })} className="w-full bg-slate-700/50 text-white px-3 py-2 rounded-lg border border-slate-600 focus:border-sky-500 focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">时长（分钟）</label>
                  <input type="number" value={edit.task.duration || 30} onChange={(e) => setEdit({ ...edit, task: { ...edit.task!, duration: Number(e.target.value) } })} min="5" step="5" className="w-full bg-slate-700/50 text-white px-3 py-2 rounded-lg border border-slate-600 focus:border-sky-500 focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">类别</label>
                <div className="grid grid-cols-3 gap-2">
                  {CATEGORIES.map((cat) => (
                    <button key={cat} onClick={() => setEdit({ ...edit, task: { ...edit.task!, category: cat } })} className={'text-xs py-1.5 rounded-lg border ' + (edit.task.category === cat ? 'bg-sky-500/20 border-sky-500/50 text-sky-300' : 'bg-slate-700/30 border-slate-600/50 text-slate-300')}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">颜色</label>
                <div className="flex gap-2 flex-wrap">
                  {COLORS.map((c) => (
                    <button key={c} onClick={() => setEdit({ ...edit, task: { ...edit.task!, color: c } })} className={'w-8 h-8 rounded-lg ' + (edit.task.color === c ? 'ring-2 ring-white scale-110' : '')} style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">图标</label>
                <div className="grid grid-cols-7 gap-2">
                  {ICON_OPTIONS.map((iconName) => (
                    <button key={iconName} onClick={() => setEdit({ ...edit, task: { ...edit.task!, icon: iconName } })} className={'w-9 h-9 rounded-lg flex items-center justify-center ' + (edit.task.icon === iconName ? 'bg-sky-500/30 text-sky-300 ring-1 ring-sky-500/50' : 'bg-slate-700/30 text-slate-400')}>
                      <TaskIcon name={iconName} className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={save} disabled={!edit.task.name} className="w-full bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg mt-2">保存</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
