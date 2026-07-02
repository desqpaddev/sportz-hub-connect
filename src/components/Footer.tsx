import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";

const Footer = () => (
  <footer className="section-dark">
    <div className="container mx-auto px-4 py-14">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-2xl font-bold font-display mb-3 text-primary">TDK SPORTS</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Organisers of India's largest river swimathon, sunset beach runs, paddler meetups and cyclothons across Kerala.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider mb-4">Explore</h4>
          <div className="flex flex-col gap-2">
            <Link to="/events" className="text-sm text-gray-400 hover:text-primary transition-colors">Events</Link>
            <Link to="/about" className="text-sm text-gray-400 hover:text-primary transition-colors">About TDK Sports</Link>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider mb-4">Signature Events</h4>
          <div className="flex flex-col gap-2 text-sm text-gray-400">
            <span>Kochi Swimathon Ultra</span>
            <span>Kochi Duskathon</span>
            <span>Paddlers Meetup</span>
            <span>Tour de Kerala</span>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider mb-4">Contact</h4>
          <div className="flex flex-col gap-2 text-sm text-gray-400">
            <a href="tel:8089084088" className="flex items-center gap-2 hover:text-primary transition-colors"><Phone size={14} /> 8089084088</a>
            <a href="mailto:info@tdksports.in" className="flex items-center gap-2 hover:text-primary transition-colors"><Mail size={14} /> info@tdksports.in</a>
            <span className="flex items-center gap-2"><MapPin size={14} /> Kochi, Kerala</span>
          </div>
        </div>
      </div>
      <div className="mt-10 pt-6 border-t border-gray-700 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-gray-500">© {new Date().getFullYear()} TDK Sports</p>
        <p className="text-xs text-gray-500 italic">Push the limit. Protect the river.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
