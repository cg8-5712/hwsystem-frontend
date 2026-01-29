import { useTranslation } from "react-i18next";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { HomeworkDetailStringified } from "../services/homeworkService";

interface HomeworkInfoCardProps {
  homework: HomeworkDetailStringified | undefined;
}

export function HomeworkInfoCard({ homework }: HomeworkInfoCardProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("homeworkPage.homeworkInfo")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {homework?.creator && (
          <div>
            <p className="text-sm text-muted-foreground">
              {t("homeworkPage.creator")}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <Avatar className="h-6 w-6">
                <AvatarImage src={homework.creator?.avatar_url || undefined} />
                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                  {(homework.creator.display_name ||
                    homework.creator.username ||
                    "?")[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <p className="font-medium">
                {homework.creator.display_name || homework.creator.username}
              </p>
            </div>
          </div>
        )}
        <div>
          <p className="text-sm text-muted-foreground">
            {t("homeworkPage.deadline")}
          </p>
          <p className="font-medium">
            {homework?.deadline
              ? new Date(homework.deadline).toLocaleString()
              : t("homeworkPage.noDeadline")}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">
            {t("homeworkPage.allowLate")}
          </p>
          <p className="font-medium">
            {homework?.allow_late
              ? t("homeworkPage.yes")
              : t("homeworkPage.no")}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">
            {t("homeworkPage.attachmentCount")}
          </p>
          <p className="font-medium">
            {homework?.attachments?.length || 0}{" "}
            {t("homeworkPage.attachmentUnit")}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
