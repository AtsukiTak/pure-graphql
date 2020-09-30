import { Types, PluginFunction } from "@graphql-codegen/plugin-helpers";
import { GraphQLSchema } from "graphql";

export type Config = null;

export const plugin: PluginFunction<Config, Types.ComplexPluginOutput> = (
  schema: GraphQLSchema,
  documents: Types.DocumentFile[],
  config: Config
) => {
  return {
    prepend: ['import * as D from "@mojotech/json-type-validation"'],
    content: "export const Decoder: D.Decoder",
  };
};
