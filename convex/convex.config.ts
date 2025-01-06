import aggregate from '@convex-dev/aggregate/convex.config'
import migrations from '@convex-dev/migrations/convex.config'
import { defineApp } from 'convex/server'

const app = defineApp()

app.use(migrations)

app.use(aggregate, { name: 'v1_aggregate_channel_timestamp' })
app.use(aggregate, { name: 'v1_aggregate_alias_channel_timestamp' })
app.use(aggregate, { name: 'v1_aggregate_channel_hour_entryId' })

export default app
