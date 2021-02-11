import { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';

import Page from '../page.js';

import { Paper } from '@material-ui/core';

import ApiHandler from '../../api/client.js';

import { getSessionCookie, setSessionCookie } from "../../session/cookies";

import './login.css';


const Content = (props) => {
  const [state, setState] = useState({
    login: true,
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    submitting: false,
    redirect: false
  });

  const apiHandler = new ApiHandler();

  useEffect(() => {
      if (state.submitting) {
          if (state.login) {
            apiHandler.signIn(state.username, state.password)
                .then(data => {
                    setSessionCookie({ ...getSessionCookie(), account_id: data.account_id});
                    setState({ ...state, redirect: true, submitting: false});
                })
                .catch( error => {
                    alert(error.message);
                    setState({ ...state, submitting: false});
                })
          } else {
            apiHandler.createAccount(state.username, state.password, state.firstName, state.lastName)
                .then(data => {
                    setSessionCookie({ ...getSessionCookie(), account_id: data.account_id});
                    setState({ ...state, redirect: true, submitting: false});
                })
                .catch( error => {
                    alert(error.message);
                    setState({ ...state, submitting: false});
                })
          }
      }
  });

  const changeUsername = (e) => {
    setState({ ...state, username: e.target.value });
  };

  const changePassword = (e) => {
    setState({ ...state, password: e.target.value });
  };

  const changeFirstName = (e) => {
    setState({ ...state, firstName: e.target.value });
  };

  const changeLastName = (e) => {
    setState({ ...state, lastName: e.target.value });
  };

  const switchMode = () => {
    setState({ ...state, login: !state.login });
  };

  const submit = () => {
      if (state.username.length > 0 && state.password.length > 0) {
        if (state.login) {
            setState({ ...state, submitting: true});
        } else {
            if (state.firstName.length > 0 && state.lastName.length > 0) {
                setState({ ...state, submitting: true});
            }
        }
      }
  }

  if (state.redirect) {
      return (<Redirect to="/" />);
  }

  return (
    <div className="Login">
      <div className="login-container">
        <Paper elevation={3}>
          <div className="login-title">{state.login ? "Login" : "Sign Up"}</div>
          <div className="login-input">
            <div className="login-input-label">
              <label>Username</label>
            </div>
            <input
              onChange={changeUsername}
              value={state.username}
              type="text"
            />
          </div>
          <div className="login-input">
            <div className="login-input-label">
              <label>Password</label>
            </div>{" "}
            <input
              onChange={changePassword}
              value={state.password}
              type="password"
            />
          </div>
          {state.login ? (
            <div className="login-buttons">
              <button onClick={submit}>Login</button>
              <button onClick={switchMode}>Sign Up</button>
            </div>
          ) : (
            <>
              <div className="login-input">
                <div className="login-input-label">
                  <label>First Name</label>
                </div>{" "}
                <input
                  onChange={changeFirstName}
                  value={state.firstName}
                  type="text"
                />
              </div>
              <div className="login-input">
                <div className="login-input-label">
                  <label>Last Name</label>
                </div>{" "}
                <input
                  onChange={changeLastName}
                  value={state.lastName}
                  type="text"
                />
              </div>
              <div className="login-buttons">

              <button onClick={submit}>Create Account</button>
              <button onClick={switchMode}>Back to Login</button>
              </div>
            </>
          )}
        </Paper>
      </div>
    </div>
  );
};

const Login = (props) => (
  <Content />
);

export default Login;
