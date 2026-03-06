import { useTheme } from '@mui/material'

const shimmer = {
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)',
    transition: 'left 0.5s ease',
  },
  '&:hover::before': { left: '100%' },
} as const

function base(size: 'small' | 'medium' | 'large') {
  const sizes = {
    small: { py: 0.8, px: 2, fontSize: '0.8rem', borderRadius: '10px' },
    medium: { py: 1.2, px: 3, fontSize: '0.95rem', borderRadius: '12px' },
    large: { py: 1.8, px: 4, width: 300, fontSize: '1.05rem', borderRadius: '16px' },
  }

  return {
    ...sizes[size],
    fontWeight: size === 'large' ? 700 : 600,
    letterSpacing: size === 'small' ? '0.3px' : '0.5px',
    textTransform: 'none',
    position: 'relative',
    overflow: 'hidden',
    transition: `all ${size === 'small' ? '0.25s' : '0.3s'} cubic-bezier(0.4, 0, 0.2, 1)`,
    ...shimmer,
    '&:active': { transform: size === 'small' ? 'scale(0.96)' : 'scale(0.97)' },
  }
}

function hoverLift(amount: number, shadow?: string) {
  return {
    '&:hover': {
      transform: `translateY(-${amount}px)`,
      ...(shadow && { boxShadow: shadow }),
    },
  }
}

export function useButtonStyles() {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  const glass = (size: 'small' | 'medium' | 'large' = 'large') => ({
    ...base(size),
    background: isDark
      ? 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.12) 100%)'
      : 'linear-gradient(135deg, rgba(0,0,0,0.03) 0%, rgba(0,0,0,0.07) 100%)',
    color: size === 'small' ? theme.palette.text.secondary : theme.palette.text.primary,
    border: `${size === 'large' ? '1.5px' : '1px'} solid ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)'}`,
    backdropFilter: 'blur(12px)',
    boxShadow: isDark ? '0 4px 16px rgba(0,0,0,0.25)' : '0 4px 16px rgba(0,0,0,0.06)',
    ...hoverLift(size === 'small' ? 1 : 3),
    '&:hover': {
      transform: `translateY(-${size === 'small' ? 1 : 3}px)`,
      background: isDark
        ? 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.18) 100%)'
        : 'linear-gradient(135deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.1) 100%)',
      boxShadow: isDark
        ? `0 ${size === 'small' ? 5 : 8}px ${size === 'small' ? 18 : 28}px rgba(0,0,0,0.4)`
        : `0 ${size === 'small' ? 5 : 8}px ${size === 'small' ? 18 : 28}px rgba(0,0,0,0.1)`,
    },
  })

  const gradient = (
    colors: { dark: string[]; light: string[] },
    shadowColor: string,
    size: 'small' | 'medium' | 'large' = 'large'
  ) => {
    const c = isDark ? colors.dark : colors.light
    return {
      ...base(size),
      background: `linear-gradient(135deg, ${c[0]} 0%, ${c[1]} 50%, ${c[2]} 100%)`,
      color: '#fff',
      boxShadow: `0 ${size === 'small' ? 3 : 6}px ${size === 'small' ? 12 : 24}px ${shadowColor}`,
      '&:hover': {
        transform: `translateY(-${size === 'small' ? 1 : 3}px)`,
        boxShadow: `0 ${size === 'small' ? 5 : 10}px ${size === 'small' ? 18 : 36}px ${shadowColor.replace(/[\d.]+\)$/, (m) => `${parseFloat(m) + 0.15})`)}`,
      },
      '&:disabled': {
        background: isDark
          ? 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.08) 100%)'
          : 'linear-gradient(135deg, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.12) 100%)',
        color: theme.palette.text.disabled,
        boxShadow: 'none',
      },
    }
  }

  const primary = (size: 'small' | 'medium' | 'large' = 'large') => gradient(
    { dark: ['#1b5e20', '#2e7d32', '#43a047'], light: ['#2e7d32', '#43a047', '#66bb6a'] },
    'rgba(46,125,50,0.35)',
    size
  )

  const secondary = (size: 'small' | 'medium' | 'large' = 'large') => gradient(
    { dark: ['#1a237e', '#283593', '#3949ab'], light: ['#283593', '#3949ab', '#5c6bc0'] },
    'rgba(40,53,147,0.35)',
    size
  )

  const danger = (size: 'small' | 'medium' | 'large' = 'large') => gradient(
    { dark: ['#b71c1c', '#c62828', '#e53935'], light: ['#c62828', '#e53935', '#ef5350'] },
    'rgba(198,40,40,0.3)',
    size
  )

  const accent = (size: 'small' | 'medium' | 'large' = 'large') => gradient(
    { dark: ['#4a148c', '#6a1b9a', '#8e24aa'], light: ['#6a1b9a', '#8e24aa', '#ab47bc'] },
    'rgba(106,27,154,0.35)',
    size
  )

  return { glass, primary, secondary, danger, accent }
}
