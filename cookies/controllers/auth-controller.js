
import http from "http";
import pug from "pug";
import { Database } from "../data/Database.js";
import { handleError, parseRequestBody } from "../utils.js";
import { User } from "../data/User.js";


/**
 * Handle requests to the login page
 * @param {http.IncomingMessage} request  
 * @param {http.ServerResponse} response 
*/
export function handleAuthRequest(request, response)
{
    switch(request.method)
    {
        case "GET":
            handleAuthRequestGet(request, response); 
            break;

        case "POST":
            handleAuthRequestPost(request, response); 
            break;

        default:
            handleError(request, response, 405, "Unsupported method"); 
    }
}


/**
 * Handle requests to the signup page
 * @param {http.IncomingMessage} request  
 * @param {http.ServerResponse} response 
*/
export function handleSignUpRequest(request, response)
{
    switch(request.method)
    {
        case "GET":
            handleSignUpRequestGet(request, response); 
            break;

        case "POST":
            handleSignUpRequestPost(request, response); 
            break;

        default:
            handleError(request, response, 405, "Unsupported method"); 
    }
}


/**
 * @param {http.IncomingMessage} request  
 * @param {http.ServerResponse} response 
*/
function handleAuthRequestGet(request, response)
{
    let renderedContent = pug.renderFile("./templates/loginPage.pug", {"data": "foo"});

    response.writeHead(200, {"Content-Type": "text/html"});
    response.end(renderedContent);
}


/**
 * @param {http.IncomingMessage} request  
 * @param {http.ServerResponse} response 
*/
function handleAuthRequestPost(request, response)
{
    let user;

    parseRequestBody(request).then((data) => {
                                                 user = new User(data?.usr, data?.pwd);
                                                 let db = new Database();

                                                 return db.checkLogin(user);
                                              })
                             .then((isAuthenticated) => {
                                                            if (isAuthenticated)
                                                            {
                                                                response.writeHead(302,
                                                                                   {
                                                                                       "Location": "/",
                                                                                       "Set-Cookie": [`auth=true; max-age=${60*60}`, 
                                                                                                      `username=${user.username}; max-age=${60*60}`]
                                                                                   });
                                                                response.end();
                                                            }
                                                            else
                                                            {
                                                                let renderedContent = pug.renderFile("./templates/loginPage.pug", 
                                                                                                     {"error": "Authentication failed. Check your credentials."});

                                                                response.writeHead(401, {"Content-Type": "text/html"});
                                                                response.end(renderedContent);
                                                            }
                                                        });
}


/**
 * @param {http.IncomingMessage} request  
 * @param {http.ServerResponse} response 
*/
function handleSignUpRequestGet(request, response)
{
    let renderedContent = pug.renderFile("./templates/signupPage.pug", {"data": "foo"});

    response.writeHead(200, {"Content-Type": "text/html"});
    response.end(renderedContent);
}


/**
 * @param {http.IncomingMessage} request  
 * @param {http.ServerResponse} response 
*/
function handleSignUpRequestPost(request, response)
{
    parseRequestBody(request).then((data) => {
                                                 let user = new User(data?.usr, data?.pwd);
                                                 let db = new Database();

                                                 return db.saveUser(user);
                                              })
                             .then(() => {
                                             response.writeHead(302, {"Location": "/"});
                                             response.end();
                                         })
                             .catch((err) => {
                                             let renderedContent = pug.renderFile("./templates/signupPage.pug", {"error": err});

                                             response.writeHead(400, {"Content-Type": "text/html"});
                                             response.end(renderedContent);
                                         });
}


export function handleLogoutRequest(request, response, context)
{
    response.writeHead(302, 
                       {
                           "Location": "/",
                           "Set-Cookie": [`auth=false; max-age=-1`, 
                                          `username=; max-age=-1`]
                       });
    response.end();
}
