'use client'

import { Bell } from 'lucide-react'
import { Button } from '../ui/button'
import { Notification } from '@prisma/client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import axios from 'axios'

export const NotificationIndicator = ({
  notifications,
}: {
  notifications: Notification[]
}) => {
  console.log(notifications)
  const hasNotifications = notifications.length > 0

  const setNotificationRead = async (id: Notification['id']) => {
    try {
      axios.patch('/api/notifications', { id })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={`${hasNotifications ? 'primary' : 'ghost'}`}>
          <Bell />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>
          {!hasNotifications
            ? 'No new notifications'
            : notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  onClick={() => setNotificationRead(notification.id)}
                >
                  Direct Message from member ID: {notification.id}
                </DropdownMenuItem>
              ))}
        </DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default NotificationIndicator
