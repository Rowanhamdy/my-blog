import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchPosts, postActions } from "../Store/postSlice";
import noImage from "../assets/images/Available.jpg"; // Fallback image if post has no image

export default function DraftPosts() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { setRecord } = postActions;
  const { posts, status, error } = useSelector((state) => state.posts);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (status === "idle") dispatch(fetchPosts());
  }, [dispatch, status]);

  const filteredDrafts = useMemo(() => {
    return searchTerm
      ? posts.filter(
          (post) =>
            !post.published &&
            post.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : posts.filter((post) => !post.published);
  }, [posts, searchTerm]);

  if (status === "failed") return <div>Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h2 className="text-3xl font-bold text-gray-900">Draft Posts</h2>
          <div className="flex w-full sm:w-auto items-center gap-2">
            <label htmlFor="search" className="text-gray-700 text-sm font-medium">
              Search Drafts
            </label>
            <input
              id="search"
              type="search"
              value={searchTerm}
              placeholder="Search drafts by title..."
              onChange={(e) => setSearchTerm(e.target.value)}
              className="shadow-sm border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500 w-full sm:w-64"
            />
          </div>
        </div>

        {status === "loading" && <p>Loading drafts...</p>}

        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredDrafts.length > 0 ? (
            filteredDrafts.map((post) => (
              <li key={post.id}>
                <div className="bg-white rounded-lg shadow-md hover:shadow-2xl transition-shadow duration-200 flex flex-col h-full">
                  <div className="p-4 flex flex-col h-full">
                    <Link
                      to={`/edit/${post.id}`}
                      className="text-lg font-semibold logo-text mb-2 block hover:underline"
                    >
                      {post.title}
                    </Link>

                    {post.image ? (
                      <img
                        src={post.image}
                        alt="PostImage"
                        className="w-full h-48 object-cover rounded-md mb-4"
                      />
                    ) : (
                      <img
                        src={noImage}
                        alt="No Image"
                        className="w-full h-50 object-cover rounded-md mb-4"
                      />
                    )}

                    <button
                      onClick={() => {
                        dispatch(setRecord(post));
                        navigate(`/edit/${post.id}`);
                      }}
                      className="bg-fuchsia-800 text-white px-3 py-1 rounded hover:bg-fuchsia-900"
                    >
                      Edit Draft
                    </button>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500">
              No drafts found.
            </div>
          )}
        </ul>
      </div>
    </div>
  );
}
