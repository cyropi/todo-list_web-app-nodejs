
import http from "http"
import pug from "pug"


/**
 * Handle requests to the homepage
 * @param {http.IncomingMessage} request 
 * @param {http.ServerResponse} response 
*/
export function handleHomepageRequest(request, response, context={})
{
    let renderedContent = pug.renderFile("./templates/homePage.pug", context);

    response.writeHead(200, {"Content-Type": "text/html"});
    response.end(renderedContent);
}
