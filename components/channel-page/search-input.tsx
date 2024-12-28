'use client'

import { Input } from '../ui/input'
import { useQueryState } from 'nuqs'
import { SearchIcon, XIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '../ui/button'

export function SearchInput({ className }: { className?: string }) {
  const [search, setSearch] = useQueryState('search')
  return (
    <div className={cn('relative w-64', className)}>
      <SearchIcon className="absolute left-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search..."
        value={search ?? ''}
        onChange={(e) => {
          if (e.target.value === '') {
            setSearch(null)
          } else {
            setSearch(e.target.value)
          }
        }}
        className="pl-8"
      />
      {search && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0.5 top-0.5 size-8"
          onClick={() => setSearch(null)}
        >
          <XIcon className="size-4" />
        </Button>
      )}
    </div>
  )
}
