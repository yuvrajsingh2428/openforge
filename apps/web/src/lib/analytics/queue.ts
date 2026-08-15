import type { AnalyticsEvent, AnalyticsProvider, QueueItem } from "./types";
import { QUEUE_STORAGE_KEY, MAX_QUEUE_SIZE, MAX_RETRY_ATTEMPTS, FLUSH_INTERVAL_MS } from "./constants";

export class AnalyticsQueue {
  private queue: QueueItem[] = [];
  private provider: AnalyticsProvider | null = null;
  private timer: NodeJS.Timeout | null = null;
  private isFlushing = false;

  constructor() {
    this.loadFromStorage();
    this.setupOnlineListener();
  }

  public setProvider(provider: AnalyticsProvider): void {
    this.provider = provider;
    this.startAutoFlush();
  }

  public enqueue(event: AnalyticsEvent): void {
    const item: QueueItem = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      event,
      attempts: 0,
      createdAt: Date.now(),
    };

    if (this.queue.length >= MAX_QUEUE_SIZE) {
      // Remove oldest item if full
      this.queue.shift();
    }

    this.queue.push(item);
    this.saveToStorage();

    // Trigger immediate flush if online
    this.flush();
  }

  public async flush(): Promise<void> {
    if (this.isFlushing || !this.provider || !this.provider.isInitialized() || this.queue.length === 0) {
      return;
    }

    if (typeof window !== "undefined" && !navigator.onLine) {
      return;
    }

    this.isFlushing = true;
    const itemsToProcess = [...this.queue];

    for (const item of itemsToProcess) {
      try {
        const success = await this.provider.track(item.event);
        if (success) {
          this.queue = this.queue.filter((q) => q.id !== item.id);
        } else {
          item.attempts += 1;
          if (item.attempts >= MAX_RETRY_ATTEMPTS) {
            this.queue = this.queue.filter((q) => q.id !== item.id);
          }
        }
      } catch {
        item.attempts += 1;
        if (item.attempts >= MAX_RETRY_ATTEMPTS) {
          this.queue = this.queue.filter((q) => q.id !== item.id);
        }
      }
    }

    this.saveToStorage();
    this.isFlushing = false;
  }

  public getQueueLength(): number {
    return this.queue.length;
  }

  public clearQueue(): void {
    this.queue = [];
    this.saveToStorage();
  }

  private startAutoFlush(): void {
    if (this.timer) clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.flush();
    }, FLUSH_INTERVAL_MS);
  }

  private loadFromStorage(): void {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(QUEUE_STORAGE_KEY);
      if (stored) {
        this.queue = JSON.parse(stored);
      }
    } catch {
      this.queue = [];
    }
  }

  private saveToStorage(): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(this.queue));
    } catch {
      // Ignore storage quota or disabled errors
    }
  }

  private setupOnlineListener(): void {
    if (typeof window === "undefined") return;
    window.addEventListener("online", () => {
      this.flush();
    });
  }
}
