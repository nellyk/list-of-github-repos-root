import { configureIguazuREST } from 'iguazu-rest';
import repos from './repos';

export const configureIguazu  = () => {
  configureIguazuREST({
    resources: {
      repos: repos,
    },
    getToState: (state) => state.getIn(['modules','list-of-github-repos-root','resources']),
  });
};
export default configureIguazu;