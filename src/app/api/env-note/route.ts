import { NextResponse } from "next/server";

const MAX_NOTE_LENGTH = 1000;

export async function POST(
  request: Request
) {
  try {
    const body = await request.json();

    const note =
      typeof body?.note === "string"
        ? body.note.trim()
        : "";

    if (!note) {
      return NextResponse.json(
        { message: "Empty variable." },
        { status: 400 }
      );
    }

    if (note.length > MAX_NOTE_LENGTH) {
      return NextResponse.json(
        { message: "Variable is too long." },
        { status: 400 }
      );
    }

    const apiKey =
      process.env.RESEND_API_KEY;

    const to =
      process.env.BITANDINK_CONTACT_EMAIL;

    const from =
      process.env.RESEND_FROM_EMAIL;

    if (!apiKey || !to || !from) {
      console.error(
        "Missing env-note email configuration."
      );

      return NextResponse.json(
        {
          message:
            "Private channel is not configured.",
        },
        { status: 500 }
      );
    }

    const response = await fetch(
      "https://api.resend.com/emails",
      {
        method: "POST",
        headers: {
          Authorization:
            `Bearer ${apiKey}`,
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          from,
          to: [to],
          subject:
            "[bitandink .env] new private variable",
          text: [
            "A visitor left a private variable.",
            "",
            "SECRET_NOTE=",
            note,
            "",
            "// sent from bitandink playground",
          ].join("\n"),
        }),
      }
    );

    if (!response.ok) {
      const errorText =
        await response.text();

      console.error(
        "Resend error:",
        errorText
      );

      return NextResponse.json(
        { message: "Transmission failed." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      ok: true,
    });
  } catch (error) {
    console.error(
      "env-note error:",
      error
    );

    return NextResponse.json(
      { message: "Transmission failed." },
      { status: 500 }
    );
  }
}
