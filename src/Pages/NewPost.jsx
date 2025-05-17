import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { insertPosts } from "../Store/postSlice";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import image1 from "../assets/images/Illustration.png";
export default function NewPost() {
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.posts);
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    content: Yup.string().required("Content is required"),
    published: Yup.boolean().required("Published status is required"),
    image: Yup.mixed().test("fileType", "Unsupported File Format", (value) => {
      if (!value) return true; // ✅ No image provided — valid
      return ["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(
        value.type
      );
    }),
  });

  // Converts uploaded image file to base64 string
  const toBase64 = async (file) => {
    const reader = new FileReader();
    return await new Promise((resolve, reject) => {
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const formik = useFormik({
    initialValues: {
      title: "",
      content: "",
      published: false,
      image: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const currentDateTime = new Date().toLocaleString();
      let payload = { ...values, date: currentDateTime };

      // If image uploaded, convert to base64
      if (values.image) {
        const base64Image = await toBase64(values.image);
        payload.image = base64Image;
      }
      dispatch(insertPosts(payload));
      formik.resetForm();
      navigate("/");
    },
  });
  return (
    <>
      {/* Background decorative images */}
      <div className="relative ">
        <img
          src={image1}
          alt="Decorative Left"
          className="absolute top-10 left-50 w-32 sm:w-75 opacity-60 z-0"
        />
        <img
          src={image1}
          alt="Decorative Right"
          className="absolute top-100 right-50 w-32 sm:w-80 opacity-60 z-0"
        />
      </div>

      {/* Main form container */}
      <div className="container relative mx-auto  px-4 py-8 max-w-2xl">
        <h2 className="text-xl logo-text font-bold mb-4 text-center mt-3">
          Create New Post
        </h2>

        {/* FORM STARTS */}
        <form onSubmit={formik.handleSubmit} className="z-10">
          <div className="space-y-12 border-2 border-stone-400 rounded-2xl">
            <div className="border-b border-gray-900/10 pb-12">
              <div className="container  p-5 mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label
                    htmlFor="image"
                    className="block text-sm font-medium text-gray-900"
                  >
                    Upload Image
                  </label>
                  <input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                      const file = event.currentTarget.files[0];
                      formik.setFieldValue("image", file); // Store file in Formik
                    }}
                    className="mt-2"
                  />
                  {formik.errors.image && formik.touched.image && (
                    <p className="text-red-500 text-xs italic">
                      {formik.errors.image}
                    </p>
                  )}

                  {/* Preview the uploaded image */}
                  {formik.values.image && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-1">
                        Image Preview:
                      </p>
                      <img
                        src={URL.createObjectURL(formik.values.image)}
                        alt="Preview"
                        className="max-w-xs rounded-md border"
                      />
                    </div>
                  )}
                </div>

                <div className="sm:col-span-4">
                  <label
                    htmlFor="title"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Title
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    onChange={formik.handleChange}
                    value={formik.values.title}
                    className="shadow bg-pink-50 appearance-none  rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                  {formik.touched.title && formik.errors.title && (
                    <p className="text-red-500 text-xs italic">
                      {formik.errors.title}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-4">
                  <label
                    htmlFor="content"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Content{" "}
                  </label>
                  <div className="mt-2">
                    <div className="flex items-center rounded-md bg-white   ">
                      <input
                        id="content"
                        name="content"
                        type="text"
                        onChange={formik.handleChange}
                        value={formik.values.content}
                        className="shadow bg-pink-50 appearance-none  rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-4">
                 <div className="flex items-center space-x-3 mt-6">
  <input
    id="published"
    name="published"
    type="checkbox"
    onChange={formik.handleChange}
    checked={formik.values.published}
    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
  />
  <label htmlFor="published" className="block text-sm font-medium text-gray-700">
    Publish this post
  </label>
</div>
                </div>
              </div>
              <div className="m-5 mb-0 mt-0  flex items-center justify-end gap-x-6">
                <button
                  onClick={() => navigate("/")}
                  type="button"
                  className="text-sm/6 font-semibold text-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </form>

        {status === "loading" && <p>Loading...</p>}
        {status === "failed" && <p>Error: {error}</p>}
      </div>
    </>
  );
}
