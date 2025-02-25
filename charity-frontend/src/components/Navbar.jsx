import React from 'react'

const Navbar = () => {
  return (
    <div>
        <div className="container">
            <div className="row">
                <div className="col col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                <nav class="navbar navbar-expand-lg bg-tertiary ">     
        <div class="container-fluid">
        <img src="https://static.vecteezy.com/system/resources/previews/043/197/284/non_2x/logo-illustration-of-hands-holding-a-heart-representing-charity-and-support-vector.jpg" alt="Logo" width="140" height="140" class="d-inline-block align-text-top"></img>
        <a href="/adminlogin" className="btn btn-danger">ADMIN LOGIN</a>
        <a href="/collectsignin" className="btn btn-warning">SOCIAL WORKER LOGIN</a>
        <a href="/login" className="btn btn-success">USER LOGIN</a>
        </div>
        </nav>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Navbar