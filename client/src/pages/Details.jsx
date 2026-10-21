import { useContext, useEffect, useState } from "react";
import BackIcon from "../icons/BackIcon";
import { Link, useNavigate, useParams } from "react-router-dom";
import { formatISO9075 } from "date-fns";
import { toast } from "react-toastify";
import { UserContext } from "../UserContext";

const Details = () => {
  const { userInfo } = useContext(UserContext);
  const [post, setPost] = useState([]);
  const params = useParams();
  const navigate = useNavigate();

  const getPost = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_URL}/details/${params.id}`,
    );
    const post = await response.json();
    setPost(post);
  };
  useEffect(() => {
    getPost();
  }, []);

const { _id, title, imageUrl, content, author, createdAt } = post;

  const deletePost = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_URL}/delete/${params.id}`,
      {
        method: "delete",
        credentials: "include",
        body : JSON.stringify({author_id : author._id}),
        headers : {
          "Content-Type" : "application/json"
        }
      },
    );

    if (response.ok) {
      toast.success("Post Delete Successful!");
      navigate("/");
    } else {
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      {post && (
        <section className="font-serif">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">{title}</h2>
              <p className="mb-2">
                {author ? author.name : ""} |{" "}
                <span>
                  {createdAt
                    ? formatISO9075(new Date(createdAt), {
                        representation: "date",
                      })
                    : ""}
                </span>
              </p>
            </div>

            <Link to={"/"}>
              <BackIcon />
            </Link>
          </div>
          <img
            src={imageUrl}
            alt="post"
            className="w-full object-cover mb-2 rounded-md"
          />
          <p className="mb-5">{content}</p>
          <div className="flex items-center justify-end gap-3">
            {author && userInfo && (
              <>
                {author._id === userInfo._id && (
                  <>
                    <Link
                      to={`/edit/${_id}`}
                      className="bg-black py-1.5 px-4 rounded-md text-white"
                    >
                      Edit
                    </Link>
                    <button
                      className="bg-red-600 text-white py-1.5 px-4 border rounded-md cursor-pointer"
                      onClick={deletePost}
                    >
                      Delete
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </section>
      )}
    </>
  );
};

export default Details;
