"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CallService = void 0;
/**
 * Call implementation of cloudflare call service.
 */
class CallService {
    callOptions;
    config;
    baseURL;
    /**
    * Call implementation of cloudflare call service.
    * @param {Object}   callOptions  A collection of options.
    * @example
    *  options = {
    *      appID: "appid",
    *      appSecret: "appsecret",
    *      callBaseURL: "https://rtc.live.cloudflare.com/v1/apps/",
    *      debug: false
    *  }
    */
    constructor(callOptions) {
        this.callOptions = callOptions;
        // local.
        let self = this;
        let item;
        let options = callOptions || {};
        let config = this.config = {
            debug: false,
            appID: "",
            appSecret: "",
            callBaseURL: "https://rtc.live.cloudflare.com/v1/apps/"
        };
        // set our config from options
        for (item in options) {
            if (options.hasOwnProperty(item)) {
                this.config[item] = options[item];
            }
        }
        // assign
        this.baseURL = this.config.callBaseURL + this.config.appID + "/sessions/";
    }
    /**
     * Initiates a new session on the Cloudflare Calls WebRTC server,
     * establishing a PeerConnection on the client side.
     * @param newSessionRequest the new session request.
     * @return {valid: boolean, newSessionResponse: CreateNewSessionResponse}    true if valid else false.
     */
    async createNewSession(newSessionRequest) {
        let valid = false;
        let error = null;
        let newSessionResponse = null;
        try {
            let self = this;
            // create the request.
            let request = {
                method: 'POST',
                headers: {
                    "Content-type": "application/json",
                    Authorization: 'Bearer ' + this.config.appSecret
                },
                body: JSON.stringify(newSessionRequest)
            };
            // create a promise.
            const waitGetSession = new Promise(async (resolve, reject) => {
                try {
                    // send the request.
                    this.jsonRequest(this.baseURL + "new", request, (data) => {
                        resolve(data);
                    }, (error) => {
                        reject(error);
                    });
                }
                catch (ex) {
                    reject(ex);
                }
            });
            // await on complete.
            await Promise.all([waitGetSession]).then((value) => {
                valid = true;
                newSessionResponse = value[0];
            }).catch((reason) => {
                valid = false;
                error = reason;
            });
        }
        catch (e) {
            valid = false;
            error = e;
        }
        finally {
            //await;
        }
        // return the result.
        return { valid, newSessionResponse, error };
    }
    /**
     * Adds a media track (audio or video) to an existing session
     * @param sessionId the session id.
     * @param newTrackRequest the new track request.
     * @return {valid: boolean, newTrackResponse: AddNewTrackResponse}    true if valid else false.
     */
    async addNewTrack(sessionId, newTrackRequest) {
        let valid = false;
        let error = null;
        let newTrackResponse = null;
        try {
            let self = this;
            // create the request.
            let request = {
                method: 'POST',
                headers: {
                    "Content-type": "application/json",
                    Authorization: 'Bearer ' + this.config.appSecret
                },
                body: JSON.stringify(newTrackRequest)
            };
            // create a promise.
            const waitAddTrack = new Promise(async (resolve, reject) => {
                try {
                    // send the request.
                    this.jsonRequest(this.baseURL + sessionId + "/tracks/new", request, (data) => {
                        resolve(data);
                    }, (error) => {
                        reject(error);
                    });
                }
                catch (ex) {
                    reject(ex);
                }
            });
            // await on complete.
            await Promise.all([waitAddTrack]).then((value) => {
                valid = true;
                newTrackResponse = value[0];
            }).catch((reason) => {
                valid = false;
                error = reason;
            });
        }
        catch (e) {
            valid = false;
            error = e;
        }
        finally {
            //await;
        }
        // return the result.
        return { valid, newTrackResponse, error };
    }
    /**
     * Updates the session�s negotiation state to accommodate new tracks or
     * changes in the existing ones.
     * @param sessionId the session id.
     * @param renegotiateSessionRequest the new track request.
     * @return {valid: boolean, renegotiateSessionResponse: RenegotiateSessionResponse}    true if valid else false.
     */
    async renegotiateSession(sessionId, renegotiateSessionRequest) {
        let valid = false;
        let error = null;
        let renegotiateSessionResponse = null;
        try {
            let self = this;
            // create the request.
            let request = {
                method: 'PUT',
                headers: {
                    "Content-type": "application/json",
                    Authorization: 'Bearer ' + this.config.appSecret
                },
                body: JSON.stringify(renegotiateSessionRequest)
            };
            // create a promise.
            const waitRenegotiateSession = new Promise(async (resolve, reject) => {
                try {
                    // send the request.
                    this.jsonRequest(this.baseURL + sessionId + "/renegotiate", request, (data) => {
                        resolve(data);
                    }, (error) => {
                        reject(error);
                    });
                }
                catch (ex) {
                    reject(ex);
                }
            });
            // await on complete.
            await Promise.all([waitRenegotiateSession]).then((value) => {
                valid = true;
                renegotiateSessionResponse = value[0];
            }).catch((reason) => {
                valid = false;
                error = reason;
            });
        }
        catch (e) {
            valid = false;
            error = e;
        }
        finally {
            //await;
        }
        // return the result.
        return { valid, renegotiateSessionResponse, error };
    }
    /**
     * Removes a specified track from the session.
     * @param sessionId the session id.
     * @param closeTrackRequest the close track request.
     * @return {valid: boolean, closeTrackResponse: CloseTrackResponse}    true if valid else false.
     */
    async closeTrack(sessionId, closeTrackRequest) {
        let valid = false;
        let error = null;
        let closeTrackResponse = null;
        try {
            let self = this;
            // create the request.
            let request = {
                method: 'PUT',
                headers: {
                    "Content-type": "application/json",
                    Authorization: 'Bearer ' + this.config.appSecret
                },
                body: JSON.stringify(closeTrackRequest)
            };
            // create a promise.
            const waitCloseTrack = new Promise(async (resolve, reject) => {
                try {
                    // send the request.
                    this.jsonRequest(this.baseURL + sessionId + "/tracks/close", request, (data) => {
                        resolve(data);
                    }, (error) => {
                        reject(error);
                    });
                }
                catch (ex) {
                    reject(ex);
                }
            });
            // await on complete.
            await Promise.all([waitCloseTrack]).then((value) => {
                valid = true;
                closeTrackResponse = value[0];
            }).catch((reason) => {
                valid = false;
                error = reason;
            });
        }
        catch (e) {
            valid = false;
            error = e;
        }
        finally {
            //await;
        }
        // return the result.
        return { valid, closeTrackResponse, error };
    }
    /**
     * Gets detailed information about a specific session.
     * @param sessionId the session id.
     * @param getSessionInformationRequest the close track request.
     * @return {valid: boolean, getSessionInformationResponse: GetSessionInformationResponse}    true if valid else false.
     */
    async getSessionInformation(sessionId, getSessionInformationRequest) {
        let valid = false;
        let error = null;
        let getSessionInformationResponse = null;
        try {
            let self = this;
            // create the request.
            let request = {
                method: 'GET',
                headers: {
                    "Content-type": "application/json",
                    Authorization: 'Bearer ' + this.config.appSecret
                }
            };
            // create a promise.
            const waitGetSessionInformation = new Promise(async (resolve, reject) => {
                try {
                    // send the request.
                    this.jsonRequest(this.baseURL + sessionId, request, (data) => {
                        resolve(data);
                    }, (error) => {
                        reject(error);
                    });
                }
                catch (ex) {
                    reject(ex);
                }
            });
            // await on complete.
            await Promise.all([waitGetSessionInformation]).then((value) => {
                valid = true;
                getSessionInformationResponse = value[0];
            }).catch((reason) => {
                valid = false;
                error = reason;
            });
        }
        catch (e) {
            valid = false;
            error = e;
        }
        finally {
            //await;
        }
        // return the result.
        return { valid, getSessionInformationResponse, error };
    }
    /**
     * Make a request with a json response from a fetch API request.
     *
     * @param {string}	url   the url.
     * @param {object}	config   the configuration object.
     * @param {Function}	resultAction   the result function.
     * @param {Function}	errorAction   the error function.
     *
     * @example
     *	jsonRequest(
     *		'https://domain/api/1',
     *		{
     *			mode: 'cors',					// no-cors, *cors, same-origin
     *			method: 'post',					// *GET, POST, PUT, DELETE, etc..
     *			cache: 'no-cache',				// *default, no-cache, reload, force-cache, only-if-cached
     *			redirect: 'follow',				// manual, *follow, error
     *			referrer: 'no-referrer',		// no-referrer, *client
     *			body: 'foo=bar&lorem=ipsum',	// JSON.stringify(data), body data type must match "Content-Type" header
     *			credentials: 'include',			// include, same-origin, omit
     *			headers: {
     *				"Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
     *			}
     *		},
     *		function(data) { ... },
     *		function(error) { ... }
     *  );
     */
    jsonRequest(url, config, resultAction, errorAction) {
        // make the request.
        fetch(url, config)
            .then(this.responseAction)
            .then(this.jsonResponse)
            .then(resultAction)
            .catch(errorAction);
    }
    /**
     * json response from a fetch API request.
     *
     * @param {Response}	response   the fetch API response.
     * @return {Promise<any>}	the promise interface.
     */
    jsonResponse(response) {
        // return the promise.
        return response.json();
    }
    /**
     * Response action from a fetch API request.
     *
     * @param {Response}	response   the fetch API response.
     * @return {Promise}	the promise interface; either the response or the error message.
     */
    responseAction(response) {
        // if successful request.
        if (response.status >= 200 && response.status < 300) {
            // return the promise response.
            return Promise.resolve(response);
        }
        else {
            // return the promise with error.
            return Promise.reject(new Error(response.statusText));
        }
    }
}
exports.CallService = CallService;
