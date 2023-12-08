import bcrypt from "bcrypt";
import adminModel from "../../models/admin.model";
import managerModel from "../../models/manager.model";
import seniorSupervisorModel from "../../models/seniorSupervisors.model";
import supervisorModel from "../../models/supervisors.model";
import fieldExecutiveModel from "../../models/fieldExecutive.model";
import Messages from "../../messages";
import fs from "fs";
import path from "path";
import * as EmailValidator from 'email-validator';
import Helper from "@/utils/helper";
import caseModel from "@/models/case.model";

class fieldExecutiveService {

	public async addFieldExecutiveData(req: any) {
		try {
			let addMember: any;

			let model: any;
			switch (req.user.role) {
				case "admin":
					model = adminModel;
					break;
				case "manager":
					model = managerModel;
					break;
				case "senior-supervisor":
					model = seniorSupervisorModel;
					break;
				case "supervisor":
					model = supervisorModel;
					break;
				default:
					return Messages.Failed.PERMISSION_DENIED;
			}
			if (req.body.addMember == "field-executive") {
				const emailVerify = EmailValidator.validate(req.body.email.trim().toLowerCase());
				if (emailVerify) {
					const findAddedBy: any = await model.findOne({ _id: req.user._id });
					if (findAddedBy) {
						if (findAddedBy.permissions.includes("field-executive")) {
							const checkPersonToBeAdded = await fieldExecutiveModel.findOne({
								email: req.body.email,
							});
							if (!checkPersonToBeAdded) {
								async function hashPassword() {
									const password = req.body.password;
									const saltRounds = 10;
									const hashed = await new Promise((resolve, reject) => {
										bcrypt.hash(password, saltRounds, function (err, hash) {
											if (err) reject(err);
											resolve(hash);
										});
									});
									return hashed;
								}
								let hash = await hashPassword();
								let objToBeCreated: any = {
									fullName: req.body.name.replaceAll(',', '').replaceAll('@', ''),
									email: req.body.email,
									mobile: req.body.mobile,
									panCard: req.body.pancard,
									aadhaarCard: req.body.aadhaarcard,
									addedBy: req.user.role,
									profilePic: req.file ? req.file.key : "",
								};

								if (req.body.password.length > 0) {
									objToBeCreated.password = hash;
								}
								if (
									req.body.permissions != undefined &&
									req.body.permissions.length > 0
								) {
									objToBeCreated.permissions = req.body.permissions;
								}

								addMember = await fieldExecutiveModel.create(objToBeCreated);

								if (addMember) {
									return Messages.SUCCESS.ADDED_SUCCESSFULLY;
								} else {
									return Messages.Failed.SOMETHING_WENT_WRONG;
								}
							} else {
								return Messages.Failed.EMAIL_ID_ALREADY_EXISTS;
							}
						} else {
							return Messages.Failed.PERMISSION_DENIED;
						}
					} else {
						return Messages.Failed.PERMISSION_DENIED;
					}
				} else {
					return Messages.Failed.INVALID_EMAIL_ID
				}

			} else {
				return Messages.Failed.SOMETHING_WENT_WRONG;
			}
		} catch (error) {
			error.code = 401
			return error
		}
	}

	public async editFieldExecutiveData(req: any) {
		try {
			let findFieldExecutive = await fieldExecutiveModel.findOne({ _id: req.body.id })
			async function validateCase() {
				let caseFind = await caseModel.findOne({ fieldExecutiveId: findFieldExecutive._id, status: "open" })
				if (caseFind) {
					return Messages.Failed.EDIT_FAILED
				} else {
					return true
				}
			}
			if (req.body.name.trim() != findFieldExecutive.fullName) {
				let z = await validateCase()
				if (z != true) {
					return z
				}
			}
			if (req.body.email.trim() != findFieldExecutive.email) {
				let z = await validateCase()
				if (z != true) {
					return z
				}
			}
			if (req.body.pancard != findFieldExecutive.panCard) {
				let z = await validateCase()
				if (z != true) {
					return z
				}
			}
			if (req.body.mobile != findFieldExecutive.mobile) {
				let z = await validateCase()
				if (z != true) {
					return z
				}
			}
			if (req.body.aadhaarcard != findFieldExecutive.aadhaarCard) {
				let z = await validateCase()
				if (z != true) {
					return z
				}
			}
			let objForUpdate: any = {}
		
			const emailVerify = EmailValidator.validate(req.body.email.trim().toLowerCase());
			if (emailVerify) {
				objForUpdate.email = req.body.email.trim().toLowerCase()
			} else {
				return Messages.Failed.INVALID_EMAIL_ID
			}
			objForUpdate = {
				email: req.body.email.trim().toLowerCase(),
				fullName: req.body.name.replaceAll(',', '').replaceAll('@', ''),
				panCard: req.body.pancard,
				aadhaarCard: req.body.aadhaarcard,
				mobile: req.body.mobile,
			};
			if (req.file) {
				objForUpdate.profilePic = req.file.key
			}

			async function hashPassword() {
				const password = req.body.password;
				const saltRounds = 10;
				const hashed = await new Promise((resolve, reject) => {
					bcrypt.hash(password, saltRounds, function (err, hash) {
						if (err) reject(err);
						resolve(hash);
					});
				});
				return hashed;
			}
			let hash = req.body.password.length > 0 ? await hashPassword() : "";
			if (req.body.password.length > 0) {
				objForUpdate.password = hash;
			}
			objForUpdate = { $set: objForUpdate };
			let fieldExecutiveData = await fieldExecutiveModel.findOneAndUpdate(
				{ _id: req.body.id },
				objForUpdate
			);
			if (fieldExecutiveData) {
				Messages.SUCCESS.UPDATED_SUCCESSFULLY.image = ""
				return Messages.SUCCESS.UPDATED_SUCCESSFULLY;
			} else {
				return Messages.Failed.SOMETHING_WENT_WRONG;
			}
		} catch (error) {
			error.code = 401
			return error
		}
	}

	public async deleteFieldExecutiveData(req: any) {
		try {
			let caseFind = await caseModel.findOne({ fieldExecutiveId: req.params.id, status: "open" })
			if (caseFind) {
				return Messages.Failed.EDIT_FAILED
			} else {
				let deleteFieldExecutive = await fieldExecutiveModel.findOneAndUpdate({ _id: req.params.id }, { $set: { isDeleted: true, fieldExecutiveFields: [] } });
				if (deleteFieldExecutive) {
					return Messages.SUCCESS.DELETED_SUCCESSFULLY;
				} else {
					return Messages.Failed.SOMETHING_WENT_WRONG;
				}
			}
		} catch (error) {
			error.code = 401
			return error
		}
	}
}
export default fieldExecutiveService;
