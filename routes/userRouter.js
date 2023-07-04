import Router from 'express'
const router = new Router()
import userController from '../controllers/userController.js'

router.post('/registration', userController.registration)
router.post('/login', userController.login)
router.get('/auth', userController.check)

export default router
