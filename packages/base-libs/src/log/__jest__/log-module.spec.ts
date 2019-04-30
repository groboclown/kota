
// Test out how the log as a module works.

import * as root from '../../'
import * as log from '../log'

describe('from the root module', () => {
  let logsWritten = 0
  let logSettings = {}
  beforeEach(() => {
    logSettings = log.unittest_getLogLevels()
    root.log.setLogWriter((): void => {
      logsWritten += 1
    })
  })
  afterEach(() => {
    log.unittest_resetLogWriter()
    log.unittest_resetLogLevels(logSettings)
  })
  describe('use the log', () => {
    it('with a simple debug', () => {
      const logger = root.log.createLogger('a.b.c')
      root.log.setLogLevel('#a.b.c', root.log.LOG_TRACE)
      logger.debug('000')
      expect(logsWritten).toBe(1)
    })
  })
})
