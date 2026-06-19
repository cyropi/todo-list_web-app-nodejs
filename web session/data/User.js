
import { createHash } from "crypto";


export class User 
{
    constructor(username, password) 
    {
        let hash = createHash("sha256");

        this.username = username;
        this.password = hash.update(password)
                            .digest("hex");
    }
}      
