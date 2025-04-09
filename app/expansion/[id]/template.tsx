import { ReactNode } from "react"

export default function ExpansionTemplate({ children }: { children: ReactNode }) {
  return (
    <div className="transition-all duration-300 ease-in-out">
      {children}
    </div>
  )
}
