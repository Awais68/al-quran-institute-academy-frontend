import { useEffect, useRef, useState } from "react";
// import Button from "../../../components/Button";
// import { useNavigate } from "react-router";
import axios from "axios";
// import { AppRoutes } from "../../../constant/constant.jsx";

function AddAProduct() {
  //   const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [productImage, setProductImage] = useState(null);
  const [productCategory, setProductCategory] = useState("");
  const [Products, setProducts] = useState([]);
  const formRef = useRef(null);

  const handleImage = (e) => {
    e.preventDefault();
    setProductImage(e.target.files[0]);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(AppRoutes.getAllProducts);
        setProducts(response.data.data);
      } catch (error) {
        console.error("Error fetching Products:", error.message);
      }
    };
    fetchProducts();
  }, [Products]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const file = productImage;
    if (!file) return console.log("Pic is Empty");
    const cloud = import.meta.env.VITE_CLOUDINARY_CLOUDNAME;
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "Saba_Fabrics");
    if (productCategory == "Stitched") {
      data.append("folder", "SabaFabrics/Stitched");
    } else if (productCategory == "Unstitched") {
      data.append("folder", "SabaFabrics/Unstitched");
    }
    data.append("cloud_name", cloud);
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloud}/image/upload`,
      {
        method: "POST",
        body: data,
      }
    )
      .then((response) => response.json())
      .then(async (data) => {
        const URL = data.url;
        const obj = {
          url: URL,
          productID: Products.length,
          category: productCategory,
          title: e.target.title.value,
          price: e.target.price.value,
        };

        await axios.post(AppRoutes.addproduct, obj).then((res) => {
          console.log("res==>", res);
          formRef.current.reset();
        });
      })
      .catch((error) => console.error("Error uploading:", error));
  };

  return (
    <>
      <div className="container mx-auto p-6">
        <div className="max-w-md mx-auto bg-white rounded-lg overflow-hidden md:max-w-lg">
          <div className="md:flex">
            <div className="w-full p-4 px-5 py-5">
              <div className="mb-4">
                <h2 className="text-2xl font-semibold text-gray-700 text-center">
                  Add A Product
                </h2>
              </div>
              <form ref={formRef} onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="image"
                  >
                    Product Image
                  </label>
                  <input
                    type="file"
                    onChange={handleImage}
                    accept="image/*"
                    id="image"
                    name="image"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded focus:ring-emerald-500 focus:border-emerald-500 w-full p-2.5"
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="category"
                  >
                    Category
                  </label>
                  <select
                    className="bg-gray-50 border border-gray-300 text-gray-900 capitalize text-medium rounded focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5 "
                    value={productCategory}
                    onChange={(e) => setProductCategory(e.target.value)}
                    name="category"
                    id="category"
                  >
                    <option value="Stitched">Stitched</option>
                    <option value="Unstitched">Unstitched</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="category"
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    className="bg-gray-50 border border-gray-300 text-gray-900 capitalize text-base rounded focus:ring-emerald-500 focus:border-emerald-500 w-full p-2.5"
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="price"
                  >
                    Price
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded focus:ring-emerald-500 focus:border-emerald-500 w-full p-2.5"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Button type={"submit"} text={"Add"} />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddAProduct;
