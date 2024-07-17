import Header from "@/components/header";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}
