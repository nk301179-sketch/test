import { useNavigate } from "react-router-dom"
import { DollarSign, Gift } from "lucide-react"

import "./AdoptOrBuy.css"

export default function AdoptOrBuy() {
  const navigate = useNavigate()

  return (
    <div className="adoptbuy-container">
      <h1 className="title">🐾 Welcome to Home4Paws 🐾</h1>
      <p className="subtitle">Do you want to buy or adopt a dog?</p>

      <div className="options">
        {/* Buy Card */}
        <div className="option-card" onClick={() => navigate("/dogs/buy")}>
          <div className="icon-wrapper buy">
            <DollarSign className="icon" />
          </div>
          <h2>Buy a Dog</h2>
          <p>Browse premium breed dogs from trusted breeders.</p>
          <button className="buy-btn">Explore Dogs for Sale</button>
        </div>

        {/* Adopt Card */}
        <div className="option-card" onClick={() => navigate("/dogs/adopt")}>
          <div className="icon-wrapper adopt">
            <Gift className="icon" />
          </div>
          <h2>Adopt a Dog</h2>
          <p>Give a stray dog a loving forever home.</p>
          <button className="adopt-btn">See Dogs for Adoption</button>
        </div>
      </div>
    </div>
  )
}
