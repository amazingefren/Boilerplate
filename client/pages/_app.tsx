import { Provider, createClient, dedupExchange, fetchExchange } from "urql";
import { cacheExchange } from "@urql/exchange-graphcache";
import "./modules/_app.css"; // Being used for CSS Reset
import { RegisterDocument, UserDocument } from "../generated/graphql";

const client = createClient({
  url: "http://localhost:4000/graphql",
  fetchOptions: {
    credentials: "include",
  },
  exchanges: [dedupExchange, cacheExchange({}), fetchExchange],
});

function MyApp({ Component, pageProps }: any) {
  return (
    <Provider value={client}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
