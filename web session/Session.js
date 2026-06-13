
import crypto from "crypto";
import http from "http";
import { parseCookies } from "./utils.js";


const SESSION_ID_SIZE = 32; // length of the session identifier strings

/**
 * Basic Session implementation from scratch, for teaching purposes.
 * Notice that it is affected by several limitations:
 * - Sessions do not survive an app restart
 * - Sessions are never deleted, even when they expire (memory leakage)
*/
export class Session 
{
    constructor()
    {
        this.sessionStore = new Map();
    }


    /**
     * Creates a new session and returns its session id
    */
    createSession()
    {
        let sessionId = this.generateNewSessionId();
        this.sessionStore.set(sessionId, new Map());
        return sessionId;
    }


    /** 
     * Retrieves the session with the given id. 
     * Returns undefined if not such session exists. 
     * @param {String} sessionId 
    */
    getSessionById(sessionId)
    {
        return this.sessionStore.get(sessionId);
    }


    /**
     * Retrieves the session with the given id from a request.
     * Returns undefined if not such session exists. 
     * @param {http.IncomingMessage} request 
    */
    getSessionFromRequest(request)
    {
        let requestSessionId = parseCookies(request)["sessionId"];
        return this.getSessionById(requestSessionId);
    }


    /**
     * Deletes the session with the given id, if such a session exists.
     * Returns true if the session was deleted, or false if no such session existed. 
     * @param {String} sessionId 
    */
    deleteSessionById(sessionId)
    {
        return this.sessionStore.delete(sessionId);
    }

    /**
     * Stores the provided <key, value> pair in the session identified by sessionId.
     * @param {String} sessionId 
     * @param {String} key 
     * @param {Object} value 
    */
    storeSessionData(sessionId, key, value)
    {
        return this.getSessionById(sessionId)?.set(key, value);
    }

    generateNewSessionId()
    {
        let sessionId;

        do
        {
            sessionId = crypto.randomBytes(SESSION_ID_SIZE/2)
                              .toString('hex');
        } 
        while (this.sessionStore.has(sessionId));

        return sessionId;
    }
}


export const session = new Session(); // singleton, in a JavaScript fashion
