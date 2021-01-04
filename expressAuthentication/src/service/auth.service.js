
const db = require('../../database')

module.exports = {
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
  getUserByUserEmail: (email, callBack) => {
    db.query(
      `select * from registeration where email = ?`,
      [email],
      (error, results, field) => {
        if (error) {
          callBack(error);
        }
        console.log(results[0].password.toString('utf8'))
        return callBack(null, results[0])
      }
    )
  },

}