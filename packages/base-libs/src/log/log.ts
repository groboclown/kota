
export const LOG_UNIT_TEST = 'unit-test'
export type LOG_UNIT_TEST = 'unit-test'
export const LOG_TRACE = 'trace'
export type LOG_TRACE = 'trace'
export const LOG_DEBUG = 'debug'
export type LOG_DEBUG = 'debug'
export const LOG_VERBOSE = 'verbose'
export type LOG_VERBOSE = 'verbose'
export const LOG_INFO = 'info'
export type LOG_INFO = 'info'
export const LOG_NOTICE = 'notice'
export type LOG_NOTICE = 'notice'

// These levels shouldn't be just log; they need a UI component too.
export const LOG_WARN = 'warn'
export type LOG_WARN = 'warn'
export const LOG_ERROR = 'error'
export type LOG_ERROR = 'error'
export const LOG_FATAL = 'fatal'
export type LOG_FATAL = 'fatal'

const DEFAULT_LOG_LEVEL = LOG_INFO

export type LOG_LEVELS =
  LOG_UNIT_TEST | LOG_TRACE | LOG_DEBUG |
  LOG_VERBOSE | LOG_INFO | LOG_NOTICE |
  LOG_WARN | LOG_ERROR | LOG_FATAL

interface LogLevel {
  unitTest: boolean
  trace: boolean
  debug: boolean
  verbose: boolean
  info: boolean
  warn: boolean
  error: boolean
}

const LOG_LEVEL_VALUES: { [key: string]: LogLevel } = {
  [LOG_UNIT_TEST]: { unitTest: true, trace: false, debug: false, verbose: false, info: false, warn: true, error: true },
  [LOG_TRACE]: { unitTest: false, trace: true, debug: true, verbose: true, info: true, warn: true, error: true },
  [LOG_DEBUG]: { unitTest: false, trace: false, debug: true, verbose: true, info: true, warn: true, error: true },
  [LOG_VERBOSE]: { unitTest: false, trace: false, debug: false, verbose: true, info: true, warn: true, error: true },
  [LOG_INFO]: { unitTest: false, trace: false, debug: false, verbose: false, info: true, warn: true, error: true },
  [LOG_NOTICE]: { unitTest: false, trace: false, debug: false, verbose: false, info: false, warn: true, error: true },
  [LOG_WARN]: { unitTest: false, trace: false, debug: false, verbose: false, info: false, warn: true, error: true },
  [LOG_ERROR]: { unitTest: false, trace: false, debug: false, verbose: false, info: false, warn: false, error: true },
  [LOG_FATAL]: { unitTest: false, trace: false, debug: false, verbose: false, info: false, warn: false, error: false },
}

export interface Logger {
  unitTest(...msg: any[]): void
  trace(...msg: any[]): void
  debug(...msg: any[]): void
  verbose(...msg: any[]): void
  info(...msg: any[]): void
  notice(...msg: any[]): void
  warn(...msg: any[]): void
  error(...msg: any[]): void
  fatal(...msg: any[]): void

  ifUnitTest(f: () => string | any[]): void
  ifTrace(f: () => string | any[]): void
  ifDebug(f: () => string | any[]): void
  ifVerbose(f: () => string | any[]): void
  ifInfo(f: () => string | any[]): void
  ifNotice(f: () => string | any[]): void
  ifWarn(f: () => string | any[]): void
  ifError(f: () => string | any[]): void
  ifFatal(f: () => string | any[]): void
}

const LOG_SETTINGS: { [key: string]: LogLevel } = {
  '#': LOG_LEVEL_VALUES[DEFAULT_LOG_LEVEL]
}

export function setLogLevel(source: string, level: LOG_LEVELS): void {
  if (source.length <= 0) {
    LOG_SETTINGS['#'] = LOG_LEVEL_VALUES[level]
    return
  }

  source = source.replace('/', '.')
  if (source[0] !== '#') {
    source = '#' + source
  }
  LOG_SETTINGS[source] = LOG_LEVEL_VALUES[level]
}


/** A replaceable logger implementation. */
export type LogWriter = (level: LOG_LEVELS, source: string, message: string) => void
const DEFAULT_LOG_WRITER: LogWriter = (level: LOG_LEVELS, source: string, message: string): void => {
  console.log(`[${level}] ${source} :: ${message}`)
}
let LOG_WRITER: LogWriter = DEFAULT_LOG_WRITER
export function setLogWriter(writer: LogWriter): void {
  LOG_WRITER = writer
}

// Unit Test Support Functions
export function unittest_resetLogWriter(): void {
  LOG_WRITER = DEFAULT_LOG_WRITER
}
export function unittest_getLogLevels(): { [key: string]: LogLevel } {
  return { ...LOG_SETTINGS }
}
export function unittest_resetLogLevels(settings: { [key: string]: LogLevel }): void {
  const currentKeys = Object.keys(LOG_SETTINGS)
  currentKeys.forEach(k => delete LOG_SETTINGS[k])
  Object.keys(settings).forEach(k => { LOG_SETTINGS[k] = settings[k] })
}

/**
 * 
 * @param source the source of the logger, used for changing the log level at precise levels; must be '.' or '/' separated.
 */
export function createLogger(source: string): Logger {
  return new LoggerImpl(source)
}

class LoggerImpl implements Logger {
  private readonly levels: string[]
  private readonly source: string

