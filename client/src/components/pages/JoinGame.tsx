import { useCallback, useState, useRef } from "react"
import { Analytics } from '@vercel/analytics/react'
import { Box, Breadcrumbs, Button, Grid, Link, TextField, Typography, useTheme } from "@mui/material"
import { Person, Group, GroupAdd, Visibility } from "@mui/icons-material"
import { Link as RouterLink, useNavigate, useSearchParams } from "react-router"
import { PlayerActions } from '@shared'
import { getPlayerId } from "../../helpers/players"
import useGameMutation from "../../hooks/useGameMutation"
import { useTranslationContext } from "../../contexts/TranslationsContext"
import CoupTypography from '../utilities/CoupTypography'

function JoinGame() {
  const [searchParams] = useSearchParams()
  const [roomId, setRoomId] = useState(searchParams.get('roomId') ?? '')
  const [playerName, setPlayerName] = useState('')
  const navigate = useNavigate()
  const { t } = useTranslationContext()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
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
              sx={{
                width: 300,
                py: 1.8,
                fontSize: '1.05rem',
                fontWeight: 700,
                letterSpacing: '0.5px',
                borderRadius: '16px',
                textTransform: 'none',
                position: 'relative',
                overflow: 'hidden',
                background: isDark
                  ? 'linear-gradient(135deg, #1a237e 0%, #283593 50%, #3949ab 100%)'
                  : 'linear-gradient(135deg, #283593 0%, #3949ab 50%, #5c6bc0 100%)',
                color: '#fff',
                boxShadow: '0 6px 24px rgba(40,53,147,0.35)',
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
                  boxShadow: '0 10px 36px rgba(40,53,147,0.5)',
                },
                '&:active': { transform: 'scale(0.97)' },
              }}
            >
              {t('joinGame')}
            </Button>
            <Button
              id="spectateGameButton"
              type="submit"
              loading={spectateIsMutating}
              startIcon={<Visibility />}
              sx={{
                width: 300,
                py: 1.8,
                fontSize: '1.05rem',
                fontWeight: 700,
                letterSpacing: '0.5px',
                borderRadius: '16px',
                textTransform: 'none',
                position: 'relative',
                overflow: 'hidden',
                background: isDark
                  ? 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.12) 100%)'
                  : 'linear-gradient(135deg, rgba(0,0,0,0.03) 0%, rgba(0,0,0,0.07) 100%)',
                color: theme.palette.text.primary,
                border: `1.5px solid ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)'}`,
                backdropFilter: 'blur(12px)',
                boxShadow: isDark
                  ? '0 4px 16px rgba(0,0,0,0.25)'
                  : '0 4px 16px rgba(0,0,0,0.06)',
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
                  background: isDark
                    ? 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.18) 100%)'
                    : 'linear-gradient(135deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.1) 100%)',
                  boxShadow: isDark
                    ? '0 8px 28px rgba(0,0,0,0.4)'
                    : '0 8px 28px rgba(0,0,0,0.1)',
                },
                '&:active': { transform: 'scale(0.97)' },
              }}
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
