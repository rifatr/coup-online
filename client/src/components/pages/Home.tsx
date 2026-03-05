import { Box, Button, useTheme } from "@mui/material"
import { useNavigate } from "react-router"
import { useTranslationContext } from "../../contexts/TranslationsContext"
import { AddCircle, Gavel, GroupAdd } from "@mui/icons-material"
import CoupTypography from '../utilities/CoupTypography'

interface HomeProps {
  setRulesOpen: (open: boolean) => void
}

function Home({ setRulesOpen }: Readonly<HomeProps>) {
  const navigate = useNavigate()
  const { t } = useTranslationContext()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  const buttonBase = {
    width: 300,
    py: 1.8,
    fontSize: '1.05rem',
    fontWeight: 700,
    letterSpacing: '0.5px',
    borderRadius: '16px',
    textTransform: 'none' as const,
    position: 'relative' as const,
    overflow: 'hidden',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: '-100%',
      width: '100%',
      height: '100%',
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
      transition: 'left 0.5s ease',
    },
    '&:hover::before': {
      left: '100%',
    },
    '&:active': {
      transform: 'scale(0.97)',
    },
  }

  return (
    <Box sx={{
      position: 'relative',
      minHeight: 'calc(100vh - 60px)'
    }}>
      <CoupTypography variant="h4" sx={{ mt: 5 }} addTextShadow>
        {t('welcomeToCoup')}
      </CoupTypography>
      <CoupTypography variant="h5" sx={{ mt: 2 }} addTextShadow>
        {t('briefDescriptionOfCoup')}
      </CoupTypography>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        gap: 2.5,
      }}>
        <Button
          sx={{
            ...buttonBase,
            background: isDark
              ? 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 50%, #43a047 100%)'
              : 'linear-gradient(135deg, #2e7d32 0%, #43a047 50%, #66bb6a 100%)',
            color: '#fff',
            boxShadow: '0 6px 24px rgba(46,125,50,0.35)',
            '&:hover': {
              transform: 'translateY(-3px)',
              boxShadow: '0 10px 36px rgba(46,125,50,0.5)',
            },
          }}
          onClick={() => { navigate(`/create-game`) }}
          startIcon={<AddCircle />}
        >{t('createNewGame')}</Button>
        <Button
          sx={{
            ...buttonBase,
            background: isDark
              ? 'linear-gradient(135deg, #1a237e 0%, #283593 50%, #3949ab 100%)'
              : 'linear-gradient(135deg, #283593 0%, #3949ab 50%, #5c6bc0 100%)',
            color: '#fff',
            boxShadow: '0 6px 24px rgba(40,53,147,0.35)',
            '&:hover': {
              transform: 'translateY(-3px)',
              boxShadow: '0 10px 36px rgba(40,53,147,0.5)',
            },
          }}
          onClick={() => { navigate(`/join-game`) }}
          startIcon={<GroupAdd />}
        >{t('joinExistingGame')}</Button>
        <Button
          sx={{
            ...buttonBase,
            background: isDark
              ? 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.12) 100%)'
              : 'linear-gradient(135deg, rgba(0,0,0,0.03) 0%, rgba(0,0,0,0.07) 100%)',
            color: theme.palette.text.primary,
            border: `1.5px solid ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)'}`,
            backdropFilter: 'blur(12px)',
            boxShadow: isDark
              ? '0 4px 16px rgba(0,0,0,0.25)'
              : '0 4px 16px rgba(0,0,0,0.06)',
            '&:hover': {
              transform: 'translateY(-3px)',
              background: isDark
                ? 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.18) 100%)'
                : 'linear-gradient(135deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.1) 100%)',
              boxShadow: isDark
                ? '0 8px 28px rgba(0,0,0,0.4)'
                : '0 8px 28px rgba(0,0,0,0.1)',
            },
          }}
          onClick={() => setRulesOpen(true)}
          startIcon={<Gavel />}
        >{t('learnToPlay')}</Button>
      </Box>
    </Box>
  )
}

export default Home
