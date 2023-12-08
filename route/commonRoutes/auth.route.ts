import { Response, Router, Request, NextFunction } from "express";
import Route from "../../interfaces/route.interface";
import authController from "../../controllers/commonController/authController";
import auth from "../../utils/verifyToken";


class authRoute implements Route {
	public path = "";
	public router = Router();
	public authController = new authController();

	constructor() {
		this.initializeRoutes();
	}

	private initializeRoutes() {
		this.router.get(`/login`,  this.authController.login);
		this.router.post(`/logIn`,  this.authController.logIn);
		this.router.get(`/dashboard`,  auth, this.authController.dashboard);
		this.router.post(`/logout`,  auth, this.authController.logout);
	}
}

export default authRoute;
