import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
    const url = request.nextUrl.clone()
    let isLogin =request.cookies.get("uid")

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
 
  
}