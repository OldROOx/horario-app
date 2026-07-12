import { useState, useEffect, useMemo } from 'react'

const DAYS = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom']
const START_HOUR = 6
const END_HOUR = 24

const EVENTS = [
  { title: 'Preparacion', timeRange: ['06:00', '08:00'], day: 0, color: '#6edb6e', subColor: '#0f2e0f' },
  { title: 'Preparacion', timeRange: ['06:00', '08:00'], day: 1, color: '#6edb6e', subColor: '#0f2e0f' },
  { title: 'Preparacion', timeRange: ['06:00', '08:00'], day: 2, color: '#6edb6e', subColor: '#0f2e0f' },
  { title: 'Preparacion', timeRange: ['06:00', '08:00'], day: 3, color: '#6edb6e', subColor: '#0f2e0f' },
  { title: 'Preparacion', timeRange: ['06:00', '08:00'], day: 4, color: '#6edb6e', subColor: '#0f2e0f' },
  { title: 'Universidad', timeRange: ['08:00', '16:00'], day: 0, color: '#1a2037', subColor: '#6ab8ef' },
  { title: 'Universidad', timeRange: ['08:00', '16:00'], day: 1, color: '#1a2037', subColor: '#6ab8ef' },
  { title: 'Universidad', timeRange: ['08:00', '16:00'], day: 2, color: '#1a2037', subColor: '#6ab8ef' },
  { title: 'Universidad', timeRange: ['08:00', '16:00'], day: 4, color: '#1a2037', subColor: '#6ab8ef' },
  { title: 'Universidad', timeRange: ['08:00', '14:00'], day: 3, color: '#1a2037', subColor: '#6ab8ef' },
  { title: 'Post Universidad', timeRange: ['16:00', '17:30'], day: 0, color: '#6edb6e', subColor: '#0f2e0f' },
  { title: 'Post Universidad', timeRange: ['16:00', '17:30'], day: 1, color: '#6edb6e', subColor: '#0f2e0f' },
  { title: 'Post Universidad', timeRange: ['16:00', '17:30'], day: 2, color: '#6edb6e', subColor: '#0f2e0f' },
  { title: 'Post Universidad', timeRange: ['16:00', '17:30'], day: 4, color: '#6edb6e', subColor: '#0f2e0f' },
  { title: 'Post Universidad', timeRange: ['14:00', '15:30'], day: 3, color: '#6edb6e', subColor: '#0f2e0f' },
  { title: 'Tarea Universidad', timeRange: ['17:30', '19:30'], day: 1, color: '#020202', subColor: '#f5f4f5' },
  { title: 'Tarea Universidad', timeRange: ['15:30', '17:30'], day: 3, color: '#020202', subColor: '#f5f4f5' },
  { title: 'Bajo Electrico', timeRange: ['17:30', '19:30'], day: 0, color: '#fb5870', subColor: '#3a0d16' },
  { title: 'Ciberseguridad', timeRange: ['17:30', '19:30'], day: 2, color: '#212339', subColor: '#a5e07a' },
  { title: 'Ciberseguridad', timeRange: ['17:30', '19:30'], day: 3, color: '#212339', subColor: '#a5e07a' },
  { title: 'Youtube', timeRange: ['13:00', '17:00'], day: 5, color: '#280043', subColor: '#ff6fc7' },
  { title: 'Youtube', timeRange: ['14:00', '17:00'], day: 6, color: '#280043', subColor: '#ff6fc7' },
  { title: 'Youtube', timeRange: ['19:30', '21:30'], day: 4, color: '#280043', subColor: '#ff6fc7' },
  { title: 'Ejercicio + Dormir', timeRange: ['19:30', '24:00'], day: 0, color: '#1c1c1c', subColor: '#c9c9c9' },
  { title: 'Ejercicio + Dormir', timeRange: ['19:30', '24:00'], day: 1, color: '#1c1c1c', subColor: '#c9c9c9' },
  { title: 'Ejercicio + Dormir', timeRange: ['19:30', '24:00'], day: 2, color: '#1c1c1c', subColor: '#c9c9c9' },
  { title: 'Ejercicio + Dormir', timeRange: ['19:30', '24:00'], day: 3, color: '#1c1c1c', subColor: '#c9c9c9' },
  { title: 'Ejercicio + Dormir', timeRange: ['21:30', '24:00'], day: 4, color: '#1c1c1c', subColor: '#c9c9c9' },
  { title: 'Bajo Electrico', timeRange: ['17:30', '19:30'], day: 4, color: '#fb5870', subColor: '#3a0d16' },
  { title: 'Tarea Universidad', timeRange: ['17:00', '19:30'], day: 6, color: '#020202', subColor: '#f5f4f5' },
  { title: 'Ejercicio + Dormir', timeRange: ['22:00', '24:00'], day: 6, color: '#1c1c1c', subColor: '#c9c9c9' },
]

const HOURS = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => i + START_HOUR)
const DAY_SPAN = (END_HOUR - START_HOUR) * 60

