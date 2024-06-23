import { NextRequest, NextResponse } from "next/server";
import { writeFile, readFile, unlink } from "fs/promises";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file") as File;

  console.log("Backend route reached");

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const tempFilePath = path.join("/tmp", file.name);
  const outputFilePath = path.join("/tmp", `anonymized_${file.name}`);

  try {
    // Save the uploaded file
    await writeFile(tempFilePath, buffer);

    // Use ExifTool to remove metadata (you need to install ExifTool on your server)
    await execAsync(`exiftool -all= -overwrite_original ${tempFilePath}`);

    // Rename the processed file
    await execAsync(`mv ${tempFilePath} ${outputFilePath}`);

    // Read the processed file
    const anonymizedBuffer = await readFile(outputFilePath);

    // Clean up
    await unlink(outputFilePath);

    // Send the processed file back to the client
    return new NextResponse(anonymizedBuffer, {
      headers: {
        "Content-Disposition": `attachment; filename="anonymized_${file.name}"`,
        "Content-Type": file.type,
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "File processing failed" }, { status: 500 });
  }
}
