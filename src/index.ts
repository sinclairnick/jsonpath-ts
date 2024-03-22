import { ExtractValue } from "./extract-values";
import { ParsePath } from "./parse-path";

export type * from "./extract-values";
export type * from "./parse-path";

export type Parse<
  TPath extends `$${string}`,
  TValue extends any
> = ExtractValue<ParsePath<TPath>, TValue>;

export default {};
