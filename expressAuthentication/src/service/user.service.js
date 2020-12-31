const db = require('../../database')

module.exports = {
  create: async (data, callBack) => {
    console.log('왔는데 아', db)
    const result = await db.query(
      `insert into registeration (email, password)
      values (?,?)`,
      [
        data.email,
        data.password
      ],
      (error, results, fields) => {
        if (error) {
          return callBack(error)
        }
        return callBack(null, results)
      }
    )
  }

}