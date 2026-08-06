export function trackAnalyticsEvent(
  eventName: string,
  parameters: Record<string, unknown> = {},
) {
  if (typeof window === "undefined") return;

  const analyticsWindow = window as Window & {
    gtag?: (
      command: "event",
      name: string,
      params: Record<string, unknown>,
    ) => void;
  };

  analyticsWindow.gtag?.("event", eventName, parameters);
}
