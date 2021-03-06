import { DocumentNode, print } from "graphql";
import { Decoder } from "@mojotech/json-type-validation";
import { RequestError } from "./error";

// # Ceveat
// Currentry this library does not support
// - File upload
// - Get request
export const request = async <T, V = { [key: string]: unknown }>(args: {
  url: string;
  query: string;
  decoder: Decoder<T>;
  variables?: V;
  headers?: { [key: string]: string };
}): Promise<T> => {
  const { url, query, decoder, variables, headers } = args;

  const body = JSON.stringify({
    query,
    variables,
  });

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(headers || {}),
    },
    body,
  });

  if (!response.ok) {
    const msg = await response.text();
    throw new RequestError(response, msg);
  }

  const result = await response.json();
  if (result.errors) {
    throw new RequestError(response, JSON.stringify(result.errors));
  }

  return decoder.runWithException(result.data);
};
