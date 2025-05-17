import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { authActions } from '../Store/authSlice';
import image1 from '../assets/images/Illustration.png'

const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn } = useSelector((state) => state.auth);
  const { login } = authActions;

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  const loginSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string()
      .matches(passwordRegex, 'Password must be at least 6 characters and include letters and numbers')
      .required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      const res = await fetch('https://sore-bubbly-beanie.glitch.me/api/users');
      const data = await res.json();

      const user = data.find(
        (user) => user.email === values.email && user.password === values.password
      );

      if (user) {
        dispatch(login({ id: user.id }));
        navigate('/');
      } else {
        formik.setErrors({ email: 'Invalid credentials', password: ' ' });
      }
    },
  });

  return (
    <>
    <div className="relative">
        <img
          src={image1}
          alt="Decorative Left"
          className="absolute top-10 left-30 w-32 sm:w-50 opacity-60 z-0"
        />
        <img
          src={image1}
          alt="Decorative Right"
          className="absolute top-50 right-50 w-32 sm:w-70 opacity-60 z-0"
        />
         <img
          src={image1}
          alt="Decorative Right"
          className="absolute top-80 left-70 w-32 sm:w-70 opacity-60 z-0"
        />
      </div>
    <div className="container relative mx-auto px-4 py-8 max-w-2xl">
      <h2 className="text-xl font-bold mb-2 text-center logo-text mt-3">LOGIN</h2>
      <p className='text-center m-2 font-medium item-color'>Log in to continue to your account</p>
      <form onSubmit={formik.handleSubmit}>
        <div className="space-y-12 border-2 border-stone-400 rounded-2xl">
          <div className="border-b border-gray-900/10 pb-12">
            <div className="p-5 mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              {/* email */}
              <div className="sm:col-span-4">
                <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
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
                  <p className="text-red-500 text-xs italic">{formik.errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="sm:col-span-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                  Password
                </label>
                <div className="mt-2">
                  <div className="flex items-center rounded  bg-white pl-3 outline  ">
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
                    <p className="text-red-500 text-xs italic">{formik.errors.password}</p>
                  )}
                </div>
              </div>
            </div>
             {/* Submit */}
        <div className="m-6 mb-0 flex items-center justify-end gap-x-6">
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
          </div>
        </div>

       
      </form>
    </div>
    </>
    
  );
}
