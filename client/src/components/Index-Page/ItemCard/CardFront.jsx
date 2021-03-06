import React, {Component} from 'react';
import ReactDOM from 'react-dom';

class CardFront extends Component {
  render() {
    return (
      <div className="card card-front">
          <div className="card-image">
            <figure className="image is-4by3">
              <img src={this.props.item.img_url} alt="" />
            </figure>
          </div>
          <div className="card-content">
            <div className="media">
              <div className="media-content">
                <p className="title is-5">@{this.props.item.owner.username}</p>
              </div>
            </div>
            <div className="content">
              <p>Size: {this.props.item.size}</p>
              <p className='description'>{this.props.item.description}</p>
              { this.props.item.tags.map((tag, i) => {
                return <span key={i} className="tag item-tag">{tag}</span>
              })}
              <br />
              <p className='date'><small>posted on: {this.props.item.item_created_at.slice(0, 10)}</small></p>
            </div>
          </div>
          <div className="card-footer button-container">
            <button className="card-footer-item" type="button" onClick={this.props.showBack}>Show back</button>
          </div>
        </div>
    );
  }
}

export default CardFront;
