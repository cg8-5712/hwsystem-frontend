import { useTranslation } from "react-i18next";
import { FiSearch } from "react-icons/fi";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SortValue } from "../hooks/useHomeworkFilters";

interface HomeworkListToolbarProps {
  search: string;
  setSearch: (value: string) => void;
  sort: SortValue;
  setSort: (value: SortValue) => void;
  onlyMine: boolean;
  setOnlyMine: (value: boolean) => void;
  isTeacher: boolean;
}

export function HomeworkListToolbar({
  search,
  setSearch,
  sort,
  setSort,
  onlyMine,
  setOnlyMine,
  isTeacher,
}: HomeworkListToolbarProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t("homework.list.searchPlaceholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>
      {isTeacher && (
        <div className="flex items-center gap-2">
          <Checkbox
            id="only-mine"
            checked={onlyMine}
            onCheckedChange={(checked) => setOnlyMine(checked === true)}
          />
          <label
            htmlFor="only-mine"
            className="text-sm cursor-pointer select-none"
          >
            {t("homework.filter.onlyMine")}
          </label>
        </div>
      )}
      <Select value={sort} onValueChange={(v) => setSort(v as SortValue)}>
        <SelectTrigger className="w-full sm:w-36">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="deadline">
            {t("homework.sort.deadline")}
          </SelectItem>
          <SelectItem value="created">{t("homework.sort.created")}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