const toMin = (t) => {
  const [h, m] = t.split(':').map(Number)
  return (h === 0 ? 24 : h) * 60 + m
}

function useNow() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000)
    return () => clearInterval(id)
  }, [])
  return now
}

function isActive(ev, nowDay, nowMin) {
  if (ev.day !== nowDay) return false
  return toMin(ev.timeRange[0]) <= nowMin && nowMin < toMin(ev.timeRange[1])
}

export default function App() {
  const now = useNow()
  const nowDay = (now.getDay() + 6) % 7 // convierte domingo=0 de JS a lunes=0
  const nowMin = now.getHours() * 60 + now.getMinutes()
  const [selectedDay, setSelectedDay] = useState(nowDay)

  const clockLabel = now.toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

  const currentEvent = useMemo(
      () => EVENTS.find((e) => isActive(e, nowDay, nowMin)),
      [nowDay, nowMin]
  )

  const dayEvents = useMemo(() => {
    const list = EVENTS.filter((e) => e.day === selectedDay)
    const seen = new Set()
    return list
        .filter((e) => {
          const key = e.title + e.timeRange[0]
          if (seen.has(key)) return false
          seen.add(key)
          return true
        })
        .sort((a, b) => toMin(a.timeRange[0]) - toMin(b.timeRange[0]))
  }, [selectedDay])

  const nowLinePercent = nowMin >= START_HOUR * 60
      ? ((nowMin - START_HOUR * 60) / DAY_SPAN) * 100
      : null

  return (
      <div className="app">
        <header className="header">
          <div>
            <div className="clock">{clockLabel}</div>
            <div className="today-label">{DAYS[nowDay]} · hoy</div>
          </div>
          {currentEvent && (
              <div
                  className="now-badge"
                  style={{ background: currentEvent.color, color: currentEvent.subColor, borderColor: currentEvent.subColor }}
              >
                <span className="now-dot" style={{ background: currentEvent.subColor }} />
                {currentEvent.title}
              </div>
          )}
        </header>

        {/* Vista escritorio */}
        <div className="grid-desktop">
          <div className="week-grid">
            <div className="hours-col">
              {HOURS.map((h) => (
                  <div key={h} className="hour-mark">{String(h).padStart(2, '0')}:00</div>
              ))}
            </div>
            {DAYS.map((d, dayIdx) => (
                <div key={d} className={'day-col' + (dayIdx === nowDay ? ' today' : '')}>
                  <div className="day-col-label">{d}</div>
                  <div className="day-col-body">
                    {HOURS.map((h) => (
                        <div key={h} className="hour-line" />
                    ))}
                    {dayIdx === nowDay && nowLinePercent !== null && (
                        <div className="now-line" style={{ top: `${nowLinePercent}%` }} />
                    )}
                    {EVENTS.filter((e) => e.day === dayIdx).map((ev, i) => {
                      const start = toMin(ev.timeRange[0]) - START_HOUR * 60
                      const end = toMin(ev.timeRange[1]) - START_HOUR * 60
                      const top = (start / DAY_SPAN) * 100
                      const height = ((end - start) / DAY_SPAN) * 100
                      const active = isActive(ev, nowDay, nowMin)
                      return (
                          <div
                              key={i}
                              className={'block' + (active ? ' active' : '')}
                              style={{
                                top: `${top}%`,
                                height: `${height}%`,
                                background: ev.color,
                                color: ev.subColor,
                                borderColor: ev.subColor,
                                animationDelay: `${i * 40}ms`,
                              }}
                          >
                            <span className="block-title">{ev.title}</span>
                            <span className="block-time">{ev.timeRange[0]}–{ev.timeRange[1]}</span>
                          </div>
                      )
                    })}
                  </div>
                </div>
            ))}
          </div>
        </div>

        {/* Vista movil */}
        <div className="grid-mobile">
          <div className="day-picker">
            {DAYS.map((d, i) => (
                <button
                    key={d}
                    className={'day-pill' + (i === selectedDay ? ' selected' : '') + (i === nowDay ? ' today' : '')}
                    onClick={() => setSelectedDay(i)}
                >
                  {d}
                </button>
            ))}
          </div>
          <div className="mobile-list">
            {dayEvents.length === 0 && <div className="empty-state">Sin actividades</div>}
            {dayEvents.map((ev, idx) => {
              const active = isActive(ev, selectedDay, nowMin) && selectedDay === nowDay
              return (
                  <div
                      key={idx}
                      className={'mobile-item' + (active ? ' active' : '')}
                      style={{ background: ev.color, borderColor: ev.subColor, animationDelay: `${idx * 50}ms` }}
                  >
                    <div>
                      <div className="mobile-item-time" style={{ color: ev.subColor }}>
                        {ev.timeRange[0]} – {ev.timeRange[1]}
                      </div>
                      <div className="mobile-item-title" style={{ color: ev.subColor }}>
                        {ev.title}
                      </div>
                    </div>
                    {active && <span className="live-dot" style={{ background: ev.subColor }} />}
                  </div>
              )
            })}
          </div>
        </div>
      </div>
  )
}