require('dotenv').config()
const nodemailer = require('nodemailer');

class MailService{

	#transport;

	constructor(){
		// connection
		try {
			const connectionOPTs ={
				host: process.env.SMTP_HOST,
				port: process.env.SMTP_PORT,
				// service:"gmail",
				auth: {
					user: process.env.SMTP_USERNAME,
					pass: process.env.SMTP_PASSWORD
				}
				
			}
			
			if(process.env.SMTP_PROVIDER === "gmail"){
				connectionOPTs['service'] = "gmail"
			}
			
			this.#transport = nodemailer.createTransport(connectionOPTs)


		} catch (exception) {
			console.log(exception);
			console.log("error connecting SMTP server");
			// process.exit(1)
			throw{status:500, message:"Error connecting to smtp server", detail: exception}
		}
	}

	sendEmail = async ({to,subject,message,attachments=null}) =>{
		try {
			const msgOpt = {
				to : to,
				from : process.env.SMTP_FROM,
				subject : subject,
				html : message
				
			};

			if (attachments){
				// needs absolute file path
				msgOpt['attachments'] = attachments
			}
			await this.#transport.sendMail(msgOpt)
			return true

		} catch (exception) {
			console.log(exception);
			console.log("error sending email");
			// process.exit(1)
			throw{status:500, message:"error sending email", detail: exception}
		}
	}

}

const mailsvc = new MailService()

module.exports = mailsvc