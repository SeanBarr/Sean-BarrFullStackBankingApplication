import { useUserContext } from "../context/Context";
import { useState, useRef, useEffect } from 'react'
import Card from '../components/Card'
import Button from '../components/Button'
import Modal from '../components/Modal'
import { Navigate, NavLink } from "react-router-dom";

const Withdraw = () => {
  const { userOwnedAccounts, withdrawMoney, loggedInUser, getAccounts } = useUserContext()
  const amount = useRef()
  const [isProcessing, setIsProcessing] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [error, setError] = useState(null)
  const [choosenAccount, setChoosenAccount] = useState(null);
  const [isLoading, setIsLoading] = useState(true)

  const handleSelectChange = (event) => {
    setChoosenAccount(userOwnedAccounts.filter(account => account.number === Number(event.target.value))[0])
  }

  const validateInput = () => {
    if (amount.current.value === '') {
      setError('Please enter an amount');
      setTimeout(() => {
        setError(null)
      }, 2500);
      return false
    }
    if (!(/^[1-9]+/.test(amount.current.value))) {
      setError('Input must be positive integer');
      setTimeout(() => {
        setError(null)
      }, 2500);
      return false
    }
    return true;
  }

  const validateAmountChange = (newBalance) => {
    if (newBalance < 0) {
      setError(`Withdrawal isn't possible. Your current balance is $${loggedInUser.balance}`);
      setTimeout(() => {
        setError(null)
      }, 2500);
      return false
    }
    return true;
  }

  const handleAmountChange = async (e) => {
    e.preventDefault();
    if (!validateInput()) return;
    let newBalance = choosenAccount.balance - Number(amount.current.value);
    if (!validateAmountChange(newBalance)) return;
    setIsProcessing(true)
    try {
      const account = await withdrawMoney(choosenAccount.number, Number(amount.current.value))
      setChoosenAccount(account)  
    }
    catch (error) {
      console.log(error.message)
    }
	setShowModal(true)
  }

  const clearForm = () => {
    amount.current.value = ''
    setError(null)
    setIsProcessing(false)
  }

  const closeModel = () => {
    setShowModal(false)
    clearForm()
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getAccounts(loggedInUser.id)
        setChoosenAccount(userOwnedAccounts.filter(account => account.type === "checking")[0])
        setIsLoading(false)
      }
      catch (error) {
		setIsLoading(false)
        console.log(error.message)
      }
    }
    loggedInUser?.id && !choosenAccount ? fetchData() : setIsLoading(false)
  }, [loggedInUser, userOwnedAccounts])

  return (
    <>{!isLoading ?
      <> {loggedInUser ?
        <Card
          bgcolor="light"
          txtcolor="dark"
          header="Withdraw"
          body={(
            choosenAccount ?
              <>
                <p>{`Your current balance: $${choosenAccount.balance}`}</p>
                <form onSubmit={handleAmountChange} className="row g-3 needs-validation" noValidate>
                  <div class="col-12">
                    <label for="accountSelect" class="form-label">Choose an account</label>
                    <select id="accountSelect" className="form-select" value={choosenAccount?.number} onChange={handleSelectChange}>
                      {userOwnedAccounts?.map((account) => {
                        if (account.type === 'checking') {
                          return <option key={account.id} value={account.number}>{account.number}</option>
                        }
                      })}
                    </select>
                  </div>
                  <div className="col-12 position-relative">
                    <label htmlFor="withdraw" className="form-label">Withdraw Amount</label>
                    <input type="text" className={error ? "form-control is-invalid" : "form-control"} ref={amount} id="withdraw"
                      aria-describedby="validationFeedback" required onChange={() => amount.current.value ? setIsProcessing(false) : setIsProcessing(true)} />
                    <div id="validationFeedback" className="invalid-tooltip">{error}</div>
                  </div>
                  <div className="col-12">
                    <Button btncolor="primary" btntype="submit" btntext="Withdraw Money" disabled={isProcessing} />
                  </div>
                </form>
                {showModal ? <Modal medeltitle="Success!" medeltext={`You have successfully withdrawn $${amount.current.value} from your balance!`} btntype="button" btncolor="primary" btntext="OK" event={closeModel} /> : <></>}
              </>
              :
              <>
                <p>You haven't opened an account yet!</p>
                <NavLink to="/newaccount" className="btn btn-primary">Open an Account</NavLink>
              </>
          )}
        />
        : <Navigate to="/signin" />
      }
      </>
      :
      <div class="spinner-border text-primary m-auto" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    }</>
  )
}

export default Withdraw;