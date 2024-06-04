import { Credit, banksCsvUrl, creditsCsvUrl, loadDataFromCSV, provincesCsvUrl } from 'src/configs/constants'
import { PreferencesFormState } from 'src/views/form-layouts/custom/PreferencesForm'
import { Dispatch, ReactChildren, SetStateAction, createContext, useContext, useEffect, useState } from 'react'
import { getDolarMep, getUVA } from '@/@core/utils/misc'

export type UserData = {
  name?: string
  riskAssesmentPassed?: boolean
  email?: string
} & Partial<PreferencesFormState>

export type ContextType = {
  loaded: boolean
  user: UserData
  credits: Credit[]
  provinces: string[]
  banks: string[]
  dolar?: number
  UVA?: number
  personalizedCredits: Record<number, Partial<Credit>> // id - params
}

export type ContextActionsType = {
  data: ContextType
  setData: Dispatch<SetStateAction<ContextType>>
}
const DataContext = createContext<ContextActionsType | null>(null)

export const useData = () => useContext(DataContext)

export const DataProvider = ({ children }: { children: any }) => {
  const [data, setData] = useState<ContextType>({
    loaded: false,
    user: {},
    credits: [],
    provinces: [],
    banks: [],
    dolar: undefined,
    UVA: undefined,
    personalizedCredits: {}
  })

  // Effect to load data from localStorage when the component mounts
  useEffect(() => {
    const savedData = localStorage.getItem('userData')
    if (savedData) {
      setData({ ...data, user: JSON.parse(savedData) })
    } else {
      setData({ ...data, loaded: true })
    }
  }, [])

  useEffect(() => {
    if (!data.loaded) {
      if (data.user && Object.keys(data.user).length) {
        // First time
        setData({ ...data, loaded: true })
      }
    }
  }, [data.user])

  useEffect(() => {
    const fetchData = async () => {
      const promises: Promise<any>[] = []

      if (data.credits.length === 0) {
        promises.push(loadDataFromCSV<Credit>(creditsCsvUrl))
      } else {
        promises.push(Promise.resolve(data.credits))
      }

      if (data.provinces.length === 0) {
        promises.push(loadDataFromCSV<{ Provincia: string }>(provincesCsvUrl))
      } else {
        promises.push(Promise.resolve(data.provinces))
      }

      if (data.banks.length === 0) {
        promises.push(loadDataFromCSV<{ Banco: string }>(banksCsvUrl))
      } else {
        promises.push(Promise.resolve(data.banks))
      }

      if (!data.dolar) {
        promises.push(getDolarMep())
      } else {
        promises.push(Promise.resolve(data.dolar))
      }

      if (!data.UVA) {
        promises.push(getUVA())
      } else {
        promises.push(Promise.resolve(data.UVA))
      }

      const [loadedCredits, loadedProvinces, loadedBanks, dolar, UVA] = await Promise.all(promises)

      const provinceNames = Array.isArray(loadedProvinces) ? loadedProvinces.map(p => p.Provincia).filter(p => !!p) : []
      const bankNames = Array.isArray(loadedBanks) ? loadedBanks.map(b => b.Banco).filter(b => !!b) : []

      const newData =

      setData(prevData => ({
        ...prevData,
        credits: data.credits.length === 0 ? loadedCredits : prevData.credits,
        provinces: data.provinces.length === 0 ? provinceNames : prevData.provinces,
        banks: data.banks.length === 0 ? bankNames : prevData.banks,
        dolar: data.dolar === undefined ? dolar : prevData.dolar,
        UVA: data.UVA === undefined ? UVA : prevData.UVA
      }))

      return {
        credits: loadedCredits,
        provinces: provinceNames,
        banks: bankNames,
        dolar,
        UVA
      }
    }

    console.log('Fetching data...')

    const cachedData = localStorage.getItem('data')
    const cachedTimestamp = localStorage.getItem('timestamp')
    if (cachedData && cachedTimestamp && Date.now() - Number(cachedTimestamp) < 60 * 60 * 1000) {
      console.log('Using cached data...')

      const cached = JSON.parse(cachedData)

      setData({
        ...data,
        credits: cached.credits,
        provinces: cached.provinces,
        banks: cached.banks,
        dolar: cached.dolar,
        UVA: cached.UVA
      })
    } else {
      console.log('Fetching fresh data...')
      fetchData().then((fetched) => {
        console.log('Data refreshed!', fetched)

        localStorage.setItem(
          'data',
          JSON.stringify({
            credits: fetched.credits,
            provinces: fetched.provinces,
            banks: fetched.banks,
            dolar: fetched.dolar,
            UVA: fetched.UVA
          })
        )
        localStorage.setItem('timestamp', String(Date.now()))
      })
    }

    // Adding an empty dependency array ensures this effect only runs once on mount.
  }, [])

  useEffect(() => {
    if (!data.user || !Object.keys(data.user).length) return

    // Save the data to localStorage
    localStorage.setItem('userData', JSON.stringify(data.user))
  }, [data.user]) // Only re-run the effect if data changes

  return <DataContext.Provider value={{ data, setData }}>{children}</DataContext.Provider>
}
