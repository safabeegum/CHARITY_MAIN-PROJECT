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
            <img src="https://static.vecteezy.com/system/resources/previews/043/197/284/non_2x/logo-illustration-of-hands-holding-a-heart-representing-charity-and-support-vector.jpg" class="card-img-top" alt="..."></img>
            <div class="card-body">
            </div>
            </div>
            </div>

            <div className="col col-12 col-sm-12 col-md-12 col-lg-6 col-6 col-xl-6 col-xxl-6">
            <div class="card border-light mb-3">
            <br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br>
            <p class="card-text text-center fst-italic text-danger"><h2>Panchayat Specific Charity Fund Collection</h2></p>
            <p class="card-text text-center fst-italic text-danger"><h2>Through Entertainment</h2></p>
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