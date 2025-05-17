import React, { useEffect } from "react";
import usePostDetails from "../Components/hooks/usePostDetails";
import { useDispatch } from "react-redux";
import { postActions } from "../Store/postSlice";

export default function PostDetails() {
  const { record } = usePostDetails();
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(postActions.setRecord());
    };
  }, [dispatch]);

  return (
    <>
      <div className="container mt-10 mx-auto bg-blue-50 rounded-2xl p-10">
        <h2 className="text-center p-2 font-bold text-blue-950">
          Post Details
        </h2>
        <div className="p-5">
          <h4>
            <span className="text-red-600 font-medium">Title : </span>{" "}
            {record?.title}
          </h4>
          <p>
            <span className="text-red-600  font-medium">Content : </span>{" "}
            {record?.content}
          </p>
          <p>
            <span className="text-red-600 font-medium">Date : </span>{" "}
            {record?.date}
          </p>
          <div>
            {record?.image ? (
              <img
                src={record.image}
                alt="Post"
                className="mt-2 max-w-xs rounded"
              />
            ) : (
              ''
            )}
          </div>
        </div>
      </div>
    </>
  );
}
