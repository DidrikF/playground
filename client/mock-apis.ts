/** Mock Async API */
export class SearchApi {
    previousSearches: string[];
    constructor() {
        this.previousSearches = ['dogs', 'cats', 'catnip', 'cat fur', 'catz are dope', 'giraffe', 'shark'];
    }

    matchPreviousSearches(search: string): string[] {
        return this.previousSearches.filter((prevSearch) => {
            // console.log("search: ", search)
            return prevSearch.substring(0, search.length).toLowerCase() === search.toLowerCase()
        });
    }

    getSearchSuggestions(search: string): Promise<string[]> {
        return new Promise((resolve, reject) => {
            console.log('API performs search with query: ', search)
            window.setTimeout(() => {
                console.log('API resolves with results')
                resolve(this.matchPreviousSearches(search))
            }, Math.floor(2000));
        })
    }

    search(search: string): string[] {
        this.previousSearches.push(search);
        return [`Search results for ${search}...`];
    }
}

export class StatusApi {
    status: string;
    counter: number;
    constructor() {
        this.status = 'active';
        this.counter = 0; 
    }
    getStatus(): Promise<string> {
        return new Promise((accept, reject) => {
            window.setTimeout(() => {
                if (this.status === 'error' || this.status === 'inactive') {
                    reject(this.status);
                }
                if (Math.random() > 0.90) {
                    this.status = 'error';
                    reject(this.status);
                }
                if (this.counter >= 20) {
                    this.status = 'inactive';
                    reject(this.status);
                }
                this.counter += 1;
                accept(this.status);
            }, Math.random());
        })
    } 
}


/** 
 * Epics (function which takes a stream of action and retuns a stream of actions) 
 * When an Epic receives an action, it has already been run through your reducers and the state updated.
 * You do dispatch actions in Epics that are parallell to the normal Redux workflow 
*/

// function someEpic(action$: Observable<Action>, state$: StateObservable<SearchBoxReduxState>): Observable<Action> {
/*
function someEpic(action$: any, state$: any): any {
    return action$.pipe(
        ofType(SET_LOADING),
        withLatestFrom(state$),
        // filter(([, state]) => state.loading === false),
        delay(1000),
        map(() => increment(1)),
        mapTo({
            type: SET_LOADING_IMAGE,
            payload: {
                image: 'wait-image.jpg'
            }
        })
    )
}

function someOtherEpic(action$: any, state$: any): any {
    return action$.pipe(
        filter((action: any) => action.type === INCREMENT && action.payload.amount === 2),
        map(action => increment(10))
    );
}

const rootEpic = combineEpics(
    someEpic,
    someOtherEpic
);

// or you can write
const rootEpic2 = (action$, state$) => merge(
    someEpic(action$, state$),
    someOtherEpic(action$, state$)
);

*/