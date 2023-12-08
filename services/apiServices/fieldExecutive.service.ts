
// import { fieldExecutive } from './../../dist/interfaces/fieldExecutive.interface';
import bcrypt from 'bcrypt'
import * as EmailValidator from 'email-validator'
import Messages from '../../messages'
import JWT from 'jsonwebtoken'
import caseModel from '@/models/case.model'
import fieldExecutiveModel from '../../models/fieldExecutive.model'
import feDistanceModel from '@/models/fieldExecutiveDistance.model'
import adminModel from '@/models/admin.model'
import managerModel from '@/models/manager.model';
import supervisorModel from '@/models/supervisors.model';
import seniorSupervisorModel from '@/models/seniorSupervisors.model';
import mongoose from 'mongoose'
import getDateTime from '@/helpers/getCurrentDateTime'
import validateReviewData from '@/helpers/validateReviewData'
import sendNotification from '../../helpers/firebase'
import moment from 'moment'
import config from 'config'
import axios from 'axios'
import feCoordinatesModel from '@/models/fieldExecutiveCoordinates.model';
import feSubmittedCasesModel from '@/models/fieldExecutiveSubmittedCases.model';
class apiFieldExecutiveService {
  public async login(req: any, res: any) {
    try {
      if (!req.body.email.trim().toLowerCase() || !req.body.password.trim()) {
        return Messages.Failed.EMAIL_PASSWORD_MISSING
      } else {
        const emailVerify = EmailValidator.validate(
          req.body.email.trim().toLowerCase()
        )
        if (emailVerify) {
          let fieldExecutive = await fieldExecutiveModel.findOne({
            email: req.body.email.trim().toLowerCase(),
            isDeleted: { $exists: false }
          })
          if (fieldExecutive) {
            async function checkUser(password: any) {
              const match = await bcrypt.compare(
                password,
                fieldExecutive.password.trim()
              )
              if (match) {
                let role = 'field-executive'
                let token = JWT.sign(
                  { _id: fieldExecutive._id.toString() },
                  config.get('secretKey'),
                  { expiresIn: 30 * 24 * 60 * 60 }
                )
                if (req.body.fireBaseToken) {
                  let fieldExecutiveToken =
                    await fieldExecutiveModel.findOneAndUpdate(
                      { _id: fieldExecutive._id },
                      {
                        $set: {
                          fireBaseToken: req.body.fireBaseToken,
                          token: token
                        }
                      }
                    )
                } else {
                  let fieldExecutiveToken =
                    await fieldExecutiveModel.findOneAndUpdate(
                      { _id: fieldExecutive._id },
                      { $set: { token: token } }
                    )
                }
                Messages.SUCCESS.MOBILE_LOGGED_IN.data.user.token = token
                Messages.SUCCESS.MOBILE_LOGGED_IN.data.user._id =
                  fieldExecutive._id
                Messages.SUCCESS.MOBILE_LOGGED_IN.data.user.fullName =
                  fieldExecutive.fullName
                return Messages.SUCCESS.MOBILE_LOGGED_IN
              } else {
                return Messages.Failed.INVALID_PASSWORD
              }
            }
            return checkUser(req.body.password.trim())
          } else {
            return Messages.Failed.USER_NOT_REGISTERED
          }
        } else {
          return Messages.Failed.INVALID_EMAIL_ID
        }
      }
    } catch (error) {
      let msg: any = {}
      msg.code = 401
      msg.message = error.message
      return msg
    }
  }
  public async assignCasesData(req: any, res: any) {
    try {
      let condition = []
      condition.push(
        {
          $match: {
            $or: [
              {
                acceptedBy: null
              },
              {
                acceptedBy: undefined
              }
            ]
          }
        },
        {
          $match: {
            duplicate: false
          }
        },
        {
          $match: {
            fieldExecutiveId: new mongoose.Types.ObjectId(`${req.user._id}`)
          }
        },
        {
          $project: {
            _id: 1,
            date: 1,
            time: 1,
            fileNo: 1,
            barCode: 1,
            applicantName: 1,
            applicantType: 1,
            officeName: 1,
            address: 1,
            pinCode: 1,
            branch: 1,
            area: 1,
            bank: 1,
            product: 1,
            mobileNo: 1,
            duplicate: 1,
            addressType: 1,
            fieldExecutive: 1,
            updated_at: 1
          }
        }
      )
      let totalCases = await caseModel
        .find({
          fieldExecutiveId: req.user._id,
          duplicate: false,
          $or: [{ acceptedBy: null }, { acceptedBy: undefined }]
        })
        .countDocuments()
      let page
      if (req.body.page) {
        page = req.body.page
      } else {
        return Messages.Failed.SOMETHING_WENT_WRONG
      }
      const limit = 50
      const skipValue = req.body.page > 1 ? limit * (page - 1) : 0
      let cases: any = await caseModel
        .aggregate(condition)
        .sort({ fileNo: 1, updated_at: -1 })
        .skip(skipValue)
        .limit(limit)
      if (cases) {
        Messages.SUCCESS.MOBILE_ASSIGN_CASES.data.totalCases = totalCases
        Messages.SUCCESS.MOBILE_ASSIGN_CASES.data.currentPage = page
        Messages.SUCCESS.MOBILE_ASSIGN_CASES.data.limit = limit
        Messages.SUCCESS.MOBILE_ASSIGN_CASES.data.cases = cases
        return Messages.SUCCESS.MOBILE_ASSIGN_CASES
      } else {
        return Messages.Failed.SOMETHING_WENT_WRONG
      }
    } catch (error) {
      let msg: any = {}
      msg.code = 401
      msg.message = error.message
      return msg
    }
  }
  public async acceptOrRejectCaseData(req: any, res: any) {
    try {
      let datetime = getDateTime()
      let logs: any = {}
      switch (req.body.status) {
        case false:
          let declinedBy: any = {}
          if (req.body.reason != undefined) {
            declinedBy = {
              fieldExecutiveId: req.user._id,
              reason: req.body.reason
            }
          } else {
            return Messages.Failed.CASES.REASON
          }
          logs.message = `case declined by fieldExecutive, Name:${req.user.fullName
            },Reason:${req.body.reason}, ${moment(datetime)
              .utc()
              .format('YYYY-MM-DD HH:mm:ss')}`
          const deleteFieldExecutiveCase = await caseModel.updateOne(
            {
              _id: req.body.id,
              fieldExecutiveId: req.user._id,
              stage: {
                $nin: ['submited', 'supervisor', 'senior-supervisor', 'manager']
              }
            },
            {
              $set: { status: 'open', stage: 'field-executive' },
              $unset: {
                fieldExecutiveId: '',
                acceptedBy: '',
                fieldExecutive: ''
              },
              $push: { declinedBy: declinedBy, logs: logs }
            }
          )
          if (deleteFieldExecutiveCase.modifiedCount > 0) {
            return Messages.SUCCESS.MOBILE_REJECT_CASE
          } else {
            return Messages.Failed.SOMETHING_WENT_WRONG
          }
          break
        case true:
          logs.message = `case accepted by fieldExecutive (${req.user.fullName
            }),${moment(datetime).utc().format('YYYY-MM-DD HH:mm:ss')}`
          const addFieldExecutiveCase = await caseModel.updateOne(
            {
              _id: req.body.id,
              fieldExecutiveId: req.user._id,
              stage: {
                $nin: ['submited', 'supervisor', 'senior-supervisor', 'manager']
              }
            },
            {
              $set: {
                acceptedBy: req.user._id,
                stage: 'field-executive',
                'fieldExecutive.acceptedDate': datetime
              },
              $push: { logs: logs }
            }
          )
          if (addFieldExecutiveCase.modifiedCount > 0) {
            return Messages.SUCCESS.MOBILE_ACCEPT_CASE
          } else {
            return Messages.Failed.SOMETHING_WENT_WRONG
          }
          break
        default:
          return Messages.Failed.SOMETHING_WENT_WRONG
      }
    } catch (error) {
      let msg: any = {}
      msg.code = 401
      msg.message = error.message
      return msg
    }
  }
  public async myCasesData(req: any, res: any) {
    try {
      let page
      if (req.body.page) {
        page = req.body.page
      } else {
        return Messages.Failed.SOMETHING_WENT_WRONG
      }
      let totalCases = await caseModel
        .find({
          fieldExecutiveId: req.user._id,
          acceptedBy: req.user._id,
          stage: 'field-executive'
        })
        .countDocuments()
      const limit = 50
      const skipValue = req.body.page > 1 ? limit * (page - 1) : 0
      let cases = await caseModel
        .find({
          fieldExecutiveId: req.user._id,
          acceptedBy: req.user._id,
          stage: 'field-executive'
        })
        .sort({ fileNo: 1 })
        .skip(skipValue)
        .limit(limit)
      if (cases.length >= 0 && cases != undefined && cases != null) {
        Messages.SUCCESS.MOBILE_ACCEPTED_CASES.data.totalCases = totalCases
        Messages.SUCCESS.MOBILE_ACCEPTED_CASES.data.currentPage = page
        Messages.SUCCESS.MOBILE_ACCEPTED_CASES.data.limit = limit
        Messages.SUCCESS.MOBILE_ACCEPTED_CASES.data.cases = cases
        return Messages.SUCCESS.MOBILE_ACCEPTED_CASES
      } else {
        return Messages.Failed.SOMETHING_WENT_WRONG
      }
    } catch (error) {
      let msg: any = {}
      msg.code = 401
      msg.message = error.message
      return msg
    }
  }
  public async dayStartEndData(req: any, res: any) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { lat, lon, status } = req.body
      if (!lat || !lon || !status) {
        throw new Error("latitude, longitude and status are required");
      }

