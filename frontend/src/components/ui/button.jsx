import clsx from 'clsx'
import React from 'react'
import spinner from '../../../assets/icons/spinner.svg'



const Button = ({
  onClick,
  className,
  children,
  loading = false,
  ...otherProps
}) => {
  return (
    <button
      {...otherProps}
      disabled={loading}
      onClick={onClick}
      className={clsx(className, 'bg-black relative')}
    >
      <div
        className={clsx(
          loading ? 'flex' : 'hidden',
          'absolute w-full  bg-black  items-center justify-center opacity-30 left-0  top-0 h-full'
        )}
      ></div>
      <img
        src={spinner}
        className={clsx(
          loading ? 'flex' : 'hidden',
          'w-6 absolute z-10 opacity-100 left-1/2 -translate-x-1/2'
        )}
      />
      {children}
    </button>
  )
}

export default Button
