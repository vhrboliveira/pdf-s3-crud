import React from 'react';
import { Route, Switch } from 'react-router-dom'

import Login from './pages/Login';
import Logout from './pages/Logout';
import Pdf from './pages/PDFList';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/">
          <Login />
        </Route>
        <Route exact path="/pdf">
          <Pdf />
        </Route>
        <Route exact path="/logout">
          <Logout />
        </Route>
        <Route >
          <NotFound />
        </Route>
      </Switch>
    </div>
  );
}
