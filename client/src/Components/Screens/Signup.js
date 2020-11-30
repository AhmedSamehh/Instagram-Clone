import React, { useState, useEffect } from 'react'
import {Link, useHistory} from 'react-router-dom'
import M from 'materialize-css'

const axios = require('axios');

const Signup = () => {
    const history = useHistory()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [image, setImage] = useState("")
    const [url, setUrl] = useState(undefined)

    // useEffect(()=>{
    //    uploadFields()
    // }, [url])

    const emailRegx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$|^$/
    
    const uploadPic = () => {
        if(!name||!password||!email){
            document.getElementById('loader').style.display = 'none'
            return M.toast({html: "Please Fill all the fields", classes:"red"})
        }
        if(!emailRegx.test(email)){
            document.getElementById('loader').style.display = 'none'
            return M.toast({html: "Please choose a valid Email", classes:"red"})            
        }
        const data = new FormData()
        data.append("file", image)
        data.append("upload_preset", "instagram-clone")
        data.append("cloud_name", "se7az")
        axios.post('https://api.cloudinary.com/v1_1/se7az/image/upload', data)
        .then(response=>{
           setUrl(response.data.url)
           uploadFields()
        })
        .catch(error=>{
            console.log(error)
        })
    }
    const uploadFields = () =>{
        const signupData = {
            name,
            email,
            password,
            url
        }        
        axios.post('/signup', signupData)
        .then(function (response) {
            M.toast({html: "Successfully signed up", classes:"green"})
            console.log(response);
            history.push('/login')
        })
        .catch(function (error) {
            document.getElementById('loader').style.display = 'none'
            M.toast({html: error.response.data.error, classes:"red"})
        })
    }
    
    const postData = () =>{
        document.getElementById('loader').style.display = 'block'
        if(image){
            uploadPic()
        }else{
            uploadFields()
        }
    }
    return(
        <div className="my-card">
            <div className="card auth-card">
            <div style={{display:'none'}} id="loader" className="progress">
                <div className="indeterminate blue"></div>
            </div>
                <h2 className="brand-logo">Instagram</h2>
                <input onChange={(e)=>setEmail(e.target.value)} value={email} type="text" placeholder="Email"></input>
                <input onChange={(e)=>setName(e.target.value)} value={name} type="text" placeholder="Username"></input>
                <input onChange={(e)=>setPassword(e.target.value)} value={password} type="password" placeholder="Password"></input>
                <div className="file-field input-field">
                    <div className="btn blue">
                        <span>Upload profile picture</span>
                        <input onChange={e=>setImage(e.target.files[0])} type="file"/>
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text"/>
                    </div>
                </div>
                <button onClick={() => postData()} className="btn blue" type="submit" name="action">Signup</button>
                <h6><Link to="/login">Already a member?!</Link></h6>
            </div>
        </div>
    )
}
export default Signup