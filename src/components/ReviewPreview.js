import React from 'react';
import { Link } from 'react-router';

const ReviewPreview = props => {
  const review = props.review;

  return (
    <div className="article-preview">
      <div className="article-meta">
        <Link to={`@${review.author.username}`}>
          <img src={review.author.image} />
        </Link>

        <div className="info">
          <Link className="author" to={`@${review.author.username}`}>
            {review.author.username}
          </Link>
          <span className="date">
            {new Date(review.createdAt).toDateString()}
          </span>
        </div>

        <div className="pull-xs-right">
          <button className="btn btn-sm btn-outline-primary">
            <i className="ion-heart"></i> {review.favoritesCount}
          </button>
        </div>
      </div>

      <Link to={`subject/${review.id}`} className="preview-link">
        <h1>{review.title}</h1>
        <p>{review.description}</p>
        <span>Read more...</span>
        <ul className="tag-list">
          {
            review.tagList.map(tag => {
              return (
                <li className="tag-default tag-pill tag-outline" key={tag}>
                  {tag}
                </li>
              )
            })
          }
        </ul>
      </Link>
    </div>
  );
}

export default ReviewPreview;