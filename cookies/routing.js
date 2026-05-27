
import http from 'http';
import fs from 'fs';
import { handleHomepageRequest } from './controllers/homepage-controller.js';
import { handleAuthRequest, handleSignUpRequest, handleLogoutRequest } from './controllers/auth-controller.js';
import { handleResetRequest } from './controllers/reset-controller.js';
import { handleTodoListRequest } from './controllers/todo-controller.js';
import { handleError, checkUserAuthentication } from './utils.js';


/**
 * Callback function to handle HTTP requests
 * @param {http.IncomingMessage} request 
 * @param {http.ServerResponse} response 
*/
export function handleRequest(request, response)
{
	let [isAuthenticated, username] = checkUserAuthentication(request);

	let context = 
	{
		isAuthenticated: isAuthenticated,
		username: username
	};

	switch (request.url)
	{
		case "/":
			handleHomepageRequest(request, response, context);
			break;
		
		case "/auth":
			handleAuthRequest(request, response, context);
			break;
		
		case "/signup":
			handleSignUpRequest(request, response, context);
			break;
		
		case "/logout":
			handleLogoutRequest(request, response, context);
			break;

		case "/reset":
			handleResetRequest(request, response, context);
			break;
		
		case "/todo":
			handleTodoListRequest(request, response, context);
			break;
		
		case "/css/bootstrap.css":
			fs.readFile('./static/css/bootstrap.css', function(err, data) { 
																		      response.writeHead(200, {'Content-Type': 'text/css'});
																		      response.end(data, 'utf-8');
																		  }); 
			break;
	
		case "/js/bootstrap.bundle.js":
			fs.readFile('./static/js/bootstrap.bundle.js', function(err, data) { 
																		           response.writeHead(200, {'Content-Type': 'text/javascript'});
																		           response.end(data, 'utf-8');
																		  	   }); 
			break;
		
		case "favicon.ico":
			fs.readFile('./favicon.ico', function(err, data) { 
																	    response.writeHead(200, {'Content-Type': 'image/ico'});
																		response.end(data, 'binary');
																	}); 
			break;

		case "/img/node.png":
			fs.readFile('./static/img/node.png', function(err, data) {
																	     response.writeHead(200, {'Content-Type': 'image/png'});
																	     response.end(data, 'binary');
																	 });
			break;
		

		default:
			handleError(request, response, 404, "Web page not found");
	}
}

