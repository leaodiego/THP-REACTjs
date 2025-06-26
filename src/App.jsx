import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from './pages/Home/Index';
import EditarParadas from './pages/EditParadas/Index';
import NovaParada from './components/NovaParada/Index';

function App() {

  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path='/' hide element={<Home />}></Route>
          <Route path="/editparadas/:paradasId" element={<EditarParadas />} />
          <Route path="/novaParada/:numOs" element={<NovaParada />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
