import Countdown from './countdown'

// Force dynamic rendering so the target date is computed fresh on every request
export const dynamic = 'force-dynamic'

function getNextFriday7AM(): Date {
  const now = new Date()
  const target = new Date(now)
  const dayOfWeek = now.getDay()
  let daysUntilFriday = (5 - dayOfWeek + 7) % 7
  if (daysUntilFriday === 0) {
    const friday7AM = new Date(now)
    friday7AM.setHours(7, 0, 0, 0)
    if (now >= friday7AM) daysUntilFriday = 7
  }
  target.setDate(now.getDate() + daysUntilFriday)
  target.setHours(7, 0, 0, 0)
  return target
}

export default function Home() {
  const targetISO = getNextFriday7AM().toISOString()

  return (
    <main className="page">
      <svg className="arc-text" viewBox="0 0 500 110" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <path id="arc" d="M 20,90 Q 250,40 480,90" />
        </defs>
        <text>
          <textPath href="#arc" startOffset="50%" textAnchor="middle">
            Bean There, Ran That
          </textPath>
        </text>
      </svg>

      <img className="croissant" src="/btrt_img.jpg" alt="A croissant" />

      <Countdown targetISO={targetISO} />

      <p className="location">Meet us at William McKinley Monument</p>
    </main>
  )
}
