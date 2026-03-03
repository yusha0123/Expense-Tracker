export const authStorage = {
    getToken: () => localStorage.getItem("access_token"),

    setToken: (token: string) =>
        localStorage.setItem("access_token", token),

    clear: () => localStorage.removeItem("access_token"),
};