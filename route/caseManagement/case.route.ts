import { Response, Router, Request, NextFunction } from "express";
import Route from "../../interfaces/route.interface";
import caseController from "../../controllers/caseManagementController/case.controller";
import auth from "../../utils/verifyToken";
import upload from "../../utils/multer";
import { upload1 } from "../../utils/multer";
const asyncHandler = fn => (req, res, next) => {
  return Promise.resolve(fn(req, res, next)).catch(next);
};

class caseRoute implements Route {
  public path = "/case";
  public router = Router();
  public caseController = new caseController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Middleware added to each route
    this.router.get(`${this.path}/uploadCase`, auth, this.caseController.uploadCase);
    this.router.post(`${this.path}/uploadCase`, upload1.single('caseFile'), auth, this.caseController.uploadCaseData);
    this.router.get(`${this.path}/editCase/:id`, auth, this.caseController.editCase);
    this.router.post(`${this.path}/editCase`, auth, this.caseController.editCaseData);
    this.router.get(`${this.path}/deleteCase`, auth, this.caseController.deleteCase);
    this.router.get(`${this.path}/assignManager`, auth, this.caseController.assignManager);
    this.router.post(`${this.path}/assignManager`, auth, this.caseController.assignManagerData);
    this.router.get(`${this.path}/assignSeniorSupervisor`, auth, this.caseController.assignSeniorSupervisor);
    this.router.post(`${this.path}/assignSeniorSupervisor`, auth, this.caseController.assignSeniorSupervisorData);
    this.router.get(`${this.path}/assignSupervisor`, auth, this.caseController.assignSupervisor);
    this.router.post(`${this.path}/assignSupervisor`, auth, this.caseController.assignSupervisorData);
    this.router.get(`${this.path}/assignFieldExecutive`, auth, this.caseController.assignFieldExecutive);
    this.router.post(`${this.path}/assignFieldExecutive`, auth, this.caseController.assignFieldExecutiveData);
    this.router.get(`${this.path}/viewCase`, auth, this.caseController.viewCase);
    this.router.post(`${this.path}/viewCaseDatatable`, auth, this.caseController.viewCaseDatatable);
    this.router.get(`${this.path}/viewDuplicateCase`, auth, this.caseController.viewDuplicateCase);
    this.router.post(`${this.path}/viewDuplicateCaseDataTable`, auth, this.caseController.viewDuplicateCaseDataTable);
    this.router.get(`${this.path}/viewDuplicateCaseDataLogs`, auth, this.caseController.viewDuplicateCaseDataLogs);
    this.router.post(`${this.path}/viewDuplicateCaseDataLogsDataTable`, auth, this.caseController.viewDuplicateCaseDataLogsDataTable);
    this.router.get(`${this.path}/reviewSupervisorCase`, auth, this.caseController.reviewSupervisorCase);
    this.router.post(`${this.path}/reviewSupervisorCaseDataTable`, auth, this.caseController.reviewSupervisorCaseDataTable);
    this.router.get(`${this.path}/editReviewSupervisorCase/:id`, auth, this.caseController.editReviewSupervisorCase);
    this.router.post(`${this.path}/editReviewSupervisorCase`, auth, upload.fields([{ name: "imageFile1" }, { name: "imageFile2" }, { name: "imageFile3" }, { name: "imageFile4" },{ name: "imageFile5" },{ name: "imageFile6" },{ name: "imageFile7" },{ name: "imageFile8" }]), this.caseController.editReviewSupervisorCaseData);
    this.router.get(`${this.path}/reviewManagerCase`, auth, this.caseController.reviewManagerCase);
    this.router.post(`${this.path}/reviewManagerCaseDataTable`, auth, this.caseController.reviewManagerCaseDataTable);
    this.router.get(`${this.path}/editReviewManagerCase/:id`, auth, this.caseController.editReviewManagerCase);
    this.router.post(`${this.path}/editReviewManagerCase`, auth, upload.fields([{ name: "imageFile1" }, { name: "imageFile2" }, { name: "imageFile3" }, { name: "imageFile4" },{ name: "imageFile5" },{ name: "imageFile6" },{ name: "imageFile7" },{ name: "imageFile8" }]), this.caseController.editReviewManagerCaseData);
    this.router.get(`${this.path}/reviewSeniorSupervisorCase`, auth, this.caseController.reviewSeniorSupervisorCase);
    this.router.post(`${this.path}/reviewSeniorSupervisorCaseDataTable`, auth, this.caseController.reviewSeniorSupervisorCaseDataTable);
    this.router.get(`${this.path}/editReviewSeniorSupervisorCase/:id`, auth, this.caseController.editReviewSeniorSupervisorCase);
    this.router.post(`${this.path}/editReviewSeniorSupervisorCase`, auth, upload.fields([{ name: "imageFile1" }, { name: "imageFile2" }, { name: "imageFile3" }, { name: "imageFile4" },{ name: "imageFile5" },{ name: "imageFile6" },{ name: "imageFile7" },{ name: "imageFile8" }]), this.caseController.editReviewSeniorSupervisorCaseData);
    this.router.get(`${this.path}/reviewAdminCase`, auth, this.caseController.reviewAdminCase);
    this.router.post(`${this.path}/reviewAdminCaseDataTable`, auth, this.caseController.reviewAdminCaseDataTable);
    this.router.get(`${this.path}/editReviewAdminCase/:id`, auth, this.caseController.editReviewAdminCase);
    this.router.post(`${this.path}/editReviewAdminCase`, auth, upload.fields([{ name: "imageFile1" }, { name: "imageFile2" }, { name: "imageFile3" }, { name: "imageFile4" },{ name: "imageFile5" },{ name: "imageFile6" },{ name: "imageFile7" },{ name: "imageFile8" }]), this.caseController.editReviewAdminCaseData);
    this.router.get(`${this.path}/successfullyCompletedCase`, auth, this.caseController.successfullyCompletedCase);
    this.router.post(`${this.path}/successFullyCompletedCaseDataTable`, auth, asyncHandler(this.caseController.successFullyCompletedCaseDataTable));
    this.router.get(`${this.path}/assignDuplicateCase`, auth, this.caseController.assignDuplicateCase);
    this.router.get(`${this.path}/viewCaseFilesForCopy`, auth, this.caseController.viewCaseFilesForCopy);
    this.router.post(`${this.path}/viewCaseFilesForCopyDatatable`, auth, this.caseController.viewCaseFilesForCopyDatatable);
    this.router.get(`${this.path}/copyCase`, auth, this.caseController.copyCase);
    this.router.get(`${this.path}/viewDuplicateFeCase`, auth, this.caseController.viewDuplicateFeCase);
    this.router.get(`${this.path}/downloadCaseFile/:id`, auth, this.caseController.downloadCaseFile);
    this.router.get(`${this.path}/downloadCaseFilePdf/:id`, auth, this.caseController.downloadCaseFilePdf);
    this.router.get(`${this.path}/downloadCaseFilePdf2/:id`, auth, this.caseController.downloadCaseFilePdf2);
    this.router.get(`${this.path}/caseHistory/:id`, auth, this.caseController.caseHistory);
    this.router.get(`${this.path}/imageWaterMark`, auth, this.caseController.imageWaterMark);
    this.router.get(`${this.path}/pendingCases`, auth, this.caseController.pendingCases);
    this.router.post(`${this.path}/pendingCasesDatatable`, auth, this.caseController.pendingCasesDatatable);
    this.router.post(`${this.path}/deletePendingCases`, auth, this.caseController.deletePendingCases);
    this.router.post(`${this.path}/assignAllFe`, auth, this.caseController.assignAllFe);
    this.router.get(`${this.path}/directToSupervisor`, auth, this.caseController.directToSupervisor);
    this.router.get(`${this.path}/teamEfficiency`, auth, this.caseController.teamEfficiency);
    this.router.post(`${this.path}/chooseRole`, auth, this.caseController.chooseRole);
    this.router.post(`${this.path}/selectionEFTAT`, auth, this.caseController.selectionEFTAT);
    this.router.post(`${this.path}/calEfficiency`, auth, this.caseController.calEfficiency);
    this.router.get(`${this.path}/calculateDistance`, auth, this.caseController.calculateDistance);
    this.router.post(`${this.path}/calculateDistanceFe`, auth, this.caseController.calculateDistanceFe);
    this.router.post(`${this.path}/calGoogleRoute`, auth, this.caseController.calGoogleRoute);
    this.router.post(`${this.path}/calGoogleFinalRoute`, auth, this.caseController.calGoogleFinalRoute);
    this.router.get(`${this.path}/databaseBackup`, auth, this.caseController.databaseBackup);



    this.router.get(`${this.path}/calculateTatExcel`, auth, this.caseController.calculateTatExcel);
    this.router.post(`${this.path}/tatToExcel`, auth, this.caseController.tatToExcel);
  }



}

export default caseRoute;
