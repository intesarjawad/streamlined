export interface YouTubePlaylistItem {
  contentDetails?: {
    videoId?: string;
  };
  snippet?: {
    title?: string;
    description?: string;
    thumbnails?: {
      medium?: {
        url?: string;
      };
    };
  };
}

export interface YouTubePlaylist {
  snippet?: {
    title?: string;
    description?: string;
  };
}

export interface YouTubeVideo {
  contentDetails?: {
    duration?: string;
  };
} 