import React, { createContext, useState, useEffect, useContext } from "react";
import Loading from "../components/Loading";
import * as auth from "../services/auth";
import { useToast } from "@chakra-ui/react";

interface ILoginData {
  email: string;
  password: string;
}

interface IUser {
  _id: string;
  name: string;
}

interface IAuthContextData {
  signed: boolean;
  loading: boolean;
  user: IUser | null;
  signIn(data: ILoginData): Promise<void>;
  signOut(): void;
}

const AuthContext = createContext<IAuthContextData>({} as IAuthContextData);

type Props = { children: React.ReactNode };

const AuthProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStorageData = async () => {
      const storagedUser = await localStorage.getItem("@RNAuth:user");

      if (storagedUser) {
        setUser(JSON.parse(storagedUser));
      }
      setLoading(false);
    };

    loadStorageData();
  }, []);

  const toast = useToast();

  const signIn = async (data: ILoginData) => {
    try {
      setLoading(true);
      const response = await auth.signIn(data);
      setUser(response.data.user);
      await localStorage.setItem("@RNAuth:token", response.data.token);
      await localStorage.setItem(
        "@RNAuth:user",
        JSON.stringify(response.data.user)
      );
    } catch (error: any) {
      if (error.response.status === 422) {
        toast({
          title: "Erro 422",
          description: error.response.data.msg,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Erro",
          description: "Falha na autenticação!",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    await localStorage.clear();
    setUser(null);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <AuthContext.Provider
      value={{ signed: !!user, user, signIn, signOut, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
};

export { AuthProvider, useAuth };
