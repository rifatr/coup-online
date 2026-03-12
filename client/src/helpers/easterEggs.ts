import { AvailableLanguageCode } from '@shared/dist'
import translations from '../i18n/translations'

const months = {
  january: 0,
  november: 10,
  december: 11,
}

const currentMonth = new Date().getMonth()
const isJanuary = currentMonth === months.january
const isNovember = currentMonth === months.november
const isDecember = currentMonth === months.december

export const getBackgroundImage = () => {
  // if (isJanuary) return 'url(/fireworks.jpeg)'
  // if (isNovember) return 'url(/turkeys.jpeg)'
  // if (isDecember) return 'url(/snowmen.jpeg)'
  return 'url(/chickens.jpeg)'
}

export const getShowImageLabel = (language: AvailableLanguageCode) => {
  if (isJanuary) return `${translations.showFireworks[language]} 🎆`
  if (isNovember) return `${translations.showTurkeys[language]} 🦃`
  if (isDecember) return `${translations.showSnowmen[language]} ⛄️`
  return `${translations.showChickens[language]} 🦆`
}
