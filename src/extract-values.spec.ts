import { describe, expectTypeOf, test } from "vitest";
import {
    ArraySliceSelector,
    IndexSelector,
    NameSelector,
    WildcardSelector,
} from "./parse-path";
import {
    ExtractArraySelection,
    ExtractMultipleArraySelections,
    ExtractRecordSelection,
    ExtractSelection,
    ExtractValue,
} from "./extract-values";

describe("Extract values", () => {
    test("ExtractRecordSelection", () => {
        expectTypeOf<
            ExtractRecordSelection<NameSelector<"b">, { a: 1; b: 2; c: 3 }>
        >().toEqualTypeOf<2>();
        expectTypeOf<
            ExtractRecordSelection<WildcardSelector, { a: 1; b: 2; c: 3 }>
        >().toEqualTypeOf<(1 | 2 | 3)[]>;
    });

    describe("ExtractArraySelection", () => {
        test("Wildcard", () => {
            expectTypeOf<
                ExtractArraySelection<WildcardSelector, [1, 2, 3]>
            >().toEqualTypeOf<[1, 2, 3]>();
        });

        test("Wildcard 2", () => {
            expectTypeOf<
                ExtractArraySelection<WildcardSelector, [{ a: 2 }, { b: 2 }]>
            >().toEqualTypeOf<[{ a: 2 }, { b: 2 }]>();
        });

        test("Index ", () => {
            expectTypeOf<
                ExtractArraySelection<
                    IndexSelector<2>,
                    ["a", "b", "c", "d", "e"]
                >
            >().toEqualTypeOf<"c">();
        });

        test("Name selector", () => {
            expectTypeOf<
                ExtractArraySelection<
                    NameSelector<"a">,
                    [{ a: 1 }, { a: 2; b: 5 }, { a: 3 }]
                >
            >().toEqualTypeOf<[1, 2, 3]>();
        });

        test("Slice - start and end", () => {
            expectTypeOf<
                ExtractArraySelection<
                    ArraySliceSelector<3, 5, never>,
                    ["a", "b", "c", "d", "e", "f"]
                >
            >().toEqualTypeOf<["d", "e"]>();
        });

        test("Slice - start only", () => {
            expectTypeOf<
                ExtractArraySelection<ArraySliceSelector<1>, [1, 2, 3, 4, 5]>
            >().toEqualTypeOf<[2, 3, 4, 5]>();
        });

        test("Slice - end exceeds length", () => {
            expectTypeOf<
                ExtractArraySelection<ArraySliceSelector<1, 6>, [1, 2, 3, 4, 5]>
            >().toEqualTypeOf<[2, 3, 4, 5]>();
        });
    });

    test("ExtractArraySelections", () => {
        type Selectors = [IndexSelector<2>, ArraySliceSelector<0, 2, never>];
        type Actual = ExtractMultipleArraySelections<
            Selectors,
            ["d", "e", "f"]
        >;
        expectTypeOf<Actual>().toEqualTypeOf<["f", ["d", "e"]]>();
    });

    test("ExtractSelection", () => {
        type Actual = ExtractSelection<
            [ArraySliceSelector<3, 5, never>],
            ["a", "b", "c", "d", "e", "f"]
        >;
        expectTypeOf<Actual>().toEqualTypeOf<["d", "e"]>();
    });

    test("ExtractValue", () => {
        type Selectors = [
            NameSelector<"a">,
            [ArraySliceSelector<0, 2>],
            NameSelector<"b">
        ];

        type Actual = ExtractValue<
            Selectors,
            { a: [{ b: 2 }, { b: 3 }, { b: 4 }] }
        >;

        expectTypeOf<Actual>().toEqualTypeOf<[2, 3]>();
    });
});
