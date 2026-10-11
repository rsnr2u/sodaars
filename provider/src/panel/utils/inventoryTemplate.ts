import * as XLSX from 'xlsx';
import {
  AdvertisingResource,
  StaticResourceType,
  IlluminationType,
  LocationMetadata,
  APPROVED_RESOURCE_TYPES,
  APPROVED_ILLUMINATION_TYPES,
} from '../types/resource';

/**
 * Authoritative 17-column header specification for SODAARS Inventory Import Template.
 * Exact order required by SODAARS business rules.
 */
export const INVENTORY_IMPORT_HEADERS: string[] = [
  'Resource Name',
  'Inventory Type',
  'Site Name',
  'City / Town',
  'Area / Locality',
  'Landmark',
  'Latitude',
  'Longitude',
  'Dimensions',
  'Orientation',
  'Illumination',
  'Visibility / Facing',
  'Customer Price',
  'SODAARS Price',
  'Marketplace Participation',
  'Status',
  'Description',
];

/**
 * Standard instructions content for the Excel workbook 'Instructions' sheet.
 */
export const INVENTORY_IMPORT_INSTRUCTIONS: string[] = [
  '1. Add one inventory resource per row.',
  '2. Do not change the column names.',
  '3. Inventory Type must match an available SODAARS Inventory Type.',
  '4. Enter the location information available for the resource.',
  '5. Do not enter Inventory Activation Pricing.',
  '6. Imported inventory will be registered as Inactive.',
  '7. Review your data before uploading.',
  '8. Save the completed file before uploading to SODAARS.',
];

export const EXCEL_TEMPLATE_FILENAME = 'SODAARS_Inventory_Import_Template.xlsx';
export const CSV_TEMPLATE_FILENAME = 'SODAARS_Inventory_Import_Template.csv';

/**
 * Generate and trigger download of the blank SODAARS Inventory CSV template.
 * Contains strictly the single header row with ZERO data rows.
 */
