type AnyRecord = Record<PropertyKey, any>;
type AnyArray = any[];
type StripWhitespace<T extends string> = T extends ` ${infer TRest}` ? StripWhitespace<TRest> : T extends `${infer TRest} ` ? StripWhitespace<TRest> : T;
type StripQuotes<T extends string> = T extends `'${infer TValue}'` ? TValue : T extends `"${infer TValue}"` ? TValue : T;
type FormatString<T extends string> = "" extends T ? never : StripQuotes<StripWhitespace<T>>;
type PickArray<TIndex extends number, TArray extends any[]> = TArray["length"] extends 0 ? never : TArray extends [...infer TRest, infer TLast] ? TIndex extends TRest["length"] ? TLast : PickArray<TIndex, TRest> : never;
type ToPositive<N extends number, Arr extends unknown[]> = `${N}` extends `-${infer P extends number}` ? Slice<Arr, P>["length"] : N;
type InitialN<Arr extends unknown[], N extends number, _Acc extends unknown[] = []> = _Acc["length"] extends N | Arr["length"] ? _Acc : InitialN<Arr, N, [..._Acc, Arr[_Acc["length"]]]>;
type Slice<Arr extends unknown[], Start extends number = 0, End extends number = Arr["length"]> = InitialN<Arr, ToPositive<End, Arr>> extends [
    ...InitialN<Arr, ToPositive<Start, Arr>>,
    ...infer Rest
] ? Rest : [];
type PickArrayField<TArr extends any[], TKey extends string> = TArr extends [infer TFirst, ...infer TRest] ? [TFirst[TKey & keyof TFirst], ...PickArrayField<TRest, TKey>] : [];
type OrDefault<T, D> = [T] extends [never] ? D : T;

interface NameSelector<TKey extends string> {
    type: "NameSelector";
    key: TKey;
}
interface AnyNameSelector extends NameSelector<string> {
}
interface IndexSelector<TIndex extends number> {
    type: "IndexSelector";
    index: TIndex;
}
interface AnyIndexSelector extends IndexSelector<number> {
}
interface WildcardSelector {
    type: "WildcardSelector";
}
interface AnyWildcardSelector extends WildcardSelector {
}
interface ArraySliceSelector<TStart extends number | never = never, TEnd extends number | never = never, TStep extends number | never = never> {
    type: "ArraySliceSelector";
    start: TStart;
    end: TEnd;
    step: TStep;
}
interface AnySliceSelector extends ArraySliceSelector<any, any, any> {
}
type AnySelector = AnySliceSelector | AnyIndexSelector | AnyWildcardSelector | AnyNameSelector;
type ParseBracketSelector<TInner extends string> = TInner extends `${infer TStart extends number}:${infer TEnd extends number}:${infer TStep extends number}` ? ArraySliceSelector<TStart, TEnd, TStep> : TInner extends `:${infer TEnd extends number}:${infer TStep extends number}` ? ArraySliceSelector<never, TEnd, TStep> : TInner extends `::${infer TStep extends number}` ? ArraySliceSelector<never, never, TStep> : TInner extends `${infer TStart extends number}:${infer TEnd extends number}` ? ArraySliceSelector<TStart, TEnd, never> : TInner extends `:${infer TEnd extends number}` ? ArraySliceSelector<never, TEnd, never> : TInner extends `${string}"${infer TKey}"${string}` ? NameSelector<FormatString<TKey>> : TInner extends `${string}'${infer TKey}'${string}` ? NameSelector<FormatString<TKey>> : TInner extends `${string}*${string}` ? WildcardSelector : TInner extends `${infer TStart extends number}` ? IndexSelector<TStart> : never;
type ParseBracketIndexInner<T> = T extends `${infer TFirst},${infer TRest}` ? [ParseBracketSelector<TFirst>, ...ParseBracketIndexInner<TRest>] : T extends `${infer TIndex}` ? [ParseBracketSelector<TIndex>] : [];
type ParsePathInner<TPathInner extends string> = TPathInner extends `[${infer TInner}]${infer TRest}` ? [ParseBracketIndexInner<TInner>, ...ParsePathInner<TRest>] : TPathInner extends `.${infer TKey}[${infer TRest}` ? [...ParsePathInner<TKey>, ...ParsePathInner<`[${TRest}`>] : TPathInner extends `.${infer TKey}` ? ParsePathInner<TKey> : TPathInner extends `${infer TKey}.${infer TRest}` ? [...ParsePathInner<TKey>, ...ParsePathInner<TRest>] : TPathInner extends "" ? [] : [NameSelector<TPathInner>];
type ParsePath<TPath extends `$${string}`> = TPath extends `$${infer TPathInner}` ? ParsePathInner<TPathInner> : never;
type AnyParsedPath = (AnySelector | AnySelector[])[];

