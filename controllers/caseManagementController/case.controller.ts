import { NextFunction, Response } from "express";
import caseService from "../../services/caseManagementServices/case.service";
import managerModel from "../../models/manager.model";
import caseModel from "../../models/case.model";
import seniorSupervisorModel from "@/models/seniorSupervisors.model";
import supervisorModel from "@/models/supervisors.model";
import fieldExecutiveModel from "@/models/fieldExecutive.model";
import mongoose from "mongoose";
import Helper from "@/utils/helper";
import url from "url";
import fs from "fs";
import path from "path";
import moment from "moment";
import customSearch from "@/helpers/customSearch/customSearch";
import createSuccessfullCaseExcel from "@/helpers/createExcel/createSuccessfullCaseExcel";
import customSearchReview from "@/helpers/customSearch/customSearchReview";
import createReviewCaseExcel from "@/helpers/createExcel/createReviewCaseExcel";
import customSearchPending from "@/helpers/customSearch/customSearchPending";
import createPendingCaseExcel from "@/helpers/createExcel/createPendingExcel";
import teamEfficiencyExcel from "@/helpers/efficiencyExcel/teamEfficiencyExcel";
import backupDatabase from '../../helpers/databaseBackup/backup'
import viewUploadedCaseSearch from "@/helpers/customSearch/viewUploadedCase";
import viewDuplicateCaseSearch from "@/helpers/customSearch/viewDuplicateCase";
import calTat from "@/helpers/tatCalculation/tatCal";
import feCoordinatesModel from "@/models/fieldExecutiveCoordinates.model";
class caseController {
  public caseService = new caseService();
  public Helper = new Helper();

  // *********  UPLOAD CASES WITH AUTOMATICALLY ASSIGN CASES   *****************************************************************************************
  public uploadCase = async (req: any, res: Response, next: NextFunction) => {
    try {
      let role: any;
      let email: any;
      switch (req.user.role) {
        case "admin":
          role = req.user.role;
          email = req.user.email;
          res.locals.message = req.flash();
          res.render("caseFile/caseFile", { role, email });
          break;
        case "manager":
          role = req.user.role;
          email = req.user.email;
          res.locals.message = req.flash();
          res.render("caseFile/caseFile", { role, email });
          break;
        default:
          req.flash("error", "Something went wrong");
          res.redirect("/dashboard");
          break;
      }
    } catch (error) {
      next(error);
    }
  };

  public uploadCaseData = async (
    req: any,
    res: Response,
    next: NextFunction
  ) => {
    try {

      switch (req.user.role) {
        case "admin":
          const addCaseDataConfirmationAdmin: any =
            await this.caseService.addCaseData(req);
          if (req.file) {
            fs.unlinkSync(
              path.join(
                __dirname,
                "../../public/caseFile",
                `${req.file.filename}`
              )
            );
          }
          if (addCaseDataConfirmationAdmin.code == 201) {
            req.flash("success", addCaseDataConfirmationAdmin.message);
            res.redirect("/case/viewCase");
          } else {
            req.flash("error", addCaseDataConfirmationAdmin.message);
            res.redirect("/case/uploadCase");
          }
          break;
        case "manager":
          const addCaseDataConfirmation: any =
            await this.caseService.addCaseData(req);
          if (req.file) {
            fs.unlinkSync(
              path.join(
                __dirname,
                "../../public/caseFile",
                `${req.file.filename}`
              )
            );
          }
          if (addCaseDataConfirmation.code == 201) {
            req.flash("success", addCaseDataConfirmation.message);
            res.redirect("/case/viewCase");
          } else {
            req.flash("error", addCaseDataConfirmation.message);
            res.redirect("/case/uploadCase");
          }
          break;
        default:
          req.flash("error", "you dont have right to upload file");
          res.redirect("/dashboard");
          break;
      }
    } catch (error) {
      next(error);
    }
  };

  // **********************    EDIT CASES  *****************************************************************************************
  public editCase = async (req: any, res: Response, next: NextFunction) => {
    try {
      if (req.user.role == "admin") {
        let role = req.user.role;
        let email = req.user.email;
        let id = req.params.id;
        let caseData: any = await caseModel.findOne({ _id: req.params.id });
        res.locals.message = req.flash();
        res.render("caseFile/editCase", { role, email, id, caseData });
      } else {
        req.flash("error", "invalid Access");
        res.redirect("/case/viewCase");
      }
    } catch (error) {
      next(error);
    }
  };

  public editCaseData = async (req: any, res: Response, next: NextFunction) => {
    try {
      let role = req.user.role;
      let email = req.user.email;
      if (req.user.role == "admin") {
        const editCaseDataConfirmation: any =
          await this.caseService.editCaseData(req);
        if (editCaseDataConfirmation.code == 201) {
          req.flash("success", editCaseDataConfirmation.message);
        } else {
          req.flash("error", editCaseDataConfirmation.message);
        }
      } else {
        req.flash("error", "invalid Access");
      }
      res.redirect("/case/viewCase");
    } catch (error) {
      next(error);
    }
  };

  // **********************      DELETE CASES    *************************************************************************
  public deleteCase = async (req: any, res: Response, next: NextFunction) => {
    try {
      let d = "";
      let deleteCaseDataConfirmation;
      if (req.user.role == "admin") {
        deleteCaseDataConfirmation = await this.caseService.deleteCaseData(req);
        if (deleteCaseDataConfirmation.code == 201) {
          req.flash("success", deleteCaseDataConfirmation.message);
        } else {
          req.flash("error", deleteCaseDataConfirmation.message);
        }
      } else {
        req.flash("error", "Permission Denied");
      }
      if (req.query.d == "d") {
        res.redirect("/case/viewDuplicateCase");
      } else {
        res.redirect("/case/viewCase");
      }
    } catch (error) {
      next(error);
    }
  };
  //***********************  ASSIGN CASES TO MEMBERS MANUALLY  *************************************************************************
  public assignManager = async (
    req: any,
    res: Response,
    next: NextFunction
  ) => {
    try {


      let p = "";
      const assignManagerCaseDataConfirmation: any =
        await this.caseService.assignManagerCaseData(req);
      if (assignManagerCaseDataConfirmation.code == 201) {
        let managerData = await managerModel.find({
          isDeleted: { $exists: false },
        });
        res.locals.message = req.flash();
        let role = req.user.role;
        let email = req.user.email;
        let id = req.query.id;
        let area = req.query.area;
        let product = req.query.product;
        let bank = req.query.bank;
        let fileNo = req.query.fileNo;
        let mobileNo = req.query.mobileNo;
        if (req.query.p) {
          p = req.query.p;
        }
        res.render("caseFile/assignManager", {
          role,
          id,
          area,
          product,
          bank,
          email,
          fileNo,
          mobileNo,
          managerData,
          p,
        });
      } else {
        req.flash("error", assignManagerCaseDataConfirmation.message);
        res.redirect("/case/viewCase");
      }
    } catch (error) {
      next(error);
    }
  };

  public assignManagerData = async (
    req: any,
    res: Response,
    next: NextFunction
  ) => {
    try {

      const assignManagerCaseConfirmation: any =
        await this.caseService.assignManagerCase(req);
      if (assignManagerCaseConfirmation.code == 201) {
        req.flash("success", assignManagerCaseConfirmation.message);
      } else {
        req.flash("error", assignManagerCaseConfirmation.message);
      }
      if (req.body.p == "p") {
        res.redirect("/case/pendingCases");
      } else {
        res.redirect("/case/viewCase");
      }
    } catch (error) {
      next(error);
    }
  };

