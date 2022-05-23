import { Link } from "react-router-dom";
import { useUserContext } from "../context/Context";
const NotFound = () => {
    const { loggedInUser } = useUserContext()
    return (
        <div className="m-auto">
            <h1 className="m-0">This page does not exist</h1>
            <Link className="btn btn-primary mt-5" to={loggedInUser ? "/" : "/signin"}>Go Back</Link>
        </div>
    );
};

export default NotFound;
