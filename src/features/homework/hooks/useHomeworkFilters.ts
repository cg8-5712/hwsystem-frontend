import { useMemo } from "react";
import type { HomeworkListItemStringified } from "../services/homeworkService";

export type TabValue = "all" | "pending" | "submitted" | "graded";
export type SortValue = "deadline" | "created";

export interface TabCounts {
  all: number;
  pending: number;
  submitted: number;
  graded: number;
}

/**
 * 作业列表筛选和排序 Hook
 * @param items 作业列表
 * @param activeTab 当前选中的 Tab
 * @param sort 排序方式
 * @returns 筛选后的列表和各 Tab 计数
 */
export function useHomeworkFilters(
  items: HomeworkListItemStringified[] | undefined,
  activeTab: TabValue,
  sort: SortValue,
) {
  const filteredItems = useMemo(() => {
    if (!items) return [];
    let result = [...items];

    // Tab filter
    if (activeTab === "pending") {
      result = result.filter((hw) => !hw.my_submission);
    } else if (activeTab === "submitted") {
      result = result.filter(
        (hw) =>
          hw.my_submission &&
          (hw.my_submission.status === "pending" ||
            hw.my_submission.status === "late"),
      );
    } else if (activeTab === "graded") {
      result = result.filter((hw) => hw.my_submission?.status === "graded");
    }

    // Sort
    result.sort((a, b) => {
      if (sort === "deadline") {
        if (!a.deadline && !b.deadline) return 0;
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
      // created (by id desc as proxy)
      return Number(b.id) - Number(a.id);
    });

    return result;
  }, [items, activeTab, sort]);

  const tabCounts = useMemo<TabCounts>(() => {
    if (!items) return { all: 0, pending: 0, submitted: 0, graded: 0 };
    return {
      all: items.length,
      pending: items.filter((hw) => !hw.my_submission).length,
      submitted: items.filter(
        (hw) =>
          hw.my_submission &&
          (hw.my_submission.status === "pending" ||
            hw.my_submission.status === "late"),
      ).length,
      graded: items.filter((hw) => hw.my_submission?.status === "graded")
        .length,
    };
  }, [items]);

  return { filteredItems, tabCounts };
}
