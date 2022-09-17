import './App.css';
import { HashRouter as Router, Route, Switch, Link } from 'react-router-dom'
import { Modal } from 'antd';
import Formula from '../src/pages/Formula';
import TargetArea from '../src/pages/TargetArea'
import Homepage from '../src/pages/Home'
import TargetAreaList from '../src/pages/TargetAreaList'
import FormulaList from '../src/pages/FormulaList';
import 'antd/dist/antd.css';

function App() {
  return (
    <>
      <Modal title="Basic Modal">
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    <Router>
        <Homepage>
          <Switch>
            <Route exact path="/" component={Formula}/>
            <Route exact path="/targetArea" component={TargetArea}/>
            <Route exact path="/targetAreaList" component={TargetAreaList}/>
            <Route exact path="/formulaList" component={FormulaList}/>
          </Switch>
        </Homepage>
    </Router>
    </>
  );
}

export default App;
