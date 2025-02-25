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
