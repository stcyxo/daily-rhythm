import { Bell, RotateCcw, Trash2, Check, Heart, Volume2, ExternalLink, AlertCircle, Plus, X, Video, Smartphone, Wifi } from 'lucide-react';
import { useState } from 'react';
import { useStore } from './store';
import { requestNotificationPermission } from './notifications';
import { motivationalVideos, convertToEmbedUrl } from './motivationalVideos';
import { voiceOptions, getFemaleVoices, getMaleVoices } from './azureTTS';
import { initTTSService } from './azureTTS';

export function SettingsPage() {
  const { settings, updateSettings, resetAllData, resetToday, customVideos, addCustomVideo, removeCustomVideo } = useStore();
  const [notifStatus, setNotifStatus] = useState<NotificationPermission | 'unsupported'>(
    typeof Notification !== 'undefined' ? Notification.permission : 'unsupported'
  );
  
  // Azure TTS 配置状态
  const [azureKey, setAzureKey] = useState(() => localStorage.getItem('azure-tts-key') || '');
  const [azureRegion, setAzureRegion] = useState(() => localStorage.getItem('azure-tts-region') || 'eastasia');
  const [azureFemaleVoice, setAzureFemaleVoice] = useState(() => localStorage.getItem('azure-tts-female-voice') || 'zh-CN-XiaoxiaoNeural');
  const [azureMaleVoice, setAzureMaleVoice] = useState(() => localStorage.getItem('azure-tts-male-voice') || 'zh-CN-YunzeNeural');
  const [ttsConfigSaved, setTtsConfigSaved] = useState(false);
  const [ttsError, setTtsError] = useState<string | null>(null);
  
  // 自定义视频状态
  const [showAddVideo, setShowAddVideo] = useState(false);
  const [newVideoName, setNewVideoName] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newVideoDesc, setNewVideoDesc] = useState('');
  const [newVideoType, setNewVideoType] = useState<'bilibili' | 'youtube' | 'tencent' | 'iframe'>('bilibili');
  
  const handleEnableNotifications = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      updateSettings({ notificationsEnabled: true });
      setNotifStatus('granted');
      new Notification('通知已开启', { body: 'Daily Rhythm 会在任务开始时提醒你' });
    } else {
      setNotifStatus(Notification.permission);
    }
  };
  
  return (
    <div className="space-y-4 animate-fade-in pb-4">
      <div className="pt-2">
        <h1 className="text-2xl font-bold text-white">设置</h1>
      </div>
      
      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
        <div className="flex items-center gap-2 mb-3">
          <Bell className="w-4 h-4 text-sky-400" />
          <span className="text-sm font-medium text-slate-300">通知提醒</span>
        </div>
        
        {notifStatus === 'unsupported' ? (
          <div className="text-sm text-slate-400">当前浏览器不支持通知</div>
        ) : notifStatus === 'granted' ? (
          <div>
            <div className="flex items-center gap-2 text-sm text-emerald-400 mb-3">
              <Check className="w-4 h-4" />
              <span>通知权限已开启</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">启用通知提醒</span>
              <button onClick={() => updateSettings({ notificationsEnabled: !settings.notificationsEnabled })}
                className={'w-11 h-6 rounded-full transition-colors ' + (settings.notificationsEnabled ? 'bg-sky-500' : 'bg-slate-600')}>
                <div className={'w-5 h-5 bg-white rounded-full transition-transform ' + (settings.notificationsEnabled ? 'translate-x-5' : 'translate-x-0.5')} />
              </button>
            </div>
            <div className="flex items-center justify-between mt-3">
              <span className="text-sm text-slate-300">提前预警</span>
              <select value={settings.warnMinutes} onChange={(e) => updateSettings({ warnMinutes: Number(e.target.value) })}
                className="bg-slate-700 text-white text-sm rounded px-2 py-1 border border-slate-600">
                <option value="0">不预警</option>
                <option value="5">5 分钟</option>
                <option value="10">10 分钟</option>
                <option value="15">15 分钟</option>
              </select>
            </div>
          </div>
        ) : notifStatus === 'denied' ? (
          <div className="text-sm text-rose-400">
            通知权限被拒绝，请在浏览器设置中开启
          </div>
        ) : (
          <button onClick={handleEnableNotifications} className="w-full bg-sky-500 hover:bg-sky-600 text-white font-medium py-2.5 rounded-lg transition-colors">
            开启通知提醒
          </button>
        )}
      </div>
      
      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
        <div className="flex items-center gap-2 mb-3">
          <RotateCcw className="w-4 h-4 text-sky-400" />
          <span className="text-sm font-medium text-slate-300">作息类型</span>
        </div>
        <div className="space-y-2">
          {([
            { key: 'early', label: '🌅 早起型', desc: '6:30 起床，22:30 睡觉' },
            { key: 'normal', label: '☀️ 标准型', desc: '7:30 起床，23:30 睡觉' },
            { key: 'night', label: '🌙 夜猫子', desc: '9:30 起床，01:30 睡觉' },
          ] as const).map((item) => (
            <button key={item.key} onClick={() => {
              if (confirm('切换作息会替换当前任务列表，确定吗？')) {
                useStore.getState().loadPreset(item.key);
              }
            }} className={'w-full p-3 rounded-lg border text-left transition-colors ' + (settings.preset === item.key ? 'bg-sky-500/10 border-sky-500/40' : 'bg-slate-700/30 border-slate-600/50 hover:bg-slate-700/50')}>
              <div className="text-sm font-medium text-white">{item.label}</div>
              <div className="text-xs text-slate-400 mt-0.5">{item.desc}</div>
            </button>
          ))}
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-pink-500/10 to-rose-500/5 border border-pink-500/30 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Heart className="w-4 h-4 text-pink-400" />
          <span className="text-sm font-medium text-slate-300">激励明星</span>
        </div>
        <p className="text-xs text-slate-400 mb-3">
          选择你喜欢的明星/角色，当你需要鼓励时会播放他们的励志视频
        </p>
        <div className="grid grid-cols-2 gap-2">
          {/* 预置视频 */}
          {motivationalVideos.map((video) => (
            <button
              key={video.id}
              onClick={() => updateSettings({ favoriteStar: video.id })}
              className={'p-3 rounded-lg border transition-all text-left ' +
                (settings.favoriteStar === video.id
                  ? 'bg-pink-500/20 border-pink-500 text-pink-300'
                  : 'bg-slate-700/30 border-slate-600/50 text-slate-300 hover:bg-slate-700/50')}
            >
              <div className="text-sm font-medium">{video.name}</div>
              <div className="text-xs text-slate-500 mt-0.5 line-clamp-2">{video.description}</div>
            </button>
          ))}
          {/* 自定义视频 */}
          {customVideos.map((video) => (
            <button
              key={video.id}
              onClick={() => updateSettings({ favoriteStar: video.id })}
              className={'p-3 rounded-lg border transition-all text-left relative ' +
                (settings.favoriteStar === video.id
                  ? 'bg-pink-500/20 border-pink-500 text-pink-300'
                  : 'bg-slate-700/30 border-slate-600/50 text-slate-300 hover:bg-slate-700/50')}
            >
              <div className="text-sm font-medium">{video.name}</div>
              <div className="text-xs text-slate-500 mt-0.5 line-clamp-2">{video.description}</div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm('确定删除这个视频吗？')) {
                    removeCustomVideo(video.id);
                  }
                }}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-slate-900/70 text-slate-400 hover:text-rose-400 flex items-center justify-center"
              >
                <X className="w-3 h-3" />
              </button>
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowAddVideo(true)}
          className="w-full mt-3 bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>添加自定义视频</span>
        </button>
      </div>

      {/* 手机访问说明 */}
      <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/5 border border-cyan-500/30 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Smartphone className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-medium text-slate-300">手机访问指南</span>
        </div>
        <div className="space-y-3 text-xs text-slate-300">
          <div className="flex items-start gap-2">
            <Wifi className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-slate-200 mb-1">方式一：同WiFi局域网（推荐）</p>
              <p className="text-slate-400">手机和电脑连同一WiFi，手机浏览器访问：</p>
              <p className="text-cyan-400 font-mono text-sm mt-1">http://192.168.0.109:4173/</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Video className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-slate-200 mb-1">方式二：部署到云端（永久访问）</p>
              <p className="text-slate-400">需要部署到 Vercel/Netlify 等平台，详情可问我</p>
            </div>
          </div>
        </div>
      </div>

      {/* 添加自定义视频弹窗 */}
      {showAddVideo && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-700">
              <h2 className="text-lg font-bold text-white">添加自定义视频</h2>
              <button
                onClick={() => setShowAddVideo(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">视频来源</label>
                <select
                  value={newVideoType}
                  onChange={(e) => setNewVideoType(e.target.value as any)}
                  className="w-full bg-slate-700 text-white text-sm rounded-lg px-3 py-2 border border-slate-600"
                >
                  <option value="bilibili">B站（推荐）</option>
                  <option value="youtube">YouTube</option>
                  <option value="tencent">腾讯视频</option>
                  <option value="iframe">其他（iframe）</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">视频名称</label>
                <input
                  type="text"
                  value={newVideoName}
                  onChange={(e) => setNewVideoName(e.target.value)}
                  placeholder="如：赵露思 - 我的故事"
                  className="w-full bg-slate-700 text-white text-sm rounded-lg px-3 py-2 border border-slate-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  {newVideoType === 'bilibili' ? 'B站链接或BV号' :
                   newVideoType === 'youtube' ? 'YouTube链接' :
                   newVideoType === 'tencent' ? '腾讯视频链接' : 'iframe嵌入URL'}
                </label>
                <input
                  type="text"
                  value={newVideoUrl}
                  onChange={(e) => setNewVideoUrl(e.target.value)}
                  placeholder={
                    newVideoType === 'bilibili' ? 'BV号或完整URL' :
                    newVideoType === 'youtube' ? 'youtube.com/watch?v=xxx' :
                    newVideoType === 'tencent' ? 'v.qq.com/x/cover/xxx' : '完整iframe URL'
                  }
                  className="w-full bg-slate-700 text-white text-sm rounded-lg px-3 py-2 border border-slate-600"
                />
                <p className="text-xs text-slate-500 mt-1">
                  {newVideoType === 'bilibili' && '示例：BV1vJ5e6tEQA 或 https://www.bilibili.com/video/BV1vJ5e6tEQA'}
                  {newVideoType === 'youtube' && '示例：https://www.youtube.com/watch?v=xxx 或 youtu.be/xxx'}
                  {newVideoType === 'tencent' && '示例：https://v.qq.com/x/cover/xxx.html'}
                  {newVideoType === 'iframe' && '完整的 iframe src URL'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">视频描述（可选）</label>
                <input
                  type="text"
                  value={newVideoDesc}
                  onChange={(e) => setNewVideoDesc(e.target.value)}
                  placeholder="如：采珠奴逆袭故事"
                  className="w-full bg-slate-700 text-white text-sm rounded-lg px-3 py-2 border border-slate-600"
                />
              </div>

              <button
                onClick={() => {
                  if (!newVideoName || !newVideoUrl) {
                    alert('请填写视频名称和URL');
                    return;
                  }
                  
                  const embedUrl = convertToEmbedUrl(newVideoUrl, newVideoType);
                  
                  addCustomVideo({
                    name: newVideoName,
                    description: newVideoDesc || '自定义视频',
                    url: embedUrl,
                    videoType: newVideoType,
                  });
                  
                  alert('视频已添加！');
                  setNewVideoName('');
                  setNewVideoUrl('');
                  setNewVideoDesc('');
                  setShowAddVideo(false);
                }}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 rounded-lg transition-colors"
              >
                添加视频
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Azure TTS 配置 */}
      <div className="bg-gradient-to-br from-purple-500/10 to-indigo-500/5 border border-purple-500/30 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Volume2 className="w-4 h-4 text-purple-400" />
          <span className="text-sm font-medium text-slate-300">高级语音配置</span>
        </div>
        
        <p className="text-xs text-slate-400 mb-3">
          配置微软Azure语音合成服务，获得更自然的中文语音效果
        </p>
        
        {/* Azure 申请说明 */}
        <div className="bg-slate-700/30 rounded-lg p-3 mb-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-slate-400">
              <p className="font-medium text-slate-300 mb-1">如何获取Azure密钥？</p>
              <p className="mb-1">1. 访问 <a href="https://speech.microsoft.com/portal" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">Azure 语音服务</a></p>
              <p>2. 注册免费账号，创建语音资源，获取密钥和区域</p>
              <p className="mt-1 text-emerald-400">每月50万字符免费额度，个人使用绑绑够！</p>
            </div>
          </div>
        </div>

        {/* API Key */}
        <div className="mb-3">
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Azure API 密钥
          </label>
          <input
            type="password"
            value={azureKey}
            onChange={(e) => setAzureKey(e.target.value)}
            placeholder="输入你的Azure语音服务密钥"
            className="w-full bg-slate-700/50 text-white text-sm rounded-lg px-3 py-2 border border-slate-600 focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Region */}
        <div className="mb-3">
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Azure 区域
          </label>
          <select
            value={azureRegion}
            onChange={(e) => setAzureRegion(e.target.value)}
            className="w-full bg-slate-700/50 text-white text-sm rounded-lg px-3 py-2 border border-slate-600 focus:outline-none focus:border-purple-500"
          >
            <option value="eastasia">东亚（eastasia）</option>
            <option value="southeastasia">东南亚（southeastasia）</option>
            <option value="eastus">美国东部（eastus）</option>
            <option value="westus">美国西部（westus）</option>
            <option value="westeurope">西欧（westeurope）</option>
          </select>
        </div>

        {/* 女声选择 */}
        <div className="mb-3">
          <label className="block text-xs font-medium text-slate-300 mb-1">
            赵露思的声音
          </label>
          <select
            value={azureFemaleVoice}
            onChange={(e) => setAzureFemaleVoice(e.target.value)}
            className="w-full bg-slate-700/50 text-white text-sm rounded-lg px-3 py-2 border border-slate-600 focus:outline-none focus:border-purple-500"
          >
            {getFemaleVoices().map((voice) => (
              <option key={voice.id} value={voice.id}>
                {voice.name} - {voice.description}
              </option>
            ))}
          </select>
        </div>

        {/* 男声选择 */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-slate-300 mb-1">
            李宏毅的声音
          </label>
          <select
            value={azureMaleVoice}
            onChange={(e) => setAzureMaleVoice(e.target.value)}
            className="w-full bg-slate-700/50 text-white text-sm rounded-lg px-3 py-2 border border-slate-600 focus:outline-none focus:border-purple-500"
          >
            {getMaleVoices().map((voice) => (
              <option key={voice.id} value={voice.id}>
                {voice.name} - {voice.description}
              </option>
            ))}
          </select>
        </div>

        {/* 保存按钮 */}
        <button
          onClick={() => {
            // 保存配置
            localStorage.setItem('azure-tts-key', azureKey);
            localStorage.setItem('azure-tts-region', azureRegion);
            localStorage.setItem('azure-tts-female-voice', azureFemaleVoice);
            localStorage.setItem('azure-tts-male-voice', azureMaleVoice);
            
            // 初始化TTS服务
            if (azureKey && azureRegion) {
              initTTSService(azureKey, azureRegion);
              setTtsError(null);
              setTtsConfigSaved(true);
              setTimeout(() => setTtsConfigSaved(false), 2000);
            } else {
              setTtsError('请输入Azure API密钥');
            }
          }}
          className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-2.5 rounded-lg transition-colors"
        >
          {ttsConfigSaved ? '✓ 配置已保存' : '保存语音配置'}
        </button>

        {ttsError && (
          <p className="text-xs text-rose-400 mt-2 text-center">{ttsError}</p>
        )}

        {azureKey && (
          <p className="text-xs text-emerald-400 mt-2 text-center flex items-center justify-center gap-1">
            <Check className="w-3 h-3" />
            Azure TTS 已配置，点击"随机抽卡"听效果
          </p>
        )}
      </div>

      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
        <div className="flex items-center gap-2 mb-3">
          <Trash2 className="w-4 h-4 text-rose-400" />
          <span className="text-sm font-medium text-slate-300">数据管理</span>
        </div>
        <div className="space-y-2">
          <button onClick={() => {
            if (confirm('确定清空今日所有完成记录吗？')) resetToday();
          }} className="w-full bg-slate-700/50 hover:bg-slate-700 text-slate-300 font-medium py-2.5 rounded-lg text-sm">
            清空今日记录
          </button>
          <button onClick={() => {
            if (confirm('确定重置所有数据吗？此操作不可恢复！')) resetAllData();
          }} className="w-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-medium py-2.5 rounded-lg text-sm">
            重置全部数据
          </button>
        </div>
      </div>

      <div className="text-center text-xs text-slate-500 pt-2">
        Daily Rhythm v1.0 · 自律给我自由
      </div>
    </div>
  );
}