  public assignSeniorSupervisor = async (
    req: any,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let p = "";
      const assignSeniorSupervisorCaseDataConfirmation: any =
        await this.caseService.assignSeniorSupervisorCaseData(req);
      if (assignSeniorSupervisorCaseDataConfirmation.code == 201) {
        let seniorSupervisorData = await seniorSupervisorModel.find({
          isDeleted: { $exists: false },
        });
        res.locals.message = req.flash();
        let role = req.user.role;
        let email = req.user.email;
        let id = req.query.id;
        let area = req.query.area;
        let product = req.query.product;
        let bank = req.query.bank;
        let fileNo = req.query.fileNo;
        let mobileNo = req.query.mobileNo;
        if (req.query.p) {
          p = req.query.p;
        }
        res.render("caseFile/assignSeniorSupervisor", {
          role,
          id,
          area,
          product,
          bank,
          email,
          fileNo,
          mobileNo,
          seniorSupervisorData,
          p,
        });
      } else {
        req.flash("error", assignSeniorSupervisorCaseDataConfirmation.message);
        res.redirect("/case/viewCase");
      }
    } catch (error) {
      next(error);
    }
  };

  public assignSeniorSupervisorData = async (
    req: any,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const assignSeniorSupervisorCaseConfirmation: any =
        await this.caseService.assignSeniorSupervisorCase(req);
      if (assignSeniorSupervisorCaseConfirmation.code == 201) {
        req.flash("success", assignSeniorSupervisorCaseConfirmation.message);
      } else {
        req.flash("error", assignSeniorSupervisorCaseConfirmation.message);
      }
      if (req.body.p == "p") {
        res.redirect("/case/pendingCases");
      } else {
        res.redirect("/case/viewCase");
      }
    } catch (error) {
      next(error);
    }
  };

  public assignSupervisor = async (
    req: any,
    res: Response,
    next: NextFunction
  ) => {
    try {

      let p = "";
      const assignSupervisorCaseDataConfirmation: any =
        await this.caseService.assignSupervisorCaseData(req);
      if (assignSupervisorCaseDataConfirmation.code == 201) {
        let supervisorData = await supervisorModel.find({
          isDeleted: { $exists: false },
        });
        res.locals.message = req.flash();
        let role = req.user.role;
        let email = req.user.email;
        let id = req.query.id;
        let area = req.query.area;
        let product = req.query.product;
        let bank = req.query.bank;
        let fileNo = req.query.fileNo;
        let mobileNo = req.query.mobileNo;
        if (req.query.p) {
          p = req.query.p;
        }
        res.render("caseFile/assignSupervisor", {
          role,
          id,
          area,
          product,
          bank,
          email,
          fileNo,
          mobileNo,
          supervisorData,
          p,
        });
      } else {
        req.flash("error", assignSupervisorCaseDataConfirmation.message);
        res.redirect("/case/viewCase");
      }
    } catch (error) {
      next(error);
    }
  };

  public assignSupervisorData = async (
    req: any,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const assignSupervisorCaseConfirmation: any =
        await this.caseService.assignSupervisorCase(req);
      if (assignSupervisorCaseConfirmation.code == 201) {
        req.flash("success", assignSupervisorCaseConfirmation.message);
      } else {
        req.flash("error", assignSupervisorCaseConfirmation.message);
      }
      if (req.body.p == "p") {
        res.redirect("/case/pendingCases");
      } else {
        res.redirect("/case/viewCase");
      }
    } catch (error) {
      next(error);
    }
  };

  public assignFieldExecutive = async (
    req: any,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const assignFieldExecutiveCaseDataConfirmation: any =
        await this.caseService.assignFieldExecutiveCaseData(req);
      if (assignFieldExecutiveCaseDataConfirmation.code == 201) {
        let fieldExecutiveData = await fieldExecutiveModel.find({
          isDeleted: { $exists: false },
        });
        res.locals.message = req.flash();
        let role = req.user.role;
        let email = req.user.email;
        let id = req.query.id;
        let area = req.query.area;
        let product = req.query.product;
        let bank = req.query.bank;
        let fileNo = req.query.fileNo;
        let mobileNo = req.query.mobileNo;
        let p: any;
        if (req.query.p) {
          p = req.query.p;
        } else {
          p = "";
        }

        res.render("caseFile/assignFieldExecutive", {
          role,
          id,
          area,
          product,
          bank,
          email,
          fileNo,
          mobileNo,
          fieldExecutiveData,
          p,
        });
      } else {
        req.flash("error", assignFieldExecutiveCaseDataConfirmation.message);
        res.redirect("/case/viewCase");
      }
    } catch (error) {
      next(error);
    }
  };

  public assignFieldExecutiveData = async (
    req: any,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const assignFieldExecutiveCaseConfirmation: any =
        await this.caseService.assignFieldExecutiveCase(req);

      if (assignFieldExecutiveCaseConfirmation.code == 201) {
        req.flash("success", assignFieldExecutiveCaseConfirmation.message);
      } else {
        req.flash("error", assignFieldExecutiveCaseConfirmation.message);
      }
      if (req.body.p == "p") {
        res.redirect("/case/pendingCases");
      } else {
        res.redirect("/case/viewCase");
      }
    } catch (error) {
      next(error);
    }
  };

  //********   VIEW CASE AND DUPLICATE CASE   **************************************************************************************
  public viewCase = async (req: any, res: Response, next: NextFunction) => {
    try {
      let role: any = req.user.role;
      let email = req.user.email;
      let fieldExecutive = await fieldExecutiveModel.find({ isDeleted: { $exists: false } }).select('_id fullName');
      res.locals.message = req.flash();
      res.render("caseFile/viewCaseFile", { role, email, fieldExecutive });
    } catch (error) {
      next(error);
    }
  };

  public viewCaseDatatable = async (
    req: any,
    res: Response,
    next: NextFunction
  ) => {
    try {

      let condition = [];
      let array1 = [];
      let array2 = [];
      let array3 = [];
      let date2: any;
      let date1: any;
      let role = req.user.role;
      let searchArray = await viewUploadedCaseSearch(req.body.columns, role);
      const today = moment().utcOffset('+05:30')
      const earlierDate = today.subtract(2, 'months')
      array3.push({
        $match: {
          $and: [
            { caseUploaded: { $gte: new Date(earlierDate.utc().format('YYYY-MM-DD')) } },
            { duplicate: false, }
          ]

        },
      });
      array1.push({
        $match: {
          $and: [
            { caseUploaded: { $gte: new Date(earlierDate.utc().format('YYYY-MM-DD')) } },
            { duplicate: false, }
          ]

        },
      });
      array2.push({
        $match: {
          $and: [
            { caseUploaded: { $gte: new Date(earlierDate.utc().format('YYYY-MM-DD')) } },
            { duplicate: false, }
          ]

        },
      });


      if (req.user.role == "manager") {
        array3.push({
          $match: {
            managerId: new mongoose.Types.ObjectId(req.user._id),
          },
        });
        array1.push({
          $match: {
            managerId: new mongoose.Types.ObjectId(req.user._id),
          },
        });
        array2.push({
          $match: {
            managerId: new mongoose.Types.ObjectId(req.user._id),
          },
        });

      }
      if (req.user.role == "senior-supervisor") {
        array3.push({
          $match: {
            seniorSupervisorId: new mongoose.Types.ObjectId(req.user._id),
          },
        });
        array1.push({
          $match: {
            seniorSupervisorId: new mongoose.Types.ObjectId(req.user._id),
          },
        });
        array2.push({
          $match: {
            seniorSupervisorId: new mongoose.Types.ObjectId(req.user._id),
          },
        });

      }
      if (req.user.role == "supervisor") {
        array3.push({
          $match: {
            supervisorId: new mongoose.Types.ObjectId(req.user._id),
          },
        });
        array1.push({
          $match: {
            supervisorId: new mongoose.Types.ObjectId(req.user._id),
          },
        });
        array2.push({
          $match: {
            supervisorId: new mongoose.Types.ObjectId(req.user._id),
          },
        });

      }

      array3.push({
        $match: {
          fieldExecutiveId: undefined,
        },
      },
        {
          $match: {
            stage: {
              $nin: ["supervisor", "manager", "submited"],
            },
          },
        },);
      array1.push({
        $match: {
          fieldExecutiveId: undefined,
        },
      },
        {
          $match: {
            stage: {
              $nin: ["supervisor", "manager", "submited"],
            },
          },
        },);
      array2.push({
        $match: {
          fieldExecutiveId: undefined,
        },
      },
        {
          $match: {
            stage: {
              $nin: ["supervisor", "manager", "submited"],
            },
          },
        },);
      array3.push({
        $count: "sum",
      });

      if (role === "admin") {
        if (req.body.columns[13].search.value.length > 0 || req.body.columns[14].search.value.length > 0) {
          array2.push({
            $addFields: {
              caseUploadedDate: {
                $toString: "$caseUploaded",
              },
            },
          });
          array1.push({
            $addFields: {
              caseUploadedDate: {
                $toString: "$caseUploaded",
              },
            },
          });
        }
      }
      if (role === "manager") {
        if (req.body.columns[12].search.value.length > 0 || req.body.columns[13].search.value.length > 0) {
          array2.push({
            $addFields: {
              caseUploadedDate: {
                $toString: "$caseUploaded",
              },
            },
          });
          array1.push({
            $addFields: {
              caseUploadedDate: {
                $toString: "$caseUploaded",
              },
            },
          });
        }
      }
      if (role === "senior-supervisor") {
        if (req.body.columns[11].search.value.length > 0 || req.body.columns[12].search.value.length > 0) {
          array2.push({
            $addFields: {
              caseUploadedDate: {
                $toString: "$caseUploaded",
              },
            },
          });
          array1.push({
            $addFields: {
              caseUploadedDate: {
                $toString: "$caseUploaded",
              },
            },
          });
        }
      }
      if (role === "supervisor") {
        if (req.body.columns[10].search.value.length > 0 || req.body.columns[11].search.value.length > 0) {
          array2.push({
            $addFields: {
              caseUploadedDate: {
                $toString: "$caseUploaded",
              },
            },
          });
          array1.push({
            $addFields: {
              caseUploadedDate: {
                $toString: "$caseUploaded",
              },
            },
          });
        }
      }
      if (req.body.columns[2].search.value.length > 0) {
        array1.push({
          $addFields: {
            mobileNumber: {
              $toString: {
                $toLong: "$mobileNo",
              },
            },
          },
        });
        array2.push({
          $addFields: {
            mobileNumber: {
              $toString: {
                $toLong: "$mobileNo",
              },
            },
          },
        });
      }

      if (searchArray.length > 0) {
        array1.push({
          $match: {
            $and: searchArray,
          },
        });
        array2.push({
          $match: {
            $and: searchArray,
          },
        });
      }

      array1.push({
        $count: "sum",
      });
      array2.push(
        {
          $skip: parseInt(req.body.start),
        },
        {
          $limit: parseInt(req.body.length),
        }
      );
      condition.push(
        {
          $facet: {
            sum1: array3,
            sum2: array1,
            data: array2,
          },
        },
        {
          $unwind: {
            path: "$sum1",
          },
        },
        {
          $unwind: {
            path: "$sum2",
          },
        }
      );

      let data: any = [];
      const [caseData] = await caseModel.aggregate(condition);
      let count = parseInt(req.body.start) + 1;
      if (caseData) {
        for (let i = 0; i < caseData.data.length; i++) {
          data.push({
            count: count,
            fileNo: caseData.data[i].declinedBy?.length > 0 ? `<div style="background-color: red;color: black"><b>${caseData.data[i].fileNo}</b></div>` : caseData.data[i].fileNo,
            mobileNo: caseData.data[i].mobileNo,
            applicantName: caseData.data[i].applicantName,
            addressType: caseData.data[i].addressType,
            address: caseData.data[i].address,
            managerAssigned: caseData.data[i].manager ? caseData.data[i].manager.name : `<div> <a class="btn w-35px h-35px mr-1 btn-orange text-uppercase btn-sm" data-toggle="tooltip" title="Update" href= "/case/assignManager/?id=${caseData.data[i]._id}&area=${encodeURIComponent(caseData.data[i].area)}&product=${encodeURIComponent(caseData.data[i].product)}&bank=${encodeURIComponent(caseData.data[i].bank)}&mobileNo=${encodeURIComponent(caseData.data[i].mobileNo)}&fileNo=${encodeURIComponent(caseData.data[i].fileNo)}" data-original-title="Edit">
                  <i class="fa fa-users" aria-hidden="true"></i>
              </a></div>`,
            fieldExecutiveAssigned: req.user.role == "supervisor" ? caseData.data[i].fieldExecutive ? caseData.data[i].fieldExecutive.name
              : `<div> <a class="btn w-35px h-35px mr-1 btn-orange text-uppercase btn-sm" data-toggle="tooltip" title="Update" href="" data-original-title="Edit">
                                <i class="fa fa-users" aria-hidden="true"></i>
                            </a></div>`
              : caseData.data[i].fieldExecutive ? caseData.data[i].fieldExecutive.name : caseData.data[i].supervisor
                ? `<div> <a class="btn w-35px h-35px mr-1 btn-orange text-uppercase btn-sm" data-toggle="tooltip" title="Update" href= "/case/assignFieldExecutive/?id=${caseData.data[i]._id
                }&area=${encodeURIComponent(
                  caseData.data[i].area
                )}&product=${encodeURIComponent(
                  caseData.data[i].product
                )}&bank=${encodeURIComponent(
                  caseData.data[i].bank
                )}&mobileNo=${encodeURIComponent(
                  caseData.data[i].mobileNo
                )}&fileNo=${encodeURIComponent(
                  caseData.data[i].fileNo
                )}" data-original-title="Edit">
                            <i class="fa fa-users" aria-hidden="true"></i>
                        </a></div>`
                : `<div> 
                        <a class="btn w-35px h-35px mr-1 btn-orange text-uppercase btn-sm" data-toggle="tooltip" title="Assign FieldExecutive" onclick="assignFieldExecutive(' /case/assignFieldExecutive/?id=${caseData.data[i]._id
                }&area=${encodeURIComponent(
                  caseData.data[i].area
                )}&product=${encodeURIComponent(
                  caseData.data[i].product
                )}&bank=${encodeURIComponent(
                  caseData.data[i].bank
                )}&mobileNo=${encodeURIComponent(
                  caseData.data[i].mobileNo
                )}&fileNo=${encodeURIComponent(
                  caseData.data[i].fileNo
                )}', 'Supervisor not present,Are you sure you want to assign?')" data-original-title="Assign FieldExecutive">
                        <i class="fa fa-users" aria-hidden="true"></i> </a>
                        </div>`,
            supervisorAssigned: caseData.data[i].supervisor
              ? caseData.data[i].supervisor.name
              : `<div> <a class="btn w-35px h-35px mr-1 btn-orange text-uppercase btn-sm" data-toggle="tooltip" title="Update" href= "/case/assignSupervisor/?id=${caseData.data[i]._id
              }&area=${encodeURIComponent(
                caseData.data[i].area
              )}&product=${encodeURIComponent(
                caseData.data[i].product
              )}&bank=${encodeURIComponent(
                caseData.data[i].bank
              )}&mobileNo=${encodeURIComponent(
                caseData.data[i].mobileNo
              )}&fileNo=${encodeURIComponent(
                caseData.data[i].fileNo
              )}" data-original-title="Edit">
                                <i class="fa fa-users" aria-hidden="true"></i>
                            </a></div>`,
            seniorSupervisorAssigned: caseData.data[i].seniorSupervisor
              ? caseData.data[i].seniorSupervisor.name
              : `<div> <a class="btn w-35px h-35px mr-1 btn-orange text-uppercase btn-sm" data-toggle="tooltip" title="Update" href= "/case/assignSeniorSupervisor/?id=${caseData.data[i]._id
              }&area=${encodeURIComponent(
                caseData.data[i].area
              )}&product=${encodeURIComponent(
                caseData.data[i].product
              )}&bank=${encodeURIComponent(
                caseData.data[i].bank
              )}&mobileNo=${encodeURIComponent(
                caseData.data[i].mobileNo
              )}&fileNo=${encodeURIComponent(
                caseData.data[i].fileNo
              )}" data-original-title="Edit">
                                <i class="fa fa-users" aria-hidden="true"></i>
                            </a></div>`,
            product: caseData.data[i].product,
            area: caseData.data[i].area,
            bank: caseData.data[i].bank,
            date: caseData.data[i].caseUploaded
              ? moment(caseData.data[i].caseUploaded).utc().utc().format("YYYY-MM-DD")
              : "",
            time: caseData.data[i].caseUploaded
              ? moment(caseData.data[i].caseUploaded).utc().utc().format("HH:mm:ss")
              : "",
            action: `<div> 
                                <a class="btn w-35px h-35px mr-1 btn-pink text-uppercase btn-sm" data-toggle="tooltip" title="direct to supervisor" onclick="direct_to_supervisor(' /case/directToSupervisor/?id=${caseData.data[i]._id
              }&sId=${caseData.data[i].supervisorId ? caseData.data[i].supervisorId : ""
              }','Assigning this case direct to supervisor?')" data-original-title="direct to supervisor">
                                <i class="fa fa-users" aria-hidden="true"></i>
                                        </a>
                                <a class="btn w-35px h-35px mr-1 btn-pink text-uppercase btn-sm" data-toggle="tooltip" title="Update" href= "/case/caseHistory/${caseData.data[i]._id
              }" data-original-title="Edit">
                                <i class="fa fa-history" aria-hidden="true"></i>
                                        </a>
                                <a class="btn w-35px h-35px mr-1 btn-orange text-uppercase btn-sm" data-toggle="tooltip" title="Update" href= "/case/editCase/${caseData.data[i]._id
              }" data-original-title="Edit">
                                            <i class="fas fa-pencil"></i>
                                        </a>
                                        <a class="btn w-35px h-35px mr-1 btn-danger text-uppercase btn-sm" data-toggle="tooltip" title="Delete" onclick="delete_sweet_alert(' /case/deleteCase/?id=${caseData.data[i]._id
              }', 'Are you sure you want to delete this data?')" data-original-title="Delete">
                                        <i class="far fa-trash-alt"></i> </a>
                                </div>`,
            caseId: caseData.data[i]._id,
          });
          count++;
        }
        if (data.length == caseData.data.length) {
          let jsonData = JSON.stringify({
            draw: parseInt(req.body.draw),
            recordsTotal: caseData.sum1.sum,
            recordsFiltered: caseData.sum2.sum,
            data,
          });
          res.send(jsonData);
        }
      } else {
        let jsonData = JSON.stringify({ draw: parseInt(req.body.draw), recordsTotal: 0, recordsFiltered: 0, data, });
        res.send(jsonData);
      }
    } catch (error) {
      next(error);
    }
  };

  public viewDuplicateCase = async (
    req: any,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let role: any = req.user.role;
      let email = req.user.email;
      res.locals.message = req.flash();
      res.render("caseFile/viewDuplicateCaseFile", { role, email });
    } catch (error) {
      next(error);
    }
  };

  public viewDuplicateCaseDataTable = async (
    req: any,
    res: Response,
    next: NextFunction
  ) => {
    try {

      let condition = [];
      let array1 = [];
      let array2 = [];
      let array3 = [];

      let searchArray = await viewDuplicateCaseSearch(req.body.columns);

      if (req.user.role === 'manager') {
        array3.push({
          $match: {
            managerId: new mongoose.Types.ObjectId(req.user._id),
          },
        });
        array1.push({
          $match: {
            managerId: new mongoose.Types.ObjectId(req.user._id),
          },
        });
        array2.push({
          $match: {
            managerId: new mongoose.Types.ObjectId(req.user._id),
          },
        });
      }

      if (req.user.role === 'senior-supervisor') {
        array3.push({
          $match: {
            seniorSupervisorId: new mongoose.Types.ObjectId(req.user._id),
          },
        });
        array1.push({
          $match: {
            seniorSupervisorId: new mongoose.Types.ObjectId(req.user._id),
          },
        });
        array2.push({
          $match: {
            seniorSupervisorId: new mongoose.Types.ObjectId(req.user._id),
          },
        });
      }

      if (req.user.role === 'supervisor') {
        array3.push({
          $match: {
            supervisorId: new mongoose.Types.ObjectId(req.user._id),
          },
        });
        array1.push({
          $match: {
            supervisorId: new mongoose.Types.ObjectId(req.user._id),
          },
        });
        array2.push({
          $match: {
            supervisorId: new mongoose.Types.ObjectId(req.user._id),
          },
        });
      }

      array3.push({
        $match: {
          duplicate: true,
        },
      },
        {
          $count: "sum",
        });
      array1.push({
        $match: {
          duplicate: true,
        },
      },);
      array2.push({
        $match: {
          duplicate: true,
        },
      },);


      if (searchArray.length > 0) {
        array1.push({
          $match: {
            $and: searchArray,
          },
        });
        array2.push({
          $match: {
            $and: searchArray,
          },
        });
      }

      array1.push({
        $count: "sum",
      });

      array2.push(
        {
          $skip: parseInt(req.body.start),
        },
        {
          $limit: parseInt(req.body.length),
        }
      );
      condition.push(
        {
          $facet: {
            sum1: array3,
            sum2: array1,
            data: array2,
          },
        },
        {
          $unwind: {
            path: "$sum1",
          },
        },
        {
          $unwind: {
            path: "$sum2",
          },
        }
      );
      let data: any = [];

      const [duplicateCaseData] = await caseModel.aggregate(condition);
      let count = parseInt(req.body.start) + 1;
      if (duplicateCaseData) {
        for (let i = 0; i < duplicateCaseData.data.length; i++) {
          data.push({
            count: count,
            fileNo: duplicateCaseData.data[i].fileNo,
            applicantName: duplicateCaseData.data[i].applicantName,
            // duplicateTimes: duplicateCaseData.data[i].count,
            mobile: duplicateCaseData.data[i].mobileNo,
            action: `<div> 
                                <a class="btn w-35px h-35px mr-1 btn-blue text-uppercase btn-sm" data-toggle="tooltip" title="view" href= "/case/viewDuplicateCaseDataLogs?id=${duplicateCaseData.data[i].parentId
              }&fileNo=${encodeURIComponent(
                duplicateCaseData.data[i].fileNo
              )}&mobileNo=${encodeURIComponent(
                duplicateCaseData.data[i].mobileNo
              )}&applicantName=${encodeURIComponent(
                duplicateCaseData.data[i].applicantName
              )}" data-original-title="Edit">
                                <i class="fa fa-eye" aria-hidden="true"></i>
                                </a>
                            </div>`,
          });
          count++;
        }
        if (data.length == duplicateCaseData.data.length) {
          let jsonData = JSON.stringify({
            draw: parseInt(req.body.draw),
            recordsTotal: duplicateCaseData.sum1.sum,
            recordsFiltered: duplicateCaseData.sum2.sum,
            data,
          });
          res.send(jsonData);
        }
      } else {
        let jsonData = JSON.stringify({
          draw: parseInt(req.body.draw),
          recordsTotal: 0,
          recordsFiltered: 0,
          data,
        });
        res.send(jsonData);
      }
    } catch (error) {
      next(error);
    }
  };

  public viewDuplicateCaseDataLogs = async (
    req: any,
    res: Response,
    next: NextFunction
  ) => {
    try {

      var currentTime = new Date();
      var year = currentTime.getFullYear();
      let role: any = req.user.role;
      let email = req.user.email;
      res.locals.message = req.flash();
      let mobileNo = req.query.mobileNo;
      let fileNo = req.query.fileNo;
      let parentId = req.query.id;
      res.render("caseFile/viewDuplicateCaseFileLogs", {
        role,
        email,
        mobileNo,
        fileNo,
        year,
        parentId,
      });
    } catch (error) {
      next(error);
    }
  };

  public viewDuplicateCaseDataLogsDataTable = async (
    req: any,
    res: Response,
    next: NextFunction
  ) => {
    try {

      let condition = [];
      condition.push(
        {
          $match: {
            $or: [
              {
                fileNo: req.body.fileNo.toString(),
              },
              {
                mobileNo: parseInt(req.body.mobileNo),
              },
              {
                parentId: new mongoose.Types.ObjectId(`${req.body.parentId}`),
              },
              {
                _id: new mongoose.Types.ObjectId(`${req.body.parentId}`),
              },
            ],
          },
        },

        {
          $lookup: {
            from: "managers",
            localField: "managerId",
            foreignField: "_id",
            as: "managerId",
          },
        },
        {
          $lookup: {
            from: "seniorsupervisors",
            localField: "seniorSupervisorId",
            foreignField: "_id",
            as: "seniorSupervisorId",
          },
        },
        {
          $lookup: {
            from: "supervisors",
            localField: "supervisorId",
            foreignField: "_id",
            as: "supervisorId",
          },
        },
        {
          $sort: {
            created_at: -1,
          },
        }
      );
      caseModel.countDocuments(condition).exec((err, row) => {
        if (err) next(err);
        let data: any = [];
        let count: any = 1;
        caseModel.aggregate(condition).exec((err, rows) => {
          if (err) next(err);
          rows.forEach((doc: any) => {
            try {
              data.push({
                count: count,
                fileNo: doc.fileNo,
                date: doc.date,
                time: doc.time,
                copyStatus: doc.copyStatus == "copied" ? doc.copyStatus : "",
                applicantName: doc.applicantName,
                managerName: doc.managerId[0] ? doc.managerId[0].fullName : "",
                seniorSupervisorName: doc.seniorSupervisorId[0]
                  ? doc.seniorSupervisorId[0].fullName
                  : "",
                supervisorName: doc.supervisorId[0]
                  ? doc.supervisorId[0].fullName
                  : "",
                mobile: doc.mobileNo,
                area: doc.area,
                bank: doc.bank,
                product: doc.product,
                addressType: doc.addressType,
                caseStatus: doc.caseStatus,
                caseStatusRemarks: doc.caseStatusRemarks,
                createdAt: doc.caseUploaded
                  ? moment(doc.caseUploaded).utc().format("DD-MM-YYYY HH:mm:ss")
                  : "",
                action:
                  doc.duplicate == true
                    ? req.user.role == "admin"
                      ? `<div> 
                                <a class="btn w-35px h-35px mr-1 btn-pink text-uppercase btn-sm" data-toggle="tooltip" title="Update" href= "/case/caseHistory/${doc._id
                      }" data-original-title="Edit">
                                <i class="fa fa-history" aria-hidden="true"></i>
                                        </a>
                                <a class="btn w-35px h-35px mr-1 btn-blue text-uppercase btn-sm" data-toggle="tooltip" title="View" href= "/case/viewDuplicateFeCase/?id=${doc._id
                      }" data-original-title="Edit">
            <i class="fa fa-eye" aria-hidden="true"></i>
        </a>
        <a id="assiDup" class="btn w-35px h-35px mr-1 btn-orange text-uppercase btn-sm" data-toggle="tooltip" title="Assign Field Executive" href= "/case/assignDuplicateCase/?id=${doc._id
                      }&m=${doc.managerId[0] ? doc.managerId[0]._id : ""}&ss=${doc.seniorSupervisorId[0]
                        ? doc.seniorSupervisorId[0]._id
                        : ""
                      }&s=${doc.supervisorId[0] ? doc.supervisorId[0]._id : ""
                      }&pId=${req.body.parentId}" data-original-title="Edit">
            <i class="fa fa-users" aria-hidden="true"></i>
        </a>
        <a id="viewCase" class="btn w-35px h-35px mr-1 btn-green text-uppercase btn-sm" data-toggle="tooltip" title="Copy Case Details" href= "/case/viewCaseFilesForCopy?id=${doc._id
                      }&fileNo=${encodeURIComponent(
                        doc.fileNo
                      )}&mobileNo=${encodeURIComponent(
                        doc.mobileNo
                      )}&addressType=${encodeURIComponent(
                        doc.addressType
                      )}&m=${doc.managerId[0] ? doc.managerId[0]._id : ""
                      }&ss=${doc.seniorSupervisorId[0]
                        ? doc.seniorSupervisorId[0]._id
                        : ""
                      }&s=${doc.supervisorId[0] ? doc.supervisorId[0]._id : ""
                      }&pId=${req.body.parentId}" data-original-title="Edit">
            <i class="fa-solid fa-copy"></i>
        </a>
        <a class="btn w-35px h-35px mr-1 btn-danger text-uppercase btn-sm" data-toggle="tooltip" title="Delete" onclick="delete_sweet_alert('/case/deleteCase/?id=${doc._id
                      }&d=d', 'Are you sure you want to delete this data?')" data-original-title="Delete">
                                        <i class="far fa-trash-alt"></i> </a>

    </div>`
                      : `<div> 
    <a class="btn w-35px h-35px mr-1 btn-blue text-uppercase btn-sm" data-toggle="tooltip" title="View" href= "/case/viewDuplicateFeCase/?id=${doc._id
                      }" data-original-title="Edit">
        <i class="fa fa-eye" aria-hidden="true"></i>
    </a>
    <a id="assiDup" class="btn w-35px h-35px mr-1 btn-orange text-uppercase btn-sm" data-toggle="tooltip" title="Assign Field Executive" href= "/case/assignDuplicateCase/?id=${doc._id
                      }&m=${doc.managerId[0] ? doc.managerId[0]._id : ""}&ss=${doc.seniorSupervisorId[0]
                        ? doc.seniorSupervisorId[0]._id
                        : ""
                      }&s=${doc.supervisorId[0] ? doc.supervisorId[0]._id : ""
                      }&pId=${req.body.parentId}" data-original-title="Edit">
        <i class="fa fa-users" aria-hidden="true"></i>
    </a>
    <a id="viewCase" class="btn w-35px h-35px mr-1 btn-green text-uppercase btn-sm" data-toggle="tooltip" title="Copy Case Details" href= "/case/viewCaseFilesForCopy?id=${doc._id
                      }&fileNo=${encodeURIComponent(doc.fileNo)}&mobileNo=${encodeURIComponent(
                        doc.mobileNo
                      )}&addressType=${encodeURIComponent(
                        doc.addressType
                      )}&m=${doc.managerId[0] ? doc.managerId[0]._id : ""
                      }&ss=${doc.seniorSupervisorId[0]
                        ? doc.seniorSupervisorId[0]._id
                        : ""
                      }&s=${doc.supervisorId[0] ? doc.supervisorId[0]._id : ""
                      }&pId=${req.body.parentId}" data-original-title="Edit">
            <i class="fa-solid fa-copy"></i>
        </a>
    
</div>`
                    : "NOT DUPLICATE",
              });
              count++;
              if (count > rows.length) {
                let jsonData = JSON.stringify({ data });
                res.send(jsonData);
              }
            } catch (error) {
              next(error);
            }
          });
        });
      });
    } catch (error) {
      next(error);
    }
  };


  //********   REVIEW CASE   **************************************************************************************************
  // *****supervisor review*****
  public reviewSupervisorCase = async (
    req: any,
    res: Response,
    next: NextFunction
  ) => {
    try {

      const { role, email, permissions } = req.user
      res.locals.message = req.flash();
      res.render("caseFile/supervisorReview", { role, email, permissions });
    } catch (error) {
      next(error);
    }
  };

  public reviewSupervisorCaseDataTable = async (
    req: any,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let condition = [];
      let array1 = [];
      let array2 = [];
      let array3 = [];
      let date2: any;
      let date1: any;

      let searchArray = await customSearchReview(req.body.columns, req.user.role);

      let excelArray = [];
      const today = moment().utcOffset('+05:30')
      const earlierDate = today.subtract(2, 'months')
      if (req.body.excel == "excel") {

        excelArray.push({
          $match: {
            $and: [
              { caseUploaded: { $gte: new Date(earlierDate.utc().format('YYYY-MM-DD')) } },
              {
                supervisorId: new mongoose.Types.ObjectId(`${req.user._id}`),
              },
              {
                stage: "supervisor",
              },
              {
                status: "open",
              },
            ]

          },
        });

        if (req.body.startDate && !req.body.endDate) {
          date1 = moment(req.body.startDate).format("YYYY/MM/DD");
          date2 = moment(date1).add(1, "days").format("YYYY/MM/DD");
          excelArray.push({
            $match: {
              caseUploaded: {
                $gte: new Date(moment(date1).format("YYYY-MM-DD")),
                $lte: new Date(moment(date2).format("YYYY-MM-DD")),
              },
            },
          });
        }
        if (req.body.startDate && req.body.endDate) {
          date1 = moment(req.body.startDate).format("YYYY/MM/DD");
          date2 = moment(req.body.endDate).add(1, "days").format("YYYY/MM/DD");
          excelArray.push({
            $match: {
              caseUploaded: {
                $gte: new Date(moment(date1).format("YYYY-MM-DD")),
                $lte: new Date(moment(date2).format("YYYY-MM-DD")),
              },
            },
          });
        }
        if (!req.body.startDate && !req.body.endDate) {
          date1 = moment(Date.now()).subtract(10, "days").format("YYYY/MM/DD");
          date2 = moment(Date.now()).add(1, "days").format("YYYY/MM/DD");

          excelArray.push({
            $match: {
              caseUploaded: {
                $gte: new Date(moment(date1).format("YYYY-MM-DD")),
                $lte: new Date(moment(date2).format("YYYY-MM-DD")),
              },
            },
          });
        }
        if (
          req.body.columns[2].search.value.length > 0 ||
          req.body.columns[3].search.value.length > 0
        ) {
          excelArray.push({
            $addFields: {
              caseUploadedDate: {
                $toString: "$caseUploaded",
              },
            },
          });
        }

        if (
          req.body.columns[6].search.value.length > 0 ||
          req.body.columns[7].search.value.length > 0
        ) {
          excelArray.push({
            $addFields: {
              "fieldExecutive.assignedDateS": {
                $toString: "$fieldExecutive.assignedDate",
              },
            },
          });
        }
        if (
          req.body.columns[8].search.value.length > 0 ||
          req.body.columns[9].search.value.length > 0
        ) {
          excelArray.push({
            $addFields: {
              "fieldExecutive.acceptedDateS": {
                $toString: "$fieldExecutive.acceptedDate",
              },
            },
          });
        }
        if (
          req.body.columns[10].search.value.length > 0 ||
          req.body.columns[11].search.value.length > 0
        ) {
          excelArray.push({
            $addFields: {
              "fieldExecutive.submittedDateS": {
                $toString: "$fieldExecutive.submittedDate",
              },
            },
          });
        }

        if (searchArray.length > 0) {
          excelArray.push({
            $match: {
              $and: searchArray,
            },
          });
        }
        let excelData = await caseModel.aggregate(excelArray);
        if (excelData.length > 3000) {
          res.send(JSON.stringify("limit"));
        } else if (excelData.length <= 3000 && excelData.length > 0) {
          let result = await createReviewCaseExcel(excelData, req.user.role);
          if (result.code == 201) {
            res.send(JSON.stringify("SUCCESS"));
          } else {
            res.send(JSON.stringify("FAILED"));
          }
        } else if (excelData.length <= 0) {
          res.send(JSON.stringify("noData"));
        }
      } else {
        array3.push({
          $match: {
            $and: [
              { caseUploaded: { $gte: new Date(earlierDate.utc().format('YYYY-MM-DD')) } },
              {
                supervisorId: new mongoose.Types.ObjectId(`${req.user._id}`),
              },
              {
                stage: "supervisor",
              },
              {
                status: "open",
              },
            ],
          },
        });
        array1.push({
          $match: {
            $and: [
              { caseUploaded: { $gte: new Date(earlierDate.utc().format('YYYY-MM-DD')) } },
              {
                supervisorId: new mongoose.Types.ObjectId(`${req.user._id}`),
              },
              {
                stage: "supervisor",
              },
              {
                status: "open",
              },
            ],
          },
        });
        array2.push({
          $match: {
            $and: [
              { caseUploaded: { $gte: new Date(earlierDate.utc().format('YYYY-MM-DD')) } },
              {
                supervisorId: new mongoose.Types.ObjectId(`${req.user._id}`),
              },
              {
                stage: "supervisor",
              },
              {
                status: "open",
              },
            ],
          },
        });
        array3.push({
          $count: "sum",
        });

        if (req.body.startDate && !req.body.endDate) {
          date1 = moment(req.body.startDate).format("YYYY/MM/DD");
          date2 = moment(date1).add(1, "days").format("YYYY/MM/DD");
          array2.push({
            $match: {
              caseUploaded: {
                $gte: new Date(date1),
                $lte: new Date(date2),
              },
            },
          });
          array1.push({
            $match: {
              caseUploaded: {
                $gte: new Date(date1),
                $lte: new Date(date2),
              },
            },
          });
        }
        if (req.body.startDate && req.body.endDate) {
          date1 = moment(req.body.startDate).format("YYYY/MM/DD");
          date2 = moment(req.body.endDate).add(1, "days").format("YYYY/MM/DD");
          array2.push({
            $match: {
              caseUploaded: {
                $gte: new Date(date1),
                $lte: new Date(date2),
              },
            },
          });
          array1.push({
            $match: {
              caseUploaded: {
                $gte: new Date(date1),
                $lte: new Date(date2),
              },
            },
          });
        }
        if (req.body.columns[2].search.value.length > 0 || req.body.columns[3].search.value.length > 0) {
          array2.push({
            $addFields: {
              caseUploadedDate: {
                $toString: "$caseUploaded",
              },
            },
          });
          array1.push({
            $addFields: {
              caseUploadedDate: {
                $toString: "$caseUploaded",
              },
            },
          });
        }
        if (req.body.columns[5].search.value.length > 0 || req.body.columns[6].search.value.length > 0) {
          array2.push({
            $addFields: {
              "fieldExecutive.assignedDateS": {
                $toString: "$fieldExecutive.assignedDate",
              },
            },
          });
          array1.push({
            $addFields: {
              "fieldExecutive.assignedDateS": {
                $toString: "$fieldExecutive.assignedDate",
              },
            },
          });
        }
        if (req.body.columns[7].search.value.length > 0 || req.body.columns[8].search.value.length > 0) {
          array2.push({
            $addFields: {
              "fieldExecutive.acceptedDateS": {
                $toString: "$fieldExecutive.acceptedDate",
              },
            },
          });
          array1.push({
            $addFields: {
              "fieldExecutive.acceptedDateS": {
                $toString: "$fieldExecutive.acceptedDate",
              },
            },
          });
        }
        if (req.body.columns[9].search.value.length > 0 || req.body.columns[10].search.value.length > 0) {
          array2.push({
            $addFields: {
              "fieldExecutive.submittedDateS": {
                $toString: "$fieldExecutive.submittedDate",
              },
            },
          });
          array1.push({
            $addFields: {
              "fieldExecutive.submittedDateS": {
                $toString: "$fieldExecutive.submittedDate",
              },
            },
          });
        }

        if (searchArray.length > 0) {
          array1.push({
            $match: {
              $and: searchArray,
            },
          });
        }
        if (searchArray.length > 0) {
          array2.push({
            $match: {
              $and: searchArray,
            },
          });
        }
        array1.push({
          $count: "sum",
        });
        array2.push(
          {
            $skip: parseInt(req.body.start),
          },
          {
            $limit: parseInt(req.body.length),
          }
        );
        condition.push(
          {
            $facet: {
              sum1: array3,
              sum2: array1,
              data: array2,
            },
          },
          {
            $unwind: {
              path: "$sum1",
            },
          },
          {
            $unwind: {
              path: "$sum2",
            },
          }
        );
        let data: any = [];
        let caseData = await caseModel.aggregate(condition);


        let count = parseInt(req.body.start) + 1;
        if (caseData[0]) {
          for (let i = 0; i < caseData[0].data.length; i++) {
            data.push({
              count: count,
              fileNo: caseData[0].data[i].fileNo,
              caseUploaded: caseData[0].data[i].caseUploaded
                ? moment(caseData[0].data[i].caseUploaded).format("YYYY-MM-DD")
                : "",
              caseUploadTime: caseData[0].data[i].caseUploaded
                ? moment(caseData[0].data[i].caseUploaded)
                  .utc()
                  .format("HH:mm:ss")
                : "",
              fieldExecutiveName: `${caseData[0].data[i].fieldExecutive
                ? caseData[0].data[i].fieldExecutive.name
                  ? caseData[0].data[i].fieldExecutive.name
                  : ""
                : ""
                }`,
              fieldExecutiveAssignedDate: `${caseData[0].data[i].fieldExecutive
                ? caseData[0].data[i].fieldExecutive.assignedDate
                  ? moment(caseData[0].data[i].fieldExecutive.assignedDate)
                    .utc()
                    .format("YYYY-MM-DD")
                  : ""
                : ""
                }`,
              fieldExecutiveAssignedTime: `${caseData[0].data[i].fieldExecutive
                ? caseData[0].data[i].fieldExecutive.assignedDate
                  ? moment(caseData[0].data[i].fieldExecutive.assignedDate)
                    .utc()
                    .format("HH:mm:ss")
                  : ""
                : ""
                }`,
              fieldExecutiveAcceptedDate: `${caseData[0].data[i].fieldExecutive
                ? caseData[0].data[i].fieldExecutive.acceptedDate
                  ? moment(caseData[0].data[i].fieldExecutive.acceptedDate)
                    .utc()
                    .format("YYYY-MM-DD")
                  : ""
                : ""
                }`,
              fieldExecutiveAcceptedTime: `${caseData[0].data[i].fieldExecutive
                ? caseData[0].data[i].fieldExecutive.acceptedDate
                  ? moment(caseData[0].data[i].fieldExecutive.acceptedDate)
                    .utc()
                    .format("HH:mm:ss")
                  : ""
                : ""
                }`,
              fieldExecutiveSubmitDate: `${caseData[0].data[i].fieldExecutive
                ? caseData[0].data[i].fieldExecutive.submittedDate
                  ? moment(caseData[0].data[i].fieldExecutive.submittedDate)
                    .utc()
                    .format("YYYY-MM-DD")
                  : ""
                : ""
                }`,
              fieldExecutiveSubmitTime: `${caseData[0].data[i].fieldExecutive
                ? caseData[0].data[i].fieldExecutive.submittedDate
                  ? moment(caseData[0].data[i].fieldExecutive.submittedDate)
                    .utc()
                    .format("HH:mm:ss")
                  : ""
                : ""
                }`,
              km: `${caseData[0].data[i].distance ? caseData[0].data[i].distance : ""
                }`,
              status: `${caseData[0].data[i].caseStatus
                ? caseData[0].data[i].caseStatus
                : ""
                }`,
              remarks: `${caseData[0].data[i].caseStatusRemarks
                ? caseData[0].data[i].caseStatusRemarks
                : ""
                }`,
              applicantName: caseData[0].data[i].applicantName,
              addressType: caseData[0].data[i].addressType,
              product: caseData[0].data[i].product,
              area: caseData[0].data[i].area,
              bank: caseData[0].data[i].bank,
              action: `<div> <a class="btn w-35px h-35px mr-1 btn-orange text-uppercase btn-sm" data-toggle="tooltip" title="Update" href= "/case/editReviewAdminCase/${caseData[0].data[i]._id}" data-original-title="Edit">
                                          <i class="fas fa-pencil"></i>
                                      </a>
                                      <a class="btn w-35px h-35px mr-1 btn-danger text-uppercase btn-sm" data-toggle="tooltip" title="Delete" onclick="delete_sweet_alert('', 'Are you sure you want to delete this data?')" data-original-title="Delete">
                                      <i class="far fa-trash-alt"></i> </a>
                                      <a class="btn w-35px h-35px mr-1 btn-pink text-uppercase btn-sm" data-toggle="tooltip" title="Update" href= "/case/caseHistory/${caseData[0].data[i]._id}" data-original-title="Edit">
                                      <i class="fa fa-history" aria-hidden="true"></i>
                                              </a>
                              </div>`,
            });
            count++;
          }
          if (data.length == caseData[0].data.length) {
            let jsonData = JSON.stringify({
              draw: parseInt(req.body.draw),
              recordsTotal: caseData[0].sum1.sum,
              recordsFiltered: caseData[0].sum2.sum,
              data,
            });
            res.send(jsonData);
          }
        } else {
          let jsonData = JSON.stringify({
            draw: parseInt(req.body.draw),
            recordsTotal: 0,
            recordsFiltered: 0,
            data,
          });
          res.send(jsonData);
        }
      }

    } catch (error) {
      next(error);
    }
  };

  public editReviewSupervisorCase = async (
    req: any,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let x = [];
      let role = req.user.role;
      let email = req.user.email;
      let id = req.params.id;
      res.locals.message = req.flash();
      let caseData = await caseModel.findOne({
        _id: id,
        supervisorId: req.user._id,
      });
      for (let i = 0; i < caseData.documents.length; i++) {
        x[i] = await this.Helper.getSignedUrlAWS(caseData.documents[i]);
      }
      res.render("caseFile/reviewCase/editReviewCase", {
        role,
        email,
        id,
        caseData,
        x,
      });
    } catch (error) {
      next(error);
    }
  };

  public editReviewSupervisorCaseData = async (
    req: any,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let caseData = await caseModel.findOne({ _id: req.body.id });
      if (req.fileValidationError) {
        req.flash("error", req.fileValidationError);
        if (req.body.myUrl) {
          res.redirect(req.body.myUrl);
        } else {
          res.redirect(`/case/editReviewSupervisorCase/${caseData._id}`);
        }
      } else {
        let role = req.user.role;
        let email = req.user.email;
        const editReviewSupervisorCaseDataConfirmation: any =
          await this.caseService.editReviewSupervisorCaseData(req, caseData);
        if (editReviewSupervisorCaseDataConfirmation.code == 201) {

          if (!req.body.duplicate) {
            if (req.files) {
              if (req.files.imageFile1) {

                this.Helper.deleteObjectAWS(caseData.documents[0]);
              }
              if (req.files.imageFile2) {

                this.Helper.deleteObjectAWS(caseData.documents[1]);
              }
              if (req.files.imageFile3) {

                this.Helper.deleteObjectAWS(caseData.documents[2]);
              }
              if (req.files.imageFile4) {

                this.Helper.deleteObjectAWS(caseData.documents[3]);
              }
              if (req.files.imageFile5) {
                this.Helper.deleteObjectAWS(caseData.documents[4]);
              }
              if (req.files.imageFile6) {
                this.Helper.deleteObjectAWS(caseData.documents[5]);
              }
              if (req.files.imageFile7) {
                this.Helper.deleteObjectAWS(caseData.documents[6]);
              }
              if (req.files.imageFile8) {
                this.Helper.deleteObjectAWS(caseData.documents[7]);
              }
            }
          }
          req.flash("success", editReviewSupervisorCaseDataConfirmation.message);
          if (req.body.duplicate) {
            res.redirect("/case/successfullyCompletedCase");
          } else if (req.body.resend) {
            for (let i = 0; i < caseData.documents.length; i++) {
              this.Helper.deleteObjectAWS(caseData.documents[i]);
            }
            res.redirect("/case/reviewSupervisorCase");
          } else {
            res.redirect("/case/reviewSupervisorCase");
          }
        } else {
          req.flash("error", editReviewSupervisorCaseDataConfirmation.message);
          if (req.files) {
            if (req.files.imageFile1) {
              this.Helper.deleteObjectAWS(req.files.imageFile1[0].key);
            }
            if (req.files.imageFile2) {
              this.Helper.deleteObjectAWS(req.files.imageFile2[0].key);
            }
            if (req.files.imageFile3) {
              this.Helper.deleteObjectAWS(req.files.imageFile3[0].key);
            }
            if (req.files.imageFile4) {
              this.Helper.deleteObjectAWS(req.files.imageFile4[0].key);
            }
            if (req.files.imageFile5) {
              this.Helper.deleteObjectAWS(req.files.imageFile5[0].key);
            }
            if (req.files.imageFile6) {
              this.Helper.deleteObjectAWS(req.files.imageFile6[0].key);
            }
            if (req.files.imageFile7) {
              this.Helper.deleteObjectAWS(req.files.imageFile7[0].key);
            }
            if (req.files.imageFile8) {
              this.Helper.deleteObjectAWS(req.files.imageFile8[0].key);
            }
          }
          if (req.body.myUrl) {
            res.redirect(req.body.myUrl);
          } else {
            res.redirect(`/case/editReviewSupervisorCase/${caseData._id}`);
          }
        }
      }
    } catch (error) {
      next(error);
    }
  };

  // ****** manager review***
  public reviewManagerCase = async (
    req: any,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { role, email, permissions } = req.user
      res.locals.message = req.flash();
      res.render("caseFile/ManagerReview", { role, email, permissions });
    } catch (error) {
      next(error);
    }
  };

  public reviewManagerCaseDataTable = async (
    req: any,
    res: Response,
    next: NextFunction
  ) => {
    try {

      let condition = [];
      let array1 = [];
      let array2 = [];
      let array3 = [];
      let date2: any;
      let date1: any;
      let searchArray = await customSearchReview(
        req.body.columns,
        req.user.role
      );
      let excelArray = [];
      const today = moment().utcOffset('+05:30')
      const earlierDate = today.subtract(2, 'months')
      if (req.body.excel == "excel") {



        excelArray.push({
          $match: {
            $and: [
              { caseUploaded: { $gte: new Date(earlierDate.utc().format('YYYY-MM-DD')) } },
              {
                managerId: new mongoose.Types.ObjectId(`${req.user._id}`),
              },
              {
                stage: "manager",
              },
              {
                status: "open",
              },
            ]

          },
        })


        if (req.body.startDate && !req.body.endDate) {
          date1 = moment(req.body.startDate).format("YYYY/MM/DD");
          date2 = moment(date1).add(1, "days").format("YYYY/MM/DD");
          excelArray.push({
            $match: {
              caseUploaded: {
                $gte: new Date(moment(date1).format("YYYY-MM-DD")),
                $lte: new Date(moment(date2).format("YYYY-MM-DD")),
              },
            },
          });
        }
        if (req.body.startDate && req.body.endDate) {
          date1 = moment(req.body.startDate).format("YYYY/MM/DD");
          date2 = moment(req.body.endDate).add(1, "days").format("YYYY/MM/DD");
          excelArray.push({
            $match: {
              caseUploaded: {
                $gte: new Date(moment(date1).format("YYYY-MM-DD")),
                $lte: new Date(moment(date2).format("YYYY-MM-DD")),
              },
            },
          });
        }
        if (!req.body.startDate && !req.body.endDate) {
          date1 = moment(Date.now()).subtract(10, "days").format("YYYY/MM/DD");
          date2 = moment(Date.now()).add(1, "days").format("YYYY/MM/DD");

          excelArray.push({
            $match: {
              caseUploaded: {
                $gte: new Date(moment(date1).format("YYYY-MM-DD")),
                $lte: new Date(moment(date2).format("YYYY-MM-DD")),
              },
            },
          });
        }
        if (
          req.body.columns[2].search.value.length > 0 ||
          req.body.columns[3].search.value.length > 0
        ) {
          excelArray.push({
            $addFields: {
              caseUploadedDate: {
                $toString: "$caseUploaded",
              },
            },
          });
        }

        if (
          req.body.columns[5].search.value.length > 0 ||
          req.body.columns[6].search.value.length > 0
        ) {
          excelArray.push({
            $addFields: {
              "seniorSupervisor.assignedDateS": {
                $toString: "$seniorSupervisor.assignedDate",
              },
            },
          });
        }
        if (
          req.body.columns[8].search.value.length > 0 ||
          req.body.columns[9].search.value.length > 0
        ) {
          excelArray.push({
            $addFields: {
              "supervisor.assignedDateS": {
                $toString: "$supervisor.assignedDate",
              },
            },
          });
        }
        if (
          req.body.columns[10].search.value.length > 0 ||
          req.body.columns[11].search.value.length > 0
        ) {
          excelArray.push({
            $addFields: {
              "supervisor.submittedDateS": {
                $toString: "$supervisor.submittedDateS",
              },
            },
          });
        }
        if (
          req.body.columns[13].search.value.length > 0 ||
          req.body.columns[14].search.value.length > 0
        ) {
          excelArray.push({
            $addFields: {
              "fieldExecutive.assignedDateS": {
                $toString: "$fieldExecutive.assignedDate",
              },
            },
          });
        }
        if (
          req.body.columns[15].search.value.length > 0 ||
          req.body.columns[16].search.value.length > 0
        ) {
          excelArray.push({
            $addFields: {
              "fieldExecutive.acceptedDateS": {
                $toString: "$fieldExecutive.acceptedDate",
              },
            },
          });
        }
        if (
          req.body.columns[17].search.value.length > 0 ||
          req.body.columns[18].search.value.length > 0
        ) {
          excelArray.push({
            $addFields: {
              "fieldExecutive.submittedDateS": {
                $toString: "$fieldExecutive.submittedDate",
              },
            },
          });
        }

        if (searchArray.length > 0) {
          excelArray.push({
            $match: {
              $and: searchArray,
            },
          });
        }
        let excelData = await caseModel.aggregate(excelArray);
        if (excelData.length > 3000) {
          res.send(JSON.stringify("limit"));
        } else if (excelData.length <= 3000 && excelData.length > 0) {
          let result = await createReviewCaseExcel(excelData, req.user.role);
          if (result.code == 201) {
            res.send(JSON.stringify("SUCCESS"));
          } else {
            res.send(JSON.stringify("FAILED"));
          }
        } else if (excelData.length <= 0) {
          res.send(JSON.stringify("noData"));
        }
      } else {
        array3.push({
          $match: {
            $and: [
              { caseUploaded: { $gte: new Date(earlierDate.utc().format('YYYY-MM-DD')) } },
              {
                managerId: new mongoose.Types.ObjectId(`${req.user._id}`),
              },
              {
                stage: "manager",
              },
              {
                status: "open",
              },
            ],
          },
        });
        array1.push({
          $match: {
            $and: [
              { caseUploaded: { $gte: new Date(earlierDate.utc().format('YYYY-MM-DD')) } },
              {
                managerId: new mongoose.Types.ObjectId(`${req.user._id}`),
              },
              {
                stage: "manager",
              },
              {
                status: "open",
              },
            ],
          },
        });
        array2.push({
          $match: {
            $and: [
              { caseUploaded: { $gte: new Date(earlierDate.utc().format('YYYY-MM-DD')) } },
              {
                managerId: new mongoose.Types.ObjectId(`${req.user._id}`),
              },
              {
                stage: "manager",
              },
              {
                status: "open",
              },
            ],
          },
        });

        array3.push({
          $count: "sum",
        });

        if (req.body.startDate && !req.body.endDate) {
          date1 = moment(req.body.startDate).format("YYYY/MM/DD");
          date2 = moment(date1).add(1, "days").format("YYYY/MM/DD");
          array2.push({
            $match: {
              caseUploaded: {
                $gte: new Date(date1),
                $lte: new Date(date2),
              },
            },
          });
          array1.push({
            $match: {
              caseUploaded: {
                $gte: new Date(date1),
                $lte: new Date(date2),
              },
            },
          });
        }
        if (req.body.startDate && req.body.endDate) {
          date1 = moment(req.body.startDate).format("YYYY/MM/DD");
          date2 = moment(req.body.endDate).add(1, "days").format("YYYY/MM/DD");
          array2.push({
            $match: {
              caseUploaded: {
                $gte: new Date(date1),
                $lte: new Date(date2),
              },
            },
          });
          array1.push({
            $match: {
              caseUploaded: {
                $gte: new Date(date1),
                $lte: new Date(date2),
              },
            },
          });
        }
        if (
          req.body.columns[2].search.value.length > 0 ||
          req.body.columns[3].search.value.length > 0
        ) {
          array2.push({
            $addFields: {
              caseUploadedDate: {
                $toString: "$caseUploaded",
              },
            },
          });
          array1.push({
            $addFields: {
              caseUploadedDate: {
                $toString: "$caseUploaded",
              },
            },
          });
        }

        if (
          req.body.columns[5].search.value.length > 0 ||
          req.body.columns[6].search.value.length > 0
        ) {
          array2.push({
            $addFields: {
              "seniorSupervisor.assignedDateS": {
                $toString: "$seniorSupervisor.assignedDate",
              },
            },
          });
          array1.push({
            $addFields: {
              "seniorSupervisor.assignedDateS": {
                $toString: "$seniorSupervisor.assignedDate",
              },
            },
          });
        }
        if (
          req.body.columns[8].search.value.length > 0 ||
          req.body.columns[9].search.value.length > 0
        ) {
          array2.push({
            $addFields: {
              "supervisor.assignedDateS": {
                $toString: "$supervisor.assignedDate",
              },
            },
          });
          array1.push({
            $addFields: {
              "supervisor.assignedDateS": {
                $toString: "$supervisor.assignedDate",
              },
            },
          });
        }
        if (
          req.body.columns[10].search.value.length > 0 ||
          req.body.columns[11].search.value.length > 0
        ) {
          array2.push({
            $addFields: {
              "supervisor.submittedDateS": {
                $toString: "$supervisor.submittedDateS",
              },
            },
          });
          array1.push({
            $addFields: {
              "supervisor.submittedDateS": {
                $toString: "$supervisor.submittedDateS",
              },
            },
          });
        }
        if (
          req.body.columns[13].search.value.length > 0 ||
          req.body.columns[14].search.value.length > 0
        ) {
          array2.push({
            $addFields: {
              "fieldExecutive.assignedDateS": {
                $toString: "$fieldExecutive.assignedDate",
              },
            },
          });
          array1.push({
            $addFields: {
              "fieldExecutive.assignedDateS": {
                $toString: "$fieldExecutive.assignedDate",
              },
            },
          });
        }
        if (
          req.body.columns[15].search.value.length > 0 ||
          req.body.columns[16].search.value.length > 0
        ) {
          array2.push({
            $addFields: {
              "fieldExecutive.acceptedDateS": {
                $toString: "$fieldExecutive.acceptedDate",
              },
            },
          });
          array1.push({
            $addFields: {
              "fieldExecutive.acceptedDateS": {
                $toString: "$fieldExecutive.acceptedDate",
              },
            },
          });
        }
        if (
          req.body.columns[17].search.value.length > 0 ||
          req.body.columns[18].search.value.length > 0
        ) {
          array2.push({
            $addFields: {
              "fieldExecutive.submittedDateS": {
                $toString: "$fieldExecutive.submittedDate",
              },
            },
          });
          array1.push({
            $addFields: {
              "fieldExecutive.submittedDateS": {
                $toString: "$fieldExecutive.submittedDate",
              },
            },
          });
        }
        if (searchArray.length > 0) {
          array1.push({
            $match: {
              $and: searchArray,
            },
          });
        }
        if (searchArray.length > 0) {
          array2.push({
            $match: {
              $and: searchArray,
            },
          });
        }
        array1.push({
          $count: "sum",
        });
        array2.push(
          {
            $skip: parseInt(req.body.start),
          },
          {
            $limit: parseInt(req.body.length),
          }
        );
        condition.push(
          {
            $facet: {
              sum1: array3,
              sum2: array1,
              data: array2,
            },
          },
          {
            $unwind: {
              path: "$sum1",
            },
          },
          {
            $unwind: {
              path: "$sum2",
            },
          }
        );
        let data: any = [];
        let caseData = await caseModel.aggregate(condition);
        let count = parseInt(req.body.start) + 1;
        if (caseData[0]) {
          for (let i = 0; i < caseData[0].data.length; i++) {
            data.push({
              count: count,
              fileNo: caseData[0].data[i].fileNo,
              caseUploaded: caseData[0].data[i].caseUploaded
                ? moment(caseData[0].data[i].caseUploaded).format("YYYY-MM-DD")
                : "",
              caseUploadTime: caseData[0].data[i].caseUploaded
                ? moment(caseData[0].data[i].caseUploaded)
                  .utc()
                  .format("HH:mm:ss")
                : "",
              seniorSupervisorName: `${caseData[0].data[i].seniorSupervisor
                ? caseData[0].data[i].seniorSupervisor.name
                  ? caseData[0].data[i].seniorSupervisor.name
                  : ""
                : ""
                }`,
              seniorSupervisorAssignedDate: `${caseData[0].data[i].seniorSupervisor
                ? caseData[0].data[i].seniorSupervisor.assignedDate
                  ? moment(caseData[0].data[i].seniorSupervisor.assignedDate)
                    .utc()
                    .format("YYYY-MM-DD")
                  : ""
                : ""
                }`,
              seniorSupervisorAssignedTime: `${caseData[0].data[i].seniorSupervisor
                ? caseData[0].data[i].seniorSupervisor.assignedDate
                  ? moment(caseData[0].data[i].seniorSupervisor.assignedDate)
                    .utc()
                    .format("HH:mm:ss")
                  : ""
                : ""
                }`,
              supervisorName: `${caseData[0].data[i].supervisor
                ? caseData[0].data[i].supervisor.name
                  ? caseData[0].data[i].supervisor.name
                  : ""
                : ""
                }`,
              supervisorAssignedDate: `${caseData[0].data[i].supervisor
                ? caseData[0].data[i].supervisor.assignedDate
                  ? moment(caseData[0].data[i].supervisor.assignedDate)
                    .utc()
                    .format("YYYY-MM-DD")
                  : ""
                : ""
                }`,
              supervisorAssignedTime: `${caseData[0].data[i].supervisor
                ? caseData[0].data[i].supervisor.assignedDate
                  ? moment(caseData[0].data[i].supervisor.assignedDate)
                    .utc()
                    .format("HH:mm:ss")
                  : ""
                : ""
                }`,
              supervisorSubmitDate: `${caseData[0].data[i].supervisor
                ? caseData[0].data[i].supervisor.submittedDate
                  ? moment(caseData[0].data[i].supervisor.submittedDate)
                    .utc()
                    .format("YYYY-MM-DD")
                  : ""
                : ""
                }`,
              supervisorSubmitTime: `${caseData[0].data[i].supervisor
                ? caseData[0].data[i].supervisor.submittedDate
                  ? moment(caseData[0].data[i].supervisor.submittedDate)
                    .utc()
                    .format("HH:mm:ss")
                  : ""
                : ""
                }`,
              fieldExecutiveName: `${caseData[0].data[i].fieldExecutive
                ? caseData[0].data[i].fieldExecutive.name
                  ? caseData[0].data[i].fieldExecutive.name
                  : ""
                : ""
                }`,
              fieldExecutiveAssignedDate: `${caseData[0].data[i].fieldExecutive
                ? caseData[0].data[i].fieldExecutive.assignedDate
                  ? moment(caseData[0].data[i].fieldExecutive.assignedDate)
                    .utc()
                    .format("YYYY-MM-DD")
                  : ""
                : ""
                }`,
              fieldExecutiveAssignedTime: `${caseData[0].data[i].fieldExecutive
                ? caseData[0].data[i].fieldExecutive.assignedDate
                  ? moment(caseData[0].data[i].fieldExecutive.assignedDate)
                    .utc()
                    .format("HH:mm:ss")
                  : ""
                : ""
                }`,
              fieldExecutiveAcceptedDate: `${caseData[0].data[i].fieldExecutive
                ? caseData[0].data[i].fieldExecutive.acceptedDate
                  ? moment(caseData[0].data[i].fieldExecutive.acceptedDate)
                    .utc()
                    .format("YYYY-MM-DD")
                  : ""
                : ""
                }`,
              fieldExecutiveAcceptedTime: `${caseData[0].data[i].fieldExecutive
                ? caseData[0].data[i].fieldExecutive.acceptedDate
                  ? moment(caseData[0].data[i].fieldExecutive.acceptedDate)
                    .utc()
                    .format("HH:mm:ss")
                  : ""
                : ""
                }`,
              fieldExecutiveSubmitDate: `${caseData[0].data[i].fieldExecutive
                ? caseData[0].data[i].fieldExecutive.submittedDate
                  ? moment(caseData[0].data[i].fieldExecutive.submittedDate)
                    .utc()
                    .format("YYYY-MM-DD")
                  : ""
                : ""
                }`,
              fieldExecutiveSubmitTime: `${caseData[0].data[i].fieldExecutive
                ? caseData[0].data[i].fieldExecutive.submittedDate
                  ? moment(caseData[0].data[i].fieldExecutive.submittedDate)
                    .utc()
                    .format("HH:mm:ss")
                  : ""
                : ""
                }`,
              km: `${caseData[0].data[i].distance ? caseData[0].data[i].distance : ""
                }`,
              status: `${caseData[0].data[i].caseStatus
                ? caseData[0].data[i].caseStatus
                : ""
                }`,
              remarks: `${caseData[0].data[i].caseStatusRemarks
                ? caseData[0].data[i].caseStatusRemarks
                : ""
                }`,
              applicantName: caseData[0].data[i].applicantName,
              addressType: caseData[0].data[i].addressType,
              product: caseData[0].data[i].product,
              area: caseData[0].data[i].area,
              bank: caseData[0].data[i].bank,
              action: `<div> <a class="btn w-35px h-35px mr-1 btn-orange text-uppercase btn-sm" data-toggle="tooltip" title="Update" href= "/case/editReviewAdminCase/${caseData[0].data[i]._id}" data-original-title="Edit">
                                          <i class="fas fa-pencil"></i>
                                      </a>
                                      <a class="btn w-35px h-35px mr-1 btn-danger text-uppercase btn-sm" data-toggle="tooltip" title="Delete" onclick="delete_sweet_alert('', 'Are you sure you want to delete this data?')" data-original-title="Delete">
                                      <i class="far fa-trash-alt"></i> </a>
                                      <a class="btn w-35px h-35px mr-1 btn-pink text-uppercase btn-sm" data-toggle="tooltip" title="Update" href= "/case/caseHistory/${caseData[0].data[i]._id}" data-original-title="Edit">
                                      <i class="fa fa-history" aria-hidden="true"></i>
                                              </a>
                              </div>`,
            });
            count++;
          }
          if (data.length == caseData[0].data.length) {
            let jsonData = JSON.stringify({
              draw: parseInt(req.body.draw),
              recordsTotal: caseData[0].sum1.sum,
              recordsFiltered: caseData[0].sum2.sum,
              data,
            });
            res.send(jsonData);
          }
        } else {
          let jsonData = JSON.stringify({
            draw: parseInt(req.body.draw),
            recordsTotal: 0,
            recordsFiltered: 0,
            data,
          });
          res.send(jsonData);
        }
      }

    } catch (error) {

      next(error);
    }
  };

  public editReviewManagerCase = async (
    req: any,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let x = [];
      let role = req.user.role;
      let email = req.user.email;
      let id = req.params.id;
      res.locals.message = req.flash();
      let caseData = await caseModel.findOne({
        _id: id,
        ManagerId: req.user._id,
      });
      for (let i = 0; i < caseData.documents.length; i++) {
        x[i] = await this.Helper.getSignedUrlAWS(caseData.documents[i]);
      }
      res.render("caseFile/reviewCase/editReviewCase", {
        role,
        email,
        id,
        caseData,
        x,
      });
    } catch (error) {
      next(error);
    }
  };

  public editReviewManagerCaseData = async (
    req: any,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let caseData = await caseModel.findOne({ _id: req.body.id });
      if (req.fileValidationError) {
        req.flash("error", req.fileValidationError);
        if (req.body.myUrl) {
          res.redirect(req.body.myUrl);
        } else {
          res.redirect(`/case/editReviewManagerCase/${caseData._id}`);
        }
      } else {
        let role = req.user.role;
        let email = req.user.email;
        const editReviewManagerCaseDataConfirmation: any = await this.caseService.editReviewManagerCaseData(req, caseData);
        if (editReviewManagerCaseDataConfirmation.code == 201) {
          if (!req.body.duplicate) {
            if (req.files) {
              if (req.files.imageFile1) {
                this.Helper.deleteObjectAWS(caseData.documents[0]);
              }
              if (req.files.imageFile2) {
                this.Helper.deleteObjectAWS(caseData.documents[1]);
              }
              if (req.files.imageFile3) {
                this.Helper.deleteObjectAWS(caseData.documents[2]);
              }
              if (req.files.imageFile4) {
                this.Helper.deleteObjectAWS(caseData.documents[3]);
              }
              if (req.files.imageFile5) {
                this.Helper.deleteObjectAWS(caseData.documents[4]);
              }
              if (req.files.imageFile6) {
                this.Helper.deleteObjectAWS(caseData.documents[5]);
              }
              if (req.files.imageFile7) {
                this.Helper.deleteObjectAWS(caseData.documents[6]);
              }
              if (req.files.imageFile8) {
                this.Helper.deleteObjectAWS(caseData.documents[7]);
              }
            }
          }
          req.flash("success", editReviewManagerCaseDataConfirmation.message);
          if (req.body.duplicate) {
            res.redirect("/case/successfullyCompletedCase");
          } else if (req.body.resend) {
            for (let i = 0; i < caseData.documents.length; i++) {
              this.Helper.deleteObjectAWS(caseData.documents[i]);
            }
            res.redirect("/case/reviewManagerCase");
          } else {
            res.redirect("/case/reviewManagerCase");
          }
        } else {
          req.flash("error", editReviewManagerCaseDataConfirmation.message);
          if (req.files) {
            if (req.files.imageFile1) {
              this.Helper.deleteObjectAWS(req.files.imageFile1[0].key);
            }
            if (req.files.imageFile2) {
              this.Helper.deleteObjectAWS(req.files.imageFile2[0].key);
            }
            if (req.files.imageFile3) {
              this.Helper.deleteObjectAWS(req.files.imageFile3[0].key);
            }
            if (req.files.imageFile4) {
              this.Helper.deleteObjectAWS(req.files.imageFile4[0].key);
            }
            if (req.files.imageFile5) {
              this.Helper.deleteObjectAWS(req.files.imageFile5[0].key);
            }
            if (req.files.imageFile6) {
              this.Helper.deleteObjectAWS(req.files.imageFile6[0].key);
            }
            if (req.files.imageFile7) {
              this.Helper.deleteObjectAWS(req.files.imageFile7[0].key);
            }
            if (req.files.imageFile8) {
              this.Helper.deleteObjectAWS(req.files.imageFile8[0].key);
            }
          }
          if (req.body.myUrl) {
            res.redirect(req.body.myUrl);
          } else {
            res.redirect(`/case/editReviewManagerCase/${caseData._id}`);
          }
        }
      }
    } catch (error) {
      next(error);
    }
  };

  // ****** senior-supervisor review******
  public reviewSeniorSupervisorCase = async (
    req: any,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { role, email, permissions } = req.user
      res.locals.message = req.flash();
      res.render("caseFile/seniorSupervisorReview", { role, email, permissions });
    } catch (error) {
      next(error);
    }
  };

  public reviewSeniorSupervisorCaseDataTable = async (
    req: any,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let condition = [];
      let array1 = [];
      let array2 = [];
      let array3 = [];
      let date2: any;
      let date1: any;
      let searchArray = await customSearchReview(
        req.body.columns,
        req.user.role
      );
      let excelArray = [];
      const today = moment().utcOffset('+05:30');
      const earlierDate = today.subtract(2, 'months');
      if (req.body.excel == "excel") {

        excelArray.push({
          $match: {
            $and: [
              { caseUploaded: { $gte: new Date(earlierDate.utc().format('YYYY-MM-DD')) } },
              {
                seniorSupervisorId: new mongoose.Types.ObjectId(`${req.user._id}`),
              },
              {
                stage: "manager",
              },
              {
                status: "open",
              },
            ]

          },
        });

        

        if (req.body.startDate && !req.body.endDate) {
          date1 = moment(req.body.startDate).format("YYYY/MM/DD");
          date2 = moment(date1).add(1, "days").format("YYYY/MM/DD");
          excelArray.push({
            $match: {
              caseUploaded: {
                $gte: new Date(moment(date1).format("YYYY-MM-DD")),
                $lte: new Date(moment(date2).format("YYYY-MM-DD")),
              },
            },
          });
        }
        if (req.body.startDate && req.body.endDate) {
          date1 = moment(req.body.startDate).format("YYYY/MM/DD");
          date2 = moment(req.body.endDate).add(1, "days").format("YYYY/MM/DD");
          excelArray.push({
            $match: {
              caseUploaded: {
                $gte: new Date(moment(date1).format("YYYY-MM-DD")),
                $lte: new Date(moment(date2).format("YYYY-MM-DD")),
              },
            },
          });
        }
        if (!req.body.startDate && !req.body.endDate) {
          date1 = moment(Date.now()).subtract(10, "days").format("YYYY/MM/DD");
          date2 = moment(Date.now()).add(1, "days").format("YYYY/MM/DD");

          excelArray.push({
            $match: {
              caseUploaded: {
                $gte: new Date(moment(date1).format("YYYY-MM-DD")),
                $lte: new Date(moment(date2).format("YYYY-MM-DD")),
              },
            },
          });
        }
        if (
          req.body.columns[2].search.value.length > 0 ||
          req.body.columns[3].search.value.length > 0
        ) {
          excelArray.push({
            $addFields: {
              caseUploadedDate: {
                $toString: "$caseUploaded",
              },
            },
          });
        };
        if (
          req.body.columns[5].search.value.length > 0 ||
          req.body.columns[6].search.value.length > 0
        ) {
          excelArray.push({
            $addFields: {
              "supervisor.assignedDateS": {
                $toString: "$supervisor.assignedDate",
              },
            },
          });
        }
        if (
          req.body.columns[7].search.value.length > 0 ||
          req.body.columns[8].search.value.length > 0
        ) {
          excelArray.push({
            $addFields: {
              "supervisor.submittedDateS": {
                $toString: "$supervisor.submittedDateS",
              },
            },
          });
        }
        if (
          req.body.columns[10].search.value.length > 0 ||
          req.body.columns[11].search.value.length > 0
        ) {
          excelArray.push({
            $addFields: {
              "fieldExecutive.assignedDateS": {
                $toString: "$fieldExecutive.assignedDate",
              },
            },
          });
        }
        if (
          req.body.columns[12].search.value.length > 0 ||
          req.body.columns[13].search.value.length > 0
        ) {
          excelArray.push({
            $addFields: {
              "fieldExecutive.acceptedDateS": {
                $toString: "$fieldExecutive.acceptedDate",
              },
            },
          });
        }
        if (
          req.body.columns[14].search.value.length > 0 ||
          req.body.columns[15].search.value.length > 0
        ) {
          excelArray.push({
            $addFields: {
              "fieldExecutive.submittedDateS": {
                $toString: "$fieldExecutive.submittedDate",
              },
            },
          });
        }

        if (searchArray.length > 0) {
          excelArray.push({
            $match: {
              $and: searchArray,
            },
          });
        }
        let excelData = await caseModel.aggregate(excelArray);
        if (excelData.length > 3000) {
          res.send(JSON.stringify("limit"));
        } else if (excelData.length <= 3000 && excelData.length > 0) {
          let result = await createReviewCaseExcel(excelData, req.user.role);
          if (result.code == 201) {
            res.send(JSON.stringify("SUCCESS"));
          } else {
            res.send(JSON.stringify("FAILED"));
          }
        } else if (excelData.length <= 0) {
          res.send(JSON.stringify("noData"));
        }
      } else {
        array3.push({
          $match: {
            $and: [
              { caseUploaded: { $gte: new Date(earlierDate.utc().format('YYYY-MM-DD')) } },
              {
                seniorSupervisorId: new mongoose.Types.ObjectId(`${req.user._id}`),
              },
              {
                stage: "manager",
              },
              {
                status: "open",
              },
            ],
          },
        });
        array1.push({
          $match: {
            $and: [
              { caseUploaded: { $gte: new Date(earlierDate.utc().format('YYYY-MM-DD')) } },
              {
                seniorSupervisorId: new mongoose.Types.ObjectId(
                  `${req.user._id}`
                ),
              },
              {
                stage: "manager",
              },
              {
                status: "open",
              },
            ],
          },
        });
        array2.push({
          $match: {
            $and: [
              { caseUploaded: { $gte: new Date(earlierDate.utc().format('YYYY-MM-DD')) } },
              {
                seniorSupervisorId: new mongoose.Types.ObjectId(
                  `${req.user._id}`
                ),
              },
              {
                stage: "manager",
              },
              {
                status: "open",
              },
            ],
          },
        });

        array3.push({
          $count: "sum",
        });

        if (req.body.startDate && !req.body.endDate) {
          date1 = moment(req.body.startDate).format("YYYY/MM/DD");
          date2 = moment(date1).add(1, "days").format("YYYY/MM/DD");
          array2.push({
            $match: {
              caseUploaded: {
                $gte: new Date(date1),
                $lte: new Date(date2),
              },
            },
          });
          array1.push({
            $match: {
              caseUploaded: {
                $gte: new Date(date1),
                $lte: new Date(date2),
              },
            },
          });
        }
        if (req.body.startDate && req.body.endDate) {
          date1 = moment(req.body.startDate).format("YYYY/MM/DD");
          date2 = moment(req.body.endDate).add(1, "days").format("YYYY/MM/DD");
          array2.push({
            $match: {
              caseUploaded: {
                $gte: new Date(date1),
                $lte: new Date(date2),
              },
            },
          });
          array1.push({
            $match: {
              caseUploaded: {
                $gte: new Date(date1),
                $lte: new Date(date2),
              },
            },
          });
        }
        if (
          req.body.columns[2].search.value.length > 0 ||
          req.body.columns[3].search.value.length > 0
        ) {
          array2.push({
            $addFields: {
              caseUploadedDate: {
                $toString: "$caseUploaded",
              },
            },
          });
          array1.push({
            $addFields: {
              caseUploadedDate: {
                $toString: "$caseUploaded",
              },
            },
          });
        }
        if (
          req.body.columns[5].search.value.length > 0 ||
          req.body.columns[6].search.value.length > 0
        ) {
          array2.push({
            $addFields: {
              "supervisor.assignedDateS": {
                $toString: "$supervisor.assignedDate",
              },
            },
          });
          array1.push({
            $addFields: {
              "supervisor.assignedDateS": {
                $toString: "$supervisor.assignedDate",
              },
            },
          });
        }
        if (
          req.body.columns[7].search.value.length > 0 ||
          req.body.columns[8].search.value.length > 0
        ) {
          array2.push({
            $addFields: {
              "supervisor.submittedDateS": {
                $toString: "$supervisor.submittedDateS",
              },
            },
          });
          array1.push({
            $addFields: {
              "supervisor.submittedDateS": {
                $toString: "$supervisor.submittedDateS",
              },
            },
          });
        }
        if (
          req.body.columns[10].search.value.length > 0 ||
          req.body.columns[11].search.value.length > 0
        ) {
          array2.push({
            $addFields: {
              "fieldExecutive.assignedDateS": {
                $toString: "$fieldExecutive.assignedDate",
              },
            },
          });
          array1.push({
            $addFields: {
              "fieldExecutive.assignedDateS": {
                $toString: "$fieldExecutive.assignedDate",
              },
            },
          });
        }
        if (
          req.body.columns[12].search.value.length > 0 ||
          req.body.columns[13].search.value.length > 0
        ) {
          array2.push({
            $addFields: {
              "fieldExecutive.acceptedDateS": {
                $toString: "$fieldExecutive.acceptedDate",
              },
            },
          });
          array1.push({
            $addFields: {
              "fieldExecutive.acceptedDateS": {
                $toString: "$fieldExecutive.acceptedDate",
              },
            },
          });
        }
        if (
          req.body.columns[14].search.value.length > 0 ||
          req.body.columns[15].search.value.length > 0
        ) {
          array2.push({
            $addFields: {
              "fieldExecutive.submittedDateS": {
                $toString: "$fieldExecutive.submittedDate",
              },
            },
          });
          array1.push({
            $addFields: {
              "fieldExecutive.submittedDateS": {
                $toString: "$fieldExecutive.submittedDate",
              },
            },
          });
        }
        if (searchArray.length > 0) {
          array1.push({
            $match: {
              $and: searchArray,
            },
          });
        }
        if (searchArray.length > 0) {
          array2.push({
            $match: {
              $and: searchArray,
            },
          });
        }
        array1.push({
          $count: "sum",
        });
        array2.push(
          {
            $skip: parseInt(req.body.start),
          },
          {
            $limit: parseInt(req.body.length),
          }
        );
        condition.push(
          {
            $facet: {
              sum1: array3,
              sum2: array1,
              data: array2,
            },
          },
          {
            $unwind: {
              path: "$sum1",
            },
          },
          {
            $unwind: {
              path: "$sum2",
            },
          }
        );
        let data: any = [];
        let caseData = await caseModel.aggregate(condition);
        let count = parseInt(req.body.start) + 1;
        if (caseData[0]) {
          for (let i = 0; i < caseData[0].data.length; i++) {
            data.push({
              count: count,
              fileNo: caseData[0].data[i].fileNo,
              caseUploaded: caseData[0].data[i].caseUploaded
                ? moment(caseData[0].data[i].caseUploaded).format("YYYY-MM-DD")
                : "",
              caseUploadTime: caseData[0].data[i].caseUploaded
                ? moment(caseData[0].data[i].caseUploaded)
                  .utc()
                  .format("HH:mm:ss")
                : "",
              supervisorName: `${caseData[0].data[i].supervisor
                ? caseData[0].data[i].supervisor.name
                  ? caseData[0].data[i].supervisor.name
                  : ""
                : ""
                }`,
              supervisorAssignedDate: `${caseData[0].data[i].supervisor
                ? caseData[0].data[i].supervisor.assignedDate
                  ? moment(caseData[0].data[i].supervisor.assignedDate)
                    .utc()
                    .format("YYYY-MM-DD")
                  : ""
                : ""
                }`,
              supervisorAssignedTime: `${caseData[0].data[i].supervisor
                ? caseData[0].data[i].supervisor.assignedDate
                  ? moment(caseData[0].data[i].supervisor.assignedDate)
                    .utc()
                    .format("HH:mm:ss")
                  : ""
                : ""
                }`,
              supervisorSubmitDate: `${caseData[0].data[i].supervisor
                ? caseData[0].data[i].supervisor.submittedDate
                  ? moment(caseData[0].data[i].supervisor.submittedDate)
                    .utc()
                    .format("YYYY-MM-DD")
                  : ""
                : ""
                }`,
              supervisorSubmitTime: `${caseData[0].data[i].supervisor
                ? caseData[0].data[i].supervisor.submittedDate
                  ? moment(caseData[0].data[i].supervisor.submittedDate)
                    .utc()
                    .format("HH:mm:ss")
                  : ""
                : ""
                }`,
              fieldExecutiveName: `${caseData[0].data[i].fieldExecutive
                ? caseData[0].data[i].fieldExecutive.name
                  ? caseData[0].data[i].fieldExecutive.name
                  : ""
                : ""
                }`,
              fieldExecutiveAssignedDate: `${caseData[0].data[i].fieldExecutive
                ? caseData[0].data[i].fieldExecutive.assignedDate
                  ? moment(caseData[0].data[i].fieldExecutive.assignedDate)
                    .utc()
                    .format("YYYY-MM-DD")
                  : ""
                : ""
                }`,
              fieldExecutiveAssignedTime: `${caseData[0].data[i].fieldExecutive
                ? caseData[0].data[i].fieldExecutive.assignedDate
                  ? moment(caseData[0].data[i].fieldExecutive.assignedDate)
                    .utc()
                    .format("HH:mm:ss")
                  : ""
                : ""
                }`,
              fieldExecutiveAcceptedDate: `${caseData[0].data[i].fieldExecutive
                ? caseData[0].data[i].fieldExecutive.acceptedDate
                  ? moment(caseData[0].data[i].fieldExecutive.acceptedDate)
                    .utc()
                    .format("YYYY-MM-DD")
                  : ""
                : ""
                }`,
              fieldExecutiveAcceptedTime: `${caseData[0].data[i].fieldExecutive
                ? caseData[0].data[i].fieldExecutive.acceptedDate
                  ? moment(caseData[0].data[i].fieldExecutive.acceptedDate)
                    .utc()
                    .format("HH:mm:ss")
                  : ""
                : ""
                }`,
              fieldExecutiveSubmitDate: `${caseData[0].data[i].fieldExecutive
                ? caseData[0].data[i].fieldExecutive.submittedDate
                  ? moment(caseData[0].data[i].fieldExecutive.submittedDate)
                    .utc()
                    .format("YYYY-MM-DD")
                  : ""
                : ""
                }`,
              fieldExecutiveSubmitTime: `${caseData[0].data[i].fieldExecutive
                ? caseData[0].data[i].fieldExecutive.submittedDate
                  ? moment(caseData[0].data[i].fieldExecutive.submittedDate)
                    .utc()
                    .format("HH:mm:ss")
                  : ""
                : ""
                }`,
              km: `${caseData[0].data[i].distance ? caseData[0].data[i].distance : ""
                }`,
              status: `${caseData[0].data[i].caseStatus
                ? caseData[0].data[i].caseStatus
                : ""
                }`,
              remarks: `${caseData[0].data[i].caseStatusRemarks
                ? caseData[0].data[i].caseStatusRemarks
                : ""
                }`,
              applicantName: caseData[0].data[i].applicantName,
              addressType: caseData[0].data[i].addressType,
              product: caseData[0].data[i].product,
              area: caseData[0].data[i].area,
              bank: caseData[0].data[i].bank,
              action: `<div> <a class="btn w-35px h-35px mr-1 btn-orange text-uppercase btn-sm" data-toggle="tooltip" title="Update" href= "/case/editReviewAdminCase/${caseData[0].data[i]._id}" data-original-title="Edit">
                                          <i class="fas fa-pencil"></i>
                                      </a>
                                      <a class="btn w-35px h-35px mr-1 btn-danger text-uppercase btn-sm" data-toggle="tooltip" title="Delete" onclick="delete_sweet_alert('', 'Are you sure you want to delete this data?')" data-original-title="Delete">
                                      <i class="far fa-trash-alt"></i> </a>
                                      <a class="btn w-35px h-35px mr-1 btn-pink text-uppercase btn-sm" data-toggle="tooltip" title="Update" href= "/case/caseHistory/${caseData[0].data[i]._id}" data-original-title="Edit">
                                      <i class="fa fa-history" aria-hidden="true"></i>
                                              </a>
                              </div>`,
            });
            count++;
          }
          if (data.length == caseData[0].data.length) {
            let jsonData = JSON.stringify({
              draw: parseInt(req.body.draw),
              recordsTotal: caseData[0].sum1.sum,
              recordsFiltered: caseData[0].sum2.sum,
              data,
            });
            res.send(jsonData);
          }
        } else {
          let jsonData = JSON.stringify({
            draw: parseInt(req.body.draw),
            recordsTotal: 0,
            recordsFiltered: 0,
            data,
          });
          res.send(jsonData);
        }
      }
    } catch (error) {
      next(error);
    }
  };

  public editReviewSeniorSupervisorCase = async (
    req: any,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let x = [];
      let role = req.user.role;
      let email = req.user.email;
      let id = req.params.id;
      res.locals.message = req.flash();
      let caseData = await caseModel.findOne({
        _id: id,
        seniorSupervisorId: req.user._id,
      });
      for (let i = 0; i < caseData.documents.length; i++) {
        x[i] = await this.Helper.getSignedUrlAWS(caseData.documents[i]);
      }
      res.render("caseFile/reviewCase/editReviewCase", {
        role,
        email,
        id,
        caseData,
        x,
      });
    } catch (error) {
      next(error);
    }
  };

  public editReviewSeniorSupervisorCaseData = async (
    req: any,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let caseData = await caseModel.findOne({ _id: req.body.id });
      if (req.fileValidationError) {
        req.flash("error", req.fileValidationError);
        if (req.body.myUrl) {
          res.redirect(req.body.myUrl);
        } else {
          res.redirect(`/case/editReviewSeniorSupervisorCase/${caseData._id}`);
        }
      } else {
        let role = req.user.role;
        let email = req.user.email;
        const editReviewSeniorSupervisorCaseDataConfirmation: any =
          await this.caseService.editReviewSeniorSupervisorCaseData(
            req,
            caseData
          );
        if (editReviewSeniorSupervisorCaseDataConfirmation.code == 201) {
          if (!req.body.duplicate) {
            if (req.files) {
              if (req.files.imageFile1) {
                this.Helper.deleteObjectAWS(caseData.documents[0]);
              }
              if (req.files.imageFile2) {
                this.Helper.deleteObjectAWS(caseData.documents[1]);
              }
              if (req.files.imageFile3) {
                this.Helper.deleteObjectAWS(caseData.documents[2]);
              }
              if (req.files.imageFile4) {
                this.Helper.deleteObjectAWS(caseData.documents[3]);
              }
              if (req.files.imageFile5) {
                this.Helper.deleteObjectAWS(caseData.documents[4]);
              }
              if (req.files.imageFile6) {
                this.Helper.deleteObjectAWS(caseData.documents[5]);
              }
              if (req.files.imageFile7) {
                this.Helper.deleteObjectAWS(caseData.documents[6]);
              }
              if (req.files.imageFile8) {
                this.Helper.deleteObjectAWS(caseData.documents[7]);
              }
            }
          }
          req.flash("success", editReviewSeniorSupervisorCaseDataConfirmation.message);
          if (req.body.duplicate) {
            res.redirect("/case/successfullyCompletedCase");
          } else if (req.body.resend) {
            for (let i = 0; i < caseData.documents.length; i++) {
              this.Helper.deleteObjectAWS(caseData.documents[i]);
            }
            res.redirect("/case/reviewSeniorSupervisorCase");
          } else {
            res.redirect("/case/reviewSeniorSupervisorCase");
          }
        } else {
          req.flash("error", editReviewSeniorSupervisorCaseDataConfirmation.message);
          if (req.files) {
            if (req.files.imageFile1) {
              this.Helper.deleteObjectAWS(req.files.imageFile1[0].key);
            }
            if (req.files.imageFile2) {
              this.Helper.deleteObjectAWS(req.files.imageFile2[0].key);
            }
            if (req.files.imageFile3) {
              this.Helper.deleteObjectAWS(req.files.imageFile3[0].key);
            }
            if (req.files.imageFile4) {
              this.Helper.deleteObjectAWS(req.files.imageFile4[0].key);
            }
            if (req.files.imageFile5) {
              this.Helper.deleteObjectAWS(req.files.imageFile5[0].key);
            }
            if (req.files.imageFile6) {
              this.Helper.deleteObjectAWS(req.files.imageFile6[0].key);
            }
            if (req.files.imageFile7) {
              this.Helper.deleteObjectAWS(req.files.imageFile7[0].key);
            }
            if (req.files.imageFile8) {
              this.Helper.deleteObjectAWS(req.files.imageFile8[0].key);
            }
          }
          if (req.body.myUrl) {
            res.redirect(req.body.myUrl);
          } else {
            res.redirect(`/case/editReviewSeniorSupervisorCase/${caseData._id}`);
          }
        }
      }
    } catch (error) {
      next(error);
    }
  };


  // ****** Admin review***
  public reviewAdminCase = async (
    req: any,
    res: Response,
    next: NextFunction
  ) => {
    try {

      const { role, email, permissions } = req.user
      res.locals.message = req.flash();
      res.render("caseFile/adminReview", { role, email, permissions });
    } catch (error) {
      next(error);
    }
  };

  public reviewAdminCaseDataTable = async (
    req: any,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let condition = [];
      let array1 = [];
      let array2 = [];
      let array3 = [];
      let date2: any;
      let date1: any;
      let searchArray = await customSearchReview(
        req.body.columns,
        req.user.role
      );
      let excelArray = [];
      const today = moment().utcOffset('+05:30')
      const earlierDate = today.subtract(2, 'months')
      if (req.body.excel == "excel") {
        excelArray.push({
          $match: {
            $and: [
              {
                $or: [
                  {
                    stage: "manager",
                  },
                  {
                    stage: "supervisor",
                  },

                ],
              },
              { caseUploaded: { $gte: new Date(earlierDate.utc().format('YYYY-MM-DD')) } }]
          },
        });
        if (req.body.startDate && !req.body.endDate) {
          date1 = moment(req.body.startDate).format("YYYY/MM/DD");
          date2 = moment(date1).add(1, "days").format("YYYY/MM/DD");
          excelArray.push({
            $match: {
              caseUploaded: {
                $gte: new Date(moment(date1).format("YYYY-MM-DD")),
                $lte: new Date(moment(date2).format("YYYY-MM-DD")),
              },
            },
          });
        }
        if (req.body.startDate && req.body.endDate) {
          date1 = moment(req.body.startDate).format("YYYY/MM/DD");
          date2 = moment(req.body.endDate).add(1, "days").format("YYYY/MM/DD");
          excelArray.push({
            $match: {
              caseUploaded: {
                $gte: new Date(moment(date1).format("YYYY-MM-DD")),
                $lte: new Date(moment(date2).format("YYYY-MM-DD")),
              },
            },
          });
        }
        if (!req.body.startDate && !req.body.endDate) {
          date1 = moment(Date.now()).subtract(10, "days").format("YYYY/MM/DD");
          date2 = moment(Date.now()).add(1, "days").format("YYYY/MM/DD");

          excelArray.push({
            $match: {
              caseUploaded: {
                $gte: new Date(moment(date1).format("YYYY-MM-DD")),
                $lte: new Date(moment(date2).format("YYYY-MM-DD")),
              },
            },
          });
        }
        if (
          req.body.columns[2].search.value.length > 0 ||
          req.body.columns[3].search.value.length > 0
        ) {
          excelArray.push({
            $addFields: {
              caseUploadedDate: {
                $toString: "$caseUploaded",
              },
            },
          });
        }
        if (
          req.body.columns[5].search.value.length > 0 ||
          req.body.columns[6].search.value.length > 0
        ) {
          excelArray.push({
            $addFields: {
              "manager.assignedDateS": {
                $toString: "$manager.assignedDate",
              },
            },
          });
        }
        if (
          req.body.columns[8].search.value.length > 0 ||
          req.body.columns[9].search.value.length > 0
        ) {
          excelArray.push({
            $addFields: {
              "seniorSupervisor.assignedDateS": {
                $toString: "$seniorSupervisor.assignedDate",
              },
            },
          });
        }
        if (
          req.body.columns[11].search.value.length > 0 ||
          req.body.columns[12].search.value.length > 0
        ) {
          excelArray.push({
            $addFields: {
              "supervisor.assignedDateS": {
                $toString: "$supervisor.assignedDate",
              },
            },
          });
        }
        if (
          req.body.columns[13].search.value.length > 0 ||
          req.body.columns[14].search.value.length > 0
        ) {
          excelArray.push({
            $addFields: {
              "supervisor.submittedDateS": {
                $toString: "$supervisor.submittedDateS",
              },
            },
          });
        }
        if (
          req.body.columns[16].search.value.length > 0 ||
          req.body.columns[17].search.value.length > 0
        ) {
          excelArray.push({
            $addFields: {
              "fieldExecutive.assignedDateS": {
                $toString: "$fieldExecutive.assignedDate",
              },
            },
          });
        }
        if (
          req.body.columns[18].search.value.length > 0 ||
          req.body.columns[19].search.value.length > 0
        ) {
          excelArray.push({
            $addFields: {
              "fieldExecutive.acceptedDateS": {
                $toString: "$fieldExecutive.acceptedDate",
              },
            },
          });
        }
        if (
          req.body.columns[20].search.value.length > 0 ||
          req.body.columns[21].search.value.length > 0
        ) {
          excelArray.push({
            $addFields: {
              "fieldExecutive.submittedDateS": {
                $toString: "$fieldExecutive.submittedDate",
              },
            },
          });
        }

        if (searchArray.length > 0) {
          excelArray.push({
            $match: {
              $and: searchArray,
            },
          });
        }
        let excelData = await caseModel.aggregate(excelArray);
        if (excelData.length > 3000) {
          res.send(JSON.stringify("limit"));
        } else if (excelData.length <= 3000 && excelData.length > 0) {
          let result = await createReviewCaseExcel(excelData, req.user.role);
          if (result.code == 201) {
            res.send(JSON.stringify("SUCCESS"));
          } else {
            res.send(JSON.stringify("FAILED"));
          }
        } else if (excelData.length <= 0) {
          res.send(JSON.stringify("noData"));
        }
      } else {
        array3.push({
          $match: {
            $and: [
              {
                $or: [
                  {
                    stage: "manager",
                  },
                  {
                    stage: "supervisor",
                  },

                ],
              },
              { caseUploaded: { $gte: new Date(earlierDate.utc().format('YYYY-MM-DD')) } }]
          },
        });
        array1.push({
          $match: {
            $and: [
              {
                $or: [
                  {
                    stage: "manager",
                  },
                  {
                    stage: "supervisor",
                  },

                ],
              },
              { caseUploaded: { $gte: new Date(earlierDate.utc().format('YYYY-MM-DD')) } }]
          },
        });
        array2.push({
          $match: {
            $and: [
              {
                $or: [
                  {
                    stage: "manager",
                  },
                  {
                    stage: "supervisor",
                  },

                ],
              },
              { caseUploaded: { $gte: new Date(earlierDate.utc().format('YYYY-MM-DD')) } }]
          },
        });
        array3.push({
          $count: "sum",
        });

        if (req.body.startDate && !req.body.endDate) {
          date1 = moment(req.body.startDate).format("YYYY/MM/DD");
          date2 = moment(date1).add(1, "days").format("YYYY/MM/DD");
          array2.push({
            $match: {
              caseUploaded: {
                $gte: new Date(moment(date1).format("YYYY-MM-DD")),
                $lte: new Date(moment(date2).format("YYYY-MM-DD")),
              },
            },
          });
          array1.push({
            $match: {
              caseUploaded: {
                $gte: new Date(moment(date1).format("YYYY-MM-DD")),
                $lte: new Date(moment(date2).format("YYYY-MM-DD")),
              },
            },
          });
        }
        if (req.body.startDate && req.body.endDate) {
          date1 = moment(req.body.startDate).format("YYYY/MM/DD");
          date2 = moment(req.body.endDate).add(1, "days").format("YYYY/MM/DD");
          array2.push({
            $match: {
              caseUploaded: {
                $gte: new Date(moment(date1).format("YYYY-MM-DD")),
                $lte: new Date(moment(date2).format("YYYY-MM-DD")),
              },
            },
          });
          array1.push({
            $match: {
              caseUploaded: {
                $gte: new Date(moment(date1).format("YYYY-MM-DD")),
                $lte: new Date(moment(date2).format("YYYY-MM-DD")),
              },
            },
          });
        }
        if (
          req.body.columns[2].search.value.length > 0 ||
          req.body.columns[3].search.value.length > 0
        ) {
          array2.push({
            $addFields: {
              caseUploadedDate: {
                $toString: "$caseUploaded",
              },
            },
          });
          array1.push({
            $addFields: {
              caseUploadedDate: {
                $toString: "$caseUploaded",
              },
            },
          });
        }
        if (
          req.body.columns[5].search.value.length > 0 ||
          req.body.columns[6].search.value.length > 0
        ) {
          array2.push({
            $addFields: {
              "manager.assignedDateS": {
                $toString: "$manager.assignedDate",
              },
            },
          });
          array1.push({
            $addFields: {
              "manager.assignedDateS": {
                $toString: "$manager.assignedDate",
              },
            },
          });
        }
        if (
          req.body.columns[8].search.value.length > 0 ||
          req.body.columns[9].search.value.length > 0
        ) {
          array2.push({
            $addFields: {
              "seniorSupervisor.assignedDateS": {
                $toString: "$seniorSupervisor.assignedDate",
              },
            },
          });
          array1.push({
            $addFields: {
              "seniorSupervisor.assignedDateS": {
                $toString: "$seniorSupervisor.assignedDate",
              },
            },
          });
        }
        if (
          req.body.columns[11].search.value.length > 0 ||
          req.body.columns[12].search.value.length > 0
        ) {
          array2.push({
            $addFields: {
              "supervisor.assignedDateS": {
                $toString: "$supervisor.assignedDate",
              },
            },
          });
          array1.push({
            $addFields: {
              "supervisor.assignedDateS": {
                $toString: "$supervisor.assignedDate",
              },
            },
          });
        }
        if (
          req.body.columns[13].search.value.length > 0 ||
          req.body.columns[14].search.value.length > 0
        ) {
          array2.push({
            $addFields: {
              "supervisor.submittedDateS": {
                $toString: "$supervisor.submittedDateS",
              },
            },
          });
          array1.push({
            $addFields: {
              "supervisor.submittedDateS": {
                $toString: "$supervisor.submittedDateS",
              },
            },
          });
        }
        if (
          req.body.columns[16].search.value.length > 0 ||
          req.body.columns[17].search.value.length > 0
        ) {
          array2.push({
            $addFields: {
              "fieldExecutive.assignedDateS": {
                $toString: "$fieldExecutive.assignedDate",
              },
            },
          });
          array1.push({
            $addFields: {
              "fieldExecutive.assignedDateS": {
                $toString: "$fieldExecutive.assignedDate",
              },
            },
          });
        }
        if (
          req.body.columns[18].search.value.length > 0 ||
          req.body.columns[19].search.value.length > 0
        ) {
          array2.push({
            $addFields: {
              "fieldExecutive.acceptedDateS": {
                $toString: "$fieldExecutive.acceptedDate",
              },
            },
          });
          array1.push({
            $addFields: {
              "fieldExecutive.acceptedDateS": {
                $toString: "$fieldExecutive.acceptedDate",
              },
            },
          });
        }
        if (
          req.body.columns[20].search.value.length > 0 ||
          req.body.columns[21].search.value.length > 0
        ) {
          array2.push({
            $addFields: {
              "fieldExecutive.submittedDateS": {
                $toString: "$fieldExecutive.submittedDate",
              },
            },
          });
          array1.push({
            $addFields: {
              "fieldExecutive.submittedDateS": {
                $toString: "$fieldExecutive.submittedDate",
              },
            },
          });
        }

        if (searchArray.length > 0) {
          array1.push({
            $match: {
              $and: searchArray,
            },
          });
        }
        if (searchArray.length > 0) {
          array2.push({
            $match: {
              $and: searchArray,
            },
          });
        }
        array1.push({
          $count: "sum",
        });
        array2.push(
          {
            $skip: parseInt(req.body.start),
          },
          {
            $limit: parseInt(req.body.length),
          }
        );
        condition.push(
          {
            $facet: {
              sum1: array3,
              sum2: array1,
              data: array2,
            },
          },
          {
            $unwind: {
              path: "$sum1",
            },
          },
          {
            $unwind: {
              path: "$sum2",
            },
          }
        );
        let data: any = [];
        let caseData = await caseModel.aggregate(condition);
        let count = parseInt(req.body.start) + 1;
        if (caseData[0]) {
          for (let i = 0; i < caseData[0].data.length; i++) {
            data.push({
              count: count,
              fileNo: caseData[0].data[i].fileNo,
              caseUploaded: caseData[0].data[i].caseUploaded
                ? moment(caseData[0].data[i].caseUploaded).format("YYYY-MM-DD")
                : "",
              caseUploadTime: caseData[0].data[i].caseUploaded
                ? moment(caseData[0].data[i].caseUploaded)
                  .utc()
                  .format("HH:mm:ss")
                : "",
              managerName: `${caseData[0].data[i].manager
                ? caseData[0].data[i].manager.name
                  ? caseData[0].data[i].manager.name
                  : ""
                : ""
                }`,
              managerAssignedDate: `${caseData[0].data[i].manager
                ? caseData[0].data[i].manager.assignedDate
                  ? moment(caseData[0].data[i].manager.assignedDate)
                    .utc()
                    .format("YYYY-MM-DD")
                  : ""
                : ""
                }`,
              managerAssignedTime: `${caseData[0].data[i].manager
                ? caseData[0].data[i].manager.assignedDate
                  ? moment(caseData[0].data[i].manager.assignedDate)
                    .utc()
                    .format("HH:mm:ss")
                  : ""
                : ""
                }`,
              // ManagerSubmitDate: `${caseData[0].data[i].manager ? caseData[0].data[i].manager[1] ? caseData[0].data[i].manager[1].replace('submit,', '').slice(caseData[0].data[i].manager[1].replace('submit,', '').indexOf(',') + 1, caseData[0].data[i].manager[1].replace('submit,', '').lastIndexOf('@')) : "" : ""}`,
              // ManagerSubmitTime: `${caseData[0].data[i].manager ? caseData[0].data[i].manager[1] ? caseData[0].data[i].manager[1].replace('submit,', '').split('@').pop() : "" : ""}`,
              seniorSupervisorName: `${caseData[0].data[i].seniorSupervisor
                ? caseData[0].data[i].seniorSupervisor.name
                  ? caseData[0].data[i].seniorSupervisor.name
                  : ""
                : ""
                }`,
              seniorSupervisorAssignedDate: `${caseData[0].data[i].seniorSupervisor
                ? caseData[0].data[i].seniorSupervisor.assignedDate
                  ? moment(caseData[0].data[i].seniorSupervisor.assignedDate)
                    .utc()
                    .format("YYYY-MM-DD")
                  : ""
                : ""
                }`,
              seniorSupervisorAssignedTime: `${caseData[0].data[i].seniorSupervisor
                ? caseData[0].data[i].seniorSupervisor.assignedDate
                  ? moment(caseData[0].data[i].seniorSupervisor.assignedDate)
                    .utc()
                    .format("HH:mm:ss")
                  : ""
                : ""
                }`,
              // seniorSupervisorSubmitDate: `${caseData[0].data[i].seniorSupervisor ? caseData[0].data[i].seniorSupervisor[1] ? caseData[0].data[i].seniorSupervisor[1].replace('submit,', '').slice(caseData[0].data[i].seniorSupervisor[1].replace('submit,', '').indexOf(',') + 1, caseData[0].data[i].seniorSupervisor[1].replace('submit,', '').lastIndexOf('@')) : "" : ""}`,
              // seniorSupervisorSubmitTime: `${caseData[0].data[i].seniorSupervisor ? caseData[0].data[i].seniorSupervisor[1] ? caseData[0].data[i].seniorSupervisor[1].replace('submit,', '').split('@').pop() : "" : ""}`,
              supervisorName: `${caseData[0].data[i].supervisor
                ? caseData[0].data[i].supervisor.name
                  ? caseData[0].data[i].supervisor.name
                  : ""
                : ""
                }`,
              supervisorAssignedDate: `${caseData[0].data[i].supervisor
                ? caseData[0].data[i].supervisor.assignedDate
                  ? moment(caseData[0].data[i].supervisor.assignedDate)
                    .utc()
                    .format("YYYY-MM-DD")
                  : ""
                : ""
                }`,
              supervisorAssignedTime: `${caseData[0].data[i].supervisor
                ? caseData[0].data[i].supervisor.assignedDate
                  ? moment(caseData[0].data[i].supervisor.assignedDate)
                    .utc()
                    .format("HH:mm:ss")
                  : ""
                : ""
                }`,
              supervisorSubmitDate: `${caseData[0].data[i].supervisor
                ? caseData[0].data[i].supervisor.submittedDate
                  ? moment(caseData[0].data[i].supervisor.submittedDate)
                    .utc()
                    .format("YYYY-MM-DD")
                  : ""
                : ""
                }`,
              supervisorSubmitTime: `${caseData[0].data[i].supervisor
                ? caseData[0].data[i].supervisor.submittedDate
                  ? moment(caseData[0].data[i].supervisor.submittedDate)
                    .utc()
                    .format("HH:mm:ss")
                  : ""
                : ""
                }`,
              fieldExecutiveName: `${caseData[0].data[i].fieldExecutive
                ? caseData[0].data[i].fieldExecutive.name
                  ? caseData[0].data[i].fieldExecutive.name
                  : ""
                : ""
                }`,
              fieldExecutiveAssignedDate: `${caseData[0].data[i].fieldExecutive
                ? caseData[0].data[i].fieldExecutive.assignedDate
                  ? moment(caseData[0].data[i].fieldExecutive.assignedDate)
                    .utc()
                    .format("YYYY-MM-DD")
                  : ""
                : ""
                }`,
              fieldExecutiveAssignedTime: `${caseData[0].data[i].fieldExecutive
                ? caseData[0].data[i].fieldExecutive.assignedDate
                  ? moment(caseData[0].data[i].fieldExecutive.assignedDate)
                    .utc()
                    .format("HH:mm:ss")
                  : ""
                : ""
                }`,
              fieldExecutiveAcceptedDate: `${caseData[0].data[i].fieldExecutive
                ? caseData[0].data[i].fieldExecutive.acceptedDate
                  ? moment(caseData[0].data[i].fieldExecutive.acceptedDate)
                    .utc()
                    .format("YYYY-MM-DD")
                  : ""
                : ""
                }`,
              fieldExecutiveAcceptedTime: `${caseData[0].data[i].fieldExecutive
                ? caseData[0].data[i].fieldExecutive.acceptedDate
                  ? moment(caseData[0].data[i].fieldExecutive.acceptedDate)
                    .utc()
                    .format("HH:mm:ss")
                  : ""
                : ""
                }`,
              fieldExecutiveSubmitDate: `${caseData[0].data[i].fieldExecutive
                ? caseData[0].data[i].fieldExecutive.submittedDate
                  ? moment(caseData[0].data[i].fieldExecutive.submittedDate)
                    .utc()
                    .format("YYYY-MM-DD")
                  : ""
                : ""
                }`,
              fieldExecutiveSubmitTime: `${caseData[0].data[i].fieldExecutive
                ? caseData[0].data[i].fieldExecutive.submittedDate
                  ? moment(caseData[0].data[i].fieldExecutive.submittedDate)
                    .utc()
                    .format("HH:mm:ss")
                  : ""
                : ""
                }`,
              km: `${caseData[0].data[i].distance ? caseData[0].data[i].distance : ""
                }`,
              status: `${caseData[0].data[i].caseStatus
                ? caseData[0].data[i].caseStatus
                : ""
                }`,
              remarks: `${caseData[0].data[i].caseStatusRemarks
                ? caseData[0].data[i].caseStatusRemarks
                : ""
                }`,
              applicantName: caseData[0].data[i].applicantName,
              addressType: caseData[0].data[i].addressType,
              product: caseData[0].data[i].product,
              area: caseData[0].data[i].area,
              bank: caseData[0].data[i].bank,
              action: `<div> 
                            <a class="btn w-35px h-35px mr-1 btn-orange text-uppercase btn-sm" data-toggle="tooltip" title="Update" href= "/case/editReviewAdminCase/${caseData[0].data[i]._id}" data-original-title="Edit">
                                        <i class="fas fa-pencil"></i>
                            </a>
                                    
                                    <a class="btn w-35px h-35px mr-1 btn-pink text-uppercase btn-sm" data-toggle="tooltip" title="Update" href= "/case/caseHistory/${caseData[0].data[i]._id}" data-original-title="Edit">
                                    <i class="fa fa-history" aria-hidden="true"></i>
                                            </a>
                            </div>`,
            });
            count++;
          }
          if (data.length == caseData[0].data.length) {
            let jsonData = JSON.stringify({
              draw: parseInt(req.body.draw),
              recordsTotal: caseData[0].sum1.sum,
              recordsFiltered: caseData[0].sum2.sum,
              data,
            });
            res.send(jsonData);
          }
        } else {
          let jsonData = JSON.stringify({
            draw: parseInt(req.body.draw),
            recordsTotal: 0,
            recordsFiltered: 0,
            data,
          });
          res.send(jsonData);
        }
      }
    } catch (error) {
      next(error);
    }
  };

  public editReviewAdminCase = async (
    req: any,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let x = [];
      let role = req.user.role;
      let email = req.user.email;
      let id = req.params.id;
      res.locals.message = req.flash();
      let caseData = await caseModel.findOne({
        _id: id,
        adminId: req.user._id,
      });
      for (let i = 0; i < caseData.documents.length; i++) {
        x[i] = await this.Helper.getSignedUrlAWS(caseData.documents[i]);
      }
      res.render("caseFile/reviewCase/editReviewCase", {
        role,
        email,
        id,
        caseData,
        x,
      });
    } catch (error) {
      next(error);
    }
  };

  public editReviewAdminCaseData = async (
    req: any,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let caseData = await caseModel.findOne({ _id: req.body.id });
      if (req.fileValidationError) {
        req.flash("error", req.fileValidationError);
        if (req.body.myUrl) {
          res.redirect(req.body.myUrl);
        } else {
          res.redirect(`/case/editReviewAdminCase/${caseData._id}`);
        }
      } else {

        let role = req.user.role;
        let email = req.user.email;
        const editReviewAdminCaseDataConfirmation: any = await this.caseService.editReviewAdminCaseData(req, caseData);
        if (editReviewAdminCaseDataConfirmation.code == 201) {
          if (!req.body.duplicate) {
            if (req.files) {
              if (req.files.imageFile1) {
                this.Helper.deleteObjectAWS(caseData.documents[0]);
              }
              if (req.files.imageFile2) {
                this.Helper.deleteObjectAWS(caseData.documents[1]);
              }
              if (req.files.imageFile3) {
                this.Helper.deleteObjectAWS(caseData.documents[2]);
              }
              if (req.files.imageFile4) {
                this.Helper.deleteObjectAWS(caseData.documents[3]);
              }
              if (req.files.imageFile5) {
                this.Helper.deleteObjectAWS(caseData.documents[4]);
              }
              if (req.files.imageFile6) {
                this.Helper.deleteObjectAWS(caseData.documents[5]);
              }
              if (req.files.imageFile7) {
                this.Helper.deleteObjectAWS(caseData.documents[6]);
              }
              if (req.files.imageFile8) {
                this.Helper.deleteObjectAWS(caseData.documents[7]);
              }
            }
          }
          req.flash("success", editReviewAdminCaseDataConfirmation.message);
          if (req.body.duplicate) {
            res.redirect("/case/successfullyCompletedCase");
          } else if (req.body.resend) {

            for (let i = 0; i < caseData.documents.length; i++) {
              this.Helper.deleteObjectAWS(caseData.documents[i]);
            }
            res.redirect("/case/reviewAdminCase");
          } else {
            res.redirect("/case/reviewAdminCase");
          }
        } else {
          req.flash("error", editReviewAdminCaseDataConfirmation.message);
          if (req.files) {
            if (req.files.imageFile1) {
              this.Helper.deleteObjectAWS(req.files.imageFile1[0].key);
            }
            if (req.files.imageFile2) {
              this.Helper.deleteObjectAWS(req.files.imageFile2[0].key);
            }
            if (req.files.imageFile3) {
              this.Helper.deleteObjectAWS(req.files.imageFile3[0].key);
            }
            if (req.files.imageFile4) {
              this.Helper.deleteObjectAWS(req.files.imageFile4[0].key);
            }
            if (req.files.imageFile5) {
              this.Helper.deleteObjectAWS(req.files.imageFile5[0].key);
            }
            if (req.files.imageFile6) {
              this.Helper.deleteObjectAWS(req.files.imageFile6[0].key);
            }
            if (req.files.imageFile7) {
              this.Helper.deleteObjectAWS(req.files.imageFile7[0].key);
            }
            if (req.files.imageFile8) {
              this.Helper.deleteObjectAWS(req.files.imageFile8[0].key);
            }
          }
          if (req.body.myUrl) {
            res.redirect(req.body.myUrl);
          } else {
            res.redirect(`/case/editReviewAdminCase/${caseData._id}`);
          }
        }
      }
    } catch (error) {

      next(error);
    }
  };
  // ****************************** Successfully completed cases ****************************************************
  public successfullyCompletedCase = async (
    req: any,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { role, email, permissions } = req.user
      res.locals.message = req.flash();
      let g = url.pathToFileURL("public/excelFile/newFile.xlsx");
      res.render("caseFile/successfullyCompletedCases/successfullyCompletedCases", { role, email, permissions, g });
    } catch (error) {
      next(error);
    }
  };

  public successFullyCompletedCaseDataTable = async (
    req: any,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let condition = [];
      let array1 = [];
      let array2 = [];
      let array3 = [];
      let date2: any;
      let date1: any;
      let searchArray = await customSearch(req.body.columns);
      let excelArray = [];
      const today = moment().utcOffset('+05:30')
      const earlierDate = today.subtract(2, 'months')
      if (req.body.excel == "excel") {

        excelArray.push({
          $match: {
            $and: [{
              stage: "submited",
            },
            { caseUploaded: { $gte: new Date(earlierDate.utc().format('YYYY-MM-DD')) } },
            ]

          },
        });

        if (req.user.role === 'manager') {
          excelArray.push({
            $match: {
              managerId: new mongoose.Types.ObjectId(`${req.user._id}`)
            },
          })
        }

        if (req.user.role === 'supervisor') {
          excelArray.push({
            $match: {
              supervisorId: new mongoose.Types.ObjectId(`${req.user._id}`)
            },
          })
        }

        if (req.user.role === 'senior-supervisor') {
          excelArray.push({
            $match: {
              seniorSupervisorId: new mongoose.Types.ObjectId(`${req.user._id}`)
            },
          })
        }

        if (req.body.startDate && !req.body.endDate) {
          date1 = moment(req.body.startDate).format("YYYY/MM/DD");
          date2 = moment(date1).add(1, "days").format("YYYY/MM/DD");
          excelArray.push({
            $match: {
              caseUploaded: {
                $gte: new Date(moment(date1).format("YYYY-MM-DD")),
                $lte: new Date(moment(date2).format("YYYY-MM-DD")),
              },
            },
          });
        }
        if (req.body.startDate && req.body.endDate) {
          date1 = moment(req.body.startDate).format("YYYY/MM/DD");
          date2 = moment(req.body.endDate).add(1, "days").format("YYYY/MM/DD");
          excelArray.push({
            $match: {
              caseUploaded: {
                $gte: new Date(moment(date1).format("YYYY-MM-DD")),
                $lte: new Date(moment(date2).format("YYYY-MM-DD")),
              },
            },
          });
        }
        if (!req.body.startDate && !req.body.endDate) {
          date1 = moment(Date.now()).subtract(10, "days").format("YYYY/MM/DD");
          date2 = moment(Date.now()).add(1, "days").format("YYYY/MM/DD");

          excelArray.push({
            $match: {
              caseUploaded: {
                $gte: new Date(moment(date1).format("YYYY-MM-DD")),
                $lte: new Date(moment(date2).format("YYYY-MM-DD")),
              },
            },
          });
        }

        if (req.body.columns[10].search.value.length > 0) {
          excelArray.push({
            $addFields: {
              pincode: {
                $toString: "$pinCode",
              },
            },
          });
        }
        if (req.body.columns[13].search.value.length > 0) {
          excelArray.push({
            $addFields: {
              mobileNumber: {
                $toString: {
                  $toLong: "$mobileNo",
                },
              },
            },
          });
        }
        if (
          req.body.columns[17].search.value.length > 0 ||
          req.body.columns[16].search.value.length > 0
        ) {
          excelArray.push({
            $addFields: {
              caseUploadedDate: {
                $toString: "$caseUploaded",
              },
            },
          });
        }
        if (
          req.body.columns[19].search.value.length > 0 ||
          req.body.columns[20].search.value.length > 0
        ) {
          excelArray.push({
            $addFields: {
              "manager.assignedDateS": {
                $toString: "$manager.assignedDate",
              },
            },
          });
        }
        if (
          req.body.columns[21].search.value.length > 0 ||
          req.body.columns[22].search.value.length > 0
        ) {
          excelArray.push({
            $addFields: {
              "manager.submittedDateS": {
                $toString: "$manager.submittedDate",
              },
            },
          });
        }
        if (
          req.body.columns[24].search.value.length > 0 ||
          req.body.columns[25].search.value.length > 0
        ) {
          excelArray.push({
            $addFields: {
              "seniorSupervisor.assignedDateS": {
                $toString: "$seniorSupervisor.assignedDate",
              },
            },
          });
        }
        if (
          req.body.columns[26].search.value.length > 0 ||
          req.body.columns[27].search.value.length > 0
        ) {
          excelArray.push({
            $addFields: {
              "seniorSupervisor.submittedDateS": {
                $toString: "$seniorSupervisor.submittedDate",
              },
            },
          });
        }
        if (
          req.body.columns[29].search.value.length > 0 ||
          req.body.columns[30].search.value.length > 0
        ) {
          excelArray.push({
            $addFields: {
              "supervisor.assignedDateS": {
                $toString: "$supervisor.assignedDate",
              },
            },
          });
        }
        if (
          req.body.columns[31].search.value.length > 0 ||
          req.body.columns[32].search.value.length > 0
        ) {
          excelArray.push({
            $addFields: {
              "supervisor.submittedDateS": {
                $toString: "$supervisor.submittedDateS",
              },
            },
          });
        }
        if (
          req.body.columns[34].search.value.length > 0 ||
          req.body.columns[35].search.value.length > 0
        ) {
          excelArray.push({
            $addFields: {
              "admin.submittedDateS": {
                $toString: "$admin.submittedDate",
              },
            },
          });
        }
        if (
          req.body.columns[37].search.value.length > 0 ||
          req.body.columns[38].search.value.length > 0
        ) {
          excelArray.push({
            $addFields: {
              "fieldExecutive.assignedDateS": {
                $toString: "$fieldExecutive.assignedDate",
              },
            },
          });
        }
        if (
          req.body.columns[39].search.value.length > 0 ||
          req.body.columns[40].search.value.length > 0
        ) {
          excelArray.push({
            $addFields: {
              "fieldExecutive.acceptedDateS": {
                $toString: "$fieldExecutive.acceptedDate",
              },
            },
          });
        }
        if (
          req.body.columns[41].search.value.length > 0 ||
          req.body.columns[42].search.value.length > 0
        ) {
          excelArray.push({
            $addFields: {
              "fieldExecutive.submittedDateS": {
                $toString: "$fieldExecutive.submittedDate",
              },
            },
          });
        }
        if (searchArray.length > 0) {
          excelArray.push({
            $match: {
              $and: searchArray,
            },
          });
        }
        let excelData = await caseModel.aggregate(excelArray);
        if (excelData.length > 2500) {
          res.send(JSON.stringify("limit"));
        } else if (excelData.length <= 2500 && excelData.length > 0) {
          let result = await createSuccessfullCaseExcel(excelData, req.user.role);
          if (result.code == 201) {
            res.send(JSON.stringify("SUCCESS"));
          } else {
            res.send(JSON.stringify("FAILED"));
          }
        } else if (excelData.length <= 0) {
          res.send(JSON.stringify("noData"));
        }
      } else {
        array3.push({
          $match: {
            $and: [{ caseUploaded: { $gte: new Date(earlierDate.utc().format('YYYY-MM-DD')) } },
            { stage: "submited", }]

          },
        });
        array1.push({
          $match: {
            $and: [{ caseUploaded: { $gte: new Date(earlierDate.utc().format('YYYY-MM-DD')) } },
            { stage: "submited", }]

          },
        });
        array2.push({
          $match: {
            $and: [{ caseUploaded: { $gte: new Date(earlierDate.utc().format('YYYY-MM-DD')) } },
            { stage: "submited", }]

          },
        });

        if (req.user.role == "manager") {
          array1.push({
            $match: {
              managerId: new mongoose.Types.ObjectId(`${req.user._id}`),
            },
          });
          array2.push({
            $match: {
              managerId: new mongoose.Types.ObjectId(`${req.user._id}`),
            },
          });
          array3.push({
            $match: {
              managerId: new mongoose.Types.ObjectId(`${req.user._id}`),
            },
          });
        }
        if (req.user.role == "senior-supervisor") {
          array1.push({
            $match: {
              seniorSupervisorId: new mongoose.Types.ObjectId(
                `${req.user._id}`
              ),
            },
          });
          array2.push({
            $match: {
              seniorSupervisorId: new mongoose.Types.ObjectId(
                `${req.user._id}`
              ),
            },
          });
          array3.push({
            $match: {
              seniorSupervisorId: new mongoose.Types.ObjectId(
                `${req.user._id}`
              ),
            },
          });
        }
        if (req.user.role == "supervisor") {
          array1.push({
            $match: {
              supervisorId: new mongoose.Types.ObjectId(`${req.user._id}`),
            },
          });
          array2.push({
            $match: {
              supervisorId: new mongoose.Types.ObjectId(`${req.user._id}`),
            },
          });
          array3.push({
            $match: {
              supervisorId: new mongoose.Types.ObjectId(`${req.user._id}`),
            },
          });
        }
        array3.push({
          $count: "sum",
        });

        if (req.body.startDate && !req.body.endDate) {
          date1 = moment(req.body.startDate).format("YYYY/MM/DD");
          date2 = moment(date1).add(1, "days").format("YYYY/MM/DD");
          array2.push({
            $match: {
              caseUploaded: {
                $gte: new Date(moment(date1).format("YYYY-MM-DD")),
                $lte: new Date(moment(date2).format("YYYY-MM-DD")),
              },
            },
          });
          array1.push({
            $match: {
              caseUploaded: {
                $gte: new Date(moment(date1).format("YYYY-MM-DD")),
                $lte: new Date(moment(date2).format("YYYY-MM-DD")),
              },
            },
          });
        }
        if (req.body.startDate && req.body.endDate) {
          date1 = moment(req.body.startDate).format("YYYY/MM/DD");
          date2 = moment(req.body.endDate).add(1, "days").format("YYYY/MM/DD");
          array2.push({
            $match: {
              caseUploaded: {
                $gte: new Date(moment(date1).format("YYYY-MM-DD")),
                $lte: new Date(moment(date2).format("YYYY-MM-DD")),
              },
            },
          });
          array1.push({
            $match: {
              caseUploaded: {
                $gte: new Date(moment(date1).format("YYYY-MM-DD")),
                $lte: new Date(moment(date2).format("YYYY-MM-DD")),
              },
            },
          });
        }
        if (req.body.columns[10].search.value.length > 0) {
          array2.push({
            $addFields: {
              pincode: {
                $toString: "$pinCode",
              },
            },
          });
          array1.push({
            $addFields: {
              pincode: {
                $toString: "$pinCode",
              },
            },
          });
        }
        if (req.body.columns[13].search.value.length > 0) {
          array2.push({
            $addFields: {
              mobileNumber: {
                $toString: {
                  $toLong: "$mobileNo",
                },
              },
            },
          });
          array1.push({
            $addFields: {
              mobileNumber: {
                $toString: {
                  $toLong: "$mobileNo",
                },
              },
            },
          });
        }
        if (
          req.body.columns[17].search.value.length > 0 ||
          req.body.columns[16].search.value.length > 0
        ) {
          array2.push({
            $addFields: {
              caseUploadedDate: {
                $toString: "$caseUploaded",
              },
            },
          });
          array1.push({
            $addFields: {
              caseUploadedDate: {
                $toString: "$caseUploaded",
              },
            },
          });
        }
        if (
          req.body.columns[19].search.value.length > 0 ||
          req.body.columns[20].search.value.length > 0
        ) {
          array2.push({
            $addFields: {
              "manager.assignedDateS": {
                $toString: "$manager.assignedDate",
              },
            },
          });
          array1.push({
            $addFields: {
              "manager.assignedDateS": {
                $toString: "$manager.assignedDate",
              },
            },
          });
        }
        if (
          req.body.columns[21].search.value.length > 0 ||
          req.body.columns[22].search.value.length > 0
        ) {
          array2.push({
            $addFields: {
              "manager.submittedDateS": {
                $toString: "$manager.submittedDate",
              },
            },
          });
          array1.push({
            $addFields: {
              "manager.submittedDateS": {
                $toString: "$manager.submittedDate",
              },
            },
          });
        }
        if (
          req.body.columns[24].search.value.length > 0 ||
          req.body.columns[25].search.value.length > 0
        ) {
          array2.push({
            $addFields: {
              "seniorSupervisor.assignedDateS": {
                $toString: "$seniorSupervisor.assignedDate",
              },
            },
          });
          array1.push({
            $addFields: {
              "seniorSupervisor.assignedDateS": {
                $toString: "$seniorSupervisor.assignedDate",
              },
            },
          });
        }
        if (
          req.body.columns[26].search.value.length > 0 ||
          req.body.columns[27].search.value.length > 0
        ) {
          array2.push({
            $addFields: {
              "seniorSupervisor.submittedDateS": {
                $toString: "$seniorSupervisor.submittedDate",
              },
            },
          });
          array1.push({
            $addFields: {
              "seniorSupervisor.submittedDateS": {
                $toString: "$seniorSupervisor.submittedDate",
              },
            },
          });
        }
        if (
          req.body.columns[29].search.value.length > 0 ||
          req.body.columns[30].search.value.length > 0
        ) {
          array2.push({
            $addFields: {
              "supervisor.assignedDateS": {
                $toString: "$supervisor.assignedDate",
              },
            },
          });
          array1.push({
            $addFields: {
              "supervisor.assignedDateS": {
                $toString: "$supervisor.assignedDate",
              },
            },
          });
        }
        if (
          req.body.columns[31].search.value.length > 0 ||
          req.body.columns[32].search.value.length > 0
        ) {
          array2.push({
            $addFields: {
              "supervisor.submittedDateS": {
                $toString: "$supervisor.submittedDateS",
              },
            },
          });
          array1.push({
            $addFields: {
              "supervisor.submittedDateS": {
                $toString: "$supervisor.submittedDateS",
              },
            },
          });
        }
        if (
          req.body.columns[34].search.value.length > 0 ||
          req.body.columns[35].search.value.length > 0
        ) {
          array2.push({
            $addFields: {
              "admin.submittedDateS": {
                $toString: "$admin.submittedDate",
              },
            },
          });
          array1.push({
            $addFields: {
              "admin.submittedDateS": {
                $toString: "$admin.submittedDate",
              },
            },
          });
        }
        if (
          req.body.columns[37].search.value.length > 0 ||
          req.body.columns[38].search.value.length > 0
        ) {
          array2.push({
            $addFields: {
              "fieldExecutive.assignedDateS": {
                $toString: "$fieldExecutive.assignedDate",
              },
            },
          });
          array1.push({
            $addFields: {
              "fieldExecutive.assignedDateS": {
                $toString: "$fieldExecutive.assignedDate",
              },
            },
          });
        }
        if (
          req.body.columns[39].search.value.length > 0 ||
          req.body.columns[40].search.value.length > 0
        ) {
          array2.push({
            $addFields: {
              "fieldExecutive.acceptedDateS": {
                $toString: "$fieldExecutive.acceptedDate",
              },
            },
          });
          array1.push({
            $addFields: {
              "fieldExecutive.acceptedDateS": {
                $toString: "$fieldExecutive.acceptedDate",
              },
            },
          });
        }
        if (
          req.body.columns[41].search.value.length > 0 ||
          req.body.columns[42].search.value.length > 0
        ) {
          array2.push({
            $addFields: {
              "fieldExecutive.submittedDateS": {
                $toString: "$fieldExecutive.submittedDate",
              },
            },
          });
          array1.push({
            $addFields: {
              "fieldExecutive.submittedDateS": {
                $toString: "$fieldExecutive.submittedDate",
              },
            },
          });
        }

        if (searchArray.length > 0) {
          array1.push({
            $match: {
              $and: searchArray,
            },
          });
        }
        if (searchArray.length > 0) {
          array2.push({
            $match: {
              $and: searchArray,
            },
          });
        }
        array1.push({
          $count: "sum",
        });
        array2.push(
          {
            $skip: parseInt(req.body.start),
          },
          {
            $limit: parseInt(req.body.length),
          }
        );
        condition.push(
          {
            $facet: {
              sum1: array3,
              sum2: array1,
              data: array2,
            },
          },
          {
            $unwind: {
              path: "$sum1",
            },
          },
          {
            $unwind: {
              path: "$sum2",
            },
          }
        );
        let data: any = [];
        let submittedDate: any = "";
        let assignedDate: any = "";
        let excelDateTime: any = "";
        let hoursDiff: any = "";
        let caseData = await caseModel.aggregate(condition);
        let count = parseInt(req.body.start) + 1;
        if (caseData[0]) {
          for (let i = 0; i < caseData[0].data.length; i++) {
            if (caseData[0].data[i].date && caseData[0].data[i].time) {
              excelDateTime =
                caseData[0].data[i].date + " " + caseData[0].data[i].time;
              excelDateTime = moment(excelDateTime, "DD-MM-YYYY HH:mm")
                .utc()
                .format();

              if (caseData[0].data[i].supervisor?.submittedDate) {
                submittedDate = moment(
                  caseData[0].data[i].supervisor.submittedDate
                )
                  .utc()
                  .format();
              }
              if (caseData[0].data[i].manager?.submittedDate) {
                submittedDate = moment(
                  caseData[0].data[i].manager.submittedDate
                )
                  .utc()
                  .format();
              }
              if (caseData[0].data[i].seniorSupervisor?.submittedDate) {
                submittedDate = moment(
                  caseData[0].data[i].seniorSupervisor.submittedDate
                )
                  .utc()
                  .format();
              }
              if (caseData[0].data[i].admin?.submittedDate) {
                submittedDate = moment(caseData[0].data[i].admin.submittedDate)
                  .utc()
                  .format();
              }

              let assignedTime = moment
                .duration(moment(excelDateTime).utc().format("HH:mm"))
                .asMinutes();
              let submittedTime = moment
                .duration(moment(submittedDate).utc().format("HH:mm"))
                .asMinutes();

              if (
                assignedTime >= 570 &&
                assignedTime <= 1110 &&
                submittedTime >= 570 &&
                submittedTime <= 1110
              ) {
                let checkDateIsSame = moment(
                  moment(excelDateTime).utc().format("YYYY-MM-DD")
                ).isSame(moment(submittedDate).utc().format("YYYY-MM-DD"));
                if (checkDateIsSame) {
                  hoursDiff = moment(moment(submittedDate).utc()).diff(
                    moment(excelDateTime).utc(),
                    "minutes"
                  );
                  hoursDiff = hoursDiff / 60;
                } else {
                  let daysDiff = moment(
                    moment(submittedDate).utc().format("YYYY-MM-DD")
                  ).diff(
                    moment(excelDateTime).utc().format("YYYY-MM-DD"),
                    "days"
                  );
                  hoursDiff = moment(moment(submittedDate).utc()).diff(
                    moment(excelDateTime).utc(),
                    "minute"
                  );
                  hoursDiff = hoursDiff / 60;
                  hoursDiff = hoursDiff - 15 * daysDiff;
                }
              }
              if (
                (assignedTime < 570 || assignedTime > 1110) &&
                submittedTime >= 570 &&
                submittedTime <= 1110
              ) {
                let newDate1: any = "";
                if (assignedTime > 1110 && assignedTime < 1440) {
                  newDate1 = moment(moment(excelDateTime).format("YYYY-MM-DD"))
                    .utc()
                    .add(1, "days");
                  newDate1 = moment(moment(newDate1).utc())
                    .set("hour", 9)
                    .set("minute", 30)
                    .set("second", 0);
                } else {
                  newDate1 = moment(moment(excelDateTime).utc())
                    .set("hour", 9)
                    .set("minute", 30)
                    .set("second", 0);
                }
                let checkDateIsSame = moment(
                  moment(newDate1).utc().format("YYYY-MM-DD")
                ).isSame(moment(submittedDate).utc().format("YYYY-MM-DD"));
                if (checkDateIsSame) {
                  hoursDiff = moment(moment(submittedDate).utc()).diff(
                    moment(newDate1).utc(),
                    "minutes"
                  );
                  hoursDiff = hoursDiff / 60;
                } else {
                  let daysDiff = moment(
                    moment(submittedDate).utc().format("YYYY-MM-DD")
                  ).diff(moment(newDate1).utc().format("YYYY-MM-DD"), "days");
                  hoursDiff = moment(moment(submittedDate).utc()).diff(
                    moment(newDate1).utc(),
                    "minutes"
                  );
                  hoursDiff = hoursDiff / 60;
                  hoursDiff = hoursDiff - 15 * daysDiff;
                }
              }
              if (
                assignedTime >= 570 &&
                assignedTime <= 1110 &&
                (submittedTime < 570 || submittedTime > 1110)
              ) {
                let newDate2: any = "";
                if (submittedTime > 1110 && submittedTime < 1440) {
                  newDate2 = moment(moment(submittedDate).format("YYYY-MM-DD"))
                    .utc()
                    .add(1, "days");
                  newDate2 = moment(newDate2)
                    .set("hour", 9)
                    .set("minute", 30)
                    .set("second", 0);
                } else {
                  newDate2 = moment(moment(submittedDate).utc())
                    .set("hour", 9)
                    .set("minute", 30)
                    .set("second", 0);
                }
                let checkDateIsSame = moment(
                  moment(excelDateTime).utc().format("YYYY-MM-DD")
                ).isSame(moment(newDate2).utc().format("YYYY-MM-DD"));
                if (checkDateIsSame) {
                  hoursDiff = moment(newDate2).diff(
                    moment(excelDateTime).utc(),
                    "minutes"
                  );
                  hoursDiff = hoursDiff / 60;
                } else {
                  let daysDiff = moment(
                    moment(newDate2).utc().format("YYYY-MM-DD")
                  ).diff(
                    moment(excelDateTime).utc().format("YYYY-MM-DD"),
                    "days"
                  );
                  hoursDiff = moment(newDate2).diff(
                    moment(excelDateTime).utc(),
                    "minutes"
                  );
                  hoursDiff = hoursDiff / 60;
                  hoursDiff = hoursDiff - 15 * daysDiff;
                }
              }
              if (
                (assignedTime < 570 || assignedTime > 1110) &&
                (submittedTime < 570 || submittedTime > 1110)
              ) {
                let newDate1: any = "";
                let newDate2: any = "";
                if (assignedTime > 1110 && assignedTime < 1440) {
                  newDate1 = moment(moment(excelDateTime)).utc().add(1, "days");
                  newDate1 = moment(moment(newDate1).utc())
                    .set("hour", 9)
                    .set("minute", 30)
                    .set("second", 0);
                } else {
                  newDate1 = moment(moment(excelDateTime).utc())
                    .set("hour", 9)
                    .set("minute", 30)
                    .set("second", 0);
                }
                if (submittedTime > 1110 && submittedTime < 1440) {
                  newDate2 = moment(moment(submittedDate)).utc().add(1, "days");
                  newDate2 = moment(moment(newDate2).utc())
                    .set("hour", 9)
                    .set("minute", 30)
                    .set("second", 0);
                } else {
                  newDate2 = moment(submittedDate)
                    .set("hour", 9)
                    .set("minute", 30)
                    .set("second", 0);
                }
                let checkDateIsSame = moment(
                  moment(newDate1).utc().format("YYYY-MM-DD")
                ).isSame(moment(newDate2).utc().format("YYYY-MM-DD"));
                if (checkDateIsSame) {
                  hoursDiff = moment(newDate2).diff(
                    moment(newDate1),
                    "minutes"
                  );
                  hoursDiff = hoursDiff / 60;
                } else {
                  let daysDiff = moment(
                    moment(newDate2).utc().format("YYYY-MM-DD")
                  ).diff(moment(newDate1).utc().format("YYYY-MM-DD"), "days");
                  hoursDiff = moment(newDate2).diff(
                    moment(newDate1),
                    "minutes"
                  );
                  hoursDiff = hoursDiff / 60;
                  hoursDiff = hoursDiff - 15 * daysDiff;
                }
              }
            }
            let remarks = "";
            if (caseData[0].data[i].addressType == "BV") {
              remarks = `GIVEN ADDRESS CONFIRM  ${caseData[0].data[i].addressConfirm} `;
              if (caseData[0].data[i].applicantAge) {
                remarks =
                  `${remarks}` +
                  ` APPLICANT AGE  ${caseData[0].data[i].applicantAge} `;
              } else {
                remarks = `${remarks}` + ` APPLICANT AGE  NA `;
              }
              if (caseData[0].data[i].contactedPersonName) {
                remarks =
                  `${remarks}` +
                  ` PERSON MET ${caseData[0].data[i].contactedPersonName
                  }  ${caseData[0].data[i].contactedPersonDesignation.replace(
                    /[^a-zA-Z0-9 ]/g,
                    ""
                  )}  ${caseData[0].data[i].contactedPersonDesignationRemarks
                    ? caseData[0].data[i].contactedPersonDesignationRemarks
                    : ""
                  } `;
              } else {
                remarks = `${remarks}` + ` PERSON MET NA `;
              }
              if (caseData[0].data[i].natureOfBusiness) {
                remarks =
                  `${remarks}` +
                  ` NATURE OF WORK  ${caseData[0].data[
                    i
                  ].natureOfBusiness.replace(/[^a-zA-Z0-9 ]/g, "")} ${caseData[0].data[i].natureOfBusinessRemarks
                  } ${caseData[0].data[i].nOfBR2} `;
              } else {
                remarks = `${remarks}` + ` NATURE OF WORK  NA `;
              }
              if (caseData[0].data[i].workingFrom) {
                remarks =
                  remarks +
                  ` WORKING YEAR  ${caseData[0].data[i].workingFrom.replace(
                    /[^a-zA-Z0-9 ]/g,
                    ""
                  )} `;
              } else {
                remarks = remarks + ` WORKING YEAR  NA `;
              }
              if (caseData[0].data[i].applicantDesignation) {
                remarks =
                  remarks +
                  ` DESIGNATION  ${caseData[0].data[
                    i
                  ].applicantDesignation.replace(/[^a-zA-Z0-9 ]/g, "")} ${caseData[0].data[i].applicantDesignationRemarks
                    ? caseData[0].data[i].applicantDesignationRemarks
                    : ""
                  } `;
              } else {
                remarks = remarks + ` DESIGNATION  NA `;
              }
              if (caseData[0].data[i].applicantOccupation == "SALARIED") {
                remarks =
                  remarks +
                  ` SALARY  ${caseData[0].data[i].totalIncome
                    ? caseData[0].data[i].totalIncome
                    : "NA"
                  } `;
              } else {
                remarks =
                  remarks +
                  ` INCOME  ${caseData[0].data[i].totalIncome
                    ? caseData[0].data[i].totalIncome
                    : "NA"
                  } `;
              }
              remarks =
                remarks +
                ` BUSINESS BOARD SEEN  ${caseData[0].data[i].businessBoard
                  ? caseData[0].data[i].businessBoard.replace(
                    /[^a-zA-Z0-9 ]/g,
                    ""
                  )
                  : "NA"
                }`;
              if (caseData[0].data[i].businessBoardNameConfirmation) {
                remarks =
                  remarks +
                  ` SAME NAME  ${caseData[0].data[i].businessBoardNameConfirmation
                  }${caseData[0].data[i].businessBoardNameRemarks
                    ? caseData[0].data[i].businessBoardNameRemarks
                    : ""
                  } `;
              } else {
                remarks = remarks + `SAME NAME  NA `;
              }
              if (caseData[0].data[i].businessActivitySeen) {
                remarks =
                  remarks +
                  `WORKING ACTIVITY SEEN  ${caseData[0].data[i].businessActivitySeen} ${caseData[0].data[i].businessActivity} `;
              } else {
                remarks = remarks + `WORKING ACTIVITY SEEN  NA `;
              }
              if (caseData[0].data[i].stockSeen) {
                remarks =
                  remarks +
                  `STOCK SEEN ${caseData[0].data[i].stockSeen}  ${caseData[0].data[i].stock} `;
              } else {
                remarks = remarks + `STOCK SEEN  NA `;
              }
              if (caseData[0].data[i].noOfEmployees) {
                remarks =
                  remarks +
                  `NO OF EMPLOYEES  ${caseData[0].data[i].noOfEmployees} `;
              } else {
                remarks = remarks + `NO OF EMPLOYEES  NA `;
              }
              if (caseData[0].data[i].premisesBusiness) {
                remarks =
                  remarks +
                  `OFFICE PREMISES  ${caseData[0].data[
                    i
                  ].premisesBusiness.replace(/[^a-zA-Z0-9 ]/g, "")} ${caseData[0].data[i].premisesBusinessRemarks
                    ? caseData[0].data[i].premisesBusinessRemarks
                    : ""
                  } `;
              } else {
                remarks = remarks + `OFFICE PREMISES   NA `;
              }
              remarks =
                remarks +
                `ADDITIONAL REMARK ${caseData[0].data[i].remarks
                  ? caseData[0].data[i].remarks
                  : "NA"
                } `;
              if (caseData[0].data[i].neighbourCheck1) {
                remarks =
                  remarks +
                  `NEIGHBOUR CHECK NAME1 ${caseData[0].data[i].neighbourCheck1} ${caseData[0].data[i].neighbourCheck1Remarks} NAME2 ${caseData[0].data[i].neighbourCheck2} ${caseData[0].data[i].neighbourCheck2Remarks} `;
              } else {
                remarks = remarks + `NEIGHBOUR CHECK  NA `;
              }
              if (caseData[0].data[i].distance) {
                remarks =
                  remarks +
                  `DISTANCE FROM BRANCH  ${caseData[0].data[i].distance} `;
              } else {
                remarks = remarks + `DISTANCE FROM  BRANCH  NA `;
              }
              if (caseData[0].data[i].caseStatus) {
                remarks =
                  remarks +
                  `STATUS  ${caseData[0].data[i].caseStatus.replace(
                    /[^a-zA-Z0-9 ]/g,
                    ""
                  )} ${caseData[0].data[i].caseStatusRemarks
                    ? caseData[0].data[i].caseStatusRemarks
                    : ""
                  } `;
              } else {
                remarks = remarks + `STATUS  NA `;
              }
              if (caseData[0].data[i].lat) {
                remarks =
                  remarks +
                  `LAT LON ${caseData[0].data[i].lat} ${caseData[0].data[i].long} `;
              } else {
                remarks = remarks + `LAT LON  NA `;
              }
            } else {
              remarks = `GIVEN ADDRESS CONFIRM  ${caseData[0].data[i].addressConfirm} `;
              if (caseData[0].data[i].applicantAge) {
                remarks =
                  `${remarks}` +
                  ` APPLICANT AGE  ${caseData[0].data[i].applicantAge} `;
              } else {
                remarks = `${remarks}` + ` APPLICANT AGE  NA `;
              }
              if (caseData[0].data[i].contactedPersonName) {
                remarks =
                  `${remarks}` +
                  `PERSON MET  ${caseData[0].data[i].contactedPersonName
                  } ${caseData[0].data[i].contactedPersonDesignation.replace(
                    /[^a-zA-Z0-9 ]/g,
                    ""
                  )} ${caseData[0].data[i].contactedPersonDesignationRemarks
                    ? caseData[0].data[i].contactedPersonDesignationRemarks
                    : ""
                  } `;
              } else {
                remarks = `${remarks}` + `PERSON MET  NA `;
              }
              if (caseData[0].data[i].premisesResidence) {
                remarks =
                  remarks +
                  `RESIDENCE OWNERSHIP  PREMISES  ${caseData[0].data[
                    i
                  ].premisesResidence.replace(/[^a-zA-Z0-9 ]/g, "")} ${caseData[0].data[i].premisesResidenceRemarks
                    ? caseData[0].data[i].premisesResidenceRemarks
                    : ""
                  } LOCATION OF RESIDENCE  ${caseData[0].data[
                    i
                  ].locationOfResi.replace(
                    /[^a-zA-Z0-9 ]/g,
                    ""
                  )} TYPE OF RESIDENCE  ${caseData[0].data[
                    i
                  ].typeOfResi.replace(/[^a-zA-Z0-9 ]/g, "")}${caseData[0].data[i].typeOfResiRemarks
                    ? caseData[0].data[i].typeOfResiRemarks
                    : ""
                  } AREA LOCALITY  ${caseData[0].data[i].areaLocality.replace(
                    /[^a-zA-Z0-9 ]/g,
                    ""
                  )} `;
              } else {
                remarks = remarks + `RESIDENCE OWNERSHIP   NA `;
              }
              if (caseData[0].data[i].workingFrom) {
                remarks =
                  remarks +
                  `NO OF YEAR STAY  ${caseData[0].data[i].workingFrom.replace(
                    /[^a-zA-Z0-9 ]/g,
                    ""
                  )} `;
              } else {
                remarks = remarks + `NO OF YEAR STAY  NA `;
              }
              if (caseData[0].data[i].noOfFMember) {
                remarks =
                  remarks + `FAMILY MEMBER ${caseData[0].data[i].noOfFMember} `;
              } else {
                remarks = remarks + `FAMILY MEMBER NA `;
              }
              if (caseData[0].data[i].noEarningMember) {
                remarks =
                  remarks +
                  `EARNING MEMBER  ${caseData[0].data[i].noEarningMember} `;
              } else {
                remarks = remarks + `EARNING MEMBER  NA `;
              }
              if (caseData[0].data[i].maritalStatus) {
                remarks =
                  remarks +
                  `MARITIAL STATUS  ${caseData[0].data[i].maritalStatus.replace(
                    /[^a-zA-Z0-9 ]/g,
                    ""
                  )} `;
              } else {
                remarks = remarks + `MARITIAL STATUS  NA `;
              }
              if (caseData[0].data[i].isSpouseWorking == "YES") {
                remarks =
                  remarks +
                  `SPOUSE WORKING DETAIL WORKING PLACE ${caseData[0].data[
                    i
                  ].spouseWorkingPlace.replace(
                    /[^a-zA-Z0-9 ]/g,
                    ""
                  )}  WORKING SINCE ${caseData[0].data[
                    i
                  ].spouseWorkingSince.replace(/[^a-zA-Z0-9 ]/g, "")}  SALARY ${caseData[0].data[i].spouseSalary
                  }  `;
              } else {
                remarks = remarks + `SPOUSE WORKING DETAIL  NA `;
              }

              if (caseData[0].data[i].vehicle) {
                remarks =
                  remarks +
                  `VEHICLE DETAIL  ${caseData[0].data[i].vehicle}  ${caseData[0].data[i].vehicleRemarks
                    ? caseData[0].data[i].vehicleRemarks
                    : ""
                  }  `;
              } else {
                remarks = remarks + `VEHICLE DETAIL  NA `;
              }
              if (caseData[0].data[i].houseArea) {
                remarks =
                  remarks +
                  `OBSERVATION DETAIL HOUSE AREA  ${caseData[0].data[i].houseArea
                  }  INTERIOR CONDITION  ${caseData[0].data[
                    i
                  ].resiInterior.replace(
                    /[^a-zA-Z0-9 ]/g,
                    ""
                  )}  EXTERIOR CONDITION  ${caseData[0].data[
                    i
                  ].resiExterior.replace(
                    /[^a-zA-Z0-9 ]/g,
                    ""
                  )}  HOUSE CONDITION  ${caseData[0].data[
                    i
                  ].houseCondition.replace(/[^a-zA-Z0-9 ]/g, "")} `;
              } else {
                remarks = remarks + `OBSERVATION DETAIL NA `;
              }
              if (caseData[0].data[i].remarks) {
                remarks =
                  remarks + `AGRI DETAIL ${caseData[0].data[i].remarks} `;
              } else {
                remarks = remarks + `AGRI DETAIL NA `;
              }
              if (caseData[0].data[i].neighbourCheck1) {
                remarks =
                  remarks +
                  `NEIGHBOUR CHECK  NAME1 ${caseData[0].data[i].neighbourCheck1} ${caseData[0].data[i].neighbourCheck1Remarks}  NAME2 ${caseData[0].data[i].neighbourCheck2} ${caseData[0].data[i].neighbourCheck2Remarks} `;
              } else {
                remarks = remarks + `NEIGHBOUR CHECK  NA `;
              }
              if (caseData[0].data[i].distance) {
                remarks =
                  remarks +
                  `DISTANCE FROM BRANCH  ${caseData[0].data[i].distance} `;
              } else {
                remarks + remarks + `DISTANCE FROM BRANCH   NA `;
              }
              if (caseData[0].data[i].caseStatus) {
                remarks =
                  remarks +
                  `STATUS  ${caseData[0].data[i].caseStatus.replace(
                    /[^a-zA-Z0-9 ]/g,
                    ""
                  )} ${caseData[0].data[i].caseStatusRemarks
                    ? caseData[0].data[i].caseStatusRemarks
                    : ""
                  } `;
              } else {
                remarks = remarks + `STATUS  NA `;
              }
              if (caseData[0].data[i].lat) {
                remarks =
                  remarks +
                  `LAT LON  ${caseData[0].data[i].lat} ${caseData[0].data[i].long} `;
              } else {
                remarks = remarks + `LAT LON  NA `;
              }
            }
            data.push({
              count: count,
              date: caseData[0].data[i].date,
              time: caseData[0].data[i].time,
              fileNo: caseData[0].data[i].fileNo,
              barCode: caseData[0].data[i].barCode,
              applicantName: caseData[0].data[i].applicantName,
              applicantType: caseData[0].data[i].applicantType,
              addressType: caseData[0].data[i].addressType,
              officeName: caseData[0].data[i].officeName,
              address: caseData[0].data[i].address,
              pinCode: caseData[0].data[i].pinCode,
              branch: caseData[0].data[i].branch,
              area: caseData[0].data[i].area,
              mobileNo: caseData[0].data[i].mobileNo,
              bank: caseData[0].data[i].bank,
              product: caseData[0].data[i].product,
              caseUploaded: caseData[0].data[i].caseUploaded
                ? moment(caseData[0].data[i].caseUploaded)
                  .utc()
                  .format("YYYY-MM-DD")
                : "",
              caseUploadTime: caseData[0].data[i].caseUploaded
                ? moment(caseData[0].data[i].caseUploaded)
                  .utc()
                  .format("HH:mm:ss")
                : "",
              Manager: `${caseData[0].data[i].manager
                ? caseData[0].data[i].manager.name
                  ? caseData[0].data[i].manager.name
                  : ""
                : ""
                }`,
              ManagerAssignedDate: `${caseData[0].data[i].manager
                ? caseData[0].data[i].manager.assignedDate
                  ? moment(caseData[0].data[i].manager.assignedDate)
                    .utc()
                    .format("YYYY-MM-DD")
                  : ""
                : ""
                }`,
              ManagerAssignedTime: `${caseData[0].data[i].manager
                ? caseData[0].data[i].manager.assignedDate
                  ? moment(caseData[0].data[i].manager.assignedDate)
                    .utc()
                    .format("HH:mm:ss")
                  : ""
                : ""
                }`,
              ManagerSubmitDate: `${caseData[0].data[i].manager
                ? caseData[0].data[i].manager.submittedDate
                  ? moment(caseData[0].data[i].manager.submittedDate)
                    .utc()
                    .format("YYYY-MM-DD")
                  : ""
                : ""
                }`,
              ManagerSubmitTime: `${caseData[0].data[i].manager
                ? caseData[0].data[i].manager.submittedDate
                  ? moment(caseData[0].data[i].manager.submittedDate)
                    .utc()
                    .format("HH:mm:ss")
                  : ""
                : ""
                }`,
              seniorSupervisor: `${caseData[0].data[i].seniorSupervisor
                ? caseData[0].data[i].seniorSupervisor.name
                  ? caseData[0].data[i].seniorSupervisor.name
                  : ""
                : ""
                }`,
              seniorSupervisorAssignedDate: `${caseData[0].data[i].seniorSupervisor
                ? caseData[0].data[i].seniorSupervisor.assignedDate
                  ? moment(caseData[0].data[i].seniorSupervisor.assignedDate)
                    .utc()
                    .format("YYYY-MM-DD")
                  : ""
                : ""
                }`,
              seniorSupervisorAssignedTime: `${caseData[0].data[i].seniorSupervisor
                ? caseData[0].data[i].seniorSupervisor.assignedDate
                  ? moment(caseData[0].data[i].seniorSupervisor.assignedDate)
                    .utc()
                    .format("HH:mm:ss")
                  : ""
                : ""
                }`,
              seniorSupervisorSubmitDate: `${caseData[0].data[i].seniorSupervisor
                ? caseData[0].data[i].seniorSupervisor.submittedDate
                  ? moment(caseData[0].data[i].seniorSupervisor.submittedDate)
                    .utc()
                    .format("YYYY-MM-DD")
                  : ""
                : ""
                }`,
              seniorSupervisorSubmitTime: `${caseData[0].data[i].seniorSupervisor
                ? caseData[0].data[i].seniorSupervisor.submittedDate
                  ? moment(caseData[0].data[i].seniorSupervisor.submittedDate)
                    .utc()
                    .format("HH:mm:ss")
                  : ""
                : ""
                }`,
              supervisor: `${caseData[0].data[i].supervisor
                ? caseData[0].data[i].supervisor.name
                  ? caseData[0].data[i].supervisor.name
                  : ""
                : ""
                }`,
              supervisorAssignedDate: `${caseData[0].data[i].supervisor
                ? caseData[0].data[i].supervisor.assignedDate
                  ? moment(caseData[0].data[i].supervisor.assignedDate)
                    .utc()
                    .format("YYYY-MM-DD")
                  : ""
                : ""
                }`,
              supervisorAssignedTime: `${caseData[0].data[i].supervisor
                ? caseData[0].data[i].supervisor.assignedDate
                  ? moment(caseData[0].data[i].supervisor.assignedDate)
                    .utc()
                    .format("HH:mm:ss")
                  : ""
                : ""
                }`,
              supervisorSubmitDate: `${caseData[0].data[i].supervisor
                ? caseData[0].data[i].supervisor.submittedDate
                  ? moment(caseData[0].data[i].supervisor.submittedDate)
                    .utc()
                    .format("YYYY-MM-DD")
                  : ""
                : ""
                }`,
              supervisorSubmitTime: `${caseData[0].data[i].supervisor
                ? caseData[0].data[i].supervisor.submittedDate
                  ? moment(caseData[0].data[i].supervisor.submittedDate)
                    .utc()
                    .format("HH:mm:ss")
                  : ""
                : ""
                }`,
              admin: `${caseData[0].data[i].admin
                ? caseData[0].data[i].admin.name
                  ? caseData[0].data[i].admin.name
                  : ""
                : ""
                }`,
              adminSubmitDate: `${caseData[0].data[i].admin
                ? caseData[0].data[i].admin.submittedDate
                  ? moment(caseData[0].data[i].admin.submittedDate)
                    .utc()
                    .format("YYYY-MM-DD")
                  : ""
                : ""
                }`,
              adminSubmitTime: `${caseData[0].data[i].admin
                ? caseData[0].data[i].admin.submittedDate
                  ? moment(caseData[0].data[i].admin.submittedDate)
                    .utc()
                    .format("HH:mm:ss")
                  : ""
                : ""
                }`,
              fieldExecutive: `${caseData[0].data[i].fieldExecutive
                ? caseData[0].data[i].fieldExecutive.name
                  ? caseData[0].data[i].fieldExecutive.name
                  : ""
                : ""
                }`,
              fieldExecutiveAssignedDate: `${caseData[0].data[i].fieldExecutive
                ? caseData[0].data[i].fieldExecutive.assignedDate
                  ? moment(caseData[0].data[i].fieldExecutive.assignedDate)
                    .utc()
                    .format("YYYY-MM-DD")
                  : ""
                : ""
                }`,
              fieldExecutiveAssignedTime: `${caseData[0].data[i].fieldExecutive
                ? caseData[0].data[i].fieldExecutive.assignedDate
                  ? moment(caseData[0].data[i].fieldExecutive.assignedDate)
                    .utc()
                    .format("HH:mm:ss")
                  : ""
                : ""
                }`,
              fieldExecutiveAcceptedDate: `${caseData[0].data[i].fieldExecutive
                ? caseData[0].data[i].fieldExecutive.acceptedDate
                  ? moment(caseData[0].data[i].fieldExecutive.acceptedDate)
                    .utc()
                    .format("YYYY-MM-DD")
                  : ""
                : ""
                }`,
              fieldExecutiveAcceptedTime: `${caseData[0].data[i].fieldExecutive
                ? caseData[0].data[i].fieldExecutive.acceptedDate
                  ? moment(caseData[0].data[i].fieldExecutive.acceptedDate)
                    .utc()
                    .format("HH:mm:ss")
                  : ""
                : ""
                }`,
              fieldExecutiveSubmitDate: `${caseData[0].data[i].fieldExecutive
                ? caseData[0].data[i].fieldExecutive.submittedDate
                  ? moment(caseData[0].data[i].fieldExecutive.submittedDate)
                    .utc()
                    .format("YYYY-MM-DD")
                  : ""
                : ""
                }`,
              fieldExecutiveSubmitTime: `${caseData[0].data[i].fieldExecutive
                ? caseData[0].data[i].fieldExecutive.submittedDate
                  ? moment(caseData[0].data[i].fieldExecutive.submittedDate)
                    .utc()
                    .format("HH:mm:ss")
                  : ""
                : ""
                }`,
              km: `${caseData[0].data[i].distance ? caseData[0].data[i].distance : ""
                }`,
              status: `${caseData[0].data[i].caseStatus
                ? caseData[0].data[i].caseStatus
                : ""
                }`,
              negativeOrRefer: `${caseData[0].data[i].caseStatusRemarks
                ? caseData[0].data[i].caseStatusRemarks
                : ""
                }`,
              remarks: `${remarks}`,
              tat: hoursDiff ? hoursDiff.toFixed(2) : "",
              action: `<div> <a class="btn w-35px h-35px mr-1 btn-blue text-uppercase btn-sm" data-toggle="tooltip" title="Update" href= "/case/editReviewAdminCase/${caseData[0].data[i]._id}" data-original-title="Edit">
                                            <i class="fa fa-eye" aria-hidden="true"></i>
                                                    </a>
                                                    <a id=${caseData[0].data[i]._id} class="btn w-35px h-35px mr-1 btn-green text-uppercase btn-sm" data-toggle="tooltip" title="Download"href= "/case/downloadCaseFile/${caseData[0].data[i]._id}"  data-original-title="Delete">
                                                    <i class="fa-solid fa-file-excel" style='font-size:20px'></i>
                                                    </a>
                                                    <a id=${caseData[0].data[i]._id} class="btn w-35px h-35px mr-1 btn-blue text-uppercase btn-sm" data-toggle="tooltip" title="Download"href= "/case/downloadCaseFilePdf/${caseData[0].data[i]._id}"  data-original-title="Delete">
                                                    <i class="fa-solid fa-file-pdf" style='font-size:20px' ></i>
                                                    </a>
                                                    <a id=${caseData[0].data[i]._id} class="btn w-35px h-35px mr-1 btn-yellow text-uppercase btn-sm" data-toggle="tooltip" title="Download"href= "/case/downloadCaseFilePdf2/${caseData[0].data[i]._id}"  data-original-title="Delete">
                                                    <i class="fa-solid fa-file-pdf" style='font-size:20px' ></i>
                                                    </a>
                                                    <a class="btn w-35px h-35px mr-1 btn-pink text-uppercase btn-sm" data-toggle="tooltip" title="Update" href= "/case/caseHistory/${caseData[0].data[i]._id}" data-original-title="Edit">
                                                    <i class="fa fa-history" aria-hidden="true"></i>
                                                            </a>
                                                    </div>`,
            });
            count++;
          }
          if (data.length == caseData[0].data.length) {
            let jsonData = JSON.stringify({
              draw: parseInt(req.body.draw),
              recordsTotal: caseData[0].sum1.sum,
              recordsFiltered: caseData[0].sum2.sum,
              data,
            });
            res.send(jsonData);
          }
        } else {
          let jsonData = JSON.stringify({
            draw: parseInt(req.body.draw),
            recordsTotal: 0,
            recordsFiltered: 0,
            data,
          });
          res.send(jsonData);
        }
      }
    } catch (error) {
      next(error);
    }
  };

  public assignDuplicateCase = async (
    req: any,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (req.user.role == "manager") {
        if (req.query.m) {
          if (req.user._id != req.query.m) {
            req.flash("error", "not your case");
            res.redirect("/case/viewDuplicateCase");
          } else {
            const assignDuplicateCaseConfirmation: any =
              await this.caseService.assignDuplicateCaseConfirmationData(req);
            if (assignDuplicateCaseConfirmation.code == 201) {
              req.flash("success", assignDuplicateCaseConfirmation.message);
              res.redirect("/case/viewCase");
            } else {
              req.flash("error", assignDuplicateCaseConfirmation.message);
              res.redirect("/case/viewDuplicateCase");
            }
          }
        } else {
          req.flash("error", "not your case");
          res.redirect("/case/viewDuplicateCase");
        }
      }
      if (req.user.role == "senior-supervisor") {
        if (req.query.ss) {
          if (req.user._id != req.query.ss) {
            req.flash("error", "not your case");
            res.redirect("/case/viewDuplicateCase");
          } else {
            const assignDuplicateCaseConfirmation: any =
              await this.caseService.assignDuplicateCaseConfirmationData(req);
            if (assignDuplicateCaseConfirmation.code == 201) {
              req.flash("success", assignDuplicateCaseConfirmation.message);
              res.redirect("/case/viewCase");
            } else {
              req.flash("error", assignDuplicateCaseConfirmation.message);
              res.redirect("/case/viewDuplicateCase");
            }
          }
        } else {
          req.flash("error", "not your case");
          res.redirect("/case/viewDuplicateCase");
        }
      }
      if (req.user.role == "supervisor") {
        if (req.query.s) {
          if (req.user._id != req.query.s) {
            req.flash("error", "not your case");
            res.redirect("/case/viewDuplicateCase");
          } else {
            const assignDuplicateCaseConfirmation: any =
              await this.caseService.assignDuplicateCaseConfirmationData(req);
            if (assignDuplicateCaseConfirmation.code == 201) {
              req.flash("success", assignDuplicateCaseConfirmation.message);
              res.redirect("/case/viewCase");
            } else {
              req.flash("error", assignDuplicateCaseConfirmation.message);
              res.redirect("/case/viewDuplicateCase");
            }
          }
        } else {
          req.flash("error", "not your case");
          res.redirect("/case/viewDuplicateCase");
        }
      }
      if (req.user.role == "admin") {
        const assignDuplicateCaseConfirmation: any =
          await this.caseService.assignDuplicateCaseConfirmationData(req);
        if (assignDuplicateCaseConfirmation.code == 201) {
          req.flash("success", assignDuplicateCaseConfirmation.message);
          res.redirect("/case/viewCase");
        } else {
          req.flash("error", assignDuplicateCaseConfirmation.message);
          res.redirect("/case/viewDuplicateCase");
        }
      }
    } catch (error) {
      next(error);
    }
  };

  // ************************ copy case Files*******************************************************************************
  public viewCaseFilesForCopy = async (
    req: any,
    res: Response,
    next: NextFunction
  ) => {
    try {

      let pId = req.query.pId;
      if (req.user.role == "manager") {
        if (req.query.m) {
          if (req.user._id != req.query.m) {
            req.flash("error", "not your case");
            res.redirect(`/case/viewDuplicateCaseDataLogs/?mobileNo=${encodeURIComponent(req.query.mobileNo)}&fileNo=${encodeURIComponent(req.query.fileNo)}&id=${req.query.pId}`);
          } else {
            let role: any = req.user.role;
            let email = req.user.email;
            let mobileNo = req.query.mobileNo;
            let fileNo = req.query.fileNo;
            let id = req.query.id;
            let addressType = req.query.addressType;
            let m = req.user._id;
            let ss = "";
            let s = "";
            if (req.query.ss) {
              ss = req.query.ss;
            }
            if (req.query.s) {
              s = req.query.s;
            }

            res.locals.message = req.flash();
            res.render("caseFile/viewCaseFilesForCopy/viewCaseFileForCopy", {
              role,
              id,
              email,
              addressType,
              mobileNo,
              fileNo,
              m,
              ss,
              s,
              pId,
            });
          }
        } else {
          req.flash("error", "not your case");
          res.redirect(
            `/case/viewDuplicateCaseDataLogs/?mobileNo=${encodeURIComponent(
              req.query.mobileNo
            )}&fileNo=$${encodeURIComponent(req.query.fileNo)}&id=${req.query.pId
            }`
          );
        }
      }
      if (req.user.role == "senior-supervisor") {
        if (req.query.ss) {
          if (req.user._id != req.query.ss) {
            req.flash("error", "not your case");
            res.redirect(
              `/case/viewDuplicateCaseDataLogs/?mobileNo=${encodeURIComponent(
                req.query.mobileNo
              )}&fileNo=$${encodeURIComponent(req.query.fileNo)}&id=${req.query.pId
              }`
            );
          } else {
            let role: any = req.user.role;
            let email = req.user.email;
            let mobileNo = req.query.mobileNo;
            let fileNo = req.query.fileNo;
            let id = req.query.id;
            let addressType = req.query.addressType;
            let ss = req.user._id;
            let m = "";
            let s = "";
            if (req.query.m) {
              m = req.query.m;
            }
            if (req.query.s) {
              s = req.query.s;
            }

            res.locals.message = req.flash();
            res.render("caseFile/viewCaseFilesForCopy/viewCaseFileForCopy", {
              role,
              id,
              email,
              addressType,
              mobileNo,
              fileNo,
              ss,
              m,
              s,
              pId,
            });
          }
        } else {
          req.flash("error", "not your case");
          res.redirect(
            `/case/viewDuplicateCaseDataLogs/?mobileNo=${encodeURIComponent(
              req.query.mobileNo
            )}&fileNo=$${encodeURIComponent(req.query.fileNo)}&id=${req.query.pId
            }`
          );
        }
      }
      if (req.user.role == "supervisor") {

        if (req.query.s) {
          if (req.user._id != req.query.s) {
            req.flash("error", "not your case");
            res.redirect(
              `/case/viewDuplicateCaseDataLogs/?mobileNo=${encodeURIComponent(
                req.query.mobileNo
              )}&fileNo=${encodeURIComponent(req.query.fileNo)}&id=${req.query.pId
              }`
            );
          } else {
            let role: any = req.user.role;
            let email = req.user.email;
            let mobileNo = req.query.mobileNo;
            let fileNo = req.query.fileNo;
            let id = req.query.id;
            let addressType = req.query.addressType;
            let s = req.user._id;
            let m = "";
            let ss = "";
            if (req.query.ss) {
              ss = req.query.ss;
            }
            if (req.query.m) {
              m = req.query.m;
            }

            res.locals.message = req.flash();
            res.render("caseFile/viewCaseFilesForCopy/viewCaseFileForCopy", {
              role,
              id,
              email,
              addressType,
              mobileNo,
              fileNo,
              s,
              m,
              ss,
              pId,
            });
          }
        } else {
          req.flash("error", "not your case");
          res.redirect(
            `/case/viewDuplicateCaseDataLogs/?mobileNo=${encodeURIComponent(
              req.query.mobileNo
            )}&fileNo=$${encodeURIComponent(req.query.fileNo)}&id=${req.query.pId
            }`
          );
        }
      }
      if (req.user.role == "admin") {
        let m = "";
        let ss = "";
        let s = "";
        let role: any = req.user.role;
        let email = req.user.email;
        let mobileNo = req.query.mobileNo;
        let fileNo = req.query.fileNo;
        let id = req.query.id;
        let addressType = req.query.addressType;

        if (req.query.m) {
          m = req.query.m;
        }
        if (req.query.ss) {
          ss = req.query.ss;
        }
        if (req.query.s) {
          s = req.query.s;
        }
        res.locals.message = req.flash();
        res.render("caseFile/viewCaseFilesForCopy/viewCaseFileForCopy", {
          role,
          id,
          email,
          addressType,
          mobileNo,
          fileNo,
          m,
          ss,
          s,
          pId,
        });
      }
    } catch (error) {
      next(error);
    }
  };

  public viewCaseFilesForCopyDatatable = async (
    req: any,
    res: Response,
    next: NextFunction
  ) => {
    try {

      let condition: any = [];
      condition.push(
        {
          $match: {
            $or: [
              {
                fileNo: req.body.fileNo.toString(),
              },
              {
                mobileNo: parseInt(req.body.mobileNo),
              },
              { parentId: new mongoose.Types.ObjectId(`${req.body.pId}`) },

              { _id: new mongoose.Types.ObjectId(`${req.body.pId}`) }
            ],
          },
        },
        {
          $match: {
            _id: {
              $nin: [new mongoose.Types.ObjectId(`${req.body.id}`)],
            },
          },
        }
      );

      caseModel.countDocuments(condition).exec((err, row) => {
        if (err) next(err);
        let data: any = [];
        let count: any = 1;
        caseModel.aggregate(condition).exec((err, rows) => {
          if (err) next(err);
          rows.forEach((doc: any) => {
            try {
              try {
                data.push({
                  count: count,
                  fileNo: doc.fileNo,
                  applicantName: doc.applicantName,
                  mobile: doc.mobileNo,
                  area: doc.area,
                  bank: doc.bank,
                  product: doc.product,
                  addressType: doc.addressType,
                  createdAt: moment(doc.caseUploaded).utc().format("YYYY-MM-DD HH:mm:ss"),
                  action: `<div> 
                                    <a class="btn w-35px h-35px mr-1 btn-blue text-uppercase btn-sm" data-toggle="tooltip" title="view" href= "/case/viewDuplicateFeCase/?id=${doc._id}&c=c" data-original-title="Edit">
                                    <i class="fa fa-eye" aria-hidden="true"></i>
                                    </a>
                                     <a class="btn w-35px h-35px mr-1 btn-green text-uppercase btn-sm" data-toggle="tooltip" title="copy data" href= "/case/copyCase/?id1=${req.body.id}&id2=${doc._id}&fileNo=${encodeURIComponent(req.body.fileNo)}&mobileNo=${encodeURIComponent(req.body.mobileNo)}&addressType=${encodeURIComponent(req.body.addressType)}&m=${req.body.m ? req.body.m : ""}&ss=${req.body.ss ? req.body.ss : ""}&s=${req.body.s ? req.body.s : ""}&pId=${req.body.pId}" data-original-title="Edit">
                                     <i class="fa-solid fa-copy"></i>
                                    </a>
                         </div>`,
                });
                count++;
                if (count > rows.length) {
                  let jsonData = JSON.stringify({ data });
                  res.send(jsonData);
                }
              } catch (error) {
                next(error);
              }
            } catch (error) {
              next(error);
            }
          });
        });
      });
    } catch (error) {
      next(error);
    }
  };

  public copyCase = async (req: any, res: Response, next: NextFunction) => {
    try {
      const copyCaseConfirmation: any =
        await this.caseService.copyCaseConfirmationData(req);
      if (copyCaseConfirmation.code == 201) {
        req.flash("success", copyCaseConfirmation.message);
        res.redirect(`/case/viewCaseFilesForCopy?id=${req.query.id1}&fileNo=$${encodeURIComponent(req.query.fileNo)}&mobileNo=${req.query.mobileNo}&addressType=${req.query.addressType}&m=${req.query.m ? req.query.m : ""}&ss=${req.query.ss ? req.query.ss : ""}&s=${req.query.s ? req.query.s : ""}&pId=${req.query.pId}`
        );
        // res.redirect("/case/viewDuplicateCase")
      } else {
        req.flash("error", copyCaseConfirmation.message);
        res.redirect(`/case/viewCaseFilesForCopy?id=${req.query.id1}&fileNo=${encodeURIComponent(req.query.fileNo)}&mobileNo=${req.query.mobileNo}&addressType=${req.query.addressType}&m=${req.query.m ? req.query.m : ""}&ss=${req.query.ss ? req.query.ss : ""}&s=${req.query.s ? req.query.s : ""}&pId=${req.query.pId}`
        );
        // res.redirect("/case/viewDuplicateCase")
      }
    } catch (error) {
      next(error);
    }
  };

  // ***************** view duplicate case ********************
  public viewDuplicateFeCase = async (
    req: any,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let c = "";
      let x: any = [];
      let role: any = req.user.role;
      let email = req.user.email;
      let id = req.query.id;
      let caseData: any = await caseModel.findOne({ _id: req.query.id });
      let userId = req.user._id;
      if (req.query.c) {
        c = req.query.c;
      }

      res.locals.message = req.flash();
      if (caseData.documents && caseData.documents.length > 0) {
        for (let i = 0; i < caseData.documents.length; i++) {
          x[i] = await this.Helper.getSignedUrlAWS(caseData.documents[i]);
        }
      }
      res.render("caseFile/viewDuplicateCaseData/viewDuplicateCaseData", {
        role,
        id,
        email,
        caseData,
        x,
        c,
        userId,
      });
    } catch (error) {
      next(error);
    }
  };

  // *************** download casefile*********************************
  public downloadCaseFile = async (
    req: any,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const downloadCaseDataConfirmation: any =
        await this.caseService.downloadCaseData(req);
      if (downloadCaseDataConfirmation.code == 201) {
        res.download(
          path.join(__dirname, "../../public/excelFile/", "newFile.xlsx")
        );
      } else {
        req.flash("error", downloadCaseDataConfirmation.message);
        res.redirect("/case/successfullyCompletedCase");
      }
    } catch (error) {
      next(error);
    }
  };

  public downloadCaseFilePdf = async (
    req: any,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let condition = [];
      condition.push(
        {
          $match: {
            _id: new mongoose.Types.ObjectId(`${req.params.id}`),
          },
        },
        {
          $lookup: {
            from: "managers",
            localField: "managerId",
            foreignField: "_id",
            as: "managerId",
          },
        },
        {
          $lookup: {
            from: "fieldexecutives",
            localField: "fieldExecutiveId",
            foreignField: "_id",
            as: "fieldExecutiveId",
          },
        }
      );
      let x = [];
      let role: any = req.user.role;
      let email = req.user.email;
      let id = req.params.id;
      let caseData: any = await caseModel.aggregate(condition);
      if (caseData[0].documents) {
        for (let i = 0; i < caseData[0].documents.length; i++) {
          x[i] = await this.Helper.getSignedUrlAWS(caseData[0].documents[i]);
        }
      }

      res.locals.message = req.flash();
      if (!caseData[0].timeVisit && caseData[0].dateVisit) {
        caseData[0].timeVisit = moment(caseData[0].dateVisit)
          .utc()
          .format("HH:mm:ss");
      }
      if (caseData[0].dateVisit) {
        caseData[0].dateVisit = moment(caseData[0].dateVisit)
          .utc()
          .format("YYYY-MM-DD");
      }

      if (caseData[0].addressType == "BV") {
        res.render("caseFile/pdfFileData/bv_file", {
          role,
          id,
          email,
          caseData,
          x,
        });
      } else {
        res.render("caseFile/pdfFileData/rv_file", {
          role,
          id,
          email,
          caseData,
          x,
        });
      }
    } catch (error) {
      next(error);
    }
  };

  public downloadCaseFilePdf2 = async (
    req: any,
    res: Response,
    next: NextFunction
  ) => {
    try {

      let condition = [];
      condition.push(
        {
          $match: {
            _id: new mongoose.Types.ObjectId(`${req.params.id}`),
          },
        },
        {
          $lookup: {
            from: "managers",
            localField: "managerId",
            foreignField: "_id",
            as: "managerId",
          },
        },
        {
          $lookup: {
            from: "fieldexecutives",
            localField: "fieldExecutiveId",
            foreignField: "_id",
            as: "fieldExecutiveId",
          },
        }
      );
      let x = [];
      let role: any = req.user.role;
      let email = req.user.email;
      let id = req.params.id;
      let caseData: any = await caseModel.aggregate(condition);
      if (caseData[0].documents) {
        for (let i = 0; i < caseData[0].documents.length; i++) {
          x[i] = await this.Helper.getSignedUrlAWS(caseData[0].documents[i]);
        }
      }
      caseData[0].photoCount = caseData[0].documents ? caseData[0].documents.length : 0;
      res.locals.message = req.flash();
      if (!caseData[0].timeVisit && caseData[0].dateVisit) {
        caseData[0].timeVisit = moment(caseData[0].dateVisit)
          .utc()
          .format("HH:mm:ss");
      }
      if (caseData[0].dateVisit) {
        caseData[0].dateVisit = moment(caseData[0].dateVisit)
          .utc()
          .format("YYYY-MM-DD");
      }

      if (caseData[0].addressType == "BV") {
        res.render("caseFile/pdfFileData/bv_new_file", {
          role,
          id,
          email,
          caseData,
          x,
        });
      } else {
        res.render("caseFile/pdfFileData/rv_new_file", {
          role,
          id,
          email,
          caseData,
          x,
        });
      }
    } catch (error) {
      next(error);
    }
  };

  public imageWaterMark = async (
    req: any,
    res: Response,
    next: NextFunction
  ) => {
    try {
      async function textOverlay(readurl, writeurl) { }
      await textOverlay(
        "https://cmb-management.s3-ap-south-1.amazonaws.com/development/applicant/fileVerification-uploads/632943e0e4d83b5324537970/20220929/3499757_1664441166931.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIATF3V6HB74VMB556W%2F20220929%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20220929T104330Z&X-Amz-Expires=3600&X-Amz-Signature=f42c32c7d886c601eb46b98e04765be57fda9adea118a812bca6dcffed6600e7&X-Amz-SignedHeaders=host",
        "public/excelFile/image3.jpeg"
      );
      res.send("successsssss");
    } catch (error) {
      next(error);
    }
  };

  public caseHistory = async (req: any, res: Response, next: NextFunction) => {
    try {
      let role: any = req.user.role;
      let email = req.user.email;
      let id = req.params.id;
      let caseData: any = await caseModel.findOne({ _id: req.params.id });
      res.locals.message = req.flash();
      res.render("caseFile/caseHistory/caseHistory", {
        role,
        id,
        email,
        caseData,
      });
    } catch (error) {
      next(error);
    }
  };

  public pendingCases = async (req: any, res: Response, next: NextFunction) => {
    try {
      const { role, email, permissions } = req.user
      res.locals.message = req.flash();
      res.render("caseFile/pendingCase/pendingCase", { role, email, permissions });
    } catch (error) {
      next(error);
    }
  };

  public pendingCasesDatatable = async (
    req: any,
    res: Response,
    next: NextFunction
  ) => {
    try {

      let condition = [];
      let array1 = [];
      let array2 = [];
      let array3 = [];
      let date2: any;
      let date1: any;
      let role = req.user.role;
      let searchArray = await customSearchPending(req.body.columns, role);
      let excelArray = [];
      const today = moment().utcOffset('+05:30')
      const earlierDate = today.subtract(2, 'months')
      if (req.body.excel == "excel") {
        excelArray.push({
          $match: {
            $and: [
              {
                duplicate: false,
              },
              {
                fieldExecutiveId: {
                  $exists: true,
                },
              },
              { caseUploaded: { $gte: new Date(earlierDate.utc().format('YYYY-MM-DD')) } },
              {
                stage: {
                  $nin: ["submited", "supervisor", "manager"],
                },
              },
            ],
          },
        });

        if (req.user.role == "manager") {
          excelArray.push({
            $match: {
              managerId: new mongoose.Types.ObjectId(`${req.user._id}`),
            },
          });
        }
        if (req.user.role == "senior-supervisor") {
          excelArray.push({
            $match: {
              seniorSupervisorId: new mongoose.Types.ObjectId(
                `${req.user._id}`
              ),
            },
          });
        }
        if (req.user.role == "supervisor") {
          excelArray.push({
            $match: {
              supervisorId: new mongoose.Types.ObjectId(`${req.user._id}`),
            },
          });
        }

        if (req.body.startDate && !req.body.endDate) {
          date1 = moment(req.body.startDate).format("YYYY/MM/DD");
          date2 = moment(date1).add(1, "days").format("YYYY/MM/DD");
          excelArray.push({
            $match: {
              caseUploaded: {
                $gte: new Date(moment(date1).format("YYYY-MM-DD")),
                $lte: new Date(moment(date2).format("YYYY-MM-DD")),
              },
            },
          });
        }
        if (req.body.startDate && req.body.endDate) {
          date1 = moment(req.body.startDate).format("YYYY/MM/DD");
          date2 = moment(req.body.endDate).add(1, "days").format("YYYY/MM/DD");
          excelArray.push({
            $match: {
              caseUploaded: {
                $gte: new Date(moment(date1).format("YYYY-MM-DD")),
                $lte: new Date(moment(date2).format("YYYY-MM-DD")),
              },
            },
          });
        }
        if (!req.body.startDate && !req.body.endDate) {
          date1 = moment(Date.now()).subtract(10, "days").format("YYYY/MM/DD");
          date2 = moment(Date.now()).add(1, "days").format("YYYY/MM/DD");

          excelArray.push({
            $match: {
              caseUploaded: {
                $gte: new Date(moment(date1).format("YYYY-MM-DD")),
                $lte: new Date(moment(date2).format("YYYY-MM-DD")),
              },
            },
          });
        }

        if (
          req.body.columns[2].search.value.length > 0 ||
          req.body.columns[3].search.value.length > 0
        ) {
          excelArray.push({
            $addFields: {
              caseUploadedDate: {
                $toString: "$caseUploaded",
              },
            },
          });
        }
        if (
          req.body.columns[5].search.value.length > 0 ||
          req.body.columns[6].search.value.length > 0
        ) {
          excelArray.push({
            $addFields: {
              "manager.assignedDateS": {
                $toString: "$manager.assignedDate",
              },
            },
          });
        }
        if (
          req.body.columns[8].search.value.length > 0 ||
          req.body.columns[9].search.value.length > 0
        ) {
          excelArray.push({
            $addFields: {
              "seniorSupervisor.assignedDateS": {
                $toString: "$seniorSupervisor.assignedDate",
              },
            },
          });
        }
        if (
          req.body.columns[11].search.value.length > 0 ||
          req.body.columns[12].search.value.length > 0
        ) {
          excelArray.push({
            $addFields: {
              "supervisor.assignedDateS": {
                $toString: "$supervisor.assignedDate",
              },
            },
          });
        }
        if (
          req.body.columns[14].search.value.length > 0 ||
          req.body.columns[15].search.value.length > 0
        ) {
          excelArray.push({
            $addFields: {
              "fieldExecutive.assignedDateS": {
                $toString: "$fieldExecutive.assignedDate",
              },
            },
          });
        }
        if (
          req.body.columns[16].search.value.length > 0 ||
          req.body.columns[17].search.value.length > 0
        ) {
          excelArray.push({
            $addFields: {
              "fieldExecutive.acceptedDateS": {
                $toString: "$fieldExecutive.acceptedDate",
              },
            },
          });
        }
        if (req.body.columns[24].search.value.length > 0) {

          excelArray.push({
            $addFields: {
              mobileNumber: {
                $toString: {
                  $toLong: "$mobileNo",
                },
              },
            },
          });
        }

        if (searchArray.length > 0) {
          excelArray.push({
            $match: {
              $and: searchArray,
            },
          });
        }
        let excelData = await caseModel.aggregate(excelArray);

        if (excelData.length > 3000) {
          res.send(JSON.stringify("limit"));
        } else if (excelData.length <= 3000 && excelData.length > 0) {
          let result = await createPendingCaseExcel(excelData, role);
          if (result.code == 201) {
            res.send(JSON.stringify("SUCCESS"));
          } else {
            res.send(JSON.stringify("FAILED"));
          }
        } else if (excelData.length <= 0) {
          res.send(JSON.stringify("noData"));
        }
      } else {
        array3.push({
          $match: {
            $and: [
              { caseUploaded: { $gte: new Date(earlierDate.utc().format('YYYY-MM-DD')) } },
              {
                duplicate: false,
              },

              {
                fieldExecutiveId: {
                  $exists: true,
                },
              },
              {
                stage: {
                  $nin: ["submited", "supervisor", "manager"],
                },
              },
            ],
          },
        });
        array1.push({
          $match: {
            $and: [
              { caseUploaded: { $gte: new Date(earlierDate.utc().format('YYYY-MM-DD')) } },
              {
                duplicate: false,
              },
              {
                fieldExecutiveId: {
                  $exists: true,
                },
              },
              {
                stage: {
                  $nin: ["submited", "supervisor", "manager"],
                },
              },
            ],
          },
        });
        array2.push({
          $match: {
            $and: [
              { caseUploaded: { $gte: new Date(earlierDate.utc().format('YYYY-MM-DD')) } },
              {
                duplicate: false,
              },
              {
                fieldExecutiveId: {
                  $exists: true,
                },
              },
              {
                stage: {
                  $nin: ["submited", "supervisor", "manager"],
                },
              },
            ],
          },
        });
        if (req.user.role == "manager") {
          array1.push({
            $match: {
              managerId: new mongoose.Types.ObjectId(`${req.user._id}`),
            },
          });
          array2.push({
            $match: {
              managerId: new mongoose.Types.ObjectId(`${req.user._id}`),
            },
          });
          array3.push({
            $match: {
              managerId: new mongoose.Types.ObjectId(`${req.user._id}`),
            },
          });
        }
        if (req.user.role == "senior-supervisor") {
          array1.push({
            $match: {
              seniorSupervisorId: new mongoose.Types.ObjectId(
                `${req.user._id}`
              ),
            },
          });
          array2.push({
            $match: {
              seniorSupervisorId: new mongoose.Types.ObjectId(
                `${req.user._id}`
              ),
            },
          });
          array3.push({
            $match: {
              seniorSupervisorId: new mongoose.Types.ObjectId(
                `${req.user._id}`
              ),
            },
          });
        }
        if (req.user.role == "supervisor") {
          array1.push({
            $match: {
              supervisorId: new mongoose.Types.ObjectId(`${req.user._id}`),
            },
          });
          array2.push({
            $match: {
              supervisorId: new mongoose.Types.ObjectId(`${req.user._id}`),
            },
          });
          array3.push({
            $match: {
              supervisorId: new mongoose.Types.ObjectId(`${req.user._id}`),
            },
          });
        }
        array3.push({
          $count: "sum",
        });
        if (req.body.startDate && !req.body.endDate) {
          date1 = moment(req.body.startDate).format("YYYY/MM/DD");
          date2 = moment(date1).add(1, "days").format("YYYY/MM/DD");
          array2.push({
            $match: {
              caseUploaded: {
                $gte: new Date(moment(date1).format("YYYY-MM-DD")),
                $lte: new Date(moment(date2).format("YYYY-MM-DD")),
              },
            },
          });
          array1.push({
            $match: {
              caseUploaded: {
                $gte: new Date(moment(date1).format("YYYY-MM-DD")),
                $lte: new Date(moment(date2).format("YYYY-MM-DD")),
              },
            },
          });
        }
        if (req.body.startDate && req.body.endDate) {
          date1 = moment(req.body.startDate).format("YYYY/MM/DD");
          date2 = moment(req.body.endDate).add(1, "days").format("YYYY/MM/DD");
          array2.push({
            $match: {
              caseUploaded: {
                $gte: new Date(moment(date1).format("YYYY-MM-DD")),
                $lte: new Date(moment(date2).format("YYYY-MM-DD")),
              },
            },
          });
          array1.push({
            $match: {
              caseUploaded: {
                $gte: new Date(moment(date1).format("YYYY-MM-DD")),
                $lte: new Date(moment(date2).format("YYYY-MM-DD")),
              },
            },
          });
        }
        if (
          req.body.columns[2].search.value.length > 0 ||
          req.body.columns[3].search.value.length > 0
        ) {
          array2.push({
            $addFields: {
              caseUploadedDate: {
                $toString: "$caseUploaded",
              },
            },
          });
          array1.push({
            $addFields: {
              caseUploadedDate: {
                $toString: "$caseUploaded",
              },
            },
          });
        }
        if (
          req.body.columns[5].search.value.length > 0 ||
          req.body.columns[6].search.value.length > 0
        ) {
          array2.push({
            $addFields: {
              "manager.assignedDateS": {
                $toString: "$manager.assignedDate",
              },
            },
          });
          array1.push({
            $addFields: {
              "manager.assignedDateS": {
                $toString: "$manager.assignedDate",
              },
            },
          });
        }
        if (
          req.body.columns[8].search.value.length > 0 ||
          req.body.columns[9].search.value.length > 0
        ) {
          array2.push({
            $addFields: {
              "seniorSupervisor.assignedDateS": {
                $toString: "$seniorSupervisor.assignedDate",
              },
            },
          });
          array1.push({
            $addFields: {
              "seniorSupervisor.assignedDateS": {
                $toString: "$seniorSupervisor.assignedDate",
              },
            },
          });
        }
        if (
          req.body.columns[11].search.value.length > 0 ||
          req.body.columns[12].search.value.length > 0
        ) {
          array2.push({
            $addFields: {
              "supervisor.assignedDateS": {
                $toString: "$supervisor.assignedDate",
              },
            },
          });
          array1.push({
            $addFields: {
              "supervisor.assignedDateS": {
                $toString: "$supervisor.assignedDate",
              },
            },
          });
        }
        if (
          req.body.columns[14].search.value.length > 0 ||
          req.body.columns[15].search.value.length > 0
        ) {
          array2.push({
            $addFields: {
              "fieldExecutive.assignedDateS": {
                $toString: "$fieldExecutive.assignedDate",
              },
            },
          });
          array1.push({
            $addFields: {
              "fieldExecutive.assignedDateS": {
                $toString: "$fieldExecutive.assignedDate",
              },
            },
          });
        }
        if (
          req.body.columns[16].search.value.length > 0 ||
          req.body.columns[17].search.value.length > 0
        ) {
          array2.push({
            $addFields: {
              "fieldExecutive.acceptedDateS": {
                $toString: "$fieldExecutive.acceptedDate",
              },
            },
          });
          array1.push({
            $addFields: {
              "fieldExecutive.acceptedDateS": {
                $toString: "$fieldExecutive.acceptedDate",
              },
            },
          });
        }
        if (req.body.columns[24].search.value.length > 0) {

          array2.push({
            $addFields: {
              mobileNumber: {
                $toString: {
                  $toLong: "$mobileNo",
                },
              },
            },
          });
          array1.push({
            $addFields: {
              mobileNumber: {
                $toString: {
                  $toLong: "$mobileNo",
                },
              },
            },
          });
        }

        if (searchArray.length > 0) {
          array1.push({
            $match: {
              $and: searchArray,
            },
          });
        }
        if (searchArray.length > 0) {
          array2.push({
            $match: {
              $and: searchArray,
            },
          });
        }
        array1.push({
          $count: "sum",
        });
        array2.push(
          {
            $skip: parseInt(req.body.start),
          },
          {
            $limit: parseInt(req.body.length),
          }
        );
        condition.push(
          {
            $facet: {
              sum1: array3,
              sum2: array1,
              data: array2,
            },
          },
          {
            $unwind: {
              path: "$sum1",
            },
          },
          {
            $unwind: {
              path: "$sum2",
            },
          }
        );
        let data: any = [];
        let caseData = await caseModel.aggregate(condition);
        let count = parseInt(req.body.start) + 1;
        if (caseData[0]) {
          for (let i = 0; i < caseData[0].data.length; i++) {
            data.push({
              count: count,
              fileNo: caseData[0].data[i].fileNo,
              caseUploaded: caseData[0].data[i].caseUploaded
                ? moment(caseData[0].data[i].caseUploaded)
                  .utc()
                  .format("YYYY-MM-DD")
                : "",
              caseUploadTime: caseData[0].data[i].caseUploaded
                ? moment(caseData[0].data[i].caseUploaded)
                  .utc()
                  .utc()
                  .format("HH:mm:ss")
                : "",
              managerName: `${caseData[0].data[i].manager
                ? caseData[0].data[i].manager.name
                  ? caseData[0].data[i].manager.name
                  : ""
                : ""
                }`,
              managerAssignedDate: `${caseData[0].data[i].manager
                ? caseData[0].data[i].manager.assignedDate
                  ? moment(caseData[0].data[i].manager.assignedDate)
                    .utc()
                    .format("YYYY-MM-DD")
                  : ""
                : ""
                }`,
              managerAssignedTime: `${caseData[0].data[i].manager
                ? caseData[0].data[i].manager.assignedDate
                  ? moment(caseData[0].data[i].manager.assignedDate)
                    .utc()
                    .format("HH:mm:ss")
                  : ""
                : ""
                }`,
              seniorSupervisorName: `${caseData[0].data[i].seniorSupervisor
                ? caseData[0].data[i].seniorSupervisor.name
                  ? caseData[0].data[i].seniorSupervisor.name
                  : ""
                : ""
                }`,
              seniorSupervisorAssignedDate: `${caseData[0].data[i].seniorSupervisor
                ? caseData[0].data[i].seniorSupervisor.assignedDate
                  ? moment(caseData[0].data[i].seniorSupervisor.assignedDate)
                    .utc()
                    .format("YYYY-MM-DD")
                  : ""
                : ""
                }`,
              seniorSupervisorAssignedTime: `${caseData[0].data[i].seniorSupervisor
                ? caseData[0].data[i].seniorSupervisor.assignedDate
                  ? moment(caseData[0].data[i].seniorSupervisor.assignedDate)
                    .utc()
                    .format("HH:mm:ss")
                  : ""
                : ""
                }`,
              supervisorName: `${caseData[0].data[i].supervisor
                ? caseData[0].data[i].supervisor.name
                  ? caseData[0].data[i].supervisor.name
                  : ""
                : ""
                }`,
              supervisorAssignedDate: `${caseData[0].data[i].supervisor
                ? caseData[0].data[i].supervisor.assignedDate
                  ? moment(caseData[0].data[i].supervisor.assignedDate)
                    .utc()
                    .format("YYYY-MM-DD")
                  : ""
                : ""
                }`,
              supervisorAssignedTime: `${caseData[0].data[i].supervisor
                ? caseData[0].data[i].supervisor.assignedDate
                  ? moment(caseData[0].data[i].supervisor.assignedDate)
                    .utc()
                    .format("HH:mm:ss")
                  : ""
                : ""
                }`,
              fieldExecutiveName: `${caseData[0].data[i].fieldExecutive
                ? caseData[0].data[i].fieldExecutive.name
                  ? caseData[0].data[i].fieldExecutive.name
                  : ""
                : ""
                }`,
              fieldExecutiveAssignedDate: `${caseData[0].data[i].fieldExecutive
                ? caseData[0].data[i].fieldExecutive.assignedDate
                  ? moment(caseData[0].data[i].fieldExecutive.assignedDate)
                    .utc()
                    .format("YYYY-MM-DD")
                  : ""
                : ""
                }`,
              fieldExecutiveAssignedTime: `${caseData[0].data[i].fieldExecutive
                ? caseData[0].data[i].fieldExecutive.assignedDate
                  ? moment(caseData[0].data[i].fieldExecutive.assignedDate)
                    .utc()
                    .format("HH:mm:ss")
                  : ""
                : ""
                }`,
              fieldExecutiveAcceptedDate: `${caseData[0].data[i].fieldExecutive
                ? caseData[0].data[i].fieldExecutive.acceptedDate
                  ? moment(caseData[0].data[i].fieldExecutive.acceptedDate)
                    .utc()
                    .format("YYYY-MM-DD")
                  : ""
                : ""
                }`,
              fieldExecutiveAcceptedTime: `${caseData[0].data[i].fieldExecutive
                ? caseData[0].data[i].fieldExecutive.acceptedDate
                  ? moment(caseData[0].data[i].fieldExecutive.acceptedDate)
                    .utc()
                    .format("HH:mm:ss")
                  : ""
                : ""
                }`,
              applicantName: caseData[0].data[i].applicantName,
              addressType: caseData[0].data[i].addressType,
              address: caseData[0].data[i].address,
              mobileNo: caseData[0].data[i].mobileNo,
              product: caseData[0].data[i].product,
              area: caseData[0].data[i].area,
              bank: caseData[0].data[i].bank,
              manager:
                req.user.role == "admin"
                  ? caseData[0].data[i].managerId
                    ? caseData[0].data[i].manager
                      ? caseData[0].data[i].manager.name
                        ? caseData[0].data[i].manager.name
                        : ""
                      : ""
                    : `<div> <a class="btn w-35px h-35px mr-1 btn-orange text-uppercase btn-sm" data-toggle="tooltip" title="Update" href= "/case/assignManager/?id=${caseData[0].data[i]._id
                    }&area=${encodeURIComponent(
                      caseData[0].data[i].area
                    )}&product=${encodeURIComponent(
                      caseData[0].data[i].product
                    )}&bank=${encodeURIComponent(
                      caseData[0].data[i].bank
                    )}&mobileNo=${encodeURIComponent(
                      caseData[0].data[i].mobileNo
                    )}&fileNo=${encodeURIComponent(
                      caseData[0].data[i].fileNo
                    )}&p=p" data-original-title="Edit">
                                <i class="fa fa-users" aria-hidden="true"></i>
                            </a></div>`
                  : caseData[0].data[i].managerId
                    ? caseData[0].data[i].manager
                      ? caseData[0].data[i].manager.name
                        ? caseData[0].data[i].manager.name
                        : ""
                      : ""
                    : `<div> <a class="btn w-35px h-35px mr-1 btn-orange text-uppercase btn-sm" data-toggle="tooltip" title="Update" href= "" data-original-title="Edit">
                            <i class="fa fa-users" aria-hidden="true"></i>
                        </a></div>`,
              fieldExecutive:
                req.user.role == "admin"
                  ? caseData[0].data[i].fieldExecutiveId
                    ? caseData[0].data[i].fieldExecutive
                      ? caseData[0].data[i].fieldExecutive.name
                        ? caseData[0].data[i].fieldExecutive.name
                        : ""
                      : ""
                    : `<div> <a class="btn w-35px h-35px mr-1 btn-orange text-uppercase btn-sm" data-toggle="tooltip" title="Update" href="" data-original-title="Edit">
                                <i class="fa fa-users" aria-hidden="true"></i>
                            </a></div>`
                  : caseData[0].data[i].fieldExecutiveId
                    ? caseData[0].data[i].fieldExecutive
                      ? caseData[0].data[i].fieldExecutive.name
                        ? caseData[0].data[i].fieldExecutive.name
                        : ""
                      : ""
                    : `<div> <a class="btn w-35px h-35px mr-1 btn-orange text-uppercase btn-sm" data-toggle="tooltip" title="Update" href= "/case/assignFieldExecutive/?id=${caseData[0].data[i]._id
                    }&area=${encodeURIComponent(
                      caseData[0].data[i].area
                    )}&product=${encodeURIComponent(
                      caseData[0].data[i].product
                    )}&bank=${encodeURIComponent(
                      caseData[0].data[i].bank
                    )}&mobileNo=${encodeURIComponent(
                      caseData[0].data[i].mobileNo
                    )}&fileNo=${encodeURIComponent(
                      caseData[0].data[i].fileNo
                    )}" data-original-title="Edit">
                            <i class="fa fa-users" aria-hidden="true"></i>
                        </a></div>`,
              supervisor:
                req.user.role == "admin"
                  ? caseData[0].data[i].supervisorId
                    ? caseData[0].data[i].supervisor
                      ? caseData[0].data[i].supervisor.name
                        ? caseData[0].data[i].supervisor.name
                        : ""
                      : ""
                    : `<div> <a class="btn w-35px h-35px mr-1 btn-orange text-uppercase btn-sm" data-toggle="tooltip" title="Update" href= "/case/assignSupervisor/?id=${caseData[0].data[i]._id
                    }&area=${encodeURIComponent(
                      caseData[0].data[i].area
                    )}&product=${encodeURIComponent(
                      caseData[0].data[i].product
                    )}&bank=${encodeURIComponent(
                      caseData[0].data[i].bank
                    )}&mobileNo=${encodeURIComponent(
                      caseData[0].data[i].mobileNo
                    )}&fileNo=${encodeURIComponent(
                      caseData[0].data[i].fileNo
                    )}&p=p" data-original-title="Edit">
                                <i class="fa fa-users" aria-hidden="true"></i>
                            </a></div>`
                  : caseData[0].data[i].supervisorId
                    ? caseData[0].data[i].supervisor
                      ? caseData[0].data[i].supervisor.name
                        ? caseData[0].data[i].supervisor.name
                        : ""
                      : ""
                    : `<div> <a class="btn w-35px h-35px mr-1 btn-orange text-uppercase btn-sm" data-toggle="tooltip" title="Update" href="" data-original-title="Edit">
                        <i class="fa fa-users" aria-hidden="true"></i>
                    </a></div>`,
              seniorSupervisor:
                req.user.role == "admin"
                  ? caseData[0].data[i].seniorSupervisorId
                    ? caseData[0].data[i].seniorSupervisor
                      ? caseData[0].data[i].seniorSupervisor.name
                        ? caseData[0].data[i].seniorSupervisor.name
                        : ""
                      : ""
                    : `<div> <a class="btn w-35px h-35px mr-1 btn-orange text-uppercase btn-sm" data-toggle="tooltip" title="Update" href= "/case/assignSeniorSupervisor/?id=${caseData[0].data[i]._id
                    }&area=${encodeURIComponent(
                      caseData[0].data[i].area
                    )}&product=${encodeURIComponent(
                      caseData[0].data[i].product
                    )}&bank=${encodeURIComponent(
                      caseData[0].data[i].bank
                    )}&mobileNo=${encodeURIComponent(
                      caseData[0].data[i].mobileNo
                    )}&fileNo=${encodeURIComponent(
                      caseData[0].data[i].fileNo
                    )}&p=p" data-original-title="Edit">
                                <i class="fa fa-users" aria-hidden="true"></i>
                            </a></div>`
                  : caseData[0].data[i].seniorSupervisorId
                    ? caseData[0].data[i].seniorSupervisor
                      ? caseData[0].data[i].seniorSupervisor.name
                        ? caseData[0].data[i].seniorSupervisor.name
                        : ""
                      : ""
                    : `<div> <a class="btn w-35px h-35px mr-1 btn-orange text-uppercase btn-sm" data-toggle="tooltip" title="Update" href= "" data-original-title="Edit">
                        <i class="fa fa-users" aria-hidden="true"></i>
                    </a></div>`,

              action: `<div> 
                                <a class="btn w-35px h-35px mr-1 btn-orange text-uppercase btn-sm" data-toggle="tooltip" title="Update" href= "/case/assignFieldExecutive/?id=${caseData[0].data[i]._id
                }&area=${encodeURIComponent(
                  caseData[0].data[i].area
                )}&product=${encodeURIComponent(
                  caseData[0].data[i].product
                )}&bank=${encodeURIComponent(
                  caseData[0].data[i].bank
                )}&mobileNo=${encodeURIComponent(
                  caseData[0].data[i].mobileNo
                )}&fileNo=${encodeURIComponent(
                  caseData[0].data[i].fileNo
                )}&p=p" data-original-title="Edit">
                            <i class="fa fa-users" aria-hidden="true"></i>
                        </a>
                                <a class="btn w-35px h-35px mr-1 btn-pink text-uppercase btn-sm" data-toggle="tooltip" title="Update" href= "/case/caseHistory/${caseData[0].data[i]._id
                }" data-original-title="Edit">
                                <i class="fa fa-history" aria-hidden="true"></i>
                                        </a>
                                </div>`,
              caseId: caseData[0].data[i]._id,
            });
            count++;
          }
          if (data.length == caseData[0].data.length) {
            let jsonData = JSON.stringify({
              draw: parseInt(req.body.draw),
              recordsTotal: caseData[0].sum1.sum,
              recordsFiltered: caseData[0].sum2.sum,
              data,
            });
            res.send(jsonData);
          }
        } else {
          let jsonData = JSON.stringify({
            draw: parseInt(req.body.draw),
            recordsTotal: 0,
            recordsFiltered: 0,
            data,
          });
          res.send(jsonData);
        }
      }
    } catch (error) {
      next(error);
    }
  };

  public assignAllFe = async (req: any, res: Response, next: NextFunction) => {
    try {
      const assignAllFeDataConfirmation: any =
        await this.caseService.assignAllFeDataConfirmation(req);
      if (assignAllFeDataConfirmation.code == 201) {
        req.flash("success", assignAllFeDataConfirmation.message);
      } else {
        req.flash("error", assignAllFeDataConfirmation.message);
      }
      res.redirect("/case/viewCase");
    } catch (error) {
      next(error);
    }
  };

  public directToSupervisor = async (
    req: any,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const directToSupervisorDataConfirmation: any =
        await this.caseService.directToSupervisorDataConfirmation(req);
      if (directToSupervisorDataConfirmation.code == 201) {
        req.flash("success", directToSupervisorDataConfirmation.message);
      } else {
        req.flash("error", directToSupervisorDataConfirmation.message);
      }
      res.redirect("/case/viewCase");
    } catch (error) {
      next(error);
    }
  };
  // ************ Efficiency **************************
  public teamEfficiency = async (
    req: any,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let role: any = req.user.role;
      let email = req.user.email;
      res.locals.message = req.flash();
      res.render("caseFile/efficiency/teamEfficiency", { role, email });
    } catch (error) {
      next(error);
    }
  };

  public chooseRole = async (req: any, res: Response, next: NextFunction) => {
    try {
      let role: any = req.user.role;
      let email = req.user.email;
      res.locals.message = req.flash();
      if (req.body.member == "manager") {
        let manager = await managerModel.find({
          isDeleted: { $exists: false },
        });
        res.send(manager);
      }
      if (req.body.member == "seniorSupervisor") {
        let seniorSupervisor = await seniorSupervisorModel.find({
          isDeleted: { $exists: false },
        });
        res.send(seniorSupervisor);
      }
      if (req.body.member == "supervisor") {
        let supervisor = await supervisorModel.find({
          isDeleted: { $exists: false },
        });
        res.send(supervisor);
      }
      if (req.body.member == "fieldExecutive") {
        const start = Date.now();

        let condition = [];
        condition.push(
          {
            $match: {
              isDeleted: {
                $exists: false,
              },
            },
          },
          {
            $project: {
              _id: 1,
              fullName: 1,
            },
          }
        );
        // let fieldExecutive = await fieldExecutiveModel.find({ isDeleted: { $exists: false } })
        let fieldExecutive = await fieldExecutiveModel.aggregate(condition);
        const end = Date.now();

        res.send(fieldExecutive);
      }
    } catch (error) {
      next(error);
    }
  };

  public selectionEFTAT = async (
    req: any,
    res: Response,
    next: NextFunction
  ) => {
    try {

      let role: any = req.user.role;
      let email = req.user.email;
      let id = req.body.id;
      let member = req.body.member;
      let max = req.body.max;
      let min = req.body.min;
      let name = req.body.name;
      res.locals.message = req.flash();
      res.render("caseFile/efficiency/selectEffTat.ejs", {
        role,
        email,
        member,
        id,
        max,
        min,
        name,
      });
    } catch (error) {
      next(error);
    }
  };

  public calEfficiency = async (
    req: any,
    res: Response,
    next: NextFunction
  ) => {
    try {

      let role: any = req.user.role;
      let email = req.user.email;
      res.locals.message = req.flash();
      let date1 = moment(req.body.min).format("YYYY/MM/DD");
      let date2 = moment(moment(req.body.max).format("YYYY/MM/DD"))
        .add(1, "days")
        .format("YYYY/MM/DD");
      if (req.body.teamEfficiency) {
        if (req.body.member == "manager") {
          if (req.body.excel) {
            let condition = [];
            if (req.body.section == "feSubmitted") {
              condition.push({
                $match: {
                  $and: [
                    {
                      caseUploaded: {
                        $gte: new Date(moment(date1).format("YYYY-MM-DD")),
                        $lte: new Date(moment(date2).format("YYYY-MM-DD")),
                      },
                    },
                    {
                      stage: "submited",
                    },
                    {
                      managerId: new mongoose.Types.ObjectId(req.body.id),
                    },
                    {
                      fieldExecutiveId: {
                        $exists: true,
                      },
                    },
                  ],
                },
              });
            }
            if (req.body.section == "directToSupervisor") {
              condition.push({
                $match: {
                  $and: [
                    {
                      caseUploaded: {
                        $gte: new Date(moment(date1).format("YYYY-MM-DD")),
                        $lte: new Date(moment(date2).format("YYYY-MM-DD")),
                      },
                    },
                    {
                      stage: "submited",
                    },
                    {
                      managerId: new mongoose.Types.ObjectId(req.body.id),
                    },
                    {
                      fieldExecutiveId: {
                        $exists: false,
                      },
                    },
                    {
                      directSupervisor: {
                        $exists: true,
                      },
                    },
                  ],
                },
              });
            }
            if (req.body.section == "notFeNorDirect") {
              condition.push({
                $match: {
                  $and: [
                    {
                      caseUploaded: {
                        $gte: new Date(moment(date1).format("YYYY-MM-DD")),
                        $lte: new Date(moment(date2).format("YYYY-MM-DD")),
                      },
                    },
                    {
                      stage: "submited",
                    },
                    {
                      managerId: new mongoose.Types.ObjectId(req.body.id),
                    },
                    {
                      fieldExecutiveId: {
                        $exists: false,
                      },
                    },
                    {
                      directSupervisor: {
                        $exists: false,
                      },
                    },
                  ],
                },
              });
            }
            if (req.body.section == "feAssigned") {
              condition.push({
                $match: {
                  $and: [
                    {
                      caseUploaded: {
                        $gte: new Date(moment(date1).format("YYYY-MM-DD")),
                        $lte: new Date(moment(date2).format("YYYY-MM-DD")),
                      },
                    },
                    {
                      stage: {
                        $nin: ["submited"],
                      },
                    },
                    {
                      managerId: new mongoose.Types.ObjectId(req.body.id),
                    },
                    {
                      fieldExecutiveId: {
                        $exists: true,
                      },
                    },
                  ],
                },
              });
            }
            if (req.body.section == "feNotAssigned") {
              condition.push({
                $match: {
                  $and: [
                    {
                      caseUploaded: {
                        $gte: new Date(moment(date1).format("YYYY-MM-DD")),
                        $lte: new Date(moment(date2).format("YYYY-MM-DD")),
                      },
                    },
                    {
                      stage: {
                        $nin: ["submited"],
                      },
                    },
                    {
                      managerId: new mongoose.Types.ObjectId(req.body.id),
                    },
                    {
                      fieldExecutiveId: {
                        $exists: false,
                      },
                    },
                    {
                      directSupervisor: {
                        $exists: false,
                      },
                    },
                  ],
                },
              });
            }
            if (req.body.section == "directToSupervisorP") {
              condition.push({
                $match: {
                  $and: [
                    {
                      caseUploaded: {
                        $gte: new Date(moment(date1).format("YYYY-MM-DD")),
                        $lte: new Date(moment(date2).format("YYYY-MM-DD")),
                      },
                    },
                    {
                      stage: {
                        $nin: ["submited"],
                      },
                    },
                    {
                      managerId: new mongoose.Types.ObjectId(req.body.id),
                    },
                    {
                      fieldExecutiveId: {
                        $exists: false,
                      },
                    },
                    {
                      directSupervisor: true,
                    },
                  ],
                },
              });
            }
            let managerData = await caseModel.aggregate(condition);

            if (managerData.length > 0) {
              let excel = await teamEfficiencyExcel(managerData);
              if (excel.code == 201) {
                res.send("SUCCESS");
              } else {
                res.send("FAILED");
              }
            } else {
              res.send("NO DATA FOUND");
            }
          } else {
            let condition = [];
            condition.push({
              $facet: {
                feSubmitted: [
                  {
                    $match: {
                      $and: [
                        {
                          caseUploaded: {
                            $gte: new Date(moment(date1).format("YYYY-MM-DD")),
                            $lte: new Date(moment(date2).format("YYYY-MM-DD")),
                          },
                        },
                        {
                          stage: "submited",
                        },
                        {
                          managerId: new mongoose.Types.ObjectId(req.body.id),
                        },
                        {
                          fieldExecutiveId: {
                            $exists: true,
                          },
                        },
                      ],
                    },
                  },
                  {
                    $count: "count",
                  },
                ],
                directToSupervisor: [
                  {
                    $match: {
                      $and: [
                        {
                          caseUploaded: {
                            $gte: new Date(moment(date1).format("YYYY-MM-DD")),
                            $lte: new Date(moment(date2).format("YYYY-MM-DD")),
                          },
                        },
                        {
                          stage: "submited",
                        },
                        {
                          managerId: new mongoose.Types.ObjectId(req.body.id),
                        },
                        {
                          fieldExecutiveId: {
                            $exists: false,
                          },
                        },
                        {
                          directSupervisor: {
                            $exists: true,
                          },
                        },
                      ],
                    },
                  },
                  {
                    $count: "count",
                  },
                ],
                notFeNorDirect: [
                  {
                    $match: {
                      $and: [
                        {
                          caseUploaded: {
                            $gte: new Date(moment(date1).format("YYYY-MM-DD")),
                            $lte: new Date(moment(date2).format("YYYY-MM-DD")),
                          },
                        },
                        {
                          stage: "submited",
                        },
                        {
                          managerId: new mongoose.Types.ObjectId(req.body.id),
                        },
                        {
                          fieldExecutiveId: {
                            $exists: false,
                          },
                        },
                        {
                          directSupervisor: {
                            $exists: false,
                          },
                        },
                      ],
                    },
                  },
                  {
                    $count: "count",
                  },
                ],
                feAssigned: [
                  {
                    $match: {
                      $and: [
                        {
                          caseUploaded: {
                            $gte: new Date(moment(date1).format("YYYY-MM-DD")),
                            $lte: new Date(moment(date2).format("YYYY-MM-DD")),
                          },
                        },
                        {
                          stage: {
                            $nin: ["submited"],
                          },
                        },
                        {
                          managerId: new mongoose.Types.ObjectId(req.body.id),
                        },
                        {
                          fieldExecutiveId: {
                            $exists: true,
                          },
                        },
                      ],
                    },
                  },
                  {
                    $count: "count",
                  },
                ],
                feNotAssigned: [
                  {
                    $match: {
                      $and: [
                        {
                          caseUploaded: {
                            $gte: new Date(moment(date1).format("YYYY-MM-DD")),
                            $lte: new Date(moment(date2).format("YYYY-MM-DD")),
                          },
                        },
                        {
                          stage: {
                            $nin: ["submited"],
                          },
                        },
                        {
                          managerId: new mongoose.Types.ObjectId(req.body.id),
                        },
                        {
                          fieldExecutiveId: {
                            $exists: false,
                          },
                        },
                        {
                          directSupervisor: {
                            $exists: false,
                          },
                        },
                      ],
                    },
                  },
                  {
                    $count: "count",
                  },
                ],
                directToSupervisorP: [
                  {
                    $match: {
                      $and: [
                        {
                          caseUploaded: {
                            $gte: new Date(moment(date1).format("YYYY-MM-DD")),
                            $lte: new Date(moment(date2).format("YYYY-MM-DD")),
                          },
                        },
                        {
                          stage: {
                            $nin: ["submited"],
                          },
                        },
                        {
                          managerId: new mongoose.Types.ObjectId(req.body.id),
                        },
                        {
                          fieldExecutiveId: {
                            $exists: false,
                          },
                        },
                        {
                          directSupervisor: true,
                        },
                      ],
                    },
                  },
                  {
                    $count: "count",
                  },
                ],
              },
            });
            let manager = await caseModel.aggregate(condition);
            let feSubmitted = manager[0]?.feSubmitted[0]?.count;
            let directToSupervisor = manager[0]?.directToSupervisor[0]?.count;
            let notFeNorDirect = manager[0]?.notFeNorDirect[0]?.count;
            let feAssigned = manager[0]?.feAssigned[0]?.count;
            let feNotAssigned = manager[0]?.feNotAssigned[0]?.count;
            let directToSupervisorP = manager[0]?.directToSupervisorP[0]?.count;
            let member = req.body.member;
            let id = req.body.id;
            let submittCases = 0;
            let declinedCases = 0;
            let notAccepted = 0;
            let acceptedNotSubmitted = 0;
            let min = req.body.min;
            let max = req.body.max;
            let name = req.body.name;
            res.render("caseFile/efficiency/efficiencyGraph", {
              feSubmitted,
              directToSupervisor,
              notFeNorDirect,
              feAssigned,
              feNotAssigned,
              directToSupervisorP,
              submittCases,
              declinedCases,
              notAccepted,
              acceptedNotSubmitted,
              role,
              email,
              member,
              min,
              max,
              name,
              id,
            });
          }
        }
        if (req.body.member == "seniorSupervisor") {
          if (req.body.excel) {
            let condition = [];
            if (req.body.section == "feSubmitted") {
              condition.push({
                $match: {
                  $and: [
                    {
                      caseUploaded: {
                        $gte: new Date(moment(date1).format("YYYY-MM-DD")),
                        $lte: new Date(moment(date2).format("YYYY-MM-DD")),
                      },
                    },
                    {
                      stage: "submited",
                    },
                    {
                      seniorSupervisorId: new mongoose.Types.ObjectId(
                        req.body.id
                      ),
                    },
                    {
                      fieldExecutiveId: {
                        $exists: true,
                      },
                    },
                  ],
                },
              });
            }
            if (req.body.section == "directToSupervisor") {
              condition.push({
                $match: {
                  $and: [
                    {
                      caseUploaded: {
                        $gte: new Date(moment(date1).format("YYYY-MM-DD")),
                        $lte: new Date(moment(date2).format("YYYY-MM-DD")),
                      },
                    },
                    {
                      stage: "submited",
                    },
                    {
                      seniorSupervisorId: new mongoose.Types.ObjectId(
                        req.body.id
                      ),
                    },
                    {
                      fieldExecutiveId: {
                        $exists: false,
                      },
                    },
                    {
                      directSupervisor: {
                        $exists: true,
                      },
                    },
                  ],
                },
              });
            }
            if (req.body.section == "notFeNorDirect") {
              condition.push({
                $match: {
                  $and: [
                    {
                      caseUploaded: {
                        $gte: new Date(moment(date1).format("YYYY-MM-DD")),
                        $lte: new Date(moment(date2).format("YYYY-MM-DD")),
                      },
                    },
                    {
                      stage: "submited",
                    },
                    {
                      seniorSupervisorId: new mongoose.Types.ObjectId(
                        req.body.id
                      ),
                    },
                    {
                      fieldExecutiveId: {
                        $exists: false,
                      },
                    },
                    {
                      directSupervisor: {
                        $exists: false,
                      },
                    },
                  ],
                },
              });
            }
            if (req.body.section == "feAssigned") {
              condition.push({
                $match: {
                  $and: [
                    {
                      caseUploaded: {
                        $gte: new Date(moment(date1).format("YYYY-MM-DD")),
                        $lte: new Date(moment(date2).format("YYYY-MM-DD")),
                      },
                    },
                    {
                      stage: {
                        $nin: ["submited"],
                      },
                    },
                    {
                      seniorSupervisorId: new mongoose.Types.ObjectId(
                        req.body.id
                      ),
                    },
                    {
                      fieldExecutiveId: {
                        $exists: true,
                      },
                    },
                  ],
                },
              });
            }
            if (req.body.section == "feNotAssigned") {
              condition.push({
                $match: {
                  $and: [
                    {
                      caseUploaded: {
                        $gte: new Date(moment(date1).format("YYYY-MM-DD")),
                        $lte: new Date(moment(date2).format("YYYY-MM-DD")),
                      },
                    },
                    {
                      stage: {
                        $nin: ["submited"],
                      },
                    },
                    {
                      seniorSupervisorId: new mongoose.Types.ObjectId(
                        req.body.id
                      ),
                    },
                    {
                      fieldExecutiveId: {
                        $exists: false,
                      },
                    },
                    {
                      directSupervisor: {
                        $exists: false,
                      },
                    },
                  ],
                },
              });
            }
            if (req.body.section == "directToSupervisorP") {
              condition.push({
                $match: {
                  $and: [
                    {
                      caseUploaded: {
                        $gte: new Date(moment(date1).format("YYYY-MM-DD")),
                        $lte: new Date(moment(date2).format("YYYY-MM-DD")),
                      },
                    },
                    {
                      stage: {
                        $nin: ["submited"],
                      },
                    },
                    {
                      seniorSupervisorId: new mongoose.Types.ObjectId(
                        req.body.id
                      ),
                    },
                    {
                      fieldExecutiveId: {
                        $exists: false,
                      },
                    },
                    {
                      directSupervisor: true,
                    },
                  ],
                },
              });
            }
            let seniorSupervisorData = await caseModel.aggregate(condition);
            if (seniorSupervisorData.length > 0) {
              let excel = await teamEfficiencyExcel(seniorSupervisorData);
              if (excel.code == 201) {
                res.send("SUCCESS");
              } else {
                res.send("FAILED");
              }
            } else {
              res.send("NO DATA FOUND");
            }
          } else {
            let condition = [];
            condition.push({
              $facet: {
                feSubmitted: [
                  {
                    $match: {
                      $and: [
                        {
                          caseUploaded: {
                            $gte: new Date(moment(date1).format("YYYY-MM-DD")),
                            $lte: new Date(moment(date2).format("YYYY-MM-DD")),
                          },
                        },
                        {
                          stage: "submited",
                        },
                        {
                          seniorSupervisorId: new mongoose.Types.ObjectId(
                            req.body.id
                          ),
                        },
                        {
                          fieldExecutiveId: {
                            $exists: true,
                          },
                        },
                      ],
                    },
                  },
                  {
                    $count: "count",
                  },
                ],
                directToSupervisor: [
                  {
                    $match: {
                      $and: [
                        {
                          caseUploaded: {
                            $gte: new Date(moment(date1).format("YYYY-MM-DD")),
                            $lte: new Date(moment(date2).format("YYYY-MM-DD")),
                          },
                        },
                        {
                          stage: "submited",
                        },
                        {
                          seniorSupervisorId: new mongoose.Types.ObjectId(
                            req.body.id
                          ),
                        },
                        {
                          fieldExecutiveId: {
                            $exists: false,
                          },
                        },
                        {
                          directSupervisor: {
                            $exists: true,
                          },
                        },
                      ],
                    },
                  },
                  {
                    $count: "count",
                  },
                ],
                notFeNorDirect: [
                  {
                    $match: {
                      $and: [
                        {
                          caseUploaded: {
                            $gte: new Date(moment(date1).format("YYYY-MM-DD")),
                            $lte: new Date(moment(date2).format("YYYY-MM-DD")),
                          },
                        },
                        {
                          stage: "submited",
                        },
                        {
                          seniorSupervisorId: new mongoose.Types.ObjectId(
                            req.body.id
                          ),
                        },
                        {
                          fieldExecutiveId: {
                            $exists: false,
                          },
                        },
                        {
                          directSupervisor: {
                            $exists: false,
                          },
                        },
                      ],
                    },
                  },
                  {
                    $count: "count",
                  },
                ],
                feAssigned: [
                  {
                    $match: {
                      $and: [
                        {
                          caseUploaded: {
                            $gte: new Date(moment(date1).format("YYYY-MM-DD")),
                            $lte: new Date(moment(date2).format("YYYY-MM-DD")),
                          },
                        },
                        {
                          stage: {
                            $nin: ["submited"],
                          },
                        },
                        {
                          seniorSupervisorId: new mongoose.Types.ObjectId(
                            req.body.id
                          ),
                        },
                        {
                          fieldExecutiveId: {
                            $exists: true,
                          },
                        },
                      ],
                    },
                  },
                  {
                    $count: "count",
                  },
                ],
                feNotAssigned: [
                  {
                    $match: {
                      $and: [
                        {
                          caseUploaded: {
                            $gte: new Date(moment(date1).format("YYYY-MM-DD")),
                            $lte: new Date(moment(date2).format("YYYY-MM-DD")),
                          },
                        },
                        {
                          stage: {
                            $nin: ["submited"],
                          },
                        },
                        {
                          seniorSupervisorId: new mongoose.Types.ObjectId(
                            req.body.id
                          ),
                        },
                        {
                          fieldExecutiveId: {
                            $exists: false,
                          },
                        },
                        {
                          directSupervisor: {
                            $exists: false,
                          },
                        },
                      ],
                    },
                  },
                  {
                    $count: "count",
                  },
                ],
                directToSupervisorP: [
                  {
                    $match: {
                      $and: [
                        {
                          caseUploaded: {
                            $gte: new Date(moment(date1).format("YYYY-MM-DD")),
                            $lte: new Date(moment(date2).format("YYYY-MM-DD")),
                          },
                        },
                        {
                          stage: {
                            $nin: ["submited"],
                          },
                        },
                        {
                          seniorSupervisorId: new mongoose.Types.ObjectId(
                            req.body.id
                          ),
                        },
                        {
                          fieldExecutiveId: {
                            $exists: false,
                          },
                        },
                        {
                          directSupervisor: true,
                        },
                      ],
                    },
                  },
                  {
                    $count: "count",
                  },
                ],
              },
            });
            let seniorSupervisor = await caseModel.aggregate(condition);
            let feSubmitted = seniorSupervisor[0]?.feSubmitted[0]?.count;
            let directToSupervisor =
              seniorSupervisor[0]?.directToSupervisor[0]?.count;
            let notFeNorDirect = seniorSupervisor[0]?.notFeNorDirect[0]?.count;
            let feAssigned = seniorSupervisor[0]?.feAssigned[0]?.count;
            let feNotAssigned = seniorSupervisor[0]?.feNotAssigned[0]?.count;
            let directToSupervisorP =
              seniorSupervisor[0]?.directToSupervisorP[0]?.count;
            let member = req.body.member;
            let id = req.body.id;
            let submittCases = 0;
            let declinedCases = 0;
            let notAccepted = 0;
            let acceptedNotSubmitted = 0;
            let min = req.body.min;
            let max = req.body.max;
            let name = req.body.name;
            res.render("caseFile/efficiency/efficiencyGraph", {
              feSubmitted,
              directToSupervisor,
              notFeNorDirect,
              feAssigned,
              feNotAssigned,
              directToSupervisorP,
              submittCases,
              declinedCases,
              notAccepted,
              acceptedNotSubmitted,
              role,
              email,
              member,
              min,
              max,
              name,
              id,
            });
          }
        }
        if (req.body.member == "supervisor") {
          if (req.body.excel) {
            let condition = [];
            if (req.body.section == "feSubmitted") {
              condition.push({
                $match: {
                  $and: [
                    {
                      caseUploaded: {
                        $gte: new Date(moment(date1).format("YYYY-MM-DD")),
                        $lte: new Date(moment(date2).format("YYYY-MM-DD")),
                      },
                    },
                    {
                      stage: "submited",
                    },
                    {
                      supervisorId: new mongoose.Types.ObjectId(req.body.id),
                    },
                    {
                      fieldExecutiveId: {
                        $exists: true,
                      },
                    },
                  ],
                },
              });
            }
            if (req.body.section == "directToSupervisor") {
              condition.push({
                $match: {
                  $and: [
                    {
                      caseUploaded: {
                        $gte: new Date(moment(date1).format("YYYY-MM-DD")),
                        $lte: new Date(moment(date2).format("YYYY-MM-DD")),
                      },
                    },
                    {
                      stage: "submited",
                    },
                    {
                      supervisorId: new mongoose.Types.ObjectId(req.body.id),
                    },
                    {
                      fieldExecutiveId: {
                        $exists: false,
                      },
                    },
                    {
                      directSupervisor: {
                        $exists: true,
                      },
                    },
                  ],
                },
              });
            }
            if (req.body.section == "notFeNorDirect") {
              condition.push({
                $match: {
                  $and: [
                    {
                      caseUploaded: {
                        $gte: new Date(moment(date1).format("YYYY-MM-DD")),
                        $lte: new Date(moment(date2).format("YYYY-MM-DD")),
                      },
                    },
                    {
                      stage: "submited",
                    },
                    {
                      supervisorId: new mongoose.Types.ObjectId(req.body.id),
                    },
                    {
                      fieldExecutiveId: {
                        $exists: false,
                      },
                    },
                    {
                      directSupervisor: {
                        $exists: false,
                      },
                    },
                  ],
                },
              });
            }
            if (req.body.section == "feAssigned") {
              condition.push({
                $match: {
                  $and: [
                    {
                      caseUploaded: {
                        $gte: new Date(moment(date1).format("YYYY-MM-DD")),
                        $lte: new Date(moment(date2).format("YYYY-MM-DD")),
                      },
                    },
                    {
                      stage: {
                        $nin: ["submited"],
                      },
                    },
                    {
                      supervisorId: new mongoose.Types.ObjectId(req.body.id),
                    },
                    {
                      fieldExecutiveId: {
                        $exists: true,
                      },
                    },
                  ],
                },
              });
            }
            if (req.body.section == "feNotAssigned") {
              condition.push({
                $match: {
                  $and: [
                    {
                      caseUploaded: {
                        $gte: new Date(moment(date1).format("YYYY-MM-DD")),
                        $lte: new Date(moment(date2).format("YYYY-MM-DD")),
                      },
                    },
                    {
                      stage: {
                        $nin: ["submited"],
                      },
                    },
                    {
                      supervisorId: new mongoose.Types.ObjectId(req.body.id),
                    },
                    {
                      fieldExecutiveId: {
                        $exists: false,
                      },
                    },
                    {
                      directSupervisor: {
                        $exists: false,
                      },
                    },
                  ],
                },
              });
            }
            if (req.body.section == "directToSupervisorP") {
              condition.push({
                $match: {
                  $and: [
                    {
                      caseUploaded: {
                        $gte: new Date(moment(date1).format("YYYY-MM-DD")),
                        $lte: new Date(moment(date2).format("YYYY-MM-DD")),
                      },
                    },
                    {
                      stage: {
                        $nin: ["submited"],
                      },
                    },
                    {
                      supervisorId: new mongoose.Types.ObjectId(req.body.id),
                    },
                    {
                      fieldExecutiveId: {
                        $exists: false,
                      },
                    },
                    {
                      directSupervisor: true,
                    },
                  ],
                },
              });
            }
            let supervisorData = await caseModel.aggregate(condition);
            if (supervisorData.length > 0) {
              let excel = await teamEfficiencyExcel(supervisorData);
              if (excel.code == 201) {
                res.send("SUCCESS");
              } else {
                res.send("FAILED");
              }
            } else {
              res.send("NO DATA FOUND");
            }
          } else {
            let condition = [];
            condition.push({
              $facet: {
                feSubmitted: [
                  {
                    $match: {
                      $and: [
                        {
                          caseUploaded: {
                            $gte: new Date(moment(date1).format("YYYY-MM-DD")),
                            $lte: new Date(moment(date2).format("YYYY-MM-DD")),
                          },
                        },
                        {
                          stage: "submited",
                        },
                        {
                          supervisorId: new mongoose.Types.ObjectId(
                            req.body.id
                          ),
                        },
                        {
                          fieldExecutiveId: {
                            $exists: true,
                          },
                        },
                      ],
                    },
                  },
                  {
                    $count: "count",
                  },
                ],
                directToSupervisor: [
                  {
                    $match: {
                      $and: [
                        {
                          caseUploaded: {
                            $gte: new Date(moment(date1).format("YYYY-MM-DD")),
                            $lte: new Date(moment(date2).format("YYYY-MM-DD")),
                          },
                        },
                        {
                          stage: "submited",
                        },
                        {
                          supervisorId: new mongoose.Types.ObjectId(
                            req.body.id
                          ),
                        },
                        {
                          fieldExecutiveId: {
                            $exists: false,
                          },
                        },
                        {
                          directSupervisor: {
                            $exists: true,
                          },
                        },
                      ],
                    },
                  },
                  {
                    $count: "count",
                  },
                ],
                notFeNorDirect: [
                  {
                    $match: {
                      $and: [
                        {
                          caseUploaded: {
                            $gte: new Date(moment(date1).format("YYYY-MM-DD")),
                            $lte: new Date(moment(date2).format("YYYY-MM-DD")),
                          },
                        },
                        {
                          stage: "submited",
                        },
                        {
                          supervisorId: new mongoose.Types.ObjectId(
                            req.body.id
                          ),
                        },
                        {
                          fieldExecutiveId: {
                            $exists: false,
                          },
                        },
                        {
                          directSupervisor: {
                            $exists: false,
                          },
                        },
                      ],
                    },
                  },
                  {
                    $count: "count",
                  },
                ],
                feAssigned: [
                  {
                    $match: {
                      $and: [
                        {
                          caseUploaded: {
                            $gte: new Date(moment(date1).format("YYYY-MM-DD")),
                            $lte: new Date(moment(date2).format("YYYY-MM-DD")),
                          },
                        },
                        {
                          stage: {
                            $nin: ["submited"],
                          },
                        },
                        {
                          supervisorId: new mongoose.Types.ObjectId(
                            req.body.id
                          ),
                        },
                        {
                          fieldExecutiveId: {
                            $exists: true,
                          },
                        },
                      ],
                    },
                  },
                  {
                    $count: "count",
                  },
                ],
                feNotAssigned: [
                  {
                    $match: {
                      $and: [
                        {
                          caseUploaded: {
                            $gte: new Date(moment(date1).format("YYYY-MM-DD")),
                            $lte: new Date(moment(date2).format("YYYY-MM-DD")),
                          },
                        },
                        {
                          stage: {
                            $nin: ["submited"],
                          },
                        },
                        {
                          supervisorId: new mongoose.Types.ObjectId(
                            req.body.id
                          ),
                        },
                        {
                          fieldExecutiveId: {
                            $exists: false,
                          },
                        },
                        {
                          directSupervisor: {
                            $exists: false,
                          },
                        },
                      ],
                    },
                  },
                  {
                    $count: "count",
                  },
                ],
                directToSupervisorP: [
                  {
                    $match: {
                      $and: [
                        {
                          caseUploaded: {
                            $gte: new Date(moment(date1).format("YYYY-MM-DD")),
                            $lte: new Date(moment(date2).format("YYYY-MM-DD")),
                          },
                        },
                        {
                          stage: {
                            $nin: ["submited"],
                          },
                        },
                        {
                          supervisorId: new mongoose.Types.ObjectId(
                            req.body.id
                          ),
                        },
                        {
                          fieldExecutiveId: {
                            $exists: false,
                          },
                        },
                        {
                          directSupervisor: true,
                        },
                      ],
                    },
                  },
                  {
                    $count: "count",
                  },
                ],
              },
            });
            let supervisor = await caseModel.aggregate(condition);
            let feSubmitted = supervisor[0]?.feSubmitted[0]?.count;
            let directToSupervisor =
              supervisor[0]?.directToSupervisor[0]?.count;
            let notFeNorDirect = supervisor[0]?.notFeNorDirect[0]?.count;
            let feAssigned = supervisor[0]?.feAssigned[0]?.count;
            let feNotAssigned = supervisor[0]?.feNotAssigned[0]?.count;
            let directToSupervisorP =
              supervisor[0]?.directToSupervisorP[0]?.count;
            let member = req.body.member;
            let id = req.body.id;
            let submittCases = 0;
            let declinedCases = 0;
            let notAccepted = 0;
            let acceptedNotSubmitted = 0;
            let min = req.body.min;
            let max = req.body.max;
            let name = req.body.name;
            res.render("caseFile/efficiency/efficiencyGraph", {
              feSubmitted,
              directToSupervisor,
              notFeNorDirect,
              feAssigned,
              feNotAssigned,
              directToSupervisorP,
              submittCases,
              declinedCases,
              notAccepted,
              acceptedNotSubmitted,
              role,
              email,
              member,
              min,
              max,
              name,
              id,
            });
          }
        }
        if (req.body.member == "fieldExecutive") {
          if (req.body.excel) {
            let condition = [];
            if (req.body.section == "submittedCases") {
              condition.push({
                $match: {
                  $and: [
                    {
                      caseUploaded: {
                        $gte: new Date(moment(date1).format("YYYY-MM-DD")),
                        $lte: new Date(moment(date2).format("YYYY-MM-DD")),
                      },
                    },
                    {
                      fieldExecutiveId: new mongoose.Types.ObjectId(
                        req.body.id
                      ),
                    },
                    {
                      $or: [
                        {
                          stage: "supervisor",
                        },
                        {
                          stage: "manager",
                        },
                        {
                          stage: "submited",
                        },
                      ],
                    },
                  ],
                },
              });
            }
            if (req.body.section == "declinedCases") {
              condition.push({
                $match: {
                  $and: [
                    {
                      caseUploaded: {
                        $gte: new Date(moment(date1).format("YYYY-MM-DD")),
                        $lte: new Date(moment(date2).format("YYYY-MM-DD")),
                      },
                    },
                    {
                      "declinedBy.fieldExecutiveId": `${req.body.id}`,
                    },
                    {
                      fieldExecutiveId: {
                        $ne: new mongoose.Types.ObjectId(req.body.id),
                      },
                    },
                  ],
                },
              });
            }
            if (req.body.section == "notAcceptedCases") {
              condition.push({
                $match: {
                  $and: [
                    {
                      caseUploaded: {
                        $gte: new Date(moment(date1).format("YYYY-MM-DD")),
                        $lte: new Date(moment(date2).format("YYYY-MM-DD")),
                      },
                    },
                    {
                      fieldExecutiveId: new mongoose.Types.ObjectId(
                        req.body.id
                      ),
                    },
                    {
                      acceptedBy: {
                        $exists: false,
                      },
                    },
                  ],
                },
              });
            }
            if (req.body.section == "acceptedNotSubmitted") {
              condition.push({
                $match: {
                  $and: [
                    {
                      caseUploaded: {
                        $gte: new Date(moment(date1).format("YYYY-MM-DD")),
                        $lte: new Date(moment(date2).format("YYYY-MM-DD")),
                      },
                    },
                    {
                      fieldExecutiveId: new mongoose.Types.ObjectId(
                        req.body.id
                      ),
                    },
                    {
                      acceptedBy: new mongoose.Types.ObjectId(req.body.id),
                    },
                    {
                      stage: {
                        $nin: ["submited", "supervisor", "manager"],
                      },
                    },
                  ],
                },
              });
            }

            let fieldExecutiveData = await caseModel.aggregate(condition);

            if (fieldExecutiveData.length > 0) {
              let excel = await teamEfficiencyExcel(fieldExecutiveData);
              if (excel.code == 201) {
                res.send("SUCCESS");
              } else {
                res.send("FAILED");
              }
            } else {
              res.send("NO DATA FOUND");
            }
          } else {
            let condition = [];
            condition.push({
              $facet: {
                submittedCases: [
                  {
                    $match: {
                      $and: [
                        {
                          caseUploaded: {
                            $gte: new Date(moment(date1).format("YYYY-MM-DD")),
                            $lte: new Date(moment(date2).format("YYYY-MM-DD")),
                          },
                        },
                        {
                          fieldExecutiveId: new mongoose.Types.ObjectId(
                            req.body.id
                          ),
                        },
                        {
                          $or: [
                            {
                              stage: "supervisor",
                            },
                            {
                              stage: "manager",
                            },
                            {
                              stage: "submited",
                            },
                          ],
                        },
                      ],
                    },
                  },
                  {
                    $count: "count",
                  },
                ],
                declinedCases: [
                  {
                    $match: {
                      $and: [
                        {
                          caseUploaded: {
                            $gte: new Date(moment(date1).format("YYYY-MM-DD")),
                            $lte: new Date(moment(date2).format("YYYY-MM-DD")),
                          },
                        },
                        {
                          "declinedBy.fieldExecutiveId": `${req.body.id}`,
                        },
                        {
                          fieldExecutiveId: {
                            $ne: new mongoose.Types.ObjectId(req.body.id),
                          },
                        },
                      ],
                    },
                  },
                  {
                    $count: "count",
                  },
                ],
                notAccepted: [
                  {
                    $match: {
                      $and: [
                        {
                          caseUploaded: {
                            $gte: new Date(moment(date1).format("YYYY-MM-DD")),
                            $lte: new Date(moment(date2).format("YYYY-MM-DD")),
                          },
                        },
                        {
                          fieldExecutiveId: new mongoose.Types.ObjectId(
                            req.body.id
                          ),
                        },
                        {
                          acceptedBy: {
                            $exists: false,
                          },
                        },
                      ],
                    },
                  },
                  {
                    $count: "count",
                  },
                ],
                acceptedNotSubmitted: [
                  {
                    $match: {
                      $and: [
                        {
                          caseUploaded: {
                            $gte: new Date(moment(date1).format("YYYY-MM-DD")),
                            $lte: new Date(moment(date2).format("YYYY-MM-DD")),
                          },
                        },
                        {
                          fieldExecutiveId: new mongoose.Types.ObjectId(
                            req.body.id
                          ),
                        },
                        {
                          acceptedBy: new mongoose.Types.ObjectId(req.body.id),
                        },
                        {
                          stage: {
                            $nin: ["submited", "supervisor", "manager"],
                          },
                        },
                      ],
                    },
                  },
                  {
                    $count: "count",
                  },
                ],
              },
            });
            let fieldExecutive = await caseModel.aggregate(condition);
            let submittCases = fieldExecutive[0]?.submittedCases[0]?.count;
            let declinedCases = fieldExecutive[0]?.declinedCases[0]?.count;
            let notAccepted = fieldExecutive[0]?.notAccepted[0]?.count;
            let acceptedNotSubmitted =
              fieldExecutive[0]?.acceptedNotSubmitted[0]?.count;
            let feSubmitted = 0;
            let directToSupervisor = 0;
            let feAssigned = 0;
            let feNotAssigned = 0;
            let directToSupervisorP = 0;
            let member = req.body.member;
            let id = req.body.id;
            let min = req.body.min;
            let max = req.body.max;
            let name = req.body.name;
            res.render("caseFile/efficiency/efficiencyGraph", {
              feSubmitted,
              directToSupervisor,
              feAssigned,
              feNotAssigned,
              directToSupervisorP,
              submittCases,
              declinedCases,
              notAccepted,
              acceptedNotSubmitted,
              role,
              email,
              member,
              min,
              max,
              name,
              id,
            });
          }
        }
      } else {
        const { min, max, name, member, id } = req.body
        const { one, two, three, four, five, six, seven, notSubmitted, oneArray, twoArray, threeArray, fourArray, fiveArray, sixArray, sevenArray, notSubmittedArray, } = await calTat(req, date1, date2);
        if (req.body.excel != "excel") {
          res.render("caseFile/efficiency/tat", { one, two, three, four, five, six, seven, notSubmitted, min, max, name, member, role, email, id, });
        };
        if (req.body.excel == "excel") {
          if (req.body.section == "0_to_15_mins") {
            if (oneArray.length > 0) {
              let excel = await teamEfficiencyExcel(oneArray);
              if (excel.code == 201) {
                res.send("SUCCESS");
              } else {
                res.send("FAILED");
              }
            } else {
              res.send("NO DATA FOUND");
            }
          }
          if (req.body.section == "15_to_30_mins") {
            if (twoArray.length > 0) {
              let excel = await teamEfficiencyExcel(twoArray);
              if (excel.code == 201) {
                res.send("SUCCESS");
              } else {
                res.send("FAILED");
              }
            } else {
              res.send("NO DATA FOUND");
            }
          }
          if (req.body.section == "30_to_45_mins") {
            if (threeArray.length > 0) {
              let excel = await teamEfficiencyExcel(threeArray);
              if (excel.code == 201) {
                res.send("SUCCESS");
              } else {
                res.send("FAILED");
              }
            } else {
              res.send("NO DATA FOUND");
            }
          }
          if (req.body.section == "45_to_60_mins") {
            if (fourArray.length > 0) {
              let excel = await teamEfficiencyExcel(fourArray);
              if (excel.code == 201) {
                res.send("SUCCESS");
              } else {
                res.send("FAILED");
              }
            } else {
              res.send("NO DATA FOUND");
            }
          }
          if (req.body.section == "60_to_75_mins") {
            if (fiveArray.length > 0) {
              let excel = await teamEfficiencyExcel(fiveArray);
              if (excel.code == 201) {
                res.send("SUCCESS");
              } else {
                res.send("FAILED");
              }
            } else {
              res.send("NO DATA FOUND");
            }
          }
          if (req.body.section == "75_to_90_mins") {
            if (sixArray.length > 0) {
              let excel = await teamEfficiencyExcel(sixArray);
              if (excel.code == 201) {
                res.send("SUCCESS");
              } else {
                res.send("FAILED");
              }
            } else {
              res.send("NO DATA FOUND");
            }
          }
          if (req.body.section == "90_and_above") {
            if (sevenArray.length > 0) {
              let excel = await teamEfficiencyExcel(sevenArray);
              if (excel.code == 201) {
                res.send("SUCCESS");
              } else {
                res.send("FAILED");
              }
            } else {
              res.send("NO DATA FOUND");
            }
          }
          if (req.body.section == "0_to_3_hrs") {
            if (oneArray.length > 0) {
              let excel = await teamEfficiencyExcel(oneArray);
              if (excel.code == 201) {
                res.send("SUCCESS");
              } else {
                res.send("FAILED");
              }
            } else {
              res.send("NO DATA FOUND");
            }
          }
          if (req.body.section == "3_to_4_hrs") {
            if (twoArray.length > 0) {
              let excel = await teamEfficiencyExcel(twoArray);
              if (excel.code == 201) {
                res.send("SUCCESS");
              } else {
                res.send("FAILED");
              }
            } else {
              res.send("NO DATA FOUND");
            }
          }
          if (req.body.section == "4_to_6_hrs") {
            if (threeArray.length > 0) {
              let excel = await teamEfficiencyExcel(threeArray);
              if (excel.code == 201) {
                res.send("SUCCESS");
              } else {
                res.send("FAILED");
              }
            } else {
              res.send("NO DATA FOUND");
            }
          }
          if (req.body.section == "6_to_8_hrs") {
            if (fourArray.length > 0) {
              let excel = await teamEfficiencyExcel(fourArray);
              if (excel.code == 201) {
                res.send("SUCCESS");
              } else {
                res.send("FAILED");
              }
            } else {
              res.send("NO DATA FOUND");
            }
          }
          if (req.body.section == "8_to_12_hrs") {
            if (fiveArray.length > 0) {
              let excel = await teamEfficiencyExcel(fiveArray);
              if (excel.code == 201) {
                res.send("SUCCESS");
              } else {
                res.send("FAILED");
              }
            } else {
              res.send("NO DATA FOUND");
            }
          }
          if (req.body.section == "12_to_18_hrs") {
            if (sixArray.length > 0) {
              let excel = await teamEfficiencyExcel(sixArray);
              if (excel.code == 201) {
                res.send("SUCCESS");
              } else {
                res.send("FAILED");
              }
            } else {
              res.send("NO DATA FOUND");
            }
          }
          if (req.body.section == "more_than_18_hrs") {
            if (sevenArray.length > 0) {
              let excel = await teamEfficiencyExcel(sevenArray);
              if (excel.code == 201) {
                res.send("SUCCESS");
              } else {
                res.send("FAILED");
              }
            } else {
              res.send("NO DATA FOUND");
            }
          }
          if (req.body.section == "not_submitted") {
            if (notSubmittedArray.length > 0) {
              let excel = await teamEfficiencyExcel(notSubmittedArray);
              if (excel.code == 201) {
                res.send("SUCCESS");
              } else {
                res.send("FAILED");
              }
            } else {
              res.send("NO DATA FOUND");
            }
          }
        };
      }
    } catch (error) {
      next(error);
    }
  };

  // delete pending cases******************************************************
  public deletePendingCases = async (
    req: any,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let deletePendingCases = await caseModel.deleteMany({ _id: { $in: req.body.id }, stage: { $nin: ["supervisor", "manager", "submited"] } });
      if (req.body.id.length == deletePendingCases.deletedCount) {
        res.send("success");
      } else {
        res.send("error");
      }
    } catch (error) {
      next(error);
    }
  };

  // ***********************************google api ************************************
  public calculateDistance = async (
    req: any,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let condition = [];
      condition.push(
        {
          $match: {
            isDeleted: {
              $exists: false,
            },
          },
        },
        {
          $project: {
            _id: 1,
            fullName: 1,
          },
        }
      );
      let fieldExecutive = await fieldExecutiveModel.aggregate(condition);
      const { role, email } = req.user
      res.locals.message = req.flash();
      res.render("caseFile/google/date_fe_selection", {
        role,
        email,
        fieldExecutive,
      });
    } catch (error) {
      next(error);
    }
  };

  public calculateDistanceFe = async (
    req: any,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { min, member } = req.body;
      const { role, email } = req.user

      let date1 = moment(req.body.min).format("YYYY/MM/DD");
      let date2 = moment(moment(req.body.min).format("YYYY/MM/DD")).format("YYYY/MM/DD");

      res.locals.message = req.flash();
      if (req.body.action === "route") {
        let condition = [];

        condition.push(
          {
            $match: {
              fieldExecutiveId: new mongoose.Types.ObjectId(member),
            },
          },
          {
            $match: {
              date: {
                $gte: new Date(moment(date1).format("YYYY-MM-DD")),
                $lte: new Date(moment(date2).format("YYYY-MM-DD")),
              },
            },
          },
          {
            $unwind: {
              path: "$coordinates",
            },
          },
          {
            $project: {
              coordinates: 1,
            },
          },
        );
        let fieldExecutive = await feCoordinatesModel.aggregate(condition);

        let route = "";
        if (fieldExecutive.length > 25) {
          route = "yes";
        } else if (fieldExecutive.length > 0 && fieldExecutive.length <= 25) {
          route = "no";
        } else if (fieldExecutive.length <= 0) {
          route = "noRecord";
        }
        res.render("caseFile/google/googleWaypointIcons", {
          role,
          email,
          route,
          id: member,
          min,
        });
      } else {
        res.render("caseFile/google/date_fe_selection", { role, email });
      }
    } catch (error) {
      next(error);
    }
  };

  public calGoogleRoute = async (
    req: any,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id, min, googleRoute } = req.body
      res.render("caseFile/google/googleWaypointRoute", { id, min, googleRoute });
    } catch (error) {
      next(error);
    }
  };

  public calGoogleFinalRoute = async (
    req: any,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let cordinate1 = [];
      let cordinate2 = [];
      const { id, min, googleRoute } = req.body
      let date1 = moment(min).format("YYYY/MM/DD");
      let date2 = moment(moment(min).format("YYYY/MM/DD")).format("YYYY/MM/DD");

      let condition = [];
      condition.push(
        {
          $match: {
            fieldExecutiveId: new mongoose.Types.ObjectId(id),
          },
        },
        {
          $match: {
            date: {
              $gte: new Date(moment(date1).format("YYYY-MM-DD")),
              $lte: new Date(moment(date2).format("YYYY-MM-DD")),
            },
          },
        },
        {
          $unwind: {
            path: "$coordinates",
          },
        },

        {
          $project: {
            coordinates: 1,
          },
        },
      );
      let fieldExecutive = await feCoordinatesModel.aggregate(condition);
      if (googleRoute == "singleRoute") {
        res.send(fieldExecutive);
      } else {
        cordinate1 = [];
        cordinate2 = [];
        for (let i = 0; i < fieldExecutive.length; i++) {
          if (i < fieldExecutive.length / 2) {
            cordinate1.push(fieldExecutive[i]);
          } else {
            cordinate2.push(fieldExecutive[i]);
          }
        }
        if (googleRoute == "cordinate1") {
          res.send(cordinate1);
        } else {
          res.send(cordinate2);
        }
      }
    } catch (error) {
      next(error);
    }
  };

  public databaseBackup = async (
    req: any,
    res: Response,
    next: NextFunction
  ) => {
    try {

      const backupFileName = await backupDatabase();

      const backupPath = path.join(__dirname, "../../public/backups/cmb.gz")

      res.download(backupPath, (err) => {
        if (err) {
          console.error(`Error downloading backup file: ${err}`);
          req.flash("error", `Error downloading backup file: ${err}`);
          res.redirect('/dashboard')
        } else {
          console.log('Backup file downloaded successfully');
        }
      });

    } catch (error) {
      next(error);
    }
  };

  public calculateTatExcel = async (
    req: any,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let role: any = req.user.role;
      let email = req.user.email;
      res.locals.message = req.flash();
      res.render("caseFile/tatExcel/chooseMember", { role, email });
    } catch (error) {
      next(error);
    }
  };

  public tatToExcel = async (
    req: any,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const tatToExcelConfirmation: any = this.caseService.tatToExcelConfirmationData(req);
      res.redirect('/admin/viewTatFiles')
    } catch (error) {
      next(error);
    }
  };


}

export default caseController;
