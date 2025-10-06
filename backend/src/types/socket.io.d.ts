declare module 'socket.io' {
  import type { Server as HttpServer } from 'http'

  interface ServerOptions {
    cors?: {
      origin?: string | string[]
      methods?: string[]
      credentials?: boolean
    }
    [key: string]: unknown
  }

  interface Socket {
    id: string
    join(room: string): void
    leave(room: string): void
    on(event: string, listener: (...args: any[]) => void): this
  }

  class Server {
    constructor(httpServer: HttpServer, options?: ServerOptions)
    on(event: 'connection', listener: (socket: Socket) => void): this
    on(event: string, listener: (...args: any[]) => void): this
    emit(event: string, ...args: any[]): boolean
    to(room: string): Server
  }

  export { Server, ServerOptions, Socket }
}
