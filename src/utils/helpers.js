export const formatCurrency = (amount, currency = 'USD') => {
  const n = Number(amount || 0);
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(n);
  } catch {
    return `$${n.toFixed(0)}`;
  }
};

export const formatCompactNumber = (num) => {
  if (num === null || num === undefined) return '0';
  const sign = num < 0 ? '-' : '';
  let n = Math.abs(num);
  if (n >= 999_500) n = Math.round(n);
  if (n >= 1_000_000_000) return sign + (n / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
  if (n >= 1_000_000) return sign + (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1_000) return sign + (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  return sign + Math.floor(n).toString();
};

export const formatCompactCurrency = (amount, currency = 'USD') =>
  `$${formatCompactNumber(amount)}`;

export const formatDate = (date, opts = {}) => {
  if (!date) return '';
  try {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...opts,
    });
  } catch {
    return '';
  }
};

export const formatRelative = (date) => {
  if (!date) return '';
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatDate(date);
};

export const getInitials = (name = '') =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || '')
    .join('') || '?';

export const getAvatarGradient = (name = '') => {
  const gradients = [
    ['#6C4EF6', '#9B6DFF'],
    ['#00E5A0', '#4FD1C5'],
    ['#FF6A6A', '#FFB52E'],
    ['#4FB3FF', '#6C4EF6'],
    ['#FFB52E', '#FF6A6A'],
    ['#9B6DFF', '#FF6A9E'],
    ['#00E5A0', '#00B4D8'],
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return gradients[hash % gradients.length];
};

export const truncate = (s = '', n = 120) =>
  s.length > n ? s.slice(0, n - 1) + '…' : s;

export const safeArray = (v) => (Array.isArray(v) ? v : []);

export const plural = (n, s, p) => (n === 1 ? `${n} ${s}` : `${n} ${p || s + 's'}`);
