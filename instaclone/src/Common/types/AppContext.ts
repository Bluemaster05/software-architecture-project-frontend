export interface AppContextType {
    activeMessagesChatId: string | null;
    setActiveMessagesChatId: React.Dispatch<React.SetStateAction<string | null>>;
}