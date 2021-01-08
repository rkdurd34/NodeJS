
const users = []

const addUser = ({ id, name, room }) => {
  name = name.trim().toLowerCase()
  rooom = room.trim().toLowerCase()

  const existingUser = users.find((user) => user.room === room && user.name === name)

  if (existingUser) {
    return { error: "username is taken" }
  }
  const user = { id, name, room };
  users.push(user);
  console.log(users)
  return { user }
}
const removeUser = (id) => {

  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    console.log(`${users[index].name} has left`)

    return users.splice(index, 1)[0];
  }
}
const getUser = (id) => {
  return users.find((user) => user.id === id)
}
const getUsersInRoom = (room) => {
  return users.filter((user) => user.room === room)
}
module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom
}






var userIdCheck = RegExp(/^[A-Za-z0-9_\-]{5,20}$/);
var passwdCheck = RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^*()\-_=+\\\|\[\]{};:\'",.<>\/?]).{8,16}$/);
var nameCheck = RegExp(/^[가-힣]{2,6}$/);
var nickNameCheck = RegExp(/^[가-힣a-zA-Z0-9]{2,10}$/);
var emailCheck = RegExp(/^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/);
var birthdayCheck = RegExp(/^(19|20)[0-9]{2}(0[1-9]|1[1-2])(0[1-9]|[1-2][0-9]|3[0-1])$/);
var phonNumberCheck = RegExp(/^01[0179][0-9]{7,8}$/);