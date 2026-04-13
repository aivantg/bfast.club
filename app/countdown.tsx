'use client'

import { useEffect, useState } from 'react'

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function getTimeLeft(target: Date) {
  const diff = target.getTime() - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  }
}

export default function Countdown({ targetISO }: { targetISO: string }) {
  const target = new Date(targetISO)
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(target))

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft(target)), 1000)
    return () => clearInterval(id)
  }, [targetISO])

  return (
    <div className="countdown-section">
      <p className="next-run-label">Next Run In</p>
      <div className="countdown">
        <div className="countdown-unit">
          <span>{pad(timeLeft.days)}</span>
          <label>Days</label>
        </div>
        <div className="countdown-sep">:</div>
        <div className="countdown-unit">
          <span>{pad(timeLeft.hours)}</span>
          <label>Hours</label>
        </div>
        <div className="countdown-sep">:</div>
        <div className="countdown-unit">
          <span>{pad(timeLeft.minutes)}</span>
          <label>Minutes</label>
        </div>
        <div className="countdown-sep">:</div>
        <div className="countdown-unit">
          <span>{pad(timeLeft.seconds)}</span>
          <label>Seconds</label>
        </div>
      </div>
    </div>
  )
}
