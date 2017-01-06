import React, { Component, PropTypes } from 'react';
import connectContainer from 'redux-static';

import Help from '../components/Help';
import Header from '../components/Header';
import { authActions, configActions } from '../actions';
import RequireAuthentication from './RequireAuthentication';

export default RequireAuthentication(connectContainer(class App extends Component {
  static stateToProps = (state) => ({
    config: state.config
  });

  static actionsToProps = {
    ...authActions,
    ...configActions
  }

  static propTypes = {
    logout: PropTypes.func.isRequired,
    config: PropTypes.object.isRequired,
    fetchConfiguration: PropTypes.func.isRequired
  }

  componentWillMount() {
    this.props.fetchConfiguration();
  }

  render() {
    return (
      <div>
        <Header tenant={window.config.AUTH0_DOMAIN} onLogout={this.props.logout} />
        <div className="container">
          <div className="row">
            <section className="content-page current">
              <div className="col-xs-12">
                <div className="row">
                  <div className="col-xs-12 content-header">
                    <ol className="breadcrumb">
                      <li>
                        <a href={window.config.AUTH0_MANAGE_URL}>Auth0 Dashboard</a>
                      </li>
                      <li>
                        <a href={`${window.config.AUTH0_MANAGE_URL}/#/extensions`}>Extensions</a>
                      </li>
                    </ol>
                    <h1 className="pull-left" style={{ paddingTop: '10px' }}>Deploy CLI</h1>
                  </div>
                </div>
                <Help tenant={window.config.AUTH0_DOMAIN} clientId={window.config.AUTH0_CLIENT_ID} />
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }
}));
