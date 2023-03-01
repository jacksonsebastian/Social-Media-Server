import express from 'express'
import { deleteUser, followers, getUser, unFollowerUser, updateUser } from '../Controllers/UserController.js'


const router = express.Router()


router.get('/:id', getUser)
router.put('/:id', updateUser)
router.delete('/:id', deleteUser)
router.put('/:id/follow', followers)
router.put('/:id/unfollow', unFollowerUser)
export default router