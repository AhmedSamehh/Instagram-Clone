import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { UserContext } from '../../App'

const Profile = () => {
    const [userProfile, setuserProfile] = useState(null)
    
    const {state, dispatch} = useContext(UserContext)
    const {userId} = useParams()
    const [showFollow, setShowFollow] = useState(state? !state.following.includes(userId) : true)
    const headers = {
        "Authorization":"Bearer "+ localStorage.getItem("jwt")
    }
    useEffect(()=>{
        axios.get(`/user/${userId}`)
        .then(response=>{
            setuserProfile(response.data)
            const loggedId = JSON.parse(localStorage.getItem("user"))._id

            if(response.data.user.followers.includes(loggedId)){
                setShowFollow(false)
            }
        }).catch(err=>{
            console.log(err)
        })
    },[])
    const followUser = () =>{ 
        axios.put('/follow', {followedId:userId}, {headers})
        .then(response=>{
            dispatch({type:"UPDATE", payload:{following:response.data.following,followers:response.data.followers}})
            localStorage.setItem("user", JSON.stringify(response.data))
            setuserProfile(prevState=>{
                
                return{
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers:[...prevState.user.followers, response.data._id]
                    }
                }
            })
            setShowFollow(false)
        }).catch(e=>{
           console.log(e) 
        })
    }
    const unfollowUser = () =>{ 
        axios.put('/unfollow', {unfollowedId:userId}, {headers})
        .then(response=>{
            dispatch({type:"UPDATE", payload:{following:response.data.following,followers:response.data.followers}})
            localStorage.setItem("user", JSON.stringify(response.data))
            setuserProfile(prevState=>{
                const newFollowers = prevState.user.followers.filter(item=> item!==response.data._id)
                return{
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers:newFollowers
                    }
                }
                
            })
            setShowFollow(true)
        }).catch(e=>{
           console.log(e) 
        })
    }
    return(
        <>
        {userProfile ? 
        <div style={{maxWidth:"750px",margin:"20px auto"}}>
            <div style={{
                    textAlign:"center",
                    display:"flex",
                    justifyContent:"space-around",
                    margin:'18px 0px',
                    borderBottom:"1px solid gray"}}>
                <div>
                    <img style={{width:"140px",height:"140px",borderRadius:"50%"}} 
                    src={userProfile.user.url}/>
                </div>
                <div>
                    <h4>{userProfile.user.name}</h4>
                    <div style={{
                    display:"flex", width:"108%",
                    justifyContent:"space-between"}}>
                        <h6>{userProfile.posts.length}<p>Posts</p></h6>
                        <h6>{userProfile.user.followers.length}<p>Followers</p></h6>
                        <h6>{userProfile.user.following.length}<p>Following</p></h6>
                    </div>
                    {
                        showFollow?
                        <button style={{marginBottom:"10px"}} onClick={()=>followUser()} className="btn blue" type="submit" name="action">Follow</button>
                        :<button style={{marginBottom:"10px"}} onClick={()=>unfollowUser()} className="btn blue" type="submit" name="action">Unfollow</button>
                    }
                    
                    
                </div>
            </div>
            <div className="gallery">{
                userProfile.posts.map(post=>{
                    return(
                            <img key={post._id} className="item" alt={post.title} src={post.photo}/>
                        )
                    })
                }
            </div>
        </div> 
        : <h2>Loading..</h2>}
        </>
    )
}
export default Profile