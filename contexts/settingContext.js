import { createContext, useState } from "react";
export const SettingContext= createContext();
export const SettingProvider = ({children}) => {
    const[interval, setInterval] = useState(1000);
    return (
        <SettingContext.Provider value={{interval, setInterval}}>
        {children}
        </SettingContext.Provider>
    )
}