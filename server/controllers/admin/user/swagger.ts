/**
 * @swagger
 * /admin/user/block/:id
 *   post:
 *     summary: Блокировка или разблокировка пользователя
 *     description: Администратор может заблокировать или разблокировать пользователя по его ID.
 *     tags:
 *       - Admin
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID пользователя, которого нужно заблокировать/разблокировать
 *     responses:
 *       200:
 *         description: Статус блокировки успешно изменён
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Пользователь успешно заблокирован"
 *       400:
 *         description: Некорректный ID пользователя
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Некорректный ID пользователя"
 *       404:
 *         description: Пользователь не найден
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Пользователь не найден"
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Ошибка операции"
 *     security:
 *       - BearerAuth: []
 */

/**
 * @swagger
 * /admin/user/list:
 *   get:
 *     summary: Получить список пользователей
 *     tags:
 *       - Администратор
 *     security:
 *       - BearerAuth: []
 *     description: Эндпоинт позволяет администратору получить список пользователей с поддержкой пагинации.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Номер страницы (по умолчанию 1)
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Количество пользователей на странице (по умолчанию 10)
 *     responses:
 *       200:
 *         description: Успешный ответ. Возвращает список пользователей.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       firstName:
 *                         type: string
 *                         example: "Иван"
 *                       lastName:
 *                         type: string
 *                         example: "Петров"
 *                       email:
 *                         type: string
 *                         example: "ivan.petrov@example.com"
 *                       role:
 *                         type: string
 *                         example: "admin"
 *                       created:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-01-15T12:00:00Z"
 *                       activated:
 *                         type: boolean
 *                         example: true
 *                       block:
 *                         type: boolean
 *                         example: false
 *       400:
 *         description: Некорректный запрос (например, неправильные параметры пагинации).
 *       401:
 *         description: Ошибка аутентификации. Отсутствует или недействительный токен.
 *       403:
 *         description: Доступ запрещен. Пользователь не является администратором.
 *       500:
 *         description: Ошибка сервера.
 */


/**
 * @swagger
 * /admin/user/{id}:
 *   get:
 *     summary: Получить информацию о пользователе по ID
 *     tags:
 *       - Администратор
 *     security:
 *       - BearerAuth: []
 *     description: Эндпоинт позволяет администратору получить данные конкретного пользователя по его ID.
 *     parameters:
 *       - in: params
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID пользователя
 *     responses:
 *       200:
 *         description: Успешный ответ. Возвращает данные пользователя.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userDTO:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     firstName:
 *                       type: string
 *                       example: "Иван"
 *                     lastName:
 *                       type: string
 *                       example: "Петров"
 *                     email:
 *                       type: string
 *                       example: "ivan.petrov@example.com"
 *                     role:
 *                       type: string
 *                       example: "admin"
 *                     created:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-01-15T12:00:00Z"
 *                     activated:
 *                       type: boolean
 *                       example: true
 *                     block:
 *                       type: boolean
 *                       example: false
 *       400:
 *         description: Некорректный запрос (например, id не является числом).
 *       404:
 *         description: Пользователь не найден.
 *       401:
 *         description: Ошибка аутентификации. Отсутствует или недействительный токен.
 *       403:
 *         description: Доступ запрещен. Пользователь не является администратором.
 *       500:
 *         description: Ошибка сервера.
 */



/**
 * @swagger
 * /admin/user/role-list/:
 *   post:
 *     summary: Получение списка ролей пользователей
 *     description: Возвращает список доступных ролей пользователей в системе.
 *     tags:
 *       - Admin
 *     responses:
 *       200:
 *         description: Успешный ответ с массивом ролей
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 roles:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       key:
 *                         type: string
 *                         example: "admin"
 *                       value:
 *                         type: string
 *                         example: "Администратор"
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "error"
 *     security:
 *       - BearerAuth: []
 */
