import { useTranslation } from "react-i18next";
import { FiBarChart2, FiPlayCircle } from "react-icons/fi";
import { Link } from "react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SubmissionManagementCardProps {
  canGrade: boolean;
  pendingCount: number;
  onStartGrading: () => void;
  prefix: string;
  classId: string;
  homeworkId: string;
}

export function SubmissionManagementCard({
  canGrade,
  pendingCount,
  onStartGrading,
  prefix,
  classId,
  homeworkId,
}: SubmissionManagementCardProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("homeworkPage.submissionManagement")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {canGrade && pendingCount > 0 && (
          <Button className="w-full" onClick={onStartGrading}>
            <FiPlayCircle className="mr-2 h-4 w-4" />
            {t("submission.list.startGrading")}
            <Badge variant="secondary" className="ml-2">
              {pendingCount}
            </Badge>
          </Button>
        )}
        <Button variant="outline" className="w-full" asChild>
          <Link
            to={`${prefix}/classes/${classId}/homework/${homeworkId}/submissions`}
          >
            <FiBarChart2 className="mr-2 h-4 w-4" />
            {t("homeworkPage.viewSubmissions")}
          </Link>
        </Button>
        <Button variant="outline" className="w-full" asChild>
          <Link
            to={`${prefix}/classes/${classId}/homework/${homeworkId}/stats`}
          >
            <FiBarChart2 className="mr-2 h-4 w-4" />
            {t("homeworkPage.homeworkStats")}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
