import React, { useEffect, useState } from 'react'
import { useTheme } from '@mui/material/styles'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import { Credit } from 'src/configs/constants'
import { useData } from 'src/@core/layouts/HipotecarLayout'

const columnsNotToShow = ['Id', 'Nombre', 'Banco']
const firstColumns = ['Logo Banco', 'Nombre']

const CreditComparisonPage = () => {
  const context = useData()
  const credits = context?.data.credits ?? []

  const keys =
    credits.length > 0
      ? Object.keys(credits[0])
          .filter(key => !columnsNotToShow.includes(key))
          .sort((a, b) => {
            if (firstColumns.includes(a)) {
              return -1
            }
            if (firstColumns.includes(b)) {
              return 1
            }

            return a.localeCompare(b)
          })
      : []

  return (
    <Card>
      <CardHeader title='Comparación de Créditos' titleTypographyProps={{ variant: 'h6' }} />
      <CardContent>
        <TableContainer>
          <Table sx={{ minWidth: 800 }} aria-label='comparison table'>
            <TableHead>
              <TableRow>
                {keys.map(key => (
                  <TableCell key={key}>{key}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {credits.map((credit, index) => (
                <TableRow key={index} hover>
                  {keys.map(key => (
                    <TableCell key={key}>
                      {key === 'Logo Banco' ? (
                        <img src={credit[key]} alt={credit.Banco} height={40} />
                      ) : credit[key as keyof Credit] == 'TRUE' ? (
                        'Si'
                      ) : credit[key as keyof Credit] == 'FALSE' ? (
                        'No'
                      ) : key == 'Link' ? (
                        <a href={credit[key as keyof Credit] as string}>Ver</a>
                      ) : (
                        credit[key as keyof Credit] +
                        `${!!credit[key as keyof Credit] && (key.includes('Tasa') || key.includes('%')) ? '%' : ''}`
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  )
}

export default CreditComparisonPage
