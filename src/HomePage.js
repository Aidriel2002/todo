import React from 'react'
import SignIn from './components/auth/SignIn'
import { FaGithub, FaFacebook, FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa';
import './Footer.css'

function HomePage() {
  return (
    <>
                <SignIn/>
                <footer>
                    <div className="footer-content">
                        <h3>NielDo</h3>
                        <p>Hello World! I'm Dexter Niel Aidriel D. Basergo currently studying <br/>BSIT at St. Peters's College</p>
                        <div className="social-icons">      
                                <a href="https://github.com/Aidriel2002" target="_blank"  rel="noreferrer"><FaGithub /></a>
                                <a href="https://www.facebook.com/aidrieeel"  target="_blank"  rel="noreferrer"><FaFacebook /></a>
                                <a href="https://www.instagram.com/"  target="_blank" rel="noreferrer"><FaInstagram /></a>
                                <a href="https://www.tiktok.com/@aidrieeel"  target="_blank" rel="noreferrer"><FaTiktok /></a>
                                <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"  target="_blank" rel="noreferrer"><FaYoutube /></a> 
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>copyright &copy;2023 Todo App. All rights reserved.</p>
                    </div>
                </footer>
    </>
  )
}

export default HomePage