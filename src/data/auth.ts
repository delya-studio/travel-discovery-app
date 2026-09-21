import AsyncStorage from "@react-native-async-storage/async-storage";

export type User = {
  name: string;
  email: string;
  password: string;
};

const USER_KEY = "@tryple_user";
const LOGGED_USER_KEY = "@tryple_logged_user";

export const registerUser = async (user: User) => {
  const existingUser = await AsyncStorage.getItem(USER_KEY);

  if (existingUser) {
    throw new Error("Já existe uma conta cadastrada.");
  }

  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  await AsyncStorage.setItem(
    LOGGED_USER_KEY,
    JSON.stringify({
      name: user.name,
      email: user.email,
    }),
  );
};

export const loginUser = async (email: string, password: string) => {
  const storedUser = await AsyncStorage.getItem(USER_KEY);

  if (!storedUser) {
    throw new Error("Nenhuma conta cadastrada.");
  }

  const user: User = JSON.parse(storedUser);

  if (user.email !== email || user.password !== password) {
    throw new Error("E-mail ou senha incorretos.");
  }

  await AsyncStorage.setItem(
    LOGGED_USER_KEY,
    JSON.stringify({
      name: user.name,
      email: user.email,
    }),
  );

  return {
    name: user.name,
    email: user.email,
  };
};

export const getLoggedUser = async () => {
  const storedUser = await AsyncStorage.getItem(LOGGED_USER_KEY);

  if (!storedUser) {
    return null;
  }

  return JSON.parse(storedUser);
};

export const logoutUser = async () => {
  await AsyncStorage.removeItem(LOGGED_USER_KEY);
};

export const hasRegisteredUser = async () => {
  const user = await AsyncStorage.getItem(USER_KEY);

  return user !== null;
};

export const updateUser = async (updatedData: {
  name: string;
  email: string;
}) => {
  const storedUser = await AsyncStorage.getItem(USER_KEY);

  if (!storedUser) {
    throw new Error("Nenhuma conta cadastrada.");
  }

  const user: User = JSON.parse(storedUser);

  const updatedUser: User = {
    ...user,
    name: updatedData.name,
    email: updatedData.email,
  };

  await AsyncStorage.setItem(USER_KEY, JSON.stringify(updatedUser));

  const loggedUser = await AsyncStorage.getItem(LOGGED_USER_KEY);

  if (loggedUser) {
    await AsyncStorage.setItem(
      LOGGED_USER_KEY,
      JSON.stringify({
        name: updatedUser.name,
        email: updatedUser.email,
      }),
    );
  }
};