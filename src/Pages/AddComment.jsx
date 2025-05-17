import React from "react";
import { useDispatch } from "react-redux";
import { insertComments } from "../Store/commentSlice";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import image1 from "../assets/images/Illustration.png";

export default function AddComment() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: postId } = useParams();


  // Validation rules
  const validationSchema = Yup.object({
    user: Yup.string().required("Name is required"),
    content: Yup.string().required("Comment is required"),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      postId: postId || "",
      user: "",
      content: "",
    },
    validationSchema,
    onSubmit: (values) => {
      const date = new Date().toLocaleString(); // Add timestamp

      const commentWithDate = {
        ...values,
        date,
      };

      dispatch(insertComments(commentWithDate)); // Dispatch to Redux
      formik.resetForm(); // Clear form
      // navigate("/"); // Optional: redirect back to home
    },
  });

  return (
    <>
      {/* Decorative background */}
      <div className="relative">
        <img
          src={image1}
          alt="Decorative Left"
          className="absolute top-10 left-50 w-32 sm:w-75 opacity-60 z-0"
        />
        <img
          src={image1}
          alt="Decorative Right"
          className="absolute top-50 right-70 w-32 sm:w-80 opacity-60 z-0"
        />
      </div>

      {/* Comment form */}
      <form
        onSubmit={formik.handleSubmit}
        className="relative z-10 max-w-xl mx-auto mt-20 p-6 rounded-lg shadow-2xl bg-white"
      >
        <h2 className="text-xl font-bold mb-6 logo-text">Add a Comment</h2>

        {/* Post ID */}
        <div className="mb-4">
          <label htmlFor="postId" className="block text-sm font-medium text-gray-700 mb-1">
            Post ID
          </label>
          <input
            id="postId"
            name="postId"
            type="text"
            value={formik.values.postId}
            readOnly
            className="w-full bg-gray-100 border px-3 py-2 rounded-md shadow-sm text-gray-600"
          />
        </div>

        {/* User Name */}
        <div className="mb-4">
          <label htmlFor="user" className="block text-sm font-medium text-gray-700 mb-1">
            Your Name
          </label>
          <input
            id="user"
            name="user"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.user}
            className="w-full border px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {formik.touched.user && formik.errors.user && (
            <p className="text-red-500 text-xs mt-1">{formik.errors.user}</p>
          )}
        </div>

        {/* Comment */}
        <div className="mb-4">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Comment
          </label>
          <textarea
            id="content"
            name="content"
            onChange={formik.handleChange}
            value={formik.values.content}
            rows={3}
            className="w-full border px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {formik.touched.content && formik.errors.content && (
            <p className="text-red-500 text-xs mt-1">{formik.errors.content}</p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Submit Comment
          </button>
        </div>
      </form>

     
    </>
  );
}
