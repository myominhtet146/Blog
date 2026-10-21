import {Link} from 'react-router-dom'
import {formatISO9075} from 'date-fns'

const PostLIst = ({post}) => {
  const {_id, title, imageUrl, content, author, createdAt} = post;

  return (
    <Link to={`/details/${_id}`}>
      <div className="font-serif">
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="mb-2">{author.name} | <span>{formatISO9075(new Date(createdAt), { representation: 'date' })}</span></p>
        <img src={imageUrl} alt={content} className="w-full h-80 object-cover mb-2 rounded-md" />
        <p className="mb-5">{content}</p>
        <button className='bg-black p-2.5 rounded-md text-white mb-7 cursor-pointer'>Read Full Article</button>
      </div>
    </Link>
  )
}

export default PostLIst