import { google } from "googleapis";
import { NextResponse } from "next/server";

const SPREADSHEET_ID = "1u8Ov0NQa4gH25XtfdGCg-QtRha11sjw2kXtzR0xwV7k";

const SHEETS = [
  "AIPCA",
  "CHILD PSYCOLOGY",
];

const normalize = (v: unknown): string => {
  return String(v ?? "").trim();
};

export async function POST(req: Request) {
  try {
    const { seatNo, password } = await req.json();

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL!,
        private_key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
      },
      scopes: [
        "https://www.googleapis.com/auth/spreadsheets.readonly",
      ],
    });

    const sheetsApi = google.sheets({
      version: "v4",
      auth,
    });

    const inputSeat = normalize(seatNo).padStart(3, "0");
    const inputPass = normalize(password);

    for (const sheetName of SHEETS) {
      const result = await sheetsApi.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${sheetName}!A:D`,
      });

      const rows = result.data.values || [];

      for (let i = 1; i < rows.length; i++) {
        const seat = normalize(rows[i][0]).padStart(3, "0");
        const pass = normalize(rows[i][1]);

        const studentName = rows[i][2];
        const folderUrl = rows[i][3];

        if (seat === inputSeat && pass === inputPass) {
          return NextResponse.json({
            success: true,
            studentName,
            folderUrl,
            course: sheetName,
          });
        }
      }
    }

    return NextResponse.json({
      success: false,
      message: "Invalid Seat Number or Password",
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return NextResponse.json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Server error",
    });
  }
}
