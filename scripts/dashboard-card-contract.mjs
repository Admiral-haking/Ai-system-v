import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const panel = await readFile(new URL('../src/components/dashboard/DashboardPanel.tsx', import.meta.url), 'utf8');
const overview = await readFile(new URL('../src/pages/OverviewDashboard.tsx', import.meta.url), 'utf8');

assert.match(panel, /role=\{tone === 'error' \? 'alert' : 'status'\}/);
assert.match(panel, /role="status"/);
assert.match(panel, /aria-busy=/);
assert.match(panel, /function MetricCard/);
assert.match(overview, /<DashboardPanel/);
assert.match(overview, /<MetricCard/);
assert.match(overview, /api\/ai-dashboard\/overview/);
assert.doesNotMatch(overview.slice(overview.indexOf('<MetricCard'), overview.indexOf('</div>', overview.indexOf('<MetricCard'))), /bg-gradient/);
console.log('dashboard card contract: passed');
