import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FiSave, FiUser } from "react-icons/fi";
import { z } from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { notify } from "@/stores/useNotificationStore";
import { useCurrentUser } from "@/stores/useUserStore";
import { useUpdateProfile } from "../hooks/useSettings";

const formSchema = z
  .object({
    display_name: z.string().max(50, "显示名称不能超过50个字符").optional(),
    email: z
      .string()
      .email("请输入有效的邮箱地址")
      .optional()
      .or(z.literal("")),
    password: z
      .string()
      .min(6, "密码至少需要6个字符")
      .optional()
      .or(z.literal("")),
    confirm_password: z.string().optional().or(z.literal("")),
    avatar_url: z.string().url("请输入有效的URL").optional().or(z.literal("")),
  })
  .refine(
    (data) => {
      if (data.password && data.password !== data.confirm_password) {
        return false;
      }
      return true;
    },
    {
      message: "两次输入的密码不一致",
      path: ["confirm_password"],
    },
  );

type FormValues = z.infer<typeof formSchema>;

export function SettingsPage() {
  const { t } = useTranslation();
  const user = useCurrentUser();
  const updateProfile = useUpdateProfile();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      display_name: user?.display_name || "",
      email: user?.email || "",
      password: "",
      confirm_password: "",
      avatar_url: user?.avatar_url || "",
    },
  });

  // 当用户信息变化时重置表单
  useEffect(() => {
    if (user) {
      form.reset({
        display_name: user.display_name || "",
        email: user.email || "",
        password: "",
        confirm_password: "",
        avatar_url: user.avatar_url || "",
      });
    }
  }, [user, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      // 只发送有变化的字段
      const updateData: Record<string, string | null> = {};

      if (values.display_name !== (user?.display_name || "")) {
        updateData.display_name = values.display_name || null;
      }

      if (values.email !== (user?.email || "")) {
        updateData.email = values.email || null;
      }

      if (values.password) {
        updateData.password = values.password;
      }

      if (values.avatar_url !== (user?.avatar_url || "")) {
        updateData.avatar_url = values.avatar_url || null;
      }

      // 如果没有任何变化，提示用户
      if (Object.keys(updateData).length === 0) {
        notify.info(t("notify.settings.noChanges"));
        return;
      }

      await updateProfile.mutateAsync(updateData);
      notify.success(t("notify.settings.updated"));

      // 清空密码字段
      form.setValue("password", "");
      form.setValue("confirm_password", "");
    } catch {
      notify.error(
        t("notify.settings.updateFailed"),
        t("notify.tryAgainLater"),
      );
    }
  };

  const getInitial = () => {
    if (user?.display_name) {
      return user.display_name[0].toUpperCase();
    }
    if (user?.username) {
      return user.username[0].toUpperCase();
    }
    return "?";
  };

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">账户设置</h1>
        <p className="text-muted-foreground mt-1">管理你的个人资料和账户信息</p>
      </div>

      <div className="space-y-6">
        {/* 用户信息卡片 */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user?.avatar_url || undefined} />
                <AvatarFallback className="text-xl bg-primary/10 text-primary">
                  {getInitial()}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{user?.display_name || user?.username}</CardTitle>
                <CardDescription>@{user?.username}</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* 编辑表单 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FiUser className="h-5 w-5" />
              个人资料
            </CardTitle>
            <CardDescription>更新你的显示名称、邮箱和密码</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* 用户名（只读） */}
                <div>
                  <label className="text-sm font-medium">用户名</label>
                  <Input
                    value={user?.username || ""}
                    disabled
                    className="mt-2 bg-muted"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    用户名创建后无法更改
                  </p>
                </div>

                {/* 显示名称 */}
                <FormField
                  control={form.control}
                  name="display_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>显示名称</FormLabel>
                      <FormControl>
                        <Input placeholder="输入显示名称" {...field} />
                      </FormControl>
                      <FormDescription>
                        这是在系统中显示的名称，可以是你的真实姓名或昵称
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* 邮箱 */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>邮箱</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="输入邮箱地址"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* 新密码 */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>新密码</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="留空则不更改密码"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        至少6个字符，留空表示不更改密码
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* 确认密码 */}
                <FormField
                  control={form.control}
                  name="confirm_password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>确认新密码</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="再次输入新密码"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* 头像 URL */}
                <FormField
                  control={form.control}
                  name="avatar_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>头像 URL</FormLabel>
                      <FormControl>
                        <Input placeholder="输入头像图片的 URL" {...field} />
                      </FormControl>
                      <FormDescription>
                        输入一个图片的 URL 作为你的头像
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={updateProfile.isPending}>
                  <FiSave className="mr-2 h-4 w-4" />
                  {updateProfile.isPending ? "保存中..." : "保存更改"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
