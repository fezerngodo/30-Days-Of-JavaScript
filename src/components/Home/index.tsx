import MetaTags from 'components/Common/MetaTags';
import HomeSidebar from 'components/Sidebar';
import { useRouter } from 'next/router';

import { Alert, AlertTitle, Box, IconButton, LinearProgress, Snackbar, Stack, Typography } from '@mui/material';
import Footer from './Footer';

import { useEffect, useState } from 'react';

import { useWalletPresistStore, useSnackPresistStore, useUserPresistStore, useStorePresistStore } from 'lib/store';

import ControlCameraIcon from '@mui/icons-material/ControlCamera';

import Link from 'next/link';
import { routes, RouteType } from './Routes';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const router = useRouter();
  const { t, i18n } = useTranslation('');

  const { snackOpen, snackMessage, snackSeverity, setSnackOpen } = useSnackPresistStore((state) => state);
  const { getIsLogin, getNetwork, setShowSidebar, getShowSidebar, getShowProgress } = useUserPresistStore(
    (state) => state,
  );
  const { getIsWallet } = useWalletPresistStore((state) => state);
  const { getIsStore } = useStorePresistStore((state) => state);
  const { getLang, setLang } = useUserPresistStore((state) => state);

  const [isLogin, setLogin] = useState<boolean>(false);
  const [isStore, setStore] = useState<boolean>(false);
  const [isWallet, setWallet] = useState<boolean>(false);
  const [network, setNetwork] = useState<string>();
  const [currentRoute, setCurrentRoute] = useState<RouteType>();

  useEffect(() => {
    if (!getLang() || getLang() === '') {
      setLang('en');
      i18n.changeLanguage('en');
    }

    const route = routes.find((item) => item.path === router.pathname);

    if (!route) return;

    const loginStatus = getIsLogin();
    const storeStatus = getIsStore();
    const walletStatus = getIsWallet();
    const network = getNetwork();

    setLogin(loginStatus);
    setStore(storeStatus);
    setWallet(walletStatus);
    setNetwork(network);

    if (route?.needLogin && !loginStatus) {
      window.location.href = '/login';
    }

    setCurrentRoute(route);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.pathname, getIsLogin, getIsStore, getIsWallet, getLang]);

  return (
    <Box height={'100%'}>
      <MetaTags title={currentRoute?.title} />

      {currentRoute?.enableSidebar ? (
        <Stack direction={'row'} height={'100%'}>
          {getShowSidebar() ? <HomeSidebar /> : null}

          <Box width={'100%'}>
            {getShowProgress() ? <LinearProgress /> : null}

            <Box m={2}>
              <IconButton
                onClick={() => {
                  setShowSidebar(!getShowSidebar());
                }}
              >
                <ControlCameraIcon />
              </IconButton>
            </Box>

            <Box>
              {!isStore && (
                <Box mb={1}>
                  <Alert severity="warning">
                    <AlertTitle>Warning</AlertTitle>
                    <Typography>
                      You don&apos;t have a store yet. Please click&nbsp;
                      <Link href={'/stores/create'}>here</Link>
                      &nbsp;to create a new one.
                    </Typography>
                  </Alert>
                </Box>
              )}

              {!isWallet && (
                <Box mb={1}>
                  <Alert severity="warning">
                    <AlertTitle>Warning</AlertTitle>
                    <Typography>
                      You don&apos;t have a wallet yet. Please click&nbsp;
                      <Link href={'/wallet/create'}>here</Link>
                      &nbsp;to create a new one.
                    </Typography>
                  </Alert>
                </Box>
              )}

              {isWallet && network === 'testnet' && (
                <Box mb={1}>
                  <Alert severity="warning">
                    <AlertTitle>Warning</AlertTitle>
                    <Typography>
                      This is a test network, and the currency has no real value. If you need free coins, you can get
                      them&nbsp;
                      <Link href={'/freecoin'} target="_blank">
                        here.
                      </Link>
                    </Typography>
                  </Alert>
                </Box>
              )}

              {isWallet && isStore && (currentRoute.component || null)}

              {isWallet && isStore && currentRoute?.enableInnerFooter && (
                <Box>
                  <Footer />
                </Box>
              )}
            </Box>
          </Box>
        </Stack>
      ) : (
        <Box>
          {currentRoute?.component || null}

          {currentRoute?.enableInnerFooter && (
            <Box>
              <Footer />
            </Box>
          )}
        </Box>
      )}

      <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={snackOpen}>
        <Alert
          onClose={() => {
            setSnackOpen(false);
          }}
          severity={snackSeverity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Home;
