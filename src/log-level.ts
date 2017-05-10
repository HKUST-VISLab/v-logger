export default class LogLevel extends Number {
    public static readonly VERBOSE = new LogLevel("VERBOSE", 0);
    public static readonly DEBUG = new LogLevel("DEBUG", 10);
    public static readonly INFO = new LogLevel("INFO", 20);
    public static readonly WARN = new LogLevel("WARN", 30);
    public static readonly ERROR = new LogLevel("ERROR", 40);
    public static readonly CRITICAL = new LogLevel("CRITICAL", 50);
    public static addLevel(levelName: string, value: number): void {
        if (Object.prototype.hasOwnProperty.call(LogLevel.name2value, levelName)) {
            throw new Error(`LogLevel already has name ${levelName}!`);
        }
        LogLevel.name2value[levelName] = new LogLevel(levelName, value);
    }
    public static getLevel(level: string | LogLevel): LogLevel {
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
    private name: string;
    private constructor(name: string, value: number) {
        super(value);
        this.name = name;
    }
    public toString(): string {
        return this.name;
    }

}
