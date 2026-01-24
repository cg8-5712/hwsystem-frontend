import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FiArrowLeft } from "react-icons/fi";
import { Link, useNavigate, useParams } from "react-router";
import { z } from "zod";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { notify } from "@/stores/useNotificationStore";
import { useClass, useUpdateClass } from "../hooks/useClass";
import { useRoutePrefix } from "../hooks/useClassBasePath";

function createFormSchema(t: (key: string) => string) {
  return z.object({
    name: z
      .string()
      .min(1, t("classEditPage.validation.nameRequired"))
      .max(100, t("classEditPage.validation.nameMaxLength")),
    description: z
      .string()
      .max(500, t("classEditPage.validation.descriptionMaxLength"))
      .optional(),
  });
}

type FormValues = z.infer<ReturnType<typeof createFormSchema>>;

export function ClassEditPage() {
  const { t } = useTranslation();
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();
  const prefix = useRoutePrefix();
  const { data: classData, isLoading, error } = useClass(classId!);
  const updateClass = useUpdateClass(classId!);

  const formSchema = createFormSchema(t);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (classData) {
      form.reset({
        name: classData.name,
        description: classData.description || "",
      });
    }
  }, [classData, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      await updateClass.mutateAsync({
        name: values.name,
        description: values.description || null,
      });
      notify.success(t("notify.class.updateSuccess"));
      navigate(`${prefix}/classes/${classId}`);
    } catch {
      notify.error(t("notify.class.updateFailed"), t("notify.tryAgainLater"));
    }
  };

  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-destructive">
          {t("common.loadError")}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8">
        <Skeleton className="h-8 w-32 mb-4" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-4 w-48 mt-2" />
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8">
      <Button variant="ghost" asChild className="mb-4">
        <Link to={`${prefix}/classes/${classId}`}>
          <FiArrowLeft className="mr-2 h-4 w-4" />
          {t("classEditPage.backToDetail")}
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>{t("classEditPage.title")}</CardTitle>
          <CardDescription>{t("classEditPage.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("classEditPage.fields.name")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("classEditPage.fields.namePlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {t("classEditPage.fields.nameDescription")}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("classEditPage.fields.descriptionLabel")}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t(
                          "classEditPage.fields.descriptionPlaceholder",
                        )}
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`${prefix}/classes/${classId}`)}
                >
                  {t("classEditPage.cancel")}
                </Button>
                <Button type="submit" disabled={updateClass.isPending}>
                  {updateClass.isPending
                    ? t("classEditPage.saving")
                    : t("classEditPage.save")}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
