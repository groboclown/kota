
/* tslint:disable:no-unused-expression */

import * as log from '../log'

// Import the index separately to ensure we're separating public vs. private stuff.
import * as rx from '../index'

interface LogMessage {
  level: log.LOG_LEVELS
  source: string
  message: string
}

describe('logs', () => {
  const logsWritten: LogMessage[] = []
  let logSettings = {}
  beforeAll(() => {
    rx.log.setLogWriter((level: log.LOG_LEVELS, source: string, message: string): void => {
      logsWritten.push({ level, source, message })
    })
  })
  afterAll(() => {
    log.unittest_resetLogWriter()
  })
  beforeEach(() => {
    logsWritten.length = 0
    logSettings = log.unittest_getLogLevels()
  })
  afterEach(() => {
    log.unittest_resetLogLevels(logSettings)
  })

  describe('log debug', () => {
    const logger = rx.log.createLogger('a.b.c')
    describe('level off', () => {
      it('exact', () => {
        rx.log.setLogLevel('#a.b.c', rx.log.LOG_VERBOSE)
        logger.debug('-000')
        expect(logsWritten).toHaveLength(0)
      })
      it('parent', () => {
        rx.log.setLogLevel('#a.b', rx.log.LOG_INFO)
        logger.debug('-001')
        expect(logsWritten).toHaveLength(0)
      })
      it('grandparent', () => {
        rx.log.setLogLevel('#a', rx.log.LOG_WARN)
        logger.debug('-002')
        expect(logsWritten).toHaveLength(0)
      })
      it('root', () => {
        rx.log.setLogLevel('#', rx.log.LOG_ERROR)
        logger.debug('-003')
        expect(logsWritten).toHaveLength(0)
      })
    })
    describe('level on', () => {
      it('exact', () => {
        rx.log.setLogLevel('#a.b.c', rx.log.LOG_DEBUG)
        logger.debug('+000')
        expect(logsWritten).toEqual([
          { level: rx.log.LOG_DEBUG, source: 'a.b.c', message: '+000' },
        ])
      })
      it('parent', () => {
        rx.log.setLogLevel('#a.b', rx.log.LOG_DEBUG)
        logger.debug('+001')
        expect(logsWritten).toEqual([
          { level: rx.log.LOG_DEBUG, source: 'a.b.c', message: '+001' },
        ])
      })
      it('grandparent', () => {
        rx.log.setLogLevel('#a', rx.log.LOG_DEBUG)
        logger.debug('+002')
        expect(logsWritten).toEqual([
          { level: rx.log.LOG_DEBUG, source: 'a.b.c', message: '+002' },
        ])
      })
      it('root', () => {
        rx.log.setLogLevel('#', rx.log.LOG_DEBUG)
        logger.debug('+003')
        expect(logsWritten).toEqual([
          { level: rx.log.LOG_DEBUG, source: 'a.b.c', message: '+003' },
        ])
      })
    })

    describe('ifDebug', () => {
      it('disabled', () => {
        let ran = false
        rx.log.setLogLevel('#', rx.log.LOG_INFO)
        logger.ifDebug(() => {
          ran = true
          return '-004'
        })
        expect(logsWritten).toHaveLength(0)
        expect(ran).toBe(false)
      })
      it('enabled', () => {
        let ran = false
        rx.log.setLogLevel('#', rx.log.LOG_DEBUG)
        logger.ifDebug(() => {
          ran = true
          return '+004'
        })
        expect(logsWritten).toEqual([
          { level: rx.log.LOG_DEBUG, source: 'a.b.c', message: '+004' },
        ])
        expect(ran).toBe(true)
      })
      it('enabled, object', () => {
        let ran = false
        rx.log.setLogLevel('#', rx.log.LOG_DEBUG)
        logger.ifDebug(() => {
          ran = true
          return ['+005']
        })
        expect(logsWritten).toEqual([
          { level: rx.log.LOG_DEBUG, source: 'a.b.c', message: '+005' },
        ])
        expect(ran).toBe(true)
      })
    })
  })

  describe('unittest', () => {
    const logger = rx.log.createLogger('c')
    it('enabled', () => {
      rx.log.setLogLevel('#c', rx.log.LOG_UNIT_TEST)
      logger.unitTest('ab')
      expect(logsWritten).toEqual([
        { level: rx.log.LOG_UNIT_TEST, source: 'c', message: 'ab' },
      ])
    })
    it('disabled', () => {
      rx.log.setLogLevel('#c', rx.log.LOG_INFO)
      logger.unitTest('abc')
      expect(logsWritten).toHaveLength(0)
    })
    describe('ifUnitTest', () => {
      it('enabled', () => {
        rx.log.setLogLevel('#c', rx.log.LOG_UNIT_TEST)
        let ran = false
        logger.ifUnitTest(() => {
          ran = true
          return 'ab'
        })
        expect(logsWritten).toEqual([
          { level: rx.log.LOG_UNIT_TEST, source: 'c', message: 'ab' },
        ])
        expect(ran).toBe(true)
      })
      it('enabled, object', () => {
        rx.log.setLogLevel('#c', rx.log.LOG_UNIT_TEST)
        let ran = false
        logger.ifUnitTest(() => {
          ran = true
          return ['ab']
        })
        expect(logsWritten).toEqual([
          { level: rx.log.LOG_UNIT_TEST, source: 'c', message: 'ab' },
        ])
        expect(ran).toBe(true)
      })
      it('disabled', () => {
        rx.log.setLogLevel('#c', rx.log.LOG_INFO)
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

  describe('trace', () => {
    const logger = rx.log.createLogger('c')
    it('enabled', () => {
      rx.log.setLogLevel('#c', rx.log.LOG_TRACE)
      logger.trace('ab')
      expect(logsWritten).toEqual([
        { level: rx.log.LOG_TRACE, source: 'c', message: 'ab' },
      ])
    })
    it('disabled', () => {
      rx.log.setLogLevel('#c', rx.log.LOG_VERBOSE)
      logger.trace('abc')
      expect(logsWritten).toHaveLength(0)
    })
    describe('ifTrace', () => {
      it('enabled', () => {
        rx.log.setLogLevel('#c', rx.log.LOG_TRACE)
        let ran = false
        logger.ifTrace(() => {
          ran = true
          return 'ab'
        })
        expect(logsWritten).toEqual([
          { level: rx.log.LOG_TRACE, source: 'c', message: 'ab' },
        ])
        expect(ran).toBe(true)
      })
      it('enabled, object', () => {
        rx.log.setLogLevel('#c', rx.log.LOG_TRACE)
        let ran = false
        logger.ifTrace(() => {
          ran = true
          return [{ x: 'ab' }]
        })
        expect(logsWritten).toEqual([
          { level: rx.log.LOG_TRACE, source: 'c', message: '{"x":"ab"}' },
        ])
        expect(ran).toBe(true)
      })
      it('disabled', () => {
        rx.log.setLogLevel('#c', rx.log.LOG_VERBOSE)
        let ran = false
        logger.ifTrace(() => {
          ran = true
          return 'abc'
        })
        expect(logsWritten).toHaveLength(0)
        expect(ran).toBe(false)
      })
    })
  })

  describe('verbose', () => {
    const logger = rx.log.createLogger('c')
    it('enabled', () => {
      rx.log.setLogLevel('#c', rx.log.LOG_VERBOSE)
      logger.verbose({ a: 1 })
      expect(logsWritten).toEqual([
        { level: rx.log.LOG_VERBOSE, source: 'c', message: JSON.stringify({ a: 1 }) },
      ])
    })
    it('disabled', () => {
      rx.log.setLogLevel('#c', rx.log.LOG_INFO)
      logger.verbose('abc')
      expect(logsWritten).toHaveLength(0)
    })

    describe('ifVerbose', () => {
      it('disabled', () => {
        let ran = false
        rx.log.setLogLevel('#', rx.log.LOG_INFO)
        logger.ifVerbose(() => {
          ran = true
          return '-004'
        })
        expect(logsWritten).toHaveLength(0)
        expect(ran).toBe(false)
      })
      it('enabled', () => {
        let ran = false
        rx.log.setLogLevel('#', rx.log.LOG_VERBOSE)
        logger.ifVerbose(() => {
          ran = true
          return '+004'
        })
        expect(logsWritten).toEqual([
          { level: rx.log.LOG_VERBOSE, source: 'c', message: '+004' },
        ])
        expect(ran).toBe(true)
      })
      it('enabled, object', () => {
        let ran = false
        rx.log.setLogLevel('#', rx.log.LOG_VERBOSE)
        logger.ifVerbose(() => {
          ran = true
          return ['=004']
        })
        expect(logsWritten).toEqual([
          { level: rx.log.LOG_VERBOSE, source: 'c', message: '=004' },
        ])
        expect(ran).toBe(true)
      })
    })
  })

  describe('info', () => {
    const logger = rx.log.createLogger('c')
    it('enabled', () => {
      rx.log.setLogLevel('#c', rx.log.LOG_INFO)
      logger.info(true)
      expect(logsWritten).toEqual([
        { level: rx.log.LOG_INFO, source: 'c', message: JSON.stringify(true) },
      ])
    })
    it('disabled', () => {
      rx.log.setLogLevel('#c', rx.log.LOG_WARN)
      logger.info('abc')
      expect(logsWritten).toHaveLength(0)
    })

    describe('ifInfo', () => {
      it('disabled', () => {
        let ran = false
        rx.log.setLogLevel('#', rx.log.LOG_WARN)
        logger.ifInfo(() => {
          ran = true
          return '-005'
        })
        expect(logsWritten).toHaveLength(0)
        expect(ran).toBe(false)
      })
      it('enabled', () => {
        let ran = false
        rx.log.setLogLevel('#', rx.log.LOG_INFO)
        logger.ifInfo(() => {
          ran = true
          return '+005'
        })
        expect(logsWritten).toEqual([
          { level: rx.log.LOG_INFO, source: 'c', message: '+005' },
        ])
        expect(ran).toBe(true)
      })
      it('enabled, object', () => {
        let ran = false
        rx.log.setLogLevel('#', rx.log.LOG_INFO)
        logger.ifInfo(() => {
          ran = true
          return ['=005']
        })
        expect(logsWritten).toEqual([
          { level: rx.log.LOG_INFO, source: 'c', message: '=005' },
        ])
        expect(ran).toBe(true)
      })
    })
  })

  describe('notice', () => {
    const logger = rx.log.createLogger('c')
    it('enabled', () => {
      rx.log.setLogLevel('#c', rx.log.LOG_NOTICE)
      logger.notice({ a: 1 })
      expect(logsWritten).toEqual([
        { level: rx.log.LOG_NOTICE, source: 'c', message: JSON.stringify({ a: 1 }) },
      ])
    })
    it('disabled', () => {
      rx.log.setLogLevel('#c', rx.log.LOG_ERROR)
      logger.notice('abc')
      expect(logsWritten).toHaveLength(0)
    })

    describe('ifNotice', () => {
      it('disabled', () => {
        let ran = false
        rx.log.setLogLevel('#', rx.log.LOG_ERROR)
        logger.ifNotice(() => {
          ran = true
          return '-006'
        })
        expect(logsWritten).toHaveLength(0)
        expect(ran).toBe(false)
      })
      it('enabled', () => {
        let ran = false
        rx.log.setLogLevel('#', rx.log.LOG_NOTICE)
        logger.ifNotice(() => {
          ran = true
          return '+006'
        })
        expect(logsWritten).toEqual([
          { level: rx.log.LOG_NOTICE, source: 'c', message: '+006' },
        ])
        expect(ran).toBe(true)
      })
      it('enabled, object', () => {
        let ran = false
        rx.log.setLogLevel('#', rx.log.LOG_NOTICE)
        logger.ifNotice(() => {
          ran = true
          return ['=006']
        })
        expect(logsWritten).toEqual([
          { level: rx.log.LOG_NOTICE, source: 'c', message: '=006' },
        ])
        expect(ran).toBe(true)
      })
    })
  })

  describe('warn', () => {
    const logger = rx.log.createLogger('c')
    it('enabled', () => {
      rx.log.setLogLevel('#c', rx.log.LOG_WARN)
      logger.warn(2)
      expect(logsWritten).toEqual([
        { level: rx.log.LOG_WARN, source: 'c', message: JSON.stringify(2) },
      ])
    })
    it('disabled', () => {
      rx.log.setLogLevel('#c', rx.log.LOG_ERROR)
      logger.warn('abc')
      expect(logsWritten).toHaveLength(0)
    })

    describe('ifWarn', () => {
      it('disabled', () => {
        let ran = false
        rx.log.setLogLevel('#', rx.log.LOG_ERROR)
        logger.ifWarn(() => {
          ran = true
          return '-007'
        })
        expect(logsWritten).toHaveLength(0)
        expect(ran).toBe(false)
      })
      it('enabled', () => {
        let ran = false
        rx.log.setLogLevel('#', rx.log.LOG_WARN)
        logger.ifWarn(() => {
          ran = true
          return '+007'
        })
        expect(logsWritten).toEqual([
          { level: rx.log.LOG_WARN, source: 'c', message: '+007' },
        ])
        expect(ran).toBe(true)
      })
      it('enabled, object', () => {
        let ran = false
        rx.log.setLogLevel('#', rx.log.LOG_WARN)
        logger.ifWarn(() => {
          ran = true
          return ['=007']
        })
        expect(logsWritten).toEqual([
          { level: rx.log.LOG_WARN, source: 'c', message: '=007' },
        ])
        expect(ran).toBe(true)
      })
    })
  })

  describe('error', () => {
    const logger = rx.log.createLogger('c')
    it('enabled', () => {
      rx.log.setLogLevel('#c', rx.log.LOG_ERROR)
      logger.error([2, 2], 'x', null, undefined, 'y')
      expect(logsWritten).toEqual([
        { level: rx.log.LOG_ERROR, source: 'c', message: JSON.stringify([2, 2]) + ' x <null> <null> y' },
      ])
    })
    it('disabled', () => {
      rx.log.setLogLevel('#c', rx.log.LOG_FATAL)
      logger.error('abc')
      expect(logsWritten).toHaveLength(0)
    })

    describe('ifError', () => {
      it('disabled', () => {
        let ran = false
        rx.log.setLogLevel('#', rx.log.LOG_FATAL)
        logger.ifError(() => {
          ran = true
          return '-008'
        })
        expect(logsWritten).toHaveLength(0)
        expect(ran).toBe(false)
      })
      it('enabled', () => {
        let ran = false
        rx.log.setLogLevel('#', rx.log.LOG_ERROR)
        logger.ifError(() => {
          ran = true
          return '+008'
        })
        expect(logsWritten).toEqual([
          { level: rx.log.LOG_ERROR, source: 'c', message: '+008' },
        ])
        expect(ran).toBe(true)
      })
      it('enabled, object', () => {
        let ran = false
        rx.log.setLogLevel('#', rx.log.LOG_ERROR)
        logger.ifError(() => {
          ran = true
          return ['=008']
        })
        expect(logsWritten).toEqual([
          { level: rx.log.LOG_ERROR, source: 'c', message: '=008' },
        ])
        expect(ran).toBe(true)
      })
    })
  })

  describe('fatal', () => {
    const logger = rx.log.createLogger('c')
    // Can't be disabled...
    it('enabled', () => {
      rx.log.setLogLevel('#c', rx.log.LOG_FATAL)
      logger.fatal('a ', 'b')
      expect(logsWritten).toEqual([
        { level: rx.log.LOG_FATAL, source: 'c', message: 'a b' },
      ])
    })
    it('enabled, exception', () => {
      const err = new Error('the exception')
      rx.log.setLogLevel('#c', rx.log.LOG_FATAL)
      logger.fatal('a', err)
      expect(logsWritten).toEqual([
        { level: rx.log.LOG_FATAL, source: 'c', message: `a Error: the exception\n${err.stack}` },
      ])
    })
    describe('ifFatal', () => {
      it('enabled', () => {
        rx.log.setLogLevel('#c', rx.log.LOG_FATAL)
        let ran = false
        logger.ifFatal(() => {
          ran = true
          return 'ab'
        })
        expect(logsWritten).toEqual([
          { level: rx.log.LOG_FATAL, source: 'c', message: 'ab' },
        ])
        expect(ran).toBe(true)
      })
      it('enabled, object', () => {
        rx.log.setLogLevel('#c', rx.log.LOG_FATAL)
        let ran = false
        logger.ifFatal(() => {
          ran = true
          return ['ab']
        })
        expect(logsWritten).toEqual([
          { level: rx.log.LOG_FATAL, source: 'c', message: 'ab' },
        ])
        expect(ran).toBe(true)
      })
    })
  })

  describe('setLogLevel', () => {
    it('sub-level', () => {
      rx.log.setLogLevel('a/b', rx.log.LOG_ERROR)
      const levels = log.unittest_getLogLevels()
      expect(levels['#a.b']).toBeDefined()
      expect(levels['#a.b'].error).toBe(true)
      expect(levels['#a.b'].warn).toBe(false)
    })
    it('root', () => {
      rx.log.setLogLevel('#', rx.log.LOG_ERROR)
      const levels = log.unittest_getLogLevels()
      expect(levels['#']).toBeDefined()
      expect(levels['#'].error).toBe(true)
      expect(levels['#'].warn).toBe(false)
    })
    it('empty', () => {
      rx.log.setLogLevel('', rx.log.LOG_ERROR)
      const levels = log.unittest_getLogLevels()
      expect(levels['']).toBeUndefined()
      expect(levels['#']).toBeDefined()
      expect(levels['#'].error).toBe(true)
      expect(levels['#'].warn).toBe(false)
    })
  })
})
