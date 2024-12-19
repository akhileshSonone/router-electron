import { Router } from 'express'

import { createUser, loginUser } from '../controllers/userController.js'
import {
  userLoginValidationRules,
  userRegistrationValidationRules
} from '../middlewares/validationMiddleware.js'

export const UserRouter = Router()

UserRouter.post('/login', userLoginValidationRules, loginUser)
UserRouter.post('/register', userRegistrationValidationRules, createUser)
