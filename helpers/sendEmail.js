const nodemailer=require("nodemailer");
require("dotenv");

const {META_PASSWORD}=process.env;

const nodemailerConfig={
  host: "smtp.gmail.com",
  port: 587, 
  secure: false, 
  auth:{
    user:"majornasya@gmail.com",
    pass:META_PASSWORD,
  }
}
const transport=nodemailer.createTransport(nodemailerConfig);

const sendEmail=async(data)=>{
    const email={...data, from:{address:"majornasya@gmail.com", name:"Anastasia"}}
    await transport.sendMail(email);
    return true;
}

module.exports={sendEmail};
