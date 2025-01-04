export const EVENT_NAMES = [
  'message',
  'action',
  'join',
  'part',
  'quit',
  'nick',
  'kick',
  'topic',
  'invite',
  'mode',
] as const

export const SIGNIFICANT_EVENTS: Record<(typeof EVENT_NAMES)[number], boolean> = {
  message: true,
  action: true,
  nick: true,
  kick: true,
  topic: true,
  invite: false,
  mode: false,
  join: false,
  part: false,
  quit: false,
}
