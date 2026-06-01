
import sqlite3 from "sqlite3";
import { User } from "./User.js";


const DBFILE = "./database.db";

export class Database 
{
    resetDatabase()
    {
        const db = new sqlite3.Database(DBFILE);

        db.serialize(() => {
                               // drop tables if exist
                               db.run("DROP TABLE IF EXISTS todos");
                               db.run("DROP TABLE IF EXISTS users");

                               // create users table
                               db.run(`CREATE TABLE users (username TEXT PRIMARY KEY, 
                                                           pwd TEXT)`);
                               //create todos table
                               db.run(`CREATE TABLE todos (todo TEXT,
                                                           creation_date TEXT,
                                                           username TEXT,
                                                           FOREIGN KEY(username) REFERENCES users(username))`);
                           });

        db.close();             
    }


    saveUser(user)
    {
        const db = new sqlite3.Database(DBFILE);
        
        return new Promise(function(resolve, reject) {
                                                         db.run(`INSERT INTO users(username, pwd)
                                                                 VALUES (?,?)`,
                                                                [user.username, user.password],
                                                                (error, result) => {
                                                                                       db.close();

                                                                                       if (error?.code === "SQLITE_CONSTRAINT")
                                                                                           reject("Username already in use.");
                                                                                       else if (error)
                                                                                       {
                                                                                           console.error(error);
                                                                                           reject(error);
                                                                                       }
                                                                                       else
                                                                                           resolve(true);
                                                                                   });
                                                     });

    }


    checkLogin(user)
    {
        let db = new sqlite3.Database(DBFILE);
        
        return new Promise(function(resolve, reject) { 
                                                         db.get(`SELECT * FROM users WHERE username = ? AND pwd = ?`,
                                                                [user.username, user.password],
                                                                (err, row) => {
                                                                                  db.close();

                                                                                  if (err)
                                                                                  {
                                                                                      console.error(err);
                                                                                      reject(err);
                                                                                  }

                                                                                  return row ? resolve(true) : resolve(false);
                                                                              });
                                                     });
    }


    getTodosItemsByUsername(username)
    {
        const db = new sqlite3.Database(DBFILE);

        return new Promise(function(resolve, reject) {
                                                         db.all(`SELECT * FROM todos WHERE username = ?`, 
                                                                [username], 
                                                                (err, row) => {
                                                                                  db.close();

                                                                                  if(err)
                                                                                  {
                                                                                      console.error(err); 
																					  reject(err);
                                                                                  }
                                                                                                         
																				  return resolve(row);
                															  });
					                                 });
    }


    saveTodo(todo)
    {
        const db = new sqlite3.Database(DBFILE);

        return new Promise(function(resolve, reject) {
													     db.run("INSERT INTO todos(todo, creation_date, username) VALUES (?,?, ?)",
																[todo.todo, todo.creation_date, todo.username], 
                    											(result, error) => {
                        														       db.close();
																					   
																					   if(error)
																					   {   
																					       console.error(error);
																					       reject(error);
																					   }                            
																					   
																					   resolve(true);
																				   });
													 });
    }  
}
