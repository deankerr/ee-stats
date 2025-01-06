import { Sixtyfour_Convergence } from 'next/font/google'

const sixtyFourConvergence = Sixtyfour_Convergence({
  subsets: ['latin'],
  display: 'optional',
})

export default function Home() {
  return (
    <div className={`${sixtyFourConvergence.className} grid h-dvh place-content-center text-7xl`}>ee</div>
  )
}
