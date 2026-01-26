import { useMutation, useQueryClient } from "@tanstack/react-query";
import { homeworkKeys } from "@/features/homework/hooks/useHomework";
import { submissionKeys } from "@/features/submission/hooks/useSubmission";
import type { UpdateGradeRequest } from "@/types/generated";
import { type CreateGradeInput, gradeService } from "../services/gradeService";

// Query Keys
export const gradeKeys = {
  all: ["grades"] as const,
  detail: (submissionId: string) => [...gradeKeys.all, submissionId] as const,
};

// Mutations
export function useCreateGrade(submissionId: string, homeworkId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateGradeInput) =>
      gradeService.create(submissionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: gradeKeys.detail(submissionId),
      });
      queryClient.invalidateQueries({ queryKey: submissionKeys.lists() });
      // 失效提交详情，因为它包含评分信息
      queryClient.invalidateQueries({
        queryKey: submissionKeys.detail(submissionId),
      });
      // 失效提交概览和作业统计
      if (homeworkId) {
        queryClient.invalidateQueries({
          queryKey: [...submissionKeys.all, "summary", homeworkId],
        });
        queryClient.invalidateQueries({
          queryKey: homeworkKeys.stats(homeworkId),
        });
      }
    },
  });
}

export function useUpdateGrade(
  gradeId: string,
  options?: { submissionId?: string; homeworkId?: string },
) {
  const queryClient = useQueryClient();
  const submissionId = options?.submissionId;
  const homeworkId = options?.homeworkId;

  return useMutation({
    mutationFn: (data: UpdateGradeRequest) =>
      gradeService.update(gradeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gradeKeys.all });
      queryClient.invalidateQueries({ queryKey: submissionKeys.lists() });
      // 失效提交详情，因为它包含评分信息
      if (submissionId) {
        queryClient.invalidateQueries({
          queryKey: submissionKeys.detail(submissionId),
        });
      }
      // 失效提交概览和作业统计
      if (homeworkId) {
        queryClient.invalidateQueries({
          queryKey: [...submissionKeys.all, "summary", homeworkId],
        });
        queryClient.invalidateQueries({
          queryKey: homeworkKeys.stats(homeworkId),
        });
      }
    },
  });
}
