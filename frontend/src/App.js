import { HashRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Home from "./pages/Home";
import Deposit from './pages/Deposit';
import Withdraw from './pages/Withdraw';
import NotFound from './pages/NotFound'
import NewAccount from "./pages/NewAccount";

const App = () => {
    return (
        <HashRouter>
            <Header />
            <main className="d-flex flex-column flex-grow-1 container">
                <Routes>
                    <Route path='/signup' element={<SignUp />} />
                    <Route path='/signin' element={<SignIn />} />
                    <Route exact path='/' element={<Home />} />
                    <Route path='/newaccount' element={<NewAccount />} />
                    <Route path='/deposit' element={<Deposit />} />
                    <Route path='/withdraw' element={<Withdraw />} />
                    <Route path='/*' element={<NotFound />} />
                </Routes>
            </main>
            <Footer />
        </HashRouter >
    );
}

export default App;