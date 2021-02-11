import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { removeSessionCookie } from '../session/cookies';

import './page.css';


const Header = (props) => {

    const [redirect, setRedirect] = useState(false);

    const logout = () => {
        removeSessionCookie();
        setRedirect(true);
    }

    if (redirect) {
        return (<Redirect to="/login" />);
    }

    return (
        <div className="header-container">
            <div className="header">
                <div className="logout-button"><span onClick={logout} className="logout-button-text" >Log Out</span></div>
            </div>
        </div>
    );
}

const Footer = (props) => {
    return (
        <div className="footer">
            footer...
        </div>
    );
}

const Page = (props) => {
    return (
        <div className="page">
            {!!props.header ? (<div className="header-container">
                <Header />
            </div>) : null}
            <div className="content-container">
                {props.content}
            </div>
            {!!props.footer ? (<div className="footer-container">
                <Footer />
            </div>) : null}
        </div>
    );

}

export default Page;