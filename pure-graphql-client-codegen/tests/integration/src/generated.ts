import * as D from "@mojotech/json-type-validation";
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


export enum TopicStatus {
  Open = 'Open',
  Closed = 'Closed'
}

export type Query = {
  __typename?: 'Query';
  topics: Array<Topic>;
};

export type Topic = {
  __typename?: 'Topic';
  id: Scalars['UUID'];
  title: Maybe<Scalars['String']>;
  status: TopicStatus;
  lastComment: Maybe<Comment>;
};

export type Comment = {
  __typename?: 'Comment';
  id: Scalars['UUID'];
  content: Scalars['String'];
};

export type TopicsQueryVariables = Exact<{ [key: string]: never; }>;


export type TopicsQuery = (
  { __typename?: 'Query' }
  & { topics: Array<(
    { __typename?: 'Topic' }
    & Pick<Topic, 'id' | 'title' | 'status'>
    & { lastComment: Maybe<(
      { __typename?: 'Comment' }
      & Pick<Comment, 'id' | 'content'>
    )> }
  )> }
);

export const UUIDDecoder = D.string();
export const TopicsQueryDecoder: D.Decoder<TopicsQuery> = D.object({
  topics: D.array(
    D.object({
      id: UUIDDecoder,
      title: D.union(D.constant(null), D.string()),
      status: D.oneOf(
        D.constant(TopicStatus.Open),
        D.constant(TopicStatus.Closed)
      ),
      lastComment: D.union(
        D.constant(null),
        D.object({ id: UUIDDecoder, content: D.string() })
      ),
    })
  ),
});
