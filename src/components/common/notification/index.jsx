import { notification } from 'antd'

const validTypes = ['success', 'info', 'warning', 'error']

/**
 * Displays a notification.
 *
 * @param {'success' | 'info' | 'warning' | 'error'} type
 * @param {string} msg
 * @param {string} desc -
 * @param {number} [duration=4]
 * @param {'topRight' | 'topLeft' | 'bottomRight' | 'bottomLeft'} [placement='topRight']
 */
const Notification = (type, msg, desc, duration = 2, placement = 'topRight') => {
  if (!validTypes.includes(type)) {
    console.error(`Invalid notification type: ${type}`)
    return
  }

  notification[type]({
    message: msg,
    description: desc,
    duration,
    placement
  })
}

export default Notification
