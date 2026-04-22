// OpenWork mobile theme — dark-first, matches the web client's purple identity.
import { useThemeStore } from '../store/themeStore';

export const palette = {
  dark: {
    bg: '#0E0E18',
    bg2: '#13131F',
    s1: '#181828',
    s2: '#1F1F31',
    s3: '#25253A',
    b1: 'rgba(255,255,255,0.06)',
    b2: 'rgba(255,255,255,0.10)',
    b3: 'rgba(255,255,255,0.18)',
    txt: '#F0EFF8',
    txt2: '#A8A6BE',
    txt3: '#6C6A85',
    primary: '#6C4EF6',
    primary2: '#9B6DFF',
    accent: '#00E5A0',
    ok: '#00E5A0',
    warn: '#FFB52E',
    err: '#FF4D6A',
    info: '#4FB3FF',
    cardBorder: 'rgba(255,255,255,0.06)',
    overlay: 'rgba(0,0,0,0.55)',
  },
  light: {
    bg: '#F7F7FB',
    bg2: '#FFFFFF',
    s1: '#FFFFFF',
    s2: '#F2F2F7',
    s3: '#E8E8F0',
    b1: 'rgba(17,24,39,0.06)',
    b2: 'rgba(17,24,39,0.10)',
    b3: 'rgba(17,24,39,0.18)',
    txt: '#1E2030',
    txt2: '#535472',
    txt3: '#8B8CA3',
    primary: '#6C4EF6',
    primary2: '#9B6DFF',
    accent: '#00B380',
    ok: '#00B380',
    warn: '#C88A00',
    err: '#D93956',
    info: '#2B8CE6',
    cardBorder: 'rgba(17,24,39,0.06)',
    overlay: 'rgba(0,0,0,0.35)',
  },
};

export const gradients = {
  primary: ['#6C4EF6', '#9B6DFF'],
  accent: ['#00E5A0', '#4FD1C5'],
  sunset: ['#FF6A6A', '#FFB52E'],
  hero: ['#0E0E18', '#181828', '#24173F'],
  heroLight: ['#EEF0FF', '#F7F7FB', '#FFFFFF'],
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  xxxl: 40,
};

export const radius = {
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
};

export const typography = {
  h1: { fontSize: 32, fontWeight: '800', letterSpacing: -0.5 },
  h2: { fontSize: 26, fontWeight: '800', letterSpacing: -0.3 },
  h3: { fontSize: 22, fontWeight: '700' },
  h4: { fontSize: 18, fontWeight: '700' },
  body: { fontSize: 15, fontWeight: '500' },
  small: { fontSize: 13, fontWeight: '500' },
  tiny: { fontSize: 11, fontWeight: '600' },
};

export const useTheme = () => {
  const mode = useThemeStore((s) => s.mode);
  const colors = palette[mode];
  return { mode, colors, gradients, spacing, radius, typography };
};
