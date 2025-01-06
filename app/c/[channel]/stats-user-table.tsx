'use client'

import { TUILoading } from '@/components/tui'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { api } from '@/convex/_generated/api'
import { useQuery } from '@/lib/api'

const useAliasData = (channel: string) => {
  const results = useQuery(api.v1.queries.activity, { channel })
  return results
}

export function StatsUserTable({ channel }: { channel: string }) {
  const data = useAliasData(channel)
  if (!data) return <TUILoading />

  const aliases = data.aliases.slice(0, 12)

  return (
    <Table className="">
      <TableHeader className="bg-muted/40 shadow">
        <TableRow>
          <TableHead className="">#</TableHead>
          <TableHead className="">Nick</TableHead>
          <TableHead className="">Lines</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {aliases.map((user, i) => (
          <TableRow key={user._id}>
            <TableCell className=""> {i + 1}</TableCell>
            <TableCell className="">{user.alias}</TableCell>
            <TableCell className="">{user.count}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
