import { Button, useTheme } from "@mui/material"
import { getPlayerId } from "../../helpers/players"
import { useGameStateContext } from "../../contexts/GameStateContext"
import { PlayerActions } from "@shared"
import useGameMutation from "../../hooks/useGameMutation"
import { useTranslationContext } from "../../contexts/TranslationsContext"

function PlayAgain() {
  const { gameState } = useGameStateContext()
  const { t } = useTranslationContext()
  const isDark = useTheme().palette.mode === 'dark'

  const { trigger, isMutating } = useGameMutation<{
    roomId: string, playerId: string
  }>({ action: PlayerActions.resetGame })

  if (!gameState) {
    return null
  }

  return (
    <>
      <Button
        onClick={() => {
          trigger({
            playerId: getPlayerId(),
            roomId: gameState.roomId
          })
        }}
        loading={isMutating}
        sx={{
          width: 260,
          py: 1.5,
          fontSize: '1.05rem',
          fontWeight: 700,
          letterSpacing: '0.5px',
          borderRadius: '14px',
          textTransform: 'none',
          position: 'relative',
          overflow: 'hidden',
          background: isDark
            ? 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 50%, #43a047 100%)'
            : 'linear-gradient(135deg, #2e7d32 0%, #43a047 50%, #66bb6a 100%)',
          color: '#fff',
          boxShadow: '0 6px 24px rgba(46,125,50,0.35)',
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
          '&:hover::before': { left: '100%' },
          '&:hover': {
            transform: 'translateY(-3px)',
            boxShadow: '0 10px 36px rgba(46,125,50,0.5)',
          },
          '&:active': { transform: 'scale(0.97)' },
        }}
      >
        {t('playAgain')}
      </Button>
    </>
  )
}

export default PlayAgain
