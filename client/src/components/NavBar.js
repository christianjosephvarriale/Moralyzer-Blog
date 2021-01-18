import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import Button from '@material-ui/core/Button';
import LaptopIcon from '@material-ui/icons/Laptop';
import Drawer from '@material-ui/core/Drawer';
import MenuIcon from '@material-ui/icons/Menu';
import { connect } from 'react-redux';
import { Avatar, ButtonGroup, IconButton } from '@material-ui/core';
import logo from '../img/logo.png'
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InfoIcon from '@material-ui/icons/Info';
import { ReactComponent as Fb } from '../img/fb.svg';
import { ReactComponent as Ig } from '../img/instagram.svg';

function ElevationScroll(props) {
  const { children, window } = props;

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
}

ElevationScroll.propTypes = {
  children: PropTypes.element.isRequired,
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

/**
 * Description: The navbar drives traffic to Moralyzer and home page
 * @param {*} props 
 */
const Navbar = (props) => {

  const [state, setState] = React.useState(null);
  const toggleDrawer = ( open ) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState( open );
  };


    return (
        <>
            <Drawer anchor={'left'} open={state} onClose={toggleDrawer(false)}>
              <List>
                <ListItem button onClick={() => window.location.href = `https://moralyzer.com`}>
                  <ListItemIcon style={{ minWidth: 40 }}><LaptopIcon /></ListItemIcon>
                  <ListItemText primary={'Platform'} secondary={'Tap here to checkout Moralyzer'} />
                </ListItem>
                <ListItem button onClick={() => window.location.href = `https://www.linkedin.com/company/moralyzer`}>
                  <ListItemIcon style={{ minWidth: 40 }}><InfoIcon /></ListItemIcon>
                  <ListItemText primary={'Info'} secondary={'Tap here to learn about Moralyzer'} />
                </ListItem>
                <ListItem button onClick={() => window.location.href = `https://www.instagram.com/moralyzerofficial/`}>
                  <ListItemIcon style={{ minWidth: 40 }}><Ig style={{ height: 20, width: 20 }} /></ListItemIcon>
                  <ListItemText primary={'Instagram'} secondary={'Tap here for an awesome ig'} />
                </ListItem>
                <ListItem button onClick={() => window.location.href = `https://www.facebook.com/moralyzerofficial`}>
                  <ListItemIcon style={{ minWidth: 40 }}><Fb style={{ height: 20, width: 20 }} /></ListItemIcon>
                  <ListItemText primary={'Facebook'} secondary={'Tap here for an awesome fb'} />
                </ListItem>
              </List>
            </Drawer>

            <ElevationScroll {...props}>
                <AppBar style={{ backgroundColor: 'white' }}>
                <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }} >

                    {
                      props.mobile ? <>
                        <IconButton onClick={toggleDrawer(true)}>
                          <MenuIcon />
                        </IconButton> 
                        <Avatar onClick={() => window.location.href = `/?page=1`} src={logo} style={{ cursor: 'pointer' }}/>
                        </>  : <>
                        <h3 onClick={() => window.location.href = `/?page=1`} style={{ margin: 0, padding: 0, fontSize:20, cursor: 'pointer' }}> Moralyzer Blog </h3>

                        <ButtonGroup>
                          <Button startIcon={<LaptopIcon />} variant={'outlined'} onClick={() => window.location.href = `https://moralyzer.com`}>Go To Platform</Button>
                          <Button startIcon={<InfoIcon />} variant={'outlined'} onClick={() => window.location.href = `https://www.linkedin.com/company/moralyzer`}>About us</Button>
                        </ButtonGroup>
                      </>
                    }
                    
               
                </Toolbar>
                </AppBar>
            </ElevationScroll>
        </>
    );
  }


const mapStateToProps = state => (
    { 
        state: state.BlogReducer,
        mobile: state.AppReducer.mobile
    }
)

export default connect(mapStateToProps, {  })(Navbar);