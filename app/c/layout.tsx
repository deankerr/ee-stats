import { ThemeSwitcher } from '@/components/theme-switcher'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="flex items-center justify-between border-b px-2 py-2 sm:px-8">
        <h2 className="text-base font-semibold">ee-stats</h2>
        <div className="flex gap-2">
          <ThemeSwitcher variant="outline" />
        </div>
      </header>

      {children}
    </div>
  )
}
