import Countdown from './countdown'

// Force dynamic rendering so the target date is computed fresh on every request
export const dynamic = 'force-dynamic'

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

type RunInfo = {
  targetISO: string
  location: string
  dateDisplay: string
}

function getNextRun(): RunInfo {
  const now = new Date()

  // Get current date/time parts in PT (America/Los_Angeles) using Intl
  const ptFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Los_Angeles',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false,
  })
  const parts = ptFormatter.formatToParts(now)
  const get = (type: string) => parseInt(parts.find(p => p.type === type)!.value)
  // Build a "fake local" Date whose getters reflect PT values
  const ptNow = new Date(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'), get('second'))
  // Offset (ms) to add to fake PT time to get real UTC
  const ptOffset = now.getTime() - ptNow.getTime()

  const runs = [
    { dayOfWeek: 5, hour: 7,  location: 'William McKinley Monument', timeLabel: '7am' },
    { dayOfWeek: 2, hour: 19, location: 'Kezar Stadium',              timeLabel: '7pm' },
  ]

  let earliest: Date | null = null
  let result: RunInfo = { targetISO: '', location: '', dateDisplay: '' }

  for (const run of runs) {
    const daysUntil = (run.dayOfWeek - ptNow.getDay() + 7) % 7
    const candidate = new Date(ptNow)
    candidate.setDate(ptNow.getDate() + daysUntil)
    candidate.setHours(run.hour, 0, 0, 0)

    // If it's the same day of week but the run time has already passed, push to next week
    if (daysUntil === 0 && ptNow >= candidate) {
      candidate.setDate(candidate.getDate() + 7)
    }

    const candidateUTC = new Date(candidate.getTime() + ptOffset)

    if (earliest === null || candidateUTC < earliest) {
      earliest = candidateUTC
      result = {
        targetISO: candidateUTC.toISOString(),
        location: run.location,
        dateDisplay: `${DAY_NAMES[candidate.getDay()]}, ${MONTHS[candidate.getMonth()]} ${candidate.getDate()} @ ${run.timeLabel}`,
      }
    }
  }

  return result
}

export default function Home() {
  const { targetISO, location, dateDisplay } = getNextRun()

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

      <div className="location-info">
        <p className="location">Meet us at {location}</p>
        <p className="run-date">{dateDisplay}</p>
      </div>
    </main>
  )
}
