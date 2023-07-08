import { createContext, ReactNode, useContext, useEffect, useState } from "react"

// @ts-ignore
const TokenContext = createContext<[string | null, Dispatch<SetStateAction<string | null>>]>();

function getTokenFromSession() {
  const token = sessionStorage.getItem("token");
  return token || null;
}

interface Props {
  children: ReactNode,
}
export function TokenContextProvider({ children }: Props) {
  const token = useState<string|null>(null);

  useEffect(() => {
    if (window) {
      token[1](getTokenFromSession)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (token[0]) {
      sessionStorage.setItem("token", token[0])
    }
  }, [token])

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