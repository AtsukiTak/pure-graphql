import { PureGraphQLClient } from "./generated";

const client = new PureGraphQLClient("some url");
client.queryAllArticles()
  .then(res => console.log(res.articles.map(article => article.lastComment?.id)))
