import { JSONSchema7, JSONSchema7Definition, JSONSchema7Type } from 'json-schema'
import { TODO } from '@detachhead/ts-helpers/dist/utilityTypes/misc'
import { CastArray } from '@detachhead/ts-helpers/dist/utilityTypes/Array'
import { Head } from 'ts-toolbelt/out/List/Head'
import { Tail } from 'ts-toolbelt/out/List/Tail'

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
          ? // @ts-expect-error https://github.com/microsoft/TypeScript/issues/46145
            {
                string: string
                number: number
                integer: number
                boolean: boolean
                null: null
                array: T['items'] extends JSONSchema7
                    ? FromJsonSchema<
                          // @ts-expect-error see issue linked above
                          T['items']
                      >[]
                    : [
                          ...(T['items'] extends JSONSchema7[]
                              ? FromJsonSchemaArray<
                                    // @ts-expect-error see issue linked above
                                    T['items']
                                >
                              : unknown[]),
                          ...(T['additionalItems'] extends false ? [] : unknown[])
                      ]
                object: (undefined extends T['properties']
                    ? {}
                    : {
                          [K in keyof T['properties']]: T['properties'][K] extends JSONSchema7
                              ? FromJsonSchema<T['properties'][K]>
                              : TODO<'object type - why are arrays/booleans allowed here'>
                      }) &
                    (T['additionalProperties'] extends false ? {} : Record<string, unknown>)
                any: unknown // any? more like unknown
            }[CastArray<T['type']>[number]]
          : unknown) &
          (T['enum'] extends JSONSchema7Type[]
              ? // @ts-expect-error see issue linked above
                T['enum'][number]
              : unknown)
    : T extends true
    ? unknown
    : never
