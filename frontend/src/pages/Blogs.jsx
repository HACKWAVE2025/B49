import { useEffect, useState } from "react";
import useAuthStore from "../store/useAuthStore.js";
import { getPosts } from "../utils/postApi.js";
import { useNavigate, useLocation } from "react-router-dom";

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const { username } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const profileOwner = queryParams.get("user") || username;

  useEffect(() => {
    const fetchBlogs = async () => {
      if (!profileOwner) return;
      const posts = await getPosts(profileOwner);
      setBlogs(posts.filter((post) => post.isPublic));
    };
    fetchBlogs();
  }, [profileOwner, location.key]);

  return (
    <div className="min-h-screen bg-[#0B0F17] text-gray-200 px-6 py-10">
      <h1 className="text-4xl font-bold text-[#00FF88] mb-10 text-center tracking-wide">
        {profileOwner === username ? "My Blogs" : `${profileOwner}'s Blogs`}
      </h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {blogs.length > 0 ? (
          blogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-[#121A26] border border-[#1E2A38] rounded-2xl p-6 shadow-md hover:shadow-[0_0_15px_#00FF8855] transition-all duration-300"
            >
              {/* Blog Title */}
              <h2
                className="text-xl font-semibold text-[#00FF88] cursor-pointer hover:text-[#39FF9F] transition"
                onClick={() => navigate(`/blog/${blog._id}`, { state: { blog } })}
              >
                {blog.title}
              </h2>

              {/* Blog Info */}
              <div className="flex items-center justify-between mt-3 text-sm text-gray-400 border-t border-[#1E2A38] pt-3">
                <p>{new Date(blog.createdAt).toLocaleDateString()}</p>

                <button
                  className="text-[#3DFFB0] hover:underline"
                  onClick={() => navigate(`/profile/${blog.username}`)}
                >
                  @{blog.username}
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center mt-20">
            {profileOwner === username
              ? "You haven’t written any blogs yet."
              : "No blogs available for this user."}
          </p>
        )}
      </div>
    </div>
  );
}
