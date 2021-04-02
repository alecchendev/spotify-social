import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Home, Profile, Search } from './pages/index.js';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Home} exact />
        <Route path="/search" component={Search} />
        <Route path="/:id" component={Profile} />
      </Switch>
    </Router>
  );
}

export default App;
