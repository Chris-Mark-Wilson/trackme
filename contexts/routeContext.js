import { createContext, useState } from "react";
export const RouteContext = createContext();

export const RouteProvider = ({children}) => {
    const [routeData, setRouteData] = useState({ 
        startTime: null,
        startPoint: null,
        endPoint: null,
      points: [], // waypoints {latitude, longitude, timestamp}
        endTime: null,
        region:null
    })
    return (
        <RouteContext.Provider value={{routeData, setRouteData}}>
        {children}
        </RouteContext.Provider>
    )
}