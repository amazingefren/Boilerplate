import { Provider, createClient } from "urql";
import "./modules/_app.css"; // Being used for CSS Reset
const client = createClient(
  { url: "http://localhost:4000/graphql" },
  {
    fetchOptions: {
      credentials: "include",
    },
  }
);

function MyApp({ Component, pageProps }) {
  return (
    <Provider value={client}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
