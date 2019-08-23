export function SoftBreak() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  
    return {
      onKeyDown: function onKeyDown(event, change, next) {
        if (event.key !== 'Enter') return next();
        if( options.multiline === false ){
            return change.insertText('\n');
          }
          // If multiline false and prease enter+shift add break tag
          if( options.multiline === true && event.shiftKey === true ){
            return change.insertText('\n');
          }
          return next();
      }
    };
  }
  