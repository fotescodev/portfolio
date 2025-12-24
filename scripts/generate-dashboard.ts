#!/usr/bin/env tsx
/**
 * Generates a private variant links dashboard for GitHub Pages
 *
 * Usage: npm run generate:dashboard
 * Output: dashboard/index.html
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'yaml';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
const variantsDir = path.join(rootDir, 'content', 'variants');
const outputDir = path.join(rootDir, 'public', 'cv-dashboard');

interface VariantMetadata {
  company: string;
  role: string;
  slug: string;
  generatedAt: string;
  sourceUrl?: string;
  applicationStatus?: 'not_applied' | 'applied';
  appliedAt?: string;
}

interface Variant {
  metadata: VariantMetadata;
}

function loadVariants(): Variant[] {
  const files = fs.readdirSync(variantsDir)
    .filter(f => f.endsWith('.yaml') && !f.startsWith('_'));

  return files.map(file => {
    const content = fs.readFileSync(path.join(variantsDir, file), 'utf-8');
    return yaml.parse(content) as Variant;
  }).sort((a, b) =>
    new Date(b.metadata.generatedAt).getTime() - new Date(a.metadata.generatedAt).getTime()
  );
}

function generateHTML(variants: Variant[], baseUrl: string): string {
  const appliedCount = variants.filter(v => v.metadata.applicationStatus === 'applied').length;

  const variantRows = variants.map(v => {
    const date = new Date(v.metadata.generatedAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    const isApplied = v.metadata.applicationStatus === 'applied';
    const appliedDate = v.metadata.appliedAt
      ? new Date(v.metadata.appliedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      : '';

    // Convert slug to URL path: "galaxy-pm" -> "galaxy/pm"
    const slugParts = v.metadata.slug.split('-');
    const urlPath = `${slugParts[0]}/${slugParts.slice(1).join('-')}`;

    return `
      <tr class="variant-row" data-company="${v.metadata.company.toLowerCase()}" data-role="${v.metadata.role.toLowerCase()}" data-applied="${isApplied}">
        <td>
          <div class="company">${v.metadata.company}</div>
          <div class="role">${v.metadata.role}</div>
        </td>
        <td class="status-cell">
          ${isApplied
            ? `<span class="status status-applied" title="Applied ${appliedDate}">✓ Applied</span>`
            : `<span class="status status-pending">—</span>`}
        </td>
        <td class="date">${date}</td>
        <td class="actions">
          <a href="${baseUrl}/${urlPath}" target="_blank" class="btn btn-primary">View</a>
          ${v.metadata.sourceUrl ? `<a href="${v.metadata.sourceUrl}" target="_blank" class="btn btn-secondary">Job Post</a>` : ''}
        </td>
      </tr>
    `;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex, nofollow">
  <title>CV Variants Dashboard</title>
  <style>
    :root {
      --bg: #0a0a0b;
      --bg-card: #141416;
      --border: #2a2a2e;
      --text: #fafafa;
      --text-muted: #71717a;
      --accent: #3b82f6;
      --accent-hover: #2563eb;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: var(--bg);
      color: var(--text);
      min-height: 100vh;
      line-height: 1.5;
    }

    /* Password Gate */
    #gate {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 1rem;
    }

    .gate-box {
      background: #1a1a1f;
      border: 1px solid #3b82f6;
      border-radius: 12px;
      padding: 2rem;
      max-width: 320px;
      width: 100%;
      box-shadow: 0 0 40px rgba(59, 130, 246, 0.15);
    }

    .gate-box h2 {
      font-size: 1.25rem;
      margin-bottom: 1rem;
      font-weight: 500;
    }

    .gate-box input {
      width: 100%;
      padding: 0.75rem 1rem;
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: 8px;
      color: var(--text);
      font-size: 1rem;
      margin-bottom: 1rem;
    }

    .gate-box input:focus {
      outline: none;
      border-color: var(--accent);
    }

    .gate-box button {
      width: 100%;
      padding: 0.75rem 1rem;
      background: var(--accent);
      border: none;
      border-radius: 8px;
      color: white;
      font-size: 1rem;
      cursor: pointer;
      transition: background 0.2s;
    }

    .gate-box button:hover {
      background: var(--accent-hover);
    }

    .error {
      color: #ef4444;
      font-size: 0.875rem;
      margin-top: 0.5rem;
      display: none;
    }

    /* Dashboard */
    #dashboard {
      display: none;
      padding: 2rem;
      max-width: 900px;
      margin: 0 auto;
    }

    header {
      margin-bottom: 2rem;
    }

    header h1 {
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    header p {
      color: var(--text-muted);
    }

    .search-bar {
      margin-bottom: 1.5rem;
    }

    .search-bar input {
      width: 100%;
      padding: 0.75rem 1rem;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 8px;
      color: var(--text);
      font-size: 1rem;
    }

    .search-bar input:focus {
      outline: none;
      border-color: var(--accent);
    }

    .search-bar input::placeholder {
      color: var(--text-muted);
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th {
      text-align: left;
      padding: 0.75rem 1rem;
      border-bottom: 1px solid var(--border);
      color: var(--text-muted);
      font-weight: 500;
      font-size: 0.875rem;
    }

    td {
      padding: 1rem;
      border-bottom: 1px solid var(--border);
    }

    .company {
      font-weight: 500;
    }

    .role {
      color: var(--text-muted);
      font-size: 0.875rem;
    }

    .date {
      color: var(--text-muted);
      font-size: 0.875rem;
      white-space: nowrap;
    }

    .actions {
      text-align: right;
      white-space: nowrap;
    }

    .btn {
      display: inline-block;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      text-decoration: none;
      font-size: 0.875rem;
      transition: all 0.2s;
    }

    .btn-primary {
      background: var(--accent);
      color: white;
    }

    .btn-primary:hover {
      background: var(--accent-hover);
    }

    .btn-secondary {
      background: transparent;
      color: var(--text-muted);
      border: 1px solid var(--border);
      margin-left: 0.5rem;
    }

    .btn-secondary:hover {
      border-color: var(--text-muted);
      color: var(--text);
    }

    .variant-row.hidden {
      display: none;
    }

    .stats {
      display: flex;
      gap: 1.5rem;
      margin-bottom: 1.5rem;
      padding: 1rem;
      background: var(--bg-card);
      border-radius: 8px;
      border: 1px solid var(--border);
    }

    .stat {
      text-align: center;
    }

    .stat-value {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--accent);
    }

    .stat-value.applied {
      color: #22c55e;
    }

    .stat-label {
      font-size: 0.75rem;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .status-cell {
      white-space: nowrap;
    }

    .status {
      display: inline-block;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .status-applied {
      background: rgba(34, 197, 94, 0.15);
      color: #22c55e;
    }

    .status-pending {
      color: var(--text-muted);
    }

    .filter-bar {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .filter-btn {
      padding: 0.5rem 1rem;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 6px;
      color: var(--text-muted);
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .filter-btn:hover {
      border-color: var(--text-muted);
      color: var(--text);
    }

    .filter-btn.active {
      background: var(--accent);
      border-color: var(--accent);
      color: white;
    }

    @media (max-width: 640px) {
      #dashboard {
        padding: 1rem;
      }

      .actions {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .btn-secondary {
        margin-left: 0;
      }

      th:nth-child(2),
      td.date {
        display: none;
      }
    }
  </style>
</head>
<body>
  <!-- Password Gate -->
  <div id="gate">
    <div class="gate-box">
      <h2>🔐 Dashboard Access</h2>
      <input type="password" id="password" placeholder="Enter access code" autofocus>
      <button onclick="checkPassword()">Enter</button>
      <p class="error" id="error">Incorrect code</p>
    </div>
  </div>

  <!-- Dashboard (hidden until authenticated) -->
  <div id="dashboard">
    <header>
      <h1>CV Variants Dashboard</h1>
      <p>Quick access to all portfolio variants</p>
    </header>

    <div class="stats">
      <div class="stat">
        <div class="stat-value">${variants.length}</div>
        <div class="stat-label">Total Variants</div>
      </div>
      <div class="stat">
        <div class="stat-value applied">${appliedCount}</div>
        <div class="stat-label">Applied</div>
      </div>
      <div class="stat">
        <div class="stat-value">${variants.length - appliedCount}</div>
        <div class="stat-label">Pending</div>
      </div>
    </div>

    <div class="search-bar">
      <input type="text" id="search" placeholder="Search by company or role..." oninput="filterVariants()">
    </div>

    <div class="filter-bar">
      <button class="filter-btn active" data-filter="all" onclick="setFilter('all')">All</button>
      <button class="filter-btn" data-filter="pending" onclick="setFilter('pending')">Pending</button>
      <button class="filter-btn" data-filter="applied" onclick="setFilter('applied')">Applied</button>
    </div>

    <table>
      <thead>
        <tr>
          <th>Variant</th>
          <th>Status</th>
          <th>Created</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        ${variantRows}
      </tbody>
    </table>
  </div>

  <script>
    // Simple hash function for password (not cryptographically secure, just obscurity)
    const HASH = '${generateHash('dmitrii2024')}';

    function simpleHash(str) {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
      }
      return hash.toString(36);
    }

    function checkPassword() {
      const input = document.getElementById('password').value;
      if (simpleHash(input) === HASH) {
        localStorage.setItem('dashboard_auth', 'true');
        showDashboard();
      } else {
        document.getElementById('error').style.display = 'block';
      }
    }

    function showDashboard() {
      document.getElementById('gate').style.display = 'none';
      document.getElementById('dashboard').style.display = 'block';
    }

    let currentFilter = 'all';

    function setFilter(filter) {
      currentFilter = filter;
      document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === filter);
      });
      filterVariants();
    }

    function filterVariants() {
      const query = document.getElementById('search').value.toLowerCase();
      document.querySelectorAll('.variant-row').forEach(row => {
        const company = row.dataset.company;
        const role = row.dataset.role;
        const isApplied = row.dataset.applied === 'true';

        const matchesSearch = company.includes(query) || role.includes(query);
        const matchesFilter = currentFilter === 'all' ||
          (currentFilter === 'applied' && isApplied) ||
          (currentFilter === 'pending' && !isApplied);

        row.classList.toggle('hidden', !matchesSearch || !matchesFilter);
      });
    }

    // Check if already authenticated
    document.getElementById('password').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') checkPassword();
    });

    if (localStorage.getItem('dashboard_auth') === 'true') {
      showDashboard();
    }
  </script>
</body>
</html>`;
}

function generateHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(36);
}

// Main
const baseUrl = process.argv[2] || 'https://fotescodev.github.io/portfolio';

console.log('📊 Generating variant dashboard...\n');

const variants = loadVariants();
console.log(`Found ${variants.length} variants:`);
variants.forEach(v => console.log(`  • ${v.metadata.company} - ${v.metadata.role}`));

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Generate and write HTML
const html = generateHTML(variants, baseUrl);
const outputPath = path.join(outputDir, 'index.html');
fs.writeFileSync(outputPath, html);

console.log(`\n✅ Dashboard generated: ${outputPath}`);
console.log(`\n🔐 Default access code: dmitrii2024`);
console.log(`   (Change in scripts/generate-dashboard.ts)`);
console.log(`\n📦 Dashboard will be available at: ${baseUrl}/cv-dashboard`);
console.log(`   (Included in build via public/ folder)`);
