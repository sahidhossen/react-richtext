import Html from 'slate-html-serializer'
import sanitizeHtml from 'sanitize-html'
import { rules } from './rules';
import { BLOCK_TAGS, MARK_TAGS }  from './marks';

// Create a new serializer instance with our `rules` from above.
export const html = new Html({ rules, defaultBlock:'div' })


export const isMark = ( type ) => {
    return Object.keys( MARK_TAGS ).filter( tag => MARK_TAGS[tag] === type ).length
}

export const isBlock = ( type ) => {
    return Object.keys( BLOCK_TAGS ).filter( tag => BLOCK_TAGS[tag] === type ).length
}

export const filterOnlyMarkup = ( value ) => {
    return sanitizeHtml(value, {
        allowedTags: [ 'b', 'i', 'em', 'strong', 'span', 'br' ],
        selfClosing: [ 'br' ],
    })
}

/**
 * Determine whether any of the currently selected blocks are 
 * some special tag (code|blockquate) blocks.
 * If not then convert the blcok to normal paragraph
 */
export const transformBlock = ( type, editor ) => {
    return editor.value.blocks.some(block => block.type == type )  ?  BLOCK_TAGS.p : type;
}   

 /**
   * Check if the current selection has a mark with `type` in it.
   *
   * @param {String} type
   * @return {Boolean}
   */

export const  hasMark = (type, value) => {
    return value.activeMarks.some(mark => mark.type === type)
  }

  /**
   * Check if the any of the currently selected blocks are of `type`.
   *
   * @param {String} type
   * @return {Boolean}
   */

 export const hasBlock = (type, value) => {
    return value.blocks.some(node => node.type === type)
  }

export const hasInline = ( type, value ) => {
    return value.inlines.some(inline => inline.type === type )
}

export const removeHtmlTag = ( htmlStr ) => { 
    if( htmlStr === '' )
        return htmlStr;
    return htmlStr.replace(/(<([^>]+)>)/ig, "") 
}

export const parsePlainContent = ( value, tagName = '' ) => {
    if( tagName === '' )
        return filterOnlyMarkup(value)
    return `<${tagName}>${filterOnlyMarkup(value)}</${tagName}>`
}