import Head from "next/head";
import React from "react";

import { Box } from "@chakra-ui/react";

const Layout = ({ children }: { children: any }) => {
  return (
    <Box  >
      <Head>
        <title>Compaira</title>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.css"
          integrity="sha512-42kB9yDlYiCEfx2xVwq0q7hT4uf26FUgSIZBK8uiaEnTdShXjwr8Ip1V4xGJMg3mHkUt9nNuTDxunHF0/EgxLQ=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <link rel="icon" href="/assets/favi.svg" type="image/svg+xml" />
      </Head>

      <Box >{children}</Box>
    </Box>
  );
};

export default Layout;
