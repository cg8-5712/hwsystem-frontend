import imageCompression from "browser-image-compression";
import { Download, Upload, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CompressionParams {
  quality: string;
  maxWidth: string;
  maxHeight: string;
}

interface ImageCompressionTesterProps {
  onApplySettings: (params: CompressionParams) => void;
}

export function ImageCompressionTester({
  onApplySettings,
}: ImageCompressionTesterProps) {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(0.85);
  const [maxWidth, setMaxWidth] = useState(1920);
  const [maxHeight, setMaxHeight] = useState(1920);
  const [compressedFile, setCompressedFile] = useState<File | null>(null);
  const [compressionTime, setCompressionTime] = useState(0);
  const [isCompressing, setIsCompressing] = useState(false);
  const [originalPreview, setOriginalPreview] = useState<string>("");
  const [compressedPreview, setCompressedPreview] = useState<string>("");

  const compressTestImage = useCallback(async () => {
    if (!file) return;

    setIsCompressing(true);
    const startTime = performance.now();

    try {
      const compressed = await imageCompression(file, {
        maxWidthOrHeight: Math.max(maxWidth, maxHeight),
        useWebWorker: true,
        initialQuality: quality,
      });

      setCompressionTime(performance.now() - startTime);
      setCompressedFile(compressed);

      // 生成预览
      if (compressedPreview) URL.revokeObjectURL(compressedPreview);
      setCompressedPreview(URL.createObjectURL(compressed));
    } catch (error) {
      toast.error(`压缩失败: ${(error as Error).message}`);
    } finally {
      setIsCompressing(false);
    }
  }, [file, quality, maxWidth, maxHeight, compressedPreview]);

  // 当参数或文件变化时，自动重新压缩
  useEffect(() => {
    if (file) {
      compressTestImage();
    }
  }, [file, compressTestImage]);

  // 清理预览 URL
  useEffect(() => {
    return () => {
      if (originalPreview) URL.revokeObjectURL(originalPreview);
      if (compressedPreview) URL.revokeObjectURL(compressedPreview);
    };
  }, [originalPreview, compressedPreview]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      toast.error("请选择图片文件");
      return;
    }

    setFile(selectedFile);
    setOriginalPreview(URL.createObjectURL(selectedFile));
    setCompressedFile(null);
    setCompressedPreview("");
  };

  const handleApplySettings = () => {
    if (!file) {
      toast.error("请先上传测试图片");
      return;
    }

    onApplySettings({
      quality: quality.toString(),
      maxWidth: maxWidth.toString(),
      maxHeight: maxHeight.toString(),
    });
    toast.success("压缩参数已应用到系统配置");
  };

  const handleDownload = () => {
    if (!compressedFile) return;

    const url = URL.createObjectURL(compressedFile);
    const link = document.createElement("a");
    link.href = url;
    link.download = `compressed_${file?.name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setFile(null);
    setCompressedFile(null);
    if (originalPreview) URL.revokeObjectURL(originalPreview);
    if (compressedPreview) URL.revokeObjectURL(compressedPreview);
    setOriginalPreview("");
    setCompressedPreview("");
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  const compressionRate =
    file && compressedFile
      ? ((1 - compressedFile.size / file.size) * 100).toFixed(1)
      : "0";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Upload className="h-5 w-5" />
          图片压缩测试
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          上传测试图片，实时调整参数查看压缩效果
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 上传区域 */}
        <div>
          <Label htmlFor="test-image">选择测试图片</Label>
          <div className="mt-2 flex items-center gap-2">
            <Input
              id="test-image"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="flex-1"
            />
            {file && (
              <Button variant="ghost" size="icon" onClick={handleClear}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          {file && (
            <p className="mt-1 text-sm text-muted-foreground">{file.name}</p>
          )}
        </div>

        {/* 参数调整区域 */}
        <div className="space-y-4">
          {/* 压缩质量 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>压缩质量</Label>
              <Input
                type="number"
                min="0.1"
                max="1"
                step="0.05"
                value={quality}
                onChange={(e) => setQuality(parseFloat(e.target.value))}
                className="w-20 h-8 text-sm"
              />
            </div>
            <input
              type="range"
              value={quality}
              onChange={(e) => setQuality(parseFloat(e.target.value))}
              min={0.1}
              max={1}
              step={0.05}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              当前: {(quality * 100).toFixed(0)}% （推荐 70-90%）
            </p>
          </div>

          {/* 最大宽度 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>最大宽度（像素）</Label>
              <Input
                type="number"
                min="500"
                max="4000"
                step="100"
                value={maxWidth}
                onChange={(e) => setMaxWidth(parseInt(e.target.value, 10))}
                className="w-24 h-8 text-sm"
              />
            </div>
            <input
              type="range"
              value={maxWidth}
              onChange={(e) => setMaxWidth(parseInt(e.target.value, 10))}
              min={500}
              max={4000}
              step={100}
              className="w-full"
            />
          </div>

          {/* 最大高度 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>最大高度（像素）</Label>
              <Input
                type="number"
                min="500"
                max="4000"
                step="100"
                value={maxHeight}
                onChange={(e) => setMaxHeight(parseInt(e.target.value, 10))}
                className="w-24 h-8 text-sm"
              />
            </div>
            <input
              type="range"
              value={maxHeight}
              onChange={(e) => setMaxHeight(parseInt(e.target.value, 10))}
              min={500}
              max={4000}
              step={100}
              className="w-full"
            />
          </div>
        </div>

        {/* 对比区域 */}
        {file && (
          <div className="grid grid-cols-2 gap-4 border rounded-lg p-4">
            {/* 原图 */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm">原图</h4>
              {originalPreview && (
                <img
                  src={originalPreview}
                  alt="原图"
                  className="w-full h-48 object-contain border rounded bg-muted"
                />
              )}
              <div className="text-sm space-y-1">
                <p className="text-muted-foreground">
                  大小:{" "}
                  <span className="font-medium text-foreground">
                    {formatFileSize(file.size)}
                  </span>
                </p>
              </div>
            </div>

            {/* 压缩后 */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm">压缩后</h4>
              {isCompressing ? (
                <div className="w-full h-48 flex items-center justify-center border rounded bg-muted">
                  <p className="text-sm text-muted-foreground">压缩中...</p>
                </div>
              ) : compressedPreview ? (
                <img
                  src={compressedPreview}
                  alt="压缩后"
                  className="w-full h-48 object-contain border rounded bg-muted"
                />
              ) : (
                <div className="w-full h-48 flex items-center justify-center border rounded bg-muted">
                  <p className="text-sm text-muted-foreground">等待压缩</p>
                </div>
              )}
              {compressedFile && (
                <div className="text-sm space-y-1">
                  <p className="text-muted-foreground">
                    大小:{" "}
                    <span className="font-medium text-foreground">
                      {formatFileSize(compressedFile.size)}
                    </span>
                  </p>
                  <p className="text-muted-foreground">
                    减少:{" "}
                    <span className="font-medium text-green-600">
                      {compressionRate}%
                    </span>
                  </p>
                  <p className="text-muted-foreground">
                    用时:{" "}
                    <span className="font-medium text-foreground">
                      {compressionTime.toFixed(0)} ms
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 操作按钮 */}
        <div className="flex gap-2">
          <Button onClick={handleApplySettings} disabled={!file}>
            应用参数到系统
          </Button>
          <Button
            variant="outline"
            onClick={handleDownload}
            disabled={!compressedFile}
          >
            <Download className="h-4 w-4 mr-2" />
            下载压缩后图片
          </Button>
          <Button variant="ghost" onClick={handleClear} disabled={!file}>
            清除
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
