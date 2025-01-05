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