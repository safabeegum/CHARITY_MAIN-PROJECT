import React from 'react'
import Navbar from './Navbar'

const Home = () => {
  return (
    <div>
      <Navbar/>
        <div className="container">
          <div className="row">
            <div className="col col-12 col-sm-12 col-md-12 col-lg-6 col-6 col-xl-6 col-xxl-6">
            <div class="card border-light mb-3">
              <br></br>
            <img src="https://img.freepik.com/premium-photo/valentine-s-day-heart-with-hands-modern-doodle-style-vector-illustration_225753-7444.jpg?w=900" class="card-img-top" alt="..."></img>
            <div class="card-body">
            </div>
            </div>
            </div>

            <div className="col col-12 col-sm-12 col-md-12 col-lg-6 col-6 col-xl-6 col-xxl-6">
            <div class="card border-light mb-3">
            <br></br><br></br><br></br><br></br><br></br><br></br><br></br>
            <p class="card-text text-center fst-italic text-danger-emphasis"><h2>Panchayat Specific Charity Fund Collection</h2></p>
            <p class="card-text text-center fst-italic text-danger-emphasis"><h2>Through Entertainment</h2></p>
            <div class="card-body">
            </div>
            </div>
            </div>
          </div>
          
        </div>
    </div>
  )
}

export default Home