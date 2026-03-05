import { Alert, Box, Button, CircularProgress, Grid, Link, useTheme } from "@mui/material"
import GameBoard from "../game/GameBoard"
import WaitingRoom from "../game/WaitingRoom"
import { useGameStateContext } from "../../contexts/GameStateContext"
import { Link as RouterLink, useSearchParams } from "react-router"
import { useTranslationContext } from "../../contexts/TranslationsContext"
import { Visibility } from "@mui/icons-material"
import CoupTypography from '../utilities/CoupTypography'

interface GameProps {
  leftDrawerOpen: boolean
  rightDrawerOpen: boolean
}

function Game({ leftDrawerOpen, rightDrawerOpen }: GameProps) {
  const { gameState, hasInitialStateLoaded } = useGameStateContext()
  const [searchParams] = useSearchParams()
  const { t } = useTranslationContext()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const roomId = searchParams.get('roomId')

  if (roomId && !gameState && !hasInitialStateLoaded) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'var(--app-content-height)' }}>
        <CircularProgress size={50} />
      </Box>
    )
  }

  if (!gameState) {
    return (
      <Grid mt={2} container spacing={2} direction="column">
        <Grid>
          <CoupTypography variant="h6" my={3} addTextShadow>
            {t('gameNotFound')}
          </CoupTypography>
        </Grid>
        <Grid>
          <Link component={RouterLink} to={`/`} sx={{ textDecoration: 'none' }}>
            <Button
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
              {t('home')}
            </Button>
          </Link>
        </Grid>
      </Grid>
    )
  }

  const spectatingAlert = gameState && !gameState.selfPlayer && (
    <Alert
      icon={<Visibility fontSize="inherit" />}
      severity="info"
      sx={{
        fontSize: 'larger',
        p: 0,
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {t('youAreSpectating')}
    </Alert>
  )

  return gameState.isStarted ? (
    // Google Translate doesn't work well with some React components
    // https://github.com/facebook/react/issues/11538
    // https://issues.chromium.org/issues/41407169
    <div className="notranslate">
      {spectatingAlert}
      <GameBoard leftDrawerOpen={leftDrawerOpen} rightDrawerOpen={rightDrawerOpen} />
    </div>
  ) : (
    <>
      {spectatingAlert}
      <WaitingRoom />
    </>
  )
}

export default Game
