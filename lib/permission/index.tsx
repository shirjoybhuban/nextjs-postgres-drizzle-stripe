import { createContext, ReactNode, useContext, useMemo } from "react"

// Define the shape of the context
type PermissionsContextType = {
  permissions: string[]
  hasPermission: (module: string, action: string) => boolean
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(
  undefined
)

export const usePermissions = () => {
  const context = useContext(PermissionsContext)
  if (!context) {
    throw new Error("usePermissions must be used within a PermissionsProvider")
  }
  return context
}

export const PermissionsProvider = ({
  children,
  permissions,
}: {
  children: ReactNode
  permissions: string[]
}) => {
  // const hasPermission = (module: string, action: string) =>
  //   permissions.includes(module + "_" + action)

  function hasPermission(module: string, action: string) {
    let checkPermission = useMemo(
      () => permissions.includes(module + "_" + action),
      [module, action]
    )
    return checkPermission
  }
  return (
    <PermissionsContext.Provider value={{ permissions, hasPermission }}>
      {children}
    </PermissionsContext.Provider>
  )
}
