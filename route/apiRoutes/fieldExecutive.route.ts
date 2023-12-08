import { Response, Router, Request, NextFunction } from "express";
import Route from "../../interfaces/route.interface";
import apiFieldExecutiveController from "../../controllers/apiController/fieldExecutive.controller";
import upload from "../../utils/multer";
import authMobile from "@/utils/verifyTokenMobile";
import fs from "fs";

class apiFieldExecutiveRoute implements Route {
	public path = "/api/field-executive";
	public router = Router();
	public apiFieldExecutiveController = new apiFieldExecutiveController();

	constructor() {
		this.initializeRoutes();
	}


	private initializeRoutes() {
		this.router.post(`${this.path}/login`, this.apiFieldExecutiveController.login);
		this.router.post(`${this.path}/assignCases`, authMobile, this.apiFieldExecutiveController.assignCases);
		this.router.post(`${this.path}/acceptOrRejectCase`, authMobile, this.apiFieldExecutiveController.acceptOrRejectCase);
		this.router.post(`${this.path}/myCases`, authMobile, this.apiFieldExecutiveController.myCases);
		this.router.post(`${this.path}/dayStartEnd`, authMobile, this.apiFieldExecutiveController.dayStartEnd);
		this.router.post(`${this.path}/formData`, authMobile, this.apiFieldExecutiveController.formData);
		this.router.post(`${this.path}/submitedCases`, authMobile, this.apiFieldExecutiveController.submitedCases);
		this.router.post(`${this.path}/logout`, authMobile, this.apiFieldExecutiveController.logout);
	}

}

export default apiFieldExecutiveRoute;
