import { defineApp } from 'convex/server'
import aggregate from '@convex-dev/aggregate/convex.config'
import migrations from '@convex-dev/migrations/convex.config'

const app = defineApp()

app.use(aggregate, { name: 'aggTypeNick' })
app.use(aggregate, { name: 'aggNickTypeTime' })
app.use(aggregate, { name: 'aggNickTime' })
app.use(aggregate, { name: 'aggTimeNick' })

app.use(migrations)

export default app
