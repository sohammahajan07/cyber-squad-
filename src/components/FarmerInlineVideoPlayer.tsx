import React, { useState, useEffect } from 'react';
import { Language } from '../types/market';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Download,
  Film,
  FileText,
  Music,
  TrendingUp,
  Truck,
  ShieldCheck,
  Award
} from 'lucide-react';
import { SLIDES, SlideContent } from './FarmerPresentationModal';
import { realisticAudio } from '../utils/audioEngine';
import { generateAndDownloadVideoWebM, downloadOfflinePresentationHTML, SlideExportData } from '../utils/videoExporter';

interface FarmerInlineVideoPlayerProps {
  currentLang: Language;
  onOpenModal?: () => void;
}

export const FarmerInlineVideoPlayer: React.FC<FarmerInlineVideoPlayerProps> = ({
  currentLang,
  onOpenModal
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isAmbientScoreOn, setIsAmbientScoreOn] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [elapsedTotalSec, setElapsedTotalSec] = useState<number>(0);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Video download state
  const [isExportingVideo, setIsExportingVideo] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<number>(0);
  const [exportStatusText, setExportStatusText] = useState<string>('');

  const activeSlide: SlideContent = SLIDES[currentSlideIndex];

  // Helper to trigger realistic voice narration in Hindi / selected language
  const triggerVoiceNarration = (slide: SlideContent, lang: Language, muted: boolean) => {
    if (muted) {
      realisticAudio.stopSpeaking();
      setIsSpeaking(false);
      return;
    }

    const textToSpeak = slide.narration[lang] || slide.narration.hi || slide.narration.en;
    realisticAudio.speakNarration(
      textToSpeak,
      lang === 'hi' ? 'hi' : lang === 'mr' ? 'mr' : 'en',
      playbackSpeed,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false),
      () => setIsSpeaking(false)
    );
  };

  useEffect(() => {
    if (isAmbientScoreOn && !isMuted && isPlaying) {
      realisticAudio.startAmbientAgritechScore();
    } else {
      realisticAudio.stopAmbientAgritechScore();
    }

    if (isPlaying) {
      triggerVoiceNarration(activeSlide, currentLang, isMuted);
    } else {
      realisticAudio.stopSpeaking();
    }

    const timer = setInterval(() => {
      if (!isPlaying) return;

      setElapsedTotalSec((prev) => {
        const next = prev + 1;
        if (next >= 120) {
          setIsPlaying(false);
          return 120;
        }

        const targetSlideIndex = Math.min(Math.floor(next / 20), SLIDES.length - 1);
        if (targetSlideIndex !== currentSlideIndex) {
          setCurrentSlideIndex(targetSlideIndex);
        }
        return next;
      });
    }, 1000 / playbackSpeed);

    return () => {
      clearInterval(timer);
      realisticAudio.stopSpeaking();
      realisticAudio.stopAmbientAgritechScore();
    };
  }, [isPlaying, currentSlideIndex, currentLang, isMuted, playbackSpeed, isAmbientScoreOn]);

  const handleSeek = (newTotalSec: number) => {
    const clamped = Math.max(0, Math.min(120, newTotalSec));
    setElapsedTotalSec(clamped);
    const targetSlide = Math.min(Math.floor(clamped / 20), SLIDES.length - 1);
    setCurrentSlideIndex(targetSlide);
    if (isPlaying) {
      triggerVoiceNarration(SLIDES[targetSlide], currentLang, isMuted);
    }
  };

  const handleSelectSlide = (index: number) => {
    setCurrentSlideIndex(index);
    setElapsedTotalSec(index * 20);
    if (isPlaying) {
      triggerVoiceNarration(SLIDES[index], currentLang, isMuted);
    }
  };

  const togglePlay = () => {
    if (!isPlaying && elapsedTotalSec >= 120) {
      setElapsedTotalSec(0);
      setCurrentSlideIndex(0);
    }
    const nextPlaying = !isPlaying;
    setIsPlaying(nextPlaying);
    if (!nextPlaying) {
      realisticAudio.stopSpeaking();
    } else {
      triggerVoiceNarration(activeSlide, currentLang, isMuted);
    }
  };

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    if (newMuted) {
      realisticAudio.stopSpeaking();
      realisticAudio.stopAmbientAgritechScore();
      setIsSpeaking(false);
    } else {
      if (isAmbientScoreOn) realisticAudio.startAmbientAgritechScore();
      triggerVoiceNarration(activeSlide, currentLang, false);
    }
  };

  const toggleAmbientScore = () => {
    const nextScore = !isAmbientScoreOn;
    setIsAmbientScoreOn(nextScore);
    if (nextScore && !isMuted) {
      realisticAudio.startAmbientAgritechScore();
    } else {
      realisticAudio.stopAmbientAgritechScore();
    }
  };

  const handleRestart = () => {
    setElapsedTotalSec(0);
    setCurrentSlideIndex(0);
    setIsPlaying(true);
    triggerVoiceNarration(SLIDES[0], currentLang, isMuted);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const getExportData = (): SlideExportData[] => {
    return SLIDES.map((s) => ({
      id: s.id,
      timeRange: s.timeRange,
      badge: s.badge[currentLang] || s.badge.hi || s.badge.en,
      title: s.title[currentLang] || s.title.hi || s.title.en,
      subtitle: s.subtitle[currentLang] || s.subtitle.hi || s.subtitle.en,
      narration: s.narration[currentLang] || s.narration.hi || s.narration.en,
      highlights: s.highlights.map((h) => ({
        label: h.label[currentLang] || h.label.hi || h.label.en,
        desc: h.desc[currentLang] || h.desc.hi || h.desc.en,
        stat: h.stat
      })),
      caseStudy: s.caseStudy
    }));
  };

  const handleDownloadVideoWebM = async () => {
    setIsExportingVideo(true);
    setExportProgress(10);
    setExportStatusText(
      currentLang === 'hi'
        ? 'एचडी वीडियो (1280x720) और यथार्थवादी हिंदी आवाज़ तैयार की जा रही है...'
        : 'Rendering HD video (1280x720) with realistic Hindi voice...'
    );

    try {
      const exportData = getExportData();
      await generateAndDownloadVideoWebM(exportData, currentLang, (pct, status) => {
        setExportProgress(pct);
        setExportStatusText(status);
      });
      setTimeout(() => {
        setIsExportingVideo(false);
      }, 1500);
    } catch (err) {
      console.error('Video generation error:', err);
      downloadOfflinePresentationHTML(getExportData(), currentLang);
      setTimeout(() => {
        setIsExportingVideo(false);
      }, 1500);
    }
  };

  const handleDownloadOfflineHTML = () => {
    downloadOfflinePresentationHTML(getExportData(), currentLang);
  };

  return (
    <div className="bg-stone-900 border border-stone-800 text-white rounded-2xl shadow-xl overflow-hidden flex flex-col mb-6">
      
      {/* Top Video Header Bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-stone-800 bg-stone-950/90 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <span className="flex h-3 w-3 relative">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isPlaying ? 'bg-emerald-400 opacity-75' : 'bg-amber-400 opacity-40'}`}></span>
            <span className={`relative inline-flex rounded-full h-3 w-3 ${isPlaying ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
          </span>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2 flex-wrap">
              <span>{currentLang === 'hi' ? 'किसान २-मिनट वीडियो प्लेयर (स्वाभाविक हिंदी आवाज़)' : currentLang === 'mr' ? 'शेतकरी २-मिनिटे व्हिडिओ प्लेयर (आवाजासह)' : 'Farmer Express 2-Minute Video Player'}</span>
              <span className="text-[11px] font-semibold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                2:00 MIN HD
              </span>
              <span className="text-[11px] font-semibold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1">
                <span>🎙️</span>
                <span>{currentLang === 'hi' ? 'हिंदी वॉयस एक्टिव' : 'Realistic Hindi Voice'}</span>
              </span>
            </h2>
            <p className="text-xs text-stone-400">
              {currentLang === 'hi'
                ? '७-दिन भाव भविष्यवाणी · शेयरिंग ट्रांसपोर्ट से ४५% बचत · किसान गोपनीयता · डिजिटल APMC गेट पास'
                : 'AI 7-Day Forecast · 45% Shared Transport Savings · Farmer Privacy · Digital Gate Pass'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Download Video (.webm) button */}
          <button
            onClick={handleDownloadVideoWebM}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition shadow-sm cursor-pointer"
            title="Download 2-minute video file (.webm)"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{currentLang === 'hi' ? 'वीडियो डाउनलोड (.webm)' : 'Download Video'}</span>
          </button>

          {/* Download offline HTML player */}
          <button
            onClick={handleDownloadOfflineHTML}
            className="hidden sm:flex items-center gap-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs px-2.5 py-1.5 rounded-xl transition cursor-pointer"
            title="Download standalone offline video app HTML"
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>HTML App</span>
          </button>

          {/* Expand to cinema modal if available */}
          {onOpenModal && (
            <button
              onClick={onOpenModal}
              className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition cursor-pointer"
              title="Open full cinema mode"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Video Player Display Screen */}
      <div className="relative bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 p-4 sm:p-6">
        
        {/* Slide Stage Card */}
        <div className="bg-stone-800/85 border border-stone-700/60 rounded-xl p-5 sm:p-7 shadow-xl relative overflow-hidden backdrop-blur-sm">
          
          {/* Top Badge & Slide Tracker */}
          <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-wider uppercase px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {activeSlide.badge[currentLang] || activeSlide.badge.hi || activeSlide.badge.en}
              </span>
              <span className="text-xs text-stone-400 font-mono">
                Slide {activeSlide.id} of {SLIDES.length} ({activeSlide.timeRange})
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              {SLIDES.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => handleSelectSlide(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    idx === currentSlideIndex
                      ? 'w-7 bg-emerald-500'
                      : idx < currentSlideIndex
                      ? 'w-3 bg-stone-500'
                      : 'w-2 bg-stone-700 hover:bg-stone-600'
                  }`}
                  title={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Slide Title & Subtitle */}
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-snug mb-2">
            {activeSlide.title[currentLang] || activeSlide.title.hi || activeSlide.title.en}
          </h1>
          <p className="text-sm sm:text-base text-stone-300 mb-5 leading-relaxed max-w-4xl">
            {activeSlide.subtitle[currentLang] || activeSlide.subtitle.hi || activeSlide.subtitle.en}
          </p>

          {/* 3 Strategic Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mb-5">
            {activeSlide.highlights.map((h, i) => (
              <div
                key={i}
                className="bg-stone-900/90 border border-stone-700/50 p-4 rounded-xl flex flex-col justify-between hover:border-emerald-500/50 transition group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-stone-300">
                    {h.label[currentLang] || h.label.hi || h.label.en}
                  </span>
                  {h.stat && (
                    <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800">
                      {h.stat}
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-stone-200 font-medium">
                  {h.desc[currentLang] || h.desc.hi || h.desc.en}
                </p>
              </div>
            ))}
          </div>

          {/* Real Case Study / Field Calculation Box */}
          {activeSlide.caseStudy && (
            <div className="bg-emerald-950/40 border border-emerald-600/40 rounded-xl p-4 sm:p-5 mb-5">
              <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                    {currentLang === 'hi' ? 'वास्तविक किसान परिणाम (केस स्टडी)' : currentLang === 'mr' ? 'प्रत्यक्ष शेतकरी अनुभव (केस स्टडी)' : 'Verified Field Impact / Real Farmer Case Study'}
                  </span>
                </div>
                <span className="text-xs font-medium text-stone-300">
                  {activeSlide.caseStudy.farmer} · {activeSlide.caseStudy.crop}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm mt-3 pt-3 border-t border-emerald-800/40">
                <div className="bg-stone-900/60 p-2.5 rounded-lg border border-red-900/30">
                  <span className="block text-[11px] text-red-400 font-semibold mb-1">
                    {currentLang === 'hi' ? 'पारंपरिक पुराना तरीका' : currentLang === 'mr' ? 'जुनी पद्धत' : 'Traditional Way'}
                  </span>
                  <span className="text-stone-300">{activeSlide.caseStudy.oldWay}</span>
                </div>
                <div className="bg-stone-900/60 p-2.5 rounded-lg border border-emerald-900/40">
                  <span className="block text-[11px] text-emerald-400 font-semibold mb-1">
                    {currentLang === 'hi' ? 'कृषि बंधु के साथ' : currentLang === 'mr' ? 'कृषी बंधू वापरून' : 'With Krishi Bandhu'}
                  </span>
                  <span className="text-stone-200">{activeSlide.caseStudy.newWay}</span>
                </div>
                <div className="bg-emerald-900/50 p-2.5 rounded-lg border border-emerald-500/50 flex flex-col justify-center">
                  <span className="block text-[11px] text-emerald-300 font-bold mb-1">
                    {currentLang === 'hi' ? 'शुद्ध अतिरिक्त बचत / मुनाफा' : currentLang === 'mr' ? 'निव्वळ जादा नफा' : 'Direct Extra Benefit'}
                  </span>
                  <span className="font-extrabold text-white text-sm">
                    {activeSlide.caseStudy.benefit}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Video Subtitle & Voice Narration Caption */}
          <div className="bg-stone-950/90 border border-stone-800 p-3.5 sm:p-4 rounded-xl flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
              <Volume2 className={`w-4 h-4 ${isSpeaking ? 'animate-pulse text-emerald-400' : 'text-stone-400'}`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                    {currentLang === 'hi' ? 'यथार्थवादी हिंदी वॉयस कमेंट्री' : currentLang === 'mr' ? 'मराठी / हिंदी ऑडिओ संवाद' : 'Realistic Voice Narration'}
                  </span>
                  <span className="text-[10px] bg-stone-800 text-stone-300 px-2 py-0.5 rounded-full border border-stone-700">
                    {isSpeaking ? (currentLang === 'hi' ? 'आवाज़ सक्रिय 🎙️' : 'Voice Active 🎙️') : 'Natural Indian Cadence'}
                  </span>
                </div>
                <button
                  onClick={() => triggerVoiceNarration(activeSlide, currentLang, false)}
                  className="text-[10px] text-amber-300 hover:text-amber-200 underline cursor-pointer"
                >
                  {currentLang === 'hi' ? 'पुनः सुनें (Replay Voice)' : 'Replay Voice'}
                </button>
              </div>
              <p className="text-xs sm:text-sm text-stone-200 italic leading-relaxed">
                "{activeSlide.narration[currentLang] || activeSlide.narration.hi || activeSlide.narration.en}"
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* Video Scrubber & Playback Controls Bar */}
      <div className="bg-stone-950 border-t border-stone-800 px-4 sm:px-6 py-3.5">
        
        {/* Progress Timeline Scrubber */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs font-mono text-stone-400 mb-1.5">
            <span>{formatTime(elapsedTotalSec)}</span>
            <span className="text-stone-500">
              {currentLang === 'hi' ? 'कुल वीडियो अवधि: २:०० मिनट' : currentLang === 'mr' ? 'एकूण वेळ: २:०० मिनिटे' : 'Duration: 2:00 Total'}
            </span>
            <span>2:00</span>
          </div>
          
          {/* Interactive Timeline Bar with 6 Slide Markers */}
          <div
            className="relative w-full h-3 bg-stone-800 rounded-full cursor-pointer overflow-hidden group"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const ratio = clickX / rect.width;
              handleSeek(Math.floor(ratio * 120));
            }}
          >
            <div
              className="h-full bg-emerald-500 transition-all duration-300 relative"
              style={{ width: `${(elapsedTotalSec / 120) * 100}%` }}
            />
            {[20, 40, 60, 80, 100].map((sec) => (
              <div
                key={sec}
                className="absolute top-0 bottom-0 w-0.5 bg-stone-900/80 z-10"
                style={{ left: `${(sec / 120) * 100}%` }}
              />
            ))}
          </div>
        </div>

        {/* Bottom Button Toolbar */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          
          {/* Left Controls: Play/Pause, Rewind, Next Slide */}
          <div className="flex items-center gap-2">
            <button
              onClick={togglePlay}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm px-4 py-2 rounded-xl transition shadow-md active:scale-95 cursor-pointer"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-white" />
                  <span>{currentLang === 'hi' ? 'रोकें (Pause)' : currentLang === 'mr' ? 'थांबवा' : 'Pause'}</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>{currentLang === 'hi' ? 'चलाएं (Play)' : currentLang === 'mr' ? 'सुरू करा' : 'Play'}</span>
                </>
              )}
            </button>

            <button
              onClick={handleRestart}
              className="p-2 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition cursor-pointer"
              title="Restart from beginning"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <div className="h-5 w-px bg-stone-800 mx-1" />

            <button
              onClick={() => {
                if (currentSlideIndex > 0) handleSelectSlide(currentSlideIndex - 1);
              }}
              disabled={currentSlideIndex === 0}
              className="p-2 text-stone-400 hover:text-white disabled:opacity-30 rounded-lg hover:bg-stone-800 transition cursor-pointer"
              title="Previous slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-xs text-stone-400 font-medium px-1">
              {currentSlideIndex + 1} / {SLIDES.length}
            </span>

            <button
              onClick={() => {
                if (currentSlideIndex < SLIDES.length - 1) handleSelectSlide(currentSlideIndex + 1);
              }}
              disabled={currentSlideIndex === SLIDES.length - 1}
              className="p-2 text-stone-400 hover:text-white disabled:opacity-30 rounded-lg hover:bg-stone-800 transition cursor-pointer"
              title="Next slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Right Controls: Voice Mute, Ambient Score, Speed, Download Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Voice Mute Toggle */}
            <button
              onClick={toggleMute}
              className={`p-2 rounded-lg transition cursor-pointer flex items-center gap-1.5 text-xs ${
                isMuted ? 'text-stone-500 hover:text-stone-300' : 'text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 border border-emerald-800/40'
              }`}
              title={isMuted ? 'Unmute voice' : 'Mute voice'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{isMuted ? 'Muted' : 'हिंदी स्वर'}</span>
            </button>

            {/* Ambient Score (Tanpura / Indian Music) Toggle */}
            <button
              onClick={toggleAmbientScore}
              className={`p-2 rounded-lg transition cursor-pointer flex items-center gap-1 text-xs ${
                isAmbientScoreOn && !isMuted
                  ? 'text-amber-400 bg-amber-950/40 border border-amber-800/40'
                  : 'text-stone-500 hover:text-stone-300'
              }`}
              title="Toggle gentle acoustic Indian background soundtrack"
            >
              <Music className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{currentLang === 'hi' ? 'संगीत' : 'Score'}</span>
            </button>

            {/* Speed selector */}
            <div className="flex items-center gap-1 bg-stone-900 border border-stone-800 p-0.5 rounded-lg text-[11px]">
              {[1, 1.25, 1.5].map((speed) => (
                <button
                  key={speed}
                  onClick={() => setPlaybackSpeed(speed)}
                  className={`px-1.5 py-0.5 rounded cursor-pointer ${
                    playbackSpeed === speed ? 'bg-stone-700 text-white font-bold' : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>

            {/* Main Download Video (.webm) */}
            <button
              onClick={handleDownloadVideoWebM}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-2 rounded-xl transition shadow-md cursor-pointer"
              title="Download 2-minute playable video file (.webm)"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{currentLang === 'hi' ? 'वीडियो डाउनलोड (.webm)' : 'Download Video'}</span>
            </button>

            {/* Download Offline HTML Video Player */}
            <button
              onClick={handleDownloadOfflineHTML}
              className="hidden sm:flex items-center gap-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs px-2.5 py-2 rounded-xl transition cursor-pointer"
              title="Download offline interactive presentation player HTML"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>HTML / App</span>
            </button>

            {/* Print / PDF */}
            <button
              onClick={() => window.print()}
              className="p-2 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition cursor-pointer"
              title="Print slides / Save as PDF"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

      {/* Video Generation Progress Modal Overlay */}
      {isExportingVideo && (
        <div className="p-4 bg-stone-950 border-t border-emerald-500/40 text-center space-y-2">
          <div className="flex items-center justify-between text-xs text-emerald-400 font-bold">
            <span className="flex items-center gap-1.5">
              <Film className="w-4 h-4 animate-pulse" />
              <span>{exportStatusText}</span>
            </span>
            <span>{exportProgress}%</span>
          </div>
          <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-amber-500 h-full transition-all duration-200"
              style={{ width: `${exportProgress}%` }}
            />
          </div>
        </div>
      )}

    </div>
  );
};
