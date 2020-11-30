const jwt = require("jsonwebtoken")
const { JWT_KEY } = require("../config/keys")
const User = require('../models/user')


module.exports = (req,res,next)=>{
    const {authorization} = req.headers
    if(!authorization){
        return res.status(401).send({error:'You must be logged in'})
    }
    const token = authorization.replace('Bearer ','')
    jwt.verify(token, JWT_KEY, (error, payload)=>{
        if(error){
            return res.status(401).send({error:'You must be logged in'})
        }
        const {_id} = payload
        User.findById(_id).then(userData => {
            req.user = userData
            next()
        })
    }) 
}