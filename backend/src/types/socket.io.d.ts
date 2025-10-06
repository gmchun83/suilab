import type { Server as HttpServer } from 'http'
import type { EventEmitter } from 'events'

declare module 'socket.io' {
  interface ServerOptions {
    cors?: {
      origin?: string | string[];
      methods?: string[];
    };
    [key: string]: unknown;
  }

  export interface Socket extends EventEmitter {
    id: string
    join(room: string): void
    leave(room: string): void
    on(event: 'disconnect', listener: () => void): this
    on(event: string, listener: (...args: any[]) => void): this
  }

  export class Server extends EventEmitter {
    constructor(httpServer: HttpServer, options?: ServerOptions)
    emit(event: string, ...args: any[]): boolean
    to(room: string): Server
    on(event: 'connection', listener: (socket: Socket) => void): this
    on(event: string, listener: (...args: any[]) => void): this
  }
}
