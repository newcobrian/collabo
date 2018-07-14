import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import * as Actions from '../actions';
import * as Constants from '../constants';

const mapStateToProps = state => ({
  ...state.projectList,
  currentUser: state.common.currentUser,
  authenticated: state.common.authenticated,
  userInfo: state.common.userInfo
});

class ProjectList extends React.Component {
  constructor() {
    super();
  }

  componentWillMount() {
    this.props.loadProjectList(this.props.authenticated)
  }

  componentWillUnmount() {
    this.props.unloadProjectList(this.props.authenticated)
  }

  render() {
    console.log(JSON.stringify(this.props.projectList))
    if(!this.props.projectList) return null;
    return (
      <div>
        LIST OF PROJECTS
        {
          this.props.projectList.map((projectItem, index) => {
            return (
              <div>
                <Link to={'/project/' + projectItem.projectId}>{projectItem.name}</Link>
              </div>
            );
          })
        }
      </div>
    );
  }
}

export default connect(mapStateToProps, Actions)(ProjectList);