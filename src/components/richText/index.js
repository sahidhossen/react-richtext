import React, { Fragment } from 'react';
import { Editor, getEventTransfer } from 'slate-react';
import {SoftBreak} from './plugins'
import InlineToolbar from './InlineToolbar';
import { html, hasBlock, parsePlainContent, filterOnlyMarkup } from './to-dom';
import { ENTER, SHIFT } from './keycodes';
import { BLOCK_TAGS } from './marks';

// const { getSelection } = window.frames['sp-pagebuilder-view'].window;
const { getSelection } = window;


class RichText extends React.Component {
    constructor (props) {
      super(props)

      let value = props.value;
      let tag = typeof props.tag === 'undefined' ? 'div' : props.tag
      if( typeof props.multiline !== 'undefined' && props.multiline === false ){
        value = parsePlainContent(value, tag)
      }
      
      this.state = {
        value: html.deserialize(value),
        content: value,
        multiline: typeof props.multiline === 'undefined' ? true : props.multiline,
        tag: tag
      }

      this.plugins = [
        SoftBreak({ multiline: this.state.multiline })
      ]

      this.updateMenu = this.updateMenu.bind(this)

    }
    
     /**
     * On update, update the menu.
     */

    componentDidMount() {
      this.updateMenu()
    }
 
    componentDidUpdate() {
      this.updateMenu()
    }

    /**
     * Update the menu's absolute position.
     */

    updateMenu() {
      const menu = this.menu
      if (!menu) return
      
      const { value } = this.state
      const { fragment, selection } = value
      if (selection.isBlurred || selection.isCollapsed || fragment.text === '') {
        return
      }
      
      const native = getSelection()
      const range = native.getRangeAt(0)
      const rect = range.getBoundingClientRect()
      // const iwindow = window.frames['sp-pagebuilder-view'].window
      const iwindow = window;
      
      const top =  rect.top + iwindow.pageYOffset - menu.offsetHeight;
      const left = rect.left + iwindow.pageXOffset - menu.offsetWidth / 2 + rect.width / 2;

      menu.style.opacity = 1
      menu.style.top = `${top}px`
      menu.style.left = `${left}px`
    }

    setRef(node){
      if ( node ) {
        this.menu = node;
      } else {
        delete this.menu;
      }
    }

    /**
     * Render the editor.
     *
     * @param {Object} props
     * @param {Function} next
     * @return {Element}
     */

    renderEditor(props, editor, next){
      const children = next()
      return (
        <Fragment>
          {children}
          {<InlineToolbar setRef={this.setRef.bind(this)} editor={editor} /> }
        </Fragment>
      )
    }

    /**
     * Render a Slate mark.
     *
     * @param {Object} props
     * @param {Editor} editor
     * @param {Function} next
     * @return {Element}
     */

    renderMark (props, editor, next) {
      const { children, mark, attributes } = props
      switch (mark.type) {
        case 'bold':
          return <strong {...attributes}>{children}</strong>
        case 'italic':
          return <em {...attributes}>{children}</em>
        case 'underlined':
          return <u {...attributes}>{children}</u>
        case 'code':
          return <code {...attributes}>{children}</code>
        case 'strikethrough':
          return <s {...attributes}>{children}</s>
        default:
          return next()
      }
    }

    /**
     * 
     * @param {Object} props 
     * @param {Object} editor 
     * @param {*} next 
     */
    renderNode(props, editor, next){
        const { children, attributes, node } = props
        switch (node.type) {
          case 'code':
            return (
              <pre>
                <code {...attributes}>{children}</code>
              </pre>
            )
          case 'div':
            return <div {...attributes} className={node.data.get('className')}>{children}</div>
          case 'paragraph':
            return <p {...attributes} className={node.data.get('className')}>{children}</p>
          case 'quote':
            return <blockquote {...attributes}>{children}</blockquote>
          case 'bulleted-list':
            return <ul {...attributes}>{children}</ul>
          case 'list-item':
            return <li {...attributes}>{children}</li>
          case 'numbered-list':
            return <ol {...attributes}>{children}</ol>
          case 'h1':
            return <h1 {...attributes}>{children}</h1>
          case 'h2':
            return <h2 {...attributes}>{children}</h2>
          case 'h3':
            return <h3 {...attributes}>{children}</h3>
          case 'h4':
            return <h4 {...attributes}>{children}</h4>
          case 'h5':
            return <h5 {...attributes}>{children}</h5>
          case 'h6':
            return <h6 {...attributes}>{children}</h6>
          default:
            return next()
      }
    }


    /**
     * Render inline block.
     *
     * @param {Object} props
     * @return {Element}
     */

    renderInline(props, editor, next){
      const { attributes, children, node } = props

      switch (node.type) {
        case 'span':
            return <span style={node.data.get('style')} {...attributes}>{children}</span>
        case 'link':
          const { data } = node
          const href = data.get('href')
          return (
            <a href={href} {...attributes}>
              {children}
            </a>
          )
        default:
          return next()
      }
    }

    /**
     * On change.
     *
     * @param {Editor} editor
     */

    onChange ({ value }){
      let { content, tag } = this.state;
      if (value.document != this.state.value.document) {
        content = html.serialize(value)
        console.log("content: ", content, value)
        if( this.props.multiline === false ){
          content = parsePlainContent(content, tag)
          // value = html.deserialize( content )
        }
      }
      
      this.setState({ value, content })
      this.props.onChange(content)
    }

    /**
     * Break the ul or ol if someone press (enter+shift) and use paragraph tag 
     * Or just pass the next() for next events
     *  
     * Later: 
     * 
     * if props.inline true then hold enter key
     * @param {object} event 
     * @param {object} editor 
     * @param {func} next 
     */
    onKeyDown(event, editor, next){
      console.log("key", event.keyCode)
      if( event.keyCode === ENTER ){
         
          return next()
      } else {
        return next()
      }
      event.preventDefault()

    }

    /**
     * Past normal html or fragment text from outside or self component
     * 
     * Later:  will be filter more for ignore other html
     * @param {object} event 
     * @param {object} editor 
     * @param {func} next 
     */
    onPaste(event, editor, next){
      const transfer = getEventTransfer(event)
      if (transfer.type !== 'html') { 
        return next()
      }
      const { document } = html.deserialize(transfer.html)
      editor.insertFragment(document)
    }

     /**
     * Render.
     *
     * @return {Element}
     */

    render() {
      let { placeholder } = this.props 
      placeholder = typeof placeholder === 'undefined' ? 'Write paragraph...' : placeholder
      
      return (
          <Editor
            placeholder={placeholder}
            value={this.state.value}
            onKeyDown={this.onKeyDown.bind(this)}
            onChange={this.onChange.bind(this)}
            onPaste={this.onPaste.bind(this)}
            renderEditor={this.renderEditor.bind(this)}
            renderBlock={this.renderNode.bind(this)}
            renderMark={this.renderMark.bind(this)}
            renderInline={this.renderInline.bind(this)}
            plugins={this.plugins}
          />
          
      )
    }
  }
  export default RichText;