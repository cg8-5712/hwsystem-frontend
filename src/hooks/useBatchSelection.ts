import { useCallback, useMemo, useState } from "react";

/**
 * 通用批量选择 Hook
 * @param items 需要批量选择的项目列表
 * @returns 批量选择相关状态和操作函数
 */
export function useBatchSelection<T extends { id: string }>(items: T[]) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const isSelected = useCallback(
    (id: string) => selectedIds.has(id),
    [selectedIds],
  );

  const toggleSelection = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const selectAll = useCallback(() => {
    setSelectedIds(new Set(items.map((item) => item.id)));
  }, [items]);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const isAllSelected = useMemo(
    () => items.length > 0 && selectedIds.size === items.length,
    [items.length, selectedIds.size],
  );

  return {
    selectedIds,
    selectedCount: selectedIds.size,
    isSelected,
    toggleSelection,
    selectAll,
    clearSelection,
    isAllSelected,
  };
}
