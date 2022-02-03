import React from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: 'fixed',
      width: '100%',
      bottom: 0,
    },
    footer: {
        marginTop: theme.spacing(8),
        backgroundColor: '#1f1e1e',
        textAlign: 'center',
        [theme.breakpoints.down('sm')]: {
            fontSize: '16px',
            padding: '2%',
            margin: 'auto',
        },
        [theme.breakpoints.up('md')]: {
            height: '100%',
            fontSize: '14px',
            padding: '2%',
        },
    },
  }),
);

export const Footer = () => {
    const classes = useStyles();

    return (
        <footer className={classes.root}>
            <Paper elevation={3} className={classes.footer}>
                The Black Resilience Fund is a formal program of Brown Hope, a registered 501(3) non-profit organization with a federal employment identification 
                number of 82-4843276. Donations are tax-deductible to the extent allowable by law. 
                Learn more at <a href="https://www.brownhope.org">https://www.brownhope.org/</a>.
            </Paper>
        </footer>
);
  };
  