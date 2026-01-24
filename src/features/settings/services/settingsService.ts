import api from "@/lib/api";
import type { ApiResponse, User } from "@/types/generated";

export interface UpdateProfileRequest {
  display_name?: string | null;
  email?: string | null;
  password?: string | null;
  avatar_url?: string | null;
}

interface UserResponse {
  user: User;
}

export const settingsService = {
  async updateProfile(data: UpdateProfileRequest): Promise<User> {
    const response = await api.put<ApiResponse<UserResponse>>("/auth/me", data);
    return response.data.data!.user;
  },
};
