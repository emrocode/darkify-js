export type StorageType = 'local' | 'session' | 'none';

export interface Options {
  autoMatchTheme: boolean;
  useColorScheme: [string, string?];
  usePlugins?: (
    | (new (host: any, options?: any) => DarkifyPlugin)
    | [new (host: any, options?: any) => DarkifyPlugin, any]
  )[];
  useStorage: StorageType;
}

export interface DarkifyPlugin {
  render(): HTMLElement | ShadowRoot;
  onThemeChange?: (theme: string) => void;
  onDestroy?: () => void;
}
