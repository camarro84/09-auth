'use client'

import { ReactNode, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import css from './Modal.module.css'

type Props = {
  open: boolean
  onClose: () => void
  children: ReactNode
}

export default function Modal({ open, onClose, children }: Props) {
  const scrollYRef = useRef(0)

  useEffect(() => {
    if (!open) return

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKey)

    scrollYRef.current = window.scrollY

   
    const prevOverflow = document.body.style.overflow
    const prevPosition = document.body.style.position
    const prevTop = document.body.style.top
    const prevWidth = document.body.style.width

    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollYRef.current}px`
    document.body.style.width = '100%'

    return () => {
      document.removeEventListener('keydown', handleKey)

      
      document.body.style.overflow = prevOverflow
      document.body.style.position = prevPosition
      document.body.style.top = prevTop
      document.body.style.width = prevWidth

      
      window.scrollTo(0, scrollYRef.current)
    }
  }, [open, onClose])

  if (!open) return null

  const handleBackdropClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    if (e.target === e.currentTarget) onClose()
  }

  const modalMarkup = (
    <div
      className={css.backdrop}
      onClick={handleBackdropClick}
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 1000,
      }}
    >
      <div
        className={css.modal}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',

          maxWidth: '480px',
          width: '100%',

          background: '#fff',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          padding: '24px 24px 20px',

          maxHeight: '80vh',
          overflowY: 'auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginBottom: '16px',
          }}
        >
          <button
            type="button"
            aria-label="Close modal"
            onClick={onClose}
            tabIndex={-1}
            autoFocus={false}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '20px',
              lineHeight: 1,
              color: '#000',
              padding: 0,
            }}
          >
            ×
          </button>
        </div>

        <div
          style={{
            fontSize: '16px',
            lineHeight: 1.5,
            color: '#000',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )

  return createPortal(modalMarkup, document.body)
}
