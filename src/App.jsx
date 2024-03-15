import "./styles.css";
import io from "socket.io-client";
import React, { useEffect, useState, useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  NavLink,
  useNavigate,
} from "react-router-dom"; // Import Routes

const socket = io.connect("https://dxg9cc-3001.csb.app"); // after console log, each ctrl+s will console.log user connected: gI1y13BFUvGLF1UeAAAH
// const socket = io.connect("https://localhost:3001"); // this wont work in codesandbox tried
// note, in vscode its https://localhost:3001 but in sandbox its https://dxg9cc-3001.csb.app
export default function App(props) {
  const [room, setRoom] = useState(""); // putting it in app.js so doesnt become "" on each page change
  const [usernm, setUsernm] = useState("");
  const [msglst, setMsglst] = useState([]); // create a messagelist that will save all the msgs incomming in the chat(lets keep it too in the app.js n pass as props so that it doesnt bcome empty on route switch)
  let id =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
  const randuserid = useState(id);

  return (
    <div className="App">
      {/* ----------------------------------------------------------------------------------------------------------------------------------------      */}
      <Router>
        <div>
          <Navbar />
          <hr />
          <Routes>
            {/* Wrap Routes around Route components */}
            <Route path="/" element={<Page1 />} />
            <Route
              path="/Page2"
              element={
                <Page2
                  room={room}
                  setRoom={setRoom}
                  usernm={usernm}
                  setUsernm={setUsernm}
                  msglst={msglst}
                  setMsglst={setMsglst}
                  randuserid={randuserid}
                  //  socket={socket} // since in same jsx file, no  need else if chat n page2 were other components, socket had to be sent as props
                />
              }
            />
            <Route path="/Page3" element={<Page3 />} />
            <Route path="*" element={<Error />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// //     ---------------------components & functions--------------------

function Page1() {
  const navigate = useNavigate();
  const [dt1, setDt1] = useState("");
  const [dt2, setDt2] = useState("");
  const [dt3, setDt3] = useState("");
  const [dt4, setDt4] = useState("");
  useEffect(() => {
    let t1 = setTimeout(() => {
      setDt1("welcome to SocketChat");
    }, 1000);
    let t2 = setTimeout(() => {
      setDt2("You are being re-directed to the chat page");
    }, 2500);
    let t3 = setTimeout(() => {
      setDt3("Join or create a chatroom to chat with other users");
    }, 4000);
    let t4 = setTimeout(() => {
      setDt4("Enjoy");
    }, 6000);
    let t5 = setTimeout(() => {
      navigate("/page2");
    }, 7500);
    // Cleanup function
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, []);
  //-----------------------------------------------------------

  return (
    <div>
      <br />⚛<h1>⚛⚛⚛⚛⚛⚛⚛⚛⚛</h1>
      <br />
      <h1 className="btn">{dt1}</h1>
      <h1 className="btn">{dt2}</h1>
      <h1 className="btn">{dt3}</h1>
      <h1 className="btn">{dt4}</h1>
    </div>
  );
}
function Page2({
  room,
  setRoom,
  usernm,
  setUsernm,
  msglst,
  setMsglst,
  randuserid,
}) {
  const roomref = useRef(null);
  const ipref = useRef(null);
  // const [room, setRoom] = useState(""); // putting it in app.js so doesnt become "" on each page change
  //
  return (
    <div>
      {room === "" ? (
        <div
          className="hvr"
          style={{
            padding: "10px",
          }}
        >
          <input
            className="btn"
            type="text"
            value={usernm}
            placeholder="enter user name"
            onChange={(e) => setUsernm(e.target.value)}
          />
          <br />
          <input
            className="btn"
            ref={roomref}
            type="text"
            placeholder="enter room name"
          />
          <br />
          <button
            className="btn"
            onClick={async () => {
              if (roomref.current.value.trim() === "") {
                alert("please enter both user name and room name");
                return;
              } else {
                setUsernm(usernm.toUpperCase().trim());

                // now we need to send the data usernm and room to backend, for that we emitt an event
                // and send it to server
                await socket.emit(
                  "join_room",
                  roomref.current.value.toUpperCase().trim(),
                  // {
                  //   // join_room is the event that carries the obj to bkend
                  //   usernm: usernm, // for now lets only send roomname, we will send message with chat component
                  //   room: roomref.current.value.toUpperCase(),
                  // }
                );
                setRoom(roomref.current.value.toUpperCase().trim());
              }
            }}
          >
            Join
          </button>
          <br />
          Enter a username and room name
        </div>
      ) : (
        <div>
          <h1 className="hvr">Welcome {usernm}</h1>
          <h1 className="hvr">Room: {room}</h1>
          <button className="btn" onClick={() => setRoom("")}>
            exit room
          </button>
          <hr />
          <Chat
            room={room}
            usernm={usernm}
            msglst={msglst}
            setMsglst={setMsglst}
            randuserid={randuserid}
          />
          {/* if  chat component was in different jsx module, u would also need to send socket we created above */}
        </div>
      )}
      <hr ref={ipref} />
      {/* will look forther for ref.current.focus() */}
    </div>
  );
}
function Chat({ room, usernm, msglst, setMsglst, randuserid }) {
  const [msg, setMsg] = useState("");
  // const [msglst, setMsglst] = useState([]); // create a messagelist that will save all the msgs incomming in the chat(lets keep it too in the app.js n pass as props so that it doesnt bcome empty on route switch)

  //-------------------------------------------------------------
  // useEffect(async () => {
  //   await socket.on("recieve_msg", (data) => {
  //     console.log("ftendcnslog: ", "recieved message: ", data);
  //     const udmslst = [...msglst, data];
  //     // setMsglst((msglst) => [...msglst, data]);
  //     setMsglst(udmslst);
  //     console.log("msglst: ", msglst);
  //   });
  // }, [socket]);
  /*
  The issue here is that the msglst state is being logged after the setMsglst function is called, but before the state is actually updated. React updates the state asynchronously, so the new value of msglst will not be available immediately after calling setMsglst.
To fix this issue, you can log the msglst state inside the callback function passed to setMsglst. This way, you'll see the updated value of msglst after the state has been updated.
  */
  //-------------------------------------
  useEffect(() => {
    const handleReceiveMsg = (data) => {
      console.log("ftendcnslog: ", "recieved message: ", data);
      setMsglst((prevMsglst) => {
        const updatedMsglst = [...prevMsglst, data];
        console.log("updatedMsglst: ", updatedMsglst);
        return updatedMsglst;
      });
    };

    socket.on("recieve_msg", handleReceiveMsg);

    return () => {
      socket.off("recieve_msg", handleReceiveMsg);
    };
  }, [socket]);

  //------------------------------------------------------------------------
  return (
    <div>
      <div className="chatdiv">
        {msglst.map((mssg, index) => (
          <React.Fragment key={index}>
            {/* <p className={mssg.randuserid === randuserid ? "msg1" : "msg2"}> */}
            <p className={mssg.usernm === usernm ? "msg1" : "msg2"}>
              {/* // randuserid: randuserid, // u can use this to identify who sent the msg(in case  of same usernm) */}

              <small>
                <i>{mssg.usernm}</i>
              </small>
              <br />

              <small>
                <small>
                  <small>{mssg.time}</small>
                </small>
              </small>
              <br />
              {mssg.message}
              {/* {mssg.randuserid} */}
            </p>
            {/* <p>test</p> */}
          </React.Fragment>
        ))}
      </div>
      <input
        className="btn"
        type="text"
        value={msg}
        placeholder="type message..."
        onChange={(e) => setMsg(e.target.value)}
      />
      <button
        className="btn"
        onClick={async () => {
          if (msg.trim() === "") {
            return;
          } else {
            //-------------------------------------

            const newMessage = {
              message: msg.trim(),
              room: room.trim(),
              usernm: usernm.trim(),
              time: new Date().toLocaleString(),
              // randuserid: randuserid, // u can use this to identify who sent the msg(in casev  of same usernm)
            };

            // Update the local msglst with the new message
            setMsglst((prevMsglst) => [...prevMsglst, newMessage]);

            //-------------------------------------
            await socket.emit(
              "send_msg",
              newMessage,
              // {
              //   message: msg.trim(),
              //   room: room.trim(),
              //   usernm: usernm.trim(),
              //   time: new Date().toLocaleString(),
              //   randuserid: randuserid,
              // }
            );
            /*
            in server terminal, u recieve following-->>
            user joined id:  3XWbsJaRUAIoWbMLAACH room_name: TY
sent data:  {
  msg: 'datasentviachatinput',
  room: 'TY',
  usernm: 'TY',
  time: '13/3/2024, 3:40:54 pm'
            */

            setMsg("");
          }
          // now goto bkend and create send_msg event
        }}
      >
        Send
      </button>
      {/* -------------------------------------------- */}
    </div>
  );
}
function Page3() {
  return (
    <div>
      <div>
        <h1>🧐 About the project</h1>
        <hr />
        <h1 className="hvr">⚛⚛⚛⚛⚛⚛⚛⚛⚛⚛</h1>
        <ul>
          <li>This is a react and socket.io chat app</li>
          <li>
            React is the library for web and native user interfaces. Build user
            interfaces out of individual pieces called components written in
            JavaScript.
          </li>
          <li>
            Socket.IO is an event-driven library for real-time web applications.
            It enables real-time, bi-directional communication between web
            clients and servers. It consists of two components: a client, and a
            server. Both components have a nearly identical API.
          </li>
          <li>
            All the code for this project available at <br />
            <a className="btn" target="_blank" href="https://github.com/tfml1">
              <button className="btn">github</button>
            </a>
            <br />
            <small>
              <small>
                <i>(click to open in new tab)</i>
              </small>
            </small>
            <br />
            If you find this project useful, consider giving it a star.
            <h1>⭐️</h1>
          </li>
        </ul>
        <h1 className="hvr">⚛⚛⚛⚛⚛⚛⚛⚛⚛⚛</h1>
        <hr />
      </div>
    </div>
  );
}
// const Error = () => <h1>ERROR_PAGE</h1>;
const Error = () => {
  let navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 3000);
    return () => clearTimeout(timer); // Clear the timer when the component is unmounted
  }, []);

  return (
    <div>
      <h1 className="btn">ERROR PAGE</h1>
      <p className="btn">redirecting home in 3sec...</p>
    </div>
  );
};
const Navbar = () => {
  return (
    <nav>
      <NavLink to="/">⌂ Home</NavLink>
      <br />
      <NavLink to="/Page2">🗨️ Chat</NavLink>
      <br />
      <NavLink to="/Page3">🔎 About</NavLink>
    </nav>
  );
};

////////////////////////////////////////////////////////////////////////////////////////////////
//--------------------------------------------------------------------------------------------------------------

//////////////////////////////////////////////////////////////////////////////////////
// //----------------------notes------------------------------
// create a server folder cd server in terminal and install server dependencies in it
//  server git:(master)  npm init
// this will initialise a package.json file, it will ask bunch of questions, just press enter to all of them
// npm i express nodemon socket.io cors
// after all packages are installed, create an index.js file inside server folder which will be the entry point to our server

//------------------------------------------------------------
// first we want to create a connection with the backend
// when someone enters the website, it should consolelog the id of the user
// for that we install a library that allows us to do so called socket client
// npm i socket.io-client  // installed manually frm codesandbox dependencies
// import io from "socket.io-client"
//

/*

const socket = io.connect("https://mrd5n6-3001.csb.app");
// note, in vscode its https://localhost:3001 but in sandbox its https://mrd5n6-3001.csb.app

after creating frontend, integrating it with socket.io-client library, everytime u refresh the page, in server terminal you will get following logged

user connected: -NAh979jy-IWKgYCAAAD
user connected: Jf1vrRiQYzqoGnYxAAAF
user connected: gI1y13BFUvGLF1UeAAAH

// each time a new random token will be created
*/

//---------------------------------------------------------------------------------------------------------------------------------

/*
          in server terminal, u recieve following-->>
user joined id:  3XWbsJaRUAIoWbMLAACH room_name: TY
sent data:  {
msg: 'datasentviachatinput',
room: 'TY',
usernm: 'TY',
time: '13/3/2024, 3:40:54 pm'
          */
// till now we have 3 listners in bkend, once user joined, secondly user sent msg,
// io.on("disconnect/connect", {}) listens to new user joining any chat or origin url : "https://dxg9cc-5173.csb.app/", data sent via socket
// const io = new Server(server, {}) // inbknd

// till now, we send msg fem frntend n recieve in bkend,
// user joins/disconnects the app n its logged
// user joins any room, its logged with the room name
// user sends any msg, its logged with username/roomname/datetime/message, now we need to send dta frm bknd to frtend  now we need to send the message data to the specified room,
// lets create a useeffect in the chat component that will listen to any change in server_clnt n log da data
/*
  useEffect(() => {
    socket.on("recieve_msg", (data) => {
      console.log("recieved message: ", data);
    });
  }, [socket]); //now we are listening to any change in client socket that we decleared above
// till now, its not console.logging the data in ftend,
// when we send data, its sent by client socket to bkent socket.on listener that listens to that event that we console.log
in the same sc.on, we can also send tht dta to ftend
*/
/*
Explaining React (frontend) and Socket.IO (backend) chat application.

    Initial Setup: Users run the application, and the frontend (React app) initializes.
    Establish Connection: The React app uses the socket.io-client to establish a WebSocket connection to the server by specifying the server's URL.
    Join Room: A user enters a room name and username, then presses a 'join' button. This triggers an event on the client side.
    Emit join_room Event: The client emits a join_room event, sending data (user name, room name) to the server.
    Server Receives join_room: The backend (Node.js server) listens for join_room events. When such an event is received, the server processes the event.
    Join Socket to Room: The server uses the provided room name to join the user's socket to a specific room.
    User Sends Message: When a user types a message and submits it, the client emits a send_msg event, along with the message data to the server.
    Receive send_msg Event on Server: The server's socket.on('send_msg') listener catches incoming messages.
    Log Message on Server: The server console logs the received message data for debugging.
    Emit receive_msg Event: The server then emits a receive_msg event, targeted to all sockets subscribed to the specified room except the sender, including the message data.

Backend to Frontend

    Frontend Listens for receive_msg: The frontend has a listener set up for receive_msg events.
    Display Message: Upon receiving a receive_msg event, the frontend updates the UI to display the new message to all users in the room.
    Notification of Connected Users: When a new user connects, the server logs a message indicating a user has connected, including their socket ID.
    Users in Room Notified: All users in the same room receive a notification (if implemented) that a new user has joined the room.
    Disconnecting: If a user closes their browser or navigates away, their connection to the socket server is terminated.
    Server Logs Disconnect: The server detects the disconnection and logs a message indicating the user has disconnected.
    Notification of Disconnected User: All users in the same room as the disconnected user are notified of the disconnection (if implemented).

Additional Details

    Error Handling: Both the client and server include error handling to manage issues like connection failure, incorrect room names, or server errors.
    Data Serialization: Data sent between the frontend and backend is serialized (turned into a string) and deserialized (parsed back into objects) automatically by Socket.IO.
    Security: CORS settings on the server ensure that only requests from allowed origins are accepted, preventing unauthorized access.
    Scalability: The server can handle multiple connections, rooms, and messages simultaneously, demonstrating the scalability of the Socket.IO library.
    User Experience: The frontend provides a user-friendly interface for joining rooms, sending messages, and viewing received messages in real time.
    Real-time Interaction: The use of WebSockets allows for real-time communication, where messages are sent and received without the need to refresh the page.
    Backend Flexibility: The server can be configured to handle additional events, such as typing indicators, file transfers, or custom user statuses.

This breakdown covers the crucial steps involved in the operation of the chat application, from establishing a connection to real-time communication between users. Each step plays an integral role in delivering a seamless chat experience.
 

*/
