// // this will be the entry point to our server

const express = require("express"); // import express
const app = express(); // set app variable as an instance of express function
const http = require("http"); // http library already exist in any nodejs application
const cors = require("cors"); //
const { Server } = require("socket.io");

app.use(cors());

const server = http.createServer(app); // creating an http server ana passing/intigrating it with express instance "app"

// intigrating http server with socket.io Server nd passing cors option/setup/config obj as 2nd arg/obj
const io = new Server(server, {
  cors: {
    // origin: "http://localhost:3000", // for vs code but
    // origin: "http://localhost:5173", // for codesandbox its running on port 5173
    origin: "https://dxg9cc-5173.csb.app", // we can also put website url directly though so lets do that
    methods: ["GET", "POST"],
  },
});

//-------------------------------------------------------------------------------------
// sc.io works on events, u emit a event n it waots on event
// now using io, we listen to any user connecting, disconnecting, sending or reciving some data
// the way it works is we listen to any event occoring in frontend socket-client with the backend io(which is an instance of socket.io Server-> const { Server } = require("socket.io")); const io = new Server(....)
io.on("connection", (socket) => {
  //  event on connection
  // all the socket operations must be within this
  // socket is basically obj/json that carries data of user
  // all socket code must be inside this co u should only be listening for the user if they have actually connected
  console.log(`user connected: ${socket.id}`); // in server terminal, you will get following logged "user connected: sp5G9wivd5wKIEV2AABb" on evert ctrl+s
  //-------------------------------------------------------------------------------------
  socket.on("join_room", (data) => {
    //  event on any user joining any room
    // clbkfun to be executed after recieving that event
    socket.join(data);
    console.log("user joined id: ", socket.id, "room_name:", data);
  });
  //-------------------------------------------------------------------------------------
  socket.on("send_msg", (data) => {
    //  event on any user sending any message
    console.log("bkendcnslog: ", "sent data: ", data);
    /*
            in server terminal, u recieve following-->>
user joined id:  3XWbsJaRUAIoWbMLAACH room_name: TY
sent data:  {
  msg: 'datasentviachatinput',
  room: 'TY',
  usernm: 'TY',
  time: '13/3/2024, 3:40:54 pm'
            */

    // when we send data, its sent by client socket to bkent socket.on listener that listens to that event that we console.log
    // we can also send/emit that dta to ftend by-->>
    socket.to(data.room).emit("recieve_msg", data);
    /*
    let's break down this line of code:

socket.to(data.room).emit("recieve_msg", data);

This code is part of the socket.io library, which is used for real-time, bidirectional communication between a client (e.g., a web browser) and a server.

Here's what each part of the code does:

    socket: This is an instance of the Socket object, which represents a single client connection to the server. In this case, it refers to the specific client that sent the send_msg event.

    to(data.room): This method is used to target a specific room (or multiple rooms) to which the message should be sent. In this case, it's sending the message to the room specified by data.room. Rooms in Socket.IO are a way to create separate communication channels, allowing you to broadcast messages to a subset of connected clients.

    emit("recieve_msg", data): This method is used to send an event to the specified room(s). It takes two arguments:
        "recieve_msg": This is the name of the event being emitted. On the client-side, you would listen for this event using socket.on("recieve_msg", callback).
        data: This is the data payload that will be sent along with the event. In this case, it's the same data object that was received from the client's send_msg event.

So, when a client sends a message using the send_msg event, the server receives the message data (data) and broadcasts it to all clients connected to the room specified by data.room. On the client-side, any connected clients listening for the recieve_msg event will receive the message data.

This line of code is responsible for broadcasting the received message to all clients in the same room, enabling real-time chat functionality within that room.

It's important to note that this code assumes that the data object has a room property that contains the name of the room to which the message should be sent. The structure of the data object likely comes from the client-side when the send_msg event is emitted.
    */
  });
  //  io.emit("message", "hello");
  io.on("disconnect", () => {
    console.log(`user disconnected: ${socket.id}`); // this will be executed when user disconnect by either closing the tab or nw disconnect, socket listens n detects that event
  });
});

