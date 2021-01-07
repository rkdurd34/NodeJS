import React, { useState } from 'react';
import { Link } from "react-router-dom";
import api from '../../api'
import './Join.css';
import { useHistory } from "react-router-dom";

export default function SignIn() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [room, setRoom] = useState('');
  const history = useHistory()

  const handleLogin = async (e) => {

    try {
      const result = await api.login({ email: name, password: password })
      history.push(`/chat?name=${name}&room=${room}`);
    } catch (err) {
      alert('잘못된 아이디')
    }


  }
  return (
    <div className="joinOuterContainer">
      <div className="joinInnerContainer">
        <h1 className="heading">Join</h1>
        <div>
          <input placeholder="Name" className="joinInput" type="text" onChange={(event) => setName(event.target.value)} />
        </div>
        <div>
          <input placeholder="Password" className="joinInput" type="password" onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <div>
          <input placeholder="Room" className="joinInput mt-20" type="text"
            onChange={(event) => setRoom(event.target.value)}
          />
        </div>
        {/* <Link
          onClick={e => (!name || !room || !password) ? e.preventDefault() : handleLogin()} to={`/chat?name=${name}&room=${room}`}>
          <button id={"enterButton"} className={'button mt-20'} type="submit">Sign In</button>
        </Link> */}
        <button id={"enterButton"} className={'button mt-20'} type="submit" onClick={e => (!name || !room || !password) ? e.preventDefault() : handleLogin()} >Sign In</button>
      </div>
    </div>
  );
}