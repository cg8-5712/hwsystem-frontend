import { useTranslation } from "react-i18next";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { TabCounts, TabValue } from "../hooks/useHomeworkFilters";

interface HomeworkStatusTabsProps {
  activeTab: TabValue;
  setActiveTab: (value: TabValue) => void;
  tabCounts: TabCounts;
}

export function HomeworkStatusTabs({
  activeTab,
  setActiveTab,
  tabCounts,
}: HomeworkStatusTabsProps) {
  const { t } = useTranslation();

  return (
    <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)}>
      <TabsList className="w-full sm:w-auto">
        <TabsTrigger value="all">
          {t("homework.tabs.all")}({tabCounts.all})
        </TabsTrigger>
        <TabsTrigger value="pending">
          {t("homework.tabs.pending")}({tabCounts.pending})
        </TabsTrigger>
        <TabsTrigger value="submitted">
          {t("homework.tabs.submitted")}({tabCounts.submitted})
        </TabsTrigger>
        <TabsTrigger value="graded">
          {t("homework.tabs.graded")}({tabCounts.graded})
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
