const { genSaltSync, hashSync, compareSync } = require('bcrypt');

const { create, deleteUser, getUserByUserId, getUsers, updateUser, getUserByUserEmail } = require('../service/user.service')
const { sign } = require('jsonwebtoken')
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
        message: 'created successfully'
      })
    })
  },
  getUserByUserId: (req, res) => {
    const id = req.params.id;
    getUserByUserId(id, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Database Connection error"
        });
      }
      if (!results) {
        return res.status(401).json({
          success: 0,
          message: 'Record not Fpound'
        })
      }
      return res.status(200).json({
        success: 1,
        data: results
      })

    })
  },
  getUsers: (req, res) => {
    getUsers((err, results) => {
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
  updateUser: (req, res) => {
    const body = req.body;
    const salt = genSaltSync(10);
    body.password = hashSync(body.password, salt)
    updateUser(body, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Database Connection error"
        });
      }
      return res.status(200).json({
        success: 1,
        message: "updated successfully"
      })
    })
  },
  deleteUser: (req, res) => {
    const data = { id: req.params.id }
    deleteUser(data, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Database Connection error"
        });
      }
      if (results == 0) {
        return res.status(401).json({
          success: 0,
          message: 'Record not Fpound'
        })
      }
      return res.status(200).json({
        success: 1,
        message: 'user deleted successfully'
      })
    })
  },
  login: (req, res) => {
    const body = req.body
    getUserByUserEmail(body.email, (err, results) => {
      if (err) {
        console.log(err)
      }
      if (!results) {
        return res.json({
          success: 0,
          data: 'invalid email or password'
        })
      }
      const result = compareSync(body.password, results.password.toString('utf8'))
      if (result) {
        results.password = undefined;
        const jsontoken = sign({ result: results }, "qwe1234", {
          expiresIn: "1h"
        })
        return res.json({
          success: 1,
          message: "login successfully",
          token: jsontoken
        });
      } else {
        return res.json({
          success: 0,
          data: "invalid email or password"
        })
      }
    })
  },
  login: (req, res) => {
    const body = req.body
    getUserByUserEmail(body.email, (err, results) => {
      if (err) {
        console.log(err)
      }
      if (!results) {
        return res.json({
          success: 0,
          data: 'invalid email or password'
        })
      }
      const result = compareSync(body.password, results.password.toString('utf8'))
      if (result) {
        results.password = undefined;
        const jsontoken = sign({ result: results }, process.env.ACCESS_SECRET_KEY, {
          expiresIn: "1h"
        })
        return res.json({
          success: 1,
          message: "login successfully",
          token: jsontoken
        });
      } else {
        return res.json({
          success: 0,
          data: "invalid email or password"
        })
      }
    })
  },

}