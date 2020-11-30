import React, { useContext } from 'react'
import {Link, useHistory} from 'react-router-dom'
import '../App.css'
import {UserContext} from '../App'
import M from 'materialize-css'

const Navbar = () =>{
  const {state, dispatch} = useContext(UserContext)
  const history = useHistory()
  const renderList = () =>{
    if(state){
      return [
        
        <li key='1'><Link to="/create" className="nav-item">Create Post</Link></li>,
        <li key='2'><Link to="/followedposts" className="nav-item">People you follow</Link></li>,
        <li key='3'><Link to="/profile" className="nav-item">Profile</Link></li>,
        <li key='4'><button onClick={()=>{
          localStorage.clear()
          dispatch({type:"CLEAR"})
          history.push('/login')
        }} className="btn-small red darken-2 logout-btn" type="submit" name="action">Logout</button></li>
      ]
    }else{
      return [
        <li key='5'><Link to="/login" className="nav-item">Login</Link></li>,
        <li key='6'><Link to="/signup" className="nav-item">Signup</Link></li>
      ]
    }
  }
  document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems);
  });
  return(
  <div>
    <nav>
      <div className="nav-wrapper white">
        <Link to="/" className="brand-logo nav-item left">Insatgram</Link>
        <Link to="" data-target="mobile-demo" className="hide-on-med-and-up sidenav-trigger black-text right"><i className="material-icons">menu</i></Link>
        <ul id="nav-mobile" className="right hide-on-small-and-down">
          {renderList()}
        </ul>
      </div>
    </nav>
    <ul className="sidenav" id="mobile-demo">
      {renderList()}
    </ul>
  </div>
//    <nav>
//    <div class="nav-wrapper white">
//      <a href="#!" class="brand-logo">Logo</a>
//      <a href="#" data-target="mobile-demo" class="sidenav-trigger"><i class="material-icons">menu</i></a>
//      <ul class="right hide-on-med-and-down">
//        <li><a href="sass.html">Sass</a></li>
//        <li><a href="badges.html">Components</a></li>
//        <li><a href="collapsible.html">Javascript</a></li>
//        <li><a href="mobile.html">Mobile</a></li>
//      </ul>
//    </div>
//  </nav>

//  <ul class="sidenav" id="mobile-demo">
//    <li><a href="sass.html">Sass</a></li>
//    <li><a href="badges.html">Components</a></li>
//    <li><a href="collapsible.html">Javascript</a></li>
//    <li><a href="mobile.html">Mobile</a></li>
//  </ul>
  )
}
export default Navbar