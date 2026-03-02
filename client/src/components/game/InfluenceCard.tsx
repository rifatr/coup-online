import { Box, Paper, Typography, useTheme } from "@mui/material"
import { Influences } from '@shared'
import { useTranslationContext } from "../../contexts/TranslationsContext"
import influenceImages from "../../helpers/influenceImages"

function InfluenceCard({ influence }: {
  influence: Influences
}) {
  const { t } = useTranslationContext()
  const { influenceColors } = useTheme()

  return (
    <Paper sx={{
      color: 'white',
      textAlign: 'center',
      background: influence ? influenceColors[influence] : 'rgba(120, 120, 120, 0.5)',
      borderRadius: '0.5rem',
      overflow: 'hidden',
    }}>
      <Box
        component="img"
        src={influenceImages[influence]}
        alt={influence}
        sx={{ width: '100%', display: 'block', objectFit: 'cover' }}
      />
      <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1.2rem', py: 1 }}>
        {t(influence)}
      </Typography>
    </Paper>
  )
}

export default InfluenceCard
