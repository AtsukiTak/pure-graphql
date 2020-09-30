const graphql = require("graphql");
const { plugin } = require("../dist/index");

it("should emits Decoder definition", async () => {
  const schema = graphql.buildSchema(`
    type Query {
      id: String!
    }
  `);
  const result = await plugin(schema, [], null);

  const expected = expect.stringContaining("export const Decoder: D.Decoder");

  expect(result.content).toEqual(expected);
});
