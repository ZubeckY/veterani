const is_prod = true

const config: any = {
    prod: is_prod,
    port: 4000,
    // DB
    DB_PORT: 5432,
    DB_HOST: dbHost(),
    DB_TYPE: "postgres",
    DB_USERNAME: dbUsername(),
    DB_PASSWORD: dbPassword(),
    DB_DATABASE: dbDATABASE(),
    //jwt
    JWT_EXPIRES_IN: {
        ACCESS: "15m",
        REFRESH: "24h",
    },
    JWT_ACCESS_SECRET: 'jwt-secret-access',
    JWT_REFRESH_SECRET: 'jwt-secret-refresh',
    //SMTP
    SMTP_HOST: "smtp.beget.com",
    SMTP_PORT: 2525,
    SMTP_USER: "test_for_smtp@databasepostgresqlprojectslink12cdf158c3a6028e6fd9a866bddaso1a.ru",
    SMTP_PASSWORD: "4IoE2LMg%Wrf"
}

export default config

function dbHost(): string {
    return is_prod ? '31.129.98.120' : 'localhost'
}

function dbUsername(): string {
    return is_prod ? 'serverUser' : 'postgres'
}

function dbPassword(): string {
    return is_prod ? 'mQBeWsb134' : '1234root'
}

function dbDATABASE(): string {
    return is_prod ? 'UoCV' : 'testForm'
}
