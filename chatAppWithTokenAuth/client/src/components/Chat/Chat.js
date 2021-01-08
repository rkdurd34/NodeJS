import React, { useState, useEffect } from "react";
import queryString from 'query-string';
import io from "socket.io-client";
import cd from 'react-cookies'

import TextContainer from '../TextContainer/TextContainer';
import Messages from '../Messages/Messages';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import './Chat.css';




let socket;

const Chat = ({ location }) => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [users, setUsers] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const ENDPOINT = "localhost:5000";
  useEffect(() => {
    const { name, room } = queryString.parse(location.search);

    socket = io(ENDPOINT, {
      transports: ['websocket'],
      path: '/chatSocket',
    });
    setRoom(room);
    setName(name)
    socket.emit('join', { name, room }, () => {
    });
    return () => {
      // socket.emit('disconnect', () => {
      //   console.log('end')
      // });
      // socket.off()
      socket.disconnect()

    }
  }, []
    //  [ENDPOINT, location.search]
  );
  console.log(messages)
  useEffect(() => {
    socket.on('message', (message) => {
      setMessages((messages) => [...messages, message]);
    });
    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });
    socket.on('newTokens', ({ accessToken, refreshToken }) => {
      // cd.remove("refreshToken")
      cd.save("refreshToken", refreshToken, { maxAge: 60 * 24 });
      cd.save("accessToken", accessToken, { maxAge: 10 });

    })
    // const result = api.test(document.cookie)
  }, []);

  const sendMessage = (event) => {
    event.preventDefault();

    if (message) {
      socket.emit('sendMessage', { message, cookies: document.cookie }, () => setMessage(''));
    }
  }
  return (
    <div className="outerContainer">
      <div className="container">
        <InfoBar room={room} />
        <Messages messages={messages} name={name} />
        <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />

      </div>
      <TextContainer users={users} />
    </div>

  );
}

export default Chat;