import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./assets/main.css";
import { loadAppConfig } from "./lib/appConfig";

async function bootstrap() {
  // 先加载配置
  await loadAppConfig();

  // 再渲染应用
  const root = createRoot(document.getElementById("root")!);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

bootstrap();
