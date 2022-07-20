exports.sendEmailTemp = async (OTP) => {
    const html = `<!DOCTYPE html>
  <html
    lang="en"
    xmlns="http://www.w3.org/1999/xhtml"
    xmlns:o="urn:schemas-microsoft-com:office:office"
  >
                          <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <meta name="x-apple-disable-message-reformatting" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link
        href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600&display=swap"
        rel="stylesheet"
      />
      <style>
        body {
          font-family: "Open Sans", sans-serif;
        }
        p,
        a {
          font-size: 18px;
        }
        main {
          padding:0 2rem;
        }
      </style>
    </head>
    <body style="margin: 0; padding: 0">
      <div style="background: #eab221">
      </div>
      <main>
        <h1 style="text-align: center; font-size: 25px;">Welcome!</h1>
        <p>Your Otp is <b>${OTP}</b></p>
       
      
        <p>
          Cheers, <br />
          The Car Hire Team
        </p>
      </main>
      <div style="background: #390535">
        <p style="color: #ffffff; text-align: center; padding: 2rem ">
          Need more help? <br />We are
          <a href="#3" style="color: #eab221">here</a>, ready to talk.
        </p>
      </div>
    </body>
    </html>`;
    return html;
};
