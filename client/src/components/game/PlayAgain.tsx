import { Button } from "@mui/material"
import { getPlayerId } from "../../helpers/players"
import { useGameStateContext } from "../../contexts/GameStateContext"
import { PlayerActions } from "@shared"
import useGameMutation from "../../hooks/useGameMutation"
import { useTranslationContext } from "../../contexts/TranslationsContext"
import { useButtonStyles } from "../../hooks/useButtonStyles"

function PlayAgain() {
  const { gameState } = useGameStateContext()
  const { t } = useTranslationContext()
  const btn = useButtonStyles()

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
        sx={btn.primary()}
      >
        {t('playAgain')}
      </Button>
    </>
  )
}

export default PlayAgain
