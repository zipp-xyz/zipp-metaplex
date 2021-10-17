import React, { useState } from 'react';
import { Route, Switch, Redirect, useRouteMatch } from 'react-router-dom';

import { Flex } from '@chakra-ui/react';
import { Login } from './Login';
import { Balances } from './Balances';
import { Artworks } from './Artworks';
import { AuctionView } from './Auction';
import { ArtView } from './Art';
import { Drop } from './Drop';
import { Sell } from './Sell';
import { CurrentDrops } from './CurrentDrops';
import { DropDetails } from './DropDetails';
import { Layout } from './Layout';
import { Explore } from './Explore';
import { Home } from './Home';
import ROUTES from './routes';
import { Banner } from 'components';

const PortalRouter = () => {
  const { path } = useRouteMatch();

  return (
    <Flex
      flexGrow={1}
      bg="offblack"
      minHeight="100%"
      pb={3}
      flexDirection="column"
    >
      <Switch>
        <Route path={`${path}${ROUTES.LOGIN}`} exact>
          <Login />
        </Route>
        <Route path={`${path}${ROUTES.HOME}`} exact>
          <Layout>
            <Home />
          </Layout>
        </Route>
        {/* <Route path={`${path}${ROUTES.BALANCES}`} exact>
          <Layout>
            <Balances />
          </Layout>
        </Route> */}
        <Route path={`${path}${ROUTES.ARTWORKS}`} exact>
          <Layout>
            <Artworks />
          </Layout>
        </Route>
        <Route path={`${path}${ROUTES.AUCTION}`} exact>
          <Layout>
            <AuctionView />
          </Layout>
        </Route>
        <Route path={`${path}${ROUTES.ART}`} exact>
          <Layout>
            <ArtView />
          </Layout>
        </Route>
        <Route path={`${path}${ROUTES.NEW_DROP}`} exact>
          <Layout>
            <Drop />
          </Layout>
        </Route>
        <Route path={`${path}${ROUTES.SELL_DROP}`} exact>
          <Layout>
            <Sell />
          </Layout>
        </Route>
        <Route path={`${path}${ROUTES.CURRENT_DROPS}`} exact>
          <Layout>
            <CurrentDrops />
          </Layout>
        </Route>
        <Route path={`${path}${ROUTES.DROP_DETAILS}`}>
          <Layout>
            <DropDetails />
          </Layout>
        </Route>
        <Route path={`${path}${ROUTES.EXPLORE}`}>
          <Layout banner={<Banner />}>
            <Explore />
          </Layout>
        </Route>
        <Redirect to={`${path}${ROUTES.LOGIN}`} />
      </Switch>
    </Flex>
  );
};

export default PortalRouter;
