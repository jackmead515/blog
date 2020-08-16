import React from 'react'

export default function Footer() {
  return (
    <footer>
      <div className="footer-content">
        <span>© {new Date().getUTCFullYear()} SELF PROCLAIMED ENGINEER</span>
        <div className="footer-nav">
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
