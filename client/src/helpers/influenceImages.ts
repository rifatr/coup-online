import { Influences } from '@shared'

import ambassadorImg from '../assets/ambassador.png'
import assassinImg from '../assets/assassin.jpg'
import captainImg from '../assets/captainV2.png'
import contessaImg from '../assets/contessa.png'
import dukeImg from '../assets/duke.png'

const influenceImages: Record<Influences, string> = {
  [Influences.Ambassador]: ambassadorImg,
  [Influences.Assassin]: assassinImg,
  [Influences.Captain]: captainImg,
  [Influences.Contessa]: contessaImg,
  [Influences.Duke]: dukeImg,
}

export default influenceImages
