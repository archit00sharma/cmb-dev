import bcrypt from "bcrypt";
import adminModel from "../../models/admin.model";
import bankMemberModel from "../../models/bankMember.model";
import areaModel from "@/models/area.model";
import productModel from "@/models/product.model";
import caseModel from "@/models/case.model";
import Messages from "../../messages";
import * as EmailValidator from 'email-validator';
import bankMemberAllocationModel from "@/models/bankMemberAllocations.model";


class bankMemberService {

	public async addBankMemberData(req: any) {
		try {
			let arrayFields: any = [];
			let addMember: any;
			let count: number = 0;
			let model: any;
			if (req.user.role == "admin" && req.body.addMember == "bankMember") {
				const emailVerify = EmailValidator.validate(req.body.email.trim().toLowerCase());
				if (emailVerify) {
					const findAddedBy: any = await adminModel.findOne({ _id: req.user._id });
					if (findAddedBy) {
						if (findAddedBy.permissions.includes("bank-member")) {
							const checkPersonToBeAdded = await bankMemberModel.findOne({ email: req.body.email, });
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
								let hash = await hashPassword()

								let objToBeCreated: any = {
									fullName: req.body.name.replaceAll(",", "").replaceAll("@", ""),
									email: req.body.email,
									addedBy: req.user.role,
								};

								if (req.body.password.length > 0) objToBeCreated.password = hash;

								if (req.body.permissions != undefined && req.body.permissions.length > 0) objToBeCreated.permissions = req.body.permissions;

								addMember = await bankMemberModel.create(objToBeCreated);

								if (req.body.product && req.body.product.length > 0) {
									for (let a = 0; a < req.body.product.length; a++) {
										for (let i = 0; i < req.body.product[a].length; i++) {
											for (let j = 0; j < req.body.bank[a].length; j++) {
												arrayFields.push({ product: req.body.product[a][i], bank: req.body.bank[a][j], user_id: addMember._id })
											}
										}
									}
								}
								const set = new Set(arrayFields.map(JSON.stringify));
								const hasDuplicates = set.size < arrayFields.length;

								if (hasDuplicates === true) return Messages.Failed.DUPLICATE_AREA_PRODUCT_BANK;

								if (arrayFields.length > 0 && addMember) await bankMemberAllocationModel.insertMany(arrayFields)

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
						return Messages.Failed.SOMETHING_WENT_WRONG;
					}
				} else {
					return Messages.Failed.INVALID_EMAIL_ID
				}
			} else {
				return Messages.Failed.PERMISSION_DENIED;
			}
		} catch (error) {
			error.code = 401
			return error;
		}
	}
	public async editBankMemberData(req: any) {
		try {
			let objToBeCreated: any = {}
			let findbankMember = await bankMemberModel.findOne({ _id: req.body.id })

			if (!findbankMember.permissions?.includes('active') && req.body.permissions.includes('active') && !req.body.password) return Messages.Failed.PASSWORD_REQUIRED;

			if (!findbankMember.permissions?.includes('active') && req.body.permissions.includes('active')) {
				objToBeCreated.lastLoggedIn = new Date()
			}

			objToBeCreated.isPasswordUpdated = req.body.password ? true : false;



			let arrayFields: any = [];

			if (req.body.product && req.body.product.length > 0) {
				for (let a = 0; a < req.body.product.length; a++) {
					for (let i = 0; i < req.body.product[a].length; i++) {
						for (let j = 0; j < req.body.bank[a].length; j++) {
							arrayFields.push({ product: req.body.product[a][i], bank: req.body.bank[a][j], user_id: findbankMember._id })
						}
					}
				}
			}

			const set = new Set(arrayFields.map(JSON.stringify));
			const hasDuplicates = set.size < arrayFields.length;
			if (hasDuplicates === true) {
				return Messages.Failed.DUPLICATE_AREA_PRODUCT_BANK;
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

			const emailVerify = EmailValidator.validate(req.body.email.trim().toLowerCase());


			if (emailVerify) {
				objToBeCreated.fullName = req.body.name.replaceAll(",", "").replaceAll("@", "");
				objToBeCreated.email = req.body.email;
				objToBeCreated.addedBy = req.user.role;
			} else {
				return Messages.Failed.INVALID_EMAIL_ID
			}

			if (arrayFields.length > 0) {
				await bankMemberAllocationModel.insertMany(arrayFields)
			}


			if (req.body.password.length > 0) {
				objToBeCreated.password = hash;
			}
			if (req.body.permissions != undefined && req.body.permissions.length > 0) {
				objToBeCreated.permissions = req.body.permissions;
			} else {
				objToBeCreated.permissions = []
			}
			let bankMemberData = await bankMemberModel.findOneAndUpdate({ _id: req.body.id }, { $set: objToBeCreated });
			if (bankMemberData) {
				return Messages.SUCCESS.UPDATED_SUCCESSFULLY;
			} else {
				return Messages.Failed.SOMETHING_WENT_WRONG;
			}

		} catch (error) {
			error.code = 401
			return error
		}
	}
	public async deleteBankMemberData(req: any) {
		try {
			await bankMemberAllocationModel.deleteMany({ user_id: req.params.id });
			const deletebankMember = await bankMemberModel.findOneAndUpdate({ _id: req.params.id }, { $set: { isDeleted: true } });
			if (deletebankMember) {
				return Messages.SUCCESS.DELETED_SUCCESSFULLY;
			} else {
				return Messages.Failed.SOMETHING_WENT_WRONG;
			}
		} catch (error) {
			error.code = 401
			return error;
		}
	}
}
export default bankMemberService;
