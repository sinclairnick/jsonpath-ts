# JSONPath Typescript

![](https://img.shields.io/npm/v/jsonpath-ts)
![](https://img.shields.io/bundlejs/size/jsonpath-ts)

Type inference for JSONPath queries, as per the [JSONPath query expressions RFC](https://www.rfc-editor.org/rfc/rfc9535.txt) (see limitations below).

```
npm i jsonpath-ts
```

## Usage

```ts
import { Parse } from "jsonpath-ts";

type Result = Parse<"$.store.book[*].author[2:6]", Data>;
//	 ^? ["Herman Melville", "J. R. R. Tolkien"]

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
```

## Limitations

- Slice steps not supported (`::-1`)
- Filtering not supported (`?@.hasField`)
- Descendant segments not supported (`$...X`)

## How does it work?

This implementation first converts the input path into an abstract, shallow ordered tree of `Selector`s, such as `NameSelector`, `IndexSelector` etc. This representation is then iterated over to retrieve the derive the correct type from the data.

This functionality can be imported independently via:

```ts
import {
	ParsePath, // Input path -> ParsedPath
	ExtractValue // ParsedPath -> Return data type
} from "jsonpath-ts
```
