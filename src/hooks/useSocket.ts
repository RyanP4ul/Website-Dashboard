// hooks/useSocket.ts
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000"); // backend Socket.IO server

export function useSocket(event: string, callback: (data: any) => void) {
  useEffect(() => {
    socket.on(event, callback);

    return () => {
      socket.off(event, callback);
    };
  }, [event, callback]);
}

export default socket;


// import { useEffect, useState } from "react";
// import { io } from "socket.io-client";

// const socket = io("http://localhost:3000");

// export function sendChatMessage(message: string) {
//   socket.emit("debug", message);
// }

export function getRooms() {
    const [rooms, setRooms] = useState([]);

    socket.emit("rooms");

    useEffect(() => {
        socket.on("rooms", (data) => {
            setRooms(data);
            console.log("Received rooms data:", data);
        });
        return () => {
            socket.off("rooms");
        };
    }, []);

    return rooms;
}

// // export function useMessage() {
// //     const [message, setMessage] = useState("");

// //   useEffect(() => {
// //     socket.emit("debug");
// //     socket.on("debug", (data) => setMessage(data));

// //     return () => {
// //       socket.off("debug");
// //     };
// //   }, []);

// //   return { message };
// // }

// // export function useOnlinePlayers() {
// //   const [players, setPlayers] = useState([]);
// //   const [error, setError] = useState("");

// //   useEffect(() => {
// //     socket.emit("getOnlinePlayers");

// //     socket.on("onlinePlayers", (data) => setPlayers(data.players || []));
// //     socket.on("error", (msg) => setError(msg));

// //     return () => {
// //       socket.off("onlinePlayers");
// //       socket.off("error");
// //     };
// //   }, []);

// //   return { players, error };
// // }
