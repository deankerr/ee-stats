import aggregate from '@convex-dev/aggregate/convex.config'
import migrations from '@convex-dev/migrations/convex.config'
import { defineApp } from 'convex/server'

const app = defineApp()

app.use(migrations)

app.use(aggregate, { name: 'agg_nick_activity' })
app.use(aggregate, { name: 'agg_nsnick_timestamp' })

export default app
