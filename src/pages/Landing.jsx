import { ArrowRight, CheckCircle2, Clock3, HeartHandshake, MapPin, PackageCheck, Route, ShieldCheck, UtensilsCrossed } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/layout/TopBar';
import { useApp } from '../context/AppContext';

const steps = [
  { icon: UtensilsCrossed, number: '01', title: 'A partner logs surplus', text: 'Food donors share what is ready, how much is available, and the safe pickup window.' },
  { icon: Route, number: '02', title: 'Sevadeep coordinates the handoff', text: 'Volunteers see the live queue and receive a paired pickup and delivery route.' },
  { icon: HeartHandshake, number: '03', title: 'A meal reaches someone', text: 'Every handoff is visible to the operations team, from donor doorstep to community hub.' },
];

export default function Landing() {
  const navigate = useNavigate();
  const { listings, volunteers, suppliers } = useApp();
  const availableCount = listings.filter(listing => listing.status === 'Available').length;
  const activeVolunteers = volunteers.filter(volunteer => volunteer.status !== 'Offline').length;
  const partnerCount = suppliers.length;

  return (
    <div className="landing-page">
      <TopBar />

      <main>
        <section className="landing-hero">
          <div className="landing-hero-inner">
            <div className="landing-hero-copy">
              <div className="landing-eyebrow"><span className="landing-eyebrow-dot" /> Sevadeep × Pune operations</div>
              <h1>Rescue food.<br /><span>Coordinate care.</span><br />Feed Pune.</h1>
              <p className="landing-lede">Nourish.Net gives Sevadeep partners one calm, accountable place to move safe surplus food from kitchens to the people who need it.</p>
              <div className="landing-actions">
                <button className="landing-button landing-button-light" onClick={() => navigate('/supplier/log')}>Log surplus <ArrowRight size={17} /></button>
                <button className="landing-button landing-button-quiet" onClick={() => navigate('/volunteer/available')}>Join the pickup queue</button>
              </div>
              <div className="landing-trust-row">
                <span><ShieldCheck size={16} /> Built around verified coordination</span>
                <span><MapPin size={16} /> Pune, Maharashtra</span>
              </div>
            </div>

            <div className="landing-hero-card">
              <div className="landing-card-topline"><span className="landing-live-dot" /> Live rescue desk</div>
              <div className="landing-route-card">
                <div className="landing-route-card-head">
                  <div><span className="landing-kicker">Today in Pune</span><strong>From kitchen to community</strong></div>
                  <PackageCheck size={24} />
                </div>
                <div className="landing-route-line">
                  <div className="landing-route-node landing-route-node-orange"><UtensilsCrossed size={16} /></div>
                  <div className="landing-route-copy"><span>Food partner</span><strong>{availableCount} pickup opportunities</strong></div>
                </div>
                <div className="landing-route-connector" />
                <div className="landing-route-line">
                  <div className="landing-route-node landing-route-node-red"><HeartHandshake size={16} /></div>
                  <div className="landing-route-copy"><span>Sevadeep field team</span><strong>{activeVolunteers} volunteers active</strong></div>
                </div>
                <div className="landing-route-connector" />
                <div className="landing-route-line">
                  <div className="landing-route-node landing-route-node-cream"><MapPin size={16} /></div>
                  <div className="landing-route-copy"><span>Delivery hubs</span><strong>Hospitals & community shelters</strong></div>
                </div>
              </div>
              <div className="landing-hero-note"><Clock3 size={16} /> Every listing carries a clear food-safety deadline.</div>
            </div>
          </div>
        </section>

        <section className="landing-proof">
          <div><span className="landing-proof-label">The Sevadeep way</span><strong>Useful giving needs a clear next step.</strong></div>
          <p>Inspired by Sevadeep’s work connecting donors with verified NGOs and its Narayanseva meal distribution mission at Sassoon Hospital.</p>
          <a href="https://sevadeep.org/" target="_blank" rel="noreferrer">Learn about Sevadeep <ArrowRight size={15} /></a>
        </section>

        <section className="landing-section">
          <div className="landing-section-heading"><span className="landing-kicker">One shared rhythm</span><h2>Less chasing. More doing.</h2><p>Each role sees the decision they need to make next, with enough context to make it confidently.</p></div>
          <div className="landing-steps">
            {steps.map(({ icon: Icon, number, title, text }) => <article className="landing-step" key={number}><div className="landing-step-icon"><Icon size={21} /></div><span className="landing-step-number">{number}</span><h3>{title}</h3><p>{text}</p></article>)}
          </div>
        </section>

        <section className="landing-section landing-section-split">
          <div className="landing-impact-panel">
            <span className="landing-kicker">Designed for the people doing the work</span>
            <h2>Operational clarity with a human pulse.</h2>
            <p>Sevadeep’s public platform is built around trust, coordination, and a visible donation journey. Nourish.Net brings those same values into the time-sensitive work of rescuing prepared food.</p>
            <div className="landing-impact-list"><div><CheckCircle2 size={18} /> Donors know what happens next</div><div><CheckCircle2 size={18} /> Volunteers get a route, not a chat thread</div><div><CheckCircle2 size={18} /> Coordinators can see the whole city</div></div>
          </div>
          <div className="landing-stats-card">
            <div><span className="landing-kicker">Pune network snapshot</span><div className="landing-big-stat">{partnerCount}<span>food partners</span></div><div className="landing-stat-row"><span>Live pickup queue</span><strong>{availableCount}</strong></div><div className="landing-stat-row"><span>Field volunteers active</span><strong>{activeVolunteers}</strong></div><div className="landing-stat-row"><span>Delivery destination</span><strong>Local hubs</strong></div></div>
            <div className="landing-stats-foot">Live operational figures appear here when the database is connected.</div>
          </div>
        </section>

        <section className="landing-final-cta"><div><span className="landing-kicker">Ready when the food is</span><h2>Make the next handoff count.</h2></div><button className="landing-button landing-button-dark" onClick={() => navigate('/ops/overview')}>Open operations desk <ArrowRight size={17} /></button></section>
      </main>

      <footer className="landing-footer"><span>© {new Date().getFullYear()} Nourish.Net</span><span>Built for Sevadeep NGO · Pune</span><a href="https://sevadeep.org/" target="_blank" rel="noreferrer">sevadeep.org</a></footer>
    </div>
  );
}

