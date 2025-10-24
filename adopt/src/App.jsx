import Header from "./components/Header/Header";
import ReportInjuredDogs from "./pages/ReportInjuredDogs/ReportInjuredDogs";
import Nav from "./components/Header/nav";
import {BrowserRouter, Routes, Route } from 'react-router-dom'
import AdoptOrBuy from "./pages/AdoptBuyDogs/AdoptOrBuy";
import DogBuy from "./pages/AdoptBuyDogs/BuyDogs";
import DogAdopt from "./pages/AdoptBuyDogs/AdoptDogs";
import AdminDog from "./pages/Admin/AdminDog";
import DogDetails from "./pages/AdoptBuyDogs/DogDetail";

function App() {
  return (
    <div>
      <Header />
      <Nav activePage="home" />
      <BrowserRouter>
        <Routes>
          <Route path="/report" element={<ReportInjuredDogs/>}/>
          <Route path="/findDog" element={<AdoptOrBuy/>} />
          <Route path="/dogs/buy" element={<DogBuy/>} />
          <Route path="/dogs/adopt" element={<DogAdopt/>} />
          <Route path="/dogs/:id" element={<DogDetails/>}/>
          <Route path="/admin/dogs" element={<AdminDog/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;