const nodemailer = require("nodemailer")


  const sendEmail = async (email,text) => {
 try{

//  create Transporter


    const transporter = nodemailer.createTransport({
        service:"gmail",
        auth:{
             user: process.env.NODE_MAILER, // 👈 apni Gmail likho
        pass: process.env.NODE_PASS            
        }
    })
 
      // Mail options
    const mailOption= {
       from: `"Zomato Verify" <${process.env.NODE_MAILER}>`,
        to:email,
        subject:"Verification OTP.",       
       html: `<p><b>${text}</b></p>`

    };
    const info = await transporter.sendMail(mailOption)
    console.log('Email sent:', info.response)
       return { success: true, message: 'Email sent successfully', info};

 }catch(err){
console.error(' Email sending failed:', err)
return {success:false,error:err.message}
 }




  }

  module.exports = sendEmail