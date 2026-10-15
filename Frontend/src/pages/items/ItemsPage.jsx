import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, RefreshCw, Filter, Sparkles, Zap, PackageCheck } from 'lucide-react';
import { toast } from 'sonner';

import itemService from '../../services/item.service';
import { TOP_100_TECH_PRODUCTS } from '../../constants/top100TechProducts';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import SearchInput from '../../components/ui/SearchInput';
import Pagination from '../../components/ui/Pagination';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import ErrorState from '../../components/ui/ErrorState';
import ItemTable from '../../features/items/components/ItemTable';
import AIAgentButton from '../../components/ai/AIAgentButton';
import { usePermission } from '../../hooks/usePermission';
import { GST_RATES } from '../../constants/gstRates';
import ROUTES from '../../constants/routes';

export const ItemsPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { canCreateItem } = usePermission();

  const [search, setSearch] = useState('');
  const [selectedGst, setSelectedGst] = useState('');
  const [page, setPage] = useState(1);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isImporting100, setIsImporting100] = useState(false);

  // TanStack Query for items
  const {
    data,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['items', { search, gstPercent: selectedGst, page, limit: 10 }],
    queryFn: () =>
      itemService.getItems({
        search: search.trim() || undefined,
        gstPercent: selectedGst || undefined,
        page,
        limit: 10,
      }),
    keepPreviousData: true,
  });

  const items = data?.data?.items || data?.items || (Array.isArray(data?.data) ? data.data : []);
  const pagination = data?.data?.pagination || data?.pagination || {
    page: 1,
    totalPages: 1,
    total: items.length,
    limit: 10,
  };

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => itemService.deleteItem(id),
    onSuccess: () => {
      toast.success('Item deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['items'] });
      setItemToDelete(null);
    },
    onError: (err) => {
      const msg = err.response?.data?.message || 'Failed to delete item';
      toast.error(msg);
      setItemToDelete(null);
    },
  });

  const handleDeleteConfirm = () => {
    if (itemToDelete?._id) {
      deleteMutation.mutate(itemToDelete._id);
    }
  };

  const handleImportTop100 = async () => {
    setIsImporting100(true);
    const toastId = toast.loading('AI Agents importing Top 100 Tech Products with HSN & 18% GST...');
    try {
      const res = await itemService.createBulkItems(TOP_100_TECH_PRODUCTS);
      const inserted = res?.insertedCount ?? 100;
      const skipped = res?.skippedCount ?? 0;
      toast.success(
        `AI Import Successful: Added ${inserted} tech products to your catalog!${
          skipped > 0 ? ` (${skipped} already existed)` : ''
        }`,
        { id: toastId }
      );
      queryClient.invalidateQueries({ queryKey: ['items'] });
      refetch();
    } catch (err) {
      toast.error(`Import failed: ${err.message || 'Please try again'}`, { id: toastId });
    } finally {
      setIsImporting100(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <PageHeader
        title="Items & Catalog"
        description="Manage your reusable inventory catalog, HSN/SAC codes, and GST rates."
        breadcrumbs={[
          { label: 'Dashboard', href: ROUTES.DASHBOARD },
          { label: 'Items' },
        ]}
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              disabled={isImporting100}
              onClick={handleImportTop100}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
              title="Autonomous Business Development: Instantly import Top 100 Tech Products with statutory HSN and 18% GST"
            >
              <Zap className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
              <span>{isImporting100 ? 'Importing 100 Products...' : '🚀 AI Add Top 100 Tech Products'}</span>
            </button>
            <AIAgentButton
              agentId="catalog"
              label="AI Catalog Agent"
              size="sm"
            />
            <Button
              variant="secondary"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
              leftIcon={RefreshCw}
            >
              Refresh
            </Button>
            {canCreateItem && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate(ROUTES.ADD_ITEM)}
                leftIcon={Plus}
              >
                Add Item
              </Button>
            )}
          </div>
        }
      />

      {/* Autonomous Business Development Intelligence Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-[#0F172A] via-[#1E1B4B] to-[#0F172A] border border-indigo-500/30 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center shrink-0 text-indigo-400 mt-0.5">
            <Sparkles className="w-5 h-5 text-indigo-300 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-sm font-bold text-white">
                Apex Tech Solutions — Autonomous Catalog Expansion Hub
              </h4>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                AI Memory Connected
              </span>
            </div>
            <p className="text-xs text-indigo-200/80 mt-1">
              Top 100 Enterprise IT Products pre-calibrated with 8-digit HSN codes (8471, 8528, 8517, 8443) and 18% GST. Click below or prompt your AI Catalog Agent.
            </p>
          </div>
        </div>

        <button
          type="button"
          disabled={isImporting100}
          onClick={handleImportTop100}
          className="whitespace-nowrap px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow transition-all active:scale-95 cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shrink-0"
        >
          <PackageCheck className="w-4 h-4 text-emerald-300" />
          <span>{isImporting100 ? 'Importing...' : 'Add All 100 Products Now'}</span>
        </button>
      </div>

      {/* Filter / Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-[#0D1118] border border-[#222A38] shadow-sm">
        <div className="w-full sm:w-80">
          <SearchInput
            placeholder="Search items by name or HSN code..."
            value={search}
            onChange={(val) => {
              setSearch(val);
              setPage(1);
            }}
          />
        </div>

        {/* GST Slab Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Filter className="w-3.5 h-3.5 text-[#64748B]" />
          <select
            value={selectedGst}
            onChange={(e) => {
              setSelectedGst(e.target.value);
              setPage(1);
            }}
            className="px-3 py-1.5 rounded-lg bg-[#090C12] border border-[#222A38] text-xs text-[#F8FAFC] focus:outline-none focus:border-[#6366F1] transition-colors"
          >
            <option value="">All GST Slabs</option>
            {GST_RATES.map((rate) => (
              <option key={rate} value={rate}>
                {rate}% GST
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="rounded-xl bg-[#0D1017] border border-[#1E293F] overflow-hidden shadow-sm">
        {isError ? (
          <div className="p-8">
            <ErrorState
              title="Unable to load items"
              message="An error occurred while retrieving your catalog items."
              onRetry={() => refetch()}
            />
          </div>
        ) : (
          <>
            <ItemTable
              items={items}
              isLoading={isLoading}
              onDelete={(item) => setItemToDelete(item)}
              onAddItem={() => navigate(ROUTES.ADD_ITEM)}
            />

            {/* Pagination Controls */}
            {items.length > 0 && pagination.totalPages > 1 && (
              <div className="p-3 border-t border-[#1E293F]">
                <Pagination
                  currentPage={pagination.page || page}
                  totalPages={pagination.totalPages || 1}
                  totalItems={pagination.total || items.length}
                  onPageChange={(p) => setPage(p)}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={Boolean(itemToDelete)}
        title="Delete Item"
        message={`Are you sure you want to delete "${itemToDelete?.name}"? Existing invoices with this item will preserve their historical snapshot, but this item won't be available for new bills.`}
        confirmLabel="Delete Item"
        cancelLabel="Keep Item"
        variant="danger"
        isLoading={deleteMutation.isPending}
        onConfirm={handleDeleteConfirm}
        onClose={() => setItemToDelete(null)}
      />
    </div>
  );
};

export default ItemsPage;
