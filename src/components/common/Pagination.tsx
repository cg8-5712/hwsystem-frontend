"use client";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "lucide-react";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface PaginationProps {
  /** 当前页码（从 1 开始） */
  current: number;
  /** 总记录数 */
  total: number;
  /** 每页显示数量 */
  pageSize: number;
  /** 可选的每页显示数量选项 */
  pageSizeOptions?: number[];
  /** 页码或每页数量变化时的回调 */
  onChange: (page: number, pageSize: number) => void;
  /** 是否显示每页数量选择器 */
  showSizeChanger?: boolean;
  /** 是否显示快速跳转 */
  showQuickJumper?: boolean;
  /** 是否显示总数 */
  showTotal?: boolean;
  /** 自定义类名 */
  className?: string;
  /** 是否禁用 */
  disabled?: boolean;
}

export function Pagination({
  current,
  total,
  pageSize,
  pageSizeOptions = [10, 20, 50, 100],
  onChange,
  showSizeChanger = true,
  showQuickJumper = false,
  showTotal = true,
  className,
  disabled = false,
}: PaginationProps) {
  const { t } = useTranslation();

  // 计算总页数
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / pageSize)),
    [total, pageSize],
  );

  // 生成页码数组
  const pageNumbers = useMemo(() => {
    const pages: (number | "ellipsis-start" | "ellipsis-end")[] = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      // 总页数 <= 7，显示所有页码
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 总页数 > 7，显示省略号
      if (current <= 4) {
        // 当前页靠近开头
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push("ellipsis-end");
        pages.push(totalPages);
      } else if (current >= totalPages - 3) {
        // 当前页靠近结尾
        pages.push(1);
        pages.push("ellipsis-start");
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // 当前页在中间
        pages.push(1);
        pages.push("ellipsis-start");
        for (let i = current - 1; i <= current + 1; i++) {
          pages.push(i);
        }
        pages.push("ellipsis-end");
        pages.push(totalPages);
      }
    }

    return pages;
  }, [current, totalPages]);

  // 页码变化
  const handlePageChange = useCallback(
    (page: number) => {
      if (page < 1 || page > totalPages || page === current || disabled) return;
      onChange(page, pageSize);
    },
    [current, totalPages, pageSize, onChange, disabled],
  );

  // 每页数量变化
  const handlePageSizeChange = useCallback(
    (newSize: string) => {
      const size = Number(newSize);
      if (disabled) return;
      // 切换每页数量时，尽量保持在有效范围内
      const newTotalPages = Math.ceil(total / size);
      const newCurrent = Math.min(current, newTotalPages);
      onChange(newCurrent, size);
    },
    [current, total, onChange, disabled],
  );

  // 键盘导航
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, page: number) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handlePageChange(page);
      }
    },
    [handlePageChange],
  );

  if (total === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between gap-4",
        className,
      )}
    >
      {/* 左侧：总数显示 + 每页数量选择 */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        {showTotal && (
          <span>
            {t("pagination.total", {
              count: total,
              defaultValue: `共 ${total} 条`,
            })}
          </span>
        )}
        {showSizeChanger && (
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline">
              {t("pagination.perPage", { defaultValue: "每页" })}
            </span>
            <Select
              value={String(pageSize)}
              onValueChange={handlePageSizeChange}
              disabled={disabled}
            >
              <SelectTrigger className="h-8 w-[70px]" size="sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="hidden sm:inline">
              {t("pagination.items", { defaultValue: "条" })}
            </span>
          </div>
        )}
      </div>

      {/* 右侧：分页控件 */}
      <div className="flex items-center gap-1">
        {/* 首页 */}
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => handlePageChange(1)}
          disabled={current === 1 || disabled}
          aria-label={t("pagination.firstPage", { defaultValue: "首页" })}
          className="hidden sm:flex"
        >
          <ChevronsLeftIcon className="size-4" />
        </Button>

        {/* 上一页 */}
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => handlePageChange(current - 1)}
          disabled={current === 1 || disabled}
          aria-label={t("pagination.prevPage", { defaultValue: "上一页" })}
        >
          <ChevronLeftIcon className="size-4" />
        </Button>

        {/* 页码按钮（桌面端显示） */}
        <div className="hidden sm:flex items-center gap-1">
          {pageNumbers.map((page, index) => {
            if (page === "ellipsis-start" || page === "ellipsis-end") {
              return (
                <span
                  key={page}
                  className="flex size-8 items-center justify-center text-muted-foreground"
                >
                  ...
                </span>
              );
            }

            return (
              <Button
                key={page}
                variant={page === current ? "default" : "outline"}
                size="icon-sm"
                onClick={() => handlePageChange(page)}
                onKeyDown={(e) => handleKeyDown(e, page)}
                disabled={disabled}
                aria-label={t("pagination.goToPage", {
                  page,
                  defaultValue: `第 ${page} 页`,
                })}
                aria-current={page === current ? "page" : undefined}
              >
                {page}
              </Button>
            );
          })}
        </div>

        {/* 页码显示（移动端） */}
        <span className="sm:hidden px-3 text-sm text-muted-foreground">
          {current} / {totalPages}
        </span>

        {/* 下一页 */}
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => handlePageChange(current + 1)}
          disabled={current === totalPages || disabled}
          aria-label={t("pagination.nextPage", { defaultValue: "下一页" })}
        >
          <ChevronRightIcon className="size-4" />
        </Button>

        {/* 末页 */}
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => handlePageChange(totalPages)}
          disabled={current === totalPages || disabled}
          aria-label={t("pagination.lastPage", { defaultValue: "末页" })}
          className="hidden sm:flex"
        >
          <ChevronsRightIcon className="size-4" />
        </Button>
      </div>
    </div>
  );
}
