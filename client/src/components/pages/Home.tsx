import { Box, Button } from "@mui/material"
import { useNavigate } from "react-router"
import { useTranslationContext } from "../../contexts/TranslationsContext"
import { AddCircle, Gavel, GroupAdd } from "@mui/icons-material"
import CoupTypography from '../utilities/CoupTypography'
import { useButtonStyles } from "../../hooks/useButtonStyles"

interface HomeProps {
  setRulesOpen: (open: boolean) => void
}

function Home({ setRulesOpen }: Readonly<HomeProps>) {
  const navigate = useNavigate()
  const { t } = useTranslationContext()
  const btn = useButtonStyles()

  return (
    <Box sx={{
      position: 'relative',
      minHeight: 'calc(100vh - 60px)'
    }}>
      <CoupTypography variant="h4" sx={{ mt: 5 }} addTextShadow>
        {t('welcomeToCoup')}
      </CoupTypography>
      <CoupTypography variant="h5" sx={{ mt: 2 }} addTextShadow>
        {t('briefDescriptionOfCoup')}
      </CoupTypography>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        gap: 2.5,
      }}>
        <Button
          sx={btn.primary()}
          onClick={() => { navigate(`/create-game`) }}
          startIcon={<AddCircle />}
        >{t('createNewGame')}</Button>
        <Button
          sx={btn.secondary()}
          onClick={() => { navigate(`/join-game`) }}
          startIcon={<GroupAdd />}
        >{t('joinExistingGame')}</Button>
        <Button
          sx={btn.glass()}
          onClick={() => setRulesOpen(true)}
          startIcon={<Gavel />}
        >{t('learnToPlay')}</Button>
      </Box>
    </Box>
  )
}

export default Home
