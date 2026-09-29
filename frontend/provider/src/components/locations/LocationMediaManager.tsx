import React, { useState, useEffect, useRef } from 'react';
import type { LocationMedia, LocationMediaType, MediaUploadPayload } from '../../types/media';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import locationService from '../../services/locationService';
import { getApiErrorMessage } from '../../services/api';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import {
  UploadCloud,
  Image as ImageIcon,
  Star,
  Trash2,
  Edit,
  ArrowLeft,
  ArrowRight,
  Maximize2,
  X,
} from 'lucide-react';

export interface LocationMediaManagerProps {
  locationUuid: string;
  onMediaChanged?: () => void;
}

export const LocationMediaManager: React.FC<LocationMediaManagerProps> = ({
  locationUuid,
  onMediaChanged,
}) => {
  const { role } = useAuth();
  const { success, error: showError } = useToast();

  // RBAC checks: Owner & Manager can set primary, reorder, delete; Staff can only view, upload, edit metadata
  const canManageMedia = role === 'PROVIDER_OWNER' || role === 'PROVIDER_MANAGER';

  const [mediaList, setMediaList] = useState<LocationMedia[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Upload Form State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<LocationMediaType>('SITE_PHOTO');
  const [altText, setAltText] = useState('');
  const [caption, setCaption] = useState('');
  const [isPrimary, setIsPrimary] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Lightbox Preview State
  const [previewMedia, setPreviewMedia] = useState<LocationMedia | null>(null);

  // Edit Metadata Modal State
  const [editingMedia, setEditingMedia] = useState<LocationMedia | null>(null);
  const [editAltText, setEditAltText] = useState('');
  const [editCaption, setEditCaption] = useState('');
  const [editMediaType, setEditMediaType] = useState<LocationMediaType>('SITE_PHOTO');
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchMedia = async () => {
    setIsLoading(true);
    try {
      const data = await locationService.getLocationMedia(locationUuid);
      setMediaList(data);
    } catch (err: unknown) {
      showError(getApiErrorMessage(err), 'Failed to load photos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [locationUuid]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate MIME type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      showError('Please select a JPG, PNG, or WebP image.', 'Unsupported File Type');
      return;
    }

    // Validate size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      showError('File size exceeds 10MB limit.', 'File Too Large');
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setFilePreview(objectUrl);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      const payload: MediaUploadPayload = {
        file: selectedFile,
        media_type: mediaType,
        alt_text: altText.trim() || undefined,
        caption: caption.trim() || undefined,
        is_primary: isPrimary,
      };

      await locationService.uploadLocationMedia(locationUuid, payload);
      success('Site photo uploaded and processed successfully.');

      // Reset upload inputs
      setSelectedFile(null);
      setFilePreview(null);
      setAltText('');
      setCaption('');
      setIsPrimary(false);
      if (fileInputRef.current) fileInputRef.current.value = '';

      fetchMedia();
      onMediaChanged?.();
    } catch (err: unknown) {
      showError(getApiErrorMessage(err), 'Upload Failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSetPrimary = async (media: LocationMedia) => {
    if (!canManageMedia || media.is_primary) return;
    try {
      await locationService.updateLocationMedia(locationUuid, media.uuid, { is_primary: true });
      success(`"${media.original_filename}" set as primary site photo.`);
      fetchMedia();
      onMediaChanged?.();
    } catch (err: unknown) {
      showError(getApiErrorMessage(err), 'Failed to set primary photo');
    }
  };

  const handleOpenEditModal = (media: LocationMedia) => {
    setEditingMedia(media);
    setEditAltText(media.alt_text || '');
    setEditCaption(media.caption || '');
    setEditMediaType(media.media_type);
  };

  const handleSaveMetadata = async () => {
    if (!editingMedia) return;
    setIsUpdating(true);
    try {
      await locationService.updateLocationMedia(locationUuid, editingMedia.uuid, {
        alt_text: editAltText.trim() || null,
        caption: editCaption.trim() || null,
        media_type: editMediaType,
      });
      success('Photo metadata updated successfully.');
      setEditingMedia(null);
      fetchMedia();
      onMediaChanged?.();
    } catch (err: unknown) {
      showError(getApiErrorMessage(err), 'Failed to update metadata');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteMedia = async (media: LocationMedia) => {
    if (!canManageMedia) return;
    if (!window.confirm(`Are you sure you want to delete "${media.original_filename}"?`)) return;

    try {
      await locationService.deleteLocationMedia(locationUuid, media.uuid);
      success('Photo deleted successfully.');
      fetchMedia();
      onMediaChanged?.();
    } catch (err: unknown) {
      showError(getApiErrorMessage(err), 'Delete Failed');
    }
  };

  const handleMoveOrder = async (index: number, direction: 'left' | 'right') => {
    if (!canManageMedia) return;
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= mediaList.length) return;

    const reordered = [...mediaList];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);

    setMediaList(reordered);

    try {
      await locationService.reorderLocationMedia(
        locationUuid,
        reordered.map((m) => m.uuid)
      );
      success('Gallery order updated.');
      onMediaChanged?.();
    } catch (err: unknown) {
      showError(getApiErrorMessage(err), 'Reorder Failed');
      fetchMedia();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Upload Box */}
      <div
        style={{
          border: '1px dashed var(--border-medium)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem',
          backgroundColor: 'var(--canvas-bg)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <UploadCloud size={18} style={{ color: 'var(--blue-600)' }} />
          <h4 style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-heading)' }}>
            Upload Site Photography
          </h4>
        </div>

        <form onSubmit={handleUpload}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '0.75rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Photo File (JPG, PNG, WebP max 10MB)</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="form-input"
                style={{ height: '38px', padding: '0.35rem 0.6rem' }}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Media Type</label>
              <select
                value={mediaType}
                onChange={(e) => setMediaType(e.target.value as LocationMediaType)}
                className="form-select"
                style={{ height: '38px' }}
              >
                <option value="SITE_PHOTO">Site Photo</option>
                <option value="SURROUNDING_AREA">Surrounding Area</option>
                <option value="LANDMARK_VIEW">Landmark View</option>
                <option value="PLOT_MAP">Plot Map</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '0.75rem' }}>
            <Input
              label="Alt Text (SEO & Accessibility)"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="e.g. Unipole structure facing northbound highway traffic"
            />
            <Input
              label="Caption (Optional)"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="View from the flyover exit"
            />
          </div>

          {canManageMedia && (
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <input
                  type="checkbox"
                  checked={isPrimary}
                  onChange={(e) => setIsPrimary(e.target.checked)}
                />
                <span>Set as primary site cover photo</span>
              </label>
            </div>
          )}

          {filePreview && (
            <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <img
                src={filePreview}
                alt="Preview"
                style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}
              />
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                Ready to upload: <strong>{selectedFile?.name}</strong> ({(selectedFile ? selectedFile.size / 1024 : 0).toFixed(1)} KB)
              </span>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isUploading}
            disabled={!selectedFile}
            leftIcon={<UploadCloud size={16} />}
          >
            Upload Photo Asset
          </Button>
        </form>
      </div>

      {/* Gallery Section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-heading)' }}>
            Location Gallery ({mediaList.length} photos)
          </h4>
        </div>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
            Loading photos...
          </div>
        ) : mediaList.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '2.5rem 1rem',
              backgroundColor: 'var(--surface-white)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-muted)',
            }}
          >
            <ImageIcon size={32} style={{ color: 'var(--border-strong)', margin: '0 auto 0.5rem' }} />
            <div style={{ fontWeight: 500, fontSize: '0.92rem', color: 'var(--text-heading)' }}>No photos uploaded yet</div>
            <div style={{ fontSize: '0.82rem' }}>Upload site photography to help media buyers inspect this site.</div>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '1rem',
            }}
          >
            {mediaList.map((media, index) => (
              <div
                key={media.uuid}
                style={{
                  backgroundColor: 'var(--surface-white)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-xs)',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                }}
              >
                {/* Image Container */}
                <div
                  style={{
                    position: 'relative',
                    aspectRatio: '4 / 3',
                    backgroundColor: 'var(--canvas-bg)',
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src={media.thumbnail_url || media.file_url}
                    alt={media.alt_text || media.original_filename}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      cursor: 'pointer',
                    }}
                    onClick={() => setPreviewMedia(media)}
                  />

                  {/* Primary Badge */}
                  {media.is_primary && (
                    <div style={{ position: 'absolute', top: '8px', left: '8px' }}>
                      <Badge variant="orange" icon={<Star size={11} />}>
                        PRIMARY
                      </Badge>
                    </div>
                  )}

                  {/* Media Type Badge */}
                  <div style={{ position: 'absolute', bottom: '8px', left: '8px' }}>
                    <Badge variant="neutral" style={{ fontSize: '0.68rem' }}>
                      {media.media_type.replace('_', ' ')}
                    </Badge>
                  </div>

                  {/* Expand Lightbox Button */}
                  <button
                    onClick={() => setPreviewMedia(media)}
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      width: '28px',
                      height: '28px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'rgba(15, 23, 42, 0.65)',
                      color: '#ffffff',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                    title="Fullscreen Preview"
                  >
                    <Maximize2 size={14} />
                  </button>
                </div>

                {/* Details & Metadata */}
                <div style={{ padding: '0.75rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div
                    style={{
                      fontSize: '0.82rem',
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
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {media.caption}
                    </div>
                  )}

                  <div style={{ fontSize: '0.72rem', color: 'var(--text-light)', marginTop: 'auto', paddingTop: '0.5rem' }}>
                    {media.width && media.height ? `${media.width}x${media.height} px • ` : ''}
                    {(media.file_size / 1024).toFixed(0)} KB
                  </div>

                  {/* Action Row */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: '0.65rem',
                      paddingTop: '0.5rem',
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {canManageMedia && !media.is_primary && (
                        <button
                          onClick={() => handleSetPrimary(media)}
                          className="btn btn-ghost btn-sm"
                          style={{ padding: '3px 6px', color: 'var(--orange-600)' }}
                          title="Set as Primary"
                        >
                          <Star size={13} />
                        </button>
                      )}

                      <button
                        onClick={() => handleOpenEditModal(media)}
                        className="btn btn-ghost btn-sm"
                        style={{ padding: '3px 6px', color: 'var(--blue-600)' }}
                        title="Edit Metadata"
                      >
                        <Edit size={13} />
                      </button>

                      {canManageMedia && (
                        <button
                          onClick={() => handleDeleteMedia(media)}
                          className="btn btn-ghost btn-sm"
                          style={{ padding: '3px 6px', color: 'var(--rose-600)' }}
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
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
          }}
          onClick={() => setPreviewMedia(null)}
        >
          <button
            onClick={() => setPreviewMedia(null)}
            style={{
              position: 'absolute',
              top: '1.5rem',
              right: '1.5rem',
              background: 'none',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
            }}
            aria-label="Close fullscreen"
          >
            <X size={28} />
          </button>
          <img
            src={previewMedia.file_url}
            alt={previewMedia.alt_text || previewMedia.original_filename}
            style={{
              maxWidth: '90vw',
              maxHeight: '80vh',
              objectFit: 'contain',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-xl)',
            }}
            onClick={(e) => e.stopPropagation()}
          />
          <div
            style={{
              color: '#ffffff',
              marginTop: '1rem',
              textAlign: 'center',
              maxWidth: '600px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontWeight: 600, fontSize: '1rem' }}>{previewMedia.original_filename}</div>
            {previewMedia.caption && <div style={{ fontSize: '0.88rem', opacity: 0.85 }}>{previewMedia.caption}</div>}
          </div>
        </div>
      )}

      {/* Edit Metadata Modal */}
      {editingMedia && (
        <Modal
          isOpen={true}
          onClose={() => setEditingMedia(null)}
          title="Edit Photo Metadata"
          footer={
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.75rem', width: '100%' }}>
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
            <div className="form-group">
              <label className="form-label">Media Type</label>
              <select
                value={editMediaType}
                onChange={(e) => setEditMediaType(e.target.value as LocationMediaType)}
                className="form-select"
              >
                <option value="SITE_PHOTO">Site Photo</option>
                <option value="SURROUNDING_AREA">Surrounding Area</option>
                <option value="LANDMARK_VIEW">Landmark View</option>
                <option value="PLOT_MAP">Plot Map</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <Input
              label="Alt Text"
              value={editAltText}
              onChange={(e) => setEditAltText(e.target.value)}
              placeholder="Descriptive text for accessibility & SEO"
            />

            <Input
              label="Caption"
              value={editCaption}
              onChange={(e) => setEditCaption(e.target.value)}
              placeholder="Photo caption"
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default LocationMediaManager;
