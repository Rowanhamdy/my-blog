import React, { Suspense } from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import store from './Store/store.js';
import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
// Page and component imports
import App from './App.jsx'; 
import Home from './Pages/Home.jsx';
import Login from './Pages/Login.jsx';
import Layout from './Components/Layout/Layout.jsx';
import Logout from './Pages/Logout.jsx';
import SignUp from './Pages/SignUp.jsx';
import NotFound from './Pages/NotFound.jsx'; 
import Gurd from './Pages/Gurd.jsx';
import LoadingSpinner from './Pages/LoadingSpinner.jsx';
import DraftPosts from './Pages/DraftPosts.jsx';

const NewPost = React.lazy(() => import('./Pages/NewPost.jsx') )
const PostDetails = React.lazy(() => import('./Pages/PostDetails.jsx'))
const AddComment = React.lazy(() => import('./Pages/addComment.jsx'))
const Edit = React.lazy(() => import('./Pages/Edit.jsx'))
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'logout',
        element: <Logout />,
      },
      {
        path: 'draft',
        element:<Suspense fallback={<LoadingSpinner />}> <Gurd>  <DraftPosts /></Gurd></Suspense>,
      },
      {
        path: 'signup',
        element: <SignUp />,
      },
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'add',
        element:<Suspense fallback={<LoadingSpinner />}><Gurd><NewPost /></Gurd></Suspense>  ,
      },
      {
        path: 'edit/:id', 
        element: <Suspense fallback={<LoadingSpinner />}><Gurd><Edit /></Gurd></Suspense>  ,
      },
      {
        path: 'post/:id', 
        element: <Suspense fallback={<LoadingSpinner />}> <PostDetails /></Suspense>,
      },
      {
        path: 'comment/post/:id', 
        element:<Suspense fallback={<LoadingSpinner />}><Gurd><AddComment /></Gurd> </Suspense>  ,
      },
      {
        path: '*',
        element: <NotFound />, 
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  
);
