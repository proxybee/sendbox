import transporter from './emailConfig';

const postNewsletter = (req, res) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: process.env.EMAIL_TO,
    subject: `${req.body.name} Newsletter!`,
    generateTextFromHTML: true,
    html: `<div className="email" style="
        border: 1px solid black;
        padding: 20px;
        font-family: sans-serif;
        line-height: 2;
        font-size: 20px;
      ">
        <p>Hi ${req.body.username}, </p>
          ${req.body.title}
          ${req.body.image}
          ${req.body.message}
          ${req.body.disclaimer}
          </div>
          \n\n
          <a href="${process.env.FRONTEND_URL}/unsubscribe?useToken=${req.param.token}">Click Here to Unsubscribe</a>
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

export default postNewsletter;
