# typetime-json-schema

a typescript utility type that evaluates a json schema into a type at compiletime (no code generation! :o)

```ts
type Foo = FromJsonSchema<{
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
```
this evaluates to the following type:
```ts
{foo: {asdf: string}, bar: string[]}
```
