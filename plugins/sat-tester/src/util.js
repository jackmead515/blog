export function centerGraph(element) {
  
}

export function dragElement(element) {
  const pos = [0, 0, 0, 0];

  element.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    if (e.which === 2) {
      pos[2] = e.clientX;
      pos[3] = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    if (e.which === 2) {
      pos[0] = pos[2] - e.clientX;
      pos[1] = pos[3] - e.clientY;
      pos[2] = e.clientX;
      pos[3] = e.clientY;
      element.style.top = (element.offsetTop - pos[1]) + 'px';
      element.style.left = (element.offsetLeft - pos[0]) + 'px';
    }
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}