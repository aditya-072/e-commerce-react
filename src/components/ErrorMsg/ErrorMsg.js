import { useDispatch } from "react-redux";
import Swal from "sweetalert2";

import { resetErrAction } from "../../redux/slices/globalActions/globalActions";

const ErrorMsg = ({ message }) => {
  const dispatch = useDispatch();
  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: message,
  });
  dispatch(resetErrAction()); // this dispatch is called when we click the ok on error modal, it will reset the error msg in the store and error component will not pop up frequently, we only need to show error once, after it should be cleared
};

export default ErrorMsg;
