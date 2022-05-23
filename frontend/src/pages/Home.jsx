import Card from '../components/Card'
import { BsBank2 } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useUserContext } from "../context/Context";
import { Navigate } from "react-router-dom";

const Home = () => {
  const { loggedInUser } = useUserContext()

  return (
    <> {loggedInUser ?
      <Card
        bgcolor="light"
        txtcolor="dark"
        header={`Welcome back ${loggedInUser.name}`}
        title="How can we serve you today?"
        body={(<div className='d-flex flex-column'>
          <BsBank2 className='fs-7 mt-3 mx-auto' />
          <div className='mt-4 d-flex'>
            <Link to="/deposit" className='btn btn-primary me-2 w-50'>Deposit Monay</Link>
            <Link to="/withdraw" className='btn btn-outline-primary w-50'>Withdraw Monay</Link>
          </div>
        </div>)}
      />
      : <Navigate to="/signin" />
    }</>
  );
}

export default Home;