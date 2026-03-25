import type { DarkifyPlugin } from '@/types';

interface KeyboardShortcutOptions {
  key?: string;
  ctrl?: boolean;
  shift?: boolean;
  target?: 'body' | 'input' | 'all';
  cooldown?: number;
}

export class KeyboardShortcut implements DarkifyPlugin {
  public static readonly pluginId = 'd-keyboard-shortcut';
  private _host: any;
  private options: Required<KeyboardShortcutOptions>;
  private _lastTriggered: number = 0;

  constructor(host: any, options?: KeyboardShortcutOptions) {
    this._host = host;
    this.options = {
      key: options?.key ?? 'd',
      ctrl: options?.ctrl ?? false,
      shift: options?.shift ?? false,
      target: options?.target ?? 'body',
      cooldown: options?.cooldown ?? 300,
    };
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    if (this.options.target === 'body' && this.isTyping(e)) return;
    if (this.options.target === 'input' && !this.isTyping(e)) return;

    if (this.matches(e)) {
      e.preventDefault();

      const now = Date.now();
      if (now - this._lastTriggered < this.options.cooldown) return;

      this._lastTriggered = now;
      this._host.toggleTheme();
    }
  };

  render(): void {
    document.addEventListener('keydown', this.handleKeyDown);
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
