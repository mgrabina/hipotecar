import * as React from 'react'
import { styled } from '@mui/material/styles'
import Stack from '@mui/material/Stack'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'

// import Check from '@mui/icons-material/Check';
// import SettingsIcon from '@mui/icons-material/Settings';
// import GroupAddIcon from '@mui/icons-material/GroupAdd';
// import VideoLabelIcon from '@mui/icons-material/VideoLabel';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector'
import { StepIconProps } from '@mui/material/StepIcon'
import { AlertOutline, Check, FileSettingsOutline, FolderTableOutline } from 'mdi-material-ui'
import { Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useRouter } from 'next/router'
import { UserData, useData } from 'src/@core/layouts/HipotecarLayout'
import Link from 'next/link'

const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: 'calc(-50% + 16px)',
    right: 'calc(50% + 16px)'
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#784af4'
    }
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#784af4'
    }
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderTopWidth: 3,
    borderRadius: 1
  }
}))

const QontoStepIconRoot = styled('div')<{ ownerState: { active?: boolean } }>(({ theme, ownerState }) => ({
  color: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#eaeaf0',
  display: 'flex',
  height: 22,
  alignItems: 'center',
  ...(ownerState.active && {
    color: '#784af4'
  }),
  '& .QontoStepIcon-completedIcon': {
    color: '#784af4',
    zIndex: 1,
    fontSize: 18
  },
  '& .QontoStepIcon-circle': {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: 'currentColor'
  }
}))

function QontoStepIcon(props: StepIconProps) {
  const { active, completed, className } = props

  return (
    <Link href={props.accessKey ?? ''}>
      <QontoStepIconRoot ownerState={{ active }} className={className}>
        {completed ? <Check className='QontoStepIcon-completedIcon' /> : <div className='QontoStepIcon-circle' />}
      </QontoStepIconRoot>
    </Link>
  )
}

const steps = ['Nombre', 'Test de riesgo', 'Preferencias', 'Resultados'] as const
const links = ['/name', '/risk', '/preferences', '/comparison']

const getActiveStep = (data: UserData) => {
  if (data.budget && data.creditType && data.duration) {
    return 3
  }

  if (data.riskAssesmentPassed === true) {
    return 2
  }

  if (data.name) {
    return 1
  }

  return 0
}

export default function ProgressBar() {
  const context = useData()

  const activeStep = context?.data ? getActiveStep(context?.data) : 0

  return (
    <div style={{ padding: '3em' }}>
      <Stack sx={{ width: '100%' }} spacing={4}>
        <Stepper alternativeLabel activeStep={activeStep} connector={<QontoConnector />}>
          {steps.map((label, index) => (
            <Step key={label}>
              {activeStep >= index ? (
                <Link href={links[index]} key={label}>
                  <StepLabel StepIconComponent={QontoStepIcon}>{label}</StepLabel>
                </Link>
              ) : (
                <StepLabel StepIconComponent={QontoStepIcon}>{label}</StepLabel>
              )}
            </Step>
          ))}
        </Stepper>
      </Stack>
    </div>
  )
}
