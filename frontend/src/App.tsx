import Auth from "./pages/Auth";
import Home from "./pages/Home";
import Hero from "./pages/Hero";
import { Route, Routes } from "react-router-dom";
const App = () =>{
  return(
    <div>
      <Routes>
          <Route path="/" element={<Hero/>}/>
          <Route path="/home" element={<Home/>}/>
          <Route path="/auth" element={<Auth/>}/>
      </Routes>
    </div>
  )
}
export default App;