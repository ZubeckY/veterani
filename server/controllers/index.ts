import userRouter from "./user/controller"
import blogRouter from "./blog/controller";
import adminRouter from "./admin/user/controller";
import votingRouter from "./admin/voting/controller";

const controller: any = [userRouter, blogRouter, adminRouter, votingRouter];

export default controller;