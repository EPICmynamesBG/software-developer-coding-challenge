import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { authContext } from '../contexts/AuthContext';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { version } from "../../package.json";

const primary = [
  { name: 'Market', route: '/market' },
  { name: 'My Listings', route: '/my-listings' }
];

const secondary = [
  { name: 'About', route: '/about' },
  { name: 'Logout', route: '/logout' }
];


const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
    alignItems: 'space-between'
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  title: {
    flexGrow: 1
  }
}));

function NavBar({ pageTitle, pageClass, children }) {
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { auth } = React.useContext(authContext);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <div className={classes.toolbar}>
        <Typography variant="h6" >
          trdrev
        </Typography>
        <Typography variant="subtitle1" >
          v{version}
        </Typography>
      </div>
      <Divider />
      <List>
        {primary.map(({ name, route }) => (
          <ListItem button key={name} component={Link} to={route}>
            <ListItemText primary={name} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {secondary.map(({ name, route }) => (
          <ListItem button key={name} component={Link} to={route}>
            <ListItemText primary={name} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography className={classes.title} variant="h6" noWrap>
            {pageTitle}
          </Typography>
          {auth ?
            <div className="account">
              {auth.email}
            </div>
            :
            <Link to="login">
              <Button color="inherit">Login</Button>
            </Link>
        }
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="nav">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main className={pageClass || classes.content}>
        <div className={classes.toolbar} />
        {children}
      </main>
    </div>
  );
}

NavBar.propTypes = {
  children: PropTypes.element,
  pageTitle: PropTypes.string,
  pageClass: PropTypes.string
};

export default NavBar;
