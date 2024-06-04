import React, { useState } from 'react'
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Typography } from '@mui/material'
import { Credit, CreditType } from '@/configs/constants'
import { useData } from '@/@core/layouts/HipotecarLayout'

function AdvancedOptionsDialog({ open, onClose, credit }: { open: boolean; onClose: () => void; credit: Credit }) {
  const [tasa, setTasa] = useState(credit.Tasa)
  const context = useData()

  const handleTasaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTasa(Number(event.target.value))
  }

  const save = () => {
    const newAdvancedOptions: Partial<Credit> = context?.data.personalizedCredits[credit.Id] ?? {}

    newAdvancedOptions.Tasa = tasa

    context?.setData({
      ...context.data,
      personalizedCredits: {
        ...context.data.personalizedCredits,
        [credit.Id]: newAdvancedOptions
      }
    })
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      BackdropProps={{
        style: { backgroundColor: 'rgba(0, 0, 0, 0.1)' } // Change this to adjust the opacity
      }}
    >
      <DialogTitle>
        <Typography variant='h5'>Opciones Avanzadas</Typography>
        <Typography variant='subtitle2'>
          Crédito {credit.Nombre} del {credit.Banco}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <TextField
          autoFocus
          margin='dense'
          id='tasa'
          label='Tasa personalizada'
          defaultValue={credit.Tasa}
          type='number'
          fullWidth
          value={tasa}
          onChange={handleTasaChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='error'>
          Cancelar
        </Button>
        <Button
          onClick={() => {
            save()
            onClose()
          }}
        >
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AdvancedOptionsDialog
