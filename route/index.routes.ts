import { Router } from "express";
import Route from "../interfaces/route.interface";

import IndexController from "../controllers/index.controller";
import AjaxController from "../controllers/ajax.controller";

class IndexRoute implements Route {
    public path = "/api";
    public router = Router();
    public indexController = new IndexController();
    public ajaxController = new AjaxController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {

        this.router.get(
            `${this.path}/aws-presigned`,
            // authMiddleware,
            this.ajaxController.presigned
        );

        this.router.get(
            `${this.path}/get-configs/:type`,
            // authMiddleware,
            this.indexController.getConfigs
        );

    }
}

export default IndexRoute;
