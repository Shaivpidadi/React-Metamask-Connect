import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import './App.css';
import Login from './views/Login/Login';

const App = () => {
  const tokenPresent = false;

  let mainContent = (
    <>
      <Route
        exact
        path="/"
        component={React.lazy(() => import('./views/Login/Login'))}
      />
      {localStorage.getItem('userData') === null && <Redirect to="/" />}
    </>
  );

  if (tokenPresent) {
    mainContent = (
      <>
        <Route
          path="/"
          component={React.lazy(() => import('./views/MainContainer/MainContainer'))}
        />
      </>
    );
  }


  return (
    <React.Suspense fallback={<Login />}>
      <BrowserRouter>
        <Switch>
          {mainContent}
        </Switch>
      </BrowserRouter>
    </React.Suspense>
  );
}

export default App;
