import { useEffect, useState, useRef } from 'react';
import { Clock, Calendar, Check, SkipForward, Coffee, Moon, Sun, Heart, Play, X, Sparkles, Volume2, Upload, Plus, Settings } from 'lucide-react';
import { useStore } from './store';
import { formatDate, formatTime, getTaskStatus, timeToMinutes, currentTimeToMinutes } from './utils';
import { TaskIcon } from './IconRenderer';
import { motivationalVideos, getVideoById } from './motivationalVideos';
import { getRandomCheerImage } from './cheerImages';
import { playAzureCheerText, initTTSService } from './azureTTS';

// 语音合成工具函数
function speakText(text: string, starName: string) {
  if ('speechSynthesis' in window) {
    // 取消之前的语音
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // 根据明星选择不同的语音设置
    if (starName === '赵露思') {
      // 赵露思 - 甜美温柔风格
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 1.0;
    } else {
      // 李宏毅 - 温柔男孩风格
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
    }
    
    // 选择中文语音
    const voices = window.speechSynthesis.getVoices();
    const chineseVoice = voices.find(voice => 
      voice.lang.includes('zh') || voice.lang.includes('CN')
    );
    if (chineseVoice) {
      utterance.voice = chineseVoice;
    }
    
    window.speechSynthesis.speak(utterance);
  }
}

