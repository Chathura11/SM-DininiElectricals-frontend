import React,{useState,useContext, useEffect} from 'react';
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../api/api'; 
import toast from 'react-hot-toast';

const AuthContext = React.createContext()

export function useAuth(){
    return useContext(AuthContext);
}

export function AuthProvider(props){
    
    const [authUser,setAuthUser] =useState(null)
    const [isLoggedIn,setIsLoggedIn] =useState(false)
    const [errors,setErrors] = useState({})
    const navigate = useNavigate()    

    const getUser = async()=>{
        await axiosInstance.get('/users/auth').then((res)=>{
            setAuthUser(res.data.data)
            console.log(res.data)
            setIsLoggedIn(true)
        }).catch((e)=>{
            console.log(e.response.data)
        });
        
    }

    useEffect(() => {
        try {
          getUser()
        } catch (e) {
            console.log(e.response.data)
        }
    }, [])
    
    const login =async ({...data})=>{
        setErrors({})
        try{
            await axiosInstance.post('/users/login',data).then((res)=>{
                toast.success(res.data.data)
                navigate('/sell')
            }).catch((e)=>{
                toast.error(e.response.data.data)
                setErrors(e.response.data)
            })
            getUser()

        }catch(e){
            setErrors(e.response)
        }
    }
    const logout =async ()=>{

        try{
            axiosInstance.post('/users/logout').then((res)=>{
                console.log(res.data.data)
                setIsLoggedIn(false)
                setAuthUser(null)
            })
        }catch(e){
            setErrors(e.response)
        }
    }

    const value ={
        authUser,
        setAuthUser,
        isLoggedIn,
        setIsLoggedIn,
        login,
        errors,
        logout
    }

    return(
        <AuthContext.Provider value={value}>
            {props.children}
        </AuthContext.Provider>
    )
}

