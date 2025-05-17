import React, { useEffect, useState, useMemo } from "react"; // React core and hooks
import { useDispatch, useSelector } from "react-redux"; // Redux hooks
import { deletePosts, fetchPosts, postActions } from "../Store/postSlice"; // Redux actions for posts
import { fetchComments } from "../Store/commentSlice"; // Redux action to get comments
import { Link, useNavigate } from "react-router-dom"; // Router tools
import noImage from "../assets/images/Available.jpg"; // Fallback image if post has no image

export default function Home() {
  const dispatch = useDispatch(); // To dispatch Redux actions
  const navigate = useNavigate(); // For programmatic navigation

  const { setRecord } = postActions; // Destructure the postActions to get setRecord (used for editing)

  // Select parts of Redux state
  const { posts, status, error } = useSelector((state) => state.posts);
  const { comments, statusComment } = useSelector((state) => state.comments);
  const { isLoggedIn } = useSelector((state) => state.auth); // Auth status

  const [searchTerm, setSearchTerm] = useState(""); // Search input state
  const [visibleComments, setVisibleComments] = useState({}); // Tracks which post comments are shown
  
  // Fetch posts once if not already fetched
  useEffect(() => {
    if (status === "idle") dispatch(fetchPosts());
  }, [dispatch, status]);

  // Fetch comments once if not already fetched
  useEffect(() => {
    if (statusComment === "idle") dispatch(fetchComments());
  }, [dispatch, statusComment]);

  // Memoize filtered posts to prevent unnecessary re-renders
  const filteredPosts = useMemo(() => {
    return searchTerm
      ? posts.filter(
          (post) =>
            post.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
            post.published === true // Only show published posts
        )
      : posts.filter((post) => post.published === true); // Only show published posts
  }, [posts, searchTerm]);

  // Handler for deleting posts (with confirmation)
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      dispatch(deletePosts(id));
    }
  };

  // Toggle visibility of comments for a specific post
  const toggleComments = (postId) => {
    setVisibleComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  // Show error if post loading failed
  if (status === "failed") return <div>Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header and Search Input */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h2 className="text-3xl font-bold text-gray-900">Blog Posts</h2>
          <div className="flex w-full sm:w-auto items-center gap-2">
            <label
              htmlFor="search"
              className="text-gray-700 text-sm font-medium"
            >
              Search
            </label>
            <input
              id="search"
              type="search"
              value={searchTerm}
              placeholder="Search posts by title..."
              onChange={(e) => setSearchTerm(e.target.value)}
              className="shadow-sm border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500 w-full sm:w-64"
            />
          </div>
        </div>

        {/* Show loading indicator while fetching posts */}
        {status === "loading" && (
          <p className="text-gray-600 mb-4">Loading posts...</p>
        )}

        {/* Display filtered post cards in a responsive grid */}
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => {
              // Get comments related to this post
              const postComments = comments.filter((c) => c.postId === post.id);
              return (
                <li key={post.id}>
                  <div className="bg-white rounded-lg shadow-md hover:shadow-2xl transition-shadow duration-200 flex flex-col h-full">
                    <div className="p-4 flex flex-col h-full">
                      {/* Post title link to detail page */}
                      <Link
                        to={`/post/${post.id}`}
                        className="text-lg font-semibold logo-text mb-2 block hover:underline"
                      >
                        {post.title}
                      </Link>

                      {/* Post image or fallback image */}
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

                      {/* Action Buttons: Update, Comment, Toggle Comments, Delete */}
                      <div className="flex flex-wrap gap-2 mt-auto">
                        {/* Update (edit) button */}
                        <button
                          onClick={() => {
                            dispatch(setRecord(post)); // Store the post record in Redux
                            navigate(`/edit/${post.id}`); // Go to edit page
                          }}
                          className="bg-fuchsia-800 text-white px-3 py-1 rounded hover:bg-amber-950 text-sm"
                        >
                          Update
                        </button>

                        {/* Navigate to comment creation page */}
                        <button
                          onClick={() => navigate(`/comment/post/${post.id}`)}
                          className="bg-main text-white px-3 py-1 rounded hover:bg-amber-950 text-sm"
                        >
                          Comment
                        </button>

                        {/* Toggle visibility of comments */}
                        <button
                          onClick={() => toggleComments(post.id)}
                          className="bg-pink-600 text-white px-3 py-1 rounded hover:bg-gray-900 text-sm"
                        >
                          {visibleComments[post.id] ? "Hide" : "Show"}
                        </button>

                        {/* Delete post, only if logged in */}
                        <button
                          onClick={() => isLoggedIn && handleDelete(post.id)}
                          className={`px-3 py-1 rounded text-sm ${
                            isLoggedIn
                              ? "bg-red-600 text-white hover:bg-amber-950 cursor-pointer"
                              : "bg-gray-400 text-white cursor-not-allowed"
                          }`}
                          disabled={!isLoggedIn}
                          title={
                            !isLoggedIn
                              ? "You must be logged in to delete"
                              : "Delete post"
                          }
                        >
                          Delete
                        </button>
                      </div>

                      {/* Render comments if toggled */}
                      {visibleComments[post.id] && postComments.length > 0 && (
                        <ul className="mt-4 space-y-2 border-t pt-2">
                          <p className="font-semibold text-sm text-gray-800">
                            Comments:
                          </p>
                          {postComments.map((comment) => (
                            <li
                              key={comment.id}
                              className="text-sm text-gray-700"
                            >
                              ➤ {comment.content}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </li>
              );
            })
          ) : (
            // Show message if no posts match the search
            <p className="text-gray-500 col-span-full text-center">
              No published posts found matching your search.
            </p>
          )}
        </ul>
      </div>
    </div>
  );
}
