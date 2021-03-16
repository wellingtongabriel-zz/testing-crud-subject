import React from 'react';
import { Text } from "@react-pdf/renderer";

/**
 * Converts DOM nodes to React PDF elements.
 *
 * @param  {Array}    nodes             - The DOM nodes.
 * @param  {Object}   [options]         - The additional options.
 * @param  {Function} [options.replace] - The replace method.
 * @return {ReactElement|Array}
 */
function domToReactPdf(nodes, options) {
  options = options || {};

  var result = [];
  var node;
  var props;
  var children;

  for (var i = 0, len = nodes.length; i < len; i++) {
    node = nodes[i];

    if (node.type === 'text') {
      result.push(node.data);
      continue;
    }

    props = node.attribs;

    children = null;

    if (node.type === 'tag') {
      // continue recursion of creating React elements (if applicable)
      if (node.children && node.children.length) {
        children = domToReactPdf(node.children, options);
      }

      // skip all other cases (e.g., comment)
    } else {
      continue;
    }

    // specify a "key" prop if element has siblings
    // https://fb.me/react-warning-keys
    if (len > 1) {
      props.key = i;
    }

    let component = <Text {...props}>{children}</Text>;
    if (node.name === 'strong') {
        component = <Text {...props} style={{fontFamily: "Helvetica-Bold"}}>{children}</Text>;
    }
    if (node.name === 'em') {
        component = <Text {...props} style={{fontFamily: "Helvetica-Oblique"}}>{children}</Text>;
    }
    if (node.name === 'u') {
        component = <Text {...props} style={{textDecoration: 'underline'}}>{children}</Text>;
    }
    if (node.name === 'del') {
        component = <Text {...props} style={{textDecoration: 'line-through'}}>{children}</Text>;
    }
    if (node.name === 'li') {
        if (children instanceof Array) {
            // eslint-disable-next-line no-loop-func
            component = children.map((child, index) => {
              const last = children.length === (index + 1);
              if (typeof child === 'string') {
                  return <Text key={index} children={`${child}${last ? `\n` : ''}`} />;
              }
          
              return child;
            });
        } else {
            component = <Text {...props} children={`${children}\n`} />;
        }

    }

    result.push(component);
  }

  return result.length === 1 ? result[0] : result;
}

export default domToReactPdf;
