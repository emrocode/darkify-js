export interface DarkifyPlugin {
  el?: HTMLElement | ShadowRoot;
  render(): void | HTMLElement | ShadowRoot;
  onThemeChange?: (theme: string) => void;
  onDestroy?: () => void;
}

export interface DarkifyPluginElement {
  new (host: any, options?: object): DarkifyPlugin;
  pluginId: string;
}

export type StorageType = 'local' | 'session' | 'none';

export interface Options {
  autoMatchTheme: boolean;
  useColorScheme: [string, string?];
  useStorage: StorageType;
  usePlugins?: (DarkifyPluginElement | [DarkifyPluginElement, any])[];
}
