import { createContext, useState } from "react";
export const RouteContext = createContext();

export const RouteProvider = ({children}) => {
    const [routeData, setRouteData] = useState({ 
        startTime: null,
        startPoint: null,
        endPoint: null,
      blocks: [], // waypoint blocks of 10
        endTime: null,
    })
    return (
        <RouteContext.Provider value={{routeData, setRouteData}}>
        {children}
        </RouteContext.Provider>
    )
}