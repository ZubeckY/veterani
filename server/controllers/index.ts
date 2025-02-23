import userRouter from "./userController"
import blogRouter from "./blogController";
import adminRouter from "./adminController";

const controller: any = [userRouter, blogRouter, adminRouter];

export default controller;