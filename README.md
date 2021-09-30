# typetime-json-schema

a typescript utility type that evaluates a json schema into a type at compiletime. unlike other JSON schema to type
converters, this one doesn't use any code generation! :o

## why?

-   unlike code generation, using typescript's type system to convert the schema at compiletime prevents duplicate
    definitions of your data structure that can easily cause problems if someone updates the schema but not the types,
    or vice versa
-   wacky types are fun

## example

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

// Type '{}' is missing the following properties from type '{ foo: { asdf: string; }; bar: string[]; }': foo, bar
const foo: Foo = {}
```

## disclaimers

-   not all features of JSON schema are supported yet. there's probably a bunch of stuff missing. if you notice
    something i've missed, raise an issue
-   currently only supports JSON schema 7
-   this won't work when importing a schema from a JSON file because its type will be widened rendering it useless.
    if you want this functionality, updoot [this issue](https://github.com/microsoft/TypeScript/issues/32063)
