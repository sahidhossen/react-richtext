import React from 'react';
import { BLOCK_TAGS, MARK_TAGS, INLINE_TAGS } from './marks';
import { cssParser } from './utils';

export const rules = [
    {
      deserialize(el, next) {
        const type = BLOCK_TAGS[el.tagName.toLowerCase()]
        if (type) {
          return {
            object: 'block',
            type: type,
            data: {
              className: el.getAttribute('class')
            },
            nodes: next(el.childNodes),
          }
        }
      },
      serialize(obj, children) {
        if (obj.object == 'block') {
          
          switch (obj.type) {
            case 'code':
              return (
                <pre>
                  <code>{children}</code>
                </pre>
              )
            case 'paragraph':
              return <p className={obj.data.get('className')}>{children}</p>
            case 'div':
              return <div className={`${obj.data.get('className')}`}>{children}</div>
            case 'quote':
              return <blockquote>{children}</blockquote>
            case 'bulleted-list':
              return <ul>{children}</ul>
            case 'list-item':
              return <li>{children}</li>
            case 'numbered-list':
              return <ol>{children}</ol>
            case 'h1':
               return <h1>{children}</h1>
            case 'h2':
              return <h2>{children}</h2>
            case 'h3':
              return <h3>{children}</h3>
            case 'h4':
              return <h4>{children}</h4>
            case 'h5':
              return <h5>{children}</h5>
            case 'h6':
              return <h6>{children}</h6>
          }
        }
      },
    },
    // Add a new rule that handles marks...
    {
      deserialize(el, next) {
        const type = MARK_TAGS[el.tagName.toLowerCase()]
        if (type) {
          return {
            object: 'mark',
            type: type,
            data: {
                className: el.getAttribute('class')
            },
            element: el,
            nodes: next(el.childNodes),
          }
        }
      },
      serialize(obj, children) {
        if (obj.object == 'mark') {
          switch (obj.type) {
            case 'bold':
              return <strong>{children}</strong>
            case 'italic':
              return <em>{children}</em>
            case 'underlined':
              return <u>{children}</u>
            case 'code':
              return <code>{children}</code>
            case 'strikethrough':
              return <s>{children}</s>
          }
        }
      },
    },
     // Add a new rule that handles marks...
     {
        deserialize(el, next) {
          const type = INLINE_TAGS[el.tagName.toLowerCase()]
          if (type) {
            return {
              object: 'inline',
              type: type,
              data: {
                  className: el.getAttribute('class'),
                  style: type === 'span' ? cssParser(el.style) : {},
                  href: type === 'link' ? el.getAttribute('href') : ''
              },
              element: el,
              nodes: next(el.childNodes),
            }
          }
        },
        serialize(obj, children) {
          if (obj.object == 'inline') {
            switch (obj.type) {
              case 'link':
                return <a href={obj.data.get('href')}>{children}</a>
              case 'span':
                return <span style={obj.data.get('style')}>{children}</span>
            }
          }
        },
      },
  ]