server.listen(3001, () => {
  // note, in vscode its https://localhost:3001 but in sandbox its https://mrd5n6-3001.csb.app
  console.log("listening on port 3001"); // u can choose any port for backend server u like for server to run, here we sellected 3001,
  //  in codesandbox, frontend devolopment port, it can have any port which will be visible in project url(5173) "https://mrd5n6-5173.csb.app/"
  // generally in vscode, its port 3000 thats why we chose 3001 for server but u may chose any other port
  // note, we wanna use nodemond to restart server automatically instead of manually so add the start script in server-> package.json(that u created with "npm init", {note, dont do it in react package.json which is client})
  // in server package.json, add following script (after "test")
  //"start": "nodemon index.js"
  // now write npm start in server terminal, it should console.log "listening on port 3001"
});
//--------------------------------------------------------------------------------------------

//-------------------------------------------------------------------------------

//---------------------------------------------------------------------------------
// const server = require("http").Server(app);
// const io = require("socket.io")(server);
// const cors = require("cors");
// app.use(cors());
// app.use(express.json());
// app.use(express.static(__dirname + "/public"));
// app.get("/", (req, res) => {
//   res.sendFile(__dirname + "/index.html");
// });
// io.on("connection", function (socket) {
//   socket.on("message", function (msg) {
//     io.emit("message", msg);
//   });
// });
// server.listen(3000);

//-----------------------------------------------------------------
// create a server folder cd server in terminal and install server dependencies in it
//  server git:(master)  npm init
// this will initialise a package.json file, it will ask bunch of questions, just press enter to all of them
// npm i express nodemon socket.io cors
// after all packages are installed, create an index.js file inside server folder which will be the entry point to our server

/*
Express, Nodemon, Socket.io, and CORS are essential tools in a Node.js developer's toolkit. Here's a brief explanation for each:
1. Express: Express.js, or simply Express, is a back-end web application framework for Node.js. It is designed for building web applications and APIs. Express simplifies the process of writing server code, providing a set of robust features for web and mobile applications. It's highly flexible and provides a range of middleware for handling various aspects of web development.
2. Nodemon: Nodemon is a utility that monitors for any changes in your source files (JavaScript, JSON, etc.) and automatically restarts the Node.js application when a change is detected. This is a time-saving feature that helps developers avoid manually restarting the application every time they make changes to their code. Nodemon is particularly useful during the development phase, as it allows for a smoother and more efficient workflow.
Nodemon is a utility that monitors for any changes in your source code and automatically restarts your server. It's a development tool that makes it easier to build Node.js applications. Without nodemon, you would have to manually restart your server every time you made changes, which can be tedious during development.
3. Socket.io: Socket.io is a JavaScript library that enables real-time, bidirectional communication between a client and a server. It works by establishing a WebSocket connection between the two, allowing them to exchange data in real-time without the need for HTTP requests. Socket.io is particularly useful for building applications with features like live chat, real-time collaboration, and multiplayer games.
Socket.IO is a JavaScript library that enables real-time, bidirectional communication between web clients and servers. It allows for the creation of multi-user, interactive applications like chat rooms, collaborative editing tools, and real-time analytics. Socket.IO uses WebSockets, a protocol for real-time communication over the web, but provides fallback mechanisms for older browsers that don't support WebSockets.
4. CORS: CORS stands for Cross-Origin Resource Sharing. It is a security feature implemented in web browsers that restricts web pages from making requests to a different domain than the one that served the web page. CORS is essential for ensuring that web applications behave securely and prevent potential security risks, such as cross-site scripting (XSS) and cross-site request forgery (CSRF) attacks. To enable CORS in a Node.js application, you can set appropriate headers in the response to indicate which domains are allowed to access resources from the server.
CORS stands for Cross-Origin Resource Sharing. It's a mechanism that allows many resources (e.g., fonts, JavaScript, etc.) on a web page to be requested from another domain outside the domain from which the resource originated. CORS is a security feature implemented by web browsers to prevent unauthorized access to resources from different origins. It's important in the context of APIs, as it determines which domains can access resources provided by your API.
In summary, Nodemon is used for automating the restart of a Node.js application during development, Socket.io is a library for real-time communication between a client and a server, and CORS is a security feature that restricts requests from different domains. Each of these tools plays a crucial role in the development of efficient, secure, and real-time Node.js applications.
*/
//note, keep client n server in saperate folder, after creating server, goto client in terminal
// npx create-react-app.
// . means create in same folder
//
/*
after creating frontend, integrating it with socket.io-client library, everytime u refresh the page, in server terminal you will get following logged

user connected: -NAh979jy-IWKgYCAAAD
user connected: Jf1vrRiQYzqoGnYxAAAF
user connected: gI1y13BFUvGLF1UeAAAH

// each time a new random token will be created
*/
/*
we emitted the event frm frent to bkend by onclick join room btn

 socket.emit("join_room", {
                  // join_room is the event that carries the obj to bkend
                  usernm: usernm,
                  room: roomref.current.value.toUpperCase(),
                });

  
// so here in bkend, we recieve that event
// we declear the event with 
socket.on("event_name/join_room", ()=>{
  // clbkfun to be executed after recieving that event
})                
*/

