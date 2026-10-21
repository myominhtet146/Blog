import PostForm from "../components/PostForm"

const Edit = () => {
  return (
    <div><PostForm Title={"Edit your post here!"} Btntext={"Update Post"} isEditMode={true} /></div>
  )
}

export default Edit