import type { Metadata, Viewport } from "next";
import "./globals.scss";
import fontVariables from "@/app/fonts";
import { userAgent } from "next/server";
import { headers } from "next/headers";
import MainContent from "@/components/MainContent";
import { LayoutProvider } from "@/provider/layoutProvider";
import { PublicEnvScript } from "next-runtime-env";
import { RegisterPopUpProvider } from "@/provider/RegisterPopUpProvider";
import RegisterLogin from "@/app/register-login";
import { ToastProvider } from "../provider/toast";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export const metadata: Metadata = {
  title: "BBS",
};

type LayoutParallels = 'header' | 'footer'

const RootLayout = async (props: any) => {
  const { header } = props;
  const headersData = await headers();
  const { device } = userAgent({ headers: headersData })
  const isMobile = device.type === 'mobile'

  return (
    <html lang="cn" style={{ visibility: "hidden" }}>
      <head>
        <PublicEnvScript />
      </head>
      <body
        className={fontVariables}
      >
        <LayoutProvider>
          <ToastProvider>
            <MainContent>
              <RegisterPopUpProvider>
                {header}
                <main
                  style={{
                    flex: 1,
                    display: 'grid',
                  }}
                >
                  {props.children}
                </main>

                <RegisterLogin />
              </RegisterPopUpProvider>
            </MainContent>
          </ToastProvider>

        </LayoutProvider>
      </body>
    </html>
  );
}

export default RootLayout
