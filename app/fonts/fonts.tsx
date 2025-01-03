import { JetBrains_Mono, Space_Mono } from 'next/font/google'
import localFont from 'next/font/local'

const fantasque = localFont({
  src: './FantasqueSansMono-Regular.woff2',
  variable: '--font-fantasque',
})

const hack = localFont({
  src: './Hack-Regular.ttf',
  variable: '--font-hack',
})

const iAWriterDuo = localFont({
  src: './iAWriterDuoS-Regular.woff2',
  variable: '--font-ia-writer-duo',
})

const iAWriterMono = localFont({
  src: './iAWriterMonoS-Regular.woff2',
  variable: '--font-ia-writer-mono',
})

const mekSans = localFont({
  src: './MEKSans-Regular.woff2',
  variable: '--font-mek-sans',
})

const jetbrains = JetBrains_Mono({
  variable: '--font-jetbrains',
})

const space = Space_Mono({
  variable: '--font-space',
  weight: '400',
})

export const fontsMap = {
  fantasque,
  hack,
  iAWriterDuo,
  iAWriterMono,
  jetbrains,
  mekSans,
  space,
}
