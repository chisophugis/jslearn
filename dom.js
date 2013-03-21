function isTextNode(node) {
  return node.nodeType == 3;
}

function recursiveDOMCollectText(dom, strArr) {
  var child;
  if (isTextNode(dom)) {
    strArr.push(dom.nodeValue);
  }
  // for (i = 0, childNodes = dom.childNodes, n = childNodes.length;
  //      i != n; i += 1) {
  //   recursiveDOMCollectText(childNodes[i], strArr);
  // }

  // for (child = dom.lastChild; child !== null; child = child.previousSibling) {
  for (child = dom.firstChild; child !== null; child = child.nextSibling) {
    recursiveDOMCollectText(child, strArr);
  }
  return strArr;
}
