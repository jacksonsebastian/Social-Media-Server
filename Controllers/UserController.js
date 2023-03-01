import userModel from "../Models/userModel.js";
import bcrypt from 'bcrypt'
// get user form data

export const getUser = async(req, res) => {
    const id = req.params.id;

    try{
        const user = await userModel.findById(id);

        if(user){
           const {password, ...otherDetails} = user._doc
           res.status(200).json(otherDetails)
        }
        else{
            res.status(404).json("No such user results")
        }
    }catch (error) {
        res.status(500).json(error)
    }
}

// Update a user

export const updateUser = async(req, res) => {
    const id = req.params.id
    const {currentUserId, currentUserAdminStatus, password} = req.body

    if(id === currentUserId || currentUserAdminStatus){
        try {

            if(password){
                const salt = await bcrypt.genSalt(10)
                req.body.password = await bcrypt.hash(password, salt)
            }
            const user = await userModel.findByIdAndUpdate(id, req.body, {new: true})

            res.status(200).json(user)
        } catch (error) {
            res.status(500).json(error)
        }
    }

    else {
        res.status(403).json("Acess denied! you can only update your own profile")
    }
}

// Delete User

export const deleteUser = async (req, res) => {
    const id = req.params.id
    const {currentUserId, currentUserAdminStatus} = req.body

    if (currentUserId === id || currentUserAdminStatus) {
        try {
            await userModel.findByIdAndDelete(id)
            res.status(200).json("User deleted successfully")
        } catch (error) {
            res.status(500).json(error)
        }
    }
    else {
        res.status(403).json("Acess denied! you can only update your own profile")
    }
} 

// Follow a user

export const followers = async(req, res)=>{
    const id = req.params.id;
    const {currentUserId} = req.body
    if(currentUserId === id) {
        res.status(403).json("Action Forbidden")
    } else {
        try {
            const followUser = await userModel.findById(id)
            const followingUser = await userModel.findById(currentUserId)

            if(!followUser.followers.includes(currentUserId)){
                await followUser.updateOne({$push : {followers: currentUserId}})
                await followingUser.updateOne({$push : {following: id}})
                res.status(200).json("User followed!")
            }else {
                res.status(403).json("User Already followed you")
            }
        } catch (error) {
            res.status(500).json(error)
        }
    }
} 

// UnFollow user
export const unFollowerUser = async(req, res)=>{
    const id = req.params.id;
    const {currentUserId} = req.body
    if(currentUserId === id) {
        res.status(403).json("Action Forbidden")
    } else {
        try {
            const followUser = await userModel.findById(id)
            const followingUser = await userModel.findById(currentUserId)

            if(followUser.followers.includes(currentUserId)){
                await followUser.updateOne({$pull : {followers: currentUserId}})
                await followingUser.updateOne({$pull : {following: id}})
                res.status(200).json("User unfollowed!")
            }else {
                res.status(403).json("User Already not followed you")
            }
        } catch (error) {
            res.status(500).json(error)
        }
    }
} 
