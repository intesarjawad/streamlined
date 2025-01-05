import { NextResponse } from "next/server";
import { google } from "googleapis";
import type { YouTubePlaylistItem, YouTubePlaylist, YouTubeVideo } from "@/types/youtube";

const youtube = google.youtube({
  version: "v3",
  auth: process.env.YOUTUBE_API_KEY,
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json(
      { error: "Missing playlist URL" },
      { status: 400 }
    );
  }

  try {
    const playlistId = url.match(/list=([^&]*)/)?.[1];
    
    if (!playlistId) {
      return NextResponse.json(
        { error: "Invalid playlist URL" },
        { status: 400 }
      );
    }

    const playlistResponse = await youtube.playlists.list({
      part: ["snippet"],
      id: [playlistId],
    });

    const itemsResponse = await youtube.playlistItems.list({
      part: ["snippet", "contentDetails"],
      playlistId,
      maxResults: 50,
    });

    const playlist = playlistResponse.data.items?.[0] as YouTubePlaylist;
    const items = (itemsResponse.data.items || []) as YouTubePlaylistItem[];

    const formattedData = {
      name: playlist?.snippet?.title || "",
      description: playlist?.snippet?.description || "",
      videos: await Promise.all(
        items.map(async (item: YouTubePlaylistItem) => {
          const videoId = item.contentDetails?.videoId;
          
          const videoResponse = await youtube.videos.list({
            part: ["contentDetails"],
            id: [videoId!],
          });

          const videoDetails = videoResponse.data.items?.[0] as YouTubeVideo;

          return {
            id: videoId,
            title: item.snippet?.title || "",
            thumbnail: item.snippet?.thumbnails?.medium?.url || "",
            duration: videoDetails?.contentDetails?.duration || "",
            url: `https://youtube.com/watch?v=${videoId}`,
          };
        })
      ),
    };

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error("YouTube API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch playlist data" },
      { status: 500 }
    );
  }
} 