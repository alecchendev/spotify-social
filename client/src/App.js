import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Home, Profile, Search } from './pages/index.js';
import Layout from './layout.js';
import './styles/index.css';

function App() {
  return (
    <Layout>
      <Router>
        <Switch>
          <Route path="/" component={Home} exact />
          <Route path="/search" component={Search} />
          <Route path="/:id" component={Profile} />
        </Switch>
      </Router>
    </Layout>
  );
}

export default App;
