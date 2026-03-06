import { useState } from 'react'
import { Button, ButtonProps, Grow } from '@mui/material'

function GrowingButton({ sx, ...props }: ButtonProps) {
  const [transitionDone, setTransitionDone] = useState(false)

  return (
    <Grow
      in
      timeout={1000}
      onTransitionEnd={() => {
        setTransitionDone(true)
      }}
    >
      <Button
        {...props}
        disabled={
          !(import.meta.env.VITE_DISABLE_TRANSITIONS || transitionDone) ||
          !!props.disabled
        }
        sx={{
          py: 1.2,
          px: 3,
          fontSize: '0.95rem',
          fontWeight: 600,
          borderRadius: '12px',
          textTransform: 'none',
          letterSpacing: '0.3px',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)',
            transition: 'left 0.5s ease',
          },
          '&:hover::before': { left: '100%' },
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
          },
          '&:active': {
            transform: 'scale(0.96)',
          },
          ...sx,
        }}
      >
        {props.children}
      </Button>
    </Grow>
  )
}

export default GrowingButton
