import { createMuiTheme } from '@material-ui/core';

export const DefaultTheme = createMuiTheme({
	palette:{
		common:{
			black:'#000',
			white:'#fff'
		},
		background:{
			paper:'#fff',
			default:'#fafafa'
		},
		primary:{
			light:'rgba(94, 194, 250, 1)',
			main:'rgba(14, 146, 199, 1)',
			dark:'rgba(0, 100, 150, 1)',
			contrastText:'rgba(0, 0, 0, 1)'
		},
		secondary:{
			light:'rgba(255, 255, 255, 1)',
			main:'rgba(255, 255, 255, 1)',
			dark:'rgba(255, 255, 255, 1)',
			contrastText:'rgba(255, 255, 255, 1)'
		},
		error:{
			light:'#e57373',
			main:'#f44336',
			dark:'#d32f2f',
			contrastText:'rgba(255, 255, 255, 1)'
		},
		text:{
			primary:'rgba(0, 0, 0, 0.87)',
			secondary:'rgba(0, 0, 0, 0.54)',
			disabled:'rgba(0, 0, 0, 0.38)',
			hint:'rgba(0, 0, 0, 0.38)'
		}
	}
})