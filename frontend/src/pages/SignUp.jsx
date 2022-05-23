import { useUserContext } from "../context/Context";
import { useState, useRef } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal'
import { Navigate } from "react-router-dom";
import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";

const SignUp = () => {
  const { signup, loggedInUser } = useUserContext()
  const name = useRef()
  const email = useRef()
  const password = useRef()
  const confirmedPassword = useRef()
  const [nameError, setNameError] = useState(null)
  const [emailError, setEmailError] = useState(null)
  const [passwordError, setPasswordError] = useState(null)
  const [confirmedPasswordError, setConfirmedPasswordError] = useState(null)
  const [isProcessingRequest, setIsProcessingRequest] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [firtsIsHidden, setFirtsIsHidden] = useState(true)
  const [secondIsHidden, setSecondIsHidden] = useState(true)
  let error = false;
  const toggleFirst = () => {
    setFirtsIsHidden(!firtsIsHidden)
  }

  const toggleSecond = () => {
    setSecondIsHidden(!secondIsHidden)
  }

  const validateSignUpForm = () => {
    if (!(password.current.value.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/))) {
      setPasswordError("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character and be minimum six characters long!")
      error = true;
      setTimeout(() => {
        setPasswordError(null)
      }, 2500);
    }
    if (confirmedPassword.current.value === "") {
      setConfirmedPasswordError("Please confirm your password!")
      error = true;
      setTimeout(() => {
        setConfirmedPasswordError(null)
      }, 2500);
    }
    if (!(password.current.value === confirmedPassword.current.value)) {
      setConfirmedPasswordError("Passwords don't match!")
      error = true;
      setTimeout(() => {
        setConfirmedPasswordError(null)
      }, 2500);
    }
    if (name.current.value === "") {
      setNameError('Please enter a name!')
      error = true;
      setTimeout(() => {
        setNameError(null)
      }, 2500);
    }
    if (!(email.current.value.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/))) {
      setEmailError('Please enter a valid email!')
      error = true;
      setTimeout(() => {
        setEmailError(null)
      }, 2500);
    }
    if (error) { return false }
    return true;
  }

  const handleSignUp = async (e) => {
    e.preventDefault();
    error = false;
    if (!validateSignUpForm()) return
    try {
      setIsProcessingRequest(true)
      await signup(name.current.value, email.current.value, password.current.value)
    }
    catch (error) {
      console.log(error.message)
    }
    setShowModal(true)
  }

  const clearForm = () => {
    name.current.value = ''
    email.current.value = ''
    password.current.value = ''
    confirmedPassword.current.value = ''
    setIsProcessingRequest(false)
  }

  const closeModel = () => {
    setShowModal(false)
    clearForm()
  }

  return (
    <> {!loggedInUser ?
      <Card
        bgcolor="light"
        txtcolor="dark"
        header="Sign Up"
        body={(
          <>
            <form onSubmit={handleSignUp} className="form-md row gy-3 needs-validation" noValidate>
              <div className="col-12 position-relative mb-3">
                <label htmlFor="name" className="form-label">Name</label>
                <input type="text" className={nameError ? "form-control is-invalid" : "form-control"} id="name" ref={name} aria-describedby="nameValidationFeedback" required />
                <div id="nameValidationFeedback" className="invalid-tooltip">{nameError}</div>
              </div>
              <div className="col-12 position-relative mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input type="email" className={emailError ? "form-control is-invalid" : "form-control"} id="email" ref={email} aria-describedby="emailValidationFeedback" required />
                <div id="emailValidationFeedback" className="invalid-tooltip">{emailError}</div>
              </div>
              <div className="col-12 mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <div className='position-relative'>
                  <input type={firtsIsHidden ? "password" : "text"} className={passwordError ? "form-control pe-5 is-invalid" : "form-control pe-5"} id="password" ref={password} aria-describedby="passwordValidationFeedback" required />
                  {firtsIsHidden ? <BsFillEyeFill className={passwordError ? "fs-5 position-absolute top-50 end-0 translate-middle-y me-3 z-1" : "fs-5 position-absolute top-50 end-0 translate-middle-y me-3"} onClick={toggleFirst} /> : <BsFillEyeSlashFill className={passwordError ? "fs-5 position-absolute top-50 end-0 translate-middle-y me-3 z-1" : "fs-5 position-absolute top-50 end-0 translate-middle-y me-3"} onClick={toggleFirst} />}
                  <div id="passwordValidationFeedback" className="invalid-tooltip">{passwordError}</div>
                </div>
              </div>
              <div className="col-12 mb-4">
                <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                <div className='position-relative'>
                  <input type={secondIsHidden ? "password" : "text"} className={confirmedPasswordError ? "form-control pe-5 is-invalid" : "form-control pe-5"} id="confirmPassword" ref={confirmedPassword} aria-describedby="confirmPasswordValidationFeedback" required />
                  {secondIsHidden ? <BsFillEyeFill className={confirmedPasswordError ? "fs-5 position-absolute top-50 end-0 translate-middle-y me-3 z-1" : "fs-5 position-absolute top-50 end-0 translate-middle-y me-3"} onClick={toggleSecond} /> : <BsFillEyeSlashFill className={passwordError ? "fs-5 position-absolute top-50 end-0 translate-middle-y me-3 z-1" : "fs-5 position-absolute top-50 end-0 translate-middle-y me-3"} onClick={toggleSecond} />}
                  <div id="confirmPasswordValidationFeedback" className="invalid-tooltip">{confirmedPasswordError}</div>
                </div>
              </div>
              <div className="col-12">
                <Button btncolor="primary" btntype="submit" btntext="Create Account" disabled={isProcessingRequest} />
              </div>
            </form>
            {showModal ? <Modal medeltitle="Success!" medeltext={`You have successfully created an account!`} btntype="button" btncolor="primary" btntext="CREATE ANOTHER ACCOUNT" event={closeModel} includelink={true} /> : <></>}
          </>
        )}
      />
      : <Navigate to="/signin" />
    }</>
  )
}

export default SignUp;