import userRouter from "./user/controller"
import blogRouter from "./blog/controller";
import adminRouter from "./admin/controller";

const controller: any = [userRouter, blogRouter, adminRouter];

export default controller;