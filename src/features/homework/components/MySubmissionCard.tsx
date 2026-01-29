import { useTranslation } from "react-i18next";
import { FiUpload } from "react-icons/fi";
import { Link } from "react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SubmissionDetail } from "@/features/submission/services/submissionService";

interface MySubmissionCardProps {
  submission: SubmissionDetail | undefined;
  maxScore: number | undefined;
  canSubmit: boolean;
  prefix: string;
  classId: string;
  homeworkId: string;
}

export function MySubmissionCard({
  submission,
  maxScore,
  canSubmit,
  prefix,
  classId,
  homeworkId,
}: MySubmissionCardProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("homeworkPage.mySubmission")}</CardTitle>
      </CardHeader>
      <CardContent>
        {submission ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("homeworkPage.submissionVersion", {
                    version: submission.version,
                  })}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t("homeworkPage.submittedAt")}{" "}
                  {new Date(submission.submitted_at).toLocaleString()}
                </p>
              </div>
              <div>
                {submission.grade ? (
                  <Badge variant="default">
                    {submission.grade.score} / {maxScore}
                  </Badge>
                ) : (
                  <Badge variant="secondary">
                    {t("homeworkPage.pendingGrade")}
                  </Badge>
                )}
              </div>
            </div>
            {submission.grade?.comment && (
              <div className="p-3 rounded-lg bg-muted">
                <p className="text-sm text-muted-foreground">
                  {t("homeworkPage.teacherComment")}
                </p>
                <p className="mt-1">{submission.grade.comment}</p>
              </div>
            )}
            <div className="flex gap-3">
              <Button variant="outline" asChild>
                <Link to={`${prefix}/homework/${homeworkId}/submissions`}>
                  {t("homeworkPage.viewHistory")}
                </Link>
              </Button>
              {canSubmit && (
                <Button asChild>
                  <Link
                    to={`${prefix}/classes/${classId}/homework/${homeworkId}/submit`}
                  >
                    <FiUpload className="mr-2 h-4 w-4" />
                    {t("homeworkPage.resubmit")}
                  </Link>
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">
              {t("homeworkPage.notSubmitted")}
            </p>
            {canSubmit ? (
              <Button asChild>
                <Link
                  to={`${prefix}/classes/${classId}/homework/${homeworkId}/submit`}
                >
                  <FiUpload className="mr-2 h-4 w-4" />
                  {t("homeworkPage.submitHomework")}
                </Link>
              </Button>
            ) : (
              <p className="text-sm text-destructive">
                {t("homeworkPage.deadlinePassed")}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
