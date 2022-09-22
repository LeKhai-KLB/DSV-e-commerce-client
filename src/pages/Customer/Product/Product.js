import { memo, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./product.module.css";
import FilterSizeBox from "../../../components/Customer/FilterBox/FilterSizeBox";
import FilterColorBox from "../../../components/Customer/FilterBox/FilterColorBox";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, clearState } from "../../../redux/slices/cartSlice";
import { cartStateSelector } from "../../../redux/selector";
import { toast } from "react-toastify";

//image assets
import startIcon from "../../../assets/shared/icon/star.png";
import minusIcon from "../../../assets/shared/icon/minus.png";
import plusIcon from "../../../assets/shared/icon/plus.png";

function Product() {
  const [size, setSize] = useState("s");
  const [colorPallete, setColorPallete] = useState([]);
  const [color, setColor] = useState();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [categoryPath, setCategoryPath] = useState("");
  const [sameBrandProducts, setSameBrandProducts] = useState([]);
  const [sameNestedRootCategoryProducts, setSameNestedRootCategoryProducts] =
    useState([]);
  const [images, setImages] = useState([]);
  const [mainImage, setMainImage] = useState(0);
  const params = useParams();
  const nav = useNavigate();
  const dispatch = useDispatch();
  const cartState = useSelector(cartStateSelector);

  const handleClickPlusIcon = () => {
    setQuantity(Number(quantity) + 1);
  };

  const handleClickMinusIcon = () => {
    setQuantity(Number(quantity) - 1);
  };

  const handleLoadSameBrandProducts = async (id, nId) => {
    try {
      const { data } = await axios.get(
        process.env.REACT_APP_GET_PRODUCT_BY_BRAND_ID_API +
          "?id=" +
          id +
          "&&limit=4&&nId=" +
          nId
      );
      if (data.status === 200) {
        setSameBrandProducts(data.resultData);
      } else {
        throw new Error(data.errorMessage);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleLoadSameParentCategory = async (parent, nId) => {
    try {
      console.log(parent);
      const { data } = await axios.get(
        process.env.REACT_APP_GET_PRODUCT_BY_NESTED_ROOT_CATEGORY_API +
          "?parent=" +
          parent +
          "&&limit=8&&nId=" +
          nId
      );
      if (data.status === 200) {
        setSameNestedRootCategoryProducts(data.resultData);
      } else {
        throw new Error(data.errorMessage);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleFirstLoad = async () => {
    try {
      const { data } = await axios.get(
        process.env.REACT_APP_GET_PRODUCT_BY_ID_API + "?id=" + params.id
      );
      if (data.status === 200) {
        setProduct(data.resultData);
        setColorPallete(data.resultData.colors);
        setImages(data.resultData.images);
        setSize("s");
        setColor(data.resultData.colors[0]._id);
        setMainImage(0);
        setQuantity(1);
        handleLoadSameBrandProducts(
          data.resultData.brand._id,
          data.resultData._id
        );
        handleLoadSameParentCategory(
          data.resultData.categories[0].parent,
          data.resultData._id
        );
      } else {
        throw new Error(data.errorMessage);
      }
      const newCategoryList = data.resultData.categories[0].tree
        .slice(1, 3)
        .join("-");
      const res = await axios.get(
        process.env.REACT_APP_GET_CATEGORY_PASS_BY_ID_LIST_API +
          "?list=" +
          newCategoryList
      );
      if (res.data.status === 200) {
        setCategoryPath(res.data.resultData);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleOnClickAddToCart = () => {
    dispatch(
      addToCart({
        productId: params.id,
        productImage: product.images[0],
        productName: product.name,
        size: size,
        totalInStock: Number(product.inStock[size]),
        quantity: Number(quantity),
        color: colorPallete.find((c) => c._id === color),
        unitPrice: product.price,
        amount: product.price * quantity,
      })
    );
  };

  useEffect(() => {
    if (cartState[0] !== "") {
      if (cartState[0] !== "Out of stock") {
        toast.success(cartState[0], {
          icon: "🛒",
          autoClose: 500,
          hideProgressBar: true,
        });
      } else {
        toast.error(cartState[0], {
          icon: "🔥",
          autoClose: 500,
          hideProgressBar: true,
        });
      }
    }
  }, [cartState]);

  useEffect(() => {
    if (Number(quantity) > (product ? product?.quantity[size] : 100))
      setQuantity(product ? product?.quantity[size] : 1);
  }, [size]);

  useEffect(() => {
    handleFirstLoad();
  }, [params.id]);

  useEffect(() => {
    return () => {
      dispatch(clearState());
    };
  }, []);

  return (
    <div className={styles.productPageContainer}>
      {/* page title container */}
      <div className={styles.pageTitleContainer}>
        {product ? `${categoryPath} / ${product.name}` : "Unknown"}
      </div>

      {/* content container */}
      <div className={styles.contentContainer}>
        {/* top container */}
        <div className={styles.topContainer}>
          <div className={styles.subImagesContainer}>
            {images &&
              [...Array(4)].map((e, i) => {
                if (images[i])
                  return (
                    <img
                      key={i}
                      className={styles.subImage}
                      src={images[i]}
                      alt=" "
                      onClick={() => {
                        if (i !== mainImage) setMainImage(i);
                      }}
                    />
                  );
                else return <div key={i} className={styles.noneImage} />;
              })}
          </div>

          {/* main image */}
          {images.length !== 0 ? (
            <img className={styles.mainImage} src={images[mainImage]} alt=" " />
          ) : (
            <div className={styles.noneMainImage} />
          )}

          {/* product info container */}
          <div className={styles.productInfoContainer}>
            <div
              title={product ? product.name : "Unknown"}
              className={styles.productInfoTitle}
            >
              {product ? product.name : "Unknown"}
            </div>
            <span className={styles.productInfoPrice}>
              ${product ? product.price : 0}.00
            </span>

            {/* reviews box */}
            <div className={styles.reviewsBox}>
              <div className={styles.starsBox}>
                {[...Array(5)].map((e, i) => (
                  <img
                    key={i}
                    className={styles.startIcon}
                    src={startIcon}
                    alt=" "
                  />
                ))}
              </div>
              <span className={styles.reviewsCount}>0 reviews</span>
            </div>

            {/* size box */}
            <div className={styles.box}>
              <div className={styles.boxTitle}>Size</div>
              <FilterSizeBox
                onChange={(title, value) => setSize(value)}
                value={size}
                style={{ padding: "9px 0px 0px 0px" }}
                required={true}
              />
            </div>

            {/* color box */}
            <div className={styles.box}>
              <div className={styles.boxTitle}>Color</div>
              <FilterColorBox
                style={{
                  float: "left",
                  padding: "9px 0px 0px 0px",
                }}
                initData={colorPallete}
                required={true}
                value={color}
                onChange={(title, value) => setColor(value)}
              />
            </div>

            {/* quantity box */}
            <div className={styles.flexBox}>
              <span className={styles.boxTitle}>Quantity</span>
              <div className={styles.quantityField}>
                <img
                  className={`${styles.largeIcon} ${
                    quantity === 1 || !Number(quantity) ? styles.inactive : ""
                  }`}
                  src={minusIcon}
                  alt=" "
                  onClick={() => handleClickMinusIcon()}
                  style={{ paddingLeft: "8px" }}
                />
                <input
                  value={quantity}
                  className={styles.quantityInput}
                  type="number"
                  onChange={(e) => setQuantity(e.target.value)}
                  onBlur={(e) => {
                    if (
                      Number(e.target.value) >= 1 &&
                      Number(e.target.value) <=
                        (product ? product?.inStock[size] : 1)
                    )
                      setQuantity(e.target.value);
                    else if (Number(e.target.value) < 1) setQuantity(1);
                    else if (
                      Number(e.target.value) >
                      (product ? product?.inStock[size] : 1)
                    ) {
                      setQuantity(product ? product?.inStock[size] : 1);
                    }
                  }}
                />
                <img
                  className={`${styles.largeIcon} ${
                    product && product.inStock[size] > quantity
                      ? ""
                      : styles.inactive
                  }`}
                  src={plusIcon}
                  alt=" "
                  onClick={() => handleClickPlusIcon()}
                  style={{ paddingRight: "8px" }}
                />
              </div>
            </div>

            {/* button add to cart */}
            <div
              className={styles.buttonAddToCart + " " + styles.onClickStyle}
              onClick={() => handleOnClickAddToCart()}
            >
              Add to cart
            </div>

            {/* textarea container */}
            <div className={styles.descriptionContainer}>
              <textarea
                readOnly={true}
                spellCheck={false}
                className={styles.descriptionBox}
                value={product ? product.description : ""}
              />
            </div>
          </div>

          {/* same brand images container */}
          <div className={styles.sameBrandContainer}>
            <span className={styles.sameBrandTitle}>More from</span>
            <div
              title={product ? product.brand.name : "Unknown"}
              className={styles.sameBrandName}
            >
              {product ? product.brand.name : "Unknown"}
            </div>
            <div className={styles.sameBrandImagesContainer}>
              {sameBrandProducts &&
                [...Array(4)].map((e, i) => {
                  if (sameBrandProducts[i])
                    return (
                      <img
                        key={i}
                        className={styles.subImage}
                        src={sameBrandProducts[i].images[0]}
                        onClick={() =>
                          nav("../product/" + sameBrandProducts[i]._id)
                        }
                        alt=" "
                      />
                    );
                  else return <div key={i} className={styles.noneImage} />;
                })}
            </div>
          </div>
        </div>

        {/* same categories images container */}
        <div className={styles.sameCategoriesImageCardContainer}>
          <div className={styles.containerTitle}>You may also like</div>

          {sameNestedRootCategoryProducts &&
            [...Array(8)].map((e, i) => {
              if (sameNestedRootCategoryProducts[i])
                return (
                  <div
                    key={i}
                    className={styles.sameCategoryCardContainer}
                    onClick={() =>
                      nav("../product/" + sameNestedRootCategoryProducts[i]._id)
                    }
                  >
                    <img
                      className={styles.sameCategoryCardImage}
                      src={sameNestedRootCategoryProducts[i].images[0]}
                      alt=" "
                    />
                    <div className={styles.sameCategoryTitle}>
                      {sameNestedRootCategoryProducts[i].name}
                    </div>
                  </div>
                );
              else return <div key={i} className={styles.noneImageM} />;
            })}
        </div>
      </div>
    </div>
  );
}

export default memo(Product);
