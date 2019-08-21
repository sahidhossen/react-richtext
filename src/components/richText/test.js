import React from 'react'
export const Button = ( props ) => {
    const active =  props.active ? 'inline-active-btn' : ''
    return <span className={`sppb-inilne-editor-btn ${active}`}> </span>
}