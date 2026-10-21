import { useEffect, useState } from 'react'
import PostLIst from './components/PostList';

const App = () => {
  const [posts, setPosts] = useState([]);

  const getPosts = async()=>{
    const response = await fetch(`${import.meta.env.VITE_URL}/posts`);
    const posts = await response.json();
    setPosts(posts);
  }
  useEffect(()=>{
    getPosts();
  },[]);

  return (
    <div>
      {
        posts.map((post)=> <PostLIst post={post} key={post._id} />)
      }
    </div>
  )
}

export default App