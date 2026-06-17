
import http from "http";
import pug from "pug";
import { Database } from "../data/Database.js";
import { handleError, parseRequestBody } from "../utils.js";
import { Todo } from "../data/Todo.js";



/**
 * Handle requests to the todo page
 * @param {http.IncomingMessage} request 
 * @param {http.ServerResponse} response 
*/
export function handleTodoListRequest(request, response, context={})
{
    if (!context.isAuthenticated)
    {
        handleError(request, response, 401, "Unauthorized! Login to view your To-do list.");
        return;
    }

    switch(request.method)
    {
        case "GET":
            handleTodoListRequestGet(request, response,context);
            break;
        
        case "POST":
            handleTodoListRequestPost(request, response, context);
            break;

        default:
            handleError(request, response, 405, "Unsupported method"); 
    }
}


/**
 * Handle GET requests to the todo page, displays the todo list
 * @param {http.IncomingMessage} request 
 * @param {http.ServerResponse} response 
*/
function handleTodoListRequestGet(request, response, context={})
{
    new Database().getTodosItemsByUsername(context.username)
                  .then((todoItems) => {
                                           context.todoItems = todoItems;
                                           
                                           let renderedContent = pug.renderFile("./templates/todoPage.pug", context);
                                           
                                           response.writeHead(200, {"Content-Type": "text/html"});
                                           response.end(renderedContent);
                                       });
}


/**
 * Handle POST requests to the todo page. Saves a new todo.
 * @param {http.IncomingMessage} request 
 * @param {http.ServerResponse} response 
*/
function handleTodoListRequestPost(request, response, context={})
{
    parseRequestBody(request).then((data) => {
                                                 let todoText = data?.todo;                                                 
                                                 let todo = new Todo(todoText, new Date().toString(), context.username);
                                                 
                                                 return new Database().saveTodo(todo);
                                             })
                             .then((result) => {
                                                   return new Database().getTodosItemsByUsername(context.username);
                                               })
                             .then(todoItems => {
                                                    context.todoItems = todoItems;
                                                    
                                                    let renderedContent = pug.renderFile("./templates/todoPage.pug", context);
                                                    
                                                    response.writeHead(200, {"Content-Type": "text/html"});
                                                    response.end(renderedContent);
                                                });
}
