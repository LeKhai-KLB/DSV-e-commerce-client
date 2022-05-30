import React, { memo } from 'react'
import TextField from '@mui/material/TextField';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import styles from './DateRangePicker.module.css'
import calendarIcon from '../../../assets/admin/calendar.png'

const theme = createTheme({
  palette: {
    primary: {
      main: '#ffa15f'
    },
    second: {
      main: 'rgba(255, 161, 95, 0.2)'
    }
  },
  typography: {
    fontFamily: 'Montserrat'
  }
})

const style = {

  '& .MuiOutlinedInput-input': {
    fontFamily: 'Montserrat',
    fontSize: '14px',
    fontWeight: '500',
    fontStretch: 'normal',
    fontStyle: 'normal',
    lineHeight: '1.43',
    letterSpacing: 'normal',
    color: 'var(--charcoal-grey)',
    padding: '15px 14px',
    backgroundColor: 'var(--white)',
  },
  '& .MuiOutlinedInput-root': {
    height: '50px',
    width: '240px',
    overflow: 'hidden'
  },
  '& .MuiInputLabel-root': {
    display: 'none'
  },
  '& .MuiOutlinedInput-notchedOutline': {
    outline: 'none',
    border: 'none'
  }, 
  '& .MuiOutlinedInput-notchedOutline:focus': {
    outline: 'none !important',
    border: 'none !important',
  }
}

function DatetimeRangePicker({value, onChange}) {

    return (
      <ThemeProvider theme={theme}>
        <div className={styles.dateRangeContainer} >
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateRangePicker
              sx={{
                fontFamily: 'Montserrat'
              }}
              startText="Date range"
              value={value}
              onChange={(newValue) => {
                if(!newValue[1]){
                  const newDate1 = new Date(newValue[0].setHours(0, 0, 0, 0))
                  const newDate2 = new Date(newValue[0].setHours(23, 59, 59, 999))
                  onChange([newDate1, newDate2])
                }
                else{
                  const newDate1 = new Date(newValue[0].setHours(0, 0, 0, 0))
                  const newDate2 = new Date(newValue[1].setHours(23, 59, 59, 999))
                  onChange([newDate1, newDate2])
                }
              }}
              renderInput={(startProps, endProps) => {
                if(startProps.inputProps?.value !== '' && endProps.inputProps?.value !== '')
                  startProps.inputProps.value = startProps.inputProps.value + ' - ' + endProps.inputProps.value
                else if(startProps.inputProps?.value !== '' && !endProps.inputProps)
                  startProps.inputProps.value = startProps.inputProps.value + ' - ' + startProps.inputProps.value
                else {
                  startProps.inputProps.value = '---   ---   ---   -   ---   ---   ---'
                }
                return (
                  <React.Fragment>
                    <TextField {...startProps} 
                      sx={style} 
                      readOnly={true}
                    />
                    <img 
                      className={styles.dateRangeIcon} 
                      src={calendarIcon} 
                      alt=" " 
                      onClick={() => startProps.inputProps.onClick()} />
                  </React.Fragment>
                )}
              }
            />
          </LocalizationProvider>
        </div>
      </ThemeProvider>
      );
}

export default memo(DatetimeRangePicker)