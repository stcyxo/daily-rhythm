import { useEffect, useState } from 'react';
import { Check, SkipForward, Circle } from 'lucide-react';
import { useStore } from './store';
import { getTaskStatus, timeToMinutes, minutesToTime, getTodayString } from './utils';
import { TaskIcon } from './IconRenderer';

export function TimelinePage() {
  const { tasks, completions, markCompleted, markSkipped } = useStore();
  const [now, setNow] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);
  
  const today = getTodayString();
  
  const sortedTasks = [...tasks]
    .filter((t) => t.enabled)
    .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
  
  const getTaskRecord = (taskId: string) => {
    return completions.find((c) => c.date === today && c.taskId === taskId);
  };
  
  return (
    <div className="space-y-4 animate-fade-in pb-4">
      <div className="flex items-center justify-between pt-2">
        <h1 className="text-2xl font-bold text-white">今日时间线</h1>
        <div className="text-xs text-slate-400">
          {sortedTasks.length} 个任务
        </div>
      </div>
      
      <div className="relative">
        <div className="absolute left-7 top-0 bottom-0 w-0.5 bg-slate-700" />
        
        {sortedTasks.map((task) => {
          const status = getTaskStatus(task.startTime, task.duration);
          const record = getTaskRecord(task.id);
          const endTime = minutesToTime(timeToMinutes(task.startTime) + task.duration);
          
          let cardClass = '';
          let iconClass = '';
          let textClass = '';
          let StatusIcon = Circle;
          
          if (record?.completed) {
            cardClass = 'bg-emerald-500/10 border-emerald-500/40';
            iconClass = 'bg-emerald-500 text-white';
            textClass = 'text-slate-400 line-through';
            StatusIcon = Check;
          } else if (record?.skipped) {
            cardClass = 'bg-slate-700/30 border-slate-600/40';
            iconClass = 'bg-slate-600 text-slate-400';
            textClass = 'text-slate-500 line-through';
            StatusIcon = SkipForward;
          } else if (status === 'past') {
            cardClass = 'bg-slate-800/30 border-slate-700/40';
            iconClass = 'bg-slate-700 text-slate-500';
            textClass = 'text-slate-500';
            StatusIcon = Circle;
          } else if (status === 'current') {
            cardClass = 'bg-sky-500/10 border-sky-500/50 shadow-lg shadow-sky-500/20';
            iconClass = 'bg-sky-500 text-white animate-pulse';
            textClass = 'text-white';
            StatusIcon = Circle;
          } else {
            cardClass = 'bg-slate-800/50 border-slate-700/50';
            iconClass = 'bg-slate-700 text-slate-400';
            textClass = 'text-white';
            StatusIcon = Circle;
          }
          
          return (
            <div key={task.id} className="relative pl-16 pr-3 py-2">
              <div className={`absolute left-4 w-7 h-7 rounded-full flex items-center justify-center ${iconClass}`}
                style={status === 'current' && !record ? { boxShadow: '0 0 0 4px rgba(14, 165, 233, 0.2)' } : {}}>
                <StatusIcon className="w-3.5 h-3.5" />
              </div>
              
              <div className={`rounded-xl p-3 border ${cardClass} transition-all`}>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: task.color + '20' }}>
                    <TaskIcon name={task.icon} className="w-5 h-5" style={{ color: record ? '#94a3b8' : task.color }} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="text-sm font-mono text-slate-400">
                        {task.startTime}
                      </span>
                      <span className="text-xs text-slate-500">→ {endTime}</span>
                      <span className="text-xs px-1.5 py-0.5 rounded ml-auto"
                        style={{ backgroundColor: task.color + '20', color: task.color }}>
                        {task.category}
                      </span>
                    </div>
                    <h3 className={`font-medium mt-0.5 ${textClass}`}>
                      {task.name}
                    </h3>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {task.duration} 分钟
                    </div>
                    
                    {status === 'current' && !record && (
                      <div className="flex gap-1.5 mt-2">
                        <button onClick={() => markCompleted(task.id)} className="flex-1 bg-sky-500 hover:bg-sky-600 text-white text-xs font-medium py-1.5 rounded-md flex items-center justify-center gap-1 transition-colors">
                          <Check className="w-3 h-3" />完成
                        </button>
                        <button onClick={() => markSkipped(task.id)} className="px-2 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-medium py-1.5 rounded-md flex items-center justify-center gap-1 transition-colors">
                          <SkipForward className="w-3 h-3" />跳过
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        
        {sortedTasks.length === 0 && (
          <div className="text-center text-slate-400 py-8">
            还没有任务，去任务管理添加吧
          </div>
        )}
      </div>
    </div>
  );
}
