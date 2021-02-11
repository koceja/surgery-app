import React from 'react';
import { getSessionCookie } from './cookies.js';

export const SessionContext = React.createContext(getSessionCookie());

/* 
* Contents 
*    account_id: string
*    team_id: string
*    first_name: string
*    is_owner: boolean
*    team_name: string
*/
