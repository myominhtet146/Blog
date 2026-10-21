import PostForm from '../components/PostForm'

const PostCreate = () => {
  return (
    <div><PostForm Title={"Create your post now!"} Btntext={"Create Post"} isEditMode={false} /></div>
  )
}

export default PostCreate