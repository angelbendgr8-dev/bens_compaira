// pages/_app.js
import Layout from "@/layouts/Layout";
import { store } from "@/state/store";
import { theme } from "@/utils/theme";
import { ChakraProvider } from "@chakra-ui/react";
import { useEffect } from "react";
import { Provider } from "react-redux";
import {persistStore} from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
type Props = {
  Component: any;
  pageProps: any;
};
import NextProgress from "next-progress";

let persistor = persistStore(store);
function MyApp({ Component, pageProps }: Props) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ChakraProvider theme={theme}>

          <NextProgress delay={300} options={{ showSpinner: false,trickle:false }} height={'4px'} />
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ChakraProvider>
      </PersistGate>
    </Provider>
  );
}

export default MyApp;
