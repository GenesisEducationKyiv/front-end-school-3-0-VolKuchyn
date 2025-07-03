interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly RUN_PORT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}