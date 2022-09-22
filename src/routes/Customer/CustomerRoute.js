import { Outlet } from "react-router-dom";
import { memo, createContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import styles from "./customerRoute.module.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// component
import NavBar from "../../components/Customer/NavBar";
import Footer from "../../components/Customer/Footer";
import RegisterBox from "../../components/Customer/RegisterBox";
import LoginBox from "../../components/Customer/LoginBox";
import ForgotPasswordBox from "../../components/Customer/ForgotPasswordBox";
import ReSendVerifyEmail from "../../components/Customer/ResendVerifyEmail";

export const requiredAuthContext = createContext(null);

function RenderBox({ number, initEmail }) {
  switch (number) {
    case 1:
      return <RegisterBox />;
    case 2:
      return <LoginBox initEmail={initEmail ? initEmail : null} />;
    case 3:
      return <ForgotPasswordBox />;
    case 4:
      return <ReSendVerifyEmail />;
    default:
      return <></>;
  }
}

function CustomerRoute() {
  const [currentShowBox, setCurrenShowBox] = useState(0);
  const [initEmail, setInitEmail] = useState(null);
  const { state } = useLocation();

  useEffect(() => {
    if (state?.email) {
      setInitEmail(state.email);
      setCurrenShowBox(2);
    }
  }, [state]);

  return (
    <div className={styles.CustomerRouteContainer}>
      <requiredAuthContext.Provider value={{ setCurrenShowBox, setInitEmail }}>
        <NavBar />
        {currentShowBox !== 0 && (
          <RenderBox number={currentShowBox} initEmail={initEmail} />
        )}
        <div className={styles.contentContainer}>
          <ToastContainer />
          <Outlet />
        </div>
        <Footer />
      </requiredAuthContext.Provider>
    </div>
  );
}

export default memo(CustomerRoute);
