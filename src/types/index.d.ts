export interface DarkifyPlugin<T extends HTMLElement = HTMLElement> {
  el?: T;
  render(): void | T;
  onThemeChange?: (theme: string) => void;
  onDestroy?: () => void;
}

export interface DarkifyPluginConstructor {
  pluginId: string;
  new (host: any, options?: any): DarkifyPlugin;
}

export type StorageType = 'local' | 'session' | 'none';

export interface Options {
  autoMatchTheme: boolean;
  useColorScheme: [string, string?];
  useStorage: StorageType;
  usePlugins?: (DarkifyPluginConstructor | [DarkifyPluginConstructor, any])[];
}
