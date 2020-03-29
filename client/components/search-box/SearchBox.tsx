import React, { ChangeEvent } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { 
    combineReducers,
    createStore,
    bindActionCreators,
    applyMiddleware 
} from '@reduxjs/toolkit';

import thunk from 'redux-thunk';

import { 
    combineEpics,
    ofType,
    StateObservable,
    createEpicMiddleware
} from 'redux-observable';

import { 
    Observable,
    merge,
    from 
} from 'rxjs';

import { 
    filter,
    mapTo,
    delay,
    withLatestFrom,
    map,
    concatAll,
    debounce,
    throttle,
    throttleTime,
    debounceTime,
    concatMap,
    takeUntil,
    distinctUntilChanged,
    switchMap 
} from 'rxjs/operators';

import { 
    SearchApi,
    StatusApi 
} from './mock-apis';

interface Action {
    type: string;
    payload: any;
}

/** Action Types */
const SET_SEARCH_INPUT = 'searchBox:SET_SEARCH_INPUT';
const SET_SEARCH_RESULTS = 'searchBox:SET_SEARCH_RESULTS';
const SET_SEARCH_SUGGESTIONS = 'searchBox:SET_SEARCH_SUGGESTIONS';
const SET_ERROR_MESSAGE = 'searchBox:SET_ERROR_MESSAGE';
const SET_LOADING = 'searchBox:SET_LOADING';
const SET_LOADING_IMAGE = 'searchBox:SET_LOADING_IMAGE';
const INCREMENT = 'searchBox:INCREMENT';

/** Action Creators */
function setSearchInput(searchInput: string) {
    return {
        type: SET_SEARCH_INPUT,

        payload: {
            searchInput: searchInput,
        }
    }
}

function setSearchResults(searchResults: string[]): Action {
    return {
        type:  SET_SEARCH_RESULTS,
        payload: {
            searchResults: searchResults
        }
    }
}

function setSearchSuggestions(searchSuggestions: string[]): Action {
    return {
        type: SET_SEARCH_SUGGESTIONS,
        payload: {
            searchSuggestions: searchSuggestions
        }
    }
}

function setErrorMessage(errorMessage: string): Action {
    return {
        type: SET_ERROR_MESSAGE,
        payload: {
            errorMessage: errorMessage
        }
    }
}

function increment(amount: number): Action {
    return {
        type: INCREMENT,
        payload: {
            amount: amount
        }
    }
}

type ReduxAsyncThunk = (dispatch, getState) => Promise<void>;

/** Example of a Thunk (https://github.com/reduxjs/redux-thunk) */
// part of the benefit is that whether an action is async or sync is abstracted away from the consuming components
// components dispatch all actions the same way
function updateSearchSuggestionsAsync(search: string): ReduxAsyncThunk {
    return async (dispatch, getState) => { // passed in by redux-thunk, no need to bind this function to dispatch
        try {
            dispatch({
                type: SET_LOADING,
                payload: {
                    loading: true
                }
            });
            console.log("search in thunk: ", search)
            const searchSuggestions = await searchApi.getSearchSuggestions(search);
            dispatch(setSearchSuggestions(searchSuggestions)); // this could be replaced with a bound action creator i guess
        } catch (err) {
            dispatch(setErrorMessage('Failed to get search suggestions'))
        }
    }
}

function updateSearchResultsAsync(search: string): ReduxAsyncThunk {
    return async (dispatch, getState) => {
        try {
            const searchResults = await searchApi.search(search);
            dispatch(setSearchResults(searchResults));
        } catch (err) {
            dispatch(setErrorMessage('Failed to get search suggestions'))
        }
    }
}

// Clear error message after some time or on user action?


interface SearchBoxReduxState {
    searchInput: string;
    searchResults: string[];
    searchSuggestions: string[];
    errorMessage: string;
    loading: boolean;
    loadingImage: string;
    counter: number;
}

const defaultState: SearchBoxReduxState = {
    searchInput: '',
    searchResults: [],
    searchSuggestions: [],
    errorMessage: '',
    loading: false,
    loadingImage: '',
    counter: 0,
}
/** 
* Redux state should be as flat as possible, keys should be IDs, ... 
*/

/** Reducers */
function searchBoxReducer(state: SearchBoxReduxState=defaultState, action: Action): SearchBoxReduxState {
    switch(action.type) {
        case SET_SEARCH_INPUT:
            return {...state, searchInput: action.payload.searchInput};
        case SET_SEARCH_RESULTS:
            return {...state, searchResults: action.payload.searchResults};
        case SET_SEARCH_SUGGESTIONS:
            return {...state, searchSuggestions: action.payload.searchSuggestions};
        case SET_ERROR_MESSAGE:
            return {...state, errorMessage: action.payload.errorMessage};
        case SET_LOADING:
            return {...state, loading: action.payload.loading};
        case SET_LOADING_IMAGE:
            return {...state, loadingImage: action.payload.image};
        case INCREMENT:
            console.log("was: ", state.counter);
            console.log("incrementing in reducer by: ", action.payload.amount); 
            const newState = {...state, counter: state.counter + action.payload.amount};
            console.log("new coutner: ", newState.counter);
            return newState;
        default:
            return state;
    }
}

const rootReducer = combineReducers({
    searchBox: searchBoxReducer,
});


