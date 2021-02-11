import { getSessionCookie } from "../session/cookies";

const HTTPMethod = {
    GET: 'GET',
    POST: 'POST',
    PATCH: 'PATCH',
    DELETE: 'DELETE',
    PUT: 'PUT'
};

const apiEndpoint = 'https://dpddgzpj40.execute-api.us-east-2.amazonaws.com/beta/';


export default class ApiHandler {
    constructor(session) {
        this.session = session;
    }

    updateSession(session) {
        this.session = session;
    }

    makeRequest(method, path, body) {
        const opts = {
            method: method,
        }

        if (method === HTTPMethod.POST || method === HTTPMethod.PUT || method === HTTPMethod.PATCH) {
            opts.body = JSON.stringify(body);
        }

        return fetch(apiEndpoint + path, opts)
                    .then(response => {
                        if (response.status < 300) {
                            return response.json();
                        }

                        throw new Error("There was an error with your request.");
                    });

    }

    createAccount(username, password, firstName, lastName) {
        const body = {
            username: username,
            password: password,
            first_name: firstName,
            last_name: lastName
        }

        return this.makeRequest(HTTPMethod.PUT, `logins`, body);
    }

    signIn(username, password) {
        const body = {
            username: username,
            password: password
        };

        return this.makeRequest(HTTPMethod.POST, `logins`, body);
    }

    getAccount() {
        return this.makeRequest(HTTPMethod.GET, `patients/${this.session.account_id}`);
    }

    checkTask(surgeryId, taskId) {
        return this.makeRequest(HTTPMethod.POST, `surgeries/${surgeryId}/tasks/${taskId}`);
    }

    uncheckTask(surgeryId, taskId) {
        return this.makeRequest(HTTPMethod.DELETE, `surgeries/${surgeryId}/tasks/${taskId}`);
    }

}