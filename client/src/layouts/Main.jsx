import { Outlet } from "react-router-dom"
import Header from "../components/Header"
import { Bounce, ToastContainer } from "react-toastify"

const Main = () => {
  return (
    <section className="max-w-4xl mx-auto">
      <ToastContainer 
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
        <Header />
        <Outlet />
    </section>
  )
}

export default Main