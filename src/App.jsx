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
  { title: 'Youtube', timeRange: ['13:00', '17:00'], day: 5, color: '#280043', subColor: '#ff6fc7' },
  { title: 'Youtube', timeRange: ['14:00', '17:00'], day: 6, color: '#280043', subColor: '#ff6fc7' },
  { title: 'Tarea Universidad', timeRange: ['20:00', '22:00'], day: 0, color: '#020202', subColor: '#f5f4f5' },
  { title: 'Tarea Universidad', timeRange: ['17:30', '19:30'], day: 2, color: '#020202', subColor: '#f5f4f5' },
  { title: 'Tarea Universidad', timeRange: ['22:00', '24:00'], day: 4, color: '#020202', subColor: '#f5f4f5' },
  { title: 'Tarea Universidad', timeRange: ['17:30', '19:30'], day: 6, color: '#020202', subColor: '#f5f4f5' },
  { title: 'Tarea Universidad', timeRange: ['22:00', '24:00'], day: 1, color: '#020202', subColor: '#f5f4f5' },
  { title: 'Tarea Universidad', timeRange: ['20:00', '22:00'], day: 3, color: '#020202', subColor: '#f5f4f5' },
  { title: 'Ejercicio + Dormir', timeRange: ['22:00', '24:00'], day: 0, color: '#1c1c1c', subColor: '#d9d9d9' },
  { title: 'Ejercicio + Dormir', timeRange: ['19:30', '24:00'], day: 2, color: '#1c1c1c', subColor: '#d9d9d9' },
  { title: 'Ejercicio + Dormir', timeRange: ['22:00', '24:00'], day: 3, color: '#1c1c1c', subColor: '#d9d9d9' },
  { title: 'Ejercicio + Dormir', timeRange: ['20:00', '24:00'], day: 5, color: '#1c1c1c', subColor: '#d9d9d9' },
  { title: 'Ejercicio + Dormir', timeRange: ['21:00', '24:00'], day: 6, color: '#1c1c1c', subColor: '#d9d9d9' },
  { title: 'Ciberseguridad', timeRange: ['17:30', '22:00'], day: 1, color: '#313896', subColor: '#0fd0f7' },
  { title: 'Ciberseguridad', timeRange: ['15:30', '20:00'], day: 3, color: '#313896', subColor: '#0fd0f7' },
  { title: 'Ciberseguridad', timeRange: ['17:00', '20:00'], day: 5, color: '#313896', subColor: '#0fd0f7' },
  { title: 'Bajo Electrico', timeRange: ['17:30', '20:00'], day: 0, color: '#100e0e', subColor: '#fe6a56' },
  { title: 'Bajo Electrico', timeRange: ['17:30', '20:00'], day: 4, color: '#100e0e', subColor: '#fe6a56' },
]

const HOURS = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => i + START_HOUR)
const DAY_SPAN = (END_HOUR - START_HOUR) * 60

const toMin = (t) => {
  const [h, m] = t.split(':').map(Number)
  return (h === 0 ? 24 : h) * 60 + m
}