const searchApi = new SearchApi();
const statusApi = new StatusApi();



function updateSearchFieldEpic(action$: any, state$: any): any {
    return action$.pipe(
        ofType(SET_SEARCH_INPUT),
        debounceTime(500),
        distinctUntilChanged((prevAction: Action, newAction: Action) => (
            prevAction.payload.searchInput === newAction.payload.searchInput
        )),
        switchMap((action: Action): any => {
            console.log('new destinct search')
            return from(searchApi.getSearchSuggestions(action.payload.searchInput));
        }),
        distinctUntilChanged((prevResults, newResults) => JSON.stringify(prevResults) === JSON.stringify(newResults)),
        map((results: string[]) => {
            console.log("results (should only get called once for each uninterupted series of 'new destinct search')", results);
            return setSearchSuggestions(results)
        })
    );
}


const rootEpic = combineEpics(
    updateSearchFieldEpic
);

const epicMiddleware = createEpicMiddleware();

/** Store and Binding actions to dispatch 
 * https://redux-observable.js.org/docs/basics/SettingUpTheMiddleware.html
*/

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(
    rootReducer,
    composeEnhancers(
        applyMiddleware(thunk),
        applyMiddleware(epicMiddleware)
    )
);

epicMiddleware.run(rootEpic);

const boundSearchBoxActions = bindActionCreators({
    setSearchInput: setSearchInput,
    setSearchResults: setSearchResults,
    setSearchSuggestions: setSearchSuggestions,
    setErrorMessage: setErrorMessage,
    increment: increment,
}, store.dispatch);




interface SearchBoxProps {
    updateSearchSuggestions: (search: string) => ReduxAsyncThunk;
    updateSearchResults: (search: string) => ReduxAsyncThunk;
}

class SearchBox extends React.Component<any, any> {
    search(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === 'enter') {
            this.props.updateSearchResultsAsync();
        }
    }

    render() {
        return (
            <div>
                <input 
                    type='text' 
                    name='searchInput' 
                    value={this.props.searchInput} 
                    onChange={(event: ChangeEvent<HTMLInputElement>) => this.props.setSearchInput(event.target.value)} 
                    onKeyDown={this.search}
                />
                <button onClick={() => this.props.updateSearchResults()}>Get Search Results</button>
                <button onClick={() => this.props.updateSearchSuggestions()}>Get Search Suggestions</button>
                
                <button onClick={() => { console.log("onClick called!"); this.props.increment(1)}}>Increment by 1</button>
                <button onClick={() => this.props.increment(2)}>Increment by 2</button>

                { this.props.loading &&
                    <span>Loading shit</span>
                }
                { this.props.loadingImage && 
                    <img src={this.props.loadingImage}/>
                }
                <div>
                    <h4>Search Suggestions</h4>
                    <ul>
                        { this.props.searchSuggestions.map((suggestion, index) => (
                            <li key={index}>{suggestion}</li>
                        ))}
                    </ul>
                    <h4>Search Results</h4>
                    <ul>
                        { this.props.searchResults.map((result, index) => (
                            <li key={index}>{result}</li>
                        ))}
                    </ul>
                    <p>The counter is at: {this.props.counter}</p>
                </div>
            </div>
        )
    }
}

/** Binding React Component to Redux */
const mapStateToProps = (state, ownProps) => ({ // here you could do remapping of props given to the container
    searchInput: state.searchBox.searchInput,
    searchResults: state.searchBox.searchResults,
    searchSuggestions: state.searchBox.searchSuggestions,
    errorMessage: state.searchBox.errorMessage,
    loading: state.searchBox.loading,
    loadingImage: state.searchBox.loadingImage,
    counter: state.searchBox.counter,
});

// When given to connect(), these actionCreators will automatically be bound to dispatch
const mapActionsToProps = { // maybe better to call it mapDispatchToProps?
    // setSearchResults: boundSearchBoxActions.setSearchResults, // this is done in the thunk, I just need to dispatch the async ops
    // updateSearchSuggestions: boundSearchBoxActions.setSearchSuggestions, // this is done in the thunk 
    setSearchInput: setSearchInput,
    updateSearchSuggestions: updateSearchSuggestionsAsync,
    updateSearchResults: updateSearchResultsAsync,
    increment: increment,
};

// or another way of doing with with more flexibility:
function mapDispatchToPros(dispatch) {
    return {
        increment: (amount) => dispatch(increment(amount))
    }
}

export default connect(mapStateToProps, mapActionsToProps)(SearchBox);




/** Observables */

const observer = {
    onNext: () => {

    },
    onError: () => {

    },
    onCompleted: () => {

    },
}

/** Adapting setTimeout and DOM events into observables */
function timeout(time) {
    return {
        forEach(observer) {
            var handle = setTimeout(() => { // Set timeout is not called before we call forEach!
                observer.onNext(undefined);
                observer.onCompleted();
            }, time);
            return {
                dispose: function () {
                    clearTimeout(handle)
                }
            }
        }
    }
}

function fromEvent(dom, eventName) {
    return {
        forEach(observer) {
            const handler = (e) => {
                observer.onNext(e);
            };
            dom.addEventListened(eventName, handler)
            return {
                dispose: function () {
                    dom.removeEventListener(eventName, handler);
                }
            }
        }
    }
}

