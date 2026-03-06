import { ReactNode, useEffect, useRef, useState } from "react"
import { useGameStateContext } from "../../contexts/GameStateContext"
import { Button, Grid, useTheme } from "@mui/material"
import { Cancel, Check } from "@mui/icons-material"
import { LIGHT_COLOR_MODE } from "../../contexts/MaterialThemeContext"
import { PlayerActions } from "@shared"
import useGameMutation from "../../hooks/useGameMutation"
import { useTranslationContext } from "../../contexts/TranslationsContext"
import { useUserSettingsContext } from "../../contexts/UserSettingsContext"
import CoupTypography from '../utilities/CoupTypography'

function PlayerActionConfirmation({
  message,
  action,
  variables,
  onCancel
}: {
  message: ReactNode,
  action: PlayerActions,
  variables: object,
  onCancel: () => void
}) {
  const [autoSubmitProgress, setAutoSubmitProgress] = useState(0)
  const autoSubmitInterval = useRef<ReturnType<typeof setInterval>>(undefined)
  const { gameState } = useGameStateContext()
  const { t } = useTranslationContext()
  const theme = useTheme()
  const { trigger, isMutating } = useGameMutation<object>({ action })
  const { confirmActions } = useUserSettingsContext()

  useEffect(() => {
    if (confirmActions) {
      autoSubmitInterval.current = setInterval(() => {
        setAutoSubmitProgress((prev) => Math.min(100, prev + 1))
      }, 50)
    } else {
      trigger(variables)
    }

    return () => {
      clearInterval(autoSubmitInterval.current)
      autoSubmitInterval.current = undefined
    }
  }, [confirmActions, trigger, variables])

  useEffect(() => {
    if (autoSubmitInterval.current && autoSubmitProgress === 100) {
      clearInterval(autoSubmitInterval.current)
      autoSubmitInterval.current = undefined
      trigger(variables)
    }
  }, [autoSubmitProgress, trigger, variables])

  if (!gameState || !confirmActions) {
    return null
  }

  return (
    <>
      <CoupTypography variant="h6" my={1} fontWeight="bold" addTextShadow>
        {message}
      </CoupTypography>
      <Grid container spacing={2} justifyContent="center">
        <Grid>
          <Button
            startIcon={<Cancel />}
            variant="contained"
            onClick={() => {
              clearInterval(autoSubmitInterval.current)
              autoSubmitInterval.current = undefined
              setAutoSubmitProgress(100)
              onCancel()
            }}
            disabled={isMutating}
            sx={{
              py: 1.2,
              px: 3,
              fontSize: '0.95rem',
              fontWeight: 600,
              borderRadius: '12px',
              textTransform: 'none',
              letterSpacing: '0.3px',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.12) 100%)'
                : 'linear-gradient(135deg, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.08) 100%)',
              color: theme.palette.text.primary,
              border: `1.5px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)'}`,
              backdropFilter: 'blur(12px)',
              boxShadow: theme.palette.mode === 'dark'
                ? '0 4px 14px rgba(0,0,0,0.25)'
                : '0 4px 14px rgba(0,0,0,0.06)',
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
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: theme.palette.mode === 'dark'
                  ? '0 6px 20px rgba(0,0,0,0.4)'
                  : '0 6px 20px rgba(0,0,0,0.1)',
              },
              '&:active': { transform: 'scale(0.96)' },
            }}
          >
            {t('cancel')}
          </Button>
        </Grid>
        <Grid>
          <Button
            startIcon={<Check />}
            sx={{
              py: 1.2,
              px: 3,
              fontSize: '0.95rem',
              fontWeight: 600,
              borderRadius: '12px',
              textTransform: 'none',
              letterSpacing: '0.3px',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              color: theme.palette.primary.contrastText,
              boxShadow: '0 4px 14px rgba(46,125,50,0.3)',
              background: isMutating ? undefined : `
                linear-gradient(
                  to right,
                  ${theme.palette.primary.main}
                  ${autoSubmitProgress}%,
                  ${theme.palette.mode === LIGHT_COLOR_MODE ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.24)'}
                  ${autoSubmitProgress}%
                ) !important`,
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
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(46,125,50,0.45)',
              },
              '&:active': { transform: 'scale(0.96)' },
            }}
            variant="contained"
            onClick={() => {
              clearInterval(autoSubmitInterval.current)
              autoSubmitInterval.current = undefined
              setAutoSubmitProgress(100)
              trigger(variables)
            }}
            loading={isMutating}
          >
            {t('confirm')}
          </Button>
        </Grid>
      </Grid>
    </>
  )
}

export default PlayerActionConfirmation
