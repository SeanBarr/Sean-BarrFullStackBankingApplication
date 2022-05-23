import { useUserContext } from "../context/Context";
import { useEffect, useState } from "react";
import Card from '../components/Card'
import Button from '../components/Button'
import { Navigate } from "react-router-dom";

const NewAccount = () => {
    const { createAccount, loggedInUser, userOwnedAccounts, getAccounts } = useUserContext()
    const [selectedAccountType, setSelectedAccountType] = useState("default");
    const [isLoading, setIsLoading] = useState(true)
    const rows = userOwnedAccounts?.map(account => {
        return (
            <tr key={account.id}>
                <td>{account.number}</td>
                <td>{account.type}</td>
                <td>{account.balance}$</td>
            </tr>
        )
    })
    const handleSelectChange = (event) => {
        setSelectedAccountType(event.target.value)
    }
    const handleAccountOpening = async (event) => {
        event.preventDefault();
        if (selectedAccountType === 'default') return;
        try {
            await createAccount(loggedInUser.id, selectedAccountType)
        }
        catch (error) {
            console.log(error.message)
        }
    }
    useEffect(() => {
        const fetchData = async () => {
            try {
                await getAccounts(loggedInUser.id)
                setIsLoading(false)
            }
            catch (error) {
                console.log(error.message)
            }
        }
        loggedInUser?.id ? fetchData() : setIsLoading(false)
    }, [loggedInUser])

    return (
        <>{!isLoading ?
            <> {loggedInUser ?
                <Card
                    bgcolor="light"
                    txtcolor="dark"
                    header="Create Account"
                    body={(
                        <>
                            <form onSubmit={handleAccountOpening} className="row g-3 needs-validation" noValidate>
                                <div className="col-12">
                                    <label htmlFor="accountSelect" className="form-label">Account Type</label>
                                    <select id="accountSelect" className="form-select" value={selectedAccountType} onChange={handleSelectChange}>
                                        <option value="default" disabled>Please choose the account type</option>
                                        <option value="checking">Checking</option>
                                        <option value="savings">Savings</option>
                                    </select>
                                </div>
                                <div className="col-12">
                                    <Button btncolor="primary" btntype="submit" btntext="Create Account" />
                                </div>
                            </form>
                            <table className="table mt-3">
                                <thead>
                                    <tr>
                                        <th scope="col">Number</th>
                                        <th scope="col">Type</th>
                                        <th scope="col">Balance</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows}
                                </tbody>
                            </table>
                        </>
                    )} />
                : <Navigate to="/signin" />
            }</>
            :
            <div class="spinner-border text-primary m-auto" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        }</>
    )
}

export default NewAccount