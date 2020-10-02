import * as D from "@mojotech/json-type-validation";
import { request } from "pure-graphql";
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  UUID: any;
};


export enum ArticleStatus {
  PreOpen = 'PRE_OPEN',
  Open = 'OPEN',
  Closed = 'CLOSED'
}

export type Query = {
  __typename?: 'Query';
  articles: Array<Article>;
};

export type Article = {
  __typename?: 'Article';
  id: Scalars['UUID'];
  title: Maybe<Scalars['String']>;
  status: ArticleStatus;
  lastComment: Maybe<Comment>;
};

export type Comment = {
  __typename?: 'Comment';
  id: Scalars['UUID'];
  content: Scalars['String'];
};

export type AllArticlesQueryVariables = Exact<{ [key: string]: never; }>;


export type AllArticlesQuery = (
  { __typename?: 'Query' }
  & { articles: Array<(
    { __typename?: 'Article' }
    & Pick<Article, 'id' | 'title' | 'status'>
    & { lastComment: Maybe<(
      { __typename?: 'Comment' }
      & Pick<Comment, 'id' | 'content'>
    )> }
  )> }
);

export const UUIDDecoder = D.string();
export const AllArticlesQueryDecoder: D.Decoder<AllArticlesQuery> = D.object({
  articles: D.array(
    D.object({
      id: UUIDDecoder,
      title: D.union(D.constant(null), D.string()),
      status: D.oneOf(
        D.constant(ArticleStatus.PreOpen),
        D.constant(ArticleStatus.Open),
        D.constant(ArticleStatus.Closed)
      ),
      lastComment: D.union(
        D.constant(null),
        D.object({ id: UUIDDecoder, content: D.string() })
      ),
    })
  ),
});

export class PureGraphQLClient {
    constructor(
      readonly url: string,
      readonly headers?: { [key: string]: string }
    ) {}

    
  queryAllArticles(variables?: AllArticlesQueryVariables): Promise<AllArticlesQuery> {
    const query = `query allArticles {
  articles {
    id
    title
    status
    lastComment {
      id
      content
    }
  }
}`;

    return request({
      url: this.url,
      headers: this.headers,
      query,
      decoder: AllArticlesQueryDecoder,
      variables,
    });
  }
  
  }