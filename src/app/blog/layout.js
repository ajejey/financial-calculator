import React from 'react'

const layout = ({ children }) => {
  return (
    <div className='container-fluid mx-auto'>
        {children}
    </div>
  )
}

export default layout