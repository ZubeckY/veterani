/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Авторизация пользователя
 *     description: Вход в систему по email и паролю. Возвращает accessToken и refreshToken.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               model:
 *                 type: object
 *                 properties:
 *                   email:
 *                     type: string
 *                     format: email
 *                     example: "user@example.com"
 *                   password:
 *                     type: string
 *                     format: password
 *                     example: "P@ssw0rd!"
 *     responses:
 *       200:
 *         description: Успешный вход в систему
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsIn..."
 *       400:
 *         description: Неверный email или пароль
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Неверный пароль"
 *       501:
 *         description: Ошибка создания токена
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Ошибка создания токена"
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */


/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Регистрация пользователя
 *     description: Создание нового аккаунта, отправка кода активации на email.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               model:
 *                 type: object
 *                 properties:
 *                   firstName:
 *                     type: string
 *                     example: "Иван"
 *                   lastName:
 *                     type: string
 *                     example: "Иванов"
 *                   middleName:
 *                     type: string
 *                     example: "Иванович"
 *                   email:
 *                     type: string
 *                     format: email
 *                     example: "user@example.com"
 *                   password:
 *                     type: string
 *                     format: password
 *                     example: "P@ssw0rd!"
 *     responses:
 *       200:
 *         description: Успешная регистрация, возвращает accessToken
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsIn..."
 *       400:
 *         description: Ошибка ввода (пустые поля, email уже существует)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Пользователь с такой почтой уже существует"
 *       501:
 *         description: Ошибка сервера или создания токена
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "ошибка создания токена"
 */


/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Обновление токена
 *     description: Пока ничего.
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Успешное обновление токена.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "ping - pong"
 *       501:
 *         description: Внутренняя ошибка сервера.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Ошибка"
 */


/**
 * @swagger
 * /auth/lk:
 *   get:
 *     summary: Получить данные текущего пользователя
 *     description: Проверяет токен из cookie и возвращает данные пользователя без конфиденциальной информации.
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Данные текущего пользователя.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "123e4567-e89b-12d3-a456-426614174000"
 *                     firstName:
 *                       type: string
 *                       example: "Иван"
 *                     lastName:
 *                       type: string
 *                       example: "Иванов"
 *                     email:
 *                       type: string
 *                       example: "user@example.com"
 *                     rolePublic:
 *                       type: string
 *                       example: "Администратор"
 *       401:
 *         description: Токен не найден или пользователь не найден.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Токен не найден. Код ошибки - 1020"
 *       501:
 *         description: Внутренняя ошибка сервера.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Ошибка"
 */


/**
 * @swagger
 * /auth/user/:id:
 *   get:
 *     summary: Получить данные другого пользователя
 *     description: Получение информации о пользователе по ID. Конфиденциальные данные удаляются перед отправкой.
 *     tags: [Auth]
 *     parameters:
 *       - name: id
 *         in: params
 *         description: Идентификатор пользователя.
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Данные пользователя.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "123e4567-e89b-12d3-a456-426614174000"
 *                     firstName:
 *                       type: string
 *                       example: "Иван"
 *                     lastName:
 *                       type: string
 *                       example: "Иванов"
 *                     email:
 *                       type: string
 *                       example: "user@example.com"
 *                     rolePublic:
 *                       type: string
 *                       example: "Пользователь"
 *       400:
 *         description: Неверно указан ID пользователя.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Не указан пользователь"
 *       404:
 *         description: Пользователь не найден.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Пользователь не найден"
 *       501:
 *         description: Внутренняя ошибка сервера.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Ошибка"
 */