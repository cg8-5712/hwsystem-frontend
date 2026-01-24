import { useMutation } from "@tanstack/react-query";
import { useUserStore } from "@/stores/useUserStore";
import {
  settingsService,
  type UpdateProfileRequest,
} from "../services/settingsService";

export function useUpdateProfile() {
  return useMutation({
    mutationFn: (data: UpdateProfileRequest) =>
      settingsService.updateProfile(data),
    onSuccess: (user) => {
      // 更新全局用户状态
      useUserStore.setState({ currentUser: user });
    },
  });
}
