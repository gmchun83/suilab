import winston from 'winston'
import path from 'path'

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json()
)

// Create logger
export const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: logFormat,
  transports: [
    // Console transport
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    // File transport
    new winston.transports.File({
      filename: path.join(__dirname, '../../logs/app.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  ]
})

export default logger
