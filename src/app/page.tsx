import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import styles from './page.module.css'

export const revalidate = 60

async function getStats() {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000).toISOString()

  const [totalResult, monthResult, hourResult, dirtyTrainsResult] = await Promise.all([
    supabase
      .from('complaints')
      .select('passenger_number', { count: 'exact', head: true }),
    supabase
      .from('complaints')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', startOfMonth),
    supabase
      .from('complaints')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', oneHourAgo),
    supabase
      .from('treinstellen')
      .select('number', { count: 'exact', head: true })
      .gt('vies_count', 0),
  ])

  return {
    totalPassengers: totalResult.count || 0,
    complaintsThisMonth: monthResult.count || 0,
    complaintsLastHour: hourResult.count || 0,
    dirtyTrains: dirtyTrainsResult.count || 0,
  }
}

async function getRecentComplaints() {
  const { data } = await supabase
    .from('complaints')
    .select('id, type, treinstel_number, station_code, categories, severity, body, created_at')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(4)

  return data || []
}

function getTimeAgo(dateStr: string): string {
  const now = new Date()
  const date = new Date(dateStr)
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 1) return 'zojuist'
  if (diffMins < 60) return `${diffMins} min`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours} uur`
  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays} dag${diffDays !== 1 ? 'en' : ''}`
}

function getCategoryEmoji(cat: string): string {
  const map: Record<string, string> = {
    vies: '🤢', overvol: '🧍', vertraging: '🕐', comfort: '🌡️',
    slechte_info: '📢', personeel: '😤', overlast: '🔊', boete: '🎫',
    toegankelijk: '♿', uitval: '❌', aansluiting: '🔄', anders: '📎',
  }
  return map[cat] || '📎'
}

function getCategoryLabel(cat: string): string {
  const map: Record<string, string> = {
    vies: 'Vies', overvol: 'Overvol', vertraging: 'Vertraging', comfort: 'Comfort',
    slechte_info: 'Slechte info', personeel: 'Personeel', overlast: 'Overlast',
    boete: 'Boete', toegankelijk: 'Toegankelijk', uitval: 'Uitval',
    aansluiting: 'Aansluiting', anders: 'Anders',
  }
  return map[cat] || cat
}

export default async function HomePage() {
  const stats = await getStats()
  const recentComplaints = await getRecentComplaints()
  const monthNames = ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec']
  const currentMonth = monthNames[new Date().getMonth()]

  return (
    <main>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.logo}>
            <span className={styles.logoDe}>De</span>
            <span className={styles.logoKlaag}>Klaag</span>
            <span className={styles.logoTrein}>trein</span>
          </div>
          <nav className={styles.nav}>
            <Link href="/" className={styles.navActive}>Home</Link>
            <Link href="/klaag">Klaag!</Link>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/over-ons">Over ons</Link>
          </nav>
        </div>
        <div className={styles.headerLine} />
      </header>

      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>
          Trein te laat?<br />
          Uitgevallen? <span className={styles.heroAccent}>Smerig?</span>
        </h1>
        <p className={styles.heroSub}>
          Meld het. Anoniem. In een paar tikken.<br />
          Samen maken we zichtbaar wat beter moet.
        </p>
        <Link href="/klaag" className={styles.btn}>
          Stap in de Klaagtrein
        </Link>
      </section>

      <section className={styles.stats}>
        <div className={styles.stat}>
          <div className={styles.statValue}>
            {stats.totalPassengers > 0 ? stats.totalPassengers.toLocaleString('nl-NL') : '—'}
          </div>
          <div className={styles.statLabel}>Reizigers</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statValue}>
            {stats.complaintsThisMonth > 0 ? stats.complaintsThisMonth.toLocaleString('nl-NL') : '—'}
          </div>
          <div className={styles.statLabel}>Klachten {currentMonth}</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statValue}>
            {stats.dirtyTrains > 0 ? stats.dirtyTrains : '—'}
          </div>
          <div className={styles.statLabel}>Vieze treinen</div>
        </div>
      </section>

      <div className={styles.livePulse}>
        <span className={styles.liveDot} />
        <span className={styles.liveText}>
          {stats.complaintsLastHour > 0
            ? `${stats.complaintsLastHour} klacht${stats.complaintsLastHour !== 1 ? 'en' : ''} in het afgelopen uur`
            : 'Nog geen klachten vandaag — wees de eerste'}
        </span>
      </div>

      <div className={styles.divider} />

      {recentComplaints.length > 0 && (
        <section className={styles.section}>
          <div className="kl-section-label">Recente klachten</div>
          {recentComplaints.map((complaint: any) => (
            <div key={complaint.id} className={styles.feedCard}>
              <div className={styles.feedMeta}>
                <span className={styles.feedSource}>
                  {complaint.type === 'train' && complaint.treinstel_number
                    ? `🚂 ${complaint.treinstel_number}`
                    : complaint.type === 'station'
                      ? `🏛️ Station`
                      : '🛤️ Reis'}
                </span>
                <span className={styles.feedTime}>
                  {getTimeAgo(complaint.created_at)}
                </span>
              </div>
              {complaint.body && (
                <p className={styles.feedText}>&ldquo;{complaint.body}&rdquo;</p>
              )}
              <div className={styles.feedTags}>
                {complaint.categories?.map((cat: string) => (
                  <span key={cat} className={styles.feedTag}>
                    {getCategoryEmoji(cat)} {getCategoryLabel(cat)}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      <section className={styles.secondCta}>
        <h2 className={styles.secondCtaTitle}>Herkenbaar?</h2>
        <p className={styles.secondCtaSub}>Jouw klacht telt mee. Anoniem. Openbaar.</p>
        <Link href="/klaag" className={styles.btn}>
          Stap in de Klaagtrein
        </Link>
        <Link href="/dashboard" className={styles.btnGhost}>
          Bekijk het dashboard
        </Link>
      </section>

      <footer className={styles.footer}>
        <div>&copy; Stichting De Klaagtrein &middot; KVK: [nummer]</div>
        <div className={styles.footerTagline}>Pro-trein. Anti-bagger.</div>
        <div className={styles.footerLinks}>
          <Link href="/privacy">Privacy</Link>
          <Link href="/voorwaarden">Voorwaarden</Link>
          <Link href="/over-ons">Over ons</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </footer>
    </main>
  )
}
