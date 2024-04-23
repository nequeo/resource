// aws cognito jwt verify
import jwkToPem = require('jwk-to-pem');
import http = require('https');
import jwt from 'jsonwebtoken'

let cacheKeys: MapOfKidToPublicKey | undefined;

/**
 * The main entry point for the lambda function.
 * @param {ClaimVerifyRequest}	request   the Claim Verify Request.
 * @return {object}    The result object.
*/
export const handler = async (event: ClaimVerifyRequest): Promise<ClaimVerifyResult> => {

    let result: ClaimVerifyResult;

    try {
        console.log('user claim verify invoked');

        // get the token
        const token = event.token;
        const tokenSections = (token || '').split('.');

        // if the token is a valid JWT token
        if (tokenSections.length < 2) {
            throw new Error('requested token is invalid');
        }

        // load the token and get header and payload.
        const headerJSON = Buffer.from(tokenSections[0], 'base64').toString('utf8');
        const header = JSON.parse(headerJSON) as TokenHeader;
        const keys = await getPublicKeys(event);
        const key = keys[header.kid];

        // if a key exists.
        if (key === undefined) {
            throw new Error('claim made for unknown kid');
        }

        // verify an load the token claims.
        const claim = jwt.verify(token, key.pem) as Claim;
        const currentSeconds = Math.floor((new Date()).valueOf() / 1000);

        // is the token time valid.
        if (currentSeconds > claim.exp || currentSeconds < claim.auth_time) {
            throw new Error('claim is expired or invalid');
        }

        // is issuer
        if (claim.iss !== "https://" + event.cognitoIdpHost + "/" + event.cognitoPoolId) {
            throw new Error('claim issuer is invalid');
        }

        // is token use.
        if (claim.token_use !== 'access') {
            throw new Error('claim use is not access');
        }

        // set the result.
        result = { userName: claim.username, clientId: claim.client_id, isValid: true };

    } catch (error) {
        // set the error result.
        result = { userName: '', clientId: '', error, isValid: false };
    }

    // return the result.
    return result;
};

/**
 * Claim verfify request model.
*/
export interface ClaimVerifyRequest {
    readonly token?: string;
    readonly cognitoPoolId?: string;
    readonly cognitoIdpHost?: string;
}

/**
 * Claim verfify result model.
*/
export interface ClaimVerifyResult {
    readonly userName: string;
    readonly clientId: string;
    readonly isValid: boolean;
    readonly error?: any;
}

/**
 * Token header model.
*/
interface TokenHeader {
    kid: string;
    alg: string;
}

/**
 * Public key model.
*/
interface PublicKey {
    alg: string;
    e: string;
    kid: string;
    kty: string;
    n: string;
    use: string;
}

/**
 * Public key metadata model.
*/
interface PublicKeyMeta {
    instance: PublicKey;
    pem: string;
}

/**
 * Public keys model.
*/
interface PublicKeys {
    keys: PublicKey[];
}

/**
 * Map of kid to public key model.
*/
interface MapOfKidToPublicKey {
    [key: string]: PublicKeyMeta;
}

/**
 * Claim model.
*/
interface Claim {
    token_use: string;
    auth_time: number;
    iss: string;
    exp: number;
    username: string;
    client_id: string;
}

/**
 * Get public keys function, pass the Cognito Pool Id.
 * @param {ClaimVerifyRequest}	request   the Claim Verify Request.
 * @return {MapOfKidToPublicKey}    The Map Of Kid To Public Key.
*/
const getPublicKeys = async (request: ClaimVerifyRequest): Promise<MapOfKidToPublicKey> => {

    // if keys have not been
    // cached then get the keys.
    if (!cacheKeys) {
        let publicKeys: PublicKeys;

        // the request options.
        const options = {
            host: request.cognitoIdpHost,
            path: '/' + request.cognitoPoolId + '/.well-known/jwks.json',
            method: 'GET',
        };

        // wait on process.
        const waitProcess = new Promise((resolve, reject) => {

            // send the event.
            const req = http.request(options, (res) => {

                // the request body.
                let body = [];

                // log status code
                console.log("statusCode: ", res.statusCode);
                res.on('data', d => {
                    body.push(d);
                });

                res.on('end', () => {
                    publicKeys = JSON.parse(Buffer.concat(body).toString());
                    console.log(publicKeys);
                    resolve(true);
                });
            });

            // if request error.
            req.on('error', (e) => {
                // error response.
                console.log("error: ", e.message);
                reject("error: " + e.message);
            });

            // send the request
            req.end();
        });

        // await on complete.
        await Promise.all([waitProcess]);

        // get all the keys in the file.
        cacheKeys = publicKeys.keys.reduce((agg, current) => {

            // convert the current key to pem format.
            const pem = jwkToPem(current);

            // assign the current key.
            agg[current.kid] = { instance: current, pem };

            // return the key.
            return agg;
        }, {} as MapOfKidToPublicKey);

        // return the key.
        return cacheKeys;
    } else {

        // return the key.
        return cacheKeys;
    }
};