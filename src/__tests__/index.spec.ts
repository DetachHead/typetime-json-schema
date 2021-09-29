import { exactly } from '@detachhead/ts-helpers/dist/utilityFunctions/misc'
import { FromJsonSchema } from '../index'

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
