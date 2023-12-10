import { createContext, useState } from "react";
export const SettingContext= createContext();
export const SettingProvider = ({children}) => {
    const [interval, setInterval] = useState(1000);
    const [isRecording, setIsRecording] = useState(false);
    return (
        <SettingContext.Provider value={{
            interval, setInterval,
            isRecording, setIsRecording
        }}>
        {children}
        </SettingContext.Provider>
    )
}