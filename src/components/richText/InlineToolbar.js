import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { Icon } from './components';
import { isBlock, transformBlock, hasBlock, hasInline } from './to-dom';
import { headings, colors, BLOCK_TAGS } from './marks'; 
import './style.scss';

export default class InlineToolbar extends React.Component {
  constructor(){
    super();
    this.state = {
      link: false,
      linkValue: '',
      showHeaderList: false
    }
    this.onClickMark = this.onClickMark.bind(this);
  }

  componentDidMount() {
    // window.frames['sp-pagebuilder-view'].window.document.addEventListener('mousedown', this.handleClickOutside.bind(this));
    window.document.addEventListener('mousedown', this.handleClickOutside.bind(this));
  }
  componentWillUnmount() {
    // window.frames['sp-pagebuilder-view'].window.document.removeEventListener('mousedown', this.handleClickOutside.bind(this));
    window.document.removeEventListener('mousedown', this.handleClickOutside.bind(this));
  }

  /**
   * Alert if clicked on outside of element
   */
  handleClickOutside(event) {
    if (this.toolbarRef && !this.toolbarRef.contains(event.target)) {
      this.toolbarRef.removeAttribute('style')
      this.setState({ link: false, showHeaderList: false })
    }
  }

  /**
   * Render a mark-toggling toolbar button.
   *
   * @param {String} type
   * @param {String} icon
   * @return {Element}
   */

  renderMarkButton(type, icon) {
    const { value } = this.props.editor
    let  isActive = value.activeMarks.some(mark => mark.type === type) ? 'inline-active-btn' : '';
    if( isActive === '' ){
      isActive = value.blocks.some(block => block.type == type ) ? 'inline-active-btn' : '';
    }
    if( isActive === '' ){ 
      isActive = value.inlines.some(inline => inline.type === type ) ? 'inline-active-btn' : '';
    }

    return (
      <span 
        onClick={event => this.onClickMark(event, type)}
        className={`postcil-inilne-editor-btn ${isActive}`}
      >  
        <Icon className={icon.class}/>
      </span>
    )
  }

  headingTags(){
    let activeHeader = {name: 'h1', text: 'H', active: false };

    const tagList = Object.keys( headings ).map( tag => {
      const { value } = this.props.editor
      const active = value.blocks.some(block => block.type == tag ) ? 'inline-active-btn' : '';
      if( active !== '' ){
          activeHeader = {name: tag, text: headings[tag], active: true }
      }
      const lessClass = tag === 'less' ? 'inline-less-btn' : ''
        return (
            <span key={tag} className={`postcil-inilne-editor-btn ${active} ${lessClass}`} onClick={ event => this.onClickMark(event, tag ) }> 
              <Icon> {headings[tag]} </Icon>
            </span>
        )
    })
    const activeClass = activeHeader.active === true ? 'inline-active-btn': ''
    const defaultHeader = (
      <span key={activeHeader.tag} className={`postcil-inilne-editor-btn ${activeClass}`} onClick={ event => this.setState({ showHeaderList: true }) }> 
        <Icon> {activeHeader.text}.. </Icon>
      </span>
    )

    return this.state.showHeaderList ? tagList : defaultHeader

  }

  colorList(){
    return Object.keys( colors ).map( color => {
      const { value } = this.props.editor
      const active = hasInline('span', value) ? 'inline-active-btn' : '';
        return (
            <span key={color} className={`postcil-inilne-editor-btn ${active}`} onClick={ event => this.onClickMark(event, 'span', color ) }> 
              <Icon> {colors[color]} </Icon>
            </span>
        )
    })
  }


  updateListItem(editor, type){
      const isList = hasBlock('list-item', editor.value)
      const isType = editor.value.blocks.some(block => {
        return !!editor.value.document.getClosest(block.key, parent => parent.type === type)
      })

      if (isList && isType) {
        editor
          .setBlocks(BLOCK_TAGS.p) // Default block
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list')

      } else if (isList) {
        editor
          .unwrapBlock( type === 'bulleted-list' ? 'numbered-list' : 'bulleted-list')
          .wrapBlock(type)
      } else {
        editor.setBlocks('list-item').wrapBlock(type)
      }
  }

  // Unwrap link
  unwrapLink(editor){
    editor.unwrapInline('link')
  }

