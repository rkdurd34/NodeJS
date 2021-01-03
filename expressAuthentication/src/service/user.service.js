
const db = require('../../database')

module.exports = {
  // create: async (data, callBack) => {
  //   try {
  //     const [result] = await db.query(
  //       `insert into registeration (email, password,lastName)
  //       values (?,?,?)`,
  //       [
  //         data.email,
  //         data.password,
  //         data.lastname
  //       ])
  //     callBack(null, result)
  //   } catch (err) {
  //     if (err) {
  //       callBack(err)
  //     }
  //   }
  // },
  create: (data, callBack) => {
    db.query(
      `insert into registeration (firstName, lastName, gender, email, password, number)
        values (?,?,?,?,?,?)`,
      [
        data.firstName,
        data.lastName,
        data.gender,
        data.email,
        data.password,
        data.number
      ],
      (error, results, fields) => {
        if (error) {
          return callBack(error)
        }
        return callBack(null, results)
      }
    )

  },
  getUsers: (callBack) => {
    db.query(
      'select id, firstname, lastname,email, password from registration',
      [],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results)
      }
    )
  },
  getUserByUserId: (id, callBack) => {
    db.query(
      'select id, firstname,lastname,gender,email, password,number from registration where id = ?',
      [id],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results[0])
      }
    )
  },
  updateUser: (data, callBack) => {
    db.query(
      'update reigsteration set firstname = ?, lastName = ?, gender = ?, email = ?, password = ?, number = ? where id = ?',
      [
        data.firstName,
        data.lastName,
        data.gender,
        data.email,
        data.password,
        data.number,
        data.id
      ],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results[0])
      }
    )
  },
  deleteUser: (data, callBack) => {
    db.quert(
      'delete from registration where id = ?',
      [data.id],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results[0])
      }

    )
  }
 }