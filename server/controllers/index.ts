import userRouter from "./userController"
import blogRouter from "./blogController";

const controller: any = [userRouter, blogRouter];

export default controller;