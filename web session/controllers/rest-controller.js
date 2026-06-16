
import http from "http";
import pug from "pug";

import { Database } from "../data/Database.js";



/**
 * @param {http.IncomingMessage} request 
 * @param {http.ServerResponse} response 
*/
export function handleResetRequest(request, response, context)
{
    let db = new Database();
    
    db.resetDatabase();
    
    let renderedContent = pug.renderFile("./templates/resetPage.pug", context);
    
    response.writeHead(200, 
                       {
                           "Content-Type": "text/html",
                           "Set-Cookie": ["sessionId=; max-age=0"]
                       });
    response.end(renderedContent);
}
