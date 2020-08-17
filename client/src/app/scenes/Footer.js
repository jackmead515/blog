import React from 'react'

export default function Footer() {
  return (
    <footer>
      <div>
        <span>© {new Date().getUTCFullYear()} SELF PROCLAIMED ENGINEER</span>
        <div>
          <a href='/' alt='Home'>Home</a>
          |
          <a href='/about' alt='About'>About</a>
          |
          <a href='/contact' alt='Contact'>Contact</a>
        </div>
      </div>
    </footer>
  );
}