  //Wrap link 
  wrapLink(editor, href) {
    editor.wrapInline({
      type: 'link',
      data: { href },
    })
  
    editor.moveToEnd()
  }

  /**
   * When a mark button is clicked, toggle the current mark.
   *
   * @param {Event} event
   * @param {String} type
   */

  onClickMark(event, type, color=null ) {
    const { editor } = this.props
    if( type === 'less' ){
      // Only for heading tag
      this.setState({ showHeaderList: false })
      return;
    }
    event.preventDefault();
    if(isBlock( type ) ){
      if (type !== 'bulleted-list' && type !== 'numbered-list') {
        const isList = hasBlock('list-item', editor.value)
        if( isList ){
            editor.setBlocks( transformBlock(type, editor) )
                .unwrapBlock('bulleted-list')
                .unwrapBlock('numbered-list')
        }else{
          editor.setBlocks( transformBlock(type, editor) )
        } 
      }else{
        // Handle the extra wrapping required for list buttons.
        this.updateListItem(editor, type)
      }
    }else if( type === 'link') {
      if( hasInline('link',  editor.value) ){
        editor.command(this.unwrapLink)
      }else{
        this.setState({ link: true })
      }
    }else if( type === 'span' ) {
      console.log("inlie: ", type)
       if( hasInline(type, editor.value)  && color === 'reset' ){
          editor.unwrapInline(type)
       }else if( hasInline(type, editor.value) ){
          editor.unwrapInline(type).wrapInline({ type: type, data: {style:{ color: color } }})
       }else{
          editor.wrapInline({ type: type, data: {style:{ color: color } }})
       }
    }else{
      editor.toggleMark(type)
    }
  }
  
  bindToolbar(node){
    this.props.setRef(node)
    this.toolbarRef = node
  }

  color(color, name){
    return <span style={{color:color}}> {name} </span>
  }

  updateLinkValue(event){
    this.setState({ linkValue: event.target.value })
  }

  placeLinkToEditor(event){
    event.preventDefault();
    const { linkValue } = this.state 
    if( linkValue === '' ){ 
      return; 
    }
    const { editor } = this.props
    editor.command(this.wrapLink, linkValue)
    this.setState({ link: false })
  }

  renderLinkField(){
    return (
      <div className="postcil-inline-link-input-field">
          <input value={this.state.linkValue} onChange={this.updateLinkValue.bind(this)} type="text" placeholder="Type link"/>
          <span className="postcil-inline-link-controller">
              <span className="postcil-inline-link-done" onClick={this.placeLinkToEditor.bind(this) }> <i className="fa fa-check"/> </span>
              <span className="postcil-inline-link-cancel" onClick={()=> this.setState({ link: false }) }> <i className="fa fa-close"/> </span>
          </span>
      </div>
    )
  }

  /**
   * Later: Need color pallete
   */
  toolbarTools(){
    const markTools = (
      <Fragment>
          {this.renderMarkButton('bold', { text: 'B', class: 'fa fa-bold' } )}
          {this.renderMarkButton('italic', { text:'I', class: 'fa fa-italic' } )}
          {this.renderMarkButton('underlined', {text:'U', class: 'fa fa-underline'})}
          {this.renderMarkButton('code', { text:'C', class:'fa fa-code' })}
      </Fragment>
    )
    const blockTools = (
      <Fragment>
          {this.renderMarkButton('link', {text: 'a', class:'fa fa-link'})}
          {this.renderMarkButton('bulleted-list', {text:'ul', class:'fa fa-list'})}
          {this.renderMarkButton('numbered-list', {text:'ol', class:'fa fa-list-ol' })}
          {this.colorList()}
      </Fragment>
    )

    return(
      <Fragment>
          {markTools}
          { this.headingTags() }
          { !this.state.showHeaderList && blockTools }
      </Fragment>
    )
  }

  render() {
    // const container = window.frames['sp-pagebuilder-view'].document.body;
    const container = window.document.body;
    
      return ReactDOM.createPortal(
        <div className={`postcil-inline-toolbar`} ref={this.bindToolbar.bind(this)}>
          { this.state.link ? this.renderLinkField() : this.toolbarTools() }
        </div>,
        container
    )
  }
}