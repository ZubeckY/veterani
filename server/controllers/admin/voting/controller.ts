import {Request, Response, Router} from "express";
import {AppDataSource} from "../../../connectDb";
import {Voting} from "../../../entity";

const votingRouter = Router();

votingRouter.get("/admin/voting/list", async (req: Request, res: Response) => {
    try {
        const votingRepository = AppDataSource.getRepository(Voting);
        const list = await votingRepository.find()

        res.send(list)

    } catch (e) {
        res.send({message: e});
    }
})

votingRouter.post("/admin/voting/create", async (req: Request, res: Response): Promise<any> => {
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
        voting.votingResult = JSON.stringify(data)
        voting.isClosed = false

        await votingRepository.save(voting)

        res.send(voting)

    } catch (e: any) {
        res.send({message: e})
    }
})


export default votingRouter;

