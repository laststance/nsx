// from https://github.com/Lucaslah/inklog.js/blob/906ebbaadcfe2d2230860183d2472f4c831a3710/src/index.ts
/* eslint-disable no-console  */
import chalk from 'chalk'

/**
 * A Chalk Based Logger
 * @constructor
 */
class Logger {
  public noColor: boolean
  private base: typeof chalk.black
  private logNoColor: typeof chalk.white
  public noPrefix: boolean
  private green: typeof chalk.green
  private yellow: typeof chalk.yellow
  private red: typeof chalk.red
  private cyan: typeof chalk.cyan
  constructor() {
    this.noColor = false
    this.base = chalk.black
    this.logNoColor = chalk.white
    this.noPrefix = false

    // Colors
    this.green = chalk.green
    this.yellow = chalk.yellow
    this.red = chalk.red
    this.cyan = chalk.cyan
  }

  /**
   * Removes the Color from all the Log Levels
   * @type {void}
   */
  public NoColor() {
    this.noColor = true
  }

  /**
   * Removes the Prefix from all the Log Levels
   * @type {void}
   */
  public NoPrefix() {
    this.noPrefix = true
  }

  /**
   * Adds the Prefix to all the Log Levels
   * @type {void}
   */
  public AddPrefix() {
    this.noPrefix = false
  }

  /**
   * Add's Color to all the Log Levels
   * @type {void}
   */
  public AddColor() {
    this.noColor = false
  }

  // Loggers

  /**
   * Basic Log, Prefix: [LOG]
   * @param  {...any} args
   */
  public log(...args: any[]) {
    if (this.noPrefix) {
      console.log(this.logNoColor(args))
    } else {
      console.log('[LOG] ' + this.logNoColor(args))
    }
  }

  /**
   * Log Info, Color: Green, Prefix: [INFO]
   * @param  {...any} args
   */
  public info(...args: any[]) {
    if (this.noColor) {
      if (this.noPrefix) {
        console.log(this.logNoColor(args))
      } else {
        console.log('[INFO] ' + this.logNoColor(args))
      }
    } else {
      if (this.noPrefix) {
        console.log(this.green(args))
      } else {
        console.log(this.base.bgGreen('[INFO]') + ' ' + this.green(args))
      }
    }
  }

  /**
   * Log Warn, Color: Yellow, Prefix: [INFO]
   * @param  {...any} args
   */
  public warn(...args: any[]) {
    if (this.noColor) {
      if (this.noPrefix) {
        console.log(this.logNoColor(args))
      } else {
        console.log('[WARN] ' + this.logNoColor(args))
      }
    } else {
      if (this.noPrefix) {
        console.log(this.yellow(args))
      } else {
        console.log(this.base.bgYellow('[WARN]') + ' ' + this.yellow(args))
      }
    }
  }

  /**
   * Log Error, Color: Red, Prefix: [ERROR]
   * @param  {...any} args
   */
  public error(...args: any[]) {
    if (this.noColor) {
      if (this.noPrefix) {
        console.log(this.logNoColor(args))
      } else {
        console.log('[ERROR] ' + this.logNoColor(args))
      }
    } else {
      if (this.noPrefix) {
        console.log(this.red(args))
      } else {
        console.log(this.base.bgRed('[ERROR]') + ' ' + this.red(args))
      }
    }
  }

  /**
   * Log Debug, Color: Cyan, Prefix: [DEBUG]
   * @param  {...any} args
   */
  public debug(...args: any[]) {
    if (this.noColor) {
      if (this.noPrefix) {
        console.log(this.logNoColor(args))
      } else {
        console.log('[DEBUG] ' + this.logNoColor(args))
      }
    } else {
      if (this.noPrefix) {
        console.log(this.cyan(args))
      } else {
        console.log(this.base.bgCyan('[DEBUG]') + ' ' + this.cyan(args))
      }
    }
  }
}

const logger: Logger = new Logger()

export default logger
