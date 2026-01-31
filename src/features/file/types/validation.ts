export interface FileValidationError {
  fileName: string;
  errorType: "size" | "type" | "empty";
  maxSize?: number;
  actualSize?: number;
  allowedTypes?: string[];
  actualType?: string;
}

export interface FileValidationResult {
  valid: boolean;
  errors: FileValidationError[];
}
