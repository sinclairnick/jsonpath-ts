import { describe, expectTypeOf, test } from "vitest";
import { Parse, ParsePath } from ".";

// Taken from JSONPath
export type RFCData = {
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

describe("Parse", () => {
    test("A", () => {
        type Data = [{ a: [1, 2, 3] }];
        type Result = Parse<"$[0].a[1:2]", Data>;

        expectTypeOf<Result>().toEqualTypeOf<[2]>();
    });

    test("B", () => {
        type InPath = "$.store.book[*].author";
        type Result = Parse<InPath, RFCData>;

        expectTypeOf<Result>().toEqualTypeOf<
            [
                "Nigel Rees",
                "Evelyn Waugh",
                "Herman Melville",
                "J. R. R. Tolkien"
            ]
        >();
    });

    test("C", () => {
        type InPath = "$.store.book[*].author[2:6]";
        type Result = Parse<InPath, RFCData>;

        expectTypeOf<Result>().toEqualTypeOf<
            ["Herman Melville", "J. R. R. Tolkien"]
        >();
    });
});
