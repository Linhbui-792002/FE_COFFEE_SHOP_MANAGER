import { Tooltip } from 'antd'
import React from 'react'

const TooltipCustom = ({ children, title, color }) => {
  return (
    <Tooltip title={title} arrow={true} color={color}>
      <>{children}</>
    </Tooltip>
  )
}

export default TooltipCustom
