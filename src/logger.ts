import winston from "winston";
import stripAnsi from "strip-ansi";

const { combine, timestamp, printf } = winston.format;

const defaultFormater = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
});

const debugFormat = printf(({ message }) => message);

const formater = printf(({ timestamp, message }) => {
    return `${timestamp} ${stripAnsi(message)}`;
})

const format = combine(
    timestamp(),
    formater
);

const dafaultFormat = combine(
    timestamp(),
    defaultFormater
)

export const httpLogger = winston.createLogger({
    level: 'http',
    format: format,
    transports: [
        new winston.transports.File({ filename: `${__dirname}/../log/http.log` })
    ]
});

export const databaseLogger = winston.createLogger({
    level: 'info',
    format: format,
    transports: [
        new winston.transports.File({ filename: `${__dirname}/../log/database.log`})
    ]
});

export const defaultLogger = winston.createLogger({
    level: 'info',
    format: dafaultFormat,
    transports: [
        new winston.transports.File({ filename: `${__dirname}/../log/default.log`}),
        new winston.transports.File({ filename: `${__dirname}/../log/error.log`, level: 'error'})
    ]
});

if (process.env.NODE_ENV !== 'production') {
    httpLogger.add(new winston.transports.Console({ format: debugFormat}));
    databaseLogger.add(new winston.transports.Console({ format: debugFormat }));
    defaultLogger.add(new winston.transports.Console());
}