import { styled } from '@mui/material/styles';
import { Switch } from '@mui/material';

// Custom Switch with properly aligned "Yes" and "No" text
export const CustomSwitch = styled(Switch)(({ theme }) => ({
    width: 70, // Adjust width to give more space for text
    height: 35,
    padding: 2,
    '& .MuiSwitch-switchBase': {
        padding: 0,
        margin: 2,
        transform: 'translateX(6px)',
        '&.Mui-checked': {
            color: '#fff',
            transform: 'translateX(34px)', // Adjust translation for better fit
            '& + .MuiSwitch-track': {
                backgroundColor: '#4CAF50', // Green for "Yes"
                opacity: 1,
                border: 'none',
            },
        },
    },
    '& .MuiSwitch-thumb': {
        boxShadow: 'none',
        width: 25,
        height: 25,
        margin: 2,
    },
    '& .MuiSwitch-track': {
        borderRadius: 19,
        backgroundColor: '#F44336', // Red for "No"
        opacity: 1,
        transition: theme.transitions.create(['background-color'], {
            duration: 500,
        }),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 8px', // Add padding to center text
        '&:before, &:after': {
            fontSize: 12,
            fontWeight: 'bold',
            color: '#fff',
        },
        '&:before': {
            content: '"Yes"',
            marginLeft: 0,
            marginRight: 3, // Adjust positioning for
        },
        '&:after': {
            content: '"No"',
            marginRight: 0, 
            marginLeft: 3
        },
    },
}));

