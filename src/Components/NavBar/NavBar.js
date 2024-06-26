import React from 'react'
import { NavLink } from "react-router-dom"
import "./NavBar.css"



export default function Navbar(){
    return(

        <nav id="nav-main">
            <ul>
                <li>
                    <NavLink className="nav-link-main" to="/">Home / Upload</NavLink>
                </li>
                <li>
                    <NavLink className="nav-link-main" to="/installer">Installer Data</NavLink>
                </li>
                <li>
                    <NavLink className="nav-link-main" to="/lot">Lot Data</NavLink>
                </li>
            </ul>
        </nav>


    );
}