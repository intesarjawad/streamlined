"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { 
  Play, Pause, Volume2, VolumeX, 
  Settings, Maximize, SkipBack, SkipForward,
  ChevronUp, ChevronDown, Check, Gauge
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import YouTube from "react-youtube";
import type { YouTubeEvent, YouTubePlayer, Options } from 'react-youtube';

interface VideoPlayerProps {
  videoId: string;
  title: string;
  onEnded?: () => void;
}

const SECURE_PLAYER = process.env.NEXT_PUBLIC_SECURE_VIDEO_PLAYER === 'true';

export function VideoPlayer({ videoId, title, onEnded }: VideoPlayerProps) {
  const playerRef = useRef<YouTubePlayer>(null);
  const [player, setPlayer] = useState<YouTubePlayer | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(100);
  const [muted, setMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [quality, setQuality] = useState("auto");
  const [showControls, setShowControls] = useState(true);
  const [availableQualities, setAvailableQualities] = useState<string[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const [activeSettings, setActiveSettings] = useState<'speed' | 'quality' | null>(null);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (showControls) {
      timeout = setTimeout(() => {
        if (playing) {
          setShowControls(false);
        }
      }, 3000);
    }
    return () => clearTimeout(timeout);
  }, [showControls, playing]);

  useEffect(() => {
    if (!SECURE_PLAYER) return;

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const handleKeydown = (e: KeyboardEvent) => {
      if (
        e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
        (e.ctrlKey && e.key === 'U')
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeydown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeydown);
    };
  }, []);

  const PLAYBACK_SPEEDS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

  const handleReady = (event: YouTubeEvent) => {
    setPlayer(event.target);
    
    // Force load available qualities
    setTimeout(() => {
      const qualities = event.target.getAvailableQualityLevels();
      console.log('Available qualities:', qualities); // For debugging
      setAvailableQualities(qualities);
      
      // Set initial quality to highest available
      if (qualities.length > 0) {
        const bestQuality = qualities[0];
        setQuality(bestQuality);
        event.target.setPlaybackQuality(bestQuality);
      }
    }, 1000); // Give player time to initialize
  };

  const handleStateChange = (event: YouTubeEvent) => {
    const playerState = event.data;
    setPlaying(playerState === 1);
    if (playerState === 0) {
      onEnded?.();
    }
  };

  const handleProgress = () => {
    if (player) {
      setCurrentTime(player.getCurrentTime());
      setDuration(player.getDuration());
    }
  };

  useEffect(() => {
    const interval = setInterval(handleProgress, 1000);
    return () => clearInterval(interval);
  }, [player]);

  const togglePlay = () => {
    if (playing) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  };

  const handleVolumeChange = (value: number) => {
    setVolume(value);
    player.setVolume(value);
    setMuted(value === 0);
  };

  const toggleMute = () => {
    if (muted) {
      player.unMute();
      player.setVolume(volume);
    } else {
      player.mute();
    }
    setMuted(!muted);
  };

  const handleSeek = (value: number) => {
    const seekTime = (value * duration) / 100;
    player.seekTo(seekTime);
    setCurrentTime(seekTime);
  };

  const handlePlaybackRateChange = (rate: number) => {
    setPlaybackRate(rate);
    player.setPlaybackRate(rate);
  };

  const handleQualityChange = (newQuality: string) => {
    console.log('Setting quality to:', newQuality);
    setQuality(newQuality);
    
    if (player) {
      // Force quality change
      player.setPlaybackQuality(newQuality);
      
      // If current video time is available, reload video at current time with new quality
      const currentTime = player.getCurrentTime();
      player.loadVideoById({
        videoId,
        startSeconds: currentTime,
        suggestedQuality: newQuality
      });
    }
  };

  const skipForward = () => {
    const newTime = Math.min(currentTime + 10, duration);
    player.seekTo(newTime);
    setCurrentTime(newTime);
  };

  const skipBackward = () => {
    const newTime = Math.max(currentTime - 10, 0);
    player.seekTo(newTime);
    setCurrentTime(newTime);
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h > 0 ? `${h}:` : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const opts: Options = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 1,
      controls: 0,
      modestbranding: 1,
      rel: 0,
      showinfo: 0,
      iv_load_policy: 3,
      fs: 0,
      disablekb: 1,
      playsinline: 1,
      origin: window.location.origin,
      enablejsapi: 1,
      autohide: 1,
      cc_load_policy: 0,
      hl: 'en',
      color: 'white',
      endscreen: 0,
    },
    host: 'https://www.youtube-nocookie.com',
  };

  const handleFullscreen = () => {
    if (!playerContainerRef.current) return;
    
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      playerContainerRef.current.requestFullscreen();
    }
  };

  const qualityLabels: Record<string, string> = {
    auto: 'Auto',
    highres: '4K',
    hd2160: '4K',
    hd1440: '1440p',
    hd1080: '1080p',
    hd720: '720p',
    large: '480p',
    medium: '360p',
    small: '240p',
    tiny: '144p',
    default: 'Auto'
  };

  return (
    <div 
      ref={playerContainerRef}
      className="relative w-full h-full rounded-lg overflow-hidden"
      onMouseMove={() => setShowControls(true)}
      onMouseLeave={() => playing && setShowControls(false)}
    >
      {/* Protective overlay - Only render if SECURE_PLAYER is true */}
      {SECURE_PLAYER && (
        <div 
          className="absolute inset-0 z-10 pointer-events-auto"
          onClick={(e) => {
            if ((e.target as HTMLElement).closest('.video-controls')) {
              return;
            }
            e.preventDefault();
            e.stopPropagation();
            togglePlay();
          }}
        />
      )}

      {/* CSS styles - Only include security-related styles if SECURE_PLAYER is true */}
      <style jsx global>{`
        ${SECURE_PLAYER ? `
          .ytp-chrome-top,
          .ytp-show-cards-title,
          .ytp-watermark,
          .ytp-youtube-button,
          .ytp-embed,
          .ytp-pause-overlay,
          .ytp-chrome-top-buttons,
          .ytp-title-text,
          .ytp-title,
          .ytp-title-link,
          .ytp-share-button,
          .ytp-share-button-visible,
          .ytp-copylink-button,
          .ytp-copylink,
          [data-title-copy-button],
          [data-layer="copy-link-button"],
          .ytp-chrome-controls-right {
            display: none !important;
            opacity: 0 !important;
            visibility: hidden !important;
            pointer-events: none !important;
          }

          .ytp-player-content,
          .ytp-chrome-bottom {
            display: none !important;
          }

          iframe[src*="youtube"] {
            isolation: isolate;
          }
        ` : ''}
      `}</style>

      <YouTube
        ref={playerRef}
        videoId={videoId}
        opts={opts}
        onReady={handleReady}
        onStateChange={handleStateChange}
        className="absolute inset-0 w-full h-full"
        style={{ position: 'absolute' }}
        iframeClassName="w-full h-full"
      />

      {/* Video Controls */}
      <motion.div 
        className={cn(
          "video-controls",
          "absolute bottom-0 left-0 right-0 z-20",
          "p-6 pb-4",
          "bg-gradient-to-t from-black/90 via-black/50 to-transparent",
          "transition-opacity duration-200"
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: showControls ? 1 : 0 }}
      >
        {/* Title */}
        <h2 className="text-white text-lg font-medium mb-4 line-clamp-1">
          {title}
        </h2>

        {/* Progress Bar */}
        <Slider
          value={[currentTime * 100 / duration]}
          onValueChange={([value]) => handleSeek(value)}
          className="mb-4"
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={togglePlay}
              className="text-white hover:text-neon-blue hover:bg-neon-blue/10"
            >
              {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={skipBackward}
              className="text-white hover:text-neon-blue hover:bg-neon-blue/10"
            >
              <SkipBack className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={skipForward}
              className="text-white hover:text-neon-blue hover:bg-neon-blue/10"
            >
              <SkipForward className="h-5 w-5" />
            </Button>

            <div className="flex items-center gap-2 group relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMute}
                className="text-white hover:text-neon-blue hover:bg-neon-blue/10"
              >
                {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </Button>
              <div className="w-24 hidden group-hover:block">
                <Slider
                  value={[muted ? 0 : volume]}
                  onValueChange={([value]) => handleVolumeChange(value)}
                  max={100}
                  step={1}
                />
              </div>
            </div>

            <span className="text-white text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setActiveSettings(activeSettings === 'speed' ? null : 'speed')}
                className="text-white hover:text-neon-blue hover:bg-neon-blue/10 h-9 w-9"
              >
                <Gauge className="h-4 w-4" />
              </Button>

              {activeSettings === 'speed' && (
                <motion.div className="absolute right-0 bottom-full mb-2 bg-black/90 rounded-lg overflow-hidden">
                  <div className="py-1">
                    {PLAYBACK_SPEEDS.map(rate => (
                      <button
                        key={rate}
                        onClick={() => {
                          handlePlaybackRateChange(rate);
                          setActiveSettings(null);
                        }}
                        className={cn(
                          "w-full px-4 py-1.5 text-sm text-white hover:text-neon-blue hover:bg-neon-blue/10",
                          playbackRate === rate && "bg-neon-blue/20 text-neon-blue"
                        )}
                      >
                        {rate === 1 ? 'Normal' : `${rate}x`}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleFullscreen}
              className="text-white hover:text-neon-blue hover:bg-neon-blue/10 h-9 w-9"
            >
              <Maximize className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 