import { exactly } from '@detachhead/ts-helpers/dist/utilityFunctions/misc'
import { FromJsonSchema } from '../index'

describe('boolean schemas', () => {
    test('true schema resolves to unknown', () => {
        exactly<unknown, FromJsonSchema<true>>()
    })
    test('false schema resolves to never', () => {
        exactly<never, FromJsonSchema<false>>()
    })
})

describe('objects', () => {
    test('object with additionalProperties', () => {
        exactly<
            { foo: string; [key: string]: unknown },
            FromJsonSchema<{
                type: 'object'
                properties: { foo: { type: 'string' } }
                additionalProperties: true
            }>
        >()
    })
    test('object without additionalProperties', () => {
        exactly<
            { foo: string },
            FromJsonSchema<{
                type: 'object'
                properties: { foo: { type: 'string' } }
                additionalProperties: false
            }>
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
                        additionalProperties: false
                    }
                    bar: {
                        type: 'array'
                        items: {
                            type: 'string'
                        }
                    }
                }
                additionalProperties: false
            }>
        >()
    })
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
    test('tuple type without additionalItems', () => {
        exactly<
            [string, number],
            FromJsonSchema<{
                type: 'array'
                items: [{ type: 'string' }, { type: 'number' }]
                additionalItems: false
            }>
        >()
    })
})

test('union of valid types (types is an array)', () => {
    exactly<string | number, FromJsonSchema<{ type: ['string', 'number'] }>>()
})

describe('enums', () => {
    test('basic', () => {
        exactly<'foo' | 'bar', FromJsonSchema<{ enum: ['foo', 'bar'] }>>()
    })
    test("enum types don't match type (never)", () => {
        exactly<never, FromJsonSchema<{ enum: ['foo', 'bar']; type: 'number' }>>()
    })
})
