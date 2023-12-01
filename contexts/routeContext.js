import { createContext, useState } from "react";
export const RouteContext = createContext();

export const RouteProvider = ({children}) => {
    const [routeData, setRouteData] = useState({ 
        startTime: null,
        startPoint: null,
        endPoint: null,
      points: [], // waypoint blocks of 10
        endTime: null,
        region:null
    })
    return (
        <RouteContext.Provider value={{routeData, setRouteData}}>
        {children}
        </RouteContext.Provider>
    )
}