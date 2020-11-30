const express = require("express")
const Post = require('../models/post')
const User = require('../models/user')
const requireLogin = require('../middleware/requireLogin')
const router = express.Router()

router.get('/user/:id', (req, res)=>{
    User.findOne({_id:req.params.id}).select("-password")
    .then(user=>{
        Post.find({postedBy:req.params.id})
        .populate("postedBy", "_id name")
        .exec((err, posts)=>{
            if(err){
                return res.status(422).send({error:err})
            }
            res.send({user, posts})
        })
    })
    .catch(e=>{
        return res.status(404).send({error:'User not found'})
    })
})

router.put('/follow', requireLogin, (req, res) =>{
    User.findByIdAndUpdate(req.body.followedId,{
        $push:{followers:req.user._id}
    }, {new:true},
    (err, result)=>{
        if(err){
            return res.status(422).send({error:err})
        }
        User.findByIdAndUpdate(req.user._id ,{
            $push:{following:req.body.followedId}
        }, {new: true}).select("-password").then(result=>{
            res.send(result)
        }).catch(e=>{
            res.status(422).send({error:e})
        })
    })
})

router.put('/unfollow', requireLogin, (req, res) =>{
    User.findByIdAndUpdate(req.body.unfollowedId,{
        $pull:{followers:req.user._id}
    }, {new:true},
    (err, result)=>{
        if(err){
            return res.status(422).send({error:err})
        }
        User.findByIdAndUpdate(req.user._id ,{
            $pull:{following:req.body.unfollowedId}
        }, {new: true}).select("-password").then(result=>{
            res.send(result)
        }).catch(e=>{
            res.status(422).send({error:e})
        })
    })
})

router.put('/updatepp', requireLogin, (req, res) =>{
    User.findByIdAndUpdate(req.user._id, {
        $set:{url:req.body.url}
    }, {new:true}, (err, result)=>{
        if(err){
            return res.status(422).send({error:"Cannot update picture"})
        }
        res.send(result)
    })
})

module.exports = router