import { JSONSchema6 } from 'json-schema'
import { TODO } from '@detachhead/ts-helpers/dist/utilityTypes/misc'
import { CastArray } from '@detachhead/ts-helpers/dist/utilityTypes/Array'
import { Head } from 'ts-toolbelt/out/List/Head'
import { Tail } from 'ts-toolbelt/out/List/Tail'

type FromJsonSchemaArray<T extends JSONSchema6[]> = T['length'] extends 0
    ? []
    : [FromJsonSchema<Head<T>>, ...FromJsonSchemaArray<Tail<T>>]

export type FromJsonSchema<T extends JSONSchema6> = T['type'] extends {}
    ? {
          string: string
          number: number
          integer: number
          boolean: boolean
          null: null
          array: T['items'] extends JSONSchema6
              ? FromJsonSchema<T['items']>[]
              : [
                    ...(T['items'] extends JSONSchema6[]
                        ? FromJsonSchemaArray<T['items']>
                        : unknown[]),
                    ...(T['additionalItems'] extends false ? [] : unknown[])
                ]
          object: undefined extends T['properties']
              ? {}
              : {
                    [K in keyof T['properties']]: T['properties'][K] extends JSONSchema6
                        ? FromJsonSchema<T['properties'][K]>
                        : TODO<'object type - why are arrays/booleans allowed here'>
                }
          any: unknown // any? more like unknown
      }[CastArray<T['type']>[number]]
    : TODO<'unknown type'>
