const storagePrefix = "daniel_starter_";

const storage = {
  getToken: (): any => {
    return JSON.parse(
      window.localStorage.getItem(`${storagePrefix}token`) as string
    );
  },
  setToken: (token: string): void => {
    window.localStorage.setItem(`${storagePrefix}token`, JSON.stringify(token));
  },
  clearToken: (): void => {
    window.localStorage.removeItem(`${storagePrefix}token`);
  },
};

export default storage;
