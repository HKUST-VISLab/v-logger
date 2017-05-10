export default class LogLevel extends Number {
    public static readonly VERBOSE: LogLevel = 0;
    public static readonly DEBUG: LogLevel = 10;
    public static readonly INFO: LogLevel = 20;
    public static readonly WARN: LogLevel = 30;
    public static readonly ERROR: LogLevel = 40;
    public static readonly CRITICAL: LogLevel = 50;
    public static addLogLevel(levelName: string, value: LogLevel): void {
        if (Object.prototype.hasOwnProperty.call(LogLevel.name2value, levelName)) {
            throw new Error(`LogLevel already has name ${levelName}!`);
        }
        LogLevel.name2value[levelName] = value;
    }
    public static getLevelValue(level: string | LogLevel): LogLevel {
        if (level instanceof LogLevel) {
            return level;
        }
        if (Object.prototype.hasOwnProperty.call(LogLevel.name2value, level)) {
            return this.name2value[level];
        }
        throw new Error(`No level named ${level}!`);
    }
    private static name2value: {[levelName: string]: LogLevel} = {
        VERBOSE: LogLevel.VERBOSE,
        DEBUG: LogLevel.DEBUG,
        INFO: LogLevel.INFO,
        WARN: LogLevel.WARN,
        ERROR: LogLevel.ERROR,
        CRITICAL: LogLevel.CRITICAL,
    };
}
