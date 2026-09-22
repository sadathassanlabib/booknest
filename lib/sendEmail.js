import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPasswordResetEmail({
  email,
  name,
  resetUrl,
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: [email],
      subject: "Reset your BookNest password",

      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0"
            />
            <title>Reset Password - BookNest</title>
          </head>

          <body
            style="
              margin: 0;
              padding: 0;
              background-color: #101D23;
              font-family: Arial, Helvetica, sans-serif;
              color: #EDE6D6;
            "
          >
            <div
              style="
                max-width: 600px;
                margin: 40px auto;
                padding: 20px;
              "
            >

              <!-- Card -->
              <div
                style="
                  background-color: #17262D;
                  border: 1px solid rgba(255,255,255,0.08);
                  border-radius: 20px;
                  padding: 35px;
                "
              >

                <!-- Logo -->
                <div
                  style="
                    width: 50px;
                    height: 50px;
                    line-height: 50px;
                    text-align: center;
                    border-radius: 12px;
                    background-color: #EDE6D6;
                    color: #101D23;
                    font-size: 15px;
                    font-weight: 800;
                    margin-bottom: 25px;
                  "
                >
                  BN
                </div>

                <!-- Heading -->
                <h1
                  style="
                    margin: 0 0 12px;
                    font-size: 28px;
                    line-height: 1.3;
                    color: #EDE6D6;
                  "
                >
                  Reset your password
                </h1>

                <!-- Greeting -->
                <p
                  style="
                    margin: 0 0 20px;
                    color: #AEB8B4;
                    font-size: 15px;
                    line-height: 1.7;
                  "
                >
                  Hello ${name || "there"},
                </p>

                <!-- Message -->
                <p
                  style="
                    margin: 0 0 25px;
                    color: #AEB8B4;
                    font-size: 15px;
                    line-height: 1.7;
                  "
                >
                  We received a request to reset your
                  BookNest password.
                  Click the button below to create a new password.
                </p>

                <!-- Button -->
                <a
                  href="${resetUrl}"
                  style="
                    display: inline-block;
                    padding: 14px 22px;
                    background-color: #EDE6D6;
                    color: #101D23;
                    text-decoration: none;
                    border-radius: 10px;
                    font-size: 14px;
                    font-weight: 700;
                  "
                >
                  Reset Password
                </a>

                <!-- Expiry -->
                <p
                  style="
                    margin: 25px 0 0;
                    color: #899692;
                    font-size: 13px;
                    line-height: 1.6;
                  "
                >
                  This password reset link will expire
                  in 15 minutes.
                </p>

                <!-- Security note -->
                <div
                  style="
                    margin-top: 30px;
                    padding-top: 20px;
                    border-top: 1px solid rgba(255,255,255,0.08);
                  "
                >
                  <p
                    style="
                      margin: 0;
                      color: #697873;
                      font-size: 12px;
                      line-height: 1.6;
                    "
                  >
                    If you did not request a password reset,
                    you can safely ignore this email.
                  </p>
                </div>

              </div>

              <!-- Footer -->
              <p
                style="
                  margin: 20px 0 0;
                  text-align: center;
                  color: #596762;
                  font-size: 12px;
                "
              >
                © BookNest. All rights reserved.
              </p>

            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error("RESEND_EMAIL_ERROR:", error);

      return {
        success: false,
        error,
      };
    }

    console.log(
      "PASSWORD_RESET_EMAIL_SENT:",
      data?.id
    );

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("SEND_EMAIL_ERROR:", error);

    return {
      success: false,
      error,
    };
  }
}