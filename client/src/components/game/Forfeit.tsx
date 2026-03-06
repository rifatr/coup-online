import { useState } from "react"
import { Close, Flag } from "@mui/icons-material"
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Tooltip, useTheme } from "@mui/material"
import { PlayerActions } from "@shared"
import { getPlayerId } from "../../helpers/players"
import useGameMutation from "../../hooks/useGameMutation"
import { useGameStateContext } from "../../contexts/GameStateContext"
import { useTranslationContext } from "../../contexts/TranslationsContext"
import Bot from "../icons/Bot"
import Skull from "../icons/Skull"

const ForfeitIcon = Flag

function Forfeit() {
  const [confirmationOpen, setConfirmationOpen] = useState(false)

  const forfeitMutation = useGameMutation<{
    roomId: string, playerId: string, replaceWithAi: boolean
  }>({
    action: PlayerActions.forfeit, callback: () => {
      setConfirmationOpen(false)
    }
  })

  const { gameState } = useGameStateContext()
  const { t } = useTranslationContext()
  const theme = useTheme()
  const { isSmallScreen } = theme
  const isDark = theme.palette.mode === 'dark'

  const dialogBtnSx = {
    py: 1,
    px: 2.5,
    fontSize: '0.9rem',
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

  if (!gameState?.selfPlayer) {
    return null
  }

  const selfPlayerName = gameState.selfPlayer.name
  const playerIsDead = !gameState.selfPlayer.influences.length
  const gameIsOver = gameState.players.filter(({ influenceCount }) => influenceCount).length === 1
  const playerHasActionsPending =
    (gameState.turnPlayer === selfPlayerName && !!gameState.pendingAction)
    || gameState.pendingAction?.targetPlayer === selfPlayerName
    || gameState.pendingActionChallenge?.sourcePlayer === selfPlayerName
    || gameState.pendingBlock?.sourcePlayer === selfPlayerName
    || gameState.pendingBlockChallenge?.sourcePlayer === selfPlayerName
    || !!gameState.pendingInfluenceLoss[selfPlayerName]?.length
  const forfeitNotPossible = gameIsOver || playerIsDead || playerHasActionsPending

  return (
    <>
      <Box mt={1}>
        {!playerIsDead && (
          <>
            <Tooltip
              title={forfeitNotPossible && t('forfeitNotPossible')}>
              <span>
                <Button
                  size="small"
                  startIcon={<ForfeitIcon />}
                  disabled={forfeitNotPossible}
                  onClick={() => { setConfirmationOpen(true) }}
                  sx={{
                    py: 0.8,
                    px: 2,
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    borderRadius: '10px',
                    textTransform: 'none',
                    letterSpacing: '0.3px',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    background: isDark
                      ? 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.12) 100%)'
                      : 'linear-gradient(135deg, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.08) 100%)',
                    color: theme.palette.text.secondary,
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                    backdropFilter: 'blur(8px)',
                    boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.2)' : '0 2px 8px rgba(0,0,0,0.04)',
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
                  }}
                >
                  {t('forfeit')}
                </Button>
              </span>
            </Tooltip>
          </>
        )}
      </Box>
      <Dialog
        open={confirmationOpen}
        onClose={() => { setConfirmationOpen(false) }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {t('forfeitConfirmationTitle')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('forfeitConfirmationMessage')}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{
          ...(isSmallScreen && { flexDirection: 'column', alignItems: 'flex-end', gap: 2 })
        }}>
          <Button
            startIcon={<Close />}
            onClick={() => { setConfirmationOpen(false) }}
            disabled={forfeitMutation.isMutating}
            sx={{
              ...dialogBtnSx,
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
          <Button
            startIcon={<Skull />}
            onClick={async () => {
              await forfeitMutation.trigger({
                roomId: gameState.roomId,
                playerId: getPlayerId(),
                replaceWithAi: false
              })
            }}
            disabled={forfeitNotPossible}
            loading={forfeitMutation.isMutating}
            sx={{
              ...dialogBtnSx,
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
            {t('forfeitKillInfluences')}
          </Button>
          <Button
            startIcon={<Bot />}
            onClick={async () => {
              await forfeitMutation.trigger({
                roomId: gameState.roomId,
                playerId: getPlayerId(),
                replaceWithAi: true
              })
            }}
            disabled={forfeitNotPossible}
            loading={forfeitMutation.isMutating}
            sx={{
              ...dialogBtnSx,
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
            {t('forfeitReplaceWithAi')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default Forfeit
