import { JSONSchema6, JSONSchema6TypeName } from 'json-schema'
import { TODO } from '@detachhead/ts-helpers/dist/utilityTypes/misc'

export type FromJsonSchema<T extends JSONSchema6> = T['type'] extends JSONSchema6TypeName
    ? {
          string: string
          number: number
          integer: number
          boolean: boolean
          null: null
          array: T['items'] extends JSONSchema6
              ? FromJsonSchema<T['items']>[]
              : TODO<'array type - why are arrays/booleans allowed here'>
          object: undefined extends T['properties']
              ? {}
              : {
                    [K in keyof T['properties']]: T['properties'][K] extends JSONSchema6
                        ? FromJsonSchema<T['properties'][K]>
                        : TODO<'object type - why are arrays/booleans allowed here'>
                }
          any: unknown // any? more like unknown
      }[T['type']]
    : TODO<'unknown type'>
