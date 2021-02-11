import { useState } from "react";

import "./app.css";

import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";

import PrivateRoute from "./private.js";

import Dashboard from "../pages/app/dashboard/dashboard.js";
import Login from "../pages/login/login.js";

import { SessionContext } from "../session/session.js";
import { getSessionCookie } from "../session/cookies";
import Calendar from "../pages/app/calendar/calendar";
import Doctor from "../pages/app/doctor/doctor";

const AppRoutes = () => {
  const [session] = useState(getSessionCookie());

  return (
    <SessionContext.Provider value={session}>
      <Route path="/app/dashboard">
        <Dashboard />
      </Route>
      <Route path="/app/calendar">
        <Calendar />
      </Route>
      <Route path="/app/doctor">
        <Doctor />
      </Route>
    </SessionContext.Provider>
  );
};

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path="/login">
            <Login />
          </Route>
          <PrivateRoute path="/app" component={<AppRoutes />} />

          <PrivateRoute path="/" component={<Redirect to="/app/dashboard" />} />
        </Switch>
      </BrowserRouter>
    </div>
  );
};

export default App;
