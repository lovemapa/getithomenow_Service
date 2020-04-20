const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const sgTransport = require('nodemailer-sendgrid-transport');
const crypto = require('crypto');
const apiUrl = 'http://3.21.83.36:8081';
// const apiUrl = 'http://localhost:8081';
const smtpEmail = 'getithomenow@gmail.com';
const smtpPass = 'Farmer@2345';

const FCM = require("fcm-node");
const serverKey = "AIzaSyD7QbU83dWivM5qiPSPRlYwuHWhx4AWMsc"; //put your server key here
const fcm = new FCM(serverKey);


function encrypt(text) {
  const cipher = crypto.createCipher(algorithm, secretKey);
  let crypted = cipher.update(text, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
}
function decrypt(text) {
  const decipher = crypto.createDecipher(algorithm, secretKey);
  let dec = decipher.update(text, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
}
class commonController {
  handleValidation(err) {
    const messages = []
    for (let field in err.errors) { return err.errors[field].message; }
    return messages;
  }
  authTokenGenerate(userId) {
    return jwt.sign({ username: userId },
      'someSecretText'
    );
  }
  async generateHashEmail(email) {
    const hash = await encrypt(email);
    return hash;
  }
  async compareHashEmail(email) {
    const decryptedEmail = await decrypt(email);
    return decryptedEmail;
  }

  sendMail(email, _id, token, type, cb) {

    var route;
    if (type == 'admin')
      route = 'admin'
    else
      route = 'user'
    var html, subject
    if (_id == undefined || token == undefined) {
      subject = 'Account verifciation'
      html = `<p><a href=${apiUrl}/api/${route}/verify/>Click this link to verfiy</a></p>`
    }
    else {
      subject = 'Request for Change Password'
      html = `<p><a href=${apiUrl}/api/${route}/forgetpassword/?token=${token}&user=${_id}>click here to change password</a></p>`

    }
    var smtpConfig = {
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // use SSL
      auth: {
        user: smtpEmail,
        pass: smtpPass
      }
    };
    const transporter = nodemailer.createTransport(smtpConfig);
    const mailOptions = {
      from: smtpEmail, // sender address
      to: email, // list of receivers
      subject: subject, // Subject line
      html: html

    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log('email sending failed ' + error);
        cb({ status: 0, message: error })
      }
      else {
        cb({ status: 1, message: info })

      }
      transporter.close();
    });
  }

  sendConsultMail(email, name, message, contact, cb) {


    var html, subject
    subject = `Consultancy Request/${name}`
    html = `<html>

<head>
  <meta name="viewport" content="width=device-width">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <style>
    @font-face {
      font-family: "Graphik";
      font-weight: 500;
      src: url(https://cdn-s3.headout.com/assets/fonts/Graphik-Medium-Web.eot?#iefix);
      src: url(https://cdn-s3.headout.com/assets/fonts/Graphik-Medium-Web.eot?#iefix) format("eot"), url(https://cdn-s3.headout.com/assets/fonts/Graphik-Medium-Web.woff2) format("woff2"), url(https://cdn-s3.headout.com/assets/fonts/Graphik-Medium-Web.woff) format("woff");
    }

    @font-face {
      font-family: "Graphik";
      font-weight: 400;
      src: url(https://cdn-s3.headout.com/assets/fonts/Graphik-Regular-Web.eot?#iefix);
      src: url(https://cdn-s3.headout.com/assets/fonts/Graphik-Regular-Web.eot?#iefix) format("eot"), url(https://cdn-s3.headout.com/assets/fonts/Graphik-Regular-Web.woff2) format("woff2"), url(https://cdn-s3.headout.com/assets/fonts/Graphik-Regular-Web.woff) format("woff");
    }

    @font-face {
      font-family: "Graphik";
      font-weight: 300;
      src: url(https://cdn-s3.headout.com/assets/fonts/Graphik-Light-Web.eot?#iefix);
      src: url(https://cdn-s3.headout.com/assets/fonts/Graphik-Light-Web.eot?#iefix) format("eot"), url(https://cdn-s3.headout.com/assets/fonts/Graphik-Light-Web.woff2) format("woff2"), url(https://cdn-s3.headout.com/assets/fonts/Graphik-Light-Web.woff) format("woff");
    }

    @media only screen and (max-width: 620px) {
      table[class=body] h1 {
        font-size: 28px !important;
        margin-bottom: 10px !important;
      }

      table[class=body] p,
      table[class=body] ul,
      table[class=body] ol,
      table[class=body] td,
      table[class=body] span,
      table[class=body] a {
        font-size: 16px !important;
      }

      table[class=body] .wrapper,
      table[class=body] .article {
        padding: 10px !important;
      }

      table[class=body] .content {
        padding: 0 !important;
      }

      table[class=body] .container {
        padding: 0 !important;
        width: 100% !important;
      }

      table[class=body] .main {
        border-left-width: 0 !important;
        border-radius: 0 !important;
        border-right-width: 0 !important;
      }

      table[class=body] .btn table {
        width: 100% !important;
      }

      table[class=body] .btn a {
        width: 100% !important;
      }

      table[class=body] .img-responsive {
        height: auto !important;
        max-width: 100% !important;
        width: auto !important;
      }
    }

    @media all {
      .ExternalClass {
        width: 100%;
      }

      .ExternalClass,
      .ExternalClass p,
      .ExternalClass span,
      .ExternalClass font,
      .ExternalClass td,
      .ExternalClass div {
        line-height: 100%;
      }
    }
  </style>
</head>

<body class=""
  style="background-color: #f6f6f6; font-family: Graphik, 'Proxima Nova', 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; font-size: 16px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">
  <table border="0" cellpadding="0" cellspacing="0" class="body"
    style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background-color: #f6f6f6;">
    <tbody>
      <tr>
        <td
          style="font-family: Graphik, 'Proxima Nova', 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; vertical-align: top;">
          &nbsp;</td>
        <td class="container"
          style="font-family: Graphik, 'Proxima Nova', 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; vertical-align: top; display: block; Margin: 0 auto; max-width: 640px; padding: 10px; width: 640px;">
          <div class="content"
            style="box-sizing: border-box; display: block; Margin: 0 auto; max-width: 640px; padding: 10px;">

            <!-- START CENTERED WHITE CONTAINER -->
            <span class="preheader"
              style="color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;">This
              is preheader text. Some clients will show this text as a preview.</span>
            <table class="main"
              style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background: #ffffff; border-radius: 3px;">

              <!-- START MAIN CONTENT AREA -->
              <tbody>


                <!-- HELLO SECION -->
                <tr>
                  <td class="wrapper" colspan=3
                    style="font-family: Graphik, 'Proxima Nova', 'Helvetica Neue', Helvetica, Arial, sans-serif;font-size: 16px;vertical-align: top;box-sizing: border-box;padding: 20px;padding-bottom: 0;">
                    <table border="0" cellpadding="0" cellspacing="0"
                      style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
                      <tbody>
                        <tr>
                          <td colspan="3" style="text-align: center; "><img
                              src="http://3.21.83.36:8081/mainLogo%20copy.png" style="padding-bottom: 50px;" alt="">
                          </td>
                        </tr>

                        <tr>
                          <td colspan="2"
                            style="font-family: Graphik, 'Proxima Nova', 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; vertical-align: top; width: 75%;">
                            <p
                              style="font-family: Graphik, 'Proxima Nova', 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; font-weight: normal; margin: 0; Margin-bottom: 15px;">
                              Hi Everette</p>

                          </td>
                          <td style="vertical-align: top;width: 25%;text-align: right;">

                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td colspan=3
                    style="font-family: Graphik, 'Proxima Nova', 'Helvetica Neue', Helvetica, Arial, sans-serif;font-size: 16px;vertical-align: top;box-sizing: border-box;padding: 20px;padding-top: 0;">
                    <p
                      style="font-family: Graphik, 'Proxima Nova', 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; font-weight: normal; margin: 0;">
                      <span style="color: #ec1943; font-weight: bold"> ${name} </span> has requested for free
                      consultancy </p>
                  </td>
                </tr>


                <!-- LINE BREAK 1 -->
                <tr>
                  <td colspan="3" style="padding: 0 20px;padding-bottom: 15px">
                    <p style=" padding-bottom: 20px; border-bottom: 1px solid #dadada;"></p>
                  </td>
                </tr>

                <!-- QUICK INFO SECIONT -->
                <tr>
                  <td
                    style="width: 33%; padding-left: 20px;font-family: Graphik, 'Proxima Nova', 'Helvetica Neue', Helvetica, Arial, sans-serif;font-size: 16px;vertical-align: top;box-sizing: border-box;border-right: 1px solid #dadada;">
                    <p
                      style="font-family: Graphik, 'Proxima Nova', 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; font-weight: bold; margin: 0; Margin-bottom: 10px;">
                      Email</p>
                    <p
                      style="font-family: Graphik, 'Proxima Nova', 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; font-weight: normal; margin: 0; ">
                      ${email}</p>

                  </td>
                  <td
                    style="width: 33%;font-family: Graphik, 'Proxima Nova', 'Helvetica Neue', Helvetica, Arial, sans-serif;font-size: 16px;vertical-align: top;box-sizing: border-box;border-right: 1px solid #dadada;">
                    <p
                      style="padding-left: 20px;font-family: Graphik, 'Proxima Nova', 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; font-weight: bold; margin: 0; Margin-bottom: 10px;">
                      Contact </p>
                    <p
                      style="padding-left: 20px;font-family: Graphik, 'Proxima Nova', 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; font-weight: normal; margin: 0; ">
                      ${contact}</p>

                  </td>
                  

                </tr>






                <!-- LINE BREAK 7-->
                <tr>
                  <td colspan="3" style="padding: 0 20px;padding-bottom: 15px">
                    <p style=" padding-bottom: 15px; border-bottom: 1px solid #dadada;"></p>
                  </td>
                </tr>

                <tr>
                  <td colspan=3
                    style="font-family: Graphik, 'Proxima Nova', 'Helvetica Neue', Helvetica, Arial, sans-serif;font-size: 16px;vertical-align: top;box-sizing: border-box;padding: 20px;padding-top: 0;">
                    <p
                      style="font-family: Graphik, 'Proxima Nova', 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; font-weight: bold; margin: 0; Margin-bottom: 10px;">
                      Message</p>
                    <p
                      style="font-family: Graphik, 'Proxima Nova', 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; font-weight: normal; margin: 0; ">
                      ${message}</p>
                  </td>
                </tr>



                <!-- END MAIN AREA -->
              </tbody>
            </table>

            <!-- START FOOTER -->
            <div class="footer" style="clear: both; Margin-top: 10px; text-align: center; width: 100%;">

              <table align="center" border="0" cellpadding="0" cellspacing="0">
                <tbody>
                  <tr>
                    <td colspan=2 style="padding-top: 25px;"></td>
                  </tr>
                  <tr align="center">
                    <td>
                      <img src="https://cdn-imgix-open.headout.com/emails/appstore-icon/appstore.png" alt=""
                        style="height: 40px;">
                    </td>
                    <td>
                      <img src="https://cdn-imgix-open.headout.com/emails/appstore-icon/playstore.png" alt=""
                        style="height: 47px;">
                    </td>
                  </tr>

                  <tr>
                    <td align="center" colspan="2">
                      <span
                        style="padding-top:20px ; display: block; font-family: Graphik, 'Proxima Nova', 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #545454; line-height: 20px; font-weight: 400; font-size: 12px;">With
                        <span style="color: #ec1943">❤</span>
                        from Headout</span> <span
                        style="display: block; font-family: Graphik, 'Proxima Nova', 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #545454; line-height: 20px; font-weight: 400; font-size: 12px; padding-bottom: 10px;">500
                        7th Avenue, Floor 17A, New York NY</span>
                    </td>
                  </tr>

                  <tr>
                    <td align="center" class="padding-outer" colspan="2">
                      <span
                        style="display: block; font-family: Graphik, 'Proxima Nova', 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #545454; line-height: 20px; font-weight: 400; font-size: 12px; padding-bottom: 10px;"><a
                          href="mailto:hi@headout.com"
                          style="text-decoration:none;color:#545454;"><strong>hi@headout.com</strong></a> | <a
                          href="tel:+13478970100" style="text-decoration:none;color:#545454;"><strong>+1 347 897
                            0100</strong></a>.</span>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2">
                      <table align="center" border="0" cellpadding="0" cellspacing="0">
                        <tbody>
                          <tr>
                            <td align="right">
                              <a href="https://www.facebook.com/headoutapp"><img alt="facebook-circle-inverse.png"
                                  border="0" height="35"
                                  src="https://s3.amazonaws.com/tourlandish/assets/images/emails/social/facebook-circle.png"
                                  style="display:block; padding-right: 12px;"></a>
                            </td>
                            <td align="center">
                              <a href="https://twitter.com/Headout_App"><img alt="twitter-circle-inverse.png" border="0"
                                  height="35"
                                  src="https://s3.amazonaws.com/tourlandish/assets/images/emails/social/twitter-circle.png"
                                  style="display:block; padding-left: 12px; padding-right: 12px;"></a>
                            </td>
                            <td align="left">
                              <a href="https://www.instagram.com/headoutapp"><img alt="instagram-circle-inverse.png"
                                  border="0" height="35"
                                  src="https://s3.amazonaws.com/tourlandish/assets/images/emails/social/instagram-circle.png"
                                  style="display:block; padding-left: 12px;"></a>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td colspan=2 align="center"
                      style="padding-top: 15px;font-family:Graphik, 'Proxima Nova', 'Helvetica Neue', Helvetica, Arial, sans-serif;color:#545454;line-height:20px;font-weight:400;font-size:12px; margin-bottom: 30px;"
                      valign="top"> Don't want to receive such emails?
                      <a href="#" style="color:#1155cc !important;">Unsubscribe</a>
                      <br></td>
                  </tr>
                </tbody>
            </div>
            <!-- END FOOTER -->

            <!-- END CENTERED WHITE CONTAINER -->
          </div>
        </td>
        <td
          style="font-family: Graphik, 'Proxima Nova', 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; vertical-align: top;">
          &nbsp;</td>
      </tr>
    </tbody>
  </table>

</body>

</html>
            `


    var smtpConfig = {
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // use SSL
      auth: {
        user: smtpEmail,
        pass: smtpPass
      }
    };
    const transporter = nodemailer.createTransport(smtpConfig);
    const mailOptions = {
      from: email, // sender address
      to: "getithomenow@gmail.com", // list of receivers
      subject: subject, // Subject line
      html: html,

    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log('email sending failed ' + error);
        cb({ status: 0, message: error })
      }
      else {
        cb({ status: 1, message: info })

      }
      transporter.close();
    });
  }

  sendInvitation(email, influencer, referal, cb) {

    let subject = `Coupanda invitation`
    let html = `Hi <b>${email}</b> you are invited by <b>${influencer}</b>.You can user referral code <b>${referal}</b> `

    var smtpConfig = {
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // use SSL
      auth: {
        user: smtpEmail,
        pass: smtpPass
      }
    };
    const transporter = nodemailer.createTransport(smtpConfig);
    const mailOptions = {
      from: smtpEmail, // sender address
      to: email, // list of receivers
      subject: subject, // Subject line
      html: html

    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log('email sending failed ' + error);
        cb({ status: 0, message: error })
      }
      else {
        cb({ status: 1, message: info })

      }
      transporter.close();
    });
  }

  sendMailandVerify(email, _id, token, type, cb) {

    var route;
    if (type == 'advertise')
      route = 'advertise'
    else
      route = 'influncer'
    var html, subject

    subject = 'Account verifciation'
    html = `<p><a href=${apiUrl}/api/${route}/verify/?token=${token}&user=${_id}>Click this link to verfiy</a></p>`

    var smtpConfig = {
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // use SSL
      auth: {
        user: smtpEmail,
        pass: smtpPass
      }
    };
    const transporter = nodemailer.createTransport(smtpConfig);
    const mailOptions = {
      from: smtpEmail, // sender address
      to: email, // list of receivers
      subject: subject, // Subject line
      html: html

    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log('email sending failed ' + error);
        cb({ status: 0, message: error })
      }
      else {
        cb({ status: 1, message: info })

      }
      transporter.close();
    });
  }

  notification(message) {
    return new Promise((resolve, reject) => {
      fcm.send(message, function (err, response) {
        if (err) {
          console.log("Something has gone wrong!", err);
          return reject(err);
        } else {
          resolve(response);
        }
      });
    });
  }

}

module.exports = new commonController()