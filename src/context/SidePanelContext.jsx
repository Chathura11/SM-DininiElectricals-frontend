import React, { useContext, useState } from "react"


const SidePanelContext = React.createContext()

export function useSidePanel() {
    return useContext(SidePanelContext)
}

export const SidePanelProvider = ({ children }) => {

    const [sidePanelOpen,setSidePanelOpen] = useState(false)
    const [sidePanelContent,setSidePanelContent] = useState(<div>NOT INIT</div>)
    const [sidePanelTitle,setSidePanelTitle] = useState('undefined')
    

    function openSidePanel(title,content){
        setSidePanelTitle(title)
        setSidePanelContent(content)
        setSidePanelOpen(true)
    }

    function closeSidePanel(){
        setSidePanelOpen(false)
    }

    return (
        <SidePanelContext.Provider value={{
            openSidePanel,
            closeSidePanel,
            setSidePanelOpen,
            sidePanelContent,
            sidePanelOpen,
            sidePanelTitle,
        }}>
            {children}
        </SidePanelContext.Provider>
    )
}