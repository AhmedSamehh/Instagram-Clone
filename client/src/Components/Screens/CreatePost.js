import React, {useState, useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import axios from 'axios'
import M from 'materialize-css'

const CreatePost = () => {
    const history = useHistory()
    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [image, setImage] = useState("")
    const [url, setUrl] = useState("")
    
    const postDetails = () => {
        const data = new FormData()
        data.append("file", image)
        data.append("upload_preset", "instagram-clone")
        data.append("cloud_name", "se7az")
        axios.post('https://api.cloudinary.com/v1_1/se7az/image/upload', data)
        .then(response=>{
           setUrl(response.data.url)
        })
        .catch(error=>{
            console.log(error)
        })
    }

    useEffect(()=>{
        if(url){
            const postData = {
                title,
                body,
                url,
            }
            const headers = {
                "Authorization":"Bearer "+ localStorage.getItem("jwt")
            }
            axios.post('/createpost', postData, {headers})
            .then(function (response) {
                M.toast({html: "Successfully posted", classes:"green"})
                history.push("/")
                console.log(response);
            })
            .catch(function (error) {
                M.toast({html: error.response.data.error, classes:"red"})
                console.log(error.response.data.error)
            })
        }
    }, [url,body,title,history])
    return(
        <div className="create-post card">
            <h5>Write your own post</h5>
            <input onChange={e=>setTitle(e.target.value)} value={title} placeholder="Caption" type="text" />
            <input onChange={e=>setBody(e.target.value)} value={body} placeholder="Description" type="text" />
            <div className="file-field input-field">
                <div className="btn blue">
                    <span>Upload image</span>
                    <input onChange={e=>setImage(e.target.files[0])} type="file"/>
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text"/>
                </div>
            </div>
            <button onClick={() => postDetails()} className="btn blue" type="submit" name="action">Post!</button>
        </div>
    )
}

export default CreatePost