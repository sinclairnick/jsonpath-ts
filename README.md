# JSONPath Typescript

Type-level implemntation of JSONPath queries.

As per the [JSONPath query expressions RFC](https://www.rfc-editor.org/rfc/rfc9535.txt) (partial support).

## Usage

```ts
// Given input type
export type Data = {
    store: {
        book: [
            {
                category: "reference";
                author: "Nigel Rees";
                title: "Sayings of the Century";
                price: 8.95;
            },
            {
                category: "fiction";
                author: "Evelyn Waugh";
                title: "Sword of Honour";
                price: 12.99;
            },
            {
                category: "fiction";
                author: "Herman Melville";
                title: "Moby Dick";
                isbn: "0-553-21311-3";
                price: 8.99;
            },
            {
                category: "fiction";
                author: "J. R. R. Tolkien";
                title: "The Lord of the Rings";
                isbn: "0-395-19395-8";
                price: 22.99;
            }
        ];
        bicycle: {
            color: "red";
            price: 399;
        };
    };
};

type Result = Parse<"$.store.book[*].author[2:6]", Data>;
//	 ^? ["Herman Melville", "J. R. R. Tolkien"]
```

## Limitations

-   Slice steps not supported (`::-1`)
-   Filtering not supported (`?@.hasField`)
-   Descendant segments not supported (`$...X`)
