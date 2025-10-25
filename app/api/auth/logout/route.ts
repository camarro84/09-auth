// import { NextResponse } from "next/server";
// import { cookies } from "next/headers";
// import { api } from "../../api";
// import { isAxiosError } from "axios";
// import { logErrorResponse } from "../../_utils/utils";

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const apiRes = await api.post("/auth/login", body, {
//       withCredentials: true,
//     });

//     const setCookies = apiRes.headers["set-cookie"];
//     if (!setCookies) {
//       return NextResponse.json({ error: "Tokens not found" }, { status: 401 });
//     }

//     // ✅ НЕ await
//     const cookieStore = cookies(); // ResponseCookies

//     for (const cookieString of Array.isArray(setCookies)
//       ? setCookies
//       : [setCookies]) {
//       const [nameValue] = cookieString.split(";");
//       const [name, value] = nameValue.split("=");

//       cookieStore.set(name, value, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === "production",
//         sameSite: "lax",
//         path: "/",
//       });
//     }

//     // 🔹 Серверний редірект після login
//     return NextResponse.redirect(new URL("/profile", req.url));
//   } catch (error) {
//     if (isAxiosError(error)) {
//       logErrorResponse(error.response?.data);
//       return NextResponse.json(
//         { error: error.message, response: error.response?.data || null },
//         { status: error.response?.status || 500 }
//       );
//     }
//     logErrorResponse({ message: (error as Error).message });
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }

// import { NextResponse } from "next/server";

// export async function POST() {
//   const res = NextResponse.json({ message: "Logged out" });

//   // 🔹 Видаляємо куки
//   res.cookies.delete("accessToken");
//   res.cookies.delete("refreshToken");

//   // 🔹 Редірект на логін
//   res.headers.set("Location", "/sign-in");
//   return new NextResponse(null, { status: 302, headers: res.headers });
// }

import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const response = NextResponse.redirect(new URL('/sign-in', req.url))
  const isProd = process.env.NODE_ENV === 'production'

  response.cookies.set({
    name: 'accessToken',
    value: '',
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    path: '/',
    maxAge: 0,
  })

  response.cookies.set({
    name: 'refreshToken',
    value: '',
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    path: '/',
    maxAge: 0,
  })

  return response
}
