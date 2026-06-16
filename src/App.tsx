import { useEffect, useState } from 'react';
import { Home, Clock, ListTodo, BarChart3, Settings as SettingsIcon } from 'lucide-react';
import { HomePage } from './HomePage';
import { TimelinePage } from './TimelinePage';
import { TasksPage } from './TasksPage';
import { StatsPage } from './StatsPage';
import { SettingsPage } from './SettingsPage';
import { useStore } from './store';
import { sendNotification } from './notifications';
import { timeToMinutes, currentTimeToMinutes, getTodayString } from './utils';

type Tab = 'home' | 'timeline' | 'tasks' | 'stats' | 'settings';

const TABS: { key: Tab; label: string; icon: any }[] = [
  { key: 'home', label: '首页', icon: Home },
  { key: 'timeline', label: '时间线', icon: Clock },
  { key: 'tasks', label: '任务', icon: ListTodo },
  { key: 'stats', label: '回顾', icon: BarChart3 },
  { key: 'settings', label: '设置', icon: SettingsIcon },
];

export default function App() {
  const [tab, setTab] = useState<Tab>('home');
  const { tasks, settings } = useStore();
  
  useEffect(() => {
    if (!settings.notificationsEnabled) return;
    
    const checkReminders = () => {
      const nowMin = currentTimeToMinutes();
      const today = getTodayString();
      const enabledTasks = tasks.filter((t) => t.enabled);
      
      enabledTasks.forEach((task) => {
        const startMin = timeToMinutes(task.startTime);
        const warnMin = startMin - settings.warnMinutes;
        
        const notifiedKey = `notified-${today}-${task.id}`;
        const warnedKey = `warned-${today}-${task.id}`;
        
        if (nowMin === startMin && !sessionStorage.getItem(notifiedKey)) {
          sendNotification('⏰ 任务开始', `现在该做：${task.name}`, '');
          sessionStorage.setItem(notifiedKey, '1');
        }
        
        if (settings.warnMinutes > 0 && nowMin === warnMin && !sessionStorage.getItem(warnedKey)) {
          sendNotification('🔔 即将开始', `${settings.warnMinutes}分钟后：${task.name}`, '');
          sessionStorage.setItem(warnedKey, '1');
        }
      });
    };
    
    const timer = setInterval(checkReminders, 30000);
    checkReminders();
    
    return () => clearInterval(timer);
  }, [tasks, settings]);
  
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <div className="max-w-md mx-auto px-4 pt-4 pb-24">
        {tab === 'home' && <HomePage />}
        {tab === 'timeline' && <TimelinePage />}
        {tab === 'tasks' && <TasksPage />}
        {tab === 'stats' && <StatsPage />}
        {tab === 'settings' && <SettingsPage />}
      </div>
      
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-800/95 backdrop-blur border-t border-slate-700 z-40">
        <div className="max-w-md mx-auto grid grid-cols-5">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.key;
            return (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={'flex flex-col items-center justify-center py-2.5 text-xs transition-colors ' + (active ? 'text-sky-400' : 'text-slate-500 hover:text-slate-300')}>
                <Icon className={'w-5 h-5 mb-0.5 ' + (active ? 'scale-110' : '')} strokeWidth={active ? 2.5 : 2} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
