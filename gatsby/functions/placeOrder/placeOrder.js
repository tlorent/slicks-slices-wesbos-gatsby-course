const nodemailer = require('nodemailer');

function generateOrderEmail({ order, total }) {
  return `
    <div>
      <h2>Your Recent Order for ${total}</h2>
      <p>We will have your order ready in the next 20 mins.</p>
      <ul>
        ${order
          .map(
            (item) => `
          <li>
            <img src="${item.thumbnail}" alt="${item.name}"/>
            ${item.size} ${item.name} - ${item.price}
          </li>
        `
          )
          .join('')}
      </ul>
      <p>Your total is <strong>${total}</strong> due at pickup</p>
      <style>
          ul {
            list-style: none;
          }
      </style>
    </div>
  `;
}

// create a transport for nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: 587,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

function wait(ms = 0) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms);
  });
}

exports.handler = async (event, context) => {
  const body = JSON.parse(event.body);

  // check if the stroop has been filled in
  if (body.stroop) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Boop beep bop goodbye! 127163' }),
    };
  }

  // Validate data coming in
  const requiredFields = ['email', 'name', 'order'];

  // why for of? because forEach creates a new function scope
  // and you can't return from within forEach like we have to do here.
  for (const field of requiredFields) {
    if (!body[field]) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: `Oops! You are missing the ${field} field`,
        }),
      };
    }
  }

  // make sure they actually have items in that order
  if (!body.order.length) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Why would you order nothing?!',
      }),
    };
  }

  // send the email
  const info = await transporter.sendMail({
    from: 'Slicks Slices <slick@example.com>',
    to: `${body.name} ${body.email}, orders@example.com`,
    subject: 'New order!',
    html: generateOrderEmail({ order: body.order, total: body.total }),
  });
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Success' }),
  };
};
