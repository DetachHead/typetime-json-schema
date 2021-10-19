import { JSONSchema7, JSONSchema7Definition, JSONSchema7Type } from 'json-schema'
import { TODO } from '@detachhead/ts-helpers/dist/utilityTypes/misc'
import { CastArray } from '@detachhead/ts-helpers/dist/utilityTypes/Array'
import {
    Email,
    Domain,
    IPv4,
    IPv6,
    GUID,
    UriString,
} from '@detachhead/ts-helpers/dist/utilityTypes/String'
import { Head } from 'ts-toolbelt/out/List/Head'
import { Tail } from 'ts-toolbelt/out/List/Tail'
import { FormattedDate } from '@detachhead/ts-helpers/dist/utilityTypes/Date'

type FromJsonSchemaArray<T extends JSONSchema7[]> = T['length'] extends 0
    ? []
    : [FromJsonSchema<Head<T>>, ...FromJsonSchemaArray<Tail<T>>]

/**
 * converts a JSON schema to a typescript type at compiletime
 *
 * unlike other JSON schema to type converters, this one doesn't use any code generation.
 * simply pass this type a {@link JSONSchema7Definition} and the compiler will convert it to a typescript type for you
 *
 * **note:** this won't work when importing a schema from a JSON file. if you want that functionality,
 * updoot [this issue](https://github.com/microsoft/TypeScript/issues/32063)
 * @example
 * type Foo = FromJsonSchema<{
 *    type: 'object'
 *    properties: {
 *       foo: {
 *           type: 'object'
 *           properties: {
 *               asdf: {
 *                   type: 'string'
 *               }
 *           }
 *           additionalProperties: false
 *       }
 *       bar: {
 *           type: 'array'
 *           items: {
 *               type: 'string'
 *           }
 *       }
 *   }
 *   additionalProperties: false
 * }>
 *
 * // Type '{}' is missing the following properties from type '{ foo: { asdf: string; }; bar: string[]; }': foo, bar
 * const foo: Foo = {}
 */
export type FromJsonSchema<T extends JSONSchema7Definition> = T extends JSONSchema7
    ? (T['type'] extends {}
          ? {
                string: T['format'] extends string
                    ? {
                          'date-time': string // cant use FormattedDate, union type too complex to represent
                          time: FormattedDate<'HH:mm+XXXXX'>
                          date: FormattedDate<'yyyy-MM-dd'>
                          // TODO: how does this standard differentiate between minute and month (both M) https://datatracker.ietf.org/doc/html/rfc3339#appendix-A
                          duration: `P${number}${'S' | 'H' | 'D' | 'W' | 'M' | 'Y'}`
                          email: Email
                          'idn-email': Email
                          hostname: Domain
                          'idn-hostname': Domain
                          ipv4: IPv4
                          ipv6: IPv6
                          uuid: GUID
                          uri: UriString
                          iri: UriString
                          [key: string]: string
                      }[T['format'] & string] // need intersection to re-narrow due to https://github.com/microsoft/TypeScript/issues/45651
                    : string
                number: number
                integer: number
                boolean: boolean
                null: null
                array: T['items'] extends infer Narrowed
                    ? Narrowed extends JSONSchema7
                        ? FromJsonSchema<Narrowed>[]
                        : [
                              ...(Narrowed extends JSONSchema7[]
                                  ? FromJsonSchemaArray<Narrowed>
                                  : unknown[]),
                              ...(T['additionalItems'] extends false ? [] : unknown[])
                          ]
                    : never
                object: (undefined extends T['properties']
                    ? {}
                    : {
                          [K in keyof T['properties']]: T['properties'][K] extends JSONSchema7
                              ? FromJsonSchema<T['properties'][K]>
                              : TODO<'object type - why are arrays/booleans allowed here'>
                      }) &
                    (T['additionalProperties'] extends false ? {} : Record<string, unknown>)
                any: unknown // any? more like unknown
            }[(CastArray<T['type']> extends infer Narrowed // need to re-narrow due to issue linked above
                ? Narrowed extends {}
                    ? Narrowed
                    : never
                : never)[number]]
          : unknown) &
          (T['enum'] extends infer Narrowed // need to re-narrow due to issue linked above
              ? Narrowed extends JSONSchema7Type[]
                  ? Narrowed[number]
                  : unknown
              : never)
    : T extends true
    ? unknown
    : never
