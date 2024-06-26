import React from 'react'
import './Header.css'

export default function Header({ message }) {
  return (
    <h1 id="header-comp">{message}</h1>
  )
}