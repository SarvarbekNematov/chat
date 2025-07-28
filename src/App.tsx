import { useNavigate } from "react-router-dom"
import Login from "./pages/login"
import MainRouter from "./router"
import { useEffect } from "react"
import { useData } from "./context"

function App() {
  const navigation = useNavigate()
  const token = localStorage.getItem("accessToken")
  useEffect(() => {
    if(!token){
    navigation('/login')
    }
  },[])

  const {openModal} = useData()
  

  return <>
    <div className={`overflow-hidden relative `}>
      {token && <MainRouter/> }
      {openModal && (
        <div className={`absolute z-10 top-0 left-0 right-0 bottom-0 ${openModal && "bg-[#000000c1] opacity-50"}`}></div>
      )}
    </div>
    <div className="overflow-hidden">
      {!token && <Login/>}
    </div>
  </>
}

export default App
