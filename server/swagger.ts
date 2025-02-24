import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import config from "./config";

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API Documentation",
            version: "1.0.0",
            description: "Документация API с использованием Swagger",
        },
    },
    apis: ["./controllers/**/*.ts"], // Указываем путь к маршрутам с аннотациями
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
    if (config.prod) {
        return console.log("❌ Swagger отключен в продакшене");
    }

    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log("📄 Swagger доступен по адресу: http://localhost:4000/api-docs");
};
