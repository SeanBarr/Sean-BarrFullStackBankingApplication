import Button from "./Button";
import { Link } from "react-router-dom";
const Modal = (props) => {
    return (
        <div className="modal d-block" tabIndex="-1">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header bg-light">
                        <h5 className="modal-title ">{props.medeltitle}</h5>
                    </div>
                    <div className="modal-body">
                        <p>{props.medeltext}</p>
                    </div>
                    <div className="modal-footer bg-light">
                        {props.includelink ?
                            <>
                                <Button btntype={props.btntype} btncolor={props.btncolor} btntext={props.btntext} onClick={props.event} />
                                <Link className={`btn btn-${props.btncolor}`} to="/signin">LOGIN</Link>
                            </>
                            : <Button btntype={props.btntype} btncolor={props.btncolor} btntext={props.btntext} onClick={props.event} />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;
