import React ,{createContext,useState,useContext,ReactNode} from 'react'
import { User } from '@/types/models';


type AuthContextType ={
    user: User | null,
    accessToken: string | null,
    refreshToken: string | null,
    login: (user: User, accesstoken: string , refreshtoken: string) => void,
    logout: () => void;
    setAccessToken: (token: string) => void;
}

const AuthContext = createContext <AuthContextType | undefined>(undefined);

export default function AuthProvider({children}:{children:ReactNode}) {

    const [user, setUser] = useState<User | null>(() => {
        const storedUser = sessionStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const [accessToken, setAccessTokenState] = useState<string | null>(() =>
        sessionStorage.getItem('accessToken')
    );

    const [refreshToken, setRefreshToken] = useState<string | null>(() =>
        sessionStorage.getItem('refreshToken')
    );


    const login = (user:User,accessToken:string,refreshToken:string)=>{

        setUser(user);
        setAccessTokenState(accessToken);
        setRefreshToken(refreshToken);

        // Guardar en localStorage
        sessionStorage.setItem('user', JSON.stringify(user));
        sessionStorage.setItem('accessToken', accessToken);
        sessionStorage.setItem('refreshToken', refreshToken);

    }

    const logout =()=>{
        setUser(null);
        setAccessTokenState(null);
        setRefreshToken(null);

        sessionStorage.removeItem('user');
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('refreshToken');
    }

    const setAccessToken = (token: string) => {
        setAccessTokenState(token);
        sessionStorage.setItem('accessToken', token);
    }

    
    return (
        <AuthContext.Provider value={{user,accessToken,refreshToken,login,logout,setAccessToken}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
