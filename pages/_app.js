import "../styles/globals.css";
import LinksProvider from "../context/LinksContext";

function MyApp({ Component, pageProps }) {
  return (
    <LinksProvider>
      <Component {...pageProps} />
    </LinksProvider>
  );
}

export default MyApp;
