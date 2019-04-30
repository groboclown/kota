
import * as _log from './log'

/**
 * Export only the "public" API sections of the log module.
 */
export namespace log {
  export const LOG_UNIT_TEST = _log.LOG_UNIT_TEST
  export type LOG_UNIT_TEST = _log.LOG_UNIT_TEST
  export const LOG_TRACE = _log.LOG_TRACE
  export type LOG_TRACE = _log.LOG_TRACE
  export const LOG_DEBUG = _log.LOG_DEBUG
  export type LOG_DEBUG = _log.LOG_DEBUG
  export const LOG_VERBOSE = _log.LOG_VERBOSE
  export type LOG_VERBOSE = _log.LOG_VERBOSE
  export const LOG_INFO = _log.LOG_INFO
  export type LOG_INFO = _log.LOG_INFO
  export const LOG_NOTICE = _log.LOG_NOTICE
  export type LOG_NOTICE = _log.LOG_NOTICE
  export const LOG_WARN = _log.LOG_WARN
  export type LOG_WARN = _log.LOG_WARN
  export const LOG_ERROR = _log.LOG_ERROR
  export type LOG_ERROR = _log.LOG_ERROR
  export const LOG_FATAL = _log.LOG_FATAL
  export type LOG_FATAL = _log.LOG_FATAL
  export type LOG_LEVELS = _log.LOG_LEVELS

  export type LogWriter = _log.LogWriter
  export type Logger = _log.Logger
  export const createLogger = _log.createLogger
  export const setLogLevel = _log.setLogLevel
  export const setLogWriter = _log.setLogWriter
}
