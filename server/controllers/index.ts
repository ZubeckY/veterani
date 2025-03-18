import userRouter from "./user/controller"
import blogRouter from "./blog/controller";
import mainRouter from "./admin/main/controller";
import adminRouter from "./admin/user/controller";
import votingRouter from "./admin/voting/controller";
import fileRouter from "./file/controller";

const controller: any = [
    userRouter,
    blogRouter,
    mainRouter,
    adminRouter,
    votingRouter,
    fileRouter,
];

export default controller;