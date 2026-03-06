import { useCallback, useState, useRef } from "react"
import { Analytics } from '@vercel/analytics/react'
import { Box, Breadcrumbs, Button, Grid, Link, TextField, Typography } from "@mui/material"
import { Person, Group, GroupAdd, Visibility } from "@mui/icons-material"
import { Link as RouterLink, useNavigate, useSearchParams } from "react-router"
import { PlayerActions } from '@shared'
import { getPlayerId } from "../../helpers/players"
import useGameMutation from "../../hooks/useGameMutation"
import { useTranslationContext } from "../../contexts/TranslationsContext"
import CoupTypography from '../utilities/CoupTypography'
import { useButtonStyles } from "../../hooks/useButtonStyles"

function JoinGame() {
  const [searchParams] = useSearchParams()
  const [roomId, setRoomId] = useState(searchParams.get('roomId') ?? '')
  const [playerName, setPlayerName] = useState('')
  const navigate = useNavigate()
  const { t } = useTranslationContext()
  const btn = useButtonStyles()
  const formRef = useRef<HTMLFormElement>(null)
  const playerNameInputRef = useRef<HTMLInputElement>(null)

  const navigateToRoom = useCallback(() => {
    navigate(`/game?roomId=${roomId}`)
  }, [navigate, roomId])

  const { trigger: joinTrigger, isMutating: joinIsMutating } = useGameMutation<{
    roomId: string, playerId: string, playerName: string
  }>({ action: PlayerActions.joinGame, callback: navigateToRoom })

  const { trigger: spectateTrigger, isMutating: spectateIsMutating } = useGameMutation<{
    roomId: string, playerId: string
  }>({ action: PlayerActions.gameState, callback: navigateToRoom })

  return (
    <>
      <Analytics />
      <Breadcrumbs sx={{ m: 2 }} aria-label="breadcrumb">
        <Link component={RouterLink} to='/'>
          {t('home')}
        </Link>
        <Typography>
          {t('joinExistingGame')}
        </Typography>
      </Breadcrumbs>
      <CoupTypography variant="h5" sx={{ m: 5 }} addTextShadow>
        {t('joinExistingGame')}
      </CoupTypography>
      <form
        ref={formRef}
        noValidate
        onSubmit={(event) => {
          event.preventDefault()

          const buttonId = (event.nativeEvent as SubmitEvent).submitter?.id

          if (buttonId === 'joinGameButton') {
            playerNameInputRef.current!.setAttribute('required', '')
            if (formRef.current!.checkValidity()) joinTrigger({
              roomId: roomId.trim(),
              playerId: getPlayerId(),
              playerName: playerName.trim()
            })
          } else if (buttonId === 'spectateGameButton') {
            playerNameInputRef.current!.removeAttribute('required')
            if (formRef.current!.checkValidity()) spectateTrigger({
              roomId: roomId.trim(),
              playerId: getPlayerId()
            })
          } else {
            console.error('Unexpected button ID:', buttonId)
          }
          formRef.current!.reportValidity()
        }}
      >
        <Grid container direction="column" alignItems='center' spacing={2}>
          <Grid>
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
              <Group sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
              <TextField
                data-testid='roomIdInput'
                value={roomId}
                onChange={(event) => {
                  setRoomId(event.target.value.slice(0, 6).toUpperCase())
                }}
                label={t('room')}
                variant="standard"
                required
              />
            </Box>
          </Grid>
          <Grid>
            <Box sx={{ display: 'flex', alignItems: 'flex-end', mt: 3 }}>
              <Person sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
              <TextField
                name="coup-game-player-name"
                autoComplete="off"
                slotProps={{
                  htmlInput: { ref: playerNameInputRef }
                }}
                data-testid='playerNameInput'
                value={playerName}
                onChange={(event) => {
                  setPlayerName(event.target.value.slice(0, 10))
                }}
                label={t('whatIsYourName')}
                variant="standard"
                required
              />
            </Box>
          </Grid>
          <Grid sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2.5, mt: 3 }}>
            <Button
              id="joinGameButton"
              type="submit"
              loading={joinIsMutating}
              startIcon={<GroupAdd />}
              sx={btn.secondary()}
            >
              {t('joinGame')}
            </Button>
            <Button
              id="spectateGameButton"
              type="submit"
              loading={spectateIsMutating}
              startIcon={<Visibility />}
              sx={btn.glass()}
            >
              {t('spectateGame')}
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  )
}

export default JoinGame