export function HomePage() {
  const { tasks, completions, markCompleted, markSkipped, settings, customCheerImages, addCheerImage, customCheerAudios, addCheerAudio, customVideos } = useStore();
  const [now, setNow] = useState(new Date());
  const [showMotivational, setShowMotivational] = useState(false);
  const [showCheerCard, setShowCheerCard] = useState(false);
  const [cheerCardImage, setCheerCardImage] = useState<string | null>(null);
  const [cheerStarName, setCheerStarName] = useState('');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAudioModal, setShowAudioModal] = useState(false);
  const [uploadStarName, setUploadStarName] = useState('赵露思');
  const [audioStarName, setAudioStarName] = useState('赵露思');
  const [audioError, setAudioError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  
  // 初始化TTS服务
  useEffect(() => {
    // 从localStorage获取Azure配置
    const azureKey = localStorage.getItem('azure-tts-key');
    const azureRegion = localStorage.getItem('azure-tts-region');
    
    if (azureKey && azureRegion) {
      initTTSService(azureKey, azureRegion);
    }
  }, []);
  
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  
  const enabledTasks = tasks.filter((t) => t.enabled);
  
  const currentTask = enabledTasks.find((t) => {
    const status = getTaskStatus(t.startTime, t.duration);
    return status === 'current';
  });
  
  const nextTask = enabledTasks
    .filter((t) => getTaskStatus(t.startTime, t.duration) === 'future')
    .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime))[0];
  
  const isCurrentCompleted = currentTask && completions.some(
    (c) => c.date === today && c.taskId === currentTask.id && c.completed
  );
  
  const getRemainingMinutes = () => {
    if (!currentTask) return 0;
    const endMin = timeToMinutes(currentTask.startTime) + currentTask.duration;
    return Math.max(0, endMin - currentTimeToMinutes());
  };
  
  const getMinutesUntilNext = () => {
    if (!nextTask) return 0;
    return timeToMinutes(nextTask.startTime) - currentTimeToMinutes();
  };
  
  const getGreeting = () => {
    const hour = now.getHours();
    if (hour < 6) return { text: '夜深了', icon: Moon };
    if (hour < 12) return { text: '早上好', icon: Sun };
    if (hour < 18) return { text: '下午好', icon: Sun };
    return { text: '晚上好', icon: Moon };
  };
  
  const greeting = getGreeting();
  const GreetingIcon = greeting.icon;

  // 随机抽卡生成应援图
  const handleRandomDraw = async () => {
    setIsDrawing(true);
    // 从store获取应援图列表
    const { customCheerImages: images } = useStore.getState();
    
    // 随机选择一张图片
    let randomImage;
    if (images.length > 0) {
      randomImage = images[Math.floor(Math.random() * images.length)];
    } else {
      // 如果没有上传图片，使用默认逻辑
      randomImage = getRandomCheerImage();
    }
    
    setCheerStarName(randomImage.starName);

    try {
      // 加载图片
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = randomImage.imageUrl;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        setTimeout(resolve, 2000); // 超时处理
      });

      // 创建Canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Canvas context not available');
      }

      // 设置Canvas尺寸
      canvas.width = 600;
      canvas.height = 800;

      // 绘制背景
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 绘制图片
      const imgAspect = img.width / img.height;
      const canvasAspect = canvas.width / (canvas.height - 200);
      
      let drawWidth, drawHeight, drawX, drawY;
      
      if (imgAspect > canvasAspect) {
        drawHeight = canvas.height - 200;
        drawWidth = drawHeight * imgAspect;
        drawX = (canvas.width - drawWidth) / 2;
        drawY = 0;
      } else {
        drawWidth = canvas.width;
        drawHeight = drawWidth / imgAspect;
        drawX = 0;
        drawY = (canvas.height - 200 - drawHeight) / 2;
      }

      // 绘制渐变遮罩
      const gradient = ctx.createLinearGradient(0, canvas.height - 300, 0, canvas.height);
      gradient.addColorStop(0, 'rgba(26, 26, 46, 0)');
      gradient.addColorStop(1, 'rgba(26, 26, 46, 1)');
      
      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 绘制文字
      ctx.textAlign = 'center';
      
      // 绘制明星名字
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 48px sans-serif';
      ctx.fillText(randomImage.starName, canvas.width / 2, canvas.height - 150);

      // 绘制应援文字
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px sans-serif';
      ctx.fillText('小鸥，加油', canvas.width / 2, canvas.height - 90);
      ctx.fillText('我知道你可以的', canvas.width / 2, canvas.height - 45);

      // 绘制装饰边框
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 4;
      ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
      ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

      // 生成图片URL
      const dataUrl = canvas.toDataURL('image/png');
      setCheerCardImage(dataUrl);
      setShowCheerCard(true);
      
      // 播放应援音频（优先使用自定义音频）
      setTimeout(async () => {
        setAudioError(null);
        setIsPlayingAudio(true);
        
        // 优先尝试自定义音频
        const hasCustomAudio = playCustomAudio(randomImage.starName);
        
        if (!hasCustomAudio) {
          // 没有自定义音频，尝试Azure TTS
          try {
            await playAzureCheerText('', randomImage.starName);
          } catch (error) {
            console.error('Azure TTS播放失败，回退到浏览器TTS:', error);
            // 回退到浏览器TTS
            const audioText = `${randomImage.starName}对你说：${randomImage.starName === '赵露思' ? '小鸥加油我相信你可以的' : '小鸥加油你知道你可以的'}`;
            speakText(audioText, randomImage.starName);
          }
        }
      }, 500);
    } catch (error) {
      console.error('Error generating cheer card:', error);
      // 如果图片加载失败，使用默认应援卡
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = 600;
        canvas.height = 800;
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.textAlign = 'center';
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 48px sans-serif';
        ctx.fillText(randomImage.starName, canvas.width / 2, 400);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 36px sans-serif';
        ctx.fillText('小鸥，加油', canvas.width / 2, 450);
        ctx.fillText('我知道你可以的', canvas.width / 2, 500);
        
        const dataUrl = canvas.toDataURL('image/png');
        setCheerCardImage(dataUrl);
        setShowCheerCard(true);
        
        // 播放应援音频
        setTimeout(async () => {
          setAudioError(null);
          try {
            await playAzureCheerText('', randomImage.starName);
            setIsPlayingAudio(true);
          } catch (error) {
            console.error('Azure TTS播放失败，回退到浏览器TTS:', error);
            const audioText = `${randomImage.starName}对你说：小鸥加油你知道你可以的`;
            speakText(audioText, randomImage.starName);
            setIsPlayingAudio(true);
          }
        }, 500);
      }
    }
    
    setIsDrawing(false);
  };
  
  // 处理图片上传
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      alert('请上传图片文件！');
      return;
    }
    
    // 验证文件大小（最大10MB）
    if (file.size > 10 * 1024 * 1024) {
      alert('图片大小不能超过10MB！');
      return;
    }
    
    // 使用Canvas压缩图片
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // 压缩图片
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          alert('图片处理失败！');
          return;
        }
        
        // 设置最大尺寸
        const maxWidth = 800;
        const maxHeight = 1000;
        let width = img.width;
        let height = img.height;
        
        // 按比例缩放
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
        
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        
        // 转换为Base64（质量80%）
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        
        // 添加到store
        addCheerImage({
          starName: uploadStarName,
          imageUrl: compressedDataUrl,
        });
        
        alert(`${uploadStarName}的照片已上传成功！`);
        setShowUploadModal(false);
        
        // 清空input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };
  
  // 处理音频上传
  const handleAudioUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // 验证文件类型
    if (!file.type.startsWith('audio/')) {
      alert('请上传音频文件！');
      return;
    }
    
    // 验证文件大小（最大5MB）
    if (file.size > 5 * 1024 * 1024) {
      alert('音频文件大小不能超过5MB！');
      return;
    }
    
    // 读取文件并转换为Base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const audioUrl = e.target?.result as string;
      
      // 添加到store
      addCheerAudio({
        starName: audioStarName,
        audioUrl: audioUrl,
      });
      
      alert(`${audioStarName}的应援音频已上传成功！`);
      setShowAudioModal(false);
      
      // 清空input
      if (audioInputRef.current) {
        audioInputRef.current.value = '';
      }
    };
    reader.readAsDataURL(file);
  };
  
  // 播放自定义音频
  const playCustomAudio = (starName: string) => {
    const audios = useStore.getState().customCheerAudios;
    const audioForStar = audios.filter(a => a.starName === starName);
    
    if (audioForStar.length === 0) {
      // 没有自定义音频，回退到其他方式
      return false;
    }
    
    // 随机选择一个
    const randomAudio = audioForStar[Math.floor(Math.random() * audioForStar.length)];
    
    // 创建音频元素并播放
    const audio = new Audio(randomAudio.audioUrl);
    audio.play().catch(error => {
      console.error('音频播放失败:', error);
      return false;
    });
    
    return true;
  };

  // 视频选择辅助函数
  const getCurrentVideoUrl = (): string => {
    const currentId = settings.favoriteStar;
    
    // 先查找自定义视频
    const custom = customVideos.find(v => v.id === currentId);
    if (custom) return custom.url;
    
    // 如果没有自定义视频，返回空或提示
    return '';
  };
  
  const getCurrentVideoName = (): string => {
    const currentId = settings.favoriteStar;
    
    const custom = customVideos.find(v => v.id === currentId);
    if (custom) return custom.name;
    
    return '请先添加视频';
  };
  
  const getCurrentVideoDesc = (): string => {
    const currentId = settings.favoriteStar;
    
    const custom = customVideos.find(v => v.id === currentId);
    if (custom) return custom.description;
    
    return '在设置中添加你喜欢的视频';
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center pt-4">
        <div className="flex items-center justify-center gap-2 text-slate-400 text-sm mb-1">
          <GreetingIcon className="w-4 h-4" />
          <span>{greeting.text}</span>
        </div>
        <div className="text-5xl font-bold text-white tracking-tight font-mono">
          {formatTime(now)}
        </div>
        <div className="flex items-center justify-center gap-1.5 text-slate-400 text-sm mt-1">
          <Calendar className="w-3.5 h-3.5" />
          <span>{formatDate(now)}</span>
        </div>
      </div>
      
      {currentTask && !isCurrentCompleted ? (
        <div className="rounded-2xl p-6 border-2 border-sky-500/50 bg-gradient-to-br from-sky-500/10 to-blue-600/5 shadow-2xl shadow-sky-500/20 animate-pulse-slow">
          <div className="flex items-center gap-2 text-sky-400 text-xs font-medium mb-3">
            <Clock className="w-3.5 h-3.5" />
            <span>现在该做</span>
            <span className="ml-auto text-slate-400">剩余 {getRemainingMinutes()} 分钟</span>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: currentTask.color + '30' }}>
              <TaskIcon name={currentTask.icon} className="w-7 h-7" style={{ color: currentTask.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold text-white mb-1">{currentTask.name}</h2>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <span className="px-2 py-0.5 rounded bg-slate-700/50">{currentTask.category}</span>
                <span>{currentTask.startTime} · {currentTask.duration} 分钟</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 mt-5">
            <button onClick={() => markCompleted(currentTask.id)} className="flex-1 bg-sky-500 hover:bg-sky-600 text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
              <Check className="w-4 h-4" />
              完成
            </button>
            <button onClick={() => markSkipped(currentTask.id)} className="px-4 bg-slate-700/50 hover:bg-slate-700 text-slate-300 font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
              <SkipForward className="w-4 h-4" />
              跳过
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl p-8 border border-slate-700 bg-slate-800/50 text-center">
          {currentTask && isCurrentCompleted ? (
            <>
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center mb-3">
                <Check className="w-8 h-8 text-emerald-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-1">做得很棒！</h2>
              <p className="text-slate-400 text-sm">已完成「{currentTask.name}」</p>
            </>
          ) : nextTask ? (
            <>
              <div className="w-16 h-16 mx-auto rounded-full bg-slate-700 flex items-center justify-center mb-3">
                <Coffee className="w-8 h-8 text-slate-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-1">休息一下</h2>
              <p className="text-slate-400 text-sm">
                {getMinutesUntilNext()} 分钟后开始「{nextTask.name}」
              </p>
              <p className="text-xs text-slate-500 mt-2">预计 {nextTask.startTime} 开始</p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 mx-auto rounded-full bg-slate-700 flex items-center justify-center mb-3">
                <Moon className="w-8 h-8 text-slate-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-1">今天结束了</h2>
              <p className="text-slate-400 text-sm">好好休息，明天继续</p>
            </>
          )}
        </div>
      )}
      
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
          <div className="text-2xl font-bold text-emerald-400">
            {completions.filter((c) => c.date === today && c.completed).length}
          </div>
          <div className="text-xs text-slate-400 mt-1">已完成</div>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
          <div className="text-2xl font-bold text-slate-400">
            {completions.filter((c) => c.date === today && c.skipped).length}
          </div>
          <div className="text-xs text-slate-400 mt-1">已跳过</div>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
          <div className="text-2xl font-bold text-sky-400">
            {enabledTasks.length}
          </div>
          <div className="text-xs text-slate-400 mt-1">总任务</div>
        </div>
      </div>

      <button
        onClick={() => setShowMotivational(true)}
        className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-pink-500/30 transition-all transform hover:scale-105 flex items-center justify-center gap-3"
      >
        <Heart className="w-6 h-6 animate-pulse" />
        <span className="text-lg">鼓励一下</span>
      </button>

      <button
        onClick={handleRandomDraw}
        disabled={isDrawing}
        className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-amber-500/30 transition-all transform hover:scale-105 flex items-center justify-center gap-3"
      >
        <Sparkles className={`w-6 h-6 ${isDrawing ? 'animate-spin' : ''}`} />
        <span className="text-lg">{isDrawing ? '抽卡中...' : '随机抽卡'}</span>
      </button>

      <button
        onClick={() => setShowUploadModal(true)}
        className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-green-500/30 transition-all transform hover:scale-105 flex items-center justify-center gap-3"
      >
        <Upload className="w-6 h-6" />
        <span className="text-lg">上传应援图</span>
      </button>

      <button
        onClick={() => setShowAudioModal(true)}
        className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/30 transition-all transform hover:scale-105 flex items-center justify-center gap-3"
      >
        <Volume2 className="w-6 h-6" />
        <span className="text-lg">上传应援音频</span>
      </button>

      {/* 视频选择辅助函数 */}
      {(() => {
        return null;
      })()}

      {showMotivational && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-700">
              <h2 className="text-xl font-bold text-white">鼓励视频</h2>
              <button
                onClick={() => setShowMotivational(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-4">
              {customVideos.length > 0 ? (
                <>
                  <div className="aspect-video bg-black rounded-xl overflow-hidden mb-4">
                    <iframe
                      src={getCurrentVideoUrl()}
                      className="w-full h-full"
                      frameBorder="0"
                      allowFullScreen
                      title="激励视频"
                    />
                  </div>

                  <div className="text-center mb-4">
                    <h3 className="text-lg font-bold text-white">
                      {getCurrentVideoName()}
                    </h3>
                    <p className="text-sm text-slate-400 mt-1">
                      {getCurrentVideoDesc()}
                    </p>
                  </div>
                </>
              ) : (
                <div className="aspect-video bg-slate-700/50 rounded-xl flex items-center justify-center mb-4">
                  <div className="text-center text-slate-400">
                    <Heart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">请先在「设置」页面</p>
                    <p className="text-sm">添加你喜欢的视频</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                {customVideos.length > 0 ? (
                  customVideos.map((video) => (
                    <button
                      key={video.id}
                      onClick={() => {
                        useStore.getState().updateSettings({ favoriteStar: video.id });
                      }}
                      className={`p-2 rounded-xl border transition-all ${
                        settings.favoriteStar === video.id
                          ? 'bg-pink-500/20 border-pink-500 text-pink-300'
                          : 'bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <div className="text-xs font-medium line-clamp-2">{video.name}</div>
                    </button>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-4 text-slate-500 text-sm">
                    还没有添加视频<br />
                    请在「设置」页面添加视频
                  </div>
                )}
              </div>

              <p className="text-xs text-slate-500 text-center mt-4">
                💡 在「设置」页面可以添加自定义视频
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 随机抽卡应援图弹窗 */}
      {showCheerCard && cheerCardImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-700">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h2 className="text-lg font-bold text-white">随机抽卡</h2>
              </div>
              <button
                onClick={() => {
                  setShowCheerCard(false);
                  setCheerCardImage(null);
                  // 停止语音
                  if ('speechSynthesis' in window) {
                    window.speechSynthesis.cancel();
                  }
                  setIsPlayingAudio(false);
                }}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-4">
              <div className="rounded-xl overflow-hidden shadow-2xl shadow-amber-500/30 mb-4">
                <img
                  src={cheerCardImage}
                  alt="应援图"
                  className="w-full h-auto"
                />
              </div>

              <div className="text-center mb-4">
                <p className="text-2xl font-bold text-amber-400 mb-1">
                  {cheerStarName} 为你加油 💪
                </p>
                <p className="text-sm text-slate-400">
                  小鸥，加油，我知道你可以的！
                </p>
                {audioError && (
                  <p className="text-xs text-red-400 mt-1">
                    {audioError}
                  </p>
                )}
              </div>

              <button
                onClick={() => {
                  setAudioError(null);
                  setIsPlayingAudio(true);
                  
                  // 优先尝试自定义音频
                  const hasCustomAudio = playCustomAudio(cheerStarName);
                  
                  if (!hasCustomAudio) {
                    // 没有自定义音频，尝试Azure TTS
                    playAzureCheerText('', cheerStarName).catch(() => {
                      // 回退到浏览器TTS
                      const audioText = `${cheerStarName}对你说：小鸥加油你知道你可以的`;
                      speakText(audioText, cheerStarName);
                    });
                  }
                }}
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all mb-3"
              >
                <Volume2 className={`w-5 h-5 ${isPlayingAudio ? 'animate-pulse' : ''}`} />
                <span>听{cheerStarName}为你加油</span>
              </button>

              <button
                onClick={handleRandomDraw}
                disabled={isDrawing}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                <Sparkles className={`w-5 h-5 ${isDrawing ? 'animate-spin' : ''}`} />
                <span>{isDrawing ? '抽卡中...' : '再抽一张'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 上传应援图弹窗 */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-700">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-green-400" />
                <h2 className="text-lg font-bold text-white">上传应援图</h2>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  选择明星
                </label>
                <select
                  value={uploadStarName}
                  onChange={(e) => setUploadStarName(e.target.value)}
                  className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="赵露思">赵露思</option>
                  <option value="李宏毅">李宏毅</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  上传照片
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center cursor-pointer hover:border-green-500 transition-colors"
                >
                  <Plus className="w-12 h-12 text-slate-500 mx-auto mb-2" />
                  <p className="text-slate-400 text-sm">
                    点击选择图片<br />
                    支持 JPG、PNG 格式，最大 10MB（会自动压缩）
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              {/* 显示已上传的图片 */}
              {customCheerImages.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-slate-300 mb-2">
                    已上传的照片 ({customCheerImages.length})
                  </p>
                  <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                    {customCheerImages.map((img) => (
                      <div key={img.id} className="relative group">
                        <img
                          src={img.imageUrl}
                          alt={img.starName}
                          className="w-full h-20 object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <span className="text-xs text-white">{img.starName}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4 text-xs text-slate-500 text-center">
                上传的照片会保存在本地，下次打开自动加载
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 上传应援音频弹窗 */}
      {showAudioModal && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-700">
              <div className="flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-blue-400" />
                <h2 className="text-lg font-bold text-white">上传应援音频</h2>
              </div>
              <button
                onClick={() => setShowAudioModal(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  选择明星
                </label>
                <select
                  value={audioStarName}
                  onChange={(e) => setAudioStarName(e.target.value)}
                  className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="赵露思">赵露思</option>
                  <option value="李宏毅">李宏毅</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  上传音频
                </label>
                <div
                  onClick={() => audioInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
                >
                  <Plus className="w-12 h-12 text-slate-500 mx-auto mb-2" />
                  <p className="text-slate-400 text-sm">
                    点击选择音频<br />
                    支持 MP3、WAV 格式，最大 5MB
                  </p>
                </div>
                <input
                  ref={audioInputRef}
                  type="file"
                  accept="audio/*"
                  onChange={handleAudioUpload}
                  className="hidden"
                />
              </div>

              {/* 显示已上传的音频 */}
              {customCheerAudios.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-slate-300 mb-2">
                    已上传的音频 ({customCheerAudios.length})
                  </p>
                  <div className="space-y-2">
                    {customCheerAudios.map((audio) => (
                      <div key={audio.id} className="flex items-center justify-between bg-slate-700/50 rounded-lg px-3 py-2">
                        <span className="text-sm text-white">{audio.starName}</span>
                        <span className="text-xs text-slate-400">音频文件</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4 text-xs text-slate-500 text-center">
                上传的音频会保存在本地，下次打开自动加载
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
