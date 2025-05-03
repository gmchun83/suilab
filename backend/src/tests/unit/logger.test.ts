const { logger } = require('../../utils/logger')

// Mock winston
jest.mock('winston', () => {
  const mockFormat = {
    combine: jest.fn(),
    timestamp: jest.fn(),
    json: jest.fn(),
    colorize: jest.fn(),
    simple: jest.fn(),
  }

  const mockTransports = {
    Console: jest.fn(),
    File: jest.fn(),
  }

  return {
    format: mockFormat,
    createLogger: jest.fn().mockReturnValue({
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
    }),
    transports: mockTransports,
  }
})

describe('Logger', () => {
  test('logger should be defined', () => {
    expect(logger).toBeDefined()
  })

  test('logger should have info method', () => {
    expect(logger.info).toBeDefined()
    expect(typeof logger.info).toBe('function')
  })

  test('logger should have error method', () => {
    expect(logger.error).toBeDefined()
    expect(typeof logger.error).toBe('function')
  })

  test('logger should have warn method', () => {
    expect(logger.warn).toBeDefined()
    expect(typeof logger.warn).toBe('function')
  })

  test('logger should have debug method', () => {
    expect(logger.debug).toBeDefined()
    expect(typeof logger.debug).toBe('function')
  })

  test('logger.info should be callable', () => {
    expect(() => logger.info('test message')).not.toThrow()
  })

  test('logger.error should be callable', () => {
    expect(() => logger.error('test error')).not.toThrow()
  })
})
