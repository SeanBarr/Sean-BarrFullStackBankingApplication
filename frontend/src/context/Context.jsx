import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const UserContext = createContext();

function useUserContext() {
    return useContext(UserContext)
}

function ContextProvider({ children }) {
    const [authToken, setAuthToken] = useState(null)
    const [loggedInUser, setLoggedInUser] = useState(null)
    const [userOwnedAccounts, setUserOwnedAccounts] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_API_BASE_URL,
        headers: {
            'Content-Type': 'application/json'
        },
        withCredentials: true
    });

    const updateToken = async () => {
        try {
            const response = await axiosInstance.get(process.env.REACT_APP_API_REFRESH)
            setAuthToken(response.data.accessToken)
            axiosInstance.defaults.headers.Authorization = `Bearer ${response.data.accessToken}`
        }
        catch {
            setAuthToken(null)
        }
    }

    const signup = async (name, email, password) => {
        const response = await axiosInstance.post(process.env.REACT_APP_API_SIGN_UP, { name: name, email: email, password: password })
        return response.data.message
    }
    const login = async (email, password) => {
        const response = await axiosInstance.post(process.env.REACT_APP_API_SIGN_IN, { email, password })
        setAuthToken(response.data.accessToken)
        setLoggedInUser(response.data.user)
    }

    const logOut = async () => {
        const response = await axiosInstance.get(process.env.REACT_APP_API_SIGN_OUT)
        setLoggedInUser(null)
        setUserOwnedAccounts([])
    }

    const getUser = async () => {
        await updateToken()
        const response = await axiosInstance.get(process.env.REACT_APP_API_GET_USER)
        setLoggedInUser(response.data.user)
    }

    const createAccount = async (owner, type) => {
        await updateToken()
        const response = await axiosInstance.post(process.env.REACT_APP_API_CREATE_ACCOUNT + owner, { type })
        setUserOwnedAccounts([...userOwnedAccounts, response.data.account])
    }
    const getAccounts = async (owner) => {
        await updateToken()
        const response = await axiosInstance.get(process.env.REACT_APP_API_GET_ACCOUNTS + owner)
        setUserOwnedAccounts(response.data.accounts)
    }

    const depositMoney = async (number, amount) => {
        await updateToken()
        const response = await axiosInstance.put(process.env.REACT_APP_API_UPDATE_ACCOUNT, { number, amount, action: 'deposit' })
        setUserOwnedAccounts(userOwnedAccounts.map(account => account.id === response.data.account.id ? { ...account, balance: response.data.account.balance } : account))
        return response.data.account
    }

    const withdrawMoney = async (number, amount) => {
        await updateToken()
        const response = await axiosInstance.put(process.env.REACT_APP_API_UPDATE_ACCOUNT, { number, amount, action: 'withdraw' })
        setUserOwnedAccounts(userOwnedAccounts.map(account => account.id === response.data.account.id ? { ...account, balance: response.data.account.balance } : account))
        return response.data.account
    }

    useEffect(() => {
        const verifyRefreshToken = async () => {
            try {
                await getUser()
                setIsLoading(false)
            } catch (error) {
                setIsLoading(false)
            }
        }
        !authToken ? verifyRefreshToken() : setIsLoading(false)
    }, [])

    const contextValue = {
        loggedInUser,
        userOwnedAccounts,
        login,
        signup,
        logOut,
        getAccounts,
        createAccount,
        depositMoney,
        withdrawMoney
    }

    return (
        <UserContext.Provider value={contextValue}>
            <div className="min-vh-100 d-flex flex-column bg-white">{isLoading ?
                <div class="spinner-border text-primary m-auto" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                : children}
            </div>
        </UserContext.Provider>
    )
}

export { useUserContext, ContextProvider }