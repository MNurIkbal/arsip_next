import { validateUserLogin } from "@/app/services/AuthService";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const { user, token } = await validateUserLogin(email, password);

    const response = NextResponse.json({
      message: "Login berhasil",
      user,
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (error: any) {
    const status = error.message === "User tidak ditemukan" || error.message === "Password salah" ? 401 : 500;
    
    return NextResponse.json(
      { message: error.message || "Terjadi kesalahan server" },
      { status }
    );
  }
}