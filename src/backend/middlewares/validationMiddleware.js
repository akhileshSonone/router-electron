import { body } from 'express-validator'

export const userRegistrationValidationRules = [
  body('name')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('User name must be between 3 and 30 characters.')
    .matches(/^[a-zA-Z0-9 ]+$/)
    .withMessage('Username can only contain letters, numbers, and spaces')
    .custom((value) => {
      if (value.startsWith(' ') || value.endsWith(' ')) {
        throw new Error('Username cannot start or end with a space')
      }
      if (value.includes('  ')) {
        throw new Error('Username cannot contain consecutive spaces')
      }
      return true
    })
    .escape(),
  body('email').trim().isEmail().withMessage('Must be a valid email address.').escape(),
  body('password')
    .trim()
    .isLength({ min: 8, max: 24 })
    .withMessage('Password must be 8 to 24 characters long.')
    .matches(/\d/)
    .withMessage('Password must contain a number.')
    .matches(/[A-Z]/)
    .withMessage('Password must contain an uppercase letter.')
    .matches(/[a-z]/)
    .withMessage('Password must contain a lowercase letter.')
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage('Password must contain a special character')
]

export const userLoginValidationRules = [
  body('email').trim().isEmail().withMessage('Must be a valid email address.').escape(),
  body('password')
    .trim()
    .isLength({ min: 8, max: 24 })
    .withMessage('Password must be 8 to 24 characters long.')
    .matches(/\d/)
    .withMessage('Password must contain a number.')
    .matches(/[A-Z]/)
    .withMessage('Password must contain an uppercase letter.')
    .matches(/[a-z]/)
    .withMessage('Password must contain a lowercase letter.')
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage('Password must contain a special character')
]
