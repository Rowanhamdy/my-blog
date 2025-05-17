import React from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import image1 from '../assets/images/Illustration.png'

const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

export default function SignUp() {
  const navigate = useNavigate();
  const logoutSchema = Yup.object().shape({
    fullName: Yup.string()
      .min(2, "Too short")
      .required("Full name is required"),

    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string()
      .matches(
        passwordRegex,
        "Password must be at least 6 characters and include letters and numbers"
      )
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm your password"),
  });

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: logoutSchema,
    onSubmit: async (values) => {
      try {
        const res = await fetch(
          `https://sore-bubbly-beanie.glitch.me/api/users?email=${values.email}`
        );
        const checkUser = await res.json();
        if (checkUser.length > 0) {
          alert("Email already registered. Please use a different email.");
          return;
        }
        const newUser = {
          fullName: values.fullName,
          email: values.email,
          password: values.password,
          role: "user",
        };

        await fetch("https://sore-bubbly-beanie.glitch.me/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newUser),
        });
        alert("User registered successfully!");

        navigate("/login");
      } catch (error) {
        console.log(error);
      }
    },
  });
  return (
    <>
    <div className="relative">
        <img
          src={image1}
          alt="Decorative Left"
          className="absolute top-100 left-50 w-32 sm:w-75 opacity-60 z-0"
        />
        <img
          src={image1}
          alt="Decorative Right"
          className="absolute top-10 right-40 w-32 sm:w-80 opacity-60 z-0"
        />
      </div>
    <div className="container relative mx-auto px-4 py-8 max-w-2xl">
      <h2 className="text-xl font-bold mb-4 text-center mt-3">
        Create Your  <span className="logo-text">Account</span>
      </h2>

      <form onSubmit={formik.handleSubmit}>
        <div className="space-y-12 border-2 border-stone-400 rounded-2xl">
          <div className="border-b border-gray-900/10 pb-12">
            <div className="p-5 mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              {/* Full Name */}

              <div className="sm:col-span-4">
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.fullName}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
                />
                {formik.touched.fullName && formik.errors.fullName && (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.fullName}
                  </p>
                )}
              </div>

              {/* email */}
              <div className="sm:col-span-4">
                <label
                  htmlFor="email"
                  className="block text-gray-700 text-sm font-medium mb-2"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="text"
                  autoComplete="email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="text-red-500 text-xs italic">
                    {formik.errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="sm:col-span-4">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-900"
                >
                  Password
                </label>
                <div className="mt-2">
                  <div className="flex items-center rounded-md bg-white pl-3  outline-1 outline-gray-300 focus-within:outline-2 focus-within:outline-indigo-600">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.password}
                      className="block w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                    />
                  </div>
                  {formik.touched.password && formik.errors.password && (
                    <p className="text-red-500 text-xs italic">
                      {formik.errors.password}
                    </p>
                  )}
                </div>
              </div>
              {/* Confirm Password */}
        <div className="sm:col-span-4">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.confirmPassword}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.confirmPassword}</p>
          )}
        </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="button"
            className="text-sm font-semibold text-gray-900"
            onClick={() => formik.resetForm()}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500 disabled:opacity-50"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
    </>
    
  );
}
