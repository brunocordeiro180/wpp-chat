import Home from './screens/Home';
import SocketContext from './context/socketContext';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import LoginPage from './screens/LoginPage';
import { isAuthenticated } from "./services/auth";
import * as io from 'socket.io-client';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import config from './config/config';

const socket = io(config.endpoint);

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isAuthenticated() ? (
        <Component {...props} />
      ) : (
        <Redirect to={{ pathname: "/login", state: { from: props.location } }} />
      )
    }
  />
);

function App() {
  return (
    <div className="App">
        <Router>
          <Switch>
            <SocketContext.Provider value={socket} >
              <ToastContainer
                position="top-right"
                autoClose={15000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                pauseOnHover
              />
              <PrivateRoute exact path="/" component={Home} />
              <Route exact path="/employees" component={Home} />
              <Route exact path="/login" component={LoginPage} />
            </SocketContext.Provider>
          </Switch>
        </Router>
    </div>
  );
}

export default App;
