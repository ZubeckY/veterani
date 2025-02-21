import swaggerJsdoc from "swagger-jsdoc";

import swaggerUi from "swagger-ui-express";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API документация",
            version: "1.0.0",
            description: "Документация API с использованием Swagger",
        },
        servers: [
            {
                url: "http://localhost:4000", // Укажите URL вашего API
            },
        ],
    },
    apis: ["./controllers/"], // Пути к файлам с аннотациями
};

const swaggerSpec = swaggerJsdoc(options);

export function setupSwagger(app:any) {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}