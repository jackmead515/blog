import React from 'react'
import FAIcon from 'react-fontawesome';


export default function PinButton({ pinState, onClickPin, containerClassName }) {

  let pinTitle = <>Favorited <FAIcon name="check"/></>;
  if (pinState) {
    pinTitle = <>Favorite <FAIcon name="star-o"/></>;
  }

  const pinnedClassName = pinState ? '' : 'pinned-active';
  return (
    <button
      title="Pin to the home page!"
      className={`pinned-button ${pinnedClassName} ${containerClassName}`}
      onClick={onClickPin}
    >
      {pinTitle}
    </button>
  )
}
