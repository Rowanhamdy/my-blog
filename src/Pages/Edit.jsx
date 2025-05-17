import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, updatePosts } from "../Store/postSlice";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import image1 from "../assets/images/Illustration.png";

export default function Edit() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { record, status, error } = useSelector((state) => state.posts);

  // Use useCallback for stable function references
  // const toBase64 = useCallback(async (file) => {
  //   if (!file || !(file instanceof Blob)) {
  //   return null; // or return existing image if you prefer
  // }
  //   const reader = new FileReader();
  //   return await new Promise((resolve, reject) => {
  //     reader.onload = () => resolve(reader.result);
  //     reader.onerror = reject;
  //     reader.readAsDataURL(file);
  //   });
  // },[]);

  // Memoize the validation schema

  const validationSchema = useMemo(
    () =>
      Yup.object({
        title: Yup.string().required("Title is required"),
        content: Yup.string().required("Content is required"),
        published: Yup.boolean().required("Published status is required"),
        image: Yup.mixed().nullable(), // Allow null values
      }),
    []
  );

  const formik = useFormik({
    initialValues: {
      title: record?.title || "",
      content: record?.content || "",
      published: record?.published || false,
      image: record?.image || "", // Store existing image separately
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const currentDateTime = new Date().toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      //   let imageToSend = values.image;
      //  if (values.image) {
      // imageToSend = await toBase64(values.image);
      //   }
      dispatch(
        updatePosts({
          ...values,
          id: record.id,
          image: values.image,

          date: currentDateTime,
        })
      )
        .unwrap()
        .then(() => {
          navigate("/");
          dispatch(fetchPosts());
        });
    },
  });

  useEffect(() => {
    if (!record) {
      navigate("/");
    }
  }, [record, navigate]);

  return (
    <>
      <div className="relative">
        <img
          src={image1}
          alt="Decorative Left"
          className="absolute top-10 left-50 w-32 sm:w-75 opacity-60 z-0"
        />
        <img
          src={image1}
          alt="Decorative Right"
          className="absolute top-80 right-70 w-32 sm:w-80 opacity-60 z-0"
        />
      </div>
      <div className="container relative mx-auto  px-4 py-8 max-w-2xl">
        <h2 className="text-xl logo-text font-bold mb-4   text-center mt-3">
          Update Post
        </h2>

        <form onSubmit={formik.handleSubmit}>
          <div className="max-w-xl mx-autorelative bg-white-50  shadow-2xl rounded-lg">
            <div className="border-b border-gray-900/10 pb-12">
              <div className="container  p-5 mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label
                    htmlFor="image"
                    className="block text-sm font-bold item-color"
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
                      formik.setFieldValue("image", file);
                    }}
                    className="mt-2"
                  />
                  {formik.errors.image && formik.touched.image && (
                    <p className="text-red-500 text-xs italic">
                      {formik.errors.image}
                    </p>
                  )}
                  {formik.values.image && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-1">
                        Image Preview:
                      </p>
                      <img
                        src={
                          typeof formik.values.image === "string"
                            ? formik.values.image
                            : // Check if it's a valid file object

                            formik.values.image instanceof Blob
                            ? URL.createObjectURL(formik.values.image)
                            : ""
                        }
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
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                    <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                      <input
                        id="content"
                        name="content"
                        type="text"
                        onChange={formik.handleChange}
                        value={formik.values.content}
                        className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                      />
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label
                    htmlFor="published"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Published{" "}
                  </label>
                  <div className="mt-2">
                    <div className="  ">
                      <input
                        id="published"
                        name="published"
                        type="checkbox"
                        onChange={formik.handleChange}
                        checked={formik.values.published}
                        className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="m-5 mb-0 flex items-center justify-end gap-x-6">
                <button
                  type="button"
                  onClick={()=>navigate("/")}
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
