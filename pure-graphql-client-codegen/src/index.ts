import { Types, PluginFunction } from "@graphql-codegen/plugin-helpers";
import * as graphql from "graphql";

export interface Config {
  scalarDecoders?: { [name: string]: string };
}

export const plugin: PluginFunction<Config, Types.ComplexPluginOutput> = (
  schema: graphql.GraphQLSchema,
  documents: Types.DocumentFile[],
  config: Config = {}
) => {
  const queryObj = schema.getType("Query")!;
  if (!graphql.isObjectType(queryObj)) {
    throw new Error("Unexpected error");
  }

  const scalarDecoders = config.scalarDecoders || {};
  const scalarDecoderImpls = Object.entries(scalarDecoders).map(
    ([key, val]) => `export const ${key}Decoder = ${val}`
  );

  const queryDecoderImpls = documents
    .flatMap((doc) => doc.document!.definitions)
    .filter(isOperationDefinitionNode)
    .map((def) => parseOperationDefinitionNode(def, queryObj));

  return {
    prepend: ['import * as D from "@mojotech/json-type-validation"'],
    content: [...scalarDecoderImpls, ...queryDecoderImpls].join("\n"),
  };
};

const isOperationDefinitionNode = (
  defNode: graphql.DefinitionNode
): defNode is graphql.OperationDefinitionNode => {
  return defNode.kind === "OperationDefinition";
};

// ## Example
// `
// export const TopicsQueryDecoder: D.Decoder<TopicsQuery> = D.object({ ... });
// `
const parseOperationDefinitionNode = (
  node: graphql.OperationDefinitionNode,
  object: graphql.GraphQLObjectType
): string => {
  const name = toPascalCase(node.name!.value);
  const decoderImpl = parseObjectInner(node.selectionSet, object);
  return `export const ${name}Decoder: D.Decoder<${name}> = ${decoderImpl}`;
};

const toPascalCase = (s: string): string => {
  return s.charAt(0).toUpperCase() + s.slice(1);
};

// ## Example
// `
// D.string()
// `
//
// `
// D.array( D.union( D.constant(null), D.string() ) )
// `
const parseAny = (
  node: graphql.FieldNode,
  type: graphql.GraphQLOutputType
): string => {
  if (graphql.isNonNullType(type)) {
    const ofType = type.ofType;
    // scalar
    if (graphql.isScalarType(ofType)) {
      return parseScalar(ofType);

      // object
    } else if (graphql.isObjectType(ofType)) {
      return parseObject(node, ofType);

      // list
    } else if (graphql.isListType(ofType)) {
      return parseList(node, ofType);

      // enum
    } else if (graphql.isEnumType(ofType)) {
      return parseEnum(node, ofType);
    }

    // nullable scalar
  } else if (graphql.isScalarType(type)) {
    return parseNullable(parseScalar(type));

    // nullable object
  } else if (graphql.isObjectType(type)) {
    return parseNullable(parseObject(node, type));

    // nullable list
  } else if (graphql.isListType(type)) {
    return parseNullable(parseList(node, type));
  }

  // others
  throw new Error(`unsupported type: ${type}`);
};

const parseNullable = (parsed: string): string => {
  return `D.union( D.constant(null), ${parsed} )`;
};

const parseScalar = (scalar: graphql.GraphQLScalarType): string => {
  switch (scalar.name) {
    case "Boolean":
      return "D.boolean()";
    case "ID":
    case "String":
      return "D.string()";
    case "Int":
    case "Float":
      return "D.number()";
    default:
      return `${scalar.name}Decoder`;
  }
};

const parseObject = (
  node: graphql.FieldNode,
  object: graphql.GraphQLObjectType
): string => {
  return parseObjectInner(node.selectionSet!, object);
};

// # Return
// string such as
// `
// D.Object({
//  id: UUIDDecoder,
//  title: StringDecoder,
// })
// `
const parseObjectInner = (
  node: graphql.SelectionSetNode,
  object: graphql.GraphQLObjectType
): string => {
  const internal = node.selections
    .map((childNode) => {
      if (childNode.kind !== "Field") {
        throw new Error(`Unsupported selection type: ${childNode.kind}`);
      }

      const name = childNode.name.value;
      const type = object.getFields()[name].type;

      return `${name}: ${parseAny(childNode, type)}`;
    })
    .join(", ");

  return `D.Object({ ${internal} })`;
};

const parseList = (
  node: graphql.FieldNode,
  list: graphql.GraphQLList<graphql.GraphQLOutputType>
): string => {
  return `D.array( ${parseAny(node, list.ofType)} )`;
};

// ## Example
// `
// D.oneOf( D.constant(Status.Open), D.constant(Status.Closed) )
// `
const parseEnum = (
  node: graphql.FieldNode,
  enumType: graphql.GraphQLEnumType
): string => {
  const name = enumType.name;
  const enumConsts = enumType
    .getValues()
    .map((val) => `D.constant(${name}.${val.name})`)
    .join(", ");
  return `D.oneOf( ${enumConsts} )`;
};
