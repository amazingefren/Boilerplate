import React from "react";
import { withUrqlClient, NextUrqlAppContext } from "next-urql";
import NextApp, { AppProps } from "next/app";
import { dedupExchange, fetchExchange } from "urql";
import { devtoolsExchange } from "@urql/devtools";
import { cacheExchange, QueryInput, Cache } from "@urql/exchange-graphcache";
import { LoginMutation, MeDocument, MeQuery } from "../generated/graphql";
import "./modules/_app.css";

const GRAPHQL_URI = `http://localhost:4000/graphql`;

function betterUpdateQuery<Result, Query>(
  cache: Cache,
  qi: QueryInput,
  result: any,
  fn: (r: Result, q: Query) => Query
) {
  return cache.updateQuery(qi, (data) => fn(result, data as any) as any);
}

const App = ({ Component, pageProps }: AppProps) => {
  return <Component {...pageProps} />;
};

App.getInitialProps = async (ctx: NextUrqlAppContext) => {
  const appProps = await NextApp.getInitialProps(ctx);
  return { ...appProps };
};

export default withUrqlClient((_ssrExchange, _ctx) => ({
  url: GRAPHQL_URI,
  //   fetch,
  fetchOptions: {
    credentials: "include",
  },
  exchanges: [
    devtoolsExchange,
    dedupExchange,
    cacheExchange({
      updates: {
        Mutation: {
          login: (_result, _args, cache, _info) => {
            betterUpdateQuery<LoginMutation, MeQuery>(
              cache,
              {
                query: MeDocument,
              },
              _result,
              (result, query) => {
                if (result.login.errors) {
                  return query;
                } else {
                  return {
                    me: result.login.user,
                  };
                }
              }
            );
          },
        },
      },
    }),
    fetchExchange,
  ],
}))(App as any);
