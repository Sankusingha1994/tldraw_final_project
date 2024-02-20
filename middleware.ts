import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
    const url = request.nextUrl.clone()
    let isLogin =request.cookies.get("uid")
    console.log(isLogin)

    if(!isLogin){
        if(request.nextUrl.pathname.startsWith("/draw")){
            return NextResponse.rewrite(new URL("/login", request.url))
        }
    }
    if(!isLogin){
    
            if(request.nextUrl.pathname.startsWith("/dashboard")){
                return NextResponse.rewrite(new URL("/login", request.url))
            }
    }

    return NextResponse.next()
}


// export function middleware(request: NextRequest) {
//     const has_token = request.cookies.get("uid");
  
//     const { pathname } = request.nextUrl;
  
//     if (has_token === undefined || has_token === null) {
//       request.nextUrl.pathname = "/login";
//       return NextResponse.redirect(request.nextUrl);
//     } else {
//       return NextResponse.next();
//     }
//   }
  
//   export const config = {
//     matcher: ["/dashboard", "/draw"]
//   };
