import CreditsOverviewCard from '@/views/dashboard/CreditsOverviewCard'
import Statistics from '@/views/dashboard/Statistics'

const Monitor = () => {
  return (
    <>
      <div style={{ marginTop: '2em' }}>
        <CreditsOverviewCard></CreditsOverviewCard>
      </div>

      <Statistics></Statistics>
    </>
  )
}

export default Monitor
