/**
 * @swagger
 * /post/list:
 *   get:
 *     summary: Получить список постов
 *     description: Возвращает список опубликованных постов с пагинацией.
 *     tags: [Blogs]  # Группа для постов
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Количество страниц (по умолчанию 1)
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Количество постов на странице (по умолчанию 10)
 *     responses:
 *       200:
 *         description: Список постов успешно получен
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   headLine:
 *                     type: string
 *                     example: "Заголовок поста"
 *                   text:
 *                     type: string
 *                     example: "Текст поста"
 *                   published:
 *                     type: boolean
 *                     example: true
 *                   user:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 5
 *                       firstName:
 *                         type: string
 *                         example: "user123"
 *                       lastName:
 *                          type: string
 *                          example: "user123"
 *       503:
 *         description: Ошибка сервера
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
 * /post/:link:
 *   get:
 *     summary: Получить отдельный пост
 *     description: Возвращает один пост по его уникальному идентификатору (ссылке)
 *     tags: [Blogs]  # Группа для постов
 *     parameters:
 *       - in: params
 *         name: link
 *         schema:
 *           type: string
 *         description: Уникальная ссылка (ID) поста
 *     responses:
 *       200:
 *         description: Пост успешно получен
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 title:
 *                   type: string
 *                   example: "Заголовок поста"
 *                 content:
 *                   type: string
 *                   example: "Текст поста"
 *                 author:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 42
 *                     name:
 *                       type: string
 *                       example: "Иван Иванов"
 *       404:
 *         description: Пост не найден
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Пост не найден"
 *       503:
 *         description: Ошибка сервера
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
 * /post/create:
 *   post:
 *     summary: Создать новый пост
 *     description: Доступно только для авторизованных пользователей (менеджеров и администраторов). Пост может быть опубликован сразу или отправлен на модерацию.
 *     tags: [Blogs]  # Группа для постов
 *     security:
 *       - cookieAuth: []  # Передача токена через куки
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
 *                   headLine:
 *                     type: string
 *                     example: "Заголовок поста"
 *                   text:
 *                     type: string
 *                     example: "Текст поста"
 *                   includesSlider:
 *                     type: boolean
 *                     example: true
 *     responses:
 *       200:
 *         description: Пост успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 headLine:
 *                   type: string
 *                   example: "Заголовок поста"
 *                 text:
 *                   type: string
 *                   example: "Текст поста"
 *                 link:
 *                   type: string
 *                   example: "zagolovok-posta"
 *                 published:
 *                   type: boolean
 *                   example: false
 *       400:
 *         description: Некорректные данные (пустые поля)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Пустое значение"
 *       401:
 *         description: Пользователь не авторизован или нет доступа
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Токен не найден. Код ошибки - 1020"
 *       503:
 *         description: Ошибка сервера
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
 * /post/delete/:link:
 *   delete:
 *     summary: Удалить пост
 *     description: Удалить пост может только его автор или администратор/менеджер.
 *     tags: [Blogs]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: params
 *         name: link
 *         required: true
 *         schema:
 *           type: string
 *         description: Уникальный id поста
 *     responses:
 *       200:
 *         description: Пост успешно удалён
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Ok"
 *       401:
 *         description: Пользователь не авторизован
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Токен не найден. Код ошибки - 1020"
 *       403:
 *         description: У пользователя нет прав на удаление поста
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "роль не совпадает"
 *       404:
 *         description: Пост не найден
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Поста не существует"
 *       503:
 *         description: Ошибка сервера
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
 * /post/update/:link:
 *   patch:
 *     summary: Обновить пост
 *     description: Обновление поста доступно только его автору или администратору/менеджеру.
 *     tags: [Blogs]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: params
 *         name: link
 *         required: true
 *         schema:
 *           type: string
 *         description: Уникальный id поста
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
 *                   headLine:
 *                     type: string
 *                     example: "Обновленный заголовок"
 *                   text:
 *                     type: string
 *                     example: "Обновленный текст поста"
 *                   includesSlider:
 *                     type: boolean
 *                     example: false
 *     responses:
 *       200:
 *         description: Пост успешно обновлён
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 headLine:
 *                   type: string
 *                   example: "Обновленный заголовок"
 *                 text:
 *                   type: string
 *                   example: "Обновленный текст поста"
 *                 link:
 *                   type: string
 *                   example: "obnovlennyj-zagolovok"
 *                 includesSlider:
 *                   type: boolean
 *                   example: false
 *       401:
 *         description: Пользователь не авторизован
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Токен не найден. Код ошибки - 1020"
 *       403:
 *         description: Нет прав на обновление поста
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "роль не совпадает"
 *       404:
 *         description: Пост не найден
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Нет такого поста"
 *       503:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Ошибка"
 */