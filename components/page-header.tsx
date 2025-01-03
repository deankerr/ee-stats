import Link from 'next/link'
import { SearchInput } from './channel-page/search-input'
import { ThemeSwitcher } from './theme-switcher'

export function PageHeader({ channel, page }: { channel: string; page: 'feed' | 'stats' }) {
  return (
    <header className="sticky top-0 z-10 grid flex-none grid-cols-3 items-center bg-background px-[2ch] py-2 shadow-sm">
      <div className="flex items-center gap-2">
        <h1>
          #{channel}/{page}
        </h1>
      </div>

      <div>
        <SearchInput className="w-full" />
      </div>

      <div className="flex items-center justify-end gap-2">
        {page === 'stats' ? (
          <Link href={`/channel/${channel}`} className="link">
            feed
          </Link>
        ) : (
          <Link href={`/channel/${channel}/stats`} className="link">
            stats
          </Link>
        )}
        <ThemeSwitcher />
      </div>
    </header>
  )
}
