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
import { SEMESTER_TAGS } from "@/lib/constants";

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
  tags: string[];
  description?: string;
  customThumbnail?: string;
  youtubeUrl?: string;
  id?: string;
}

interface PlaylistEditorProps {
  initialData: PlaylistData;
  onSave: (data: PlaylistData, isDraft: boolean) => Promise<void>;
  onRefresh: () => Promise<void>;
  isPublished?: boolean;
  onDiscard?: () => Promise<void>;
  onDelete?: () => Promise<void>;
}

export default function PlaylistEditor({ 
  initialData, 
  onSave,
  onRefresh,
  isPublished = false,
  onDiscard,
  onDelete
}: PlaylistEditorProps) {
  const [data, setData] = useState<PlaylistData>({
    ...initialData,
    tags: initialData.tags || [],
  });
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [copied, setCopied] = useState(false);
  const [customTagInput, setCustomTagInput] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    setData({
      ...initialData,
      tags: initialData.tags || [],
    });
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

  const handleTagToggle = (tag: string) => {
    setData(prev => {
      const currentTags = prev.tags || [];
      const newTags = currentTags.includes(tag)
        ? currentTags.filter(t => t !== tag)
        : [...currentTags, tag];
      return { ...prev, tags: newTags };
    });
  };

  const handleAddCustomTag = (newTag: string) => {
    const normalizedNewTag = newTag.trim().toLowerCase();
    
    const currentTags = data.tags || [];
    
    const isDuplicate = currentTags.some(
      existingTag => existingTag.toLowerCase() === normalizedNewTag
    );

    if (isDuplicate) {
      toast({
        title: "Duplicate Tag",
        description: `The tag "${newTag}" has already been added`,
        variant: "destructive",
      });
      setCustomTagInput('');
    } else {
      setData(prev => ({
        ...prev,
        tags: [...currentTags, newTag.trim()]
      }));
      setCustomTagInput('');
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
            Semester Tags
          </label>
          <div className="flex flex-wrap gap-2">
            {SEMESTER_TAGS.map(tag => (
              <Button
                key={tag}
                variant="outline"
                size="sm"
                onClick={() => handleTagToggle(tag)}
                className={cn(
                  "transition-all duration-200",
                  data.tags?.includes(tag)
                    ? "bg-primary/20 border-primary text-primary shadow-[0_0_10px_rgba(0,255,255,0.2)] hover:bg-primary/30 hover:shadow-[0_0_15px_rgba(0,255,255,0.3)]"
                    : "border-white/10 hover:border-primary hover:text-primary hover:bg-primary/10 hover:shadow-[0_0_10px_rgba(0,255,255,0.1)]"
                )}
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className={typographyStyles.formLabel}>
            Custom Tags
          </label>
          <Input
            value={customTagInput}
            onChange={(e) => setCustomTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                const newTag = customTagInput.trim();
                if (newTag && !SEMESTER_TAGS.includes(newTag)) {
                  handleAddCustomTag(newTag);
                }
              }
            }}
            placeholder="Type a tag and press Enter"
            className={cn(
              "text-base",
              "text-white/70",
              "bg-black/40",
              "placeholder:text-white/30"
            )}
          />
          <p className="text-sm text-muted-foreground">
            {data.tags.filter(tag => !SEMESTER_TAGS.includes(tag)).length === 0 
              ? "No custom tags added yet"
              : `${data.tags.filter(tag => !SEMESTER_TAGS.includes(tag)).length} custom tag${data.tags.filter(tag => !SEMESTER_TAGS.includes(tag)).length === 1 ? '' : 's'} added`
            }
          </p>

          {/* Display custom tags */}
          <div className="flex flex-wrap gap-2 mt-2">
            {data.tags
              .filter(tag => !SEMESTER_TAGS.includes(tag))
              .map(tag => (
                <div 
                  key={tag} 
                  className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm flex items-center gap-2"
                >
                  {tag}
                  <button
                    onClick={() => {
                      setData(prev => ({
                        ...prev,
                        tags: prev.tags.filter(t => t !== tag)
                      }));
                    }}
                    className="hover:text-red-400"
                  >
                    ×
                  </button>
                </div>
              ))}
          </div>
        </div>
      </MagicCard>

      {isPublished && !hasChanges && (
        <PublishedUrlCard playlistId={initialData.id} />
      )}

      {/* Bottom Actions Section */}
      <div className="flex flex-col gap-8">
        {/* Main Actions */}
        <div className="flex flex-col gap-4">
          {/* Save/Publish Actions */}
          <div className="flex gap-4">
            {(isPublished && !hasChanges) ? (
              <>
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
                <Button
                  onClick={() => handleSave(true)}
                  size="lg"
                  className={cn(
                    "flex-1 gap-2 text-base",
                    buttonStyles.primary.destructive
                  )}
                >
                  <Upload className="h-4 w-4" />
                  Unpublish
                </Button>
              </>
            ) : (
              <>
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
                <Button
                  onClick={() => handleSave(false)}
                  disabled={saving}
                  size="lg"
                  className={cn(
                    "flex-1 gap-2 text-base",
                    buttonStyles.primary.default
                  )}
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      {hasChanges ? "Publish Changes" : "Publish"}
                    </>
                  )}
                </Button>
              </>
            )}
          </div>

          {/* Navigation & Refresh */}
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

        {/* Danger Zone */}
        {((!isPublished && onDiscard) || (isPublished && onDelete)) && (
          <div className="border-t border-white/10 pt-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-red-500">Danger Zone</p>
              {!isPublished && onDiscard && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={onDiscard}
                  className={cn(
                    "gap-2 text-base",
                    "border-red-500/50 hover:border-red-500",
                    "text-red-500 hover:text-red-400",
                    "hover:bg-red-500/10"
                  )}
                >
                  <Trash2 className="h-4 w-4" />
                  Discard Draft
                </Button>
              )}
              {isPublished && onDelete && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={onDelete}
                  className={cn(
                    "gap-2 text-base",
                    "border-red-500/50 hover:border-red-500",
                    "text-red-500 hover:text-red-400",
                    "hover:bg-red-500/10"
                  )}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Playlist
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 