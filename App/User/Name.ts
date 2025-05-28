import * as JD from "decoders";
import {
  Opaque,
  jsonValueCreate,
  Maybe,
  Result,
  err,
  ok,
  fromOk,
} from "elytra-ts";
import { createText100 } from "../../Data/Text";

const key: unique symbol = Symbol();
export type Name = Opaque<string, typeof key>;
export type ErrorName = "INVALID_NAME";

export function createName(s: string): Maybe<Name> {
  return fromOk(createNameE(s));
}

export function createNameE(s: string): Result<ErrorName, Name> {
  const text100 = createText100(s);
  if (text100 == null) return err("INVALID_NAME");

  return ok(jsonValueCreate<string, typeof key>(key)(text100.unwrap()));
}

export const nameDecoder: JD.Decoder<Name> = JD.string.transform((s) => {
  const name = createName(s);
  if (name == null) {
    throw new Error("INVALID_NAME");
  }
  return name;
});
