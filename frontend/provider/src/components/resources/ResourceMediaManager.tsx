import React, { useState, useEffect, useRef, useCallback } from 'react';
import type {
  ResourceMedia,
  ResourceMediaType,
  ResourceMediaUploadPayload,
} from '../../types/resourceMedia';
import resourceService from '../../services/resourceService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getApiErrorMessage } from '../../services/api';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Modal from '../ui/Modal';
import Spinner from '../ui/Spinner';
import {
  UploadCloud,
  Star,
  Trash2,
  Edit,
  ArrowLeft,
  ArrowRight,
  Maximize2,
  X,
  Image as ImageIcon,
} from 'lucide-react';

export interface ResourceMediaManagerProps {
  resourceUuid: string;
  onMediaChanged?: () => void;
}

export const ResourceMediaManager: React.FC<ResourceMediaManagerProps> = ({
  resourceUuid,
  onMediaChanged,
}) => {
  const { role } = useAuth();
  const { success, error: showError } = useToast();

  // RBAC checks: Owner & Manager can set primary, reorder, delete; Staff can only view, upload, edit metadata
  const canManageMedia = role === 'PROVIDER_OWNER' || role === 'PROVIDER_MANAGER';

  const [mediaList, setMediaList] = useState<ResourceMedia[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Upload Form State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<ResourceMediaType>('DAY_PHOTO');
  const [altText, setAltText] = useState('');
  const [caption, setCaption] = useState('');
  const [isPrimary, setIsPrimary] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Lightbox Preview State
  const [previewMedia, setPreviewMedia] = useState<ResourceMedia | null>(null);

  // Edit Metadata Modal State
  const [editingMedia, setEditingMedia] = useState<ResourceMedia | null>(null);
  const [editAltText, setEditAltText] = useState('');
  const [editCaption, setEditCaption] = useState('');
  const [editMediaType, setEditMediaType] = useState<ResourceMediaType>('DAY_PHOTO');
  const [isUpdating, setIsUpdating] = useState(false);

  // Delete Confirmation Modal State
  const [mediaToDelete, setMediaToDelete] = useState<ResourceMedia | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch media from Stage 9 API
  const fetchMedia = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await resourceService.getResourceMedia(resourceUuid);
      setMediaList(data || []);
    } catch (err: unknown) {
      showError(getApiErrorMessage(err), 'Failed to load media assets');
    } finally {
      setIsLoading(false);
    }
  }, [resourceUuid, showError]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  // Handle client-side file selection & preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate mime type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      showError('Please select a valid JPG, PNG, or WebP image.', 'Invalid File Format');
      return;
    }

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      showError('File size exceeds the 10MB maximum limit.', 'File Too Large');
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setFilePreview(objectUrl);
  };

  const handleClearSelectedFile = () => {
    setSelectedFile(null);
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
      setFilePreview(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Upload media
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      const payload: ResourceMediaUploadPayload = {
        file: selectedFile,
        media_type: mediaType,
        alt_text: altText.trim() || undefined,
        caption: caption.trim() || undefined,
        is_primary: canManageMedia ? isPrimary : undefined,
      };

      await resourceService.uploadResourceMedia(resourceUuid, payload);
      success('Media asset uploaded successfully.');
      handleClearSelectedFile();
      setAltText('');
      setCaption('');
      setIsPrimary(false);
      await fetchMedia();
      onMediaChanged?.();
    } catch (err: unknown) {
      showError(getApiErrorMessage(err), 'Upload Failed');
    } finally {
      setIsUploading(false);
    }
  };

  // Set as primary cover photo (Owner/Manager only)
  const handleSetPrimary = async (media: ResourceMedia) => {
    if (!canManageMedia) return;
    try {
      await resourceService.updateResourceMedia(resourceUuid, media.uuid, {
        is_primary: true,
      });
      success(`"${media.original_filename}" is now the primary cover photo.`);
      await fetchMedia();
      onMediaChanged?.();
    } catch (err: unknown) {
      showError(getApiErrorMessage(err), 'Failed to Set Primary');
    }
  };

  // Open edit metadata modal
  const handleOpenEditModal = (media: ResourceMedia) => {
    setEditingMedia(media);
    setEditAltText(media.alt_text || '');
    setEditCaption(media.caption || '');
    setEditMediaType(media.media_type || 'DAY_PHOTO');
  };

  // Save updated metadata
  const handleSaveMetadata = async () => {
    if (!editingMedia) return;
    setIsUpdating(true);
    try {
      await resourceService.updateResourceMedia(resourceUuid, editingMedia.uuid, {
        alt_text: editAltText.trim() || null,
        caption: editCaption.trim() || null,
        media_type: editMediaType,
      });
      success('Media metadata updated.');
      setEditingMedia(null);
      await fetchMedia();
      onMediaChanged?.();
    } catch (err: unknown) {
      showError(getApiErrorMessage(err), 'Update Failed');
    } finally {
      setIsUpdating(false);
    }
  };

  // Reorder media (Move left or right) (Owner/Manager only)
  const handleMoveOrder = async (index: number, direction: 'left' | 'right') => {
    if (!canManageMedia) return;
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= mediaList.length) return;

    const updated = [...mediaList];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    setMediaList(updated);

    const reorderPayload = updated.map((m, idx) => ({
      uuid: m.uuid,
      sort_order: idx + 1,
    }));

    try {
      await resourceService.reorderResourceMedia(resourceUuid, reorderPayload);
      success('Gallery order updated.');
      onMediaChanged?.();
    } catch (err: unknown) {
      showError(getApiErrorMessage(err), 'Reorder Failed');
      await fetchMedia();
    }
  };

  // Delete media confirm (Owner/Manager only)
  const handleConfirmDelete = async () => {
    if (!mediaToDelete || !canManageMedia) return;
    setIsDeleting(true);
    try {
      await resourceService.deleteResourceMedia(resourceUuid, mediaToDelete.uuid);
      success('Media asset removed.');
      setMediaToDelete(null);
      await fetchMedia();
      onMediaChanged?.();
    } catch (err: unknown) {
      showError(getApiErrorMessage(err), 'Delete Failed');
    } finally {
      setIsDeleting(false);
    }
  };

  const formatMediaType = (type: string): string => {
    switch (type) {
      case 'DAY_PHOTO':
        return 'Day Photo';
      case 'NIGHT_PHOTO':
        return 'Night Photo';
      case 'LONG_SHOT':
        return 'Long Shot';
      case 'CLOSE_UP':
        return 'Close Up';
      case 'SCHEMATIC':
        return 'Schematic';
      case 'OTHER':
      default:
        return 'Other';
    }
  };

  return (
    <div>
      {/* Upload Zone */}
      <div
        style={{
          border: '2px dashed var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem',
          backgroundColor: 'var(--canvas-bg)',
          marginBottom: '1.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.85rem' }}>
          <UploadCloud size={20} style={{ color: 'var(--blue-600)' }} />
          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-heading)' }}>
            Upload Resource Photography
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
            JPG, PNG, WebP up to 10MB
          </span>
        </div>

        <form onSubmit={handleUpload}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label required">Select Image File</label>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="form-input"
                style={{ height: '38px', padding: '5px' }}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Media Type</label>
              <select
                value={mediaType}
                onChange={(e) => setMediaType(e.target.value as ResourceMediaType)}
                className="form-select"
                style={{ height: '38px' }}
              >
                <option value="DAY_PHOTO">Day Photo</option>
                <option value="NIGHT_PHOTO">Night Photo</option>
                <option value="LONG_SHOT">Long Shot</option>
                <option value="CLOSE_UP">Close Up</option>
                <option value="SCHEMATIC">Schematic</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <Input
              label="Alt Text (SEO & Accessibility)"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="e.g. Unipole illuminated front face at night"
            />
            <Input
              label="Caption (Optional)"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="e.g. Long-shot view from intersection"
            />
          </div>

          {canManageMedia && (
            <div style={{ marginBottom: '0.85rem' }}>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                <input
                  type="checkbox"
                  checked={isPrimary}
                  onChange={(e) => setIsPrimary(e.target.checked)}
                />
                <span>Set as primary inventory cover photo</span>
              </label>
            </div>
          )}

          {filePreview && (
            <div style={{ marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <img
                src={filePreview}
                alt="Preview"
                style={{ width: '80px', height: '56px', objectFit: 'cover', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)' }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-heading)', fontWeight: 500, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {selectedFile?.name}
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {(selectedFile ? selectedFile.size / 1024 : 0).toFixed(1)} KB
                </span>
              </div>
              <button
                type="button"
                onClick={handleClearSelectedFile}
                className="btn btn-ghost btn-sm"
                style={{ padding: '2px 6px', color: 'var(--rose-600)' }}
              >
                <X size={14} />
              </button>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={!selectedFile || isUploading}
              isLoading={isUploading}
              leftIcon={<UploadCloud size={15} />}
            >
              Upload Photo
            </Button>
          </div>
        </form>
      </div>

      {/* Gallery Section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-heading)', margin: 0 }}>
            Photo Gallery ({mediaList.length})
          </h4>
          {!canManageMedia && (
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Staff role: Upload & edit metadata permitted. Primary/delete managed by Owners/Managers.
            </span>
          )}
        </div>

        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
            <Spinner size={24} />
          </div>
        ) : mediaList.length === 0 ? (
          <div
            style={{
              padding: '2.5rem 1rem',
              textAlign: 'center',
              backgroundColor: 'var(--canvas-bg)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <ImageIcon size={36} style={{ color: 'var(--text-light)', marginBottom: '0.5rem' }} />
            <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-heading)' }}>
              No photos uploaded yet
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Upload day/night photography, long shots, or schematics to showcase this advertising face.
            </div>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '1rem',
            }}
          >
            {mediaList.map((media, index) => (
              <div
                key={media.uuid}
                style={{
                  border: media.is_primary ? '2px solid var(--orange-500)' : '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: '#ffffff',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: 'var(--shadow-xs)',
                  position: 'relative',
                }}
              >
                {/* Primary Badge */}
                {media.is_primary && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '6px',
                      left: '6px',
                      backgroundColor: 'var(--orange-500)',
                      color: '#ffffff',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: 'var(--radius-xs)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px',
                      zIndex: 2,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    }}
                  >
                    <Star size={10} fill="#ffffff" />
                    <span>PRIMARY</span>
                  </div>
                )}

                {/* Media Type Tag */}
                <div
                  style={{
                    position: 'absolute',
                    top: '6px',
                    right: '6px',
                    backgroundColor: 'rgba(15, 23, 42, 0.75)',
                    color: '#ffffff',
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    padding: '2px 6px',
                    borderRadius: 'var(--radius-xs)',
                    zIndex: 2,
                  }}
                >
                  {formatMediaType(media.media_type)}
                </div>

                {/* Thumbnail Image */}
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '130px',
                    backgroundColor: 'var(--canvas-bg)',
                    cursor: 'pointer',
                    overflow: 'hidden',
                  }}
                  onClick={() => setPreviewMedia(media)}
                  title="Click to view full preview"
                >
                  <img
                    src={media.thumbnail_url || media.file_url}
                    alt={media.alt_text || media.original_filename}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                      transition: 'transform 0.2s ease',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '4px',
                      right: '4px',
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      borderRadius: 'var(--radius-xs)',
                      padding: '2px 4px',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Maximize2 size={11} />
                  </div>
                </div>

                {/* Card Meta Content */}
                <div style={{ padding: '0.65rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: 'var(--text-heading)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                    title={media.original_filename}
                  >
                    {media.original_filename}
                  </div>

                  {media.caption && (
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {media.caption}
                    </div>
                  )}

                  <div style={{ fontSize: '0.7rem', color: 'var(--text-light)', marginTop: 'auto', paddingTop: '0.4rem' }}>
                    {media.width && media.height ? `${media.width}×${media.height} px • ` : ''}
                    {(media.file_size / 1024).toFixed(0)} KB
                  </div>

                  {/* Actions Row */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: '0.5rem',
                      paddingTop: '0.4rem',
                      borderTop: '1px solid var(--border-subtle)',
                    }}
                  >
                    {/* Reorder Buttons (Owner & Manager only) */}
                    {canManageMedia ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                        <button
                          onClick={() => handleMoveOrder(index, 'left')}
                          disabled={index === 0}
                          className="btn btn-ghost btn-sm"
                          style={{ padding: '2px 4px' }}
                          title="Move Left"
                        >
                          <ArrowLeft size={13} />
                        </button>
                        <button
                          onClick={() => handleMoveOrder(index, 'right')}
                          disabled={index === mediaList.length - 1}
                          className="btn btn-ghost btn-sm"
                          style={{ padding: '2px 4px' }}
                          title="Move Right"
                        >
                          <ArrowRight size={13} />
                        </button>
                      </div>
                    ) : <div />}

                    {/* Primary, Edit, Delete Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      {canManageMedia && !media.is_primary && (
                        <button
                          onClick={() => handleSetPrimary(media)}
                          className="btn btn-ghost btn-sm"
                          style={{ padding: '3px 5px', color: 'var(--orange-600)' }}
                          title="Set as Primary"
                        >
                          <Star size={13} />
                        </button>
                      )}

                      <button
                        onClick={() => handleOpenEditModal(media)}
                        className="btn btn-ghost btn-sm"
                        style={{ padding: '3px 5px', color: 'var(--blue-600)' }}
                        title="Edit Metadata"
                      >
                        <Edit size={13} />
                      </button>

                      {canManageMedia && (
                        <button
                          onClick={() => setMediaToDelete(media)}
                          className="btn btn-ghost btn-sm"
                          style={{ padding: '3px 5px', color: 'var(--rose-600)' }}
                          title="Delete Photo"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {previewMedia && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.92)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
          onClick={() => setPreviewMedia(null)}
        >
          <div
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              color: '#ffffff',
            }}
          >
            <span style={{ fontSize: '0.85rem' }}>{previewMedia.original_filename}</span>
            <button
              onClick={() => setPreviewMedia(null)}
              style={{
                background: 'none',
                border: 'none',
                color: '#ffffff',
                cursor: 'pointer',
                padding: '4px',
              }}
            >
              <X size={24} />
            </button>
          </div>

          <div
            style={{ maxWidth: '90vw', maxHeight: '80vh' }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={previewMedia.file_url}
              alt={previewMedia.alt_text || previewMedia.original_filename}
              style={{
                maxWidth: '100%',
                maxHeight: '80vh',
                objectFit: 'contain',
                borderRadius: 'var(--radius-sm)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              }}
            />
            {(previewMedia.caption || previewMedia.alt_text) && (
              <div
                style={{
                  color: '#e2e8f0',
                  fontSize: '0.85rem',
                  textAlign: 'center',
                  marginTop: '0.75rem',
                  maxWidth: '600px',
                  marginInline: 'auto',
                }}
              >
                {previewMedia.caption || previewMedia.alt_text}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edit Metadata Modal */}
      {editingMedia && (
        <Modal
          isOpen={Boolean(editingMedia)}
          onClose={() => setEditingMedia(null)}
          title="Edit Photo Metadata"
          footer={
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', width: '100%' }}>
              <Button variant="secondary" onClick={() => setEditingMedia(null)} disabled={isUpdating}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSaveMetadata} isLoading={isUpdating}>
                Save Metadata
              </Button>
            </div>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Media Type</label>
              <select
                value={editMediaType}
                onChange={(e) => setEditMediaType(e.target.value as ResourceMediaType)}
                className="form-select"
              >
                <option value="DAY_PHOTO">Day Photo</option>
                <option value="NIGHT_PHOTO">Night Photo</option>
                <option value="LONG_SHOT">Long Shot</option>
                <option value="CLOSE_UP">Close Up</option>
                <option value="SCHEMATIC">Schematic</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <Input
              label="Alt Text (SEO & Accessibility)"
              value={editAltText}
              onChange={(e) => setEditAltText(e.target.value)}
              placeholder="Descriptive text for discovery indexing"
            />

            <Input
              label="Caption"
              value={editCaption}
              onChange={(e) => setEditCaption(e.target.value)}
              placeholder="Optional photo caption"
            />
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {mediaToDelete && (
        <Modal
          isOpen={Boolean(mediaToDelete)}
          onClose={() => setMediaToDelete(null)}
          title="Delete Media Asset"
          footer={
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', width: '100%' }}>
              <Button variant="secondary" onClick={() => setMediaToDelete(null)} disabled={isDeleting}>
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleConfirmDelete}
                isLoading={isDeleting}
              >
                Delete Photo
              </Button>
            </div>
          }
        >
          <div style={{ fontSize: '0.88rem', color: 'var(--text-body)', lineHeight: 1.5 }}>
            Are you sure you want to delete <strong>{mediaToDelete.original_filename}</strong>?
            {mediaToDelete.is_primary && (
              <div style={{ marginTop: '0.5rem', color: 'var(--orange-700)', fontSize: '0.82rem', fontWeight: 500 }}>
                Note: This is the primary cover photo. The system will automatically promote the next available photo as primary.
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ResourceMediaManager;
