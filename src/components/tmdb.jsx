/**
 * TMDB API helper — all API calls go through here.
 * Content filtering enforced: no adult, no romance, family-friendly only.
 */
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE = 'https://image.tmdb.org/t/p';

// API key
const API_KEY = '1e6a913cac81dcca5a8ed413c29c77fc';
export const getApiKey = () => API_KEY;
export const setApiKey = () => {};
export const clearApiKey = () => {};

/** Build a poster/backdrop URL */
export const imgUrl = (path, size = 'w500') =>
  path ? `${IMG_BASE}/${size}${path}` : null;

// Blocked genre IDs: Romance (10749), Adult (10768)
const BLOCKED_GENRES = new Set([10749, 10768]);

// Keywords that indicate adult/suggestive content in titles or overviews
const ADULT_KEYWORDS = [
  'nude', 'nudity', 'naked', 'sex', 'sexual', 'erotic', 'explicit',
  'porn', 'adult', 'xxx', 'sensual', 'intimate', 'seduction', 'lust',
  'affair', 'mistress', 'stripper', 'escort',
];

const containsAdultKeyword = (str = '') => {
  const lower = str.toLowerCase();
  return ADULT_KEYWORDS.some(kw => lower.includes(kw));
};

// Allowed family-friendly genres (used for defaults)
export const FAMILY_GENRES = [16, 12, 35, 99, 14, 36, 878, 10751];

/** Filter movies to remove adult/romance/suggestive content */
export const safeFilter = (movies = []) =>
  movies.filter(m => {
    if (m.adult) return false;
    if (m.genre_ids?.some(id => BLOCKED_GENRES.has(id))) return false;
    if (containsAdultKeyword(m.title)) return false;
    if (containsAdultKeyword(m.overview)) return false;
    return true;
  });

/** Generic fetch wrapper with simple in-memory cache */
const cache = {};
const call = async (endpoint, params = {}) => {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set('api_key', API_KEY);
  // Always enforce content safety
  url.searchParams.set('include_adult', 'false');
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v));
  });
  const cacheKey = url.toString();
  if (cache[cacheKey]) return cache[cacheKey];
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`TMDB_ERROR_${res.status}`);
  const data = await res.json();
  // Filter results at the source
  if (data.results) data.results = safeFilter(data.results);
  cache[cacheKey] = data;
  return data;
};

// Blocked genre IDs to exclude from discover
const WITHOUT_GENRES = '10749,10768';

export const tmdb = {
  trending: () => call('/trending/movie/week', { without_genres: WITHOUT_GENRES }),
  popular: (page = 1) => call('/movie/popular', { page, without_genres: WITHOUT_GENRES }),
  topRated: (page = 1) => call('/movie/top_rated', { page, without_genres: WITHOUT_GENRES }),
  upcoming: (page = 1) => call('/movie/upcoming', { page, without_genres: WITHOUT_GENRES }),
  details: (id) => call(`/movie/${id}`, { append_to_response: 'credits,videos,similar' }),
  search: (query, page = 1) => call('/search/movie', { query, page, include_adult: 'false' }),
  genres: () => call('/genre/movie/list'),
  discover: (params) => call('/discover/movie', { without_genres: WITHOUT_GENRES, ...params }),
};