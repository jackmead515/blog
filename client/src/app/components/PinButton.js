import React from 'react'
import FAIcon from 'react-fontawesome';


export default function PinButton({ pinState, onClickPin, containerClassName }) {
  const pinTitle = pinState ? <>Add To Favorites <FAIcon name="plus"/></> : <>Favorited <FAIcon name="check"/></>;
  const pinnedClassName = pinState ? '' : 'pinned-active';
  return (
    <button
      className={`pinned-button ${pinnedClassName} ${containerClassName}`}
      onClick={onClickPin}
    >
      {pinTitle}
    </button>
  )
}
