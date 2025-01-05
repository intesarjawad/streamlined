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
  Clock,
  Copy,
  ExternalLink
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { formatDuration } from "@/lib/format";
import { PublishedUrlCard } from "@/components/admin/published-url-card";
import { buttonStyles } from "@/lib/button-styles";
import { typographyStyles } from "@/lib/typography-styles";

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
  isPublished?: boolean;
}

export default function PlaylistEditor({ 
  initialData, 
  onSave,
  onRefresh,
  isPublished = false
}: PlaylistEditorProps) {
  const [data, setData] = useState<PlaylistData>(initialData);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  useEffect(() => {
    const hasDataChanged = JSON.stringify(data) !== JSON.stringify(initialData);
    setHasChanges(hasDataChanged);
  }, [data, initialData]);

  const handleDataChange = (newData: Partial<PlaylistData>) => {
    setData(prev => ({ ...prev, ...newData }));
  };

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
      <MagicCard className="space-y-8 p-6">
        <div className="space-y-3">
          <label className={typographyStyles.formLabel}>
            Playlist Name
          </label>
          <Input
            value={data.name}
            onChange={(e) => handleDataChange({ name: e.target.value })}
            className={typographyStyles.formInput}
          />
        </div>

        <div className="space-y-3">
          <label className={typographyStyles.formLabel}>
            Description
          </label>
          <Textarea
            value={data.description}
            onChange={(e) => handleDataChange({ description: e.target.value })}
            className={cn(
              "text-base min-h-[160px]",
              "text-white/70",
              "bg-black/40"
            )}
            rows={6}
          />
        </div>

        <div className="space-y-3">
          <label className={typographyStyles.formLabel}>
            Tags
          </label>
          <Input
            value={data.tags?.join(", ")}
            onChange={(e) => 
              handleDataChange({ 
                tags: e.target.value.split(",").map(tag => tag.trim()) 
              })
            }
            placeholder="Enter tags separated by commas"
            className={cn(
              "text-base",
              "text-white/70",
              "bg-black/40",
              "placeholder:text-white/30"
            )}
          />
        </div>
      </MagicCard>

      {isPublished && !hasChanges && (
        <PublishedUrlCard playlistId={initialData.id} />
      )}

      {/* Action Buttons - Reorganized */}
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          {(isPublished && !hasChanges) ? (
            <Link href={`/playlists/${initialData.id}`} className="flex-1">
              <Button
                variant="outline"
                size="lg"
                className={cn(
                  "w-full gap-2 text-base",
                  buttonStyles.secondary.default
                )}
              >
                <ExternalLink className="h-4 w-4" />
                View Playlist
              </Button>
            </Link>
          ) : (
            <Button
              variant="outline"
              onClick={() => handleSave(true)}
              disabled={saving}
              size="lg"
              className={cn(
                "flex-1 gap-2 text-base",
                buttonStyles.secondary.default,
                saveSuccess && buttonStyles.primary.success
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
          )}
          <Button
            onClick={() => {
              const shouldBeDraft = isPublished && !hasChanges ? true : false;
              handleSave(shouldBeDraft);
            }}
            disabled={saving}
            size="lg"
            className={cn(
              "flex-1 gap-2 text-base",
              isPublished && !hasChanges 
                ? buttonStyles.primary.destructive
                : buttonStyles.primary.default
            )}
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {isPublished ? "Unpublishing..." : "Publishing..."}
              </>
            ) : (
              <>
                {isPublished && !hasChanges ? (
                  <>
                    <Upload className="h-4 w-4" />
                    Unpublish
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    {hasChanges ? "Publish Changes" : "Publish"}
                  </>
                )}
              </>
            )}
          </Button>
        </div>

        <div className="flex gap-4">
          <Link href="/admin/playlists" className="flex-1">
            <Button
              variant="outline"
              size="lg"
              className={cn(
                "w-full gap-2 text-base",
                buttonStyles.secondary.default
              )}
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
              buttonStyles.secondary.default,
              updateSuccess && buttonStyles.primary.success
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