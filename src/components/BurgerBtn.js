// styles
import './BurgerBtn.scss';

export default function BurgerBtn({show, setShow}) {
  return (
    <button aria-label="activate mobile menu" onClick={() => setShow((prev) => !prev)} className={show ? 'burger active' : 'burger'}>
      <span className="burger__line"></span>
      <span className="burger__line"></span>
      <span className="burger__line"></span>
    </button>
  )
}
