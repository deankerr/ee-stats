import * as Colors from 'tailwindcss/colors'

const nameColorsHex = [
  Colors.red[500],
  Colors.orange[500],
  Colors.amber[500],
  Colors.yellow[500],
  Colors.lime[500],
  Colors.green[500],
  Colors.emerald[500],
  Colors.teal[500],
  Colors.cyan[500],
  Colors.sky[500],
  Colors.blue[500],
  Colors.indigo[500],
  Colors.violet[500],
  Colors.purple[500],
  Colors.fuchsia[500],
  Colors.pink[500],
  Colors.rose[500],
]

const nameColorsText = [
  'text-red-500',
  'text-orange-500',
  'text-amber-500',
  'text-yellow-500',
  'text-lime-500',
  'text-green-500',
  'text-emerald-500',
  'text-teal-500',
  'text-cyan-500',
  'text-sky-500',
  'text-blue-500',
  'text-indigo-500',
  'text-violet-500',
  'text-purple-500',
  'text-fuchsia-500',
  'text-pink-500',
  'text-rose-500',
]

function computeHash(input: string): number {
  const normalized = input.toLowerCase()
  let hash = 0

  for (let i = 0; i < normalized.length; i++) {
    hash = (hash << 5) - hash + normalized.charCodeAt(i)
    hash = hash & hash
  }

  return Math.abs(hash)
}

export function getNameColorText(name: string): string {
  return nameColorsText[computeHash(name) % nameColorsText.length]
}

export function getNameColorHex(name: string): string {
  return nameColorsHex[computeHash(name) % nameColorsHex.length]
}

export function formatName(name: string): string {
  return truncate(name, 18)
}

function truncate(input: string, maxLength: number): string {
  return input.length > maxLength ? `${input.slice(0, maxLength)}…` : input
}
