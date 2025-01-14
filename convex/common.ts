import {
  brandedString,
  deprecated,
  literals,
  nullable,
  partial,
  pretend,
  pretendRequired,
  systemFields,
  withSystemFields,
} from 'convex-helpers/validators'
import {
  v as convexV,
  type AsObjectValidator,
  type Infer as convexInfer,
  type PropertyValidators,
  type Validator,
} from 'convex/values'

export { ConvexError } from 'convex/values'
export { paginationOptsValidator } from 'convex/server'
export { asyncMap, omit, pick, pruneNull } from 'convex-helpers'

export type * from './_generated/dataModel'
export * from './_generated/server'

/**
 * Convex validator builder with additional helpers
 */
export const v = {
  ...convexV,
  deprecated,
  literals,
  partial,
  pretend,
  pretendRequired,
  systemFields,
  withSystemFields,
  nullable,
  brandedString,
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Infer<T extends Validator<any, any, any> | PropertyValidators> = convexInfer<AsObjectValidator<T>>
