import { Link } from "react-router-dom"

function Navbar() {
    const menus = ["Home", "Tools"]
  return (
    <>
    <nav className="flex justify-center p-3 bg-blue-400 text-white">
      <ul className="flex gap-5">
        {menus.map((menu) => (
            <li key={menu} className="hover:bg-blue-500 hover:text-white cursor-pointer">
                <Link to={menu.toLowerCase() === "home" ? "/" : menu.toLowerCase()}>{menu}</Link>
            </li>
        ))}
      </ul>
    </nav>
    </>
  )
}

export default Navbar
