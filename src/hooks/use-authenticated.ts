import { useOutletContext } from "react-router";

export function useAuthState() {
  return useOutletContext<{ setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>, isAuthenticated: boolean }>()
}