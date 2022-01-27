import transporter from './emailConfig';

const sendUpdateEmail = (email) => {
  console.log('email update', email);
  const mailOptions = {
    to: email,
    from: `Sendbox ${process.env.SENDER_EMAIL}`,
    subject: 'Parcel Delivery Order Update',
    generateTextFromHTML: true,
    html: `<div className="email" style="
        padding: 20px;
        font-family: sans-serif;
        line-height: 1.5;
        font-size: 16px;
      ">
      <h3>Hello Customer, </h3>
        Your parcel delivery order has been updated
        <br>
        <br>
        Thank you
        <br>
        <br>
        <div>Sendbox Team<div>
      </div>`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    console.log('email uodate ', error, info);
    if (error || info === 'undefined') {
      return { 'error sending update': error };
    }
    return { message: info.response };
  });
};
export default sendUpdateEmail;
