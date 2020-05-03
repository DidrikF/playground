import React, { useEffect } from 'react';
import { HashRouter as Router } from 'react-router-dom';
import Route from 'react-router-dom/Route';
import Switch from 'react-router-dom/Switch';
import Link from 'react-router-dom/Link';
import Prompt from 'react-router-dom/Prompt';

/*
BrowserRouter as Router,
  Switch,
  Route,
  Link

*/

const BlockNavigationTest = () => {
    return (
        <Router>
            <div>
                <nav>
                    <ul>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/about">About</Link>
                        </li>
                        <li>
                            <Link to="/users">Users</Link>
                        </li>
                        <li>
                            <Link to='/leaveguard'>Leave Guard</Link>
                        </li>
                    </ul>
                </nav>

                {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
                <Switch>
                    <Route path='/about'>
                        <About />
                    </Route>
                    <Route path='/users'>
                        <Users />
                    </Route>

                    <Route path='/'>
                        <Home />
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}


/*
<Route path='/leaveguard'>
    <RouteLeavingGuard 
        when={() => true} 
        shouldBlockNavigation={(nextLocation: string) => {
            console.log("Next location: ", nextLocation) 
            return true;
        }} 
        navigate={(lastLocation: any) => {
            console.log("lastLocation: ", lastLocation);
        }} />
</Route>
*/

const ExtendedPrompt = ({shouldBlock, message}) => {
    useEffect(() => {    
        const beforeUnloadHandler = (event: BeforeUnloadEvent) => {
            if (shouldBlock) {
                console.log("beforeUnloadEvent: ", event)
                event.preventDefault();
                event.returnValue = message;
                return message;
            }
        };
        
        window.addEventListener('beforeunload',  beforeUnloadHandler);
        return () => window.removeEventListener('beforeunload', beforeUnloadHandler);
    }, [shouldBlock, message]);


    let when;
    if (typeof shouldBlock === 'function') {
        when = shouldBlock();
    } else {
        when = shouldBlock;
    }

    return <Prompt when={when} message={message} />
}

function Home() {
    return <>
        <ExtendedPrompt shouldBlock={true} message='Du har ikke lagret endringene dine, er du sikker på at du vil forlate side?' />
        <h2>Home</h2>;
    </>
}

function About() {

    const shouldBlock = () => {
        return true;
    }

    return <>
        <ExtendedPrompt shouldBlock={shouldBlock} message='Du har ikke lagret endringene dine, er du sikker på at du vil forlate side?' />
        <h2>About</h2>;
    </>
}

function Users() {
    return <>
        <ExtendedPrompt shouldBlock={true} message='Du har ikke lagret endringene dine, er du sikker på at du vil forlate side?' />
        <h2>Users</h2>
    </>
}

/*
const CustomModal = ({visible, onCancel, onConfirm}) => {

    if (visible) {
        return (
            <div>
                Are you sure you want to leave?
                <button onClick={onCancel}>Close Modal</button>
                <button onClick={onConfirm}>Confirm Modal</button>
    
            </div>
        );
    } else {
        return (
            <div>
                Modal is not visible atm
            </div>
        ) 
    }
}


interface RouteLeavingGuardProps {
    shouldBlockNavigation: (nextLocation: string) => boolean;
    navigate: (lastLocation: any) => void;
    when: any;
}

interface RouterLeavingGuardState {
    modalVisible: boolean;
    lastLocation: any;
    confirmedNavigation: boolean;
}

export class RouteLeavingGuard extends React.Component<RouteLeavingGuardProps, RouterLeavingGuardState> {
    
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            lastLocation: null,
            confirmedNavigation: false,
        }
    }

    componentDidMount() {

    }
    
    showModal = (location) => this.setState({
        modalVisible: true,
        lastLocation: location,
    })
    
    closeModal = (callback) => this.setState({
        modalVisible: false
    }, callback)

    handleBlockedNavigation = (nextLocation) => {
        console.log("Next location: ", nextLocation);

        const { confirmedNavigation } = this.state
        const { shouldBlockNavigation } = this.props
        if (!confirmedNavigation && shouldBlockNavigation(nextLocation)) {
            this.showModal(nextLocation)
            return false
        }

        return true
    }
    handleConfirmNavigationClick = () => this.closeModal(() => {
        const { navigate } = this.props
        const { lastLocation } = this.state
        if (lastLocation) {
            this.setState({
                confirmedNavigation: true
            }, () => {
                // Navigate to the previous blocked location with your navigate function     
                navigate(lastLocation.pathname)
            })
        }
    })
    render() {
        const { when } = this.props
        const { modalVisible, lastLocation } = this.state
        return (
            <>
                <Prompt
                    when={when()}
                    message={this.handleBlockedNavigation} /
                >
                <CustomModal
                    visible={modalVisible}
                    onCancel={this.closeModal}
                    onConfirm={this.handleConfirmNavigationClick}
                />
            </>
        )
    }
}
*/

export default BlockNavigationTest;