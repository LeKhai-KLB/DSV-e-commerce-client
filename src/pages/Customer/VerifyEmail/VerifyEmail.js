import { memo, useMemo, useState, useEffect, useRef } from "react";
import styles from "./VerifyEmail.module.css";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

// imagse assets
import acceptIcon from "../../../assets/shared/icon/accept.png";
import loadingIcon from "../../../assets/shared/icon/loading.png";
import warningIcon from "../../../assets/shared/icon/warning.png";

const status = {
  pendding: {
    icon: loadingIcon,
    title: "Verifying...",
    description: "Please wait a few minutes",
  },
  accept: {
    icon: acceptIcon,
    title: "Successfully verified !",
    description: "You are being redirected to home page, it may takes upto",
    countDown: 5,
  },
  warning: {
    icon: warningIcon,
    title: "Failure verified !",
    description:
      "Your email had been verified or this mail had been expired.\n You are being redirected to home page, it may takes upto",
    countDown: 5,
  },
};

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [currentStatus, setCurrentStatus] = useState({ ...status.pendding });
  const [countDown, setCountDown] = useState(
    currentStatus.countDown ? currentStatus.countDown : -1
  );
  const [passingData, setPassingData] = useState(null);
  const nav = useNavigate();
  let interValId = useRef();

  const handleLoad = async () => {
    const token = searchParams.get("token");
    if (token) {
      try {
        const { data } = await axios.post(
          process.env.REACT_APP_VERIFY_EMAIL,
          {},
          {
            headers: {
              authorization: `bearer ${token}`,
            },
          }
        );
        if (data.status === 200) {
          setPassingData({ email: data.resultData });
          setCurrentStatus({ ...status.accept });
        } else {
          throw new Error(data.errorMessage);
        }
      } catch (err) {
        setCurrentStatus({ ...status.warning });
      }
    } else {
      setCurrentStatus({ ...status.warning });
    }
  };

  useEffect(() => {
    handleLoad();
  }, []);

  useEffect(() => {
    if (currentStatus.countDown) {
      interValId.current = setInterval(
        () =>
          setCountDown((prev) => {
            if (prev === -1) return currentStatus.countDown;
            else return --prev;
          }),
        1000
      );
    }
  }, [currentStatus]);

  useEffect(() => {
    if (countDown === 0) {
      clearInterval(interValId.current);
      nav("../", { state: passingData ? { ...passingData } : {} });
    }
  }, [countDown]);

  return (
    <div className={styles.verifyEmailContainer}>
      <div className={styles.messageBox}>
        <img className={styles.icon} src={currentStatus.icon} alt=" " />
        <div className={styles.textWrapper}>
          <span className={styles.title}>{currentStatus.title}</span>
          <span className={styles.description}>
            {currentStatus.description}
          </span>
          {countDown !== -1 && (
            <span className={styles.countDown}>{countDown}</span>
          )}
        </div>
        <div className={styles.footerPadding} />
      </div>
    </div>
  );
}

export default memo(VerifyEmail);
