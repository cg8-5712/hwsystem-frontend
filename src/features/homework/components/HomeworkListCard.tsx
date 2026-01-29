import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiBook, FiPlus } from "react-icons/fi";
import { Link } from "react-router";
import { Pagination } from "@/components/common/Pagination";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebouncedSearch } from "@/hooks/useDebouncedSearch";
import { SMALL_LIST_PAGE_SIZE, SMALL_PAGE_SIZE_OPTIONS } from "@/lib/constants";
import { useCurrentUser } from "@/stores/useUserStore";
import { useHomeworkList } from "../hooks/useHomework";
import {
  type SortValue,
  type TabValue,
  useHomeworkFilters,
} from "../hooks/useHomeworkFilters";
import { HomeworkListItem } from "./HomeworkListItem";
import { HomeworkListToolbar } from "./HomeworkListToolbar";
import { HomeworkStatusTabs } from "./HomeworkStatusTabs";

interface HomeworkListCardProps {
  classId: string;
  isTeacher: boolean;
  basePath: string;
}

export function HomeworkListCard({
  classId,
  isTeacher,
  basePath,
}: HomeworkListCardProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabValue>("all");
  const [sort, setSort] = useState<SortValue>("deadline");
  const [onlyMine, setOnlyMine] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(SMALL_LIST_PAGE_SIZE);
  const currentUser = useCurrentUser();

  const { search, setSearch, debouncedSearch } = useDebouncedSearch({
    onSearchChange: () => setPage(1),
  });

  // Fetch data with server-side search
  const { data: homeworkData, isLoading } = useHomeworkList(classId, {
    page_size: 200,
    search: debouncedSearch || undefined,
    created_by:
      isTeacher && onlyMine && currentUser?.id
        ? String(currentUser.id)
        : undefined,
    include_stats: isTeacher,
  });

  const items = homeworkData?.items;

  // 使用 useHomeworkFilters Hook 进行筛选和计数
  const { filteredItems, tabCounts } = useHomeworkFilters(
    items,
    activeTab,
    sort,
  );

  // 对筛选后的结果进行分页
  const paginatedItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, page, pageSize]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{t("homework.list.title")}</CardTitle>
          <CardDescription>
            {t("homework.list.count", { count: items?.length ?? 0 })}
          </CardDescription>
        </div>
        {isTeacher && (
          <Button asChild size="sm">
            <Link to={`${basePath}/homework/create`}>
              <FiPlus className="mr-2 h-4 w-4" />
              {t("homework.list.createHomework")}
            </Link>
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Toolbar */}
        <HomeworkListToolbar
          search={search}
          setSearch={setSearch}
          sort={sort}
          setSort={setSort}
          onlyMine={onlyMine}
          setOnlyMine={setOnlyMine}
          isTeacher={isTeacher}
        />

        {/* Tabs */}
        {!isTeacher && (
          <HomeworkStatusTabs
            activeTab={activeTab}
            setActiveTab={(v) => {
              setActiveTab(v);
              setPage(1); // Tab 切换时重置页码
            }}
            tabCounts={tabCounts}
          />
        )}

        {/* List */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20" />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <FiBook className="mx-auto h-12 w-12 mb-4" />
            <p>{t("homework.list.empty")}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {paginatedItems.map((hw) => (
              <HomeworkListItem
                key={hw.id}
                homework={hw}
                basePath={basePath}
                isTeacher={isTeacher}
              />
            ))}
          </div>
        )}

        {/* 分页 */}
        {filteredItems.length > 0 && (
          <Pagination
            current={page}
            total={filteredItems.length}
            pageSize={pageSize}
            pageSizeOptions={SMALL_PAGE_SIZE_OPTIONS}
            onChange={(newPage, newPageSize) => {
              setPage(newPage);
              setPageSize(newPageSize);
            }}
            showTotal
            showSizeChanger
          />
        )}
      </CardContent>
    </Card>
  );
}
