const is_prod = true

const config: any = {
    prod: is_prod,
    port: ENV_VAL("PORT"),
    // DB
    DB_PORT: ENV_VAL('DATABASE_PORT'),
    DB_HOST: dbHost(),
    DB_TYPE: ENV_VAL('DATABASE_TYPE'),
    DB_USERNAME: dbUsername(),
    DB_PASSWORD: dbPassword(),
    DB_DATABASE: dbDATABASE(),
    //jwt
    JWT_EXPIRES_IN: {
        ACCESS: ENV_VAL('JWT_EXPIRES_IN_ACCESS'),
        REFRESH: ENV_VAL('JWT_EXPIRES_IN_REFRESH')
    },
    JWT_ACCESS_SECRET: ENV_VAL('JWT_ACCESS_SECRET'),
    JWT_REFRESH_SECRET: ENV_VAL('JWT_REFRESH_SECRET'),
    //SMTP
    SMTP_HOST: ENV_VAL("SMTP_HOST"),
    SMTP_PORT: ENV_VAL("SMTP_PORT"),
    SMTP_USER: ENV_VAL("SMTP_USER"),
    SMTP_PASSWORD: ENV_VAL("SMTP_PASSWORD"),
}

export default config

function ENV_VAL(key: string): string {
    const evnValue = process.env[key] ?? null

    if (!evnValue) {
        throw new Error("Значение: " + key + " - не было указано!")
    }

    return evnValue
}

function dbHost(): string {
    return is_prod ? ENV_VAL('DATABASE_HOST_PROD') : ENV_VAL('DATABASE_HOST_DEV')
}

function dbUsername(): string {
    return is_prod ? ENV_VAL('DATABASE_USERNAME_PROD') : ENV_VAL('DATABASE_USERNAME_DEV')
}

function dbPassword(): string {
    return is_prod ? ENV_VAL('DATABASE_PASSWORD_PROD') : ENV_VAL('DATABASE_PASSWORD_DEV')
}

function dbDATABASE(): string {
    return is_prod ? ENV_VAL('DATABASE_DATABASE_PROD') : ENV_VAL('DATABASE_DATABASE_DEV')
}
