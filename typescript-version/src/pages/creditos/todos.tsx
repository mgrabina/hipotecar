import React, { useState, useMemo } from 'react'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Button from '@mui/material/Button'
import { Credit } from 'src/configs/constants'
import { useData } from 'src/@core/layouts/HipotecarLayout'
import { useTheme } from '@mui/material/styles'
import { useMediaQuery } from '@mui/material'
import Link from 'next/link'
import Image from 'next/image'
import Head from 'next/head'

const columnsNotToShow = ['Id', 'Nombre', 'Banco']
const firstColumns = ['Logo Banco', 'Tipo', 'Nombre']
const lastColumns = ['Link']
const noFilterColumns = ['Link']

export const metadata = {
  title: 'Tabla completa de Créditos Hipotecarios UVA en Argentina | Mi Crédito Hipotecario',
  description: 'Compara todos los créditos hipotecarios disponibles en el mercado bancario argentino.',
}

const isNumericColumn = (key: string | string[]) =>
  key.includes('Tasa') ||
  key.includes('%') ||
  key.includes('Monto') ||
  key.includes('Plazo') ||
  key.includes('Cuota') ||
  key.includes('Duracion')
const isBooleanColumn = (key: string | string[]) =>
  key.includes('Acepta') || key.includes('Requiere') || key.includes('Apto') || key.includes('Ingresos')

