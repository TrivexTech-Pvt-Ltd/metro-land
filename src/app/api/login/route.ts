import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    // Resolve the path to users.json
    const filePath = path.join(process.cwd(), "src", "app", "data", "users.json");
    
    // Read and parse the users.json file
    const fileContent = await fs.readFile(filePath, "utf-8");
    const users = JSON.parse(fileContent);

    // Find the user matching username and password
    const user = users.find(
      (u: any) =>
        u.username.toLowerCase() === username.toLowerCase() &&
        u.password === password
    );

    if (!user) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    // Return user details without password
    return NextResponse.json({
      success: true,
      user: {
        username: user.username,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
