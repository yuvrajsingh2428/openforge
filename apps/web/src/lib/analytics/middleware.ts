import type { AnalyticsEvent, MiddlewareFunction } from "./types";
import { sanitizeAnalyticsPayload } from "./sanitizer";
import { validateEventPayload } from "./schemas";

export const sanitizerMiddleware: MiddlewareFunction = async (event, next) => {
  const sanitized = sanitizeAnalyticsPayload(event);
  return next(sanitized);
};

export const validationMiddleware: MiddlewareFunction = async (event, next) => {
  const validation = validateEventPayload(event.name, event.properties);
  if (!validation.valid) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[Analytics Validation Warning] Event "${event.name}" failed schema validation: ${validation.error}`);
    }
  }
  return next(event);
};

export class MiddlewarePipeline {
  private middlewares: MiddlewareFunction[] = [];

  public use(middleware: MiddlewareFunction): void {
    this.middlewares.push(middleware);
  }

  public async execute(
    event: AnalyticsEvent,
    finalHandler: (event: AnalyticsEvent) => Promise<boolean>
  ): Promise<boolean> {
    let index = -1;

    const dispatch = async (i: number, currentEvent: AnalyticsEvent): Promise<boolean> => {
      if (i <= index) {
        throw new Error("next() called multiple times in middleware");
      }
      index = i;

      if (i === this.middlewares.length) {
        return finalHandler(currentEvent);
      }

      const middleware = this.middlewares[i];
      return middleware(currentEvent, (nextEvent) => dispatch(i + 1, nextEvent));
    };

    return dispatch(0, event);
  }
}
