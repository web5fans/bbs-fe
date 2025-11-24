export default function hastToHtml(nodes) {
  if (!Array.isArray(nodes)) {
    nodes = [nodes];
  }

  return nodes.map(node => {
    if (node.type === 'text') {
      return node.value.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    if (node.type === 'element') {
      const attrs = Object.entries(node.properties || {})
                          .map(([key, value]) => {
                            if (key === 'className' && Array.isArray(value)) {
                              return `class="${value.join(' ')}"`;
                            }
                            return `${key}="${value}"`;
                          })
                          .join(' ');

      const children = node.children ? hastToHtml(node.children) : '';
      return `<${node.tagName}${attrs ? ' ' + attrs : ''}>${children}</${node.tagName}>`;
    }

    return '';
  }).join('');
}