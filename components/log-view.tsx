'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { api } from '@/convex/_generated/api'
import type { LogEvent } from '@/convex/events'
import { usePaginatedQuery, useQuery } from 'convex/react'
import { InfoIcon, LoaderPinwheelIcon, MessageCircleIcon } from 'lucide-react'
import { useQueryState } from 'nuqs'
import { SearchInput } from './search-input'
import { Timestamp } from './timestamp'
import { Button } from './ui/button'

export function LogViewPage(props: { channel: string }) {
  const logPaginated = usePaginatedQuery(api.events.paginate, { channel: props.channel }, { initialNumItems: 100 })
  const canLoadMore = logPaginated.status === 'CanLoadMore'

  const [search] = useQueryState('search')
  const searchResults = useQuery(api.events.search, { channel: props.channel, value: search ?? '' })

  const items = search ? searchResults ?? [] : logPaginated.results

  return (
    <div>
      <div className="sticky top-0 bg-background z-10 items-center flex justify-between p-2">
        <h1 className="text-2xl px-2 font-medium">#{props.channel}</h1>
        <SearchInput className="" />
        <Button onClick={() => logPaginated.loadMore(100)} disabled={!canLoadMore} className="relative">
          {logPaginated.isLoading ? (
            <>
              Loading... <LoaderPinwheelIcon className="size-4 animate-spin" />
            </>
          ) : logPaginated.status === 'Exhausted' ? (
            'Exhausted'
          ) : (
            'Load More'
          )}
        </Button>
      </div>
      <div className="p-2">
        <LogTable items={items} />
      </div>
    </div>
  )
}

function LogTable({ items }: { items: LogEvent[] }) {
  return (
    <Table className="table-fixed w-full">
      <TableHeader>
        <TableRow>
          <TableHead className="w-8">
            <span className="sr-only">Category</span>
          </TableHead>
          <TableHead className="w-24">Time</TableHead>
          <TableHead className="w-48">Name</TableHead>
          <TableHead>Content</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.toReversed().map((ev) => (
          <TableRow key={ev._id} className="font-mono">
            <TableCell>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="size-4">
                      {ev.category === 'message' && <MessageCircleIcon className="size-4" />}
                      {ev.category === 'status' && <InfoIcon className="size-4" />}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{ev.type}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TableCell>
            <TableCell>
              <Timestamp value={ev.timestamp} />
            </TableCell>
            <TableCell className="truncate">{ev.name}</TableCell>
            <TableCell className="truncate">{ev.content}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
