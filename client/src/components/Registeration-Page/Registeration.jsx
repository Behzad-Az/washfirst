import React, {Component} from 'react';
import { browserHistory, Link } from 'react-router';
import AlertContainer from 'react-alert';

import Navbar from '../Partials/Navbar.jsx';

class Registeration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      email: '',
      gender: '',
      min_top_size: '',
      max_top_size: '',
      min_bottom_size: '',
      max_bottom_size: '',
      min_shoe_size: '',
      max_shoe_size: '',
      postal_code: '',
      available_username: false,
      available_email: false,
      topSizes: ['-', 1, 2, 3, 4, 5, 6],
      bottomSizes: ['-', 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44],
      shoeSizes: ['-', 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
    };

    this.alertOptions = {
      offset: 14,
      position: 'bottom left',
      theme: 'dark',
      transition: 'scale'
    };

    this.icons = {
      info: <i className="fa fa-info-circle fa-fw" aria-hidden="true"/>,
      error: <i className="fa fa-exclamation-circle fa-fw" aria-hidden="true"/>
    };

    this.handleChange = this.handleChange.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getLocation = this.getLocation.bind(this);
    this.checkUsernameAndEmail = this.checkUsernameAndEmail.bind(this);
  }

  showAlert(content, type) {
    msg.show(content, {
      time: 2000,
      type: type,
      icon: this.icons[type]
    });
  }

  getLocation(callback) {
    return new Promise((resolve, reject) => {
      let geocoder = new google.maps.Geocoder();
      let address = this.state.postal_code;
      geocoder.geocode (
        { 'address': address },
        (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          let coordinates = {
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng()
          };
          resolve(coordinates);
        } else {
          this.showAlert('Invalid postal code', 'error');
          reject();
        }
      });
  });
}

  handleChange(e) {
    let key = e.target.name;
    let value = e.target.value;
    if (key === 'username' || 'email') this.checkUsernameAndEmail(key, value);
    let obj = {};
    obj[key] = value;
    this.setState(obj);
  }

  checkUsernameAndEmail(column, value) {
    $.ajax({
      method: 'POST',
      url: `/api/checkUsernameAndEmail`,
      data: {column, value},
      success: ((response) => {
        this.setState(response);
      })
    });
  }

  validateForm() {
    return (
      this.state.username &&
      this.state.password &&
      this.state.email &&
      this.state.min_top_size &&
      this.state.max_top_size &&
      this.state.min_bottom_size &&
      this.state.max_bottom_size &&
      this.state.min_shoe_size &&
      this.state.max_shoe_size &&
      this.state.postal_code &&
      this.state.available_username &&
      this.state.available_email
    );
  }

  handleSubmit() {
    this.getLocation().then((coordinates) => {
      let newUserInfo = this.state;
      newUserInfo.address_lat = coordinates.lat;
      newUserInfo.address_lng = coordinates.lng;
      delete newUserInfo.postal_code;
      delete newUserInfo.topSizes;
      delete newUserInfo.bottomSizes;
      delete newUserInfo.shoeSizes;
      $.ajax({
        method: 'POST',
        url: `/api/register`,
        data: newUserInfo,
        success: ((response) => {
          browserHistory.push('/');
        })
      });
    });
  }

  render() {

    return (
      <div>

      <Navbar loggedIn={false} registerPage={true} />
      <div className="login-registration">

        <div className="login-register-main-container">

          <label className="label">Username:</label>
          <p className="control has-icon has-icon-left has-icon-left">
            <input className="input is-success" name="username" type="text" placeholder="Enter username here" onChange={this.handleChange} />
            <i className="fa fa-user fa-fw" aria-hidden="true" />
          </p>

          <label className="label">Password:</label>
          <p className="control has-icon has-icon-left">
            <input className="input is-success" name="password" type="password" placeholder="Enter password here" onChange={this.handleChange} />
            <i className="fa fa-key fa-fw" aria-hidden="true" />
          </p>

          <label className="label">Email:</label>
          <p className="control has-icon has-icon-left">
            <input className="input is-success" name="email" type="email" placeholder="What's the best email to reach you?" onChange={this.handleChange} />
            <i className="fa fa-at fa-fw" aria-hidden="true" />
          </p>

          <label className="label">Postal Code:</label>
          <p className="control has-icon has-icon-left">
            <input className="input is-success" name="postal_code" type="text" placeholder="What's your postal code?" onChange={this.handleChange} />
            <i className="fa fa-map-marker fa-fw" aria-hidden="true" />
          </p>

          <p className="control">
            <label className="radio">
              <input type="radio" name="gender" value="male" onChange={this.handleChange} checked={this.state.gender === 'male'} /> Male
            </label>
            <label className="radio">
              <input type="radio" name="gender" value="female" onChange={this.handleChange} checked={this.state.gender === 'female'} /> Female
            </label>
          </p>

          <label className="label">Top Size - Minimum and Maximum:</label>
          <p className="control">
            <span className="select">
              <select name="min_top_size" onChange={this.handleChange}>
              {
                this.state.topSizes.map((size, index) => {
                  return <option key={index}>{size}</option>
                })
              }
              </select>
            </span>
            <span> To </span>
            <span className="select">
              <select name="max_top_size" onChange={this.handleChange}>
                {
                  this.state.topSizes.map((size, index) => {
                    return <option key={index}>{size}</option>
                  })
                }
              </select>
            </span>
            <span> 1: XS 2: S 3: M 4: L 5: XL 6: XXL</span>
          </p>


          <label className="label">Bottom Size - Minimum and Maximum:</label>
          <p className="control">
            <span className="select">
              <select name="min_bottom_size" onChange={this.handleChange}>
              {
                this.state.bottomSizes.map((size, index) => {
                  return <option key={index}>{size}</option>
                })
              }
              </select>
            </span>
            <span> To </span>
            <span className="select">
              <select name="max_bottom_size" onChange={this.handleChange}>
                {
                  this.state.bottomSizes.map((size, index) => {
                    return <option key={index}>{size}</option>
                  })
                }
              </select>
            </span>
          </p>


          <label className="label">Shoe Size - Minimum and Maximum:</label>
          <p className="control">
            <span className="select">
              <select name="min_shoe_size" onChange={this.handleChange}>
              {
                this.state.shoeSizes.map((size, index) => {
                  return <option key={index}>{size}</option>
                })
              }
              </select>
            </span>
            <span> To </span>
            <span className="select">
              <select name="max_shoe_size" onChange={this.handleChange}>
                {
                  this.state.shoeSizes.map((size, index) => {
                    return <option key={index}>{size}</option>
                  })
                }
              </select>
            </span>
          </p>

          <p className="control">
            <button className="button submit is-primary" disabled={!this.validateForm()} onClick={this.handleSubmit}>Submit</button>
            <Link className="button is-link" to="/">Cancel</Link>
          </p>

        </div>
      </div>
      <AlertContainer ref={(a) => global.msg = a} {...this.alertOptions} />
      </div>
    );
  }
}

export default Registeration;
