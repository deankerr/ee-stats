import { v } from '../common'
import schema from '../schema'

const artifactSchemaFields = v.withSystemFields(
  'v1_channel_artifacts',
  schema.tables.v1_channel_artifacts.validator.fields,
)

export const vArtifacts = {
  word_cloud: v.object({
    ...artifactSchemaFields,
    content: v.array(v.object({ text: v.string(), value: v.number() })),
  }),
}
