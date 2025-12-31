#!/usr/bin/env tsx
/**
 * Generates a private variant links dashboard for GitHub Pages
 *
 * Usage: DASHBOARD_PASSWORD=yourpassword npm run generate:dashboard
 * Output: public/cv-dashboard/index.html
 *
 * Password is read from DASHBOARD_PASSWORD env var or .env.local file
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'yaml';

// Load .env.local if it exists
const envLocalPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '.env.local');
if (fs.existsSync(envLocalPath)) {
  const envContent = fs.readFileSync(envLocalPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      process.env[key.trim()] = valueParts.join('=').trim();
    }
  }
}

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
  resumePath?: string;
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

function generateHTML(variants: Variant[], baseUrl: string, passwordHash: string): string {
  const appliedCount = variants.filter(v => v.metadata.applicationStatus === 'applied').length;
  const resumeCount = variants.length; // All variants have resume pages

  const variantCards = variants.map(v => {
    const date = new Date(v.metadata.generatedAt).toLocaleDateString('en-US', {
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
      <div class="card" data-company="${v.metadata.company.toLowerCase()}" data-role="${v.metadata.role.toLowerCase()}" data-applied="${isApplied}">
        <div class="card-header">
          <div class="card-info">
            <h3 class="card-company">${v.metadata.company}</h3>
            <p class="card-role">${v.metadata.role}</p>
          </div>
          <div class="card-meta">
            ${isApplied
              ? `<span class="badge badge-success" title="Applied ${appliedDate}">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Applied
                </span>`
              : `<span class="badge badge-neutral">Pending</span>`}
            <span class="card-date">${date}</span>
          </div>
        </div>
        <div class="card-actions">
          <a href="${baseUrl}/${urlPath}" target="_blank" class="btn btn-primary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
            View Portfolio
          </a>
          <a href="${baseUrl}/resumes/${v.metadata.slug}.pdf" download class="btn btn-download">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Resume
          </a>
          ${v.metadata.sourceUrl ? `
            <a href="${v.metadata.sourceUrl}" target="_blank" class="btn btn-ghost">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
              </svg>
              Job Post
            </a>
          ` : ''}
        </div>
      </div>
    `;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex, nofollow">
  <title>CV Dashboard</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-primary: #000000;
      --bg-secondary: #0a0a0a;
      --bg-elevated: #111111;
      --bg-hover: #1a1a1a;
      --border-subtle: rgba(255, 255, 255, 0.08);
      --border-default: rgba(255, 255, 255, 0.12);
      --border-hover: rgba(255, 255, 255, 0.2);
      --text-primary: #ededed;
      --text-secondary: #a1a1a1;
      --text-tertiary: #666666;
      --accent-blue: #0070f3;
      --accent-blue-hover: #0060df;
      --accent-green: #00c853;
      --accent-green-bg: rgba(0, 200, 83, 0.1);
      --accent-purple: #7928ca;
      --gradient-blue: linear-gradient(135deg, #0070f3 0%, #00c6ff 100%);
      --gradient-purple: linear-gradient(135deg, #7928ca 0%, #ff0080 100%);
      --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.4);
      --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.5);
      --shadow-lg: 0 8px 30px rgba(0, 0, 0, 0.6);
      --radius-sm: 6px;
      --radius-md: 8px;
      --radius-lg: 12px;
      --transition: 150ms cubic-bezier(0.4, 0, 0.2, 1);
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: var(--bg-primary);
      color: var(--text-primary);
      min-height: 100vh;
      line-height: 1.5;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    /* Password Gate */
    #gate {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 1.5rem;
      background: radial-gradient(ellipse at top, #111 0%, #000 70%);
    }

    .gate-container {
      width: 100%;
      max-width: 380px;
    }

    .gate-box {
      background: var(--bg-elevated);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-lg);
      padding: 2rem;
      box-shadow: var(--shadow-lg);
    }

    .gate-logo {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
    }

    .gate-logo svg {
      color: var(--text-primary);
    }

    .gate-logo span {
      font-size: 1.125rem;
      font-weight: 600;
      letter-spacing: -0.02em;
    }

    .gate-title {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--text-secondary);
      margin-bottom: 1rem;
      text-align: center;
    }

    .gate-input-wrapper {
      position: relative;
      margin-bottom: 1rem;
    }

    .gate-input-wrapper svg {
      position: absolute;
      left: 0.875rem;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-tertiary);
    }

    .gate-box input {
      width: 100%;
      padding: 0.75rem 1rem 0.75rem 2.5rem;
      background: var(--bg-primary);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-md);
      color: var(--text-primary);
      font-size: 0.875rem;
      font-family: inherit;
      transition: border-color var(--transition), box-shadow var(--transition);
    }

    .gate-box input:focus {
      outline: none;
      border-color: var(--accent-blue);
      box-shadow: 0 0 0 3px rgba(0, 112, 243, 0.15);
    }

    .gate-box input::placeholder {
      color: var(--text-tertiary);
    }

    .gate-box button {
      width: 100%;
      padding: 0.75rem 1rem;
      background: var(--text-primary);
      border: none;
      border-radius: var(--radius-md);
      color: var(--bg-primary);
      font-size: 0.875rem;
      font-weight: 500;
      font-family: inherit;
      cursor: pointer;
      transition: opacity var(--transition), transform var(--transition);
    }

    .gate-box button:hover {
      opacity: 0.9;
    }

    .gate-box button:active {
      transform: scale(0.98);
    }

    .error {
      color: #f31260;
      font-size: 0.8125rem;
      margin-top: 0.75rem;
      text-align: center;
      display: none;
    }

    /* Dashboard */
    #dashboard {
      display: none;
      min-height: 100vh;
    }

    .dashboard-header {
      border-bottom: 1px solid var(--border-subtle);
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 1rem 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .header-logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 600;
      font-size: 0.9375rem;
      letter-spacing: -0.02em;
    }

    .header-logo svg {
      color: var(--text-primary);
    }

    .header-divider {
      width: 1px;
      height: 24px;
      background: var(--border-default);
    }

    .header-title {
      font-size: 0.875rem;
      color: var(--text-secondary);
      font-weight: 400;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .logout-btn {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.5rem 0.75rem;
      background: transparent;
      border: 1px solid var(--border-default);
      border-radius: var(--radius-sm);
      color: var(--text-secondary);
      font-size: 0.8125rem;
      font-family: inherit;
      cursor: pointer;
      transition: all var(--transition);
    }

    .logout-btn:hover {
      border-color: var(--border-hover);
      color: var(--text-primary);
    }

    .main-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem 1.5rem 4rem;
    }

    /* Stats */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: var(--bg-elevated);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      padding: 1.25rem;
      transition: border-color var(--transition);
    }

    .stat-card:hover {
      border-color: var(--border-default);
    }

    .stat-label {
      font-size: 0.75rem;
      color: var(--text-tertiary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.5rem;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: 600;
      letter-spacing: -0.02em;
      background: var(--gradient-blue);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .stat-value.success {
      background: linear-gradient(135deg, #00c853 0%, #00e676 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .stat-value.neutral {
      background: linear-gradient(135deg, #666 0%, #888 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .stat-value.purple {
      background: var(--gradient-purple);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    /* Toolbar */
    .toolbar {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
    }

    .search-wrapper {
      position: relative;
      flex: 1;
      min-width: 200px;
    }

    .search-wrapper svg {
      position: absolute;
      left: 0.875rem;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-tertiary);
    }

    .search-input {
      width: 100%;
      padding: 0.625rem 1rem 0.625rem 2.5rem;
      background: var(--bg-elevated);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      color: var(--text-primary);
      font-size: 0.875rem;
      font-family: inherit;
      transition: all var(--transition);
    }

    .search-input:focus {
      outline: none;
      border-color: var(--border-hover);
      background: var(--bg-hover);
    }

    .search-input::placeholder {
      color: var(--text-tertiary);
    }

    .filter-group {
      display: flex;
      background: var(--bg-elevated);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      overflow: hidden;
    }

    .filter-btn {
      padding: 0.625rem 1rem;
      background: transparent;
      border: none;
      color: var(--text-secondary);
      font-size: 0.8125rem;
      font-family: inherit;
      cursor: pointer;
      transition: all var(--transition);
      position: relative;
    }

    .filter-btn:not(:last-child)::after {
      content: '';
      position: absolute;
      right: 0;
      top: 25%;
      height: 50%;
      width: 1px;
      background: var(--border-subtle);
    }

    .filter-btn:hover {
      color: var(--text-primary);
    }

    .filter-btn.active {
      background: var(--bg-hover);
      color: var(--text-primary);
    }

    /* Cards Grid */
    .cards-grid {
      display: grid;
      gap: 0.75rem;
    }

    .card {
      background: var(--bg-elevated);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      padding: 1rem 1.25rem;
      transition: all var(--transition);
    }

    .card:hover {
      border-color: var(--border-default);
      background: var(--bg-hover);
    }

    .card.hidden {
      display: none;
    }

    .card-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 0.875rem;
    }

    .card-info {
      flex: 1;
    }

    .card-company {
      font-size: 0.9375rem;
      font-weight: 600;
      letter-spacing: -0.01em;
      margin-bottom: 0.125rem;
    }

    .card-role {
      font-size: 0.8125rem;
      color: var(--text-secondary);
    }

    .card-meta {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .card-date {
      font-size: 0.75rem;
      color: var(--text-tertiary);
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.25rem 0.5rem;
      border-radius: 9999px;
      font-size: 0.6875rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.02em;
    }

    .badge-success {
      background: var(--accent-green-bg);
      color: var(--accent-green);
    }

    .badge-neutral {
      background: rgba(255, 255, 255, 0.06);
      color: var(--text-tertiary);
    }

    .card-actions {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.5rem 0.875rem;
      border-radius: var(--radius-sm);
      font-size: 0.8125rem;
      font-weight: 500;
      font-family: inherit;
      text-decoration: none;
      cursor: pointer;
      transition: all var(--transition);
      border: none;
    }

    .btn svg {
      flex-shrink: 0;
    }

    .btn-primary {
      background: var(--text-primary);
      color: var(--bg-primary);
    }

    .btn-primary:hover {
      opacity: 0.85;
    }

    .btn-ghost {
      background: transparent;
      color: var(--text-secondary);
      border: 1px solid var(--border-default);
    }

    .btn-ghost:hover {
      border-color: var(--border-hover);
      color: var(--text-primary);
      background: var(--bg-hover);
    }

    .btn-download {
      background: var(--accent-green-bg);
      color: var(--accent-green);
      border: 1px solid rgba(0, 200, 83, 0.2);
    }

    .btn-download:hover {
      background: rgba(0, 200, 83, 0.15);
      border-color: rgba(0, 200, 83, 0.3);
    }

    /* Empty State */
    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      color: var(--text-tertiary);
    }

    .empty-state svg {
      margin-bottom: 1rem;
      opacity: 0.5;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .header-title {
        display: none;
      }

      .header-divider {
        display: none;
      }

      .card-header {
        flex-direction: column;
        gap: 0.75rem;
      }

      .card-meta {
        width: 100%;
        justify-content: space-between;
      }

      .card-actions {
        width: 100%;
      }

      .btn {
        flex: 1;
        justify-content: center;
      }
    }

    @media (max-width: 480px) {
      .main-content {
        padding: 1.5rem 1rem 3rem;
      }

      .stat-value {
        font-size: 1.5rem;
      }

      .toolbar {
        flex-direction: column;
        align-items: stretch;
      }

      .filter-group {
        justify-content: center;
      }
    }
  </style>
</head>
<body>
  <!-- Password Gate -->
  <div id="gate">
    <div class="gate-container">
      <div class="gate-box">
        <div class="gate-logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span>CV Dashboard</span>
        </div>
        <p class="gate-title">Enter your access code to continue</p>
        <div class="gate-input-wrapper">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          <input type="password" id="password" placeholder="Access code" autofocus>
        </div>
        <button onclick="checkPassword()">Continue</button>
        <p class="error" id="error">Invalid access code. Please try again.</p>
      </div>
    </div>
  </div>

  <!-- Dashboard -->
  <div id="dashboard">
    <header class="dashboard-header">
      <div class="header-content">
        <div class="header-left">
          <div class="header-logo">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span>CV Dashboard</span>
          </div>
          <div class="header-divider"></div>
          <span class="header-title">Portfolio Variants</span>
        </div>
        <div class="header-right">
          <button class="logout-btn" onclick="logout()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Logout
          </button>
        </div>
      </div>
    </header>

    <main class="main-content">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">Total Variants</div>
          <div class="stat-value">${variants.length}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Applied</div>
          <div class="stat-value success">${appliedCount}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Pending</div>
          <div class="stat-value neutral">${variants.length - appliedCount}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Resumes Ready</div>
          <div class="stat-value purple">${resumeCount}</div>
        </div>
      </div>

      <div class="toolbar">
        <div class="search-wrapper">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input type="text" class="search-input" id="search" placeholder="Search variants..." oninput="filterVariants()">
        </div>
        <div class="filter-group">
          <button class="filter-btn active" data-filter="all" onclick="setFilter('all')">All</button>
          <button class="filter-btn" data-filter="pending" onclick="setFilter('pending')">Pending</button>
          <button class="filter-btn" data-filter="applied" onclick="setFilter('applied')">Applied</button>
        </div>
      </div>

      <div class="cards-grid">
        ${variantCards}
      </div>
    </main>
  </div>

  <script>
    const HASH = '${passwordHash}';

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
        document.getElementById('password').classList.add('error-input');
      }
    }

    function showDashboard() {
      document.getElementById('gate').style.display = 'none';
      document.getElementById('dashboard').style.display = 'block';
    }

    function logout() {
      localStorage.removeItem('dashboard_auth');
      location.reload();
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
      document.querySelectorAll('.card').forEach(card => {
        const company = card.dataset.company;
        const role = card.dataset.role;
        const isApplied = card.dataset.applied === 'true';

        const matchesSearch = company.includes(query) || role.includes(query);
        const matchesFilter = currentFilter === 'all' ||
          (currentFilter === 'applied' && isApplied) ||
          (currentFilter === 'pending' && !isApplied);

        card.classList.toggle('hidden', !matchesSearch || !matchesFilter);
      });
    }

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

// Get password from environment variable (required)
const password = process.env.DASHBOARD_PASSWORD;
if (!password) {
  console.error('❌ Error: DASHBOARD_PASSWORD environment variable is required');
  console.error('   Set it in your shell or .env.local file');
  process.exit(1);
}

console.log('📊 Generating variant dashboard...\n');

const variants = loadVariants();
console.log(`Found ${variants.length} variants:`);
variants.forEach(v => console.log(`  • ${v.metadata.company} - ${v.metadata.role}`));

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Generate and write HTML with hashed password
const passwordHash = generateHash(password);
const html = generateHTML(variants, baseUrl, passwordHash);
const outputPath = path.join(outputDir, 'index.html');
fs.writeFileSync(outputPath, html);

console.log(`\n✅ Dashboard generated: ${outputPath}`);
console.log(`\n🔐 Password hash embedded (password not stored in code)`);
console.log(`\n🌐 View your dashboard:`);
console.log(`   Local:      http://localhost:5173/cv-dashboard/`);
console.log(`   Production: ${baseUrl}/cv-dashboard/`);
console.log(`\n💡 Run 'npm run dev' to preview locally`);
