'use client'

import { Input } from '../ui/input'
import { useQueryState } from 'nuqs'
import { SearchIcon, XIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '../ui/button'
import { useState, useEffect } from 'react'

export function SearchInput({ className }: { className?: string }) {
  const [search, setSearch] = useQueryState('search')
  const [inputValue, setInputValue] = useState(search ?? '')

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue === '') {
        setSearch(null)
      } else {
        setSearch(inputValue)
      }
    }, 300) // 300ms debounce

    return () => clearTimeout(timer)
  }, [inputValue, setSearch])

  return (
    <div className={cn('relative w-64', className)}>
      <SearchIcon className="absolute left-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="pl-8"
      />
      {inputValue && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0.5 top-0.5 size-8"
          onClick={() => {
            setInputValue('')
            setSearch(null)
          }}
        >
          <XIcon className="size-4" />
        </Button>
      )}
    </div>
  )
}
