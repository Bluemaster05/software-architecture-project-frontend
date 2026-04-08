import { createContext, useState, type ReactNode } from "react";
import { AppContextType } from "../types/AppContext";
import { sampleChats } from "../../Messages/sampleData/messagesSampleData";
const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppContextProvider({ children }: { children: ReactNode }) {
    const [activeMessagesChatId, setActiveMessagesChatId] = useState<string | null>(sampleChats[0].id.toString());

    return (
        <AppContext value={{ activeMessagesChatId, setActiveMessagesChatId }}>
            {children}
        </AppContext>
    );
}

export default AppContext;