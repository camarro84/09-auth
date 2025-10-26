import React from 'react'
import css from './Footer.module.css'

const Footer = () => {
  return (
    <footer className={css.footer}>
      <div className={css.wrap}>
        <p>© {new Date().getFullYear()} NoteHub. All rights reserved.</p>
        <div className={css.wrap}>
          <p>Developer: Serhii Komarov</p>
          <p>
            Contact us:
            <a href="camarro84@gmail.com">camarro84@gmail.com</a>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
