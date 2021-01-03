const { genSaltSync, hashSync } = require('bcrypt');

const { create } = require('../service/user.service')

module.exports = {
  createUser: (req, res) => {
    const body = req.body;
    const salt = genSaltSync(10);
    body.password = hashSync(body.password, salt)
    create(body, (err, results) => {
      console.log('왜안오지');
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Database Connection error"
        });
      }
      return res.status(200).json({
        success: 1,
        data: results
      })
    })
  },

}

