import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { getSessionCookie } from '../session/cookies';


const PrivateRoute = (props) => {
    const session = getSessionCookie();
    const isAuthed = (!!session.account_id);

    return (
        <Route path={props.path}>
            {(isAuthed) ? props.component : <Redirect to="/login" />}
        </Route>
    )
}

export default PrivateRoute;