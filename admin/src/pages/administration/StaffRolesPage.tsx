import React, { useState, useMemo, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  Key, 
  CheckCircle2, 
  XCircle, 
  MoreVertical, 
  Search, 
  Lock, 
  Mail, 
  Calendar, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight, 
  RotateCcw, 
  Sliders
} from 'lucide-react';
import { mockStaff } from '../../data/mockAdminData';
import { StaffMember } from '../../types';

type SortField = 'name' | 'role' | 'twoFactorEnabled' | 'lastLogin' | 'status';
type SortDirection = 'asc' | 'desc';

export const StaffRolesPage: React.FC = () => {
  const [staffList, setStaffList] = useState<StaffMember[]>(mockStaff);
  
  // Filter states
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [mfaFilter, setMfaFilter] = useState<string>('all');

  // Sorting states
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Pagination states (starts with 50 rows by standard)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(50);

  // Modal state
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    role: 'Inventory Auditor' as StaffMember['role'],
  });

  // Check if any filter is active
  const isFiltered = Boolean(search || roleFilter !== 'all' || mfaFilter !== 'all');

  const handleResetFilters = () => {
    setSearch('');
    setRoleFilter('all');
    setMfaFilter('all');
    setCurrentPage(1);
  };

  // Reset to first page when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, roleFilter, mfaFilter, pageSize]);

  // Toggle sorting on column header click
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter & Sort Pipeline
  const filteredAndSorted = useMemo(() => {
    const list = staffList.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase()) ||
        s.role.toLowerCase().includes(search.toLowerCase());

      const matchesRole = roleFilter === 'all' || s.role === roleFilter;
      const matchesMfa =
        mfaFilter === 'all'
          ? true
          : mfaFilter === 'enforced'
          ? s.twoFactorEnabled
          : !s.twoFactorEnabled;

      return matchesSearch && matchesRole && matchesMfa;
    });

    list.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'role':
          comparison = a.role.localeCompare(b.role);
          break;
        case 'twoFactorEnabled':
          comparison = (a.twoFactorEnabled === b.twoFactorEnabled) ? 0 : a.twoFactorEnabled ? -1 : 1;
          break;
        case 'lastLogin':
          comparison = a.lastLogin.localeCompare(b.lastLogin);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        default:
          comparison = 0;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return list;
  }, [staffList, search, roleFilter, mfaFilter, sortField, sortDirection]);

  // Pagination computations
  const totalRecords = filteredAndSorted.length;
  const totalPages = Math.ceil(totalRecords / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalRecords);
  const paginatedStaff = filteredAndSorted.slice(startIndex, endIndex);

  // Helper for rendering clickable sort headers
  const renderSortHeader = (label: string, field: SortField, align: 'left' | 'right' = 'left') => {
    const isActive = sortField === field;
    return (
      <th
        onClick={() => handleSort(field)}
        className={`py-3 px-3 cursor-pointer select-none group transition-colors hover:bg-zinc-100/80 ${
          align === 'right' ? 'text-right' : 'text-left'
        }`}
      >
        <div className={`inline-flex items-center gap-1.5 ${align === 'right' ? 'flex-row-reverse' : ''}`}>
          <span className={`text-[10px] font-mono uppercase tracking-wider font-bold transition-colors ${
            isActive ? 'text-orange-600' : 'text-zinc-500 group-hover:text-zinc-900'
          }`}>
            {label}
          </span>
          <span className="text-zinc-400 group-hover:text-zinc-700">
            {isActive ? (
              sortDirection === 'asc' ? (
                <ArrowUp className="w-3.5 h-3.5 text-orange-600 stroke-[2.5]" />
              ) : (
                <ArrowDown className="w-3.5 h-3.5 text-orange-600 stroke-[2.5]" />
              )
            ) : (
              <ArrowUpDown className="w-3 h-3 text-zinc-300 opacity-60 group-hover:opacity-100" />
            )}
          </span>
        </div>
      </th>
    );
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaff.name || !newStaff.email) return;

    const member: StaffMember = {
      id: `STF-${String(staffList.length + 1).padStart(2, '0')}`,
      name: newStaff.name,
      email: newStaff.email,
      role: newStaff.role,
      status: 'active',
      lastLogin: 'Never (Invite Sent)',
      twoFactorEnabled: false,
    };

    setStaffList([member, ...staffList]);
    setShowInviteModal(false);
    setNewStaff({ name: '', email: '', role: 'Inventory Auditor' });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight font-sans">
            Staff & Roles
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Manage internal platform team members, access roles, and permissions.
          </p>
        </div>

        <button
          onClick={() => setShowInviteModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold shadow-sm transition-colors self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Staff Member</span>
        </button>
      </div>

      {/* Role Privileges Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-xl border border-zinc-200/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-zinc-900 text-sm">Super Admin</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-100 text-orange-800 font-bold">TIER 0</span>
          </div>
          <p className="text-xs text-zinc-500">Unrestricted system governance, fee schedule changes, staff RBAC assignment, database exports.</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-zinc-200/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-zinc-900 text-sm">Compliance Officer</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">TIER 1</span>
          </div>
          <p className="text-xs text-zinc-500">KYC/GSTIN verification approvals, legal hold placements, municipal regulation overrides.</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-zinc-200/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-zinc-900 text-sm">Inventory Auditor</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-100 text-zinc-800 font-bold">TIER 2</span>
          </div>
          <p className="text-xs text-zinc-500">Site verification, photo geotag audit, illumination checks, temporary hold flags.</p>
        </div>
      </div>

      {/* Search & Staff Table */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 sm:p-6 space-y-4">
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search staff by name, email, or role..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-2 rounded-lg border border-zinc-200 focus:outline-none focus:border-orange-500 font-sans"
              />
            </div>

            <div className="flex items-center gap-2">
              {/* Role Select */}
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="text-xs px-2.5 py-1.5 rounded-lg border border-zinc-200 bg-white font-mono text-zinc-700 focus:outline-none focus:border-orange-500"
              >
                <option value="all">All Roles</option>
                <option value="Super Admin">Super Admin</option>
                <option value="Compliance Officer">Compliance Officer</option>
                <option value="Inventory Auditor">Inventory Auditor</option>
                <option value="Support Agent">Support Agent</option>
              </select>

              {/* MFA Select */}
              <select
                value={mfaFilter}
                onChange={(e) => setMfaFilter(e.target.value)}
                className="text-xs px-2.5 py-1.5 rounded-lg border border-zinc-200 bg-white font-mono text-zinc-700 focus:outline-none focus:border-orange-500"
              >
                <option value="all">All MFA Statuses</option>
                <option value="enforced">2FA Enforced</option>
                <option value="pending">2FA Pending</option>
              </select>

              {isFiltered && (
                <button
                  onClick={handleResetFilters}
                  className="p-1.5 rounded-lg border border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100 transition-colors"
                  title="Reset Filters"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-zinc-200">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/75">
                {renderSortHeader('Staff Member', 'name')}
                {renderSortHeader('Assigned Role', 'role')}
                {renderSortHeader('MFA / 2FA Status', 'twoFactorEnabled')}
                {renderSortHeader('Last Console Login', 'lastLogin')}
                {renderSortHeader('Status', 'status')}
                <th className="py-3 px-3 text-[10px] font-mono uppercase tracking-wider font-bold text-zinc-500 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 bg-white">
              {paginatedStaff.length > 0 ? (
                paginatedStaff.map((staff) => (
                  <tr key={staff.id} className="hover:bg-zinc-50/70 transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-xs font-mono">
                          {staff.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <span className="font-semibold text-zinc-900 block">{staff.name}</span>
                          <span className="text-[11px] text-zinc-500 flex items-center gap-1 font-mono">
                            <Mail className="w-3 h-3" /> {staff.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="px-2.5 py-1 rounded-md bg-zinc-100 text-zinc-800 font-medium font-mono text-[11px]">
                        {staff.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      {staff.twoFactorEnabled ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] bg-emerald-50 text-emerald-700 font-medium font-mono">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Enforced (Hardware/OTP)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] bg-amber-50 text-amber-700 font-medium font-mono">
                          <Lock className="w-3.5 h-3.5 text-amber-600" /> Pending Setup
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-zinc-500 font-mono text-[11px]">{staff.lastLogin}</td>
                    <td className="py-3.5 px-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono bg-emerald-100 text-emerald-800 font-bold">
                        ACTIVE
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <button className="p-1.5 rounded hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <div className="max-w-xs mx-auto space-y-2">
                      <Users className="w-8 h-8 text-zinc-300 mx-auto" />
                      <p className="text-sm font-semibold text-zinc-700">No staff members found</p>
                      <p className="text-xs text-zinc-400">
                        Try modifying your search or clearing the active filters.
                      </p>
                      {isFiltered && (
                        <button
                          onClick={handleResetFilters}
                          className="mt-2 text-xs text-orange-600 font-semibold hover:underline inline-flex items-center gap-1"
                        >
                          <RotateCcw className="w-3.5 h-3.5" /> Reset all filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination & Summary Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-3 border-t border-zinc-100 text-xs text-zinc-600 font-mono">
          <div className="flex items-center gap-3">
            <span>
              Showing <strong className="text-zinc-900">{totalRecords > 0 ? startIndex + 1 : 0}</strong> to{' '}
              <strong className="text-zinc-900">{endIndex}</strong> of{' '}
              <strong className="text-zinc-900">{totalRecords}</strong> staff personnel
            </span>

            <div className="flex items-center gap-1.5 pl-3 border-l border-zinc-200">
              <span className="text-zinc-400">Per page:</span>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="px-2 py-1 rounded border border-zinc-200 bg-white font-mono text-zinc-700 text-xs focus:outline-none focus:border-orange-500"
              >
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={200}>200</option>
              </select>
            </div>
          </div>

          {/* Page Navigation Buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="p-1.5 rounded border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="First Page"
            >
              <ChevronsLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Previous Page"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            {/* Numeric page pills */}
            <div className="flex items-center gap-1 px-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => {
                  if (totalPages <= 5) return true;
                  return Math.abs(page - currentPage) <= 1 || page === 1 || page === totalPages;
                })
                .map((page, index, arr) => {
                  const showEllipsis = index > 0 && page - arr[index - 1] > 1;
                  return (
                    <React.Fragment key={page}>
                      {showEllipsis && <span className="px-1 text-zinc-400">...</span>}
                      <button
                        onClick={() => setCurrentPage(page)}
                        className={`w-7 h-7 rounded text-xs font-mono font-bold transition-colors ${
                          currentPage === page
                            ? 'bg-zinc-900 text-white shadow-xs'
                            : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                        }`}
                      >
                        {page}
                      </button>
                    </React.Fragment>
                  );
                })}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages || totalRecords === 0}
              className="p-1.5 rounded border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Next Page"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages || totalRecords === 0}
              className="p-1.5 rounded border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Last Page"
            >
              <ChevronsRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-zinc-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <h3 className="font-bold text-zinc-950 text-base">Provision New Administrative Staff</h3>
              <button onClick={() => setShowInviteModal(false)} className="text-zinc-400 hover:text-zinc-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleInvite} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-zinc-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sumanth Varma"
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-zinc-200 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 mb-1">Corporate Email (@sodaars.internal)</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. sumanth@sodaars.internal"
                  value={newStaff.email}
                  onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-zinc-200 focus:outline-none focus:border-orange-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 mb-1">Security Role</label>
                <select
                  value={newStaff.role}
                  onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value as StaffMember['role'] })}
                  className="w-full p-2.5 rounded-lg border border-zinc-200 focus:outline-none focus:border-orange-500 font-sans"
                >
                  <option value="Super Admin">Super Admin (Tier 0)</option>
                  <option value="Compliance Officer">Compliance Officer (Tier 1)</option>
                  <option value="Inventory Auditor">Inventory Auditor (Tier 2)</option>
                  <option value="Support Agent">Support Agent (Tier 3)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-semibold"
                >
                  Send Access Credentials
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
