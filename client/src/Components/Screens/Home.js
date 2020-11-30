import React, {useState, useEffect, useContext} from 'react'
import axios from 'axios'
import {UserContext} from '../../App'
import { Link } from 'react-router-dom'

const Home = () => {
    const {state, dispatch} = useContext(UserContext)
    const [data, setData] = useState([])
     const headers = {
        "Authorization":"Bearer "+ localStorage.getItem("jwt")
    }
    useEffect(()=>{
        axios.get('/allposts', {headers})
        .then(response=>{
            console.log(response.data.posts)
            setData(response.data.posts)
        })
        .catch(error=>{
            console.log(error)
        })
    }, [])
    const likePost = (postId) =>{
        axios.put('/like', {postId}, {headers})
        .then(response=>{
            console.log(response)
            const newData = data.map(item=>{
                if(item._id == response.data._id){
                    return response.data
                }else{
                    return item
                }
            })
            setData(newData)
        }).catch(err=>{
            console.log(err)
        })
    }
    const unlikePost = (postId) =>{
        axios.put('/unlike', {postId}, {headers})
        .then(response=>{
            const newData = data.map(item=>{
                if(item._id == response.data._id){
                    return response.data
                }else{
                    return item
                }
            })
            setData(newData)
        }).catch(err=>{
            console.log(err)
        })
    }
    const addComment = (text, postId) =>{
        axios.put('/comment', {text, postId}, {headers})
        .then(response=>{
            console.log(response)
            const newData = data.map(item=>{
                if(item._id == response.data._id){
                    return response.data
                }else{
                    return item
                }
            })
            setData(newData)
        }).catch(err=>{
            console.log(err)
        })
    }
    const deletePost = (postId) =>{
        if(window.confirm("Are you sure you want to delete this post?")) {
            axios.delete(`/deletepost/${postId}`,{headers})
            .then(response=>{
                console.log(response)
                const newData = data.filter(item=>{
                    return item._id !== response.data.result._id
                })
                setData(newData)
            }).catch(e=>{
                console.log(e)
            })
        }
        
    }
    return(<>
    {state !=null?
    <div className="home">
        {
            data.map(item=>{
                return(
                    <div key={item._id} className="card home-card">
                        <h5>
                            <Link to={item.postedBy._id != state._id? "/profile/"+item.postedBy._id:"/profile"}>
                                <img style={{height:'40px',verticalAlign:'middle',width:'40px',borderRadius:'50%'}} src={item.postedBy.url}/>
                                <span style={{verticalAlign:'middle',marginLeft:'8px'}}>{item.postedBy.name}</span>
                            </Link> 
                            {item.postedBy._id == state._id &&
                            <i style={{float:"right"}} onClick={()=>{deletePost(item._id)}} className="like material-icons">delete</i>}
                        </h5>
                        <div className="card-image">
                            <img src={item.photo}/>
                        </div>
                        <div className="card-content">
                            {item.likes.includes(state._id) ? 
                            <i onClick={()=>{unlikePost(item._id)}} className="like red-text material-icons">favorite</i>
                            : <i onClick={()=>{likePost(item._id)}} className="like material-icons">favorite</i>}
                            <h6>
                                {item.likes.length} Likes this
                            </h6>
                            
                            <h6><Link to={item.postedBy._id != state._id? "/profile/"+item.postedBy._id:"/profile"} style={{fontWeight:"500"}}>{item.postedBy.name}</Link> {item.title}</h6>
                            <p>{item.body}</p>
                            <div>{item.comments.map(comment=>{
                                return(
                                    <h6 key={comment._id}>
                                        <Link to={comment.postedBy._id != state._id? "/profile/"+comment.postedBy._id:"/profile"} style={{fontWeight:"500"}}>{comment.postedBy.name}</Link> {comment.text}
                                    </h6>
                                )
                            })}</div>
                        </div>
                        <form onSubmit={e=>{
                            e.preventDefault()
                            addComment(e.target[0].value, item._id)
                        }}>
                            <input type="text" placeholder="Add a comment"/>
                        </form>
                    </div>
                )
            })
        }
    </div>
    :<div style={{textAlign:'center'}}>
        <h2 >Welcome to Instagram</h2>
        
        <img height={200} src={require('./insta.png')}/>
        <h5>Please Login to your account</h5>
    </div>}
    </>
    )
}
export default Home