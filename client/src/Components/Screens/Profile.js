import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import { UserContext } from '../../App'

const Profile = () => {
    const [posts, setPosts] = useState([])
    const {state, dispatch} = useContext(UserContext)
    const [image, setImage] = useState("")
    const [url, setUrl] = useState("")
    const headers = {
        "Authorization":"Bearer "+ localStorage.getItem("jwt")
    }
    useEffect(()=>{
        axios.get('/myposts', {headers})
        .then(response=>{
            setPosts(response.data.myposts)
        }).catch(err=>{
            console.log(err)
        })
    },[])
    useEffect(()=>{
        if(image){
            const data = new FormData()
            data.append("file", image)
            data.append("upload_preset", "instagram-clone")
            data.append("cloud_name", "se7az")
            axios.post('https://api.cloudinary.com/v1_1/se7az/image/upload', data)
            .then(response=>{
                setUrl(response.data.url)
                localStorage.setItem("user", JSON.stringify({...state,url:response.data.url}))
                dispatch({type:"UPDATEPIC", payload:response.data.url})
                axios.put('/updatepp', {url:response.data.url}, {headers})
                .then(response=>{
                    console.log(response)
                })
                .catch(e=>{
                    console.log(e)
                })
            })
            .catch(error=>{
                console.log(error)
            })
        }
    },[image])

    
    return(
        <>
        {state? 
        <div style={{maxWidth:"750px",margin:"20px auto"}}>
            <div style={{
                    textAlign:"center",
                    display:"flex",
                    justifyContent:"space-around",
                    margin:'18px 0px'}}>
                <div>
                    <img style={{width:"140px",height:"140px",borderRadius:"50%"}} 
                    src={state.url}/>
                </div>
                <div>
                    <h4>{state? state.name: "Loading.."}</h4>
                    <div style={{
                    display:"flex", width:"108%",
                    justifyContent:"space-between"}}>
                        <h6>{posts.length} <p>Posts</p> </h6>
                        <h6>{state.followers.length} <p>Followers</p> </h6>
                        <h6>{state.following.length} <p>Following</p> </h6>
                    </div>
                </div>
                
                
            </div>
            <div style={{margin:'10px'}}>
                <label>Update a profile picture: </label>
                <input onChange={e=>setImage(e.target.files[0])} type="file" accept="image/png, image/jpeg"></input>
            </div>
            
            <div style={{ borderTop:"1px solid gray"}} className="gallery">{
                posts.map(post=>{
                    return(
                            <img key={post._id} className="item" alt={post.title} src={post.photo}/>
                        )
                    })
                }
            </div>
        </div>
        :<h3>Loading</h3>}
        </>
    )
}
export default Profile