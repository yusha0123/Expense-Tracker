const emailTemplate = `
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
  <html lang="en">
    <div
      id="__react-email-preview"
      style="
        display: none;
        overflow: hidden;
        line-height: 1px;
        opacity: 0;
        max-height: 0;
        max-width: 0;
      "
    >
      Reset your password
    </div>

    <body style="background-color: #f6f9fc; padding: 10px 0">
      <table
        align="center"
        role="presentation"
        cellspacing="0"
        cellpadding="0"
        border="0"
        width="100%"
        style="
          max-width: 37.5em;
          background-color: #ffffff;
          border: 1px solid #f0f0f0;
          padding: 45px;
        "
      >
        <tr style="width: 100%">
          <td>
            <table
              align="center"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              width="100%"
              style="font-family: sans-serif"
            >
              <tbody>
                <tr>
                  <td>
                    <p
                      style="
                        font-size: 16px;
                        line-height: 26px;
                        margin: 16px 0;
                        font-weight: 300;
                        color: #404040;
                      "
                    >
                      Hi There,
                    </p>
                    <p
                      style="
                        font-size: 16px;
                        line-height: 26px;
                        margin: 16px 0;
                        font-weight: 300;
                        color: #404040;
                      "
                    >
                      Someone recently requested a password change for your
                      Expensify account. If this was you, you can set a new
                      password here:
                    </p>
                    <a
                      href="{SERVER_ADDRESS_PLACEHOLDER}/reset-password?token={UUID_PLACEHOLDER}"
                      target="_blank"
                      style="
                        background-color: #007ee6;
                        border-radius: 4px;
                        color: #fff;
                        font-size: 15px;
                        text-decoration: none;
                        text-align: center;
                        display: inline-block;
                        width: 210px;
                        padding: 0px 0px;
                        line-height: 100%;
                        max-width: 100%;
                      "
                      ><span></span
                      ><span
                        style="
                          background-color: #007ee6;
                          border-radius: 4px;
                          color: #fff;
                          font-size: 15px;
                          text-decoration: none;
                          text-align: center;
                          display: inline-block;
                          width: 210px;
                          padding: 14px 7px;
                          max-width: 100%;
                          line-height: 120%;
                          text-transform: none;
                        "
                        >Reset password</span
                      ><span></span
                    ></a>
                    <p
                      style="
                        font-size: 16px;
                        line-height: 26px;
                        margin: 16px 0;
                        font-weight: 300;
                        color: #404040;
                      "
                    >
                      If you don't want to change your password or didn't request
                      this, just ignore and delete this message.
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
`;

module.exports = emailTemplate;
