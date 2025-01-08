import type { Video } from "@/types";

export function formatDuration(duration: string) {
  // Convert YouTube duration (PT1H34M37S) to readable format (1:34:37)
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  
  if (!match) return duration;
  
  const hours = (match[1] || '').replace('H', '');
  const minutes = (match[2] || '').replace('M', '');
  const seconds = (match[3] || '').replace('S', '');
  
  const parts = [];
  
  if (hours) {
    parts.push(hours);
    parts.push(minutes.padStart(2, '0') || '00');
    parts.push(seconds.padStart(2, '0') || '00');
  } else if (minutes) {
    parts.push(minutes);
    parts.push(seconds.padStart(2, '0') || '00');
  } else {
    parts.push('0');
    parts.push(seconds.padStart(2, '0') || '00');
  }
  
  return parts.join(':');
} 

export function calculateTotalDuration(videos: Video[]): string {
  const totalSeconds = videos.reduce((acc, video) => {
    // Parse duration string (PT1H2M10S) to seconds
    const matches = video.duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!matches) return acc;
    
    const hours = parseInt(matches[1] || '0');
    const minutes = parseInt(matches[2] || '0');
    const seconds = parseInt(matches[3] || '0');
    
    return acc + (hours * 3600 + minutes * 60 + seconds);
  }, 0);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes} min`;
} 