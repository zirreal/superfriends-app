// styles
import './Avatar.scss'

export default function Avatar({src}) {
  return (
    <div className="avatar">
      <img src={src} alt="profile pic" />
    </div>
  )
}
