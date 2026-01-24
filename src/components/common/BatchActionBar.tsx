"use client";

import { XIcon } from "lucide-react";
import { type ReactNode, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export interface BatchAction {
  /** 操作标签 */
  label: string;
  /** 操作图标 */
  icon?: ReactNode;
  /** 点击回调 */
  onClick: () => void;
  /** 按钮样式变体 */
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost";
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否显示确认对话框（危险操作建议开启） */
  requireConfirm?: boolean;
}

export interface BatchActionBarProps {
  /** 已选中的数量 */
  selectedCount: number;
  /** 总数量 */
  totalCount: number;
  /** 全选回调 */
  onSelectAll: () => void;
  /** 清空选择回调 */
  onClearSelection: () => void;
  /** 是否已全选 */
  isAllSelected?: boolean;
  /** 操作按钮列表 */
  actions: BatchAction[];
  /** 自定义类名 */
  className?: string;
}

/**
 * 批量操作栏组件
 *
 * 当 selectedCount > 0 时显示，提供全选、取消选择和批量操作功能
 */
export function BatchActionBar({
  selectedCount,
  totalCount,
  onSelectAll,
  onClearSelection,
  isAllSelected = false,
  actions,
  className,
}: BatchActionBarProps) {
  const { t } = useTranslation();

  // 没有选中项时不显示
  if (selectedCount === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "sticky top-0 z-10 flex items-center justify-between gap-4 rounded-lg border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-3 shadow-sm",
        className,
      )}
    >
      {/* 左侧：选中信息和全选控制 */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={isAllSelected}
            onCheckedChange={(checked) => {
              if (checked) {
                onSelectAll();
              } else {
                onClearSelection();
              }
            }}
            aria-label={
              isAllSelected
                ? t("batch.deselectAll", { defaultValue: "取消全选" })
                : t("batch.selectAll", { defaultValue: "全选" })
            }
          />
          <span className="text-sm font-medium">
            {t("batch.selected", {
              count: selectedCount,
              total: totalCount,
              defaultValue: `已选择 ${selectedCount} / ${totalCount} 项`,
            })}
          </span>
        </div>

        {/* 全选/取消全选按钮 */}
        <div className="hidden sm:flex items-center gap-2">
          {!isAllSelected && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onSelectAll}
              className="text-primary hover:text-primary"
            >
              {t("batch.selectAll", { defaultValue: "全选" })}
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            className="text-muted-foreground"
          >
            <XIcon className="size-4 mr-1" />
            {t("batch.clear", { defaultValue: "取消" })}
          </Button>
        </div>
      </div>

      {/* 右侧：操作按钮 */}
      <div className="flex items-center gap-2">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant={action.variant || "outline"}
            size="sm"
            onClick={action.onClick}
            disabled={action.disabled}
            className="cursor-pointer"
          >
            {action.icon && <span className="mr-1">{action.icon}</span>}
            <span className="hidden sm:inline">{action.label}</span>
            {/* 移动端只显示图标，如果没有图标则显示文字 */}
            {!action.icon && <span className="sm:hidden">{action.label}</span>}
          </Button>
        ))}
      </div>
    </div>
  );
}

/**
 * 批量选择 Hook
 *
 * 提供批量选择的状态管理
 */
export function useBatchSelection<T extends { id: string | number }>(
  items: T[],
) {
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(
    new Set(),
  );

  // 是否选中某项
  const isSelected = useCallback(
    (id: string | number) => selectedIds.has(id),
    [selectedIds],
  );

  // 切换选中状态
  const toggleSelection = useCallback((id: string | number) => {
    setSelectedIds((prev: Set<string | number>) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  // 全选
  const selectAll = useCallback(() => {
    setSelectedIds(new Set(items.map((item) => item.id)));
  }, [items]);

  // 清空选择
  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  // 是否全选
  const isAllSelected = useMemo(
    () => items.length > 0 && selectedIds.size === items.length,
    [items.length, selectedIds.size],
  );

  // 是否部分选中
  const isPartiallySelected = useMemo(
    () => selectedIds.size > 0 && selectedIds.size < items.length,
    [items.length, selectedIds.size],
  );

  // 选中的项
  const selectedItems = useMemo(
    () => items.filter((item) => selectedIds.has(item.id)),
    [items, selectedIds],
  );

  return {
    selectedIds,
    selectedCount: selectedIds.size,
    selectedItems,
    isSelected,
    toggleSelection,
    selectAll,
    clearSelection,
    isAllSelected,
    isPartiallySelected,
  };
}
