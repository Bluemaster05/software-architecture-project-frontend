import { createContext, useState, type ReactNode } from "react";
import { AppContextType } from "../types/AppContext";
import { sampleChats } from "../../Messages/sampleData/messagesSampleData";
import User from "../types/user.interface";
const AppContext = createContext<AppContextType>({
    activeMessagesChatId: null,
    setActiveMessagesChatId: () => {},
    user: null,
    setUser: () => {}
});

export function AppContextProvider({ children }: { children: ReactNode }) {
    const [activeMessagesChatId, setActiveMessagesChatId] = useState<string | null>(sampleChats[0].id.toString());
    const [user, setUser] = useState<User | null>(null);

    return (
        <AppContext value={{ activeMessagesChatId, setActiveMessagesChatId, user, setUser }}>
            {children}
        </AppContext>
    );
}

export default AppContext;