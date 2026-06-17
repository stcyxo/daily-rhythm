import { useStore } from './store';
import { getWeekDates, getTodayString } from './utils';
import { TrendingUp, Target, Flame } from 'lucide-react';

export function StatsPage() {
  const { tasks, completions } = useStore();
  const weekDates = getWeekDates();
  const today = getTodayString(); // 今天的日期字符串
  const todayIndex = weekDates.indexOf(today); // 今天在周数组中的索引
  const weekdays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
  
  const dailyStats = weekDates.map((date, index) => {
    const dayTasks = tasks.filter((t) => t.enabled);
    const dayCompletions = completions.filter((c) => c.date === date && c.completed);
    const rate = dayTasks.length > 0 ? Math.round((dayCompletions.length / dayTasks.length) * 100) : 0;
    return { date, weekday: weekdays[index], rate, completed: dayCompletions.length, total: dayTasks.length };
  });
  
  const weekTotal = dailyStats.reduce((sum, d) => sum + d.completed, 0);
  const weekPossible = dailyStats.reduce((sum, d) => sum + d.total, 0);
  const weekRate = weekPossible > 0 ? Math.round((weekTotal / weekPossible) * 100) : 0;
  
  const todayCompleted = completions.filter((c) => c.date === today && c.completed).length;
  const todayTotal = tasks.filter((t) => t.enabled).length;
  const todayRate = todayTotal > 0 ? Math.round((todayCompleted / todayTotal) * 100) : 0;
  
  const calculateStreak = () => {
    let streak = 0;
    const sortedDates = [...new Set(completions.filter((c) => c.completed).map((c) => c.date))].sort().reverse();
    if (sortedDates.length === 0) return 0;
    
    const todayDate = new Date();
    let checkDate = new Date(todayDate);
    
    for (let i = 0; i < 365; i++) {
      const dateStr = checkDate.toISOString().split('T')[0];
      if (completions.some((c) => c.date === dateStr && c.completed)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else if (i === 0) {
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  };
  
  const streak = calculateStreak();
  const maxRate = Math.max(...dailyStats.map((d) => d.rate), 100);
  
  return (
    <div className="space-y-4 animate-fade-in pb-4">
      <div className="pt-2">
        <h1 className="text-2xl font-bold text-white">本周回顾</h1>
        <p className="text-xs text-slate-400 mt-1">坚持就是胜利 💪</p>
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-gradient-to-br from-sky-500/20 to-sky-600/5 border border-sky-500/30 rounded-xl p-3">
          <div className="flex items-center gap-1 text-sky-400 text-xs mb-1">
            <Target className="w-3 h-3" />
            <span>今日</span>
          </div>
          <div className="text-2xl font-bold text-white">{todayRate}%</div>
          <div className="text-xs text-slate-400 mt-0.5">{todayCompleted}/{todayTotal}</div>
        </div>
        
        <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/5 border border-emerald-500/30 rounded-xl p-3">
          <div className="flex items-center gap-1 text-emerald-400 text-xs mb-1">
            <TrendingUp className="w-3 h-3" />
            <span>本周</span>
          </div>
          <div className="text-2xl font-bold text-white">{weekRate}%</div>
          <div className="text-xs text-slate-400 mt-0.5">{weekTotal}/{weekPossible}</div>
        </div>
        
        <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/5 border border-orange-500/30 rounded-xl p-3">
          <div className="flex items-center gap-1 text-orange-400 text-xs mb-1">
            <Flame className="w-3 h-3" />
            <span>连续</span>
          </div>
          <div className="text-2xl font-bold text-white">{streak}</div>
          <div className="text-xs text-slate-400 mt-0.5">天</div>
        </div>
      </div>
      
      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
        <div className="text-sm text-slate-300 font-medium mb-3">每日完成率</div>
        <div className="flex items-end justify-between gap-1.5 h-40">
          {dailyStats.map((day, index) => {
            const isToday = index === todayIndex && todayIndex !== -1;
            const height = day.total === 0 ? 4 : Math.max(4, (day.rate / maxRate) * 100);
            const barColor = day.rate >= 80 ? 'bg-emerald-500' : day.rate >= 50 ? 'bg-sky-500' : day.rate > 0 ? 'bg-amber-500' : 'bg-slate-600';
            
            return (
              <div key={day.date} className="flex-1 flex flex-col items-center gap-1.5">
                <div className="text-xs text-slate-400 font-mono">{day.rate}%</div>
                <div className="w-full bg-slate-700/30 rounded-t relative overflow-hidden" style={{ height: '100%' }}>
                  <div className={'absolute bottom-0 left-0 right-0 rounded-t transition-all ' + (isToday ? barColor + ' ring-1 ring-white/30' : barColor)} style={{ height: height + '%' }} />
                </div>
                <div className={'text-xs ' + (isToday ? 'text-sky-400 font-medium' : 'text-slate-500')}>{day.weekday}</div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
        <div className="text-sm text-slate-300 font-medium mb-3">每日详情</div>
        <div className="space-y-2">
          {dailyStats.slice().reverse().map((day, idx) => {
            const originalIndex = weekDates.length - 1 - idx;
            const isToday = originalIndex === todayIndex && todayIndex !== -1;
            return (
              <div key={day.date} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className={isToday ? 'text-sky-400 font-medium' : 'text-slate-400'}>
                    {day.weekday} {isToday && '(今天)'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-500 text-xs">{day.completed}/{day.total}</span>
                  <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div className={'h-full ' + (day.rate >= 80 ? 'bg-emerald-500' : day.rate >= 50 ? 'bg-sky-500' : 'bg-amber-500')} style={{ width: day.rate + '%' }} />
                  </div>
                  <span className="text-white font-mono text-xs w-10 text-right">{day.rate}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
