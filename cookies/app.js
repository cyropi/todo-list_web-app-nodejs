
"use strict";

import http from 'http';
import { handleRequest } from './routing.js';



function main()
{
	const PORT = 3000;

    let server = http.createServer();
    server.listen(PORT);
    
    console.log(`Web app listening on port ${PORT}`);

	server.on("request", handleRequest);
}

main();
