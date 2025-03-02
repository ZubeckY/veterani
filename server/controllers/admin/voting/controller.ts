import {Request, Response, Router} from "express";
import {AppDataSource} from "../../../connectDb";
import {Voting} from "../../../entity";
import AuthService from "../../../service/authService";
import {onlyAdmin} from "../../../middleware/auth/onlyAdmin";

const votingRouter = Router();

votingRouter.get("/admin/voting/list", onlyAdmin, async (req: Request, res: Response) => {
    try {
        const votingRepository = AppDataSource.getRepository(Voting);
        const list = await votingRepository.find()

        res.send(list)

    } catch (e) {
        res.send({message: e});
    }
})

votingRouter.post("/admin/voting/create", onlyAdmin,  async (req: Request, res: Response): Promise<any> => {
    try {
        const votingRepository = AppDataSource.getRepository(Voting);
        const voting = new Voting()

        interface votingModel {
            userId: number;
            result: boolean;
        }


        const item: votingModel = {
            userId: 4,
            result: false,
        }

        const data = []
        data.push(item);

        voting.theme = 'Тестовое голосование'
        voting.isClosed = false

        await votingRepository.save(voting)

        res.send(voting)

    } catch (e: any) {
        res.send({message: e})
    }
})

votingRouter.put("/admin/voting/update/:id", onlyAdmin, async (req: Request, res: Response) : Promise<any> => {
    try {
        const model = req.body

        const {id} = req.params
        if (!(Number.isInteger(+id))) {
            return res.status(404).send({
                message: "Пользователь не выбран"
            })
        }

        const userFromDB: any = await new AuthService().getUserFromCookies(req.headers['cookie'], res)
        if (!userFromDB || !userFromDB.id) {
            return userFromDB
        }

        const votingRepository = AppDataSource.getRepository(Voting);

        const voting = await votingRepository.findOne({where: {id: +id}});

        if (!voting) {
            return res.status(404).send({
                message: "Нет такого голосования"
            })
        }

        if (voting.isClosed) {
            return res.status(404).send({
                message: "Голосование закрыто"
            })
        }

        const hasVoted = voting.votingResult.some(vote => vote.userId === userFromDB.id);
        if (hasVoted) {
            return res.status(400).json({ message: "Вы уже голосовали" });
        }

        const userId = userFromDB.id
        const result = model.result
        voting.votingResult.push({ userId, result});

        await votingRepository.save(voting);

        return res.status(200).json({ message: "Голос учтен", voting });
    }
    catch (e: any) {
        res.send({message: e})
    }
})


export default votingRouter;

