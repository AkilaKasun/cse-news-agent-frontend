// src/services/api.js

const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:8000/api'
).replace(/\/$/, '');

async function request(endpoint, fallbackValue = null) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    return fallbackValue;
  }
}

export async function getMarketStats(tradeDate) {
  const query = tradeDate ? `?trade_date=${encodeURIComponent(tradeDate)}` : '';
  return request(`/market-stats${query}`, null);
}

export async function getSectors(tradeDate, search = '') {
  let endpoint = `/sectors?trade_date=${encodeURIComponent(tradeDate)}`;
  if (search && search.trim() !== '') {
    endpoint += `&search=${encodeURIComponent(search.trim())}`;
  }
  const data = await request(endpoint, { sectors: [] });
  return data?.sectors || [];
}

/**
 * Updated to accept optional sector filter
 */
export async function getStories(limit = 15, importance = '', sector = '', search = '') {
  let endpoint = `/stories?limit=${encodeURIComponent(limit)}`;
  
  if (importance && importance.trim() !== '') {
    endpoint += `&importance=${encodeURIComponent(importance.toLowerCase().trim())}`;
  }
  if (sector && sector.trim() !== '') {
    endpoint += `&sector=${encodeURIComponent(sector.trim())}`;
  }
  if (search && search.trim() !== '') {
    endpoint += `&search=${encodeURIComponent(search.trim())}`;
  }

  const data = await request(endpoint, { stories: [] });
  return data?.stories || [];
}

export async function getArchiveReports() {
  const data = await request('/reports/archive', { reports: [] });
  return data?.reports || [];
}

export async function getReportContent(filename) {
  try {
    const response = await fetch(`${API_BASE_URL}/reports/${encodeURIComponent(filename)}`);
    if (!response.ok) throw new Error('Failed to load report file');
    return await response.text();
  } catch (error) {
    console.error(`API Error [Report Content]:`, error);
    return '# Error loading report content.';
  }
}