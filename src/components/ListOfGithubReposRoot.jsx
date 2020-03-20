import React from 'react';
import PropTypes from 'prop-types';
import { loadLanguagePack, updateLocale } from '@americanexpress/one-app-ducks';
import { FormattedMessage, IntlProvider } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { holocronModule } from 'holocron';
import { fromJS } from 'immutable';
import { configureIguazuSSR } from 'iguazu-holocron';
import { queryCollection } from 'iguazu-rest';
import { connectAsync } from 'iguazu';
import childRoutes from '../childRoutes';
import reducer from '../duck';

export const ListOfGithubReposRoot = ({
  children, repos, isLoading, loadedWithErrors,
}) => {
  if (isLoading()) {
    return <p>Loading...</p>;
  }

  if (loadedWithErrors()) {
    return <p>Oh no! Something went wrong</p>;
  }

  return (
    <React.Fragment>
      <div>{JSON.stringify(repos.items, null, 2)}</div>
      {
      repos.map(({
        id,name
      }) => (
      <li key={id.toString()}>
        {name}
      </li>
      ))
      }

      {children}
    </React.Fragment>
  );
}

ListOfGithubReposRoot.propTypes = {
  children: PropTypes.node,
  isLoading: PropTypes.func.isRequired,
  loadedWithErrors: PropTypes.func.isRequired,
  moduleState: PropTypes.shape({
    repos: PropTypes.shape({}),
  }).isRequired,
};

ListOfGithubReposRoot.defaultProps = {
  children: null,
};

// Read about childRoutes:
// https://github.com/americanexpress/one-app/blob/master/docs/api/modules/Routing.md#childroutes
ListOfGithubReposRoot.childRoutes = childRoutes;

// Read about appConfig:
// https://github.com/americanexpress/one-app/blob/master/docs/api/modules/App-Configuration.md
/* istanbul ignore next */
if (!global.BROWSER) {
  ListOfGithubReposRoot.loadModuleData = configureIguazuSSR;
  // eslint-disable-next-line global-require
  ListOfGithubReposRoot.appConfig = require('../appConfig').default;
}


function loadDataAsProps ({ store: { dispatch } }) {
  return {
    repos: () => dispatch(queryCollection({ resource: 'repos' })),
  };
};


loadDataAsProps.ssr = true;

ListOfGithubReposRoot.loadDataAsProps = loadDataAsProps;

export default compose(
  holocronModule({
    name: 'list-of-github-repos-root',
    reducer,
  }),
  connectAsync({ loadDataAsProps }),
)(ListOfGithubReposRoot);
