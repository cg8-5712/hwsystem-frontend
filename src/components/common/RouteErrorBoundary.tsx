import { useTranslation } from "react-i18next";
import {
  FiAlertTriangle,
  FiArrowLeft,
  FiHome,
  FiRefreshCw,
} from "react-icons/fi";
import { isRouteErrorResponse, Link, useRouteError } from "react-router";

/**
 * 路由错误边界组件
 * 使用 React Router v6+ 的 useRouteError() hook 处理路由层面的错误
 */
export function RouteErrorBoundary() {
  const { t } = useTranslation();
  const error = useRouteError();

  // 判断是否为 404 错误
  const is404 = isRouteErrorResponse(error) && error.status === 404;

  // 404 页面样式（复用 NotFoundPage 的设计）
  if (is404) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div className="text-center">
          <p className="text-9xl font-bold text-blue-600 dark:text-blue-400">
            404
          </p>
          <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
            {t("error.notFound.title")}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-md">
            {t("error.notFound.description")}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <FiArrowLeft className="h-4 w-4" />
              {t("error.notFound.goBack")}
            </button>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              <FiHome className="h-4 w-4" />
              {t("error.notFound.goHome")}
            </Link>
          </div>

          <div className="mt-12">
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
              {t("error.notFound.suggestions")}
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                to="/"
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                {t("nav.home")}
              </Link>
              <Link
                to="/about"
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                {t("nav.about")}
              </Link>
              <Link
                to="/contact"
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                {t("nav.contact")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 通用错误页面
  const errorMessage =
    error instanceof Error
      ? error.message
      : isRouteErrorResponse(error)
        ? error.statusText
        : t("common.unknownError");

  const statusCode = isRouteErrorResponse(error) ? error.status : null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
          <FiAlertTriangle className="w-8 h-8 text-destructive" />
        </div>

        <div className="space-y-2">
          {statusCode && (
            <p className="text-4xl font-bold text-destructive">{statusCode}</p>
          )}
          <h1 className="text-2xl font-semibold text-foreground">
            {t("errorPage.title")}
          </h1>
          <p className="text-muted-foreground">{t("errorPage.description")}</p>
        </div>

        {/* 开发环境显示错误详情 */}
        {import.meta.env.DEV && errorMessage && (
          <div className="text-left p-4 bg-muted rounded-lg overflow-auto max-h-48">
            <p className="text-sm font-mono text-destructive break-words">
              {errorMessage}
            </p>
          </div>
        )}

        <div className="flex gap-3 justify-center">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <FiArrowLeft className="w-4 h-4" />
            {t("error.notFound.goBack")}
          </button>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <FiRefreshCw className="w-4 h-4" />
            {t("errorPage.refresh")}
          </button>
        </div>

        <Link
          to="/"
          className="text-sm text-muted-foreground hover:text-foreground underline"
        >
          {t("errorPage.backHome")}
        </Link>
      </div>
    </div>
  );
}

export default RouteErrorBoundary;
