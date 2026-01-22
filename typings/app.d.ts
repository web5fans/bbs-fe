/// <reference types="react" />

type NextRequest = import("next/server").NextRequest
type NextResponse<Body = unknown> = import("next/server").NextResponse<Body>

declare namespace App {

  type Middleware = (request: NextRequest) => NextResponse | void;

  declare type Language = "en"; // "zh" | 

  type Params = Promise<{
    locale: Language
  }>

  type Entry<P = {}> = React.FC<React.PropsWithChildren<P & { params: Params }>>

  declare type Layout<P = {}> = Entry<P>

}