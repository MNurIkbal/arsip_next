import { NextResponse, NextRequest } from "next/server";
import { jwtVerify } from "jose";

export function Auth(handler: Function, allowedRoles?: string[]) {
  return async (req: NextRequest, ...args: any) => {
    try {
      const token = 
        req.headers.get("authorization")?.split(" ")[1] || 
        req.cookies.get("token")?.value;

      if (!token) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }

      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);

      // Cek Role jika dibatasi
      if (allowedRoles && !allowedRoles.includes(payload.role as string)) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      }

      // Teruskan payload ke handler
      return handler(req, payload, ...args);
    } catch (error) {
      return NextResponse.json({ message: "Invalid Token" }, { status: 401 });
    }
  };
}