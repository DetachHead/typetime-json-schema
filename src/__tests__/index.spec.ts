import { exactly } from '@detachhead/ts-helpers/dist/utilityFunctions/misc'
import { FromJsonSchema } from '../index'

test('basic', () => {
    exactly<
        { foo: string },
        FromJsonSchema<{ type: 'object'; properties: { foo: { type: 'string' } } }>
    >()
})

test('object with array', () => {
    exactly<
        { foo: { asdf: string }; bar: string[] },
        FromJsonSchema<{
            type: 'object'
            properties: {
                foo: {
                    type: 'object'
                    properties: {
                        asdf: {
                            type: 'string'
                        }
                    }
                }
                bar: {
                    type: 'array'
                    items: {
                        type: 'string'
                    }
                }
            }
        }>
    >()
})

test('union of valid types (types is an array)', () => {
    exactly<string | number, FromJsonSchema<{ type: ['string', 'number'] }>>()
})

describe('arrays', () => {
    test('tuple type with additionalItems', () => {
        exactly<
            [string, number, ...unknown[]],
            FromJsonSchema<{
                type: 'array'
                items: [{ type: 'string' }, { type: 'number' }]
            }>
        >()
    })
})
