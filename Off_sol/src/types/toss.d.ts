export { };

declare global {
    interface Window {
        appLogin?: () => Promise<{ authorizationCode: string; referrer: string }>;
        Toss?: {
            login: () => Promise<any>;
            close: () => void;
        };
    }
    const Toss: {
        login: () => Promise<any>;
        close: () => void;
    };
}
