"use strict";

import http from "http";
import { handleRequest } from "./routing.js";


function main()
{
   const PORT = 3000;

   let server = http.createServer();
   server.listen(PORT);
   server.on("request", handleRequest);

   console.log(`Web app listening on port ${PORT}`);
}

main();
