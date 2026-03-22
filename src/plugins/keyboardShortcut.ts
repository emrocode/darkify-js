import type { DarkifyPlugin } from '@/types';

export interface KeyboardShortcutOptions {
  key?: string;
  ctrl?: boolean;
  shift?: boolean;
  target?: 'body' | 'input' | 'all';
}

export class KeyboardShortcut implements DarkifyPlugin {
  private _host: any;
  private options: Required<KeyboardShortcutOptions>;
  public static readonly pluginId = 'd-keyboard-shortcut';

  /**
   * Creates a keyboard shortcut listener for theme toggling
   * @param host - The darkify instance that controls theme state
   * @param options - Shortcut configuration (key, ctrl, shift, target)
   */
  constructor(host: any, options?: KeyboardShortcutOptions) {
    this._host = host;
    this.options = {
      key: options?.key ?? 'd',
      ctrl: options?.ctrl ?? false,
      shift: options?.shift ?? false,
      target: options?.target ?? 'body',
    };
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    if (this.options.target === 'body' && this.isTyping(e)) return;
    if (this.options.target === 'input' && !this.isTyping(e)) return;

    if (this.matches(e)) {
      e.preventDefault();
      this._host.toggleTheme();
    }
  };

  render(): void {
    document.addEventListener('keydown', this.handleKeyDown);
    return;
  }

  onDestroy(): void {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  private matches(e: KeyboardEvent): boolean {
    return (
      e.key.toLowerCase() === this.options.key.toLowerCase() &&
      (!this.options.ctrl || e.ctrlKey || e.metaKey) &&
      (!this.options.shift || e.shiftKey) &&
      (this.options.ctrl || (!e.ctrlKey && !e.metaKey && !e.altKey))
    );
  }

  private isTyping(e: KeyboardEvent): boolean {
    const target = e.target as HTMLElement;
    const tagName = target.tagName.toLowerCase();
    const isEditable = target.isContentEditable || tagName === 'input' || tagName === 'textarea';
    return isEditable;
  }
}
