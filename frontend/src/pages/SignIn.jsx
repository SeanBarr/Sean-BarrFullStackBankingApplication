import { useUserContext } from "../context/Context";
import { useState, useRef } from 'react'
import Card from '../components/Card'
import Button from '../components/Button'
import { Navigate } from "react-router-dom";
import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";

const SignIn = () => {
  const { login, loggedInUser } = useUserContext()
  const email = useRef()
  const password = useRef()
  const [idHidden, setIdHidden] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [emailError, setEmailError] = useState(null)
  const [passwordError, setPasswordError] = useState(null)
  let error = false;

  const toggle = () => {
    setIdHidden(!idHidden)
  }

  const validateLogInForm = () => {
    if (!(email.current.value.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/))) {
      setEmailError('Please enter a valid email address!');
      error = true;
      setTimeout(() => {
        setEmailError(null)
      }, 2500);
    }
    if (password.current.value === "") {
      setPasswordError('Please enter your password!');
      error = true;
      setTimeout(() => {
        setPasswordError(null)
      }, 2500);
    }
    if (error) return false
    return true;
  }

  const handleLogIn = async (e) => {
    e.preventDefault()
    error = false;
    if (!validateLogInForm()) return;
    try {
      setIsProcessing(true)
      await login(email.current.value, password.current.value)
    }
    catch (error) {
      console.log(error)
      if (error.message === "Firebase: There is no user record corresponding to this identifier. The user may have been deleted. (auth/user-not-found).") {
        setEmailError('There is no user with this email!');
        setTimeout(() => {
          setEmailError(null)
        }, 2500);
      }
      if (error.message === "Firebase: The password is invalid or the user does not have a password. (auth/wrong-password).") {
        setPasswordError('Please enter the correct password!');
        setTimeout(() => {
          setPasswordError(null)
        }, 2500);
      }
    }
    setIsProcessing(false)
  }
  return (
    <> {!loggedInUser ?
      <Card
        bgcolor="light"
        txtcolor="dark"
        header="Sign In"
        body={(
          <form onSubmit={handleLogIn} className="form-md row gy-3 needs-validation" noValidate>
            <div className="col-12 position-relative mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input type="email" className={emailError ? "form-control is-invalid" : "form-control"} id="email" ref={email} aria-describedby="emailValidationFeedback" required />
              <div id="emailValidationFeedback" className="invalid-tooltip">{emailError}</div>
            </div>
            <div className="col-12 mb-4">
              <label htmlFor="password" className="form-label">Password</label>
              <div className='position-relative'>
                <input type={idHidden ? "password" : "text"} className={passwordError ? "form-control pe-5 is-invalid" : "form-control pe-5"} id="password" ref={password} aria-describedby="passwordValidationFeedback" required />
                {idHidden ? <BsFillEyeFill className={passwordError ? "fs-5 position-absolute top-50 end-0 translate-middle-y me-3 z-1" : "fs-5 position-absolute top-50 end-0 translate-middle-y me-3"} onClick={toggle} /> : <BsFillEyeSlashFill className={passwordError ? "fs-5 position-absolute top-50 end-0 translate-middle-y me-3 z-1" : "fs-5 position-absolute top-50 end-0 translate-middle-y me-3"} onClick={toggle} />}
                <div id="passwordValidationFeedback" className="invalid-tooltip">{passwordError}</div>
              </div>
            </div>
            <div className="col-12">
              <Button btncolor="primary" btntype="submit" btntext="Log In" disabled={isProcessing} />
            </div>
          </form>
        )}
      />
      : <Navigate to="/" />
    }</>
  )
}

export default SignIn;