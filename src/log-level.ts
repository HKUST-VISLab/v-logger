export default class LogLevel {
    public static readonly verbose = 0;
    public static readonly debug = 10;
    public static readonly info = 20;
    public static readonly warn = 30;
    public static readonly error = 40;
    public static readonly critical = 50;
    public static addLogLevel(levelName: string, value: number): void {
        if (Object.prototype.hasOwnProperty.call(LogLevel.name2value, levelName)) {
            throw new Error(`LogLevel already has name ${levelName}!`);
        }
        LogLevel.name2value[levelName] = value;
    }
    public static getLevelValue(levelName: string): number {
        if (Object.prototype.hasOwnProperty.call(LogLevel.name2value, levelName)) {
            return this.name2value[levelName];
        }
        throw new Error(`No level named ${levelName}!`);
    }
    private static name2value: {[levelName: string]: number} = {
        VERBOSE: LogLevel.verbose,
        DEBUG: LogLevel.debug,
        INFO: LogLevel.info,
        WARN: LogLevel.warn,
        ERROR: LogLevel.error,
        CRITICAL: LogLevel.critical,
    };
}
