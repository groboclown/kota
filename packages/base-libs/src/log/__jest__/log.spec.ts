
import * as log from '../log'

interface LogMessage {
  level: log.LOG_LEVELS
  source: string
  message: string
}

describe('logs', () => {
  const logsWritten: LogMessage[] = []
  let logSettings = {}
  beforeAll(() => {
    log.setLogWriter((level: log.LOG_LEVELS, source: string, message: string): void => {
      logsWritten.push({ level, source, message })
    })
  })
  afterAll(() => {
    log.unittest_resetLogWriter()
    log.unittest_resetLogLevels(logSettings)
  })
  beforeEach(() => {
    logsWritten.length = 0
    logSettings = log.unittest_getLogLevels()
  })
  afterEach(() => {
    log.unittest_resetLogLevels(logSettings)
  })

  describe('log debug', () => {
    const logger = log.createLogger('a.b.c')
    describe('level off', () => {
      it('exact', () => {
        log.setLogLevel('#a.b.c', log.LOG_VERBOSE)
        logger.debug('-000')
        expect(logsWritten).toHaveLength(0)
      })
      it('parent', () => {
        log.setLogLevel('#a.b', log.LOG_INFO)
        logger.debug('-001')
        expect(logsWritten).toHaveLength(0)
      })
      it('grandparent', () => {
        log.setLogLevel('#a', log.LOG_WARN)
        logger.debug('-002')
        expect(logsWritten).toHaveLength(0)
      })
      it('root', () => {
        log.setLogLevel('#', log.LOG_ERROR)
        logger.debug('-003')
        expect(logsWritten).toHaveLength(0)
      })
    })
    describe('level on', () => {
      it('exact', () => {
        log.setLogLevel('#a.b.c', log.LOG_DEBUG)
        logger.debug('+000')
        expect(logsWritten).toEqual([
          { level: log.LOG_DEBUG, source: 'a.b.c', message: '+000' }
        ])
      })
      it('parent', () => {
        log.setLogLevel('#a.b', log.LOG_DEBUG)
        logger.debug('+001')
        expect(logsWritten).toEqual([
          { level: log.LOG_DEBUG, source: 'a.b.c', message: '+001' }
        ])
      })
      it('grandparent', () => {
        log.setLogLevel('#a', log.LOG_DEBUG)
        logger.debug('+002')
        expect(logsWritten).toEqual([
          { level: log.LOG_DEBUG, source: 'a.b.c', message: '+002' }
        ])
      })
      it('root', () => {
        log.setLogLevel('#', log.LOG_DEBUG)
        logger.debug('+003')
        expect(logsWritten).toEqual([
          { level: log.LOG_DEBUG, source: 'a.b.c', message: '+003' }
        ])
      })
    })

    describe('ifDebug', () => {
      it('disabled', () => {
        let ran = false
        log.setLogLevel('#', log.LOG_INFO)
        logger.ifDebug(() => {
          ran = true
          return '-004'
        })
        expect(logsWritten).toHaveLength(0)
        expect(ran).toBe(false)
      })
      it('enabled', () => {
        let ran = false
        log.setLogLevel('#', log.LOG_DEBUG)
        logger.ifDebug(() => {
          ran = true
          return '+004'
        })
        expect(logsWritten).toEqual([
          { level: log.LOG_DEBUG, source: 'a.b.c', message: '+004' }
        ])
        expect(ran).toBe(true)
      })
    })
  })

  describe('unittest', () => {
    const logger = log.createLogger('c')
    it('enabled', () => {
      log.setLogLevel('#c', log.LOG_UNIT_TEST)
      logger.unitTest('ab')
      expect(logsWritten).toEqual([
        { level: log.LOG_UNIT_TEST, source: 'c', message: 'ab' }
      ])
    })
    it('disabled', () => {
      log.setLogLevel('#c', log.LOG_INFO)
      logger.unitTest('abc')
      expect(logsWritten).toHaveLength(0)
    })
    describe('ifUnitTest', () => {
      it('enabled', () => {
        log.setLogLevel('#c', log.LOG_UNIT_TEST)
        let ran = false
        logger.ifUnitTest(() => {
          ran = true
          return 'ab'
        })
        expect(logsWritten).toEqual([
          { level: log.LOG_UNIT_TEST, source: 'c', message: 'ab' }
        ])
        expect(ran).toBe(true)
      })
      it('disabled', () => {
        log.setLogLevel('#c', log.LOG_INFO)
        let ran = false
        logger.ifUnitTest(() => {
          ran = true
          return 'abc'
        })
        expect(logsWritten).toHaveLength(0)
        expect(ran).toBe(false)
      })
    })
  })

  describe('verbose', () => {
    const logger = log.createLogger('c')
    it('enabled', () => {
      log.setLogLevel('#c', log.LOG_VERBOSE)
      logger.verbose({ a: 1 })
      expect(logsWritten).toEqual([
        { level: log.LOG_VERBOSE, source: 'c', message: JSON.stringify({ a: 1 }) }
      ])
    })
    it('disabled', () => {
      log.setLogLevel('#c', log.LOG_INFO)
      logger.verbose('abc')
      expect(logsWritten).toHaveLength(0)
    })
  })

  describe('info', () => {
    const logger = log.createLogger('c')
    it('enabled', () => {
      log.setLogLevel('#c', log.LOG_INFO)
      logger.info(true)
      expect(logsWritten).toEqual([
        { level: log.LOG_INFO, source: 'c', message: JSON.stringify(true) }
      ])
    })
    it('disabled', () => {
      log.setLogLevel('#c', log.LOG_WARN)
      logger.info('abc')
      expect(logsWritten).toHaveLength(0)
    })
  })

  describe('warn', () => {
    const logger = log.createLogger('c')
    it('enabled', () => {
      log.setLogLevel('#c', log.LOG_WARN)
      logger.warn(2)
      expect(logsWritten).toEqual([
        { level: log.LOG_WARN, source: 'c', message: JSON.stringify(2) }
      ])
    })
    it('disabled', () => {
      log.setLogLevel('#c', log.LOG_ERROR)
      logger.warn('abc')
      expect(logsWritten).toHaveLength(0)
    })
  })

  describe('error', () => {
    const logger = log.createLogger('c')
    it('enabled', () => {
      log.setLogLevel('#c', log.LOG_ERROR)
      logger.error([2, 2], 'x', null, undefined, 'y')
      expect(logsWritten).toEqual([
        { level: log.LOG_ERROR, source: 'c', message: JSON.stringify([2, 2]) + ' x <null> <null> y' }
      ])
    })
    it('disabled', () => {
      log.setLogLevel('#c', log.LOG_FATAL)
      logger.error('abc')
      expect(logsWritten).toHaveLength(0)
    })
  })

  describe('fatal', () => {
    const logger = log.createLogger('c')
    // Can't be disabled...
    it('enabled', () => {
      log.setLogLevel('#c', log.LOG_FATAL)
      logger.fatal('a ', 'b')
      expect(logsWritten).toEqual([
        { level: log.LOG_FATAL, source: 'c', message: 'a b' }
      ])
    })
    describe('ifFatal', () => {
      it('enabled', () => {
        log.setLogLevel('#c', log.LOG_FATAL)
        let ran = false
        logger.ifFatal(() => {
          ran = true
          return 'ab'
        })
        expect(logsWritten).toEqual([
          { level: log.LOG_FATAL, source: 'c', message: 'ab' }
        ])
        expect(ran).toBe(true)
      })
    })
  })

  describe('setLogLevel', () => {
    it('sub-level', () => {
      log.setLogLevel('a/b', log.LOG_ERROR)
      const levels = log.unittest_getLogLevels()
      expect(levels['#a.b']).toBeDefined
      expect(levels['#a.b'].error).toBe(true)
      expect(levels['#a.b'].warn).toBe(false)
    })
    it('root', () => {
      log.setLogLevel('#', log.LOG_ERROR)
      const levels = log.unittest_getLogLevels()
      expect(levels['#']).toBeDefined
      expect(levels['#'].error).toBe(true)
      expect(levels['#'].warn).toBe(false)
    })
    it('empty', () => {
      log.setLogLevel('', log.LOG_ERROR)
      const levels = log.unittest_getLogLevels()
      expect(levels['']).toBeUndefined
      expect(levels['#']).toBeDefined
      expect(levels['#'].error).toBe(true)
      expect(levels['#'].warn).toBe(false)
    })
  })
})
