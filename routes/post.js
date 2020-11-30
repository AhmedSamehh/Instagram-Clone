const express = require("express")
const Post = require('../models/post')
const requireLogin = require('../middleware/requireLogin')

const router = express.Router()

router.get('/myposts',requireLogin, (req,res)=>{
    Post.find({postedBy:req.user._id}).populate('postedBy','_id name')
    .then(myposts=>{
        res.send({myposts})
    })
    .catch(e=>{
        console.log(e)
    })
})

router.get('/allposts', (req,res)=>{
    Post.find()
    .populate('postedBy','_id name url')
    .populate("comments.postedBy", "_id name url")
    .sort('-createdAt')
    .then(posts=>{
        res.send({posts})
    })
    .catch(e=>[
        console.log(e)
    ])
})

router.get('/subposts', requireLogin, (req,res)=>{
    Post.find({postedBy:req.user.following})
    .populate('postedBy','_id name url')
    .populate("comments.postedBy", "_id name url")
    .sort('-createdAt')
    .then(posts=>{
        res.send({posts})
    })
    .catch(e=>[
        console.log(e)
    ])
})

router.post('/createpost', requireLogin, (req, res) =>{
    const {title, body, url} = req.body
    if(!title||!body ||!url){
        return res.status(400).send({error:'Please fill all the fields'})
    }
    const post = new Post({
        title,
        body,
        photo:url,
        postedBy:req.user
    })
    post.save().then(result =>{
        res.send({post:result})
    })
    .catch(e=>{
        console.log(e)
    })
})

router.put('/like', requireLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id},
    },
    {useFindAndModify: false, new: true})
    .populate('postedBy','_id name url')
    .populate("comments.postedBy", "_id name url")
    .exec((err, result)=>{
        if(err){
            return res.status(422).send({error:err})
        }
        else{
            res.send(result)
        }
    })
})

router.put('/unlike', requireLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}
    },
    {useFindAndModify: false, new: true})
    .populate('postedBy','_id name url')
    .populate("comments.postedBy", "_id name url")
    .exec((err, result)=>{
        if(err){
            return res.status(422).send({error:err})
        }
        else{
            res.send(result)
        }
    })
})
router.put('/comment', requireLogin, (req, res) => {
    const comment = {
        text: req.body.text,
        postedBy: req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment},
    },
    {useFindAndModify: false, new: true})
    .populate('postedBy','_id name url')
    .populate("comments.postedBy", "_id name url")
    .exec((err, result)=>{
        if(err){
            return res.status(422).send({error:err})
        }
        else{
            res.send(result)
        }
    })
})
router.delete('/deletepost/:postId', requireLogin, (req, res)=>{
    Post.findOne({_id:req.params.postId})
    .populate("postedBy", "_id")
    .exec((err, post)=>{
        if(err || !post){
            return res.status(422).send({error: err})
        }
        if(post.postedBy._id.toString() === req.user._id.toString()){
            post.remove()
            .then(result=>{
                res.send({result})
            })
            .catch(e=>{
                console.log(e)
            })
        }
    })
})

module.exports = router