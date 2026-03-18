import type { DarkifyPlugin } from '@/types';

export interface KeyboardShortcutOptions {
  key?: string;
  ctrl?: boolean;
  shift?: boolean;
  target?: 'body' | 'input' | 'all';
}

export class KeyboardShortcut implements DarkifyPlugin {
  private shadow!: ShadowRoot;
  private host: any;
  private options: Required<KeyboardShortcutOptions>;

  constructor(host: any, options?: KeyboardShortcutOptions) {
    this.host = host;

    this.options = {
      key: options?.key ?? 't',
      ctrl: options?.ctrl ?? false,
      shift: options?.shift ?? false,
      target: options?.target ?? 'body',
    };
  }

  render(): HTMLElement {
    document.addEventListener('keydown', e => {
      if (this.options.target === 'body' && this.isTyping(e)) return;
      if (this.options.target === 'input' && !this.isTyping(e)) return;

      if (this.matches(e)) {
        e.preventDefault();
        this.host.toggleTheme();
      }
    });

    return document.createElement('div');
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
