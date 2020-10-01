import { PureGraphQLClient } from "./generated";

const client = new PureGraphQLClient("some url");
client.queryTopics().then(res => console.log(res.topics.map(topic => topic.lastComment?.id)))
