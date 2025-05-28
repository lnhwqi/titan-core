import * as JD from "decoders";

import type { PositiveInt } from "./PositiveInt";
import {
  fromOk,
  err,
  ok,
  mapResult,
  Result,
  Maybe,
  Opaque,
  jsonValueCreate,
} from "elytra-ts";

const key: unique symbol = Symbol();
/** Nat include 0 */
export type Nat = Opaque<number, typeof key>;
export type ErrorNat = "NOT_AN_INT" | "NOT_A_NAT";

export const Nat0: Nat = jsonValueCreate<number, typeof key>(key)(0);
export const Nat1: Nat = jsonValueCreate<number, typeof key>(key)(1);
export const Nat30: Nat = jsonValueCreate<number, typeof key>(key)(30);
export const Nat100: Nat = jsonValueCreate<number, typeof key>(key)(100);
export const Nat300: Nat = jsonValueCreate<number, typeof key>(key)(300);
export const Nat600: Nat = jsonValueCreate<number, typeof key>(key)(600);
export const Nat900: Nat = jsonValueCreate<number, typeof key>(key)(900);

/** Creates a Nat by making all negative into positive and rounding up */
export function createAbsoluteNat(n: number): Nat {
  const value = isNaN(n) ? 0 : Math.ceil(Math.abs(n));
  return jsonValueCreate<number, typeof key>(key)(value);
}

export function createNat(n: number): Maybe<Nat> {
  return fromOk(createNatE(n));
}

export function createNatE(n: number): Result<ErrorNat, Nat> {
  return mapResult(_validate(n), jsonValueCreate(key));
}

export const natDecoder: JD.Decoder<Nat> = JD.number.transform((n) => {
  const nat = createNat(n);
  if (nat == null) {
    throw new Error("NOT_A_NAT");
  }
  return nat;
});

export function fromPositiveInt(i: PositiveInt): Nat {
  return jsonValueCreate<number, typeof key>(key)(i.unwrap());
}

export function increment(n: Nat): Nat {
  return add(n, Nat1);
}

export function decrement(n: Nat): Maybe<Nat> {
  const num = n.unwrap() - 1;
  return natDecoder.decode(num).value || null;
}

export function add(n: Nat, i: Nat): Nat {
  return jsonValueCreate<number, typeof key>(key)(n.unwrap() + i.unwrap());
}

export function sum(nr: Nat[]): Nat {
  const sumValue = nr.reduce((value, curr) => value + curr.unwrap(), 0);
  return jsonValueCreate<number, typeof key>(key)(sumValue);
}

function _validate(n: number): Result<ErrorNat, number> {
  return Number.isInteger(n) === false
    ? err("NOT_AN_INT")
    : n < 0
      ? err("NOT_A_NAT")
      : ok(n);
}
