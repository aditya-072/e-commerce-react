import Swal from "sweetalert2";
// import { resetErrAction } from "../redux/slices/globalActions/globalActions";
// import { useDispatch } from "react-redux";


export const displayError = (icon, message) => {
  // const dispatch = useDispatch();
  return Swal.fire({
    icon,
    title: "Oops...",
    text: message,
  });
  // dispatch(resetErrAction());
};