export function downloadCsvTemplate(): void {
  // Exact single header line
  const csvContent = INVENTORY_IMPORT_HEADERS.join(',') + '\r\n';

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', CSV_TEMPLATE_FILENAME);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generate and trigger download of the blank SODAARS Inventory Excel (.xlsx) template.
 * Contains 2 sheets:
 *  1. 'Inventory Import' -> Strictly the 17 headers in row 1, with ZERO data rows.
 *  2. 'Instructions'     -> Standard SODAARS import rules.
 */
export function downloadExcelTemplate(): void {
  const wb = XLSX.utils.book_new();

  // Sheet 1: 'Inventory Import' (Headers ONLY, no example rows)
  const wsImport = XLSX.utils.aoa_to_sheet([INVENTORY_IMPORT_HEADERS]);
  wsImport['!cols'] = INVENTORY_IMPORT_HEADERS.map((header) => ({
    wch: Math.max(header.length + 4, 18),
  }));
  XLSX.utils.book_append_sheet(wb, wsImport, 'Inventory Import');

  // Sheet 2: 'Instructions'
  const instructionsAoa: string[][] = [
    ['SODAARS INVENTORY IMPORT TEMPLATE'],
    [''],
    ...INVENTORY_IMPORT_INSTRUCTIONS.map((instr) => [instr]),
  ];
  const wsInstructions = XLSX.utils.aoa_to_sheet(instructionsAoa);
  wsInstructions['!cols'] = [{ wch: 80 }];
  XLSX.utils.book_append_sheet(wb, wsInstructions, 'Instructions');

  // Write and trigger browser download
  XLSX.writeFile(wb, EXCEL_TEMPLATE_FILENAME);
}

export interface ParseImportResult {
  resources: AdvertisingResource[];
  totalRows: number;
  validRows: number;
  warnings: string[];
  error?: string;
}

/**
 * Parses an uploaded .xlsx, .xls, or .csv inventory import template.
 * Maps the 17 authoritative headers into SODAARS AdvertisingResource objects.
 * Strictly registers all imported resources as 'Inactive' per SODAARS rules.
 */
export async function parseInventoryImportFile(file: File): Promise<ParseImportResult> {
  try {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: 'array' });

    if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
      return {
        resources: [],
        totalRows: 0,
        validRows: 0,
        warnings: [],
        error: 'The uploaded file has no sheets or content.',
      };
    }

    // Prefer 'Inventory Import' sheet, fallback to first sheet (e.g. for CSV)
    const sheetName = workbook.SheetNames.includes('Inventory Import')
      ? 'Inventory Import'
      : workbook.SheetNames[0];

    const sheet = workbook.Sheets[sheetName];
    if (!sheet) {
      return {
        resources: [],
        totalRows: 0,
        validRows: 0,
        warnings: [],
        error: 'Could not read the sheet contents from the uploaded file.',
      };
    }

    const rows: unknown[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

    if (!rows || rows.length === 0) {
      return {
        resources: [],
        totalRows: 0,
        validRows: 0,
        warnings: [],
        error: 'The uploaded file is empty.',
      };
    }

    // Row 0 is the header row
    const headerRow = (rows[0] as unknown[]).map((h) => String(h || '').trim());

    // Locate column indices by matching header name or falling back to standard index
    const getColIdx = (name: string, fallbackIdx: number): number => {
      const idx = headerRow.findIndex(
        (h) => h.toLowerCase() === name.toLowerCase()
      );
      return idx !== -1 ? idx : fallbackIdx;
    };

    const colIdx = {
      resourceName: getColIdx('Resource Name', 0),
      inventoryType: getColIdx('Inventory Type', 1),
      siteName: getColIdx('Site Name', 2),
      city: getColIdx('City / Town', 3),
      area: getColIdx('Area / Locality', 4),
      landmark: getColIdx('Landmark', 5),
      latitude: getColIdx('Latitude', 6),
      longitude: getColIdx('Longitude', 7),
      dimensions: getColIdx('Dimensions', 8),
      orientation: getColIdx('Orientation', 9),
      illumination: getColIdx('Illumination', 10),
      visibility: getColIdx('Visibility / Facing', 11),
      customerPrice: getColIdx('Customer Price', 12),
      sodaarsPrice: getColIdx('SODAARS Price', 13),
      marketplace: getColIdx('Marketplace Participation', 14),
      status: getColIdx('Status', 15),
      description: getColIdx('Description', 16),
    };

    const dataRows = rows.slice(1);
    if (dataRows.length === 0) {
      return {
        resources: [],
        totalRows: 0,
        validRows: 0,
        warnings: [],
        error: 'The uploaded file contains headers, but has zero data rows. Please add your inventory rows before uploading.',
      };
    }

    const resources: AdvertisingResource[] = [];
    const warnings: string[] = [];
    const nowIso = new Date().toISOString();

    dataRows.forEach((rowRaw, rIndex) => {
      const row = rowRaw as unknown[];
      // Skip row if completely empty
      const hasContent = row.some(
        (cell) => cell !== undefined && cell !== null && String(cell).trim() !== ''
      );
      if (!hasContent) return;

      const rowNum = rIndex + 2; // 1-based index including header row
      const rawName = String(row[colIdx.resourceName] || '').trim();
      const rawType = String(row[colIdx.inventoryType] || '').trim();
      const rawSite = String(row[colIdx.siteName] || '').trim();
      const rawCity = String(row[colIdx.city] || '').trim();
      const rawArea = String(row[colIdx.area] || '').trim();
      const rawLandmark = String(row[colIdx.landmark] || '').trim();
      const rawLat = String(row[colIdx.latitude] || '').trim();
      const rawLng = String(row[colIdx.longitude] || '').trim();
      const rawDims = String(row[colIdx.dimensions] || '').trim();
      const rawOrientation = String(row[colIdx.orientation] || '').trim();
      const rawIllumination = String(row[colIdx.illumination] || '').trim();
      const rawVisibility = String(row[colIdx.visibility] || '').trim();
      const rawCustPrice = row[colIdx.customerPrice];
      const rawSodaarsPrice = row[colIdx.sodaarsPrice];
      const rawMarketplace = String(row[colIdx.marketplace] || '').trim().toLowerCase();
      const rawDesc = String(row[colIdx.description] || '').trim();

      // Resource Name
      const name = rawName || `Imported Resource #${rowNum}`;

      // Admin-controlled inventory types validation
      let matchedType: StaticResourceType = 'Other Static Advertising Assets';
      if (rawType) {
        const found = APPROVED_RESOURCE_TYPES.find(
          (t) => t.toLowerCase() === rawType.toLowerCase()
        );
        if (found) {
          matchedType = found;
        } else {
          warnings.push(`Row ${rowNum}: "${rawType}" is not an admin approved type. Assigned to "${matchedType}".`);
        }
      }

      // Illumination validation
      let matchedIllumination: IlluminationType = 'Front-lit';
      if (rawIllumination) {
        const found = APPROVED_ILLUMINATION_TYPES.find(
          (i) => i.toLowerCase() === rawIllumination.toLowerCase()
        );
        if (found) {
          matchedIllumination = found;
        }
      }

      // Dimensions parsing (e.g. 20x10, 20 x 10, 200)
      let widthFt = 20;
      let heightFt = 10;
      if (rawDims) {
        const match = rawDims.match(/(\d+(?:\.\d+)?)\s*(?:x|\*|by)\s*(\d+(?:\.\d+)?)/i);
        if (match) {
          widthFt = parseFloat(match[1]) || 20;
          heightFt = parseFloat(match[2]) || 10;
        } else {
          const numOnly = parseFloat(rawDims.replace(/[^\d.]/g, ''));
          if (!isNaN(numOnly) && numOnly > 0) {
            widthFt = Math.max(Math.round(Math.sqrt(numOnly)), 5);
            heightFt = Math.max(Math.round(numOnly / widthFt), 5);
          }
        }
      }

      // Commercial pricing parsing
      const parsePrice = (val: unknown): number | null => {
        if (val === undefined || val === null || val === '') return null;
        const num = typeof val === 'number' ? val : parseFloat(String(val).replace(/[^0-9.-]/g, ''));
        return isNaN(num) ? null : num;
      };

      const customerPrice = parsePrice(rawCustPrice);
      const sodaarsPrice = parsePrice(rawSodaarsPrice);

      // Marketplace participation
      const marketplaceParticipation =
        ['yes', 'true', '1', 'y', 'participating'].includes(rawMarketplace) ||
        rawMarketplace === '';

      // Location metadata
      const locName = rawSite || rawArea || rawCity || `Imported Site ${rowNum}`;
      const location: LocationMetadata = {
        id: `loc-import-${Date.now()}-${rIndex}`,
        name: locName,
        city: rawCity || 'Unspecified City',
        area: rawArea || '',
        landmark: rawLandmark || undefined,
        latitude: rawLat || undefined,
        longitude: rawLng || undefined,
      };

      // Strict Rule 9: Imported inventory MUST be registered as 'Inactive'
      const resource: AdvertisingResource = {
        id: `res-import-${Date.now()}-${rIndex}`,
        name,
        type: matchedType,
        location,
        widthFt,
        heightFt,
        totalSqFt: widthFt * heightFt,
        orientation: rawOrientation || 'Facing Traffic',
        illumination: matchedIllumination,
        visibilityFacing: rawVisibility || 'Left Hand Side (LHS)',
        customerPrice,
        sodaarsPrice,
        marketplaceParticipation,
        status: 'Inactive',
        description: rawDesc || undefined,
        createdAt: nowIso,
        updatedAt: nowIso,
      };

      resources.push(resource);
    });

    if (resources.length === 0) {
      return {
        resources: [],
        totalRows: dataRows.length,
        validRows: 0,
        warnings,
        error: 'No valid inventory rows found. Please ensure your file has data beneath the headers.',
      };
    }

    return {
      resources,
      totalRows: dataRows.length,
      validRows: resources.length,
      warnings,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error parsing file';
    return {
      resources: [],
      totalRows: 0,
      validRows: 0,
      warnings: [],
      error: `Failed to read file: ${msg}`,
    };
  }
}
