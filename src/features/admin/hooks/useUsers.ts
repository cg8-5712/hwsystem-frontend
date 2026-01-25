import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApiError } from "@/hooks/useApiError";
import { useNotificationStore } from "@/stores/useNotificationStore";
import {
  type CreateUserRequest,
  type UpdateUserRequest,
  type UserDetail,
  type UserExportParams,
  type UserImportResponseStringified,
  type UserListParams,
  userService,
} from "../services/userService";

// Query key factory
export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (params: UserListParams) => [...userKeys.lists(), params] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

// 获取用户列表
export function useUserList(params: UserListParams = {}) {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => userService.list(params),
  });
}

// 获取用户详情
export function useUser(id: string | undefined) {
  return useQuery({
    queryKey: userKeys.detail(id!),
    queryFn: () => userService.get(id!),
    enabled: !!id,
  });
}

// 创建用户
export function useCreateUser() {
  const queryClient = useQueryClient();
  const success = useNotificationStore((s) => s.success);
  const { handleError } = useApiError();

  return useMutation({
    mutationFn: (data: CreateUserRequest) => userService.create(data),
    onSuccess: (user) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      success("创建成功", `用户 ${user.username} 已创建`);
    },
    onError: (err) => {
      handleError(err, { title: "创建失败" });
    },
  });
}

// 更新用户
export function useUpdateUser() {
  const queryClient = useQueryClient();
  const success = useNotificationStore((s) => s.success);
  const { handleError } = useApiError();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserRequest }) =>
      userService.update(id, data),
    onSuccess: (user) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(user.id) });
      success("更新成功", `用户 ${user.username} 已更新`);
    },
    onError: (err) => {
      handleError(err, { title: "更新失败" });
    },
  });
}

// 删除用户
export function useDeleteUser() {
  const queryClient = useQueryClient();
  const success = useNotificationStore((s) => s.success);
  const { handleError } = useApiError();

  return useMutation({
    mutationFn: (id: string) => userService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      success("删除成功", "用户已删除");
    },
    onError: (err) => {
      handleError(err, { title: "删除失败" });
    },
  });
}

// 导入用户
export function useImportUsers() {
  const queryClient = useQueryClient();
  const { handleError } = useApiError();

  return useMutation({
    mutationFn: (file: File) => userService.import(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    onError: (err) => {
      handleError(err, { title: "导入失败" });
    },
  });
}

// 导出用户
export function useExportUsers() {
  const { handleError } = useApiError();
  const success = useNotificationStore((s) => s.success);

  return useMutation({
    mutationFn: (params: UserExportParams) => userService.export(params),
    onSuccess: (blob, params) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `users.${params.format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      success("导出成功", "用户数据已下载");
    },
    onError: (err) => {
      handleError(err, { title: "导出失败" });
    },
  });
}

// 下载导入模板
export function useDownloadImportTemplate() {
  const { handleError } = useApiError();

  return useMutation({
    mutationFn: (format: "csv" | "xlsx") =>
      userService.downloadTemplate(format),
    onSuccess: (blob, format) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `user_import_template.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    onError: (err) => {
      handleError(err, { title: "下载模板失败" });
    },
  });
}

export type {
  UserDetail,
  CreateUserRequest,
  UpdateUserRequest,
  UserImportResponseStringified,
};
