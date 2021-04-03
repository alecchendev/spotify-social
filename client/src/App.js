import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Home, Account, Profile } from './pages/index.js';
import Layout from './components/layout.js';
import './styles/index.css';

function App() {
  return (
    <Layout>
      <Router>
        <Switch>
          <Route path="/" component={Home} exact />
          <Route path="/account/:id" component={Account} />
          <Route path="/:id" component={Profile} />
        </Switch>
      </Router>
    </Layout>
  );
}

export default App;
