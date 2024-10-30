import * as React from "react";
import Head from "next/head";
import { AppProps } from "next/app";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Box } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider, EmotionCache } from "@emotion/react";
import createEmotionCache from "utils/createEmotionCache";
import { TopBar, DesktopNavigation } from "components";
import { darkTheme, lightTheme } from "utils/theme";
import { Provider, useDispatch } from 'react-redux';
import StoreProvider from "./storeProvider";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { AppDispatch } from "lib/store";
import { fetchAdminProfile } from "lib/features/admins/adminsSlices";
import { useRouter } from "next/router";


// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
  const [mode, setMode] = React.useState<PaletteMode>("dark");
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const router = useRouter()

  const noLayoutRoutes = ['/login'];
  const isLayoutVisible = !noLayoutRoutes.includes(router.pathname);

  const theme = React.useMemo(
    // @ts-ignore
    () => createTheme(mode === "light" ? lightTheme : darkTheme),
    [mode]
  );

  theme.typography.h2 = {
    fontSize: "1.25rem",
    fontWeight: 700,
    color: mode === "light" ? "#11142D" : "#EFEFEF",
  };
  theme.typography.body1 = {
    fontSize: "0.75rem",
    [theme.breakpoints.up("sm")]: {
      fontSize: "0.875rem",
    },
    color: mode === "light" ? "#11142D" : "#EFEFEF",
  };
  theme.typography.body2 = {
    fontSize: "0.75rem",
    [theme.breakpoints.up("sm")]: {
      fontSize: "0.875rem",
    },
    color: mode === "light" ? "#808191" : "#6F767E",
  };

  return (
    <StoreProvider>
      <CacheProvider value={emotionCache}>
        <Head>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
          <meta
            name="theme-color"
            content={mode === "light" ? "#FCFCFC" : "#1A1D1F"}
          />
          <meta
            name="msapplication-navbutton-color"
            content={mode === "light" ? "#FCFCFC" : "#1A1D1F"}
          />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content={mode === "light" ? "#FCFCFC" : "#1A1D1F"}
          />
          <title>360PropertyNG - Dashboard</title>

          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="192x192"
            href="/favicon-192x192.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          />
        </Head>

        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          {isLayoutVisible &&  <TopBar setMode={setMode} admin={undefined} loading={false} /> }

          <Box sx={{ display: { lg: `${isLayoutVisible ? "flex" : "block" }`} }}>
            {isLayoutVisible && <DesktopNavigation />}
            <Box sx={{ width: { lg: `${isLayoutVisible ? 'calc(100% - 250px)': '100%'}` } }}>
              <Component {...pageProps} />
            </Box>
          </Box>
        </ThemeProvider>
      </CacheProvider>
    </StoreProvider>
  );
}
