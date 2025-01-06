import React ,{createContext,useState,useContext,ReactNode} from 'react'


type User ={
    id: number,
    username: string,
    email: string,
    rol: string
}

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
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const [accessToken, setAccessTokenState] = useState<string | null>(() =>
        localStorage.getItem('accessToken')
    );

    const [refreshToken, setRefreshToken] = useState<string | null>(() =>
        localStorage.getItem('refreshToken')
    );


    const login = (user:User,accessToken:string,refreshToken:string)=>{

        setUser(user);
        setAccessTokenState(accessToken);
        setRefreshToken(refreshToken);

        // Guardar en localStorage
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

    }

    const logout =()=>{
        setUser(null);
        setAccessTokenState(null);
        setRefreshToken(null);

        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    }

    const setAccessToken = (token: string) => {
        setAccessTokenState(token);
        localStorage.setItem('accessToken', token);
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
