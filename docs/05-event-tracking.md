# Events Tracking

It's extremely important that all events are tracked by google analytics. For that, we have a shared `trackEvent` function at `apps/next-app/lib/analytics.ts`
A list of available events and categories is available at `apps/next-app/lib/constants/analytics.ts`
Make sure to add event tracking for any new features/actions, populating `EventsCategories` and `Events` as needed.