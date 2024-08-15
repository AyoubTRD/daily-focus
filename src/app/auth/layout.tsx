export default async function AuthLayout(props: { children: React.ReactNode }) {
  return (
    <main className="container mx-auto flex flex-col items-center py-8">{props.children}</main>
  )
}
