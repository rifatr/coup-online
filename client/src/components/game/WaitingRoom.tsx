import { useState } from "react"
import { Box, Button, Grid, useTheme } from "@mui/material"
import Players from "../game/Players"
import { QRCodeSVG } from 'qrcode.react'
import { ContentCopy, GroupAdd, PlayArrow } from "@mui/icons-material"
import { getPlayerId } from "../../helpers/players"
import { useGameStateContext } from "../../contexts/GameStateContext"
import { LIGHT_COLOR_MODE } from "../../contexts/MaterialThemeContext"
import { MAX_PLAYER_COUNT, PlayerActions } from "@shared"
import useGameMutation from "../../hooks/useGameMutation"
import Bot from "../icons/Bot"
import AddAiPlayer from "./AddAiPlayer"
import { useTranslationContext } from "../../contexts/TranslationsContext"
import { useNavigate } from "react-router"
import { useNotificationsContext } from "../../contexts/NotificationsContext"
import CoupTypography from '../utilities/CoupTypography'

function WaitingRoom() {
  const [addAiPlayerDialogOpen, setAddAiPlayerDialogOpen] = useState(false)
  const { gameState } = useGameStateContext()
  const { t } = useTranslationContext()
  const theme = useTheme()
  const navigate = useNavigate()
  const { showNotification } = useNotificationsContext()

  const { trigger, isMutating } = useGameMutation<{
    roomId: string, playerId: string
  }>({ action: PlayerActions.startGame })

  const isDark = theme.palette.mode === 'dark'

  const buttonBase = {
    width: 300,
    py: 1.8,
    fontSize: '1.05rem',
    fontWeight: 700,
    letterSpacing: '0.5px',
    borderRadius: '16px',
    textTransform: 'none' as const,
    position: 'relative' as const,
    overflow: 'hidden',
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
    '&:active': { transform: 'scale(0.97)' },
  }

  if (!gameState) {
    return null
  }

  const inviteLink = `${window.location.origin}/join-game?roomId=${gameState.roomId}`

  return (
    <>
      <Grid container direction='column' justifyContent="center">
        <Grid sx={{ p: 2, mt: 4 }}>
          <Players inWaitingRoom />
        </Grid>
      </Grid>
      <CoupTypography variant="h5" m={3} addTextShadow>
        {t('room')}
        : <strong>{gameState.roomId}</strong>
      </CoupTypography>
      <Grid container direction='column' spacing={2}>
        <Grid>
          <QRCodeSVG
            bgColor="transparent"
            fgColor={theme.palette.primary[theme.palette.mode === LIGHT_COLOR_MODE ? 'dark' : 'light']}
            value={inviteLink}
          />
        </Grid>
        <Grid>
          <Button
            startIcon={<ContentCopy />}
            onClick={() => {
              navigator.clipboard.writeText(inviteLink)
              showNotification({
                id: 'inviteLinkCopied',
                message: t('inviteLinkCopied'),
                severity: 'success'
              })
            }}
            sx={{
              ...buttonBase,
              background: isDark
                ? 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.12) 100%)'
                : 'linear-gradient(135deg, rgba(0,0,0,0.03) 0%, rgba(0,0,0,0.07) 100%)',
              color: theme.palette.text.primary,
              border: `1.5px solid ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)'}`,
              backdropFilter: 'blur(12px)',
              boxShadow: isDark
                ? '0 4px 16px rgba(0,0,0,0.25)'
                : '0 4px 16px rgba(0,0,0,0.06)',
              '&:hover': {
                transform: 'translateY(-3px)',
                background: isDark
                  ? 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.18) 100%)'
                  : 'linear-gradient(135deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.1) 100%)',
                boxShadow: isDark
                  ? '0 8px 28px rgba(0,0,0,0.4)'
                  : '0 8px 28px rgba(0,0,0,0.1)',
              },
            }}
          >
            {(t('copyInviteLink'))}
          </Button>
        </Grid>
        {!!gameState.selfPlayer && (
          <Grid>
            <Button
              startIcon={<Bot />}
              onClick={() => {
                setAddAiPlayerDialogOpen(true)
              }}
              disabled={gameState.players.length === MAX_PLAYER_COUNT}
              sx={{
                ...buttonBase,
                background: isDark
                  ? 'linear-gradient(135deg, #4a148c 0%, #6a1b9a 50%, #8e24aa 100%)'
                  : 'linear-gradient(135deg, #6a1b9a 0%, #8e24aa 50%, #ab47bc 100%)',
                color: '#fff',
                boxShadow: '0 6px 24px rgba(106,27,154,0.35)',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: '0 10px 36px rgba(106,27,154,0.5)',
                },
                '&:disabled': {
                  background: isDark
                    ? 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.08) 100%)'
                    : 'linear-gradient(135deg, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.12) 100%)',
                  color: theme.palette.text.disabled,
                  boxShadow: 'none',
                },
              }}
            >
              {(t('addAiPlayer'))}
            </Button>
          </Grid>
        )}
        {!!gameState.selfPlayer && (
          <Grid>
            <Button
              onClick={() => {
                trigger({
                  roomId: gameState.roomId,
                  playerId: getPlayerId()
                })
              }}
              disabled={gameState.players.length < 2}
              loading={isMutating}
              startIcon={<PlayArrow />}
              sx={{
                ...buttonBase,
                background: isDark
                  ? 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 50%, #43a047 100%)'
                  : 'linear-gradient(135deg, #2e7d32 0%, #43a047 50%, #66bb6a 100%)',
                color: '#fff',
                boxShadow: '0 6px 24px rgba(46,125,50,0.35)',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: '0 10px 36px rgba(46,125,50,0.5)',
                },
                '&:disabled': {
                  background: isDark
                    ? 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.08) 100%)'
                    : 'linear-gradient(135deg, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.12) 100%)',
                  color: theme.palette.text.disabled,
                  boxShadow: 'none',
                },
              }}
            >
              {(t('startGame'))}
            </Button>
            <Box sx={{ fontStyle: 'italic' }}>
              {gameState.players.length < 2 && (
                <CoupTypography mt={2} addTextShadow>
                  {t('addPlayersToStartGame')}
                </CoupTypography>
              )}
              {gameState.players.length === 2 && (
                <CoupTypography mt={2} addTextShadow>
                  {t('startingPlayerBeginsWith1Coin')}
                </CoupTypography>
              )}
              {gameState.settings.allowRevive && (
                <CoupTypography mt={2} addTextShadow>
                  {t('reviveIsEnabled')}
                </CoupTypography>
              )}
              {gameState.settings.speedRoundSeconds && (
                <CoupTypography mt={2} addTextShadow>
                  {t('speedRoundSeconds')}: {gameState.settings.speedRoundSeconds}
                </CoupTypography>
              )}
            </Box>
          </Grid>
        )}
        {!gameState.selfPlayer && (
          <Grid>
            <Button
              onClick={() => {
                navigate(`/join-game?roomId=${gameState.roomId}`)
              }}
              startIcon={<GroupAdd />}
              sx={{
                ...buttonBase,
                background: isDark
                  ? 'linear-gradient(135deg, #1a237e 0%, #283593 50%, #3949ab 100%)'
                  : 'linear-gradient(135deg, #283593 0%, #3949ab 50%, #5c6bc0 100%)',
                color: '#fff',
                boxShadow: '0 6px 24px rgba(40,53,147,0.35)',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: '0 10px 36px rgba(40,53,147,0.5)',
                },
              }}
            >
              {(t('joinGame'))}
            </Button>
          </Grid>
        )}
      </Grid>
      <AddAiPlayer
        addAiPlayerDialogOpen={addAiPlayerDialogOpen}
        setAddAiPlayerDialogOpen={setAddAiPlayerDialogOpen}
      />
    </>
  )
}

export default WaitingRoom