const CreditComparisonPage = () => {
  const context = useData()
  const credits = context?.data.credits ?? []

  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))

  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' })
  const [filters, setFilters] = useState<
    Partial<
      Record<
        keyof Credit,
        {
          value: string
          operator: string | null
        }
      >
    >
  >({})

  const handleSort = (key: string) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const handleFilterChange = (key: string, value: string, operator: string | null = null) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [key]: { value, operator }
    }))
  }

  const clearFilters = () => {
    setFilters({})
  }

  const filteredCredits = useMemo(() => {
    return credits.filter(credit =>
      Object.entries(filters).every(([key, { value, operator }]) => {
        if (!value || value === 'Todos') return true

        const cellValue = credit[key as keyof Credit ]?.toString().toLowerCase()
        if (isNumericColumn(key)) {
          const numericValue = parseFloat(value)
          const creditValue = parseFloat(credit[key as keyof Credit].toString())
          switch (operator) {
            case '>':
              return creditValue > numericValue
            case '<':
              return creditValue < numericValue
            case '=':
              return creditValue === numericValue
            default:
              return true
          }
        } else if (isBooleanColumn(credit[key as keyof Credit].toString())) {
          return cellValue === value.toLowerCase()
        } else {
          // If the cell is 'Logo Banco' check Banco name
          if (key === 'Logo Banco') {
            return credit.Banco.toLowerCase().includes(value.toLowerCase())
          }

          return cellValue.includes(value.toLowerCase())
        }
      })
    )
  }, [filters, credits])

  const sortedCredits = useMemo(() => {
    const sortableCredits = [...filteredCredits]
    if (sortConfig.key) {
      sortableCredits.sort((a, b) => {
        if (a[sortConfig.key as keyof Credit] < b[sortConfig.key as keyof Credit]) {
          return sortConfig.direction === 'asc' ? -1 : 1
        }
        if (a[sortConfig.key as keyof Credit] > b[sortConfig.key as keyof Credit]) {
          return sortConfig.direction === 'asc' ? 1 : -1
        }

        return 0
      })
    }

    return sortableCredits
  }, [filteredCredits, sortConfig])

  const keys =
    credits.length > 0
      ? (Object.keys(credits[0])
          .filter(key => !columnsNotToShow.includes(key))
          .sort((a, b) => {
            if (firstColumns.includes(a) && firstColumns.includes(b))
              return firstColumns.indexOf(a) - firstColumns.indexOf(b)
            if (firstColumns.includes(a)) return -1
            if (firstColumns.includes(b)) return 1

            if (lastColumns.includes(a) && lastColumns.includes(b))
              return lastColumns.indexOf(a) - lastColumns.indexOf(b)
            if (lastColumns.includes(a)) return 1
            if (lastColumns.includes(b)) return -1

            return a.localeCompare(b)
          }) as (keyof Credit)[])
      : []

  return (
    <div>
      <Head>
        <title>Todos los creditos hipotecarios UVA | Mi Credito Hipotecario</title>
        <meta name='description' content='Descubre todos los creditos hipotecarios UVA disponibles en Argentina. Comparar tasas, cuotas, requisitos y mas.' />
        <meta property='og:title' content='Todos los creditos hipotecarios UVA | Mi Credito Hipotecario' />
        <meta property='og:description' content='Descubre todos los creditos hipotecarios UVA disponibles en Argentina. Comparar tasas, cuotas, requisitos y mas.' />
        <meta property='og:url' content='https://www.micredito.com.ar/creditos/todos' />
        <meta property='og:image' content='https://www.micredito.com.ar/generated/happy.png' />
        <meta property='twitter:title' content='Todos los creditos hipotecarios UVA | Mi Credito Hipotecario' />
        <meta property='twitter:description' content='Descubre todos los creditos hipotecarios UVA disponibles en Argentina. Comparar tasas, cuotas, requisitos y mas.' />
        <meta property='twitter:image' content='https://www.micredito.com.ar/generated/happy.png' />
      </Head>
      <Card style={{ marginTop: '4em' }}>
        <CardContent>
          <TableContainer>
            <Table stickyHeader={!isSmallScreen} sx={{ minWidth: 1000 }} aria-label='comparison table'>
              <TableHead>
                <TableRow>
                  {keys.map((key, index) => (
                    <TableCell
                      key={key}
                      style={{
                        verticalAlign: 'top',
                        minWidth: '100px',
                        backgroundColor: '#f5f5f5',
                        position:
                          (index === 0 || key === 'Logo Banco' ) && !isSmallScreen ? 'sticky' : 'static',
                        left:
                          key === 'Logo Banco' && !isSmallScreen ? 0 : 'auto',
                        zIndex: (key === 'Logo Banco') && !isSmallScreen ? 1 : 0
                      }}

                    >
                      <TableSortLabel
                        active={sortConfig.key === key}
                        direction={sortConfig.key === key ? (sortConfig.direction as 'asc' | 'desc') : 'asc'}
                        onClick={() => handleSort(key)}
                      >
                        {key == 'Logo Banco' ? 'Banco' : key}
                      </TableSortLabel>

                      {noFilterColumns.includes(key) ? null : isNumericColumn(key) ? (
                        <Grid container>
                          <br></br>
                          <Grid item>
                            <Select
                              style={{ fontSize: '1em' }}
                              value={filters[key]?.operator || '='}
                              onChange={e => handleFilterChange(key, filters[key]?.value || '', e.target.value)}
                            >
                              <MenuItem value='>'>{'>'}</MenuItem>
                              <MenuItem value='<'>{'<'}</MenuItem>
                              <MenuItem value='='>{'='}</MenuItem>
                            </Select>
                          </Grid>
                          <Grid item>
                            <TextField
                              type='number'
                              value={filters[key]?.value || ''}
                              onChange={e => handleFilterChange(key, e.target.value, filters[key]?.operator || '=')}
                              variant='outlined'
                              size='small'
                            />
                          </Grid>
                        </Grid>
                      ) : isBooleanColumn(key) ? (
                        <>
                          {key}
                          <Select
                            style={{ fontSize: '1em' }}
                            value={filters[key]?.value || 'Todos'}
                            onChange={e => handleFilterChange(key, e.target.value)}
                          >
                            <MenuItem value='Todos'>Todos</MenuItem>
                            <MenuItem value='TRUE'>Si</MenuItem>
                            <MenuItem value='FALSE'>No</MenuItem>
                          </Select>
                        </>
                      ) : (
                        <TextField
                          value={filters[key]?.value || ''}
                          onChange={e => handleFilterChange(key, e.target.value)}
                          variant='outlined'
                          size='small'
                          fullWidth
                        />
                      )}
                      {key === 'Logo Banco' && (
                        <Button
                          variant='outlined'
                          color='secondary'
                          onClick={clearFilters}
                          style={{ marginBottom: '1em', marginTop: '1em' }}
                        >
                          Limpiar Filtros
                        </Button>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedCredits.map((credit, index) => (
                  <TableRow key={index} hover>
                    {keys.map(key => (
                      <TableCell
                        key={key}
                        style={{
                          position:
                            (index === 0 || key === 'Logo Banco') && !isSmallScreen
                              ? 'sticky'
                              : 'static',
                          left:
                            key === 'Logo Banco' && !isSmallScreen
                              ? 0
                              : 'auto',
                          zIndex: (key === 'Logo Banco') && !isSmallScreen ? 1 : 0,
                          backgroundColor: 'white',
                          width: key === 'Logo Banco' ? '250px' : '100px',
                        }}
                        width={key === 'Logo Banco' ? '250px' : '100px'}
                      >
                        {key === 'Logo Banco' ? (
                          <div style={{ cursor: 'pointer'}}>

                          <Link href={`/banco/${credit.Banco.toLowerCase()}`} passHref={true}>
                            <Image layout="fill" objectFit="contain"  src={`/images/banks/${credit.Banco}.png`} alt={credit.Banco} width={40}  />
                            </Link>
                          </div>
                        ) : credit[key as keyof Credit] === 'TRUE' ? (
                          'Si'
                        ) : credit[key as keyof Credit] === 'FALSE' ? (
                          'No'
                        ) : key === 'Link' ? (
                          <Link href={credit[key as keyof Credit] as string}>Ver</Link>
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
    </div>
  )
}

export default CreditComparisonPage
