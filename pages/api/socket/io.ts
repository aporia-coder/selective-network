import { NextApiResponseIO } from '@/app/globalTypes'
import { SOCKET_API_PATH } from '@/constants'
import { Server as NetServer } from 'http'
import { NextApiRequest } from 'next'
import { Server as ServerIO } from 'socket.io'

export const config = {
  api: {
    bodyParser: false,
  },
}

const handleIO = (req: NextApiRequest, res: NextApiResponseIO) => {
  if (!res.socket.server.io) {
    const path = SOCKET_API_PATH
    const httpServer: NetServer = res.socket.server as any
    const io = new ServerIO(httpServer, {
      path,
      addTrailingSlash: false,
    })

    res.socket.server.io = io
  }

  res.end()
}

export default handleIO
