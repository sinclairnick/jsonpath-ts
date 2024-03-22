export type AnyRecord = Record<PropertyKey, any>;
export type AnyArray = any[];
export type StripWhitespace<T extends string> = T extends ` ${infer TRest}`
    ? StripWhitespace<TRest>
    : T extends `${infer TRest} `
    ? StripWhitespace<TRest>
    : T;
export type StripQuotes<T extends string> = T extends `'${infer TValue}'`
    ? TValue
    : T extends `"${infer TValue}"`
    ? TValue
    : T;
export type FormatString<T extends string> = "" extends T
    ? never
    : StripQuotes<StripWhitespace<T>>;
export type NonZeroDigit = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type Digit = NonZeroDigit | 0;
// Limited to 9999
export type AnyNumberStr =
    | `${Digit}`
    | `${NonZeroDigit}${Digit}`
    | `${NonZeroDigit}${Digit}${Digit}`
    | `${NonZeroDigit}${Digit}${Digit}${Digit}`;

export type PickArray<
    TIndex extends number,
    TArray extends any[]
> = TArray["length"] extends 0
    ? never
    : TArray extends [...infer TRest, infer TLast]
    ? TIndex extends TRest["length"]
        ? TLast
        : PickArray<TIndex, TRest>
    : never;

type ToPositive<
    N extends number,
    Arr extends unknown[]
> = `${N}` extends `-${infer P extends number}` ? Slice<Arr, P>["length"] : N;

type InitialN<
    Arr extends unknown[],
    N extends number,
    _Acc extends unknown[] = []
> = _Acc["length"] extends N | Arr["length"]
    ? _Acc
    : InitialN<Arr, N, [..._Acc, Arr[_Acc["length"]]]>;

export type Slice<
    Arr extends unknown[],
    Start extends number = 0,
    End extends number = Arr["length"]
> = InitialN<Arr, ToPositive<End, Arr>> extends [
    ...InitialN<Arr, ToPositive<Start, Arr>>,
    ...infer Rest
]
    ? Rest
    : [];

export type PickArrayField<
    TArr extends any[],
    TKey extends string
> = TArr extends [infer TFirst, ...infer TRest]
    ? [TFirst[TKey & keyof TFirst], ...PickArrayField<TRest, TKey>]
    : [];

export type OrDefault<T, D> = [T] extends [never] ? D : T;
