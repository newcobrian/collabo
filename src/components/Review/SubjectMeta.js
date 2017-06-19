import SubjectActions from './SubjectActions';
import { Link } from 'react-router';
import React from 'react';
import ProxyImage from './ProxyImage';

const SubjectMeta = props => {
  const subject = props.subject;
  return (
    <div className="subject-image">
        <ProxyImage src={subject.image} />

      <div className="info">
        {/* <Link to={`${subject.description}`} className="author"> 
          {subject.description}
        </Link> */}
      </div>

      <SubjectActions canModify={props.canModify} subject={subject} />
    </div>
  );
};

export default SubjectMeta;