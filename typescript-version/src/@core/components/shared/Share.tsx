import React from 'react'
import { Button, Box, IconButton, useTheme, useMediaQuery } from '@mui/material'
import { Facebook, Share, Twitter, Whatsapp } from 'mdi-material-ui'

const ShareComponent = () => {
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))

  if (typeof window === 'undefined') {
    return null
  }

  const currentUrl = window?.location?.href

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: currentUrl
        })
      } catch (error) {
        console.error('Error sharing:', error)
      }
    } else {
      // Fallback for browsers that do not support the Share API
      alert('Sharing not supported on this browser. Use the social media buttons instead.')
    }
  }

  // Text removing special characters
  const text = document.title.replace('|', 'en').replace(/[^a-zA-Z0-9 ]/g, '')

  return (
    <Box sx={{ display: 'flex', mt: 2, justifyContent: "space-evenly" }}>
      <IconButton
        color='info'
        component='a'
        href={`https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`}
        target='_blank'
        rel='noopener noreferrer'
      >
        <Facebook />
      </IconButton>
      <IconButton
        color='info'
        component='a'
        href={`https://twitter.com/intent/tweet?url=${currentUrl}&text=${text}`}
        target='_blank'
        rel='noopener noreferrer'
      >
        <Twitter />
      </IconButton>
      <IconButton
        color='info'
        component='a'
        href={`https://api.whatsapp.com/send?text=${text} - ${currentUrl.toString()}`}
        target='_blank'
        rel='noopener noreferrer'
      >
        <Whatsapp />
      </IconButton>
      {isSmallScreen && (
        <IconButton
          color='info'
          onClick={handleShare}
        >
          <Share />
        </IconButton>
      )}
    </Box>
  )
}

export default ShareComponent
