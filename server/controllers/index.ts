import userRouter from "./user/controller"
import blogRouter from "./blog/controller";
import mainRouter from "./admin/main/controller";
import adminRouter from "./admin/user/controller";
import fileRouter from "./file/controller";
import contactInfoRouter from "./admin/contactInfo/controller";

const controller: any = [
    userRouter,
    blogRouter,
    mainRouter,
    adminRouter,
    fileRouter,
    contactInfoRouter,
];

export default controller;