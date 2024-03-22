import { describe, expectTypeOf, test } from "vitest";
import { AnyNumberStr } from "./util";

describe("Util", () => {
  test("AnyNumberStr", () => {
    expectTypeOf<Extract<AnyNumberStr, "9999">>().toEqualTypeOf<"9999">();
  });
});
