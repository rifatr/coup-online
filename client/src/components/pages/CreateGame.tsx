import { useCallback, useState } from 'react'
import {
  Box,
  Breadcrumbs,
  Button,
  Grid,
  Link,
  Slider,
  Switch,
  TextField,
  Typography,
  useTheme,
} from '@mui/material'
import { AddCircle, Person } from '@mui/icons-material'
import { Link as RouterLink, useNavigate } from 'react-router'
import { getPlayerId } from '../../helpers/players'
import { Analytics } from '@vercel/analytics/react'
import {
  GameSettings,
  PlayerActions,
  DehydratedPublicGameState,
} from '@shared'
import useGameMutation from '../../hooks/useGameMutation'
import { useTranslationContext } from '../../contexts/TranslationsContext'
import {
  allowReviveStorageKey,
  eventLogRetentionTurnsStorageKey,
  speedRoundEnabledStorageKey,
  speedRoundSecondsStorageKey,
} from '../../helpers/localStorageKeys'
import CoupTypography from '../utilities/CoupTypography'
import { usePersistedState } from '../../hooks/usePersistedState'

function CreateGame() {
  const [playerName, setPlayerName] = useState('')
  const [eventLogRetentionTurns, setEventLogRetentionTurns] = usePersistedState<number>(eventLogRetentionTurnsStorageKey, 3)
  const [allowRevive, setAllowRevive] = usePersistedState<boolean>(allowReviveStorageKey, false)
  const [speedRoundEnabled, setSpeedRoundEnabled] = usePersistedState<boolean>(speedRoundEnabledStorageKey, false)
  const [speedRoundSeconds, setSpeedRoundSeconds] = usePersistedState<number>(speedRoundSecondsStorageKey, 10)
  const navigate = useNavigate()
  const { t } = useTranslationContext()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  const navigateToRoom = useCallback(
    (gameState: DehydratedPublicGameState) => {
      navigate(`/game?roomId=${gameState.roomId}`)
    },
    [navigate]
  )

  const { trigger, isMutating } = useGameMutation<{
    playerId: string
    playerName: string
    settings: GameSettings
  }>({ action: PlayerActions.createGame, callback: navigateToRoom })

  return (
    <>
      <Analytics />
      <Breadcrumbs sx={{ m: 2 }} aria-label="breadcrumb">
        <Link component={RouterLink} to="/">
          {t('home')}
        </Link>
        <Typography>{t('createNewGame')}</Typography>
      </Breadcrumbs>
      <CoupTypography variant="h5" sx={{ m: 5 }} addTextShadow>
        {t('createNewGame')}
      </CoupTypography>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          trigger({
            playerId: getPlayerId(),
            playerName: playerName.trim(),
            settings: {
              eventLogRetentionTurns,
              allowRevive,
              ...(speedRoundEnabled && { speedRoundSeconds }),
            },
          })
        }}
      >
        <Grid container direction="column" alignItems="center">
          <Grid>
            <Box sx={{ display: 'flex', alignItems: 'flex-end', mt: 3 }}>
              <Person sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
              <TextField
                name="coup-game-player-name"
                autoComplete="off"
                data-testid="playerNameInput"
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
          <Grid sx={{ maxWidth: '300px', width: '90%' }}>
            <Box mt={6}>
              <CoupTypography mt={2} addTextShadow>
                {t('eventLogRetentionTurns')}
                {`: ${eventLogRetentionTurns}`}
              </CoupTypography>
              <Slider
                data-testid="eventLogRetentionTurnsInput"
                step={1}
                value={eventLogRetentionTurns}
                valueLabelDisplay="auto"
                min={1}
                max={100}
                onChange={(_: Event, value: number) => {
                  setEventLogRetentionTurns(value)
                }}
              />
            </Box>
          </Grid>
          {/* <Grid sx={{ maxWidth: '300px', width: '90%' }}>
            <Box mt={2}>
              <CoupTypography component="span" mt={2} addTextShadow>
                {t('allowRevive')}:
              </CoupTypography>
              <Switch
                checked={allowRevive}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setAllowRevive(event.target.checked)
                }}
                slotProps={{ input: { 'aria-label': 'controlled' } }}
              />
            </Box>
          </Grid> */}
          <Grid sx={{ maxWidth: '300px', width: '90%' }}>
            <Box mt={2}>
              <CoupTypography component="span" mt={2} addTextShadow>
                {t('speedRound')}:
              </CoupTypography>
              <Switch
                checked={speedRoundEnabled}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setSpeedRoundEnabled(event.target.checked)
                }}
                slotProps={{ input: { 'aria-label': 'controlled' } }}
              />
            </Box>
          </Grid>
          {speedRoundEnabled && (
            <Grid sx={{ maxWidth: '300px', width: '90%' }}>
              <Box mt={2}>
                <CoupTypography mt={2} addTextShadow>
                  {t('speedRoundSeconds')}
                  {`: ${speedRoundSeconds}`}
                </CoupTypography>
                <Slider
                  data-testid="speedRoundSecondsInput"
                  step={1}
                  value={speedRoundSeconds}
                  valueLabelDisplay="auto"
                  min={5}
                  max={60}
                  onChange={(_: Event, value: number) => {
                    setSpeedRoundSeconds(value)
                  }}
                />
              </Box>
            </Grid>
          )}
        </Grid>
        <Grid>
          <Button
            type="submit"
            loading={isMutating}
            startIcon={<AddCircle />}
            sx={{
              mt: 5,
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
            {t('createGame')}
          </Button>
        </Grid>
      </form>
    </>
  )
}

export default CreateGame