      let todaysDate = moment(getDateTime()).utc().set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
      const yesterdayDate = todaysDate.clone().subtract(1, 'days');

      const coordinatesObject = { status, lat_long: [lon, lat], date: getDateTime() };

      let checkFieldExecutive = await feCoordinatesModel.findOne({ fieldExecutiveId: req.user._id, date: todaysDate }).session(session);

      if (!checkFieldExecutive && status === 'off') {
        todaysDate = yesterdayDate;
        checkFieldExecutive = await feCoordinatesModel.findOne({ fieldExecutiveId: req.user._id, date: yesterdayDate }).session(session);
      }
      const coordinates = checkFieldExecutive?.coordinates || [];
      const lastCoordinate = coordinates[coordinates.length - 1] || "";

      if (status === 'on') {
        if (lastCoordinate && lastCoordinate?.status !== 'off') return Messages.Failed.DAY_ON_OFF;
        const filter = { date: todaysDate, fieldExecutiveId: req.user._id };
        const update = { $push: { coordinates: coordinatesObject } };
        await feCoordinatesModel.findOneAndUpdate(filter, update, { runValidators: true, upsert: true });
        await session.commitTransaction();
        session.endSession();
        return Messages.SUCCESS.CASES.STARTING_CORDINATES;
      }

      if (status === 'off') {
        if (!lastCoordinate || lastCoordinate.status === 'off') {
          return Messages.Failed.DAY_OFF;
        }
        const currentDate = moment(coordinatesObject.date).utc().set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
        const previousDate = moment(lastCoordinate.date).utc().set({ hour: 0, minute: 0, second: 0, millisecond: 0 });

        if (moment(currentDate).diff(moment(previousDate), 'days') >= 1) {
          coordinatesObject.lat_long = lastCoordinate.lat_long
        }
        coordinates.push(coordinatesObject);
        const filter = { date: todaysDate, fieldExecutiveId: req.user._id };
        const update = { $push: { coordinates: coordinatesObject } };
        await feCoordinatesModel.findOneAndUpdate(filter, update, { runValidators: true, upsert: true });

        if (lastCoordinate.status === 'case' && moment(currentDate).diff(moment(previousDate), 'days') === 0) {
          const { lat, lon } = req.body;
          handleGoogleApiWithRetry(lat, lon, lastCoordinate, req.user._id);
        }

        await session.commitTransaction();
        session.endSession();
        return Messages.SUCCESS.CASES.ENDING_CORDINATES;
      }
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      let msg: any = {};
      msg.code = 401;
      msg.message = error.message;
      return msg;
    }
  }
  public async formData(req: any, res: any) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const { lat, lon } = req.body;
      if (!(lat && lon)) return Messages.Failed.CASES.CORDINATES;

      const date = getDateTime();
      const todaysDate = moment(getDateTime()).utc().set({ hour: 0, minute: 0, second: 0, millisecond: 0 });

      const condition = []
      condition.push(
        {
          $match: {
            $and: [
              {
                _id: new mongoose.Types.ObjectId(req.body.id)
              },
              {
                acceptedBy: new mongoose.Types.ObjectId(req.user._id)
              },
              {
                fieldExecutiveId: new mongoose.Types.ObjectId(req.user._id)
              },
              {
                stage: {
                  $nin: [
                    'manager',
                    'supervisor',
                    'submited',
                    'senior-supervisor'
                  ]
                }
              }
            ]
          }
        }
      )
      const [caseData]: any = await caseModel.aggregate(condition);

      if (caseData && req.user.role === 'field-executive') {
        const { fieldExecutive: { assignedDate = null, acceptedDate = null, name = null } = {}, fileNo, applicantName, addressType, address, bank, product } = caseData;
        const fieldExecutive = { assignedDate, acceptedDate, submittedDate: date, name };
        const submittedCases = { submittedDate: date, assignedDate, acceptedDate, fileNo, applicantName, addressType, address, bank, product, caseId: caseData._id };
        const coordinateObj = { status: 'case', lat_long: [lon, lat], date, caseId: caseData._id }

        const objectToBeUpdate = await validateReviewData(req, caseData);

        if (objectToBeUpdate.code === 401) {
          await session.abortTransaction();
          session.endSession();
          return objectToBeUpdate;
        }

        objectToBeUpdate.dateVisit = date;
        objectToBeUpdate.fieldExecutive = fieldExecutive;
        objectToBeUpdate.stage = caseData.supervisorId ? 'supervisor' : 'manager';
        const logs = { message: `case submitted by fieldExecutive (${req.user.fullName}) on date ${moment(date).utc().format('YYYY-MM-DD HH:mm:ss')}` };

        const checkFieldExecutive = await feCoordinatesModel.findOne({ fieldExecutiveId: req.user._id, date: todaysDate }).session(session);
        const lastCoordinate = checkFieldExecutive?.coordinates?.[checkFieldExecutive.coordinates.length - 1];
        if (!lastCoordinate || !['on', 'case'].includes(lastCoordinate.status)) return Messages.Failed.CASES.DAY_ON_OFF_SUBMIT;


        const updateCaseData: any = await caseModel.findOneAndUpdate({ _id: req.body.id }, { $set: objectToBeUpdate, $push: { logs: logs } }, { new: true }).session(session);

        if (updateCaseData) {
          const filter1 = { date: todaysDate, fieldExecutiveId: req.user._id };
          const update1 = { $push: { coordinates: coordinateObj } };
          await feCoordinatesModel.findOneAndUpdate(filter1, update1, { runValidators: true, upsert: true }).session(session);

          const filter2 = { date: todaysDate, fieldExecutiveId: req.user._id };
          const update2 = { $push: { submittedCases: submittedCases } };
          await feSubmittedCasesModel.findOneAndUpdate(filter2, update2, { runValidators: true, upsert: true }).session(session);
          handleGoogleApiWithRetry(lat, lon, lastCoordinate, req.user._id);
          await session.commitTransaction();
          session.endSession();



          const findAdminPromise = adminModel.findOne();
          const findManagerPromise = managerModel.findOne();
          const findSupervisorPromise = supervisorModel.findOne();
          const findSeniorSupervisorPromise = seniorSupervisorModel.findOne();

          Promise.all([
            findAdminPromise,
            findManagerPromise,
            findSupervisorPromise,
            findSeniorSupervisorPromise
          ]).then(([findAdmin, findManager, findSupervisor, findSeniorSupervisor]) => {
            const managerToken = findManager?.fireBaseToken ?? [];
            const seniorSupervisorToken = findSupervisor?.fireBaseToken ?? [];
            const supervisorToken = findSeniorSupervisor?.fireBaseToken ?? [];
            const adminToken = findAdmin?.fireBaseToken ?? [];
            const tokenArray = managerToken.concat(seniorSupervisorToken, supervisorToken, adminToken);
            const message = `field-executive:${req.user.fullName}, FileNo:${updateCaseData.fileNo},MobileNo:${updateCaseData.mobileNo},ApplicantName:${updateCaseData.applicantName},AddressType:${updateCaseData.addressType}`;
            const identify = 'submit';
            const data = {};
            sendNotification(tokenArray, message, data, identify);
          });


          return Messages.SUCCESS.UPDATED_SUCCESSFULLY;
        } else {
          await session.abortTransaction();
          session.endSession();
          return Messages.Failed.CASES.CASE_NOT_FOUND;
        }
      } else {
        await session.abortTransaction();
        session.endSession();
        return Messages.Failed.CASES.CASE_NOT_FOUND;
      }
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      let msg: any = {};
      msg.code = 401;
      msg.message = error.message;
      return msg;
    }
  }
  public async submitedCases(req: any, res: any) {
    try {
      let date2: any
      let date1: any
      if (req.body.date1 && !req.body.date2) {
        date1 = moment(req.body.date1).format('YYYY/MM/DD')
        date2 = moment(moment(date1).format('YYYY/MM/DD')).add(1, 'days').format('YYYY/MM/DD')
        let dateDiff = moment(date2).diff(moment(date1), 'days')
        if (dateDiff > 90) return Messages.Failed.MOBILE_SUBMITED_CASE_DATE
      };
      if (req.body.date1 && req.body.date2) {
        date1 = moment(req.body.date1).format('YYYY/MM/DD')
        date2 = moment(moment(req.body.date2).format('YYYY/MM/DD')).add(1, 'days').format('YYYY/MM/DD')
        let dateDiff = moment(date2).diff(moment(date1), 'days')
        if (dateDiff > 90) {
          return Messages.Failed.MOBILE_SUBMITED_CASE_DATE
        }
      };
      if (!req.body.date1 && !req.body.date2) {
        date1 = moment(moment(Date.now()).format('YYYY/MM/DD')).subtract(3, 'months').format('YYYY/MM/DD')
        date2 = moment(moment(Date.now()).format('YYYY/MM/DD')).add(1, 'days').format('YYYY/MM/DD')
      };
      let condition = []
      let page
      if (req.body.page) {
        page = req.body.page
      } else {
        return Messages.Failed.SOMETHING_WENT_WRONG
      }
      const limit = 50
      const skipValue = req.body.page > 1 ? limit * (page - 1) : 0
      condition.push(
        {
          $facet: {
            data: [
              {
                '$match': {
                  'fieldExecutiveId': new mongoose.Types.ObjectId(`${req.user._id}`)
                }
              },
              {
                '$unwind': {
                  'path': '$submittedCases',
                  'preserveNullAndEmptyArrays': true
                }
              },
              {
                '$sort': {
                  'submittedCases.submittedDate': -1
                }
              },
              {
                '$project': {
                  'submittedCases': 1
                }
              },
              {
                '$match': {
                  'submittedCases.submittedDate': {
                    $gte: new Date(moment(date1).format('YYYY-MM-DD')),
                    $lte: new Date(moment(date2).format('YYYY-MM-DD'))
                  }
                }
              },
              {
                $skip: skipValue
              },
              {
                $limit: limit
              },
              {
                '$group': {
                  '_id': null,
                  'submittedCases': {
                    '$push': '$submittedCases'
                  }
                }
              }
            ],
            totalCases: [
              {
                '$match': {
                  'fieldExecutiveId': new mongoose.Types.ObjectId(`${req.user._id}`)
                }
              },
              {
                '$unwind': {
                  'path': '$submittedCases',
                  'preserveNullAndEmptyArrays': true
                }
              },
              {
                '$sort': {
                  'submittedCases.submittedDate': -1
                }
              },
              {
                '$project': {
                  'submittedCases': 1
                }
              },
              {
                '$match': {
                  'submittedCases.submittedDate': {
                    $gte: new Date(moment(date1).format('YYYY-MM-DD')),
                    $lte: new Date(moment(date2).format('YYYY-MM-DD'))
                  }
                }
              },
              {
                $count: 'totalCases'
              }
            ]
          }
        },
        {
          $unwind: {
            path: '$data'
          }
        },
        {
          $unwind: {
            path: '$totalCases'
          }
        }
      )
      let showCases: any = await feSubmittedCasesModel.aggregate(condition)

      if (showCases) {
        if (showCases.length > 0 && showCases[0].data) {
          for (let i = 0; i < showCases[0].data.submittedCases.length; i++) {

            if (showCases[0].data.submittedCases[i].assignedDate && typeof showCases[0].data.submittedCases[i].assignedDate === 'object') {
              showCases[0].data.submittedCases[i].assignedDate = moment(showCases[0].data.submittedCases[i].assignedDate).utc().format('DD/MM/YYYY @ HH:mm:ss')
            }
            if (showCases[0].data.submittedCases[i].acceptedDate && typeof showCases[0].data.submittedCases[i].acceptedDate === 'object') {
              showCases[0].data.submittedCases[i].acceptedDate = moment(showCases[0].data.submittedCases[i].acceptedDate).utc().format('DD/MM/YYYY @ HH:mm:ss')
            }
          }
        }
        Messages.SUCCESS.MOBILE_SUBMITED_CASES.data.totalCases = showCases[0] ? showCases[0].totalCases.totalCases : 0
        Messages.SUCCESS.MOBILE_SUBMITED_CASES.data.currentPage = page
        Messages.SUCCESS.MOBILE_SUBMITED_CASES.data.limit = limit
        Messages.SUCCESS.MOBILE_SUBMITED_CASES.data.cases = showCases[0] ? showCases[0].data.submittedCases : []
        return Messages.SUCCESS.MOBILE_SUBMITED_CASES
      } else {
        return Messages.Failed.SOMETHING_WENT_WRONG
      }
    } catch (error) {
      let msg: any = {}
      msg.code = 401
      msg.message = error.message
      return msg
    }
  }
  public async logoutData(req: any, res: any) {
    try {
      let deleteToken = await fieldExecutiveModel.findOneAndUpdate(
        { _id: req.user._id },
        { $unset: { fireBaseToken: '' } }
      )
      return Messages.SUCCESS.MOBILE_LOGOUT
    } catch (error) {
      let msg: any = {}
      msg.code = 401
      msg.message = error.message
      return msg
    }
  }
}
export default apiFieldExecutiveService


async function handleGoogleApiWithRetry(lat: number, lon: number, lastCoordinate: any, id: any,) {
  try {
    const origins = `${lastCoordinate?.lat_long[1]},${lastCoordinate?.lat_long[0]}`;
    const destinations = `${lat},${lon}`;
    const apiKey = process.env.GOOGLE_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origins}&destinations=${destinations}&key=${apiKey}`;
    const response = await axios.get(url);
    const data = response.data;
    if (data.status === 'OK') {
      const newDate = moment(lastCoordinate.date).utc().set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
      const distance: any = parseFloat((data.rows[0].elements[0].distance.value)) / 1000;
      const filter = { date: newDate, fieldExecutiveId: id };
      const update = { $inc: { distance: distance }, fieldExecutiveId: id, date: newDate };
      await feDistanceModel.findOneAndUpdate(filter, update, { upsert: true });
    } else {
      console.error('Google API Error:', data);
    }
  } catch (error) {
    console.error('Error in handleGoogleApi:', error);
  }
}
