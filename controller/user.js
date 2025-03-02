const User = require("../model/user");
const Firm = require("../model/firm");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const { validationResult } = require("express-validator");

// employee

exports.getAddEmployee=async(req,res)=>{
    const firms = await User.findById(req.user._id).lean().populate('firms','name').exec();
    res.render('admin/addEmployee',{pageTitle:'Add Employee',firms:firms.firms});
}

exports.postAddEmployee= async(req,res)=>{
  // return res.send(req.body);
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(422).json({
        success: false,
        dataEntered: false,
        errorMessage: errors.array()[0].msg,
      });
    }
    // Token Generation
    let Token;
     await crypto.randomBytes(32, (err, buffer) => {
      Token=buffer.toString("hex");
    });
    const hashPassword = await bcrypt.hash(req.body.password, 12);
    const firms=[req.body.firmId];
    const data={
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashPassword,
      contact: req.body.contact,
      address:{
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        pincode: req.body.pincode,
        country: req.body.country,
      },
      firms:firms,
      typeOfUser: "Employee",
      Token,
    }
    console.log(data)

    const user = await User.create(data);

    console.log(user);

    // Send Email Containing Token
    const msg = {
      to: req.body.email,
      from: "goyalparas063@gmail.com",
      subject: "Email Verification",
      html: `<!doctype html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
          <title>Simple Transactional Email</title>
          <style>
      @media only screen and (max-width: 620px) {
        table.body h1 {
          font-size: 28px !important;
          margin-bottom: 10px !important;
        }
      
        table.body p,
      table.body ul,
      table.body ol,
      table.body td,
      table.body span,
      table.body a {
          font-size: 16px !important;
        }
      
        table.body .wrapper,
      table.body .article {
          padding: 10px !important;
        }
      
        table.body .content {
          padding: 0 !important;
        }
      
        table.body .container {
          padding: 0 !important;
          width: 100% !important;
        }
      
        table.body .main {
          border-left-width: 0 !important;
          border-radius: 0 !important;
          border-right-width: 0 !important;
        }
      
        table.body .btn table {
          width: 100% !important;
        }
      
        table.body .btn a {
          width: 100% !important;
        }
      
        table.body .img-responsive {
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
      
        .apple-link a {
          color: inherit !important;
          font-family: inherit !important;
          font-size: inherit !important;
          font-weight: inherit !important;
          line-height: inherit !important;
          text-decoration: none !important;
        }
      
        #MessageViewBody a {
          color: inherit;
          text-decoration: none;
          font-size: inherit;
          font-family: inherit;
          font-weight: inherit;
          line-height: inherit;
        }
      
        .btn-primary table td:hover {
          background-color: #34495e !important;
        }
      
        .btn-primary a:hover {
          background-color: #34495e !important;
          border-color: #34495e !important;
        }
      }
      </style>
        </head>
        <body style="background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">
          <span class="preheader" style="color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;">Hi ${req.body.firstName},</span>
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f6f6f6; width: 100%;" width="100%" bgcolor="#f6f6f6">
            <tr>
              <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;" valign="top">&nbsp;</td>
              <td class="container" style="font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; max-width: 580px; padding: 10px; width: 580px; margin: 0 auto;" width="580" valign="top">
                <div class="content" style="box-sizing: border-box; display: block; margin: 0 auto; max-width: 580px; padding: 10px;">
      
                  <!-- START CENTERED WHITE CONTAINER -->
                  <table role="presentation" class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background: #ffffff; border-radius: 3px; width: 100%;" width="100%">
      
                    <!-- START MAIN CONTENT AREA -->
                    <tr>
                      <td class="wrapper" style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;" valign="top">
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;" width="100%">
                          <tr>
                            <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;" valign="top">
                              <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;">Hi there,</p>
                              <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;">We're happy you Signed Up Buzzinga. To start exploring the Buzzinga app, Please confirm your email address.</p>
                              <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; box-sizing: border-box; width: 100%;" width="100%">
                                <tbody>
                                  <tr>
                                    <td align="left" style="font-family: sans-serif; font-size: 14px; vertical-align: top; padding-bottom: 15px;" valign="top">
                                      <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: auto;">
                                        <tbody>
                                          <tr>
                                            <td style="font-family: sans-serif; font-size: 14px; vertical-align: top; border-radius: 5px; text-align: center; background-color: #3498db;" valign="top" align="center" bgcolor="#3498db"> <a href="localhost/verify/${Token}" target="_blank" style="border: solid 1px #3498db; border-radius: 5px; box-sizing: border-box; cursor: pointer; display: inline-block; font-size: 14px; font-weight: bold; margin: 0; padding: 12px 25px; text-decoration: none; text-transform: capitalize; background-color: #3498db; border-color: #3498db; color: #ffffff;">Verify now</a> </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 5px;">Welcome to Buzzinga!</p>
                              <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;">The Buzzinga Team.</p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
      
                  <!-- END MAIN CONTENT AREA -->
                  </table>
                </div>
              </td>
            </tr>
          </table>
        </body>
      </html>`,
    };
    sgMail.send(msg);
    console.log('email sent');

    res.status(200).json({
      success: true,
      dataEntered: true,
    });
}