// Convierte "HH:MM" (24h) a formato de 12 horas con am/pm, p.ej. "17:30" -> "5:30 pm"
function to12h(t) {
  const [hRaw, m] = t.split(':').map(Number)
  const h = hRaw === 24 ? 0 : hRaw
  const period = h >= 12 ? 'pm' : 'am'
  let h12 = h % 12
  if (h12 === 0) h12 = 12
  return `${h12}:${String(m).padStart(2, '0')} ${period}`
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

// Agrupa eventos del mismo dia que se traslapan en el tiempo y les asigna
// columna + total de columnas, para poder dibujarlos lado a lado.
function layoutDay(dayEvents) {
  const sorted = [...dayEvents].sort((a, b) => toMin(a.timeRange[0]) - toMin(b.timeRange[0]))
  const clusters = []

  sorted.forEach((ev) => {
    const evStart = toMin(ev.timeRange[0])
    const evEnd = toMin(ev.timeRange[1])
    let cluster = clusters.find((c) => c.end > evStart)
    if (!cluster) {
      cluster = { end: evEnd, items: [] }
      clusters.push(cluster)
    }
    cluster.end = Math.max(cluster.end, evEnd)
    cluster.items.push(ev)
  })

  const result = []
  clusters.forEach((cluster) => {
    const columns = []
    cluster.items.forEach((ev) => {
      const evStart = toMin(ev.timeRange[0])
      let colIndex = columns.findIndex((colEnd) => colEnd <= evStart)
      if (colIndex === -1) {
        colIndex = columns.length
        columns.push(0)
      }
      columns[colIndex] = toMin(ev.timeRange[1])
      result.push({ ev, col: colIndex })
    })
    result.forEach((r) => {
      if (cluster.items.includes(r.ev)) r.totalCols = columns.length
    })
  })

  return result
}

export default function App() {
  const now = useNow()
  const nowDay = (now.getDay() + 6) % 7 // convierte domingo=0 de JS a lunes=0
  const nowMin = now.getHours() * 60 + now.getMinutes()
  const [selectedDay, setSelectedDay] = useState(nowDay)

  const clockLabel = now.toLocaleTimeString('es-MX', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
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
                  <div key={h} className="hour-mark">{to12h(`${String(h).padStart(2, '0')}:00`)}</div>
              ))}
            </div>
            {DAYS.map((d, dayIdx) => {
              const layout = layoutDay(EVENTS.filter((e) => e.day === dayIdx))
              return (
                  <div key={d} className={'day-col' + (dayIdx === nowDay ? ' today' : '')}>
                    <div className="day-col-label">{d}</div>
                    <div className="day-col-body">
                      {HOURS.map((h) => (
                          <div key={h} className="hour-line" />
                      ))}
                      {dayIdx === nowDay && nowLinePercent !== null && (
                          <div className="now-line" style={{ top: `${nowLinePercent}%` }} />
                      )}
                      {layout.map(({ ev, col, totalCols }, i) => {
                        const start = toMin(ev.timeRange[0]) - START_HOUR * 60
                        const end = toMin(ev.timeRange[1]) - START_HOUR * 60
                        const top = (start / DAY_SPAN) * 100
                        const height = ((end - start) / DAY_SPAN) * 100
                        const active = isActive(ev, nowDay, nowMin)
                        const widthPct = 100 / totalCols
                        return (
                            <div
                                key={i}
                                className={'block' + (active ? ' active' : '')}
                                style={{
                                  top: `${top}%`,
                                  height: `${height}%`,
                                  left: `calc(${col * widthPct}% + 3px)`,
                                  width: `calc(${widthPct}% - 6px)`,
                                  background: ev.color,
                                  color: ev.subColor,
                                  borderColor: ev.subColor,
                                  animationDelay: `${i * 40}ms`,
                                }}
                            >
                              <span className="block-title">{ev.title}</span>
                              <span className="block-time">{to12h(ev.timeRange[0])}–{to12h(ev.timeRange[1])}</span>
                            </div>
                        )
                      })}
                    </div>
                  </div>
              )
            })}
          </div>
        </div>

        {/* Vista movil */}
        <div className="grid-mobile">
          <div
              className="now-badge now-badge-mobile"
              style={
                currentEvent
                    ? { background: currentEvent.color, color: currentEvent.subColor, borderColor: currentEvent.subColor }
                    : { background: '#15151c', color: '#a8a8c0', borderColor: '#2a2a35' }
              }
          >
            {currentEvent ? (
                <>
                  <span className="now-dot" style={{ background: currentEvent.subColor }} />
                  En este momento: {currentEvent.title}
                </>
            ) : (
                'Sin actividad en este momento'
            )}
          </div>
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
                        {to12h(ev.timeRange[0])} – {to12h(ev.timeRange[1])}
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