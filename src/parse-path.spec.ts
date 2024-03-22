import { describe, expectTypeOf, test } from "vitest";
import {
  ParseBracketSelector,
  ArraySliceSelector,
  IndexSelector,
  ParseBracketIndexInner,
  NameSelector,
  ParsePathInner,
  WildcardSelector,
} from "./parse-path";

describe("Parse path", () => {
  test("ParseBracketSelector", () => {
    expectTypeOf<ParseBracketSelector<"1:2:3">>().toEqualTypeOf<
      ArraySliceSelector<1, 2, 3>
    >();
    expectTypeOf<ParseBracketSelector<":2:3">>().toEqualTypeOf<
      ArraySliceSelector<never, 2, 3>
    >();
    expectTypeOf<ParseBracketSelector<"1:2">>().toEqualTypeOf<
      ArraySliceSelector<1, 2, never>
    >();
    expectTypeOf<ParseBracketSelector<":2">>().toEqualTypeOf<
      ArraySliceSelector<never, 2, never>
    >();
    expectTypeOf<ParseBracketSelector<"::1">>().toEqualTypeOf<
      ArraySliceSelector<never, never, 1>
    >();
    expectTypeOf<ParseBracketSelector<"1">>().toEqualTypeOf<IndexSelector<1>>();
    expectTypeOf<ParseBracketSelector<"*">>().toEqualTypeOf<WildcardSelector>();
    expectTypeOf<ParseBracketSelector<"a">>().toEqualTypeOf<never>();
  });

  test("ParseBracketIndexInner", () => {
    expectTypeOf<ParseBracketIndexInner<"0:2:-1, 'a'">>().toEqualTypeOf<
      [ArraySliceSelector<0, 2, -1>, NameSelector<"a">]
    >();
  });

  describe("ParsePathInner", () => {
    test("Object key", () => {
      type Actual = ParsePathInner<".a">;

      expectTypeOf<Actual>().toEqualTypeOf<[NameSelector<"a">]>();
    });

    test("Slice", () => {
      type Actual = ParsePathInner<".a[1:2]">;

      expectTypeOf<Actual>().toEqualTypeOf<
        [NameSelector<"a">, [ArraySliceSelector<1, 2, never>]]
      >();
    });

    test("Double bracket selector", () => {
      type Actual = ParsePathInner<".a[1:2, 'c']">;

      expectTypeOf<Actual>().toEqualTypeOf<
        [
          NameSelector<"a">,
          [ArraySliceSelector<1, 2, never>, NameSelector<"c">]
        ]
      >();
    });

    test("SubPath 1", () => {
      type Actual = ParsePathInner<".store.books">;

      expectTypeOf<Actual>().toEqualTypeOf<
        [NameSelector<"store">, NameSelector<"books">]
      >();
    });

    test("SubPath 1 w/ brackets", () => {
      type Actual = ParsePathInner<".store.books[1]">;

      expectTypeOf<Actual>().toEqualTypeOf<
        [NameSelector<"store">, NameSelector<"books">, [IndexSelector<1>]]
      >();
    });

    test("SubPath 2", () => {
      type Actual = ParsePathInner<".a[1:2, 'c'].long">;
      expectTypeOf<Actual>().toEqualTypeOf<
        [
          NameSelector<"a">,
          [ArraySliceSelector<1, 2, never>, NameSelector<"c">],
          NameSelector<"long">
        ]
      >();
    });
  });
});
