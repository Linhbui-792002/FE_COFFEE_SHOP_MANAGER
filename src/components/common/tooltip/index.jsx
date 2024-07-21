import { Tooltip } from 'antd'
import React from 'react'

const TooltipCustom = ({ children, title, color }) => {
  return (
    <Tooltip title={title} arrow={true} color={color} className='w-full flex !items-center justify-center'>
      <>{children}</>
    </Tooltip>
  )
}

export default TooltipCustom
