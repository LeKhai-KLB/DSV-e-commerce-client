import { memo, useState, useEffect } from "react";
import styles from "./adminOrders.module.css";
import SearchBar from "../../../components/Admin/SearchBar";
import PaginationBar from "../../../components/Admin/PaginationBar";
import DatetimeRangePicker from "../../../components/Admin/DatetimeRangePicker";
import axios from "axios";
import { adminSelector } from "../../../redux/selector";
import { useSelector, useDispatch } from "react-redux";
import { clearAuthInfoService } from "../../../services/authServices";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import io from "socket.io-client";

// image assets
import exportIcon from "../../../assets/admin/export-orange.png";
import dropdownIcon from "../../../assets/admin/dropdown.png";
import viewDetailsIcon from "../../../assets/admin/view-details.png";
import reloadIcon from "../../../assets/admin/reload.png";

function AdminOrders() {
  const [searchValue, setSearchValue] = useState("");
  const [showActionsBox, setShowActionsBox] = useState(0);
  const [detailsInfo, setDetailsInfo] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentMaxShow, setCurrentMaxShow] = useState(10);
  const [recordCount, setRecordCount] = useState(0);
  const [currentDate, setCurrentDate] = useState("");
  const [datetimeRange, setDatetimeRange] = useState([null, null]);
  const [orderList, setOrderList] = useState(null);
  const admin = useSelector(adminSelector);
  const dispatch = useDispatch();
  const nav = useNavigate();
  const socket = io(process.env.REACT_APP_SOCKET_HOST);

  const handleSetState = async (state, title, index, id) => {
    try {
      const { data } = await axios.post(
        process.env.REACT_APP_SET_STATUS_ORDER_API,
        { id: id, state: state, title: title },
        {
          headers: {
            authorization: admin.jwt,
          },
        }
      );
      if (data.status === 200) {
        orderList[index].status = data.resultData;
      } else if (data.status === 401) {
        toast.warning("Your login session has expired");
        setTimeout(() => {
          clearAuthInfoService(dispatch);
          nav("./login");
        }, 1500);
      } else {
        throw new Error(data.errorMessage);
      }
    } catch (err) {
      console.log(err.message);
    }
    setShowActionsBox(0);
  };

  const handleSetDate = (date, title) => {
    const newDate1 = new Date(date.setHours(0, 0, 0, 0));
    const newDate2 = new Date(date.setHours(23, 59, 59, 999));
    setDatetimeRange([newDate1, newDate2]);
    setCurrentDate(title);
  };

  const handleReloadDate = () => {
    setDatetimeRange([null, null]);
  };

  useEffect(() => {
    if (datetimeRange[0] && datetimeRange[1]) {
      const today = new Date();
      const yesterday = new Date(Date.now() - 86400000);
      const currentDate1 = new Date(datetimeRange[0].getTime());
      const currentDate2 = new Date(datetimeRange[1].getTime());
      if (
        currentDate1.setHours(0, 0, 0, 0) === currentDate2.setHours(0, 0, 0, 0)
      ) {
        if (currentDate1.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0))
          setCurrentDate("today");
        else if (
          currentDate1.setHours(0, 0, 0, 0) === yesterday.setHours(0, 0, 0, 0)
        )
          setCurrentDate("yesterday");
        else setCurrentDate("");
      } else {
        setCurrentDate("");
      }
    } else {
      setCurrentDate("");
    }
  }, [datetimeRange]);

  const handleLoadOrder = async () => {
    try {
      let queryString = "?";
      if (datetimeRange[0]) {
        queryString += `dateRange=${datetimeRange[0].getTime()}-${datetimeRange[1].getTime()}&`;
      }
      if (searchValue !== "") queryString += `searchValue=${searchValue}&`;
      queryString += `page=${currentPage === 0 ? 1 : currentPage}&`;
      queryString += `limit=${currentMaxShow}`;
      const { data } = await axios.get(
        process.env.REACT_APP_GET_ORDER_BY_FILTER_API + queryString,
        {
          headers: {
            authorization: admin.jwt,
          },
        }
      );
      if (data.status === 200) {
        setRecordCount(data.resultData.remainingLength);
        setOrderList(data.resultData.orders);
      } else if (data.status === 401) {
        toast.warning("Your login session has expired");
        setTimeout(() => {
          clearAuthInfoService(dispatch);
          nav("./login");
        }, 1500);
      } else {
        throw new Error(data.errorMessage);
      }
    } catch (err) {
      setRecordCount(0);
      setOrderList(null);
      console.log(err.message);
    }
  };

  useEffect(() => {
    handleLoadOrder();
  }, [datetimeRange, currentMaxShow, currentPage, searchValue]);

  const onNewOrderAdded = (data) => {
    const date = new Date(data);
    console.log(data);
    toast.success(`New order added at: ${date.toUTCString()}`, {
      icon: "🛒",
      autoClose: 5000,
      hideProgressBar: true,
    });
    handleLoadOrder();
  };

  useEffect(() => {
    socket.on("new-order-added", onNewOrderAdded);
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className={styles.adminOrdersPageContainer}>
      <ToastContainer />

      {/* Control container */}
      <div className={styles.controlContainer}>
        {/* left container */}
        <div className={styles.leftContainer}>
          <span className={styles.labelStyle}>Ordered date</span>
          <DatetimeRangePicker
            value={datetimeRange}
            onChange={setDatetimeRange}
          />
          <div
            className={`${styles.dateTimeButton} ${
              currentDate === "today" ? styles.highlight : ""
            }`}
            onClick={() => handleSetDate(new Date(), "today")}
          >
            Today
          </div>

          <div
            className={`${styles.dateTimeButton} ${
              currentDate === "yesterday" ? styles.highlight : ""
            }`}
            onClick={() =>
              handleSetDate(new Date(Date.now() - 86400000), "yesterday")
            }
          >
            Yesterday
          </div>
          <img
            className={styles.reloadIcon}
            src={reloadIcon}
            alt=" "
            onClick={() => handleReloadDate()}
          />
        </div>

        {/* right container */}
        <div className={styles.rightContainer}>
          {/* search bar */}
          <SearchBar onChangeValue={setSearchValue} />
          {/* export button */}
          <div className={styles.exportButton}>
            <img
              className={styles.icon}
              src={exportIcon}
              alt="export product list"
            />
            Export
          </div>
        </div>
      </div>

      {/* entries container */}
      <div className={styles.entriesContainer}>
        {/* details box */}
        {detailsInfo.length !== 0 && (
          <div className={styles.detailsContainer}>
            <div
              className={styles.overlay}
              onClick={() => setDetailsInfo([])}
            />

            {/* details box */}
            <div className={styles.detailsBox}>
              {/* title */}
              <span className={styles.detailsBoxTitle}>Details</span>
              {/* content */}
              <textarea
                className={styles.textarea}
                readOnly={true}
                value={detailsInfo
                  .map((d) => {
                    return `- ${d?.product?.name}:\n\t+ Size: ${d?.options?.size}\n\t+ Color: ${d?.options?.color?.title}\n\t+ Quantity: ${d?.options?.quantity}\n`;
                  })
                  .join("\n")}
              />
              {/* button */}
              <div
                className={styles.detailsButton}
                onClick={() => setDetailsInfo([])}
              >
                Comfirm
              </div>
            </div>
          </div>
        )}

        <div className={styles.tableLine} />

        {/* table */}
        <table className={styles.table}>
          <thead>
            <tr
              className={styles.tableTitleContainer + " " + styles.labelStyle}
            >
              <th>order id</th>
              <th>ordered date</th>
              <th>customer</th>
              <th>total ($)</th>
              <th>status</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {orderList &&
              orderList.map((order, i) => (
                <tr
                  key={i}
                  className={`${styles.tableEntry} ${
                    i % 2 !== 0 ? styles.grayBackground : ""
                  }`}
                >
                  {/* order id field */}
                  <td style={{ width: "80px", paddingRight: "45px" }}>
                    <div
                      title={order?._id}
                      className={styles.overStackTextOfBox}
                      style={{ width: "80px", height: "100%" }}
                    >
                      {order?._id}
                    </div>
                  </td>

                  {/* order date field */}
                  <td style={{ width: "209px" }}>
                    {new Date(order?.createdAt)
                      .toDateString()
                      .split(" ")
                      .slice(0, 4)
                      .join(", ")}
                  </td>

                  {/* customer field */}
                  <td style={{ width: "370px", paddingRight: "45px" }}>
                    <div
                      className={styles.overStackTextOfBox}
                      style={{ width: "370px", height: "100%" }}
                    >
                      {order?.customer.userName} - {order?.customer._id}
                    </div>
                  </td>

                  {/* total field */}
                  <td style={{ width: "160px" }}>
                    {order?.cart.reduce((total, product) => {
                      return total + product?.amount;
                    }, 0)}
                    .00
                  </td>

                  {/* status field */}
                  <td style={{ width: "180px" }}>
                    <div
                      className={
                        styles.stateBox +
                        " " +
                        `
                                            ${
                                              order?.status.state === 1
                                                ? styles.yellow
                                                : order?.status.state === 2
                                                ? styles.green
                                                : styles.red
                                            }
                                        `
                      }
                    >
                      {order?.status.title}
                    </div>
                  </td>

                  {/* actions field */}
                  <td style={{ paddingRight: "24px" }}>
                    <div
                      className={styles.actionsContainer}
                      onClick={() => {
                        if (i + 1 === showActionsBox) {
                          setShowActionsBox(0);
                        } else {
                          setShowActionsBox(i + 1);
                        }
                      }}
                    >
                      Actions
                      <img
                        className={styles.dropdownIcon}
                        src={dropdownIcon}
                        alt="drop down"
                      />
                    </div>
                  </td>
                  {/* actions box */}
                  {showActionsBox === i + 1 && (
                    <td className={styles.actionsBox}>
                      <div
                        className={styles.actionButton}
                        onClick={() => {
                          if (order?.status?.title !== "Completed")
                            handleSetState(2, "Completed", i, order?._id);
                        }}
                      >
                        <div
                          className={styles.statusColorBox + " " + styles.green}
                        />
                        Mask as completed
                      </div>

                      <div
                        className={styles.actionButton}
                        onClick={() => {
                          if (order?.status?.title !== "Canceled")
                            handleSetState(3, "Canceled", i, order?._id);
                        }}
                      >
                        <div
                          className={styles.statusColorBox + " " + styles.red}
                        />
                        Mask as canceled
                      </div>

                      <div
                        className={styles.showViewBoxButton}
                        onClick={() => {
                          setDetailsInfo(order?.cart);
                          setShowActionsBox(0);
                        }}
                      >
                        <img
                          className={styles.actionsIcon}
                          src={viewDetailsIcon}
                          alt=" "
                        />
                        View details
                      </div>
                    </td>
                  )}
                </tr>
              ))}
          </tbody>
        </table>

        <PaginationBar
          entriesQty={recordCount}
          maxShowEntries={10}
          onChangePage={setCurrentPage}
          onchangeMaxShow={setCurrentMaxShow}
        />
      </div>
    </div>
  );
}

export default memo(AdminOrders);
