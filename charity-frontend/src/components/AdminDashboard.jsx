import React from 'react'
import AdminNavbar from './AdminNavbar'
import 'bootstrap/dist/css/bootstrap.min.css';



const AdminDashboard = () => {
  return (
<div className="container-fluid">
<AdminNavbar/>
      <div className="row">
        {/* Sidebar */}
        <div className="col-sm-3 sidenav bg-light p-3">
          
          <ul className="nav nav-pills flex-column">
            <li className="nav-item">
              <a className="nav-link text-dark fw-bold " href="#home">HOME</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-dark fw-bold" href="#friends">MANAGE USERS</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-dark fw-bold" href="#family">MANAGE CHARITY ORGANIZATIONS</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-dark fw-bold" href="#photos">VIEW REPORTS</a>
            </li>
          </ul>
          <br />
        </div>

        {/* Main Content */}
        <div className="col-sm-9">
          <h4><small>RECENT POSTS</small></h4>
          <hr />
          


        </div>
      </div>

      
    </div>
  );
};










/*<div className="container">
            
    <div className="row">
        <div className="col col-12 col-sm-12 col-md-6">
            <div className="card mb-3">
                <div className="row g-0">
                    <div className="col-md-4">
                        <img src="https://img.freepik.com/free-vector/usability-testing-concept-illustration_114360-1878.jpg?t=st=1725479064~exp=1725482664~hmac=363808d93e2246adbfc9358c03edbac6b034d334b5fd245edc7593fc08f96615&w=740" className="img-fluid rounded-start" alt="..."/>
                    </div>
                    <div className="col-md-8">
                        <div className="card-body">
                        <br></br><br></br>
                            <h5 className="card-title">ADD SOCIAL WORKERS</h5>
                            <a href="/addcollector" className="btn btn-dark">CLICK HERE</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div className="col col-12 col-sm-12 col-md-6">
            <div className="card mb-3">
                <div className="row g-0">
                    <div className="col-md-4">
                        <img src="https://img.freepik.com/free-vector/personal-site-concept-illustration_114360-2577.jpg?t=st=1729276310~exp=1729279910~hmac=8fb6ade01e87982c69d5d5b81c5316fe284cf0e87416452d3c0baf06b0ae567a&w=740" className="img-fluid rounded-start" alt="..."/>
                    </div>
                    <div className="col-md-8">
                        <div className="card-body">
                        <br></br><br></br>
                            <h5 className="card-title">VIEW WORKERS</h5>
                            <a href="/viewcollector" className="btn btn-dark">CLICK HERE</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    

        <div className="row">
        <div className="col col-12 col-sm-12 col-md-6">
            <div className="card mb-3">
                <div className="row g-0">
                    <div className="col-md-4">
                        <img src="https://img.freepik.com/free-vector/profile-data-concept-illustration_114360-2770.jpg?t=st=1729276596~exp=1729280196~hmac=5a37758b140e2f5c9e331ec26a11fff85f827d0f6e43613e6762faadc52f5cc1&w=740" className="img-fluid rounded-start" alt="..."/>
                    </div>
                    <div className="col-md-8">
                        <div className="card-body">
                        <br></br><br></br>
                            <h5 className="card-title">VIEW USERS</h5>
                            <a href="/viewuser" className="btn btn-dark">CLICK HERE</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        


        <div className="col col-12 col-sm-12 col-md-6">
            <div className="card mb-3">
                <div className="row g-0">
                    <div className="col-md-4">
                        <img src="https://img.freepik.com/free-vector/preferences-concept-illustration_114360-1384.jpg?t=st=1725478982~exp=1725482582~hmac=93116ac20878e2441f894c35afce4a4d6d5cde4be7acfb838930d0acf06b3d91&w=740" className="img-fluid rounded-start" alt="..."/>
                    </div>
                    <div className="col-md-8">
                        <div className="card-body">
                        <br></br><br></br>
                            <h5 className="card-title">VIEW REQUESTS</h5>
                            <a href="/viewrequest" className="btn btn-dark">CLICK HERE</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div className="row">
        <div className="col col-12 col-sm-12 col-md-6">
            <div className="card mb-3">
                <div className="row g-0">
                    <div className="col-md-4">
                        <img src="https://img.freepik.com/free-vector/push-notifications-concept-illustration_114360-4986.jpg?t=st=1725479072~exp=1725482672~hmac=e912d535d535a31ac5594ff97da64f22ee24e5e0610fba9686b88c4e10c9941f&w=740" className="img-fluid rounded-start" alt="..."/>
                    </div>
                    <div className="col-md-8">
                        <div className="card-body">
                        <br></br><br></br>
                            <h5 className="card-title">ASSIGN TASKS</h5>
                            <a href="/admin" className="btn btn-dark">CLICK HERE</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div className="col col-12 col-sm-12 col-md-6">
            <div className="card mb-3">
                <div className="row g-0">
                    <div className="col-md-4">
                        <img src="https://img.freepik.com/free-vector/calculator-concept-illustration_114360-1259.jpg?t=st=1725478471~exp=1725482071~hmac=481f14226a8e5b098f196fdf431ef576f341878350d32d84407fd969a0ebf402&w=740" className="img-fluid rounded-start" alt="..."/>
                    </div>
                    <div className="col-md-8">
                        <div className="card-body">
                        <br></br><br></br>
                            <h5 className="card-title">PAYMENT DETAILS</h5>
                            <a href="/adminpaymenttable" className="btn btn-dark">CLICK HERE</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    
        { <div className="col col-12 col-sm-12 col-md-6">
            <div className="card mb-3">
                <div className="row g-0">
                    <div className="col-md-4">
                        <img src="https://img.freepik.com/free-vector/paying-bills-concept-illustration_114360-22927.jpg?t=st=1725479331~exp=1725482931~hmac=16136bf945248365fd8337273c58d0aa927e46dbd97f36ccd2f9b650785e0036&w=740" className="img-fluid rounded-start" alt="..."/>
                    </div>
                    <div className="col-md-8">
                        <div className="card-body">
                        <br></br><br></br>
                            <h5 className="card-title">GENERATE INVOICE</h5>
                            <a href="/" className="btn btn-dark">CLICK HERE</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>} */
        
        /*<div className="row">
        <div className="col col-12 col-sm-12 col-md-6">
            <div className="card mb-3">
                <div className="row g-0">
                    <div className="col-md-4">
                        <img src="https://img.freepik.com/premium-vector/illustration-vector-graphic-cartoon-character-company-activity-report_516790-1823.jpg?w=740" className="img-fluid rounded-start" alt="..."/>
                    </div>
                    <div className="col-md-8">
                        <div className="card-body">
                        <br></br><br></br>
                            <h5 className="card-title">REPORT</h5>
                            <a href="/workertasks" className="btn btn-dark">CLICK HERE</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    

    
        <div className="col col-12 col-sm-12 col-md-6">
            <div className="card mb-3">
                <div className="row g-0">
                    <div className="col-md-4">
                        <img src="https://img.freepik.com/free-vector/medium-feedback-concept-illustrated_23-2148967056.jpg?t=st=1725478691~exp=1725482291~hmac=41443b1e2df0164c5a56bcbbd8ad4fc1cd1f89942e37e27b3a930962bee9666b&w=740" className="img-fluid rounded-start" alt="..."/>
                    </div>
                    <div className="col-md-8">
                        <div className="card-body">
                        <br></br><br></br>
                            <h5 className="card-title">FEEDBACK DETAILS</h5>
                            <a href="/viewfeedback" className="btn btn-dark">CLICK HERE</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>


  )
}*/

export default AdminDashboard