import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { name, email, message, service } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email and message are required." },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: "Lumière Website <onboarding@resend.dev>",
      to: "sayor8543@gmail.com",
      replyTo: email,
      subject: `New enquiry from ${name}${service ? ` — ${service}` : ""}`,
      html: `
        <div style="font-family: monospace; max-width: 600px; padding: 40px;">
          <p style="font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase;
                     color: #999; margin-bottom: 32px;">
            Lumière — New Contact Enquiry
          </p>

          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee;
                          font-size: 11px; color: #999; width: 100px;">
                Name
              </td>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee;
                          font-size: 14px; color: #0a0a0a;">
                ${name}
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee;
                          font-size: 11px; color: #999;">
                Email
              </td>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee;
                          font-size: 14px; color: #0a0a0a;">
                ${email}
              </td>
            </tr>
            ${service ? `
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee;
                          font-size: 11px; color: #999;">
                Service
              </td>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee;
                          font-size: 14px; color: #0a0a0a; text-transform: capitalize;">
                ${service}
              </td>
            </tr>
            ` : ""}
            <tr>
              <td style="padding: 12px 0; font-size: 11px; color: #999;
                          vertical-align: top;">
                Message
              </td>
              <td style="padding: 12px 0; font-size: 14px; color: #0a0a0a;
                          line-height: 1.7;">
                ${message.replace(/\n/g, "<br>")}
              </td>
            </tr>
          </table>
        </div>
      `,
    });

    if (error) {
      console.error("❌ Resend error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data?.id });

  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}