//-----------------------------------------------------------------------
// now when we send msg frm frntend to bknd via chat component socket, in bkend, we connect it being another socket.on listener on that event  send_msg

// socket.on("send_msg", (data) => {
//   //  event on any user sending any message
//   console.log("sent data: ", data);

// });
/*
          in server terminal, u recieve following-->>
user joined id:  3XWbsJaRUAIoWbMLAACH room_name: TY
sent data:  {
msg: 'datasentviachatinput',
room: 'TY',
usernm: 'TY',
time: '13/3/2024, 3:40:54 pm'
          */
// till now we have 3 listners, once user joined, secondly user sent msg,
// io.on("disconnect/connect", {}) listens to new user joining any chat or origin url : "https://dxg9cc-5173.csb.app/", data sent via socket
// const io = new Server(server, {})

// till now, we send msg fem frntend n recieve in bkend,
// user joins/disconnects the app n its logged
// user joins any room, its logged with the room name
// user sends any msg, its logged with username/roomname/datetime/message, now we need to send dta frm bknd to frtend  now we need to send the message data to the specified room,
// lets create a useeffect in the ftend that will listen to any change in serverclnt
/*
  useEffect(() => {
    socket.on("recieve_msg", (data) => {
      console.log("recieved message: ", data);
    });
  }, [socket]); //now we are listening to any change in client socket that we decleared above
// till now, its not console.logging the data in ftend,
// when we send data, its sent by client socket to bkent socket.on listener that listens to that event that we console.log
in the same sc.on, we can also send/emit that dta to ftend
*/
/*
socket.on("send_msg", (data) => {
    //  event on any user sending any message
    console.log("sent data: ", data);
  
  /*
  let's break down this line of code:

socket.to(data.room).emit("recieve_msg", data);

This code is part of the socket.io library, which is used for real-time, bidirectional communication between a client (e.g., a web browser) and a server.

Here's what each part of the code does:

    socket: This is an instance of the Socket object, which represents a single client connection to the server. In this case, it refers to the specific client that sent the send_msg event.

    to(data.room): This method is used to target a specific room (or multiple rooms) to which the message should be sent. In this case, it's sending the message to the room specified by data.room. Rooms in Socket.IO are a way to create separate communication channels, allowing you to broadcast messages to a subset of connected clients.

    emit("recieve_msg", data): This method is used to send an event to the specified room(s). It takes two arguments:
        "recieve_msg": This is the name of the event being emitted. On the client-side, you would listen for this event using socket.on("recieve_msg", callback).
        data: This is the data payload that will be sent along with the event. In this case, it's the same data object that was received from the client's send_msg event.

So, when a client sends a message using the send_msg event, the server receives the message data (data) and broadcasts it to all clients connected to the room specified by data.room. On the client-side, any connected clients listening for the recieve_msg event will receive the message data.

This line of code is responsible for broadcasting the received message to all clients in the same room, enabling real-time chat functionality within that room.

It's important to note that this code assumes that the data object has a room property that contains the name of the room to which the message should be sent. The structure of the data object likely comes from the client-side when the send_msg event is emitted.
  */
