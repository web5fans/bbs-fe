import AuthUserLogged from "@/components/AuthUserLogged";

export default function Layout({
   children,
 }: {
  children: React.ReactNode
}) {
  return <AuthUserLogged>
    {children}
  </AuthUserLogged>
}