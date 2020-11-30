import React, {useState, useContext} from 'react'
import {Link, useHistory} from 'react-router-dom'
import M from 'materialize-css'
import {UserContext} from '../../App'

const axios = require('axios')

const Login = () => {
    const {state, dispatch} = useContext(UserContext)
    const history = useHistory()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const emailRegx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$|^$/

    const loginData = {
        email,
        password,
    }
    const postData = () =>{
        document.getElementById('loader').style.display = 'block'
        if(!emailRegx.test(email)){
            return M.toast({html: "Please choose a valid Email", classes:"red"})
        }
        axios.post('/login', loginData)
        .then( response => {
            localStorage.setItem("jwt", response.data.token)
            localStorage.setItem("user", JSON.stringify(response.data.user))
            dispatch({type:"USER", payload:response.data.user})
            M.toast({html: "Successfully logged in", classes:"green"})
            console.log(response)
            history.push('/')
        })
        .catch(error => {
            document.getElementById('loader').style.display = 'none'
            M.toast({html: error.response.data.error, classes:"red"})
        })
    }
    return(
        <div className="my-card">
            <div className="card auth-card">
                <div style={{display:'none'}} id="loader" className="progress">
                    <div className="indeterminate blue"></div>
                </div>
                <h2 className="brand-logo">Instagram</h2>
                <input onChange={(e)=>setEmail(e.target.value)} value={email} type="text" placeholder="Email"></input>
                <input onChange={(e)=>setPassword(e.target.value)} value={password} type="password" placeholder="Password"></input>
                <button onClick={()=>postData()} className="btn blue" type="submit" name="action">Login</button>
                <h6><Link to="/signup">Doesn't have an account?!</Link></h6>
            </div>
        </div>
    )
}
export default Login