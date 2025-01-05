"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { 
  Play, Pause, Volume2, VolumeX, 
  Settings, Maximize, SkipBack, SkipForward,
  ChevronUp, ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import type { YouTubeEvent, YouTubePlayer, Options } from 'react-youtube';

interface VideoPlayerProps {
  videoId: string;
  title: string;
  onEnded?: () => void;
}

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
  const [availableQualities, setAvailableQualities] = useState([]);
  const [showSettings, setShowSettings] = useState(false);

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

  const handleReady = (event: YouTubeEvent) => {
    setPlayer(event.target);
    setAvailableQualities(event.target.getAvailableQualityLevels());
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

  const handleQualityChange = (quality: string) => {
    setQuality(quality);
    player.setPlaybackQuality(quality);
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
    },
  };

  return (
    <div 
      className="relative w-full h-full"
      onMouseMove={() => setShowControls(true)}
      onMouseLeave={() => playing && setShowControls(false)}
    >
      <YouTube
        ref={playerRef}
        videoId={videoId}
        opts={opts}
        onReady={handleReady}
        onStateChange={handleStateChange}
        className="w-full h-full"
      />

      {/* Video Controls */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: showControls ? 1 : 0 }}
        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4"
      >
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
              className="text-white hover:bg-white/20"
            >
              {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={skipBackward}
              className="text-white hover:bg-white/20"
            >
              <SkipBack className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={skipForward}
              className="text-white hover:bg-white/20"
            >
              <SkipForward className="h-5 w-5" />
            </Button>

            <div className="flex items-center gap-2 group relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMute}
                className="text-white hover:bg-white/20"
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
                onClick={() => setShowSettings(!showSettings)}
                className="text-white hover:bg-white/20"
              >
                <Settings className="h-5 w-5" />
              </Button>

              {showSettings && (
                <div className="absolute bottom-full right-0 mb-2 w-48 bg-black/90 rounded-lg p-2">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-white mb-2">Playback Speed</p>
                      {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 3, 4].map((rate) => (
                        <button
                          key={rate}
                          onClick={() => handlePlaybackRateChange(rate)}
                          className={cn(
                            "block w-full text-left px-2 py-1 text-sm rounded",
                            playbackRate === rate
                              ? "bg-white/20 text-white"
                              : "text-white/70 hover:bg-white/10"
                          )}
                        >
                          {rate}x
                        </button>
                      ))}
                    </div>

                    <div>
                      <p className="text-sm text-white mb-2">Quality</p>
                      {availableQualities.map((q) => (
                        <button
                          key={q}
                          onClick={() => handleQualityChange(q)}
                          className={cn(
                            "block w-full text-left px-2 py-1 text-sm rounded",
                            quality === q
                              ? "bg-white/20 text-white"
                              : "text-white/70 hover:bg-white/10"
                          )}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                const elem = document.documentElement;
                if (document.fullscreenElement) {
                  document.exitFullscreen();
                } else {
                  elem.requestFullscreen();
                }
              }}
              className="text-white hover:bg-white/20"
            >
              <Maximize className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 