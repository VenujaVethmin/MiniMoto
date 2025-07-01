import { NextResponse } from "next/server";

export async function middleware(request) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const url = new URL(request.url);
  const currentPath = url.pathname;

  // Get token from cookies
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  try {
    // Verify token with backend
    const res = await fetch(`${backendUrl}/api/protected`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status !== 200) {
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }

    const userData = await res.json();
   

    if (!userData.role) {
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }

   
    
    // Admin route protection
    if (currentPath.startsWith("/admin")) {
      if (userData.role!== "ADMIN") {
        return unauthorizedResponse(
          "Access denied. Admin privileges required."
        );
      }
    }

   

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    // Redirect to signin on any error
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }
}

// Helper function for 403 error response
function unauthorizedResponse(message) {
  return new NextResponse(
    `
    <html>
      <head>
        <title>Unauthorized Access - MiniMoto</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, #fee2e2 0%, #ffffff 100%);
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            padding: 20px;
          }
          .container {
            background: #fff;
            padding: 40px;
            border-radius: 16px;
            text-align: center;
            max-width: 400px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            border: 1px solid #fecaca;
          }
          .logo {
            width: 48px;
            height: 48px;
            background: linear-gradient(135deg, #dc2626, #ef4444);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            color: white;
            font-weight: bold;
            font-size: 20px;
          }
          h1 {
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 16px;
            color: #dc2626;
          }
          p {
            font-size: 16px;
            color: #666;
            margin-bottom: 24px;
          }
          .buttons {
            display: flex;
            justify-content: center;
            gap: 12px;
            flex-wrap: wrap;
          }
          button, .button-link {
            padding: 10px 20px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            border: none;
            text-decoration: none;
            display: inline-block;
            transition: all 0.2s;
          }
          .back-button {
            background: #f3f4f6;
            color: #374151;
          }
          .back-button:hover {
            background: #e5e7eb;
          }
          .login-button {
            background: linear-gradient(135deg, #dc2626, #ef4444);
            color: white;
          }
          .login-button:hover {
            background: linear-gradient(135deg, #b91c1c, #dc2626);
          }
          .home-button {
            background: #6b7280;
            color: white;
          }
          .home-button:hover {
            background: #4b5563;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">MM</div>
          <h1>Access Denied</h1>
          <p>${message}</p>
          <div class="buttons">
            <button class="back-button" onclick="history.back()">Go Back</button>
            <a href="/" class="button-link home-button">Home</a>
            <a href="/auth/signin" class="button-link login-button">Sign In</a>
          </div>
        </div>
      </body>
    </html>`,
    {
      status: 403,
      headers: { "Content-Type": "text/html" },
    }
  );
}

export const config = {
  matcher: ["/admin/:path*"],
};
