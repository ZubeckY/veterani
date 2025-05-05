import userRouter from "./user/controller"
import blogRouter from "./blog/controller";
import fileRouter from "./file/controller";
import mainRouter from "./admin/main/controller";
import adminRouter from "./admin/user/controller";
import memberOrgController from "./admin/memberOrg/controller";
import contactInfoRouter from "./admin/contactInfo/controller";

const controller: any = [
    userRouter,
    blogRouter,
    mainRouter,
    fileRouter,

    adminRouter,
    contactInfoRouter,
    memberOrgController,
];

export default controller;