type ExtractRecordSelection<TSelector extends AnySelector, TValue extends AnyRecord> = TSelector extends AnyWildcardSelector ? Array<TValue[keyof TValue]> : TSelector extends NameSelector<infer TKey> ? TKey extends keyof TValue ? TValue[TKey] : never : never;
type ExtractArraySelection<TSelector extends AnySelector, TValue extends AnyArray> = TSelector extends AnyWildcardSelector ? TValue : TSelector extends IndexSelector<infer TIndex> ? PickArray<TIndex, TValue> : TSelector extends ArraySliceSelector<infer TStart, infer TEnd> ? Slice<TValue, OrDefault<TStart, 0>, OrDefault<TEnd, TValue["length"]>> : TSelector extends NameSelector<infer TKey> ? PickArrayField<TValue, TKey> : TSelector extends WildcardSelector ? TValue : [];
type ExtractMultipleArraySelections<TSelectors extends AnySelector[], TValue extends AnyArray> = TSelectors["length"] extends 0 ? [] : TSelectors extends [infer TFirst, ...infer TRest] ? TFirst extends AnySelector ? TRest extends AnySelector[] ? [
    ExtractArraySelection<TFirst, TValue>,
    ...ExtractMultipleArraySelections<TRest, TValue>
] : ExtractArraySelection<TFirst, TValue> : [] : [];
type ExtractSelection<TSelector extends AnySelector | AnySelector[], TValue extends any> = TValue extends AnyArray ? TSelector extends AnySelector[] ? TSelector["length"] extends 1 ? ExtractArraySelection<TSelector[0], TValue> : ExtractMultipleArraySelections<TSelector, TValue> : TSelector extends AnySelector ? ExtractArraySelection<TSelector, TValue> : never : TValue extends AnyRecord ? TSelector extends AnySelector ? ExtractRecordSelection<TSelector, TValue> : never : never;
type ExtractValue<TSelectors extends AnyParsedPath, TValue extends any> = TSelectors["length"] extends 0 ? TValue : TSelectors extends [infer TFirst, ...infer TRest] ? TFirst extends AnySelector | AnySelector[] ? TRest extends AnyParsedPath ? ExtractValue<TRest, ExtractSelection<TFirst, TValue>> : ExtractSelection<TFirst, TValue> : [] : [];

type Parse<TPath extends `$${string}`, TValue extends any> = ExtractValue<ParsePath<TPath>, TValue>;
declare const _default: {};

export { type AnyIndexSelector, type AnyNameSelector, type AnyParsedPath, type AnySelector, type AnySliceSelector, type AnyWildcardSelector, type ArraySliceSelector, type ExtractArraySelection, type ExtractMultipleArraySelections, type ExtractRecordSelection, type ExtractSelection, type ExtractValue, type IndexSelector, type NameSelector, type Parse, type ParseBracketIndexInner, type ParseBracketSelector, type ParsePath, type ParsePathInner, type WildcardSelector, _default as default };
