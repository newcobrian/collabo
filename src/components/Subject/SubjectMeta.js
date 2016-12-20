import SubjectActions from './SubjectActions';
import { Link } from 'react-router';
import React from 'react';

const SubjectMeta = props => {
  const subject = props.subject;
  return (
    <div className="article-meta">
        <img src={subject.image} />

      <div className="info">
        {/* <Link to={`@${subject.description}`} className="author"> 
          {subject.description}
        </Link> */}
        <span className="date">
          {subject.description}
        </span> 
      </div>

      <SubjectActions canModify={props.canModify} subject={subject} />
    </div>
  );
};

export default SubjectMeta;