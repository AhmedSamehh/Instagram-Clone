const express = require("express")
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const {JWT_KEY} = require('../config/keys')
const requireLogin = require("../middleware/requireLogin")

router.get('/protected',requireLogin, (req,res)=>{
    res.send("Hello user")
})

router.post('/signup', (req,res)=>{
    const {name, email, password, url} = req.body
    if(!name||!password||!email){
        return res.status(400).send({error:'Please fill required fields'})
    }
    User.findOne({email})
    .then((existUser)=>{
        if(existUser){
            return res.status(400).send({error:'This E-mail already used by another user'})
        }
        bcrypt.hash(password,12)
        .then((hashedPassword)=>{
            const user = new User({email,password:hashedPassword,name,url})
            user.save().then((user)=>{
                res.send(user)
            })
            .catch((e)=>{
                console.log(e)
            })
        })
    })
    .catch((e)=>{
        console.log(e)
    })
})

router.post('/login', (req,res)=>{
    const {email,password} = req.body
    if(!password||!email){
        return res.status(400).json({error:'Please Provide Email or Password'})
    }
    User.findOne({email})
    .then((existUser)=>{
        if(!existUser){
            return res.status(400).json({error:'Invalid Email or Password'})
        }
        bcrypt.compare(password,existUser.password)
        .then((doMatch)=>{
            if(doMatch){
                const token = jwt.sign({_id:existUser._id},JWT_KEY)
                const {_id, name, email, followers, following, url} = existUser
                return res.send({token, user:{_id, name, email, followers, following, url}})
            }
            else{
                return res.status(400).json({error:'Invalid Email or Password'})
            }
        })
        .catch(e=>{

        })
    })
    .catch((e)=>{
        console.log(e)
    })
})

module.exports = router