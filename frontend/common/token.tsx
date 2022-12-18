import { createContext, ReactNode, useContext, useState } from "react"

// @ts-ignore
const TokenContext = createContext<[string | null, Dispatch<SetStateAction<string | null>>]>();

interface Props {
  children: ReactNode,
}
export function TokenContextProvider({ children }: Props) {
  const token = useState<string|null>(null);
  return (
    <TokenContext.Provider value={token}>
      {children}
    </TokenContext.Provider>
  )
}

export function useToken() {
  const token = useContext(TokenContext);
  return token;
}