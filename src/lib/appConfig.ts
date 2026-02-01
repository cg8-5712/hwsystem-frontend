import type { ClientConfigResponse } from "@/types/generated/system";

// 全局配置缓存
const config = {
  apiTimeout: 10000,
  fileOperationTimeout: 120000,
  maxFileSize: 10485760,
  allowedFileTypes: [] as string[],
  // 图片压缩配置
  clientCompressEnabled: false,
  compressThreshold: 2097152, // 2MB
  compressQuality: 0.85,
  compressMaxWidth: 1920,
  compressMaxHeight: 1920,
};

// 从后端加载配置
export async function loadAppConfig(): Promise<void> {
  try {
    const response = await fetch("/api/v1/system/client-config", {
      credentials: "include",
    });
    const data = await response.json();

    if (data.code === 0 && data.data) {
      const cfg: ClientConfigResponse = data.data;
      config.apiTimeout = Number(cfg.api_timeout);
      config.fileOperationTimeout = Number(cfg.file_operation_timeout);
      config.maxFileSize = parseInt(cfg.max_file_size, 10);
      config.allowedFileTypes = cfg.allowed_file_types;
      // 加载压缩配置
      config.clientCompressEnabled = cfg.client_compress_enabled;
      config.compressThreshold = parseInt(cfg.compress_threshold, 10);
      config.compressQuality = cfg.compress_quality;
      config.compressMaxWidth = cfg.compress_max_width;
      config.compressMaxHeight = cfg.compress_max_height;
    }
  } catch (error) {
    console.warn("Failed to load app config, using defaults:", error);
  }
}

// 导出配置访问器
export const AppConfig = {
  get apiTimeout() {
    return config.apiTimeout;
  },
  get fileOperationTimeout() {
    return config.fileOperationTimeout;
  },
  get maxFileSize() {
    return config.maxFileSize;
  },
  get allowedFileTypes() {
    return config.allowedFileTypes;
  },
  // 图片压缩配置访问器
  get clientCompressEnabled() {
    return config.clientCompressEnabled;
  },
  get compressThreshold() {
    return config.compressThreshold;
  },
  get compressQuality() {
    return config.compressQuality;
  },
  get compressMaxWidth() {
    return config.compressMaxWidth;
  },
  get compressMaxHeight() {
    return config.compressMaxHeight;
  },
};
