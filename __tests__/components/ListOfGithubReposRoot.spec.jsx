import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { fromJS } from 'immutable';
import { Route } from '@americanexpress/one-app-router';
import childRoutes from '../../src/childRoutes';
import {
  ListOfGithubReposRoot, mapDispatchToProps, mapStateToProps, load,
} from '../../src/components/ListOfGithubReposRoot';

jest.mock('@americanexpress/one-app-ducks', () => ({
  updateLocale: (input) => `Switching locale to ${input}`,
  loadLanguagePack: (moduleName, { fallbackLocale } = {}) => `I am loading the language pack for ${moduleName} and my fallback locale is ${fallbackLocale}`,
}));

describe('ListOfGithubReposRoot should render as expected', () => {
  it('module should render correct JSX', () => {
    const props = {
      switchLanguage: jest.fn(),
      languageData: {
        locale: 'en-US',
        greeting: 'hi!',
      },
      localeName: 'en-US',
    };
    const renderedModule = shallow(<ListOfGithubReposRoot {...props} />);
    expect(renderedModule.find('#greeting-message')).toMatchSnapshot();
    expect(renderedModule.find('#locale')).toMatchSnapshot();
  });
  it('does not render when language data does not exist', () => {
    const props = {
      switchLanguage: jest.fn(),
      languageData: {
        greeting: null,
      },
      localeName: 'en-US',
    };
    const renderedModule = shallow(<ListOfGithubReposRoot {...props} />);
    expect(toJson(renderedModule)).toBe('');
  });
  it('switches languages when a new locale is selected', () => {
    const props = {
      switchLanguage: jest.fn(),
      languageData: {
        locale: 'en-US',
        greeting: 'hi!',
      },
      localeName: 'en-US',
    };
    const renderedModule = shallow(<ListOfGithubReposRoot {...props} />);
    renderedModule.find('#locale-selector').simulate('change', 'en-CA');
    expect(props.switchLanguage).toHaveBeenCalledWith('en-CA');
  });

  describe('childRoutes', () => {
    it('should return an array of Routes', () => {
      expect(childRoutes()).toEqual(expect.any(Array));
      childRoutes().forEach((route) => expect(route.type).toEqual(Route));
    });
  });

  describe('mapStateToProps', () => {
    it('should return the locale name', () => {
      const mockState = fromJS({
        intl: { activeLocale: 'en-US' },
      });
      expect(mapStateToProps(mockState)).toMatchObject({
        localeName: 'en-US',
      });
    });
    it('should return an empty object for languageData if there is no language data available', () => {
      const mockStateWithNoLanguagePack = fromJS({
        intl: { activeLocale: 'en-US' },
      });
      const mockStateWithIncompleteLanguagePack = fromJS({
        intl: {
          activeLocale: 'en-US',
          languagePacks: {
            'en-US': {
              'list-of-github-repos-root': {
                greeting: 'hello',
              },
            },
          },
        },
      });
      expect(mapStateToProps(mockStateWithNoLanguagePack)).toMatchObject({
        localeName: 'en-US',
        languageData: {},
      });
      expect(mapStateToProps(mockStateWithIncompleteLanguagePack)).toMatchObject({
        localeName: 'en-US',
        languageData: {},
      });
    });
    it('should return languageData if it is available', () => {
      const mockState = fromJS({
        intl: {
          activeLocale: 'en-US',
          languagePacks: {
            'en-US': {
              'list-of-github-repos-root': {
                data: {
                  greeting: 'hello',
                },
              },
            },
          },
        },
      });
      expect(mapStateToProps(mockState)).toMatchObject({
        localeName: 'en-US',
        languageData: {
          greeting: 'hello',
        },
      });
    });
  });

  describe('mapDispatchToProps', () => {
    it('should update the browser locale and then reload the language pack', async () => {
      const mockDispatch = jest.fn();
      const { switchLanguage } = mapDispatchToProps(mockDispatch);
      await switchLanguage({ target: { value: 'en-US' } });
      expect(mockDispatch).toHaveBeenNthCalledWith(1, 'Switching locale to en-US');
      expect(mockDispatch).toHaveBeenNthCalledWith(2, 'I am loading the language pack for list-of-github-repos-root and my fallback locale is en-US');
    });
  });

  describe('holocronModule load', () => {
    it('should load language pack for list-of-github-repos-root module', () => {
      const mockDispatch = jest.fn();
      load()(mockDispatch);
      expect(mockDispatch.mock.calls[0][0]).toBe('I am loading the language pack for list-of-github-repos-root and my fallback locale is en-US');
    });
  });
});
