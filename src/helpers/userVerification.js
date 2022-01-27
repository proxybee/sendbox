import transporter from './emailConfig';

const postUserVerification = (req, res) => {
  console.log('in verification', req.user);
  const token = 1;
  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: req.email,
    subject: 'Account Verification Token!',
    generateTextFromHTML: true,
    html: `<div className="email" style="
        border: 1px solid black;
        padding: 20px;
        font-family: sans-serif;
        line-height: 2;
        font-size: 20px;
      ">
        <h3>Hello ${req.user}, </h3>
        <br>
        <p>Thank you for registering on sendbox, to activate and enable you use your account, please verify your email by clicking the following link:https://${req.headers.host}/confirmation/${token.token}</p>
        \n\n Thank you 
        <br>
        <p>Sendbox Team</p>
          `,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.json({ error: true });
    }
    return res.json({
      done: true,
      message: info.response,
    });
  });
};

export default postUserVerification;
