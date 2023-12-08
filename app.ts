import 'dotenv/config';
import express, { Request, Response, NextFunction } from "express";
import path from "path";
import { connect, set, ConnectOptions } from "mongoose";
import { dbConnection } from "./database";
import Routes from "./interfaces/route.interface";
import fs from "fs"
import cookieParser from "cookie-parser"
import flash from "connect-flash"
import session from "cookie-session";
import { logger, stream } from "./utils/logger";
import bodyParser from "body-parser";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import compression from "compression";
import config from "config";
import { archiveOldData } from './helpers/archieving/archieving'

// const customCss = fs.readFileSync((process.cwd() + "/swagger.css"), 'utf8');

class App {
    public app: express.Application;
    public port: string | number;
    public env: string;

    constructor(routes: Routes[]) {
        this.app = express();
        this.port = process.env.PORT || 8000;
        this.env = process.env.NODE_ENV || "development";
        this.connectToDatabase();
        this.initializeMiddlewares();
        if (this.env === 'production') {
            this.setFolderPermissions()
        }
        const folderPathsPublic = [
            'public/tatFiles/tatDownloadableExcels',
            'public/invoices/invoice_files',
            'public/invoices/invoiceExcelFiles',
        ];
        folderPathsPublic.forEach((folderPath) => {
            fs.mkdir(folderPath, { recursive: true }, (err) => {
                if (err) {
                    console.error(`Error creating folder ${folderPath}:`, err);
                } else {
                    console.log(`${folderPath} folder created successfully.`);
                    fs.chmod(folderPath, 0o777, (chmodErr) => {
                        if (chmodErr) {
                            console.error(`Error setting permissions for ${folderPath}:`, chmodErr);
                        } else {
                            console.log(`Permissions set to read and write for ${folderPath}.`);
                        }
                    });
                }
            });
        });
        this.initializeRoutes(routes);
        // cron.schedule("0 3 * * *", () => {
        //     archiveOldData();
        // });
        // archiveOldData()

        // this.app.use((err, req, res, next) => {
        //     console.error(err.stack)
        //     res.status(500).send('Something broke!')
        // })
    }

    private setFolderPermissions() {
        const folderPaths = [
            './dist/public/agencySeal',
            './dist/public/api-docs',
            './dist/public/excelFile',
            './dist/public/succEx',
            './dist/public/sampleExcelFormat',
            './dist/public/backups',
            './dist/public/caseFile',
            './dist/public/pendingEx',
            './dist/public/reviewEx',
        ];

        const writePermissions = 0o777; // Replace with the desired permissions

        folderPaths.forEach((folderPath) => {
            try {
                fs.accessSync(folderPath, fs.constants.W_OK);
                console.log(`Write permissions already set for folder: ${folderPath}`);
            } catch (err) {
                try {
                    fs.chmodSync(folderPath, writePermissions);
                    console.log(`Write permissions set successfully for folder: ${folderPath}`);
                } catch (err) {
                    console.error(`Failed to set write permissions for folder: ${folderPath}`);
                }
            }
        });
    }

    public listen() {
        this.app.listen(this.port, () => {
            logger.info(`=================================`);
            logger.info(`======= ENV: ${this.env} =======`);
            logger.info(`🚀 App listening on the port ${this.port}`);
            logger.info(`=================================`);
        });
    }

    public getServer() {
        return this.app;
    }

    private connectToDatabase() {
        if (this.env !== "production") {
            set("debug", true);
        }
        connect(dbConnection.url, dbConnection.options as ConnectOptions)
            .catch((error) =>
                logger.info(`${error}`)
            );
    }

    private initializeMiddlewares() {

        if (this.env === "production") {
            this.app.use(morgan("combined", { stream }));
            // this.app.use(cors({ origin: "yoursite.com", credentials: true }));
        } else {
            this.app.use(morgan("dev", { stream }));
            // this.app.use(cors({ origin: true, credentials: true }));
        }
        this.app.use(cors({
            origin: '*'
        }))
        this.app.use(hpp());
        this.app.use(
            helmet({
                contentSecurityPolicy: false,
            })
        );
        this.app.use(express.json({ limit: "5mb" }));
        this.app.use(express.urlencoded({ extended: true, limit: "5mb" }));
        this.app.use(cookieParser());
        this.app.use(express.static(path.join(__dirname, "public")));
        this.app.use(
            session({
                secret: "keys",
                resave: false,
                saveUninitialized: true,
                cookie: {
                    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
                    // secure: true, // becareful set this option, check here: https://www.npmjs.com/package/express-session#cookiesecure. In local, if you set this to true, you won't receive flash as you are using `http` in local, but http is not secure
                },
            })
        );
        this.app.use(flash());
        this.app.set("views", path.join(__dirname, "views"))
        this.app.set("view engine", "ejs")

    }


    private initializeRoutes(routes: Routes[]) {
        routes.forEach((route) => {
            this.app.use("/", route.router);
        });
    }
}

export default App;