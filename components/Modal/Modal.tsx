import css from './Modal.module.css'
import React, { ReactNode } from 'react'

type Props = {
  children: ReactNode
  onClose: () => void
}

const Modal = ({ children, onClose }: Props) => {
  return (
    <div className={css.backdrop} onClick={onClose}>
      <div className={css.modal} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}

export default Modal
