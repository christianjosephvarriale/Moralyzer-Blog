import React, { Component } from 'react';
import Blog from './pages/Home.js';
import BlogPage from './pages/Entry.js';
import NavBar from './components/NavBar.js';
import { Switch, Route, BrowserRouter as Router, Redirect } from 'react-router-dom';
import Footer from './components/Footer'
import './App.css';
import { toggleMobile } from './actions/app.js'
import { connect } from 'react-redux';
import Page404 from './pages/NotFound.js';
import './css/main.css';
import { Helmet } from 'react-helmet';
import InApp from 'detect-inapp';
import {
  enable as enableDarkMode,
  disable as disableDarkMode,
  auto as followSystemColorScheme,
  setFetchMethod,
  exportGeneratedCSS as collectCSS,
} from 'darkreader';


const inapp = new InApp(navigator.userAgent || navigator.vendor || window.opera);

if ( !inapp.isInApp ){ // dont show dark mode 
  enableDarkMode({
    brightness: 100,
    contrast: 90,
    sepia: 10,
  });
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  componentDidMount() {
    // event listeners
    window.addEventListener('resize', this.checkWindowDimensions);

    if ( window.innerWidth < 901 && !this.props.mobile ){
      this.props.toggleMobile('ON');
    } else if ( window.innerWidth >= 901 && this.props.mobile ){
      console.log(`called update`);
      this.props.toggleMobile('OFF');
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.checkWindowDimensions);
  }

  checkWindowDimensions = () => {
    // call a re-render upon resizing
    if ( window.innerWidth < 901 && !this.props.mobile ){
      this.props.toggleMobile('ON');
    } else if ( window.innerWidth >= 901 && this.props.mobile ){
      console.log(`called update`);
      this.props.toggleMobile('OFF');
    }
  }

  render() {
          return (
            <main>
              <NavBar />
              <Router forceRefresh="true">
                <Switch>
                  <Route exact path="/" component={Blog} />
                  <Route path="/:title" component={BlogPage} />
                  <Route path="/404" component={Page404} />
                  <Redirect to="/404" />
                </Switch>
              </Router>
              {/* <Footer /> */}
            </main>
          );

    }
}

const mapStateToProps = state => (
  { mobile: state.AppReducer.mobile }
)

export default connect(mapStateToProps, { toggleMobile })(App);
