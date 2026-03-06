import { Close, Delete } from "@mui/icons-material"
import { Box, Button, Grid, Typography, useTheme } from "@mui/material"
import { PlayerActions } from "@shared"
import { getPlayerId } from "../../helpers/players"
import useGameMutation from "../../hooks/useGameMutation"
import { useGameStateContext } from "../../contexts/GameStateContext"
import { useTranslationContext } from "../../contexts/TranslationsContext"
import { useButtonStyles } from "../../hooks/useButtonStyles"

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
  const btn = useButtonStyles()

  if (!gameState?.selfPlayer) {
    return null
  }

  const isResetPending = !!gameState.resetGameRequest
  const isResetMine = isResetPending && gameState.resetGameRequest?.player === gameState.selfPlayer?.name
  const playerIsDead = !gameState.selfPlayer?.influences.length

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
              sx={btn.glass('small')}
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
                sx={btn.glass('small')}
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
                sx={btn.danger('small')}
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
