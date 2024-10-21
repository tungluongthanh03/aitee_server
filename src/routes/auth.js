import express from 'express';
import controller from '../chat/controller';
import middleware from '../middlewares/';



const route = express.Router();


route.get("/hello", controller.print);
route.get("/world", middleware.print2, controller.print);



export default route;
