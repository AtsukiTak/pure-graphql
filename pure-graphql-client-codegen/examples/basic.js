const graphql = require("graphql");
const { plugin } = require("../dist/index");

const schema = graphql.buildSchema(`
  scalar UUID

  enum Status {
    Open
    Closed
  }

  type Query {
    topics: [Topic!]!
  }
  type Topic {
    id: UUID!
    title: String
    status: Status!
    lastComment: Comment
  }
  type Comment {
    id: UUID!
    content: String!
  }
`);

const query = graphql.parse(`
  query topics {
    topics {
      id
      title
      status
      lastComment {
        content
      }
    }
  }
`);

const result = plugin(schema, [{ document: query }], undefined);

console.log(result.content);
