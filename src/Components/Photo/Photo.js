import React from 'react'
import "./Photo.css"

export default function Photo({ source, id, alt }) {
  return (
    <img id={id} src={source} alt={alt} />
  )
}