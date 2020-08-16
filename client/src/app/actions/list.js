export function addToPinned(head) {
  return {
    type: 'ADD_TO_PINNED',
    data: head
  }
}

export function removeFromPinned(link) {
  return {
    type: 'REMOVED_FROM_PINNED',
    data: link
  }
}

export function refreshPinnedData(data) {
  return {
    type: 'REFRESH_PINNED',
    data
  }
}