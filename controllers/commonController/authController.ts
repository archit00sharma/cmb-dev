import { NextFunction, Request, Response } from "express";
import authService from "../../services/commonServices/auth.service";
import adminService from "../../services/adminServices/admin.service";
import { loginDto } from "../../dtos/login.dto";
import adminModel from "@/models/admin.model";
import managerModel from "@/models/manager.model";
import seniorSupervisorModel from "@/models/seniorSupervisors.model";
import supervisorModel from "@/models/supervisors.model";
import config from "config"




class authController {
	public authService = new authService();
	public admins = new adminService();

	public login = async (req: any, res: Response, next: NextFunction) => {
		res.locals.message = req.flash()
		res.render("common/login", {
			title: `${config.get("siteTitle")}`,
			siteUrl: config.get("siteUrl"),
			loginUser: null,
		});

	}
	public logIn = async (req: any, res: Response, next: NextFunction) => {
		try {
			const loginData: loginDto = req.body
			let role = loginData.role
			let email = req.body.email
			if (req.body?.role == "admin") {
				const admin: any = await this.admins.getUserCount()
				if (!admin) {
					let adminData: any = config.get("admin");
					const createAdminData: any = await this.admins.createUser(adminData);
				}
			}
			const login: any = await this.authService.logIn(loginData, res, req);
			
			if (login.code == 200) {
				req.flash("success", login.message)
				res.redirect("/dashboard")
			} else {

				req.flash("error", login.message)
				res.redirect("/login")
			}
		} catch (error) {
			next(error);
		}
	}
	public dashboard = async (req: any, res: Response, next: NextFunction) => {
		try {	
			let role: any = req.user.role
			let email = req.user.email
			res.locals.message = req.flash()
			res.render("common/dashboard", { role, email })
		} catch (error) {
			next(error);
		}
	}
	public logout = async (req: any, res: Response, next: NextFunction) => {
		let model: any
		if (req.user.role == "admin") {
			model = adminModel
		} else if (req.user.role == "manager") {
			model = managerModel
		} else if (req.user.role == "senior-supervisor") {
			model = seniorSupervisorModel
		} else if (req.user.role == "supervisor") {
			model = supervisorModel
		}
		let deleteToken = await model.findOneAndUpdate({ _id: req.user._id }, { $pull: { fireBaseToken: req.body.deleteToken } })
		res.clearCookie("jwtToken");
		res.redirect("/login")
	}

}
export default authController;
