import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { HomeworkDetailStringified } from "../services/homeworkService";

export interface HomeworkStatusInfo {
  /** 截止日期是否已过 */
  isDeadlinePassed: boolean;
  /** 是否可以提交 */
  canSubmit: boolean;
  /** 距离截止日期的小时数（负数表示已过期） */
  hoursUntilDeadline: number | null;
  /** 状态类型：expired, expiringSoon, inProgress, noDeadline */
  statusType: "expired" | "expiringSoon" | "inProgress" | "noDeadline";
  /** 状态标签文本 */
  statusLabel: string;
  /** 状态徽章变体 */
  statusVariant: "destructive" | "secondary" | "default" | null;
}

/**
 * 作业状态计算 Hook
 * @param homework 作业详情
 * @returns 作业状态相关信息
 */
export function useHomeworkStatus(
  homework: HomeworkDetailStringified | undefined,
): HomeworkStatusInfo {
  const { t } = useTranslation();

  return useMemo(() => {
    if (!homework) {
      return {
        isDeadlinePassed: false,
        canSubmit: false,
        hoursUntilDeadline: null,
        statusType: "noDeadline" as const,
        statusLabel: "",
        statusVariant: null,
      };
    }

    const now = new Date();

    if (!homework.deadline) {
      return {
        isDeadlinePassed: false,
        canSubmit: true,
        hoursUntilDeadline: null,
        statusType: "noDeadline" as const,
        statusLabel: "",
        statusVariant: null,
      };
    }

    const deadline = new Date(homework.deadline);
    const isDeadlinePassed = now > deadline;
    const canSubmit = !isDeadlinePassed || homework.allow_late;
    const hoursUntilDeadline =
      (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);

    let statusType: HomeworkStatusInfo["statusType"];
    let statusLabel: string;
    let statusVariant: HomeworkStatusInfo["statusVariant"];

    if (isDeadlinePassed) {
      statusType = "expired";
      statusLabel = t("homeworkPage.status.expired");
      statusVariant = "destructive";
    } else if (hoursUntilDeadline < 24) {
      statusType = "expiringSoon";
      statusLabel = t("homeworkPage.status.expiringSoon");
      statusVariant = "secondary";
    } else {
      statusType = "inProgress";
      statusLabel = t("homeworkPage.status.inProgress");
      statusVariant = "default";
    }

    return {
      isDeadlinePassed,
      canSubmit,
      hoursUntilDeadline,
      statusType,
      statusLabel,
      statusVariant,
    };
  }, [homework, t]);
}
