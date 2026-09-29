export type ResourceMediaType =
  | 'DAY_PHOTO'
  | 'NIGHT_PHOTO'
  | 'LONG_SHOT'
  | 'CLOSE_UP'
  | 'SCHEMATIC'
  | 'OTHER';

export interface ResourceMedia {
  uuid: string;
  advertising_resource_uuid?: string;
  original_filename: string;
  media_type: ResourceMediaType;
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

export interface ResourceMediaUploadPayload {
  file: File;
  media_type?: ResourceMediaType;
  alt_text?: string;
  caption?: string;
  is_primary?: boolean;
}

export interface ResourceMediaUpdatePayload {
  alt_text?: string | null;
  caption?: string | null;
  media_type?: ResourceMediaType;
  is_primary?: boolean;
  sort_order?: number;
}
