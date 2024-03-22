import {
    AnySelector,
    AnyWildcardSelector,
    NameSelector,
    IndexSelector,
    ArraySliceSelector,
    AnyParsedPath,
    WildcardSelector,
} from "./parse-path";
import {
    AnyRecord,
    AnyArray,
    PickArray,
    PickArrayField,
    OrDefault,
    Slice,
} from "./util";

export type ExtractRecordSelection<
    TSelector extends AnySelector,
    TValue extends AnyRecord
> = TSelector extends AnyWildcardSelector
    ? Array<TValue[keyof TValue]>
    : TSelector extends NameSelector<infer TKey>
    ? TKey extends keyof TValue
        ? TValue[TKey]
        : never
    : never;

export type ExtractArraySelection<
    TSelector extends AnySelector,
    TValue extends AnyArray
> = TSelector extends AnyWildcardSelector
    ? TValue
    : TSelector extends IndexSelector<infer TIndex>
    ? PickArray<TIndex, TValue>
    : TSelector extends ArraySliceSelector<infer TStart, infer TEnd> // TODO: Handle step somehow
    ? Slice<TValue, OrDefault<TStart, 0>, OrDefault<TEnd, TValue["length"]>>
    : TSelector extends NameSelector<infer TKey>
    ? PickArrayField<TValue, TKey>
    : TSelector extends WildcardSelector
    ? TValue
    : [];

export type ExtractMultipleArraySelections<
    TSelectors extends AnySelector[],
    TValue extends AnyArray
> = TSelectors["length"] extends 0
    ? []
    : TSelectors extends [infer TFirst, ...infer TRest]
    ? TFirst extends AnySelector
        ? TRest extends AnySelector[]
            ? [
                  ExtractArraySelection<TFirst, TValue>,
                  ...ExtractMultipleArraySelections<TRest, TValue>
              ]
            : ExtractArraySelection<TFirst, TValue>
        : []
    : [];

export type ExtractSelection<
    TSelector extends AnySelector | AnySelector[],
    TValue extends any
> = TValue extends AnyArray
    ? TSelector extends AnySelector[]
        ? TSelector["length"] extends 1
            ? ExtractArraySelection<TSelector[0], TValue>
            : ExtractMultipleArraySelections<TSelector, TValue>
        : TSelector extends AnySelector
        ? ExtractArraySelection<TSelector, TValue>
        : never
    : TValue extends AnyRecord
    ? TSelector extends AnySelector
        ? ExtractRecordSelection<TSelector, TValue>
        : never
    : never;

export type ExtractValue<
    TSelectors extends AnyParsedPath,
    TValue extends any
> = TSelectors["length"] extends 0
    ? TValue
    : TSelectors extends [infer TFirst, ...infer TRest]
    ? TFirst extends AnySelector | AnySelector[]
        ? TRest extends AnyParsedPath
            ? ExtractValue<TRest, ExtractSelection<TFirst, TValue>>
            : ExtractSelection<TFirst, TValue>
        : []
    : [];
