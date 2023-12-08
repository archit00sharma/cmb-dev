import bcrypt, { hash } from "bcrypt";
import adminModel from "../../models/admin.model";
import productModel from "../../models/product.model";
import areaModel from "../../models/area.model";
import bankModel from "../../models/bank.model";
import Messages from "../../messages"


class adminService {
    public admins = adminModel;

    public async addAdminProfileDataDisplay(req: any) {
        try {
            const adminData = await adminModel.findOne({ _id: req.user._id })
            if (adminData) {
                return adminData
            } else {
                return Messages.Failed.SOMETHING_WENT_WRONG
            }
        } catch (error) {
            error.code = 401;
            return error
        }
    };
    public async addAdminProfileData(req: any) {
        try {
            if (req.body.password.length != 0) {
                async function hashPassword() {
                    const password = req.body.password
                    const saltRounds = 10;
                    const hashed = await new Promise((resolve, reject) => {
                        bcrypt.hash(password, saltRounds, function (err, hash) {
                            if (err) reject(err)
                            resolve(hash)
                        });
                    })
                    return hashed
                }
                let hash = await hashPassword()
                const adminProfileData = await adminModel.updateOne({ _id: req.user._id }, {
                    $set: {
                        email: req.body.email.trim().toLowerCase(),
                        password: hash,
                        fullName: req.body.name.trim().replaceAll(',', '').replaceAll('@', '')
                    }
                })
                if (adminProfileData.modifiedCount == 1) {
                    return Messages.SUCCESS.UPDATED_SUCCESSFULLY
                } else {
                    return Messages.Failed.SOMETHING_WENT_WRONG
                }
            } else {

                const adminProfileData = await adminModel.updateOne({ _id: req.user._id }, {
                    $set: {
                        email: req.body.email.trim().toLowerCase(),
                        fullName: req.body.name.trim().replaceAll(',', '').replaceAll('@', '')
                    }
                })
                if (adminProfileData.modifiedCount == 1) {
                    return Messages.SUCCESS.UPDATED_SUCCESSFULLY
                } else {
                    return Messages.Failed.SOMETHING_WENT_WRONG
                }
            }
        } catch (error) {
            error.code = 410
            return error
        }
    };
    public async addProductData(req: any) {
        try {
            const productData = await productModel.create({ product: req.body.product.trim().toUpperCase() })
            if (productData) {
                return Messages.SUCCESS.ADDED_SUCCESSFULLY
            } else {
                return Messages.Failed.SOMETHING_WENT_WRONG
            }
        } catch (error) {
            error.code = 410
            return error
        }
    };
    public async editProductData(req: any) {
        try {
            const productData = await productModel.findOneAndUpdate({ _id: req.body.id }, { $set: { product: req.body.product.toUpperCase() } })
            if (productData) {
                return Messages.SUCCESS.UPDATED_SUCCESSFULLY
            } else {
                return Messages.Failed.SOMETHING_WENT_WRONG
            }
        } catch (error) {
            error.code = 410
            return error
        }
    };
    public async deleteProductData(req: any) {
        try {
            let deleteProduct = await productModel.deleteOne({ _id: req.params.id })
            if (deleteProduct.deletedCount > 0) {
                return Messages.SUCCESS.DELETED_SUCCESSFULLY
            } else {
                return Messages.Failed.SOMETHING_WENT_WRONG
            }
        } catch (error) {
            error.code = 410
            return error
        }

    };
    public async addBankData(req: any) {
        try {
            const bankData = await bankModel.create({ bank: req.body.bank.toUpperCase() })
            if (bankData) {
                return Messages.SUCCESS.ADDED_SUCCESSFULLY
            } else {
                return Messages.FAILED.SOMETHING_WENT_WRONG
            }
        } catch (error) {
            error.code = 410
            return error
        }
    };
    public async editBankData(req: any) {
        try {
            const bankData = await bankModel.findOneAndUpdate({ _id: req.body.id }, { $set: { bank: req.body.bank.toUpperCase() } })
            if (bankData) {
                return Messages.SUCCESS.UPDATED_SUCCESSFULLY
            } else {
                return Messages.Failed.SOMETHING_WENT_WRONG
            }
        } catch (error) {
            error.code = 410
            return error
        }
    };
    public async deleteBankData(req: any) {
        try {
            let deleteBank = await bankModel.deleteOne({ _id: req.params.id })
            if (deleteBank.deletedCount > 0) {
                return Messages.SUCCESS.DELETED_SUCCESSFULLY
            } else {
                return Messages.Failed.SOMETHING_WENT_WRONG
            }
        }
        catch (error) {
            error.code = 410
            return error
        }

    };
    public async addAreaData(req: any) {
        try {
            const areaData = await areaModel.create({ area: req.body.area.toUpperCase() })
            if (areaData) {
                return Messages.SUCCESS.ADDED_SUCCESSFULLY
            } else {
                return Messages.Failed.SOMETHING_WENT_WRONG
            }
        } catch (error) {
            error.code = 410
            return error
        }
    };
    public async editAreaData(req: any) {
        try {
            const areaData = await areaModel.findOneAndUpdate({ _id: req.body.id }, { $set: { area: req.body.area.toUpperCase() } })
            if (areaData) {
                return Messages.SUCCESS.UPDATED_SUCCESSFULLY
            } else {
                return Messages.Failed.SOMETHING_WENT_WRONG
            }
        } catch (error) {
            error.code = 410
            return error
        }
    };
    public async deleteAreaData(req: any) {
        try {
            let deleteArea = await areaModel.deleteOne({ _id: req.params.id })
            if (deleteArea.deletedCount > 0) {
                return Messages.SUCCESS.DELETED_SUCCESSFULLY
            } else {
                return Messages.Failed.SOMETHING_WENT_WRONG
            }
        }
        catch (error) {
            error.code = 410
            return error
        }
    };
    public async findUserByEmail(userEmail: string): Promise<any> {
        if (!userEmail)
            return Messages.Failed.SOMETHING_WENT_WRONG
        const findUser: any = await this.admins.findOne({
            email: userEmail,
            isDeleted: false,
        });
        return findUser;
    }
    public async getUserCount(
        type?: string,
        value?: string,
        filter?: any
    ): Promise<number> {
        let cond: any = {
            isDeleted: false,
        };
        switch (type) {
            case "email":
                Object.assign(cond, { email: value });
                break;
            case "mobile":
                Object.assign(cond, { mobileNumber: value });
                break;
            case "role":
                Object.assign(cond, { role: value });
                break;
            case "resetToken":
                Object.assign(cond, { resetToken: value });
                break;
            case "_id":
                Object.assign(cond, { _id: value });
                break;
            default:
                break;
        }
        if (filter && !(filter)) Object.assign(cond, filter);
        const count: number = await this.admins.countDocuments(cond);
        return count;
    }
    public async createUser(userData: any): Promise<any> {
        if (!(userData)) Messages.Failed.SOMETHING_WENT_WRONG

        const findUser: any = await this.admins.findOne({
            email: userData.email,
        });
        if (findUser)
            Messages.Failed.SOMETHING_WENT_WRONG

        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const createUserData: any = await this.admins.create({
            ...userData,
            password: hashedPassword,
        });

        return createUserData;
    }
    public async checkPassword(req: any, res: any) {
        try {

            if (req.body.password.length <= 0) return Messages.Failed.INVALID_PASSWORD
            const user = await adminModel.findOne({ _id: req.user._id });

            if (!user) return Messages.Failed.USER_NOT_REGISTERED
            const passwordMatch = await bcrypt.compare(req.body.password, user.password);

            if (!passwordMatch) return Messages.Failed.INVALID_PASSWORD

            return Messages.SUCCESS.UPDATED_SUCCESSFULLY
        } catch (error) {
            error.code = 410
            res.send(error);
        }
    };






}
export default adminService;
