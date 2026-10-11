import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  FileSpreadsheet,
  FileText,
  Download,
  CheckCircle2,
  AlertCircle,
  Info,
  X,
  FileUp,
  Loader2,
  ArrowRight,
  Eye,
} from 'lucide-react';
import Drawer from '../../../components/ui/Drawer';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import { AdvertisingResource } from '../../types/resource';
import {
  downloadExcelTemplate,
  downloadCsvTemplate,
  parseInventoryImportFile,
  ParseImportResult,
  INVENTORY_IMPORT_HEADERS,
  INVENTORY_IMPORT_INSTRUCTIONS,
} from '../../utils/inventoryTemplate';

export interface ImportInventoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onImport?: (importedResources: AdvertisingResource[]) => void;
}

export const ImportInventoryDrawer: React.FC<ImportInventoryDrawerProps> = ({
  isOpen,
  onClose,
  onImport,
}) => {
  // Tabs: 'upload' or 'download'
  const [activeTab, setActiveTab] = useState<'upload' | 'download'>('upload');

  // File upload state
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parseResult, setParseResult] = useState<ParseImportResult | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Success states
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [isImportSuccess, setIsImportSuccess] = useState(false);
  const [importedCount, setImportedCount] = useState(0);

  // Reset state when drawer closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedFile(null);
      setParseResult(null);
      setParseError(null);
      setIsImportSuccess(false);
      setImportedCount(0);
      setDownloadSuccess(null);
      setIsDragging(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [isOpen]);

  const handleDownloadExcel = () => {
    try {
      downloadExcelTemplate();
      setDownloadSuccess('SODAARS_Inventory_Import_Template.xlsx downloaded successfully.');
      setTimeout(() => setDownloadSuccess(null), 4000);
    } catch (e) {
      console.error('Error generating Excel template:', e);
    }
  };

  const handleDownloadCsv = () => {
    try {
      downloadCsvTemplate();
      setDownloadSuccess('SODAARS_Inventory_Import_Template.csv downloaded successfully.');
      setTimeout(() => setDownloadSuccess(null), 4000);
    } catch (e) {
      console.error('Error generating CSV template:', e);
    }
  };

  // Process chosen file
  const processFile = async (file: File) => {
    // Validate file extension
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!['xlsx', 'xls', 'csv'].includes(extension || '')) {
      setParseError('Unsupported format. Please select an Excel (.xlsx, .xls) or CSV (.csv) file.');
      setSelectedFile(null);
      setParseResult(null);
      return;
    }

    setSelectedFile(file);
    setIsParsing(true);
    setParseError(null);
    setParseResult(null);

    const result = await parseInventoryImportFile(file);
    setIsParsing(false);

    if (result.error) {
      setParseError(result.error);
    } else {
      setParseResult(result);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleResetFile = () => {
    setSelectedFile(null);
    setParseResult(null);
    setParseError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleExecuteImport = () => {
    if (!parseResult || parseResult.resources.length === 0) return;
    if (onImport) {
      onImport(parseResult.resources);
      setImportedCount(parseResult.resources.length);
      setIsImportSuccess(true);
    }
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-orange-50 text-[#EA580C] flex items-center justify-center border border-orange-100">
            <Upload size={16} />
          </div>
          <div>
            <span className="font-bold text-base text-[#171717] block leading-tight">
              Import Inventory
            </span>
          </div>
        </div>
      }
      width="max-w-2xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button variant="secondary" size="sm" onClick={onClose}>
            {isImportSuccess ? 'Done' : 'Close'}
          </Button>

          {activeTab === 'upload' && !isImportSuccess && (
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Upload size={14} />}
              disabled={!parseResult || parseResult.resources.length === 0 || isParsing}
              onClick={handleExecuteImport}
            >
              {parseResult && parseResult.resources.length > 0
                ? `Import ${parseResult.resources.length} Record${parseResult.resources.length === 1 ? '' : 's'}`
                : 'Import Records'}
            </Button>
          )}

          {activeTab === 'download' && (
            <Button
              variant="primary"
              size="sm"
              rightIcon={<ArrowRight size={14} />}
              onClick={() => setActiveTab('upload')}
            >
              Go to Upload
            </Button>
          )}
        </div>
      }
    >
      <div className="space-y-5">
        {/* Supporting text banner */}
        <div className="p-3 rounded-xl bg-[#FAFAF9] border border-[#E5E5E5] space-y-0.5">
          <p className="text-xs font-semibold text-[#171717]">
            Upload your advertising inventory using the SODAARS standard template.
          </p>
          <p className="text-[11px] text-[#737373] leading-relaxed">
            Download the official blank template, populate your inventory items, and upload here.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-lg bg-[#F5F5F4] p-1 border border-[#E5E5E5]">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex-1 flex items-center justify-center gap-2 py-1.5 px-3 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'upload'
                ? 'bg-white text-[#171717] shadow-xs'
                : 'text-[#737373] hover:text-[#171717]'
            }`}
          >
            <Upload size={13} className={activeTab === 'upload' ? 'text-[#EA580C]' : ''} />
            <span>Upload Completed File</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('download')}
            className={`flex-1 flex items-center justify-center gap-2 py-1.5 px-3 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'download'
                ? 'bg-white text-[#171717] shadow-xs'
                : 'text-[#737373] hover:text-[#171717]'
            }`}
          >
            <Download size={13} className={activeTab === 'download' ? 'text-[#EA580C]' : ''} />
            <span>Download Blank Template</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: UPLOAD & IMPORT                                                   */}
        {/* ========================================================================= */}
        {activeTab === 'upload' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            {/* Success Screen after Import */}
            {isImportSuccess ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-6 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center border border-emerald-200">
                  <CheckCircle2 size={24} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-emerald-950">
                    Import Completed Successfully
                  </h4>
                  <p className="text-xs text-emerald-800">
                    {importedCount} advertising inventory resource{importedCount === 1 ? '' : 's'} have been added to your inventory ledger.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-white border border-emerald-200 text-[11px] text-emerald-900 inline-block text-left space-y-1">
                  <p className="font-semibold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
                    Status: Registered as Inactive
                  </p>
                  <p className="text-stone-600">
                    In accordance with SODAARS governance, all imported resources are registered as Inactive. Activation pricing and status remain admin-controlled.
                  </p>
                </div>
                <div className="pt-2 flex justify-center gap-2">
                  <Button variant="primary" size="sm" onClick={onClose}>
                    View in Inventory
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {/* File Dropzone */}
                {!selectedFile && (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-3 ${
                      isDragging
                        ? 'border-[#EA580C] bg-orange-50/50'
                        : 'border-[#E5E5E5] bg-[#FAFAF9] hover:border-orange-300 hover:bg-white'
                    }`}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileInputChange}
                      accept=".xlsx, .xls, .csv"
                      className="hidden"
                    />

                    <div className="w-12 h-12 rounded-full bg-orange-50 text-[#EA580C] flex items-center justify-center border border-orange-100 shadow-xs">
                      <FileUp size={22} />
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs font-bold text-[#171717]">
                        Click to select or drag and drop your completed template
                      </p>
                      <p className="text-[11px] text-[#737373]">
                        Supports Excel (.xlsx, .xls) and CSV (.csv) files
                      </p>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="border-[#E5E5E5] text-[#171717] hover:bg-white text-xs mt-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                    >
                      Browse File
                    </Button>
                  </div>
                )}

                {/* File Parsing Spinner */}
                {isParsing && (
                  <div className="rounded-xl border border-[#E5E5E5] bg-white p-6 text-center space-y-2">
                    <Loader2 size={24} className="text-[#EA580C] animate-spin mx-auto" />
                    <p className="text-xs font-semibold text-[#171717]">
                      Analyzing template structure...
                    </p>
                    <p className="text-[11px] text-[#737373]">
                      Validating 17 header columns and reading inventory rows
                    </p>
                  </div>
                )}

                {/* Error Banner */}
                {parseError && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 space-y-2">
                    <div className="flex items-start gap-2">
                      <AlertCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
                      <div className="space-y-1 flex-1">
                        <p className="font-semibold text-rose-950">
                          Template Validation Error
                        </p>
                        <p className="text-rose-800 text-[11px] leading-relaxed">
                          {parseError}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleResetFile}
                        className="text-rose-600 hover:text-rose-900 p-1"
                        title="Dismiss"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <div className="pt-1 flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-rose-200 text-rose-800 bg-white hover:bg-rose-50 text-[11px] py-1"
                        onClick={handleResetFile}
                      >
                        Select Another File
                      </Button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('download')}
                        className="text-[11px] text-rose-700 underline font-medium hover:text-rose-900"
                      >
                        Download standard template
                      </button>
                    </div>
                  </div>
                )}

                {/* File Selected & Parsed Preview */}
                {selectedFile && parseResult && !isParsing && (
                  <div className="space-y-4">
                    {/* Selected File Card */}
                    <div className="p-3.5 rounded-xl border border-[#E5E5E5] bg-white flex items-center justify-between shadow-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-md bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100 shrink-0">
                          <FileSpreadsheet size={18} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#171717] truncate max-w-xs">
                            {selectedFile.name}
                          </p>
                          <div className="flex items-center gap-2 text-[10px] text-[#737373]">
                            <span>{(selectedFile.size / 1024).toFixed(1)} KB</span>
                            <span>•</span>
                            <span className="text-emerald-700 font-semibold">
                              {parseResult.resources.length} records ready
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-[#737373] hover:text-rose-600 hover:bg-rose-50 text-xs"
                        onClick={handleResetFile}
                      >
                        Remove
                      </Button>
                    </div>

                    {/* Import Summary Pill */}
                    <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-emerald-900 font-semibold">
                        <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                        <span>{parseResult.resources.length} valid inventory records detected</span>
                      </div>
                      <span className="text-[11px] font-medium text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200">
                        Status: Inactive
                      </span>
                    </div>

                    {/* Warnings if any */}
                    {parseResult.warnings.length > 0 && (
                      <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-900 space-y-1">
                        <div className="flex items-center gap-1.5 font-semibold">
                          <AlertCircle size={13} className="text-amber-700" />
                          <span>{parseResult.warnings.length} adjustments applied:</span>
                        </div>
                        <ul className="list-disc list-inside space-y-0.5 text-amber-800 pl-1 max-h-24 overflow-y-auto">
                          {parseResult.warnings.map((w, idx) => (
                            <li key={idx}>{w}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Preview Table */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[#171717] flex items-center gap-1.5">
                          <Eye size={13} className="text-[#EA580C]" />
                          Preview First Records
                        </span>
                        <span className="text-[11px] text-[#737373]">
                          Showing {Math.min(parseResult.resources.length, 5)} of {parseResult.resources.length}
                        </span>
                      </div>

                      <div className="rounded-lg border border-[#E5E5E5] overflow-x-auto bg-white">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-[#FAFAF9] border-b border-[#E5E5E5] text-[10px] font-bold uppercase tracking-wider text-[#737373]">
                            <tr>
                              <th className="py-2 px-3">Resource Name</th>
                              <th className="py-2 px-3">Type</th>
                              <th className="py-2 px-3">City / Area</th>
                              <th className="py-2 px-3">Dimensions</th>
                              <th className="py-2 px-3 text-right">Customer Price</th>
                              <th className="py-2 px-3 text-right">SODAARS Price</th>
                              <th className="py-2 px-3 text-center">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#E5E5E5]">
                            {parseResult.resources.slice(0, 5).map((res) => (
                              <tr key={res.id} className="hover:bg-[#FAFAF9]">
                                <td className="py-2 px-3 font-semibold text-[#171717] max-w-[140px] truncate">
                                  {res.name}
                                </td>
                                <td className="py-2 px-3 text-[#525252] whitespace-nowrap">
                                  {res.type}
                                </td>
                                <td className="py-2 px-3 text-[#525252] max-w-[120px] truncate">
                                  {res.location.city} {res.location.area ? `(${res.location.area})` : ''}
                                </td>
                                <td className="py-2 px-3 text-[#525252] whitespace-nowrap font-mono text-[11px]">
                                  {res.widthFt} × {res.heightFt} ft
                                </td>
                                <td className="py-2 px-3 text-[#171717] text-right font-medium whitespace-nowrap">
                                  {res.customerPrice !== null ? `₹${res.customerPrice.toLocaleString('en-IN')}` : '—'}
                                </td>
                                <td className="py-2 px-3 text-[#171717] text-right font-medium whitespace-nowrap">
                                  {res.sodaarsPrice !== null ? `₹${res.sodaarsPrice.toLocaleString('en-IN')}` : '—'}
                                </td>
                                <td className="py-2 px-3 text-center whitespace-nowrap">
                                  <Badge variant="inactive">Inactive</Badge>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {parseResult.resources.length > 5 && (
                        <p className="text-[11px] text-[#737373] text-center pt-1 italic">
                          + {parseResult.resources.length - 5} more records will be imported as Inactive.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: DOWNLOAD BLANK TEMPLATES                                           */}
        {/* ========================================================================= */}
        {activeTab === 'download' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            {/* Download Feedback Toast Banner */}
            {downloadSuccess && (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                <span>{downloadSuccess}</span>
              </div>
            )}

            {/* SECTION 1: START WITH A BLANK TEMPLATE */}
            <div className="rounded-xl border border-[#E5E5E5] bg-white p-5 space-y-4 shadow-xs">
              <div>
                <h4 className="text-sm font-bold text-[#171717]">
                  Start with a blank template
                </h4>
                <p className="text-xs text-[#737373] mt-1 leading-relaxed">
                  Download a blank Excel or CSV template, add your inventory records, and keep the column structure unchanged.
                </p>
              </div>

              {/* Download Action Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                {/* 1. EXCEL DOWNLOAD CARD */}
                <div className="p-4 rounded-lg border border-[#E5E5E5] bg-[#FAFAF9] hover:border-orange-200 transition-colors flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-md bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
                        <FileSpreadsheet size={18} />
                      </div>
                      <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-white text-emerald-800 border border-emerald-200">
                        .xlsx
                      </span>
                    </div>
                    <h5 className="text-xs font-bold text-[#171717] pt-1">
                      Excel Template
                    </h5>
                    <p className="text-[11px] text-[#737373] leading-snug">
                      Includes formatted headers and the dedicated Instructions reference sheet.
                    </p>
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full justify-center"
                    leftIcon={<Download size={14} />}
                    onClick={handleDownloadExcel}
                  >
                    Download Excel Template
                  </Button>
                </div>

                {/* 2. CSV DOWNLOAD CARD */}
                <div className="p-4 rounded-lg border border-[#E5E5E5] bg-[#FAFAF9] hover:border-orange-200 transition-colors flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-md bg-orange-50 text-[#EA580C] flex items-center justify-center border border-orange-100">
                        <FileText size={18} />
                      </div>
                      <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-white text-orange-800 border border-orange-200">
                        .csv
                      </span>
                    </div>
                    <h5 className="text-xs font-bold text-[#171717] pt-1">
                      CSV Template
                    </h5>
                    <p className="text-[11px] text-[#737373] leading-snug">
                      Standard comma-separated format containing only the required header row.
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-center border-[#E5E5E5] text-[#171717] hover:bg-white"
                    leftIcon={<Download size={14} />}
                    onClick={handleDownloadCsv}
                  >
                    Download CSV Template
                  </Button>
                </div>
              </div>

              {/* Supported Formats Pill */}
              <div className="pt-2 border-t border-[#E5E5E5] flex items-center justify-between text-[11px] text-[#737373]">
                <span>Supported formats:</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#171717] bg-[#FAFAF9] px-2 py-0.5 rounded border border-[#E5E5E5]">
                    Excel (.xlsx)
                  </span>
                  <span className="font-semibold text-[#171717] bg-[#FAFAF9] px-2 py-0.5 rounded border border-[#E5E5E5]">
                    CSV (.csv)
                  </span>
                </div>
              </div>
            </div>

            {/* SECTION 2: TEMPLATE COLUMN STRUCTURE PREVIEW */}
            <div className="rounded-xl border border-[#E5E5E5] bg-white p-4 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">
                  Template Header Structure (17 Columns)
                </span>
                <span className="text-[11px] text-[#737373]">
                  Exact order
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {INVENTORY_IMPORT_HEADERS.map((header, idx) => (
                  <div
                    key={header}
                    className="p-2 rounded-md bg-[#FAFAF9] border border-[#E5E5E5] flex items-center justify-between"
                  >
                    <span className="font-medium text-[#171717]">{header}</span>
                    <span className="font-mono text-[10px] text-[#737373]">
                      Col {idx + 1}
                    </span>
                  </div>
                ))}
              </div>

              <p className="text-[11px] text-[#737373] pt-1">
                * Both templates are completely blank and contain zero sample or example records.
              </p>
            </div>

            {/* SECTION 3: INSTRUCTIONS & GOVERNANCE RULES */}
            <div className="rounded-xl border border-[#E5E5E5] bg-[#FAFAF9] p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#171717]">
                <Info size={14} className="text-[#EA580C]" />
                <span>SODAARS Inventory Import Guidelines</span>
              </div>

              <ol className="space-y-1.5 text-[11px] text-[#525252] list-decimal list-inside leading-relaxed">
                {INVENTORY_IMPORT_INSTRUCTIONS.map((instruction) => (
                  <li key={instruction} className="pl-1">
                    {instruction.replace(/^\d+\.\s*/, '')}
                  </li>
                ))}
              </ol>

              <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2 mt-2">
                <AlertCircle size={14} className="text-amber-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold">
                    Administrative Pricing &amp; Registration Notice
                  </p>
                  <p className="text-amber-800 leading-snug">
                    Imported inventory records will be registered as Inactive. Inventory Type activation pricing is managed by Admin and is not part of this template.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
};

export default ImportInventoryDrawer;
