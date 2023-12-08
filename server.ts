
import App from "./app";

//api routes


import adminRoute from "./route/adminRoutes/admin.route";
import authRoute from "./route/commonRoutes/auth.route";
import managerRoute from "./route/managerRoutes/manager.route"
import seniorSupervisorRoute from "./route/seniorSupervisorRoutes/seniorSupervisor.route";
import supervisorRoute from "./route/supervisorRoutes/supervisor.route";
import fieldExecutiveRoute from "./route/fieldExecutiveRoutes/fieldExecutive.route";
import bankMemberRoute from "./route/bankMemberRoutes/bankMember.route";
import caseRoute from "./route/caseManagement/case.route";
import apiFieldExecutiveRoute from "./route/apiRoutes/fieldExecutive.route";
import indexRoute from './route/index.routes';
import invoiceRoute from "./route/invoiceRoutes/invoice.routes";



const app = new App([
	//api routes
	new adminRoute(),
	new authRoute(),
	new managerRoute(),
	new seniorSupervisorRoute(),
	new supervisorRoute(),
	new fieldExecutiveRoute(),
	new caseRoute(),
	new apiFieldExecutiveRoute(),
	new indexRoute(),
	new bankMemberRoute(),
	new invoiceRoute()

]);

app.listen();