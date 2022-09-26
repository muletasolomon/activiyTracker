
import React from "react"

export default function (props) {
  return (
    <div className="Auth-form-container">
      <form className="Auth-form">
        <div className="Auth-form-content">
          <h3 className="Auth-form-title">Sign In</h3>
          <div className="form-group mt-3">
            <input
              type="phone"
              className="form-control mt-1 login-edit"
              placeholder="Enter phone"
            />
          </div>
          <div className="form-group mt-3">
            <input
              type="password"
              className="form-control mt-1 login-edit"
              placeholder="Enter password"
            />
          </div>
          <div className="d-grid gap-2 mt-3 login-button-holder">
            <button type="submit" className="btn btn-primary login100-form-btn">
              Login
            </button>
          </div>
        
        </div>
      </form>
    </div>
  )
}