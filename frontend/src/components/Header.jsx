import { useUserContext } from "../context/Context"
import { NavLink } from "react-router-dom";
import { BsBank2 } from "react-icons/bs";

const Header = () => {
    const { loggedInUser, logOut } = useUserContext()
    return (
        <header>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container">
                    <NavLink className="navbar-brand" to="/"><BsBank2 className="mb-1 me-1" />BadBank</NavLink>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbar-toggler" aria-controls="navbar-toggler"
                        aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse justify-content-end" id="navbar-toggler">
                        <ul className="navbar-nav">
                            {loggedInUser
                                ?
                                <>
                                    <li className="nav-item">
                                        <NavLink
                                            id="home"
                                            to="/"
                                            className="nav-link text-center position-relative"
                                        >
                                            Home
                                        </NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink
                                            id="newaccount"
                                            to="/newaccount"
                                            className="nav-link text-center position-relative"
                                        >
                                            Create Account
                                        </NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink
                                            id="deposit"
                                            to="/deposit"
                                            className="nav-link text-center position-relative"
                                        >
                                            Deposit
                                        </NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink
                                            id="withdraw"
                                            to="/withdraw"
                                            className="nav-link text-center position-relative"
                                        >
                                            Withdraw
                                        </NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <button
                                            id="signout"
                                            onClick={logOut}
                                            className="nav-link text-center position-relative transparent mx-auto"
                                        >
                                            Sign Out
                                        </button>
                                    </li>
                                </>
                                :
                                <>
                                    <li className="nav-item">
                                        <NavLink
                                            id="signup"
                                            to="/signup"
                                            className="nav-link text-center position-relative"
                                        >
                                            Sign Up
                                        </NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink
                                            id="login"
                                            to="/signin"
                                            className="nav-link text-center position-relative"
                                        >
                                            Sign In
                                        </NavLink>
                                    </li>
                                </>
                            }
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    )
}

export default Header
