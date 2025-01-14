export function getHourBoundsFrom(time: number, hours: number) {
  const date = new Date(time)
  date.setUTCHours(date.getUTCHours() - hours + 1, 0, 0, 0)

  return [...Array(hours)].map(() => {
    const timeFrom = date.getTime()
    date.setHours(date.getHours() + 1)
    const timeTo = date.getTime()

    return {
      timeFrom,
      timeTo,
      bounds: {
        lower: {
          key: timeFrom,
          inclusive: true,
        },
        upper: {
          key: timeTo,
          inclusive: false,
        },
      },
    }
  })
}

export function getDayBoundsFrom(time: number, days: number) {
  const date = new Date(time)
  date.setHours(0, 0, 0, 0)
  date.setDate(date.getDate() - days + 1)

  return [...Array(days)].map(() => {
    const timeFrom = date.getTime()
    date.setDate(date.getDate() + 1)
    const timeTo = date.getTime()

    return {
      timeFrom,
      timeTo,
      bounds: {
        lower: {
          key: timeFrom,
          inclusive: true,
        },
        upper: {
          key: timeTo,
          inclusive: false,
        },
      },
    }
  })
}
