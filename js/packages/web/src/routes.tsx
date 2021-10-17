import { HashRouter, Route, Switch } from 'react-router-dom';
import { Providers } from './providers';
import ROUTES from './constants/routes';
import { Splash, Portal } from './views';

export function Routes() {
  return (
    <>
      <HashRouter basename={'/'}>
        <Switch>
          <Switch>
            <Route path={ROUTES.PORTAL}>
              <Providers>
                <Portal />
              </Providers>
            </Route>
            <Route path={ROUTES.HOME}>
              <Splash />
            </Route>
          </Switch>
        </Switch>
      </HashRouter>
    </>
  );
}
