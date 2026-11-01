# Dashboard card system

The dashboard uses a small set of Tailwind/React primitives in `src/components/dashboard/`:

- `DashboardPanel`: one surface, header rhythm, and explicit ready/loading/error/empty states.
- `MetricCard`: compact KPI with a single icon, tabular value, detail, and source label.
- `SectionHeader`: consistent section hierarchy.
- `QuickActionGroup`: grouped actions with touch-sized controls.
- `LoadingSkeleton`, `EmptyState`, `StatusMessage`, and `Alert`: semantic feedback states.
- `dashboard-tokens.ts`: surface, text, focus, numeric, and grid tokens.

The Overview page keeps the operational API query and its real metrics. Data still imported from `mockData` is not promoted to an operational KPI; it remains model/demo content until a real API is connected.

Visual rules: flat surfaces, one border system, minimal shadow, no gradient KPI backgrounds, tabular numbers, visible focus, RTL-safe flex/grid layouts, and no color-only status meaning. State changes use `aria-busy`, `role="status"`, or `role="alert"` as appropriate.
