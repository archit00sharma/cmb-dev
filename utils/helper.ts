import config from "config";
import moment from "moment";
import aws, { S3 } from "aws-sdk";
import { isEmpty } from "class-validator";
import { ServiceConfigurationOptions } from "aws-sdk/lib/service";
import jimp from 'jimp'
import fs from 'fs'



class Helper {

	async getSignedUrlAWS(
		fileName: any,
		signedUrlExpireSeconds: number = 60 * 60
	) {
		if (!fileName || (fileName && fileName.length === 0)) return "";
		const serviceConfigOptions: ServiceConfigurationOptions = {
			region: config.get("awsS3.bucketRegion"),
			endpoint: new aws.Endpoint(config.get("awsS3.secretEndPoint")),
			accessKeyId: config.get("awsS3.accessKeyId"),
			secretAccessKey: config.get("awsS3.secretAccessKey"),
			signatureVersion: "v4",
		};
		const s3 = new aws.S3(serviceConfigOptions);
		const url = s3.getSignedUrl("getObject", {
			Bucket: config.get("awsS3.bucketName"),
			Key: fileName,
			Expires: signedUrlExpireSeconds,
		});
		return url;
	}

	async putSignedUrlAWS(
		fileName: any,
		signedUrlExpireSeconds: number = 60 * 60
	) {
		if (!fileName || (fileName && fileName.length === 0)) return "";
		const serviceConfigOptions: ServiceConfigurationOptions = {
			region: config.get("awsS3.bucketRegion"),
			endpoint: new aws.Endpoint(config.get("awsS3.secretEndPoint")),
			accessKeyId: config.get("awsS3.accessKeyId"),
			secretAccessKey: config.get("awsS3.secretAccessKey"),
			signatureVersion: "v2",
		};
		const s3 = new aws.S3(serviceConfigOptions);
		const url = s3.getSignedUrl("putObject", {
			Bucket: config.get("awsS3.bucketName"),
			Key: fileName,
			Expires: signedUrlExpireSeconds,
		});
		return url;
	}

	async deleteObjectAWS(fileName: any) {
		const serviceConfigOptions: ServiceConfigurationOptions = {
			region: config.get("awsS3.bucketRegion"),
			// endpoint: new aws.Endpoint(config.get("awsS3.secretEntPoint")),
			accessKeyId: config.get("awsS3.accessKeyId"),
			secretAccessKey: config.get("awsS3.secretAccessKey"),
			signatureVersion: "v4",
		};

		const s3 = new aws.S3(serviceConfigOptions);

		s3.deleteObject(
			{
				Bucket: config.get("awsS3.bucketName"),
				Key: fileName,

			},
			(err, data) => {
				if (err) {
					console.log("error occured", err);
					return false
				} else {
					console.log("deleted>>>>>>>>>>")
					return true;
				}
			}
		);
	}

	async addWaterMark(fileName: String, data: any) {

		let s1 = fileName.substring(fileName.lastIndexOf("/") + 1);
		s1.trim();
		let uploadpath = `public/temp/${s1}`
		try {
			// let uploadpath = `public/temp/${fileName}`
			let readUrl: any = await this.getSignedUrlAWS(fileName)

			// let writeUrl: any = await this.putSignedUrlAWS(fileName)
			const image = await jimp.read(readUrl)
			const font = await jimp.loadFont(jimp.FONT_SANS_32_BLACK);
			image.print(font, 10, 350, "all copyrights by meeeeeeeee")
			await image.writeAsync(uploadpath)
			const serviceConfigOptions: ServiceConfigurationOptions = {
				region: config.get("awsS3.bucketRegion"),
				endpoint: new aws.Endpoint(config.get("awsS3.secretEndPoint")),
				accessKeyId: config.get("awsS3.accessKeyId"),
				secretAccessKey: config.get("awsS3.secretAccessKey"),
				// signatureVersion: "v2",
			};

			const s3 = new aws.S3(serviceConfigOptions);
			var stream = fs.createReadStream(uploadpath);
			s3.putObject(
				{
					Bucket: config.get("awsS3.bucketName"),
					Key: `${fileName}`,
					Body: stream,
					ContentEncoding: 'base64',
				},
				(err, data) => {
					fs.unlinkSync(uploadpath)
					if (err) {
						console.log("error occured", err);
						return false
					} else {
						console.log("dataaaaaaaaa", data)
						return true;
					}
				}
			);
		}
		catch (err) {
			console.log("errr", err)

		}



	}

}


export default Helper;