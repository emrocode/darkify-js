import { type ThemeWidgetOptions, ThemeWidgetElement, pluginId } from './components';
import type { DarkifyPlugin } from '@/types';

export class ThemeWidget implements DarkifyPlugin<ThemeWidgetElement> {
  public static readonly pluginId = pluginId;
  public el!: ThemeWidgetElement;
  private options: Required<ThemeWidgetOptions>;

  constructor(host: any, options?: ThemeWidgetOptions) {
    this.options = {
      position: options?.position ?? 'bottom-right',
      size: options?.size ?? 'medium',
      shortcut: options?.shortcut ?? '',
    };
    this.el = document.createElement(pluginId);
    this.el.init(host, this.options);
  }

  render(): ThemeWidgetElement {
    document.body.appendChild(this.el);
    return this.el;
  }

  onThemeChange(theme: string): void {
    this.el.onThemeChange(theme);
  }

  onDestroy(): void {
    this.el.remove();
  }
}
