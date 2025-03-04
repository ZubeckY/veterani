import {Request, Response, Router} from "express";
import {AppDataSource} from "../../../connectDb";
import {Voting} from "../../../entity";
import AuthService from "../../../service/authService";
import {onlyAdmin} from "../../../middleware/auth/onlyAdmin";

interface votingModel {
    userId: number;
    result: boolean;
}

const votingRouter = Router();

votingRouter.get("/admin/voting/list", onlyAdmin, async (req: Request, res: Response) => {
    try {
        const votingRepository = AppDataSource.getRepository(Voting);
        const list = await votingRepository.find()

        res
            .status(200)
            .send(list)

    } catch (e) {
        res.send({message: e});
    }
})

votingRouter.post("/admin/voting/create", onlyAdmin, async (req: Request, res: Response): Promise<any> => {
    try {
        const {theme} = req.body

        const votingRepository = AppDataSource.getRepository(Voting);
        const voting = new Voting()

        voting.theme = theme
        voting.isClosed = false

        const created = await votingRepository.save(voting)

        res
            .status(201)
            .send({voting: created})

    } catch (e: any) {
        res.send({message: e})
    }
})

votingRouter.put("/admin/voting/update/:id", onlyAdmin, async (req: Request, res: Response): Promise<any> => {
    try {
        const {model} = req.body
        const {id} = req.params
        if (!(Number.isInteger(+id))) {
            return res.status(404).send({
                message: "ID голосования указан неверно"
            })
        }

        const userFromDB: any = await new AuthService().getUserFromCookies(req.headers['cookie'], res)
        if (!userFromDB.id) {
            return userFromDB
        }

        const votingRepository = AppDataSource.getRepository(Voting);
        const voting = await votingRepository.findOneBy({id: +id});
        if (!voting) {
            return res.status(404).send({
                message: "Нет такого голосования"
            })
        }

        if (voting.isClosed) {
            return res.status(200).send({
                message: "Голосование закрыто"
            })
        }

        // Переводим с JSON'а в массив объектов
        const data = JSON.parse(voting.votingResult)

        // Создаём условие для фильтраций
        const condition = (vote: votingModel) => vote.userId === userFromDB.id

        // Если есть, меняем голос
        const hasVoted = data.some(condition);
        if (hasVoted) {
            const i = data.findIndex(condition);
            data[i].result = model.result

            voting.votingResult = JSON.stringify(data)
            const saveVoting = await votingRepository.save(voting);

            return res
                .status(200)
                .send(
                    {
                        voting: saveVoting,
                        message: "Голос изменён"
                    });
        }

        // Если голоса не было, создаем новый
        const votingModel: votingModel = {
            userId: userFromDB.id,
            result: model.result,
        }

        data.push(votingModel)

        voting.votingResult = JSON.stringify(data)
        const saveVoting = await votingRepository.save(voting);

        return res
            .status(200)
            .send(
                {
                    voting: saveVoting,
                    message: "Голос учтен"
                });
    } catch (e: any) {
        res.send({message: e})
    }
})


export default votingRouter;

