const { spawn } = require('child_process');
import path from 'path'
import config from "config";
import { dbConfig } from "../../interfaces/db.interface";

const { host, port, database, username, password }: dbConfig = config.get("dbConfig");


async function backupDatabase() {
  // const dbHost = 'localhost'; // MongoDB host
  // const dbPort = '27017'; // MongoDB port
  // const dbName = 'typescrpt_1'; // Replace with your actual database name
  const uri = `mongodb://${username}:${password}@${host}:${port}/${database}?authSource=admin`
  // const uri = `mongodb://cmbmanagement:pRaJEvO86-Wa5rUcRIpE@3.108.79.91:27941/cmbmanagement?authSource=admin`
  const configFile = path.join(__dirname, "../../conf.yaml")
  const backupPath = path.join(__dirname, "../../public/backups"); // Replace with the desired backup folder path
  const backupFileName = `cmb`;



  const backupCommand = `mongodump --host ${host} --port ${port} --db ${database} --username=${username} --config=${configFile} --authenticationDatabase=admin --archive=${path.join(backupPath, backupFileName + '.gz')} --gzip`;

  // const backupCommand = `mongodump --uri="${uri}" --archive=${path.join(backupPath, backupFileName + '.gz')} --gzip`;

 
  return new Promise((resolve, reject) => {
   
    const backupProcess = spawn(backupCommand, { shell: true });

    backupProcess.stdout.on('data', (data) => {
      console.log(`Backup process output: ${data}`);
    });

    backupProcess.stderr.on('data', (data) => {
      console.error(`Backup process error: ${data}`);
    });

    backupProcess.on('close', (code) => {
      if (code === 0) {
        console.log('Backup completed successfully.');
        resolve(undefined);
      } else {
        console.error(`Backup process exited with code ${code}.`);
        reject(new Error(`Backup process exited with code ${code}.`));
      }
    });
  });
}

export default backupDatabase

// command for restoring
// mongorestore --host 127.0.0.1:27017 --nsFrom='typescrpt_1.*' --nsTo='testing.*'  --gzip --archive="C:\Users\archi\Desktop\typescrpt_1.gz"

