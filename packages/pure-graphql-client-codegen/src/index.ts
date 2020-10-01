import { Types, PluginFunction } from "@graphql-codegen/plugin-helpers";
import * as graphql from "graphql";

export interface Config {}

export const plugin: PluginFunction<Config, Types.ComplexPluginOutput> = (
  schema: graphql.GraphQLSchema,
  documents: Types.DocumentFile[],
  config: Config = {}
) => {
  return {
    prepend: ['import { request } from "@AtsukiTak/pure-graphql-client"'],
    content: genClientCode(documents),
  };
};

const genClientCode = (documents: Types.DocumentFile[]): string => {
  const methodsCode = documents
    .flatMap((doc) => doc.document?.definitions)
    .filter(isOperationDefinitionNode)
    .map(genClientMethodCode)
    .join("\n");

  return `export class PureGraphQLClient {
    constructor(
      readonly url: string,
      readonly headers?: { [key: string]: string }
    ) {}

    ${methodsCode}
  }`;
};

const isOperationDefinitionNode = (
  node?: graphql.DefinitionNode
): node is graphql.OperationDefinitionNode => {
  return node?.kind === "OperationDefinition";
};

const genClientMethodCode = (node: graphql.OperationDefinitionNode): string => {
  if (node.operation !== "query") {
    throw new Error(`Unsupported operation: ${node.operation}`);
  }

  if (!node.name) {
    throw new Error("Operation must be named.");
  }

  const queryName = toPascalCase(node.name.value); // such as "Topics"

  return `
  query${queryName}(variables?: ${queryName}QueryVariables): Promise<${queryName}Query> {
    const query = \`${graphql.print(node)}\`;

    return request({
      url: this.url,
      headers: this.headers,
      query,
      decoder: TopicsQueryDecoder,
      variables,
    });
  }
  `;
};

const toPascalCase = (s: string): string => {
  return s.charAt(0).toUpperCase() + s.slice(1);
};
