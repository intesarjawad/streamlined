"use client";

import { useState, useEffect } from "react";
import { motion, Reorder } from "motion/react";
import { MagicCard } from "@/components/ui/magic-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Save, 
  Trash2, 
  Upload, 
  GripVertical,
  RefreshCw,
  Loader2,
  Check,
  ArrowLeft,
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { formatDuration } from "@/lib/format";

interface Video {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
  url: string;
}

interface PlaylistData {
  name: string;
  videos: Video[];
  tags?: string[];
  description?: string;
  customThumbnail?: string;
  youtubeUrl?: string;
}

interface PlaylistEditorProps {
  initialData: PlaylistData;
  onSave: (data: PlaylistData, isDraft: boolean) => Promise<void>;
  onRefresh: () => Promise<void>;
}

export default function PlaylistEditor({ 
  initialData, 
  onSave,
  onRefresh 
}: PlaylistEditorProps) {
  const [data, setData] = useState<PlaylistData>(initialData);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const handleSave = async (isDraft = false) => {
    setSaving(true);
    try {
      await onSave(data, isDraft);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save playlist",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await onRefresh();
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 2000);
      toast({
        title: "Success",
        description: "Playlist refreshed successfully",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh playlist",
        variant: "destructive",
      });
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="space-y-6">
      <MagicCard className="space-y-6 p-6">
        <div className="space-y-3">
          <label className="text-base font-medium">Playlist Name</label>
          <Input
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            className="text-lg"
          />
        </div>

        <div className="space-y-3">
          <label className="text-base font-medium">Description</label>
          <Textarea
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
            className="text-base min-h-[160px]"
            rows={6}
          />
        </div>

        <div className="space-y-3">
          <label className="text-base font-medium">Tags</label>
          <Input
            value={data.tags?.join(", ")}
            onChange={(e) => 
              setData({ 
                ...data, 
                tags: e.target.value.split(",").map(tag => tag.trim()) 
              })
            }
            placeholder="Enter tags separated by commas"
            className="text-base"
          />
        </div>
      </MagicCard>

      {/* Action Buttons - Reorganized */}
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => handleSave(true)}
            disabled={saving}
            size="lg"
            className={cn(
              "flex-1 gap-2 transition-colors text-base",
              saveSuccess && "bg-green-500/10 text-green-500 border-green-500/50"
            )}
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving Draft...
              </>
            ) : saveSuccess ? (
              <>
                <Check className="h-4 w-4" />
                Saved!
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Draft
              </>
            )}
          </Button>
          <Button
            onClick={() => handleSave(false)}
            disabled={saving}
            size="lg"
            className="flex-1 gap-2 text-base"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Publish
              </>
            )}
          </Button>
        </div>

        <div className="flex gap-4">
          <Link href="/admin/playlists" className="flex-1">
            <Button
              variant="outline"
              size="lg"
              className="w-full gap-2 text-base"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Playlists
            </Button>
          </Link>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing}
            size="lg"
            className={cn(
              "flex-1 gap-2 text-base",
              updateSuccess && "bg-green-500/10 text-green-500 border-green-500/50"
            )}
          >
            {refreshing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : updateSuccess ? (
              <>
                <Check className="h-4 w-4" />
                Updated!
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                Check for Updates
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
} 