  constructor(level: string) {
    let lv = []
    const parts = level.split(/\.|\//)
    this.source = parts.join('.')
    let path = '#' + parts[0]
    lv.push(path)
    for (let i = 1; i < parts.length; i++) {
      path = path + '.' + parts[i]
      lv.push(path)
    }
    this.levels = lv.reverse()
  }

  private getSetting(): LogLevel {
    for (let i = 0; i < this.levels.length; i++) {
      const x = LOG_SETTINGS[this.levels[i]]
      if (x) {
        return x
      }
    }
    return LOG_SETTINGS['#']
  }

  private format(msg: any[]): string {
    return msg.reduce((prev, curr) => {
      if (prev.length > 0 && prev[prev.length - 1] != ' ') {
        prev += ' '
      }
      if (curr === undefined || curr === null) {
        return prev + '<null>'
      }
      if (typeof curr === 'string') {
        return prev + curr
      }
      if (typeof curr === 'number' || typeof curr === 'boolean') {
        return prev + String(curr)
      }
      if (curr instanceof Error) {
        let r = prev + curr.constructor.name + ': ' + curr.message
        if (typeof curr.stack === 'string') {
          r = r + curr.stack
        }
        return r
      }
      return prev + JSON.stringify(curr)
    }, '')
  }

  unitTest(...msg: any[]): void {
    if (this.getSetting().unitTest) {
      LOG_WRITER(LOG_UNIT_TEST, this.source, this.format(msg))
    }
  }

  trace(...msg: any[]): void {
    if (this.getSetting().trace) {
      LOG_WRITER(LOG_TRACE, this.source, this.format(msg))
    }
  }

  debug(...msg: any[]): void {
    if (this.getSetting().debug) {
      LOG_WRITER(LOG_DEBUG, this.source, this.format(msg))
    }
  }

  verbose(...msg: any[]): void {
    if (this.getSetting().verbose) {
      LOG_WRITER(LOG_VERBOSE, this.source, this.format(msg))
    }
  }

  info(...msg: any[]): void {
    if (this.getSetting().info) {
      LOG_WRITER(LOG_INFO, this.source, this.format(msg))
    }
  }

  notice(...msg: any[]): void {
    // Notice how notice is different!
    if (this.getSetting().warn) {
      LOG_WRITER(LOG_NOTICE, this.source, this.format(msg))
    }
  }

  warn(...msg: any[]): void {
    if (this.getSetting().warn) {
      LOG_WRITER(LOG_WARN, this.source, this.format(msg))
    }
  }

  error(...msg: any[]): void {
    if (this.getSetting().error) {
      LOG_WRITER(LOG_ERROR, this.source, this.format(msg))
    }
  }

  fatal(...msg: any[]): void {
    // Always log fatal.
    LOG_WRITER(LOG_FATAL, this.source, this.format(msg))
  }

  ifUnitTest(f: () => string | any[]): void {
    if (this.getSetting().unitTest) {
      const v = f()
      if (typeof v === 'string') {
        LOG_WRITER(LOG_UNIT_TEST, this.source, v)
      } else {
        LOG_WRITER(LOG_UNIT_TEST, this.source, this.format(v))
      }
    }
  }
  ifTrace(f: () => string | any[]): void {
    if (this.getSetting().trace) {
      const v = f()
      if (typeof v === 'string') {
        LOG_WRITER(LOG_TRACE, this.source, v)
      } else {
        LOG_WRITER(LOG_TRACE, this.source, this.format(v))
      }
    }
  }
  ifDebug(f: () => string | any[]): void {
    if (this.getSetting().debug) {
      const v = f()
      if (typeof v === 'string') {
        LOG_WRITER(LOG_DEBUG, this.source, v)
      } else {
        LOG_WRITER(LOG_DEBUG, this.source, this.format(v))
      }
    }
  }
  ifVerbose(f: () => string | any[]): void {
    if (this.getSetting().verbose) {
      const v = f()
      if (typeof v === 'string') {
        LOG_WRITER(LOG_VERBOSE, this.source, v)
      } else {
        LOG_WRITER(LOG_VERBOSE, this.source, this.format(v))
      }
    }
  }
  ifInfo(f: () => string | any[]): void {
    if (this.getSetting().info) {
      const v = f()
      if (typeof v === 'string') {
        LOG_WRITER(LOG_INFO, this.source, v)
      } else {
        LOG_WRITER(LOG_INFO, this.source, this.format(v))
      }
    }
  }
  ifNotice(f: () => string | any[]): void {
    // !!!
    if (this.getSetting().warn) {
      const v = f()
      if (typeof v === 'string') {
        LOG_WRITER(LOG_NOTICE, this.source, v)
      } else {
        LOG_WRITER(LOG_NOTICE, this.source, this.format(v))
      }
    }
  }
  ifWarn(f: () => string | any[]): void {
    if (this.getSetting().warn) {
      const v = f()
      if (typeof v === 'string') {
        LOG_WRITER(LOG_WARN, this.source, v)
      } else {
        LOG_WRITER(LOG_WARN, this.source, this.format(v))
      }
    }
  }
  ifError(f: () => string | any[]): void {
    if (this.getSetting().error) {
      const v = f()
      if (typeof v === 'string') {
        LOG_WRITER(LOG_ERROR, this.source, v)
      } else {
        LOG_WRITER(LOG_ERROR, this.source, this.format(v))
      }
    }
  }
  ifFatal(f: () => string | any[]): void {
    // Always log fatal
    const v = f()
    if (typeof v === 'string') {
      LOG_WRITER(LOG_FATAL, this.source, v)
    } else {
      LOG_WRITER(LOG_FATAL, this.source, this.format(v))
    }
  }
}
