import { FormatString } from "./util";

export interface NameSelector<TKey extends string> {
    type: "NameSelector";
    key: TKey;
}
export interface AnyNameSelector extends NameSelector<string> {}
export interface IndexSelector<TIndex extends number> {
    type: "IndexSelector";
    index: TIndex;
}
export interface AnyIndexSelector extends IndexSelector<number> {}
export interface WildcardSelector {
    type: "WildcardSelector";
}
export interface AnyWildcardSelector extends WildcardSelector {}
export interface ArraySliceSelector<
    TStart extends number | never = never,
    TEnd extends number | never = never,
    TStep extends number | never = never
> {
    type: "ArraySliceSelector";
    start: TStart;
    end: TEnd;
    step: TStep;
}
export interface AnySliceSelector extends ArraySliceSelector<any, any, any> {}

export type AnySelector =
    | AnySliceSelector
    | AnyIndexSelector
    | AnyWildcardSelector
    | AnyNameSelector;

export type ParseBracketSelector<TInner extends string> =
    TInner extends `${infer TStart extends number}:${infer TEnd extends number}:${infer TStep extends number}`
        ? ArraySliceSelector<TStart, TEnd, TStep>
        : TInner extends `:${infer TEnd extends number}:${infer TStep extends number}`
        ? ArraySliceSelector<never, TEnd, TStep>
        : TInner extends `::${infer TStep extends number}`
        ? ArraySliceSelector<never, never, TStep>
        : TInner extends `${infer TStart extends number}:${infer TEnd extends number}`
        ? ArraySliceSelector<TStart, TEnd, never>
        : TInner extends `:${infer TEnd extends number}`
        ? ArraySliceSelector<never, TEnd, never>
        : TInner extends `${string}"${infer TKey}"${string}`
        ? NameSelector<FormatString<TKey>>
        : TInner extends `${string}'${infer TKey}'${string}`
        ? NameSelector<FormatString<TKey>>
        : TInner extends `${string}*${string}`
        ? WildcardSelector
        : TInner extends `${infer TStart extends number}`
        ? IndexSelector<TStart>
        : never;

export type ParseBracketIndexInner<T> =
    T extends `${infer TFirst},${infer TRest}`
        ? [ParseBracketSelector<TFirst>, ...ParseBracketIndexInner<TRest>]
        : T extends `${infer TIndex}`
        ? [ParseBracketSelector<TIndex>]
        : [];

export type ParsePathInner<TPathInner extends string> =
    TPathInner extends `[${infer TInner}]${infer TRest}`
        ? [ParseBracketIndexInner<TInner>, ...ParsePathInner<TRest>]
        : TPathInner extends `.${infer TKey}[${infer TRest}`
        ? [...ParsePathInner<TKey>, ...ParsePathInner<`[${TRest}`>]
        : TPathInner extends `.${infer TKey}`
        ? ParsePathInner<TKey>
        : TPathInner extends `${infer TKey}.${infer TRest}`
        ? [...ParsePathInner<TKey>, ...ParsePathInner<TRest>]
        : TPathInner extends ""
        ? []
        : [NameSelector<TPathInner>];

export type ParsePath<TPath extends `$${string}`> =
    TPath extends `$${infer TPathInner}` ? ParsePathInner<TPathInner> : never;

export type AnyParsedPath = (AnySelector | AnySelector[])[];
