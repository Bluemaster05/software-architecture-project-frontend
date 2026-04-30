import User from "./user.interface";

export interface AppContextType {
    activeMessagesChatId: string | null;
    setActiveMessagesChatId: React.Dispatch<React.SetStateAction<string | null>>;
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
}