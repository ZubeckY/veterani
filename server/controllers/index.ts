import userRouter from "./user/controller"
import blogRouter from "./blog/controller";
import fileRouter from "./file/controller";
import contInfoRouter from "./contactInfo/controller";
import mainRouter from "./admin/main/controller";
import adminRouter from "./admin/user/controller";
import memberOrgController from "./admin/memberOrg/controller";
import contactInfoRouter from "./admin/contactInfo/controller";
import adminBlogRouter from "./admin/blog/controller";

const controller: any = [
    userRouter,
    blogRouter,
    fileRouter,
    contInfoRouter,
    /* admin */
    mainRouter,
    adminRouter,
    memberOrgController,
    contactInfoRouter,
    adminBlogRouter,
];

export default controller;