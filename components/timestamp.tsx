import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export function Timestamp(props: { value: number }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <span>{formatTime(props.value)}</span>
        </TooltipTrigger>
        <TooltipContent>
          <p>{formatDate(props.value)}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

function formatTime(time: number) {
  return new Date(time).toLocaleTimeString()
}

function formatDate(time: number) {
  return new Date(time).toLocaleString()
}
