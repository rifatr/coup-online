import { Close, Delete } from "@mui/icons-material"
import { Box, Button, Grid, Typography, useTheme } from "@mui/material"
import { PlayerActions } from "@shared"
import { getPlayerId } from "../../helpers/players"
import useGameMutation from "../../hooks/useGameMutation"
import { useGameStateContext } from "../../contexts/GameStateContext"
import { useTranslationContext } from "../../contexts/TranslationsContext"

const ResetIcon = Delete

function RequestReset() {
  const resetGameRequest = useGameMutation<{
    roomId: string, playerId: string
  }>({ action: PlayerActions.resetGameRequest })

  const resetGameRequestCancel = useGameMutation<{
    roomId: string, playerId: string
  }>({ action: PlayerActions.resetGameRequestCancel })

  const resetGame = useGameMutation<{
    roomId: string, playerId: string
  }>({ action: PlayerActions.resetGame })

  const { gameState } = useGameStateContext()
  const { t } = useTranslationContext()
  const theme = useTheme()

  if (!gameState?.selfPlayer) {
    return null
  }

  const isResetPending = !!gameState.resetGameRequest
  const isResetMine = isResetPending && gameState.resetGameRequest?.player === gameState.selfPlayer?.name
  const playerIsDead = !gameState.selfPlayer?.influences.length

  const isDark = theme.palette.mode === 'dark'

  const smallBtnSx = {
    py: 0.8,
    px: 2,
    fontSize: '0.8rem',
    fontWeight: 600,
    borderRadius: '10px',
    textTransform: 'none' as const,
    letterSpacing: '0.3px',
    position: 'relative' as const,
    overflow: 'hidden',
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
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
    '&:hover': { transform: 'translateY(-1px)' },
    '&:active': { transform: 'scale(0.96)' },
  }

  return (
    <>
      <Box mt={1}>
        {(!isResetPending || isResetMine || playerIsDead) && (
          <>
            <Button
              color="secondary"
              size="small"
              startIcon={<ResetIcon />}
              onClick={() => {
                resetGameRequest.trigger({
                  roomId: gameState.roomId,
                  playerId: getPlayerId()
                })
              }}
              disabled={resetGameRequest.isMutating || isResetPending}
              sx={{
                ...smallBtnSx,
                background: isDark
                  ? 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.12) 100%)'
                  : 'linear-gradient(135deg, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.08) 100%)',
                color: theme.palette.text.secondary,
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                backdropFilter: 'blur(8px)',
                boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.2)' : '0 2px 8px rgba(0,0,0,0.04)',
              }}
            >
              {!isResetPending ? t('resetGame') : t('waitingOnOtherPlayers')}
            </Button>
          </>
        )}
      </Box>
      {isResetPending && !isResetMine && !playerIsDead && (
        <>
          <Typography>
            {t('playerWantToReset', {
              primaryPlayer: gameState.resetGameRequest!.player,
              gameState
            })}
          </Typography>
          <Grid mt={1} container spacing={1}
            sx={{
              justifyContent: 'center',
              [theme.breakpoints.up('md')]: { justifyContent: 'flex-end' }
            }}>
            <Grid>
              <Button
                size="small"
                startIcon={<Close />}
                disabled={resetGameRequestCancel.isMutating}
                onClick={() => {
                  resetGameRequestCancel.trigger({
                    roomId: gameState.roomId,
                    playerId: getPlayerId()
                  })
                }}
                sx={{
                  ...smallBtnSx,
                  background: isDark
                    ? 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.12) 100%)'
                    : 'linear-gradient(135deg, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.08) 100%)',
                  color: theme.palette.text.primary,
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                  backdropFilter: 'blur(8px)',
                }}
              >
                {t('cancel')}
              </Button>
            </Grid>
            <Grid>
              <Button
                size="small"
                startIcon={<ResetIcon />}
                disabled={resetGame.isMutating}
                onClick={() => {
                  resetGame.trigger({
                    roomId: gameState.roomId,
                    playerId: getPlayerId()
                  })
                }}
                sx={{
                  ...smallBtnSx,
                  background: isDark
                    ? 'linear-gradient(135deg, #b71c1c 0%, #c62828 100%)'
                    : 'linear-gradient(135deg, #c62828 0%, #e53935 100%)',
                  color: '#fff',
                  boxShadow: '0 3px 12px rgba(198,40,40,0.3)',
                  '&:hover': {
                    transform: 'translateY(-1px)',
                    boxShadow: '0 5px 18px rgba(198,40,40,0.45)',
                  },
                }}
              >
                {t('resetGame')}
              </Button>
            </Grid>
          </Grid>
        </>
      )}
    </>
  )
}

export default RequestReset
