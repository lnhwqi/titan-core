import * as JD from "decoders";
import {
  Result,
  fromOk,
  err,
  mapResult,
  ok,
  Maybe,
  Opaque,
  jsonValueCreate,
} from "elytra-ts";
const key: unique symbol = Symbol();
/** PositiveInt does not include 0 */
export type PositiveInt = Opaque<number, typeof key>;
export type ErrorPositiveInt = "NOT_AN_INT" | "NOT_A_POSITIVE_INT";

export const PositiveInt1: PositiveInt = jsonValueCreate<number, typeof key>(
  key
)(1);

export const PositiveInt2: PositiveInt = jsonValueCreate<number, typeof key>(
  key
)(2);

export const PositiveInt3: PositiveInt = jsonValueCreate<number, typeof key>(
  key
)(3);

export const PositiveInt10: PositiveInt = jsonValueCreate<number, typeof key>(
  key
)(10);

export const PositiveInt20: PositiveInt = jsonValueCreate<number, typeof key>(
  key
)(20);

export const PositiveInt100: PositiveInt = jsonValueCreate<number, typeof key>(
  key
)(100);

export function createPositiveInt(n: number): Maybe<PositiveInt> {
  return fromOk(createPositiveIntE(n));
}

export function createPositiveIntE(
  n: number
): Result<ErrorPositiveInt, PositiveInt> {
  return mapResult(_validate(n), jsonValueCreate(key));
}

export const positiveIntDecoder: JD.Decoder<PositiveInt> = JD.number.transform(
  (n) => {
    const positiveInt = createPositiveInt(n);
    if (positiveInt == null) {
      throw new Error("NOT_A_POSITIVE_INT" + n);
    }
    return positiveInt;
  }
);
export const stringPositiveIntDecoder: JD.Decoder<PositiveInt> =
  JD.string.transform((n) => {
    const positiveInt = createPositiveInt(Number(n));
    if (positiveInt == null) {
      throw new Error("NOT_A_STRING_POSITIVE_INT" + n);
    }
    return positiveInt;
  });

export function increment(n: PositiveInt): PositiveInt {
  return add(n, PositiveInt1);
}

export function add(n: PositiveInt, i: PositiveInt): PositiveInt {
  return jsonValueCreate<number, typeof key>(key)(n.unwrap() + i.unwrap());
}

function _validate(n: number): Result<ErrorPositiveInt, number> {
  return Number.isInteger(n) === false
    ? err("NOT_AN_INT")
    : n <= 0
      ? err("NOT_A_POSITIVE_INT")
      : ok(n);
}
