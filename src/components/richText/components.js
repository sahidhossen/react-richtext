import React from 'react'

export const Button = ( props ) => {
    const active =  props.active ? 'inline-active-btn' : ''
    return <span className={`sppb-inilne-editor-btn ${active}`}> {props.children} </span>
}

export const Icon = ({className, ...rest}) => {
    return <span className={`material-icons ${className}`} {...rest}/>
}