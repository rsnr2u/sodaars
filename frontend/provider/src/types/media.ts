export type LocationMediaType =
  | 'SITE_PHOTO'
  | 'SURROUNDING_AREA'
  | 'LANDMARK_VIEW'
  | 'PLOT_MAP'
  | 'OTHER';

export interface LocationMedia {
  uuid: string;
  location_uuid?: string;
  original_filename: string;
  media_type: LocationMediaType;
  mime_type: string;
  file_size: number;
  width?: number | null;
  height?: number | null;
  alt_text?: string | null;
  caption?: string | null;
  is_primary: boolean;
  sort_order: number;
  file_url: string;
  thumbnail_url: string;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface MediaUploadPayload {
  file: File;
  media_type: LocationMediaType;
  alt_text?: string;
  caption?: string;
  is_primary?: boolean;
}

export interface MediaUpdatePayload {
  alt_text?: string | null;
  caption?: string | null;
  media_type?: LocationMediaType;
  is_primary?: boolean;
  sort_order?: number;
}
