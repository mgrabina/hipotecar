import { Grid, useMediaQuery, useTheme } from '@mui/material'

const Statistics = () => {
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <div style={{ marginTop: '3em' }}>
      {isSmallScreen ? (
        <iframe
          src='https://e.infogram.com/59baed14-b568-4b6e-964d-31bac3937be1?src=embed'
          style={{
            width: '100%',
            height: '80em',
            border: 'none',
            padding: '0'
          }}
          scrolling='no'
        ></iframe>
      ) : (
        <Grid container spacing={8}>
          <Grid item xs={12} md={6} style={{ overflow: 'hidden', height: '30em' }}>
            <iframe
              src='https://e.infogram.com/59baed14-b568-4b6e-964d-31bac3937be1?src=embed'
              style={{
                width: '100%',
                height: '28em',
                padding: '0',
                overflow: 'hidden',
                border: 'none',
                transform: 'translateY(-1.5em)'
              }}
              scrolling='no'
            ></iframe>
          </Grid>
          <Grid item xs={12} md={6} style={{ overflow: 'hidden', height: '30em' }}>
            <iframe
              src='https://e.infogram.com/59baed14-b568-4b6e-964d-31bac3937be1?src=embed'
              style={{
                width: '100%',
                height: '57em',
                overflow: 'hidden',
                border: 'none',
                padding: '0',
                transform: 'translateY(-30.1em)'
              }}
              scrolling='no'
            ></iframe>
          </Grid>
          <Grid item xs={12} md={6} style={{ overflow: 'hidden', height: '30em' }}>
            <iframe
              src='https://e.infogram.com/59baed14-b568-4b6e-964d-31bac3937be1?src=embed'
              style={{
                width: '100%',
                height: '85em',
                overflow: 'hidden',
                border: 'none',
                padding: '0',
                transform: 'translateY(-59em)'
              }}
              scrolling='no'
            ></iframe>
          </Grid>
          <Grid item xs={12} md={6} style={{ overflow: 'hidden', height: '30em' }}>
            <iframe
              src='https://e.infogram.com/59baed14-b568-4b6e-964d-31bac3937be1?src=embed'
              style={{
                width: '100%',
                height: '117em',
                overflow: 'hidden',
                border: 'none',
                padding: '0',
                transform: 'translateY(-87.5em)'
              }}
              scrolling='no'
            ></iframe>
          </Grid>
        </Grid>
      )}
    </div>
  )
}

export default Statistics
