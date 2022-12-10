const { body } = require('express-validator')
const { User } = require('../models')

module.exports = {
  registerValidator: [
    body('account').isLength({ min: 4, max: 30 }).withMessage('Error: 帳號無效')
      .bail().custom(async account => {
        try {
          const user = await User.findOne({ where: { account } })
          if (user) throw new Error('已經註冊過的帳號')
          return true
        } catch (err) {
          throw new Error(err)
        }
      }),
    body('name').isLength({ min: 1, max: 50 }).withMessage('Error: 名稱無效'),
    body('email').isEmail().withMessage('Error: email無效')
      .bail().custom(async email => {
        try {
          const user = await User.findOne({ where: { email } })
          if (user) throw new Error('已經註冊過的email')
          return true
        } catch (err) {
          throw new Error(err)
        }
      }),
    body('password').not().isEmpty().withMessage('Error: 密碼無效'),
    body('checkPassword').custom((value, { req }) => {
      if (value !== req.body.password) throw new Error('Error: 密碼不同')
      return true
    })
  ]
}