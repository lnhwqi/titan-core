import * as JD from "decoders";

/** This is just a sugar syntax for T | null
 * but the decoder is better
 * */
export type Maybe<T> = T | null;
export type Just<T> = T;
export type Nothing = null;

export function maybeDecoder<T>(
  valueDecoder: JD.Decoder<T>
): JD.Decoder<Maybe<T>> {
  return JD.nullable(valueDecoder);
}
