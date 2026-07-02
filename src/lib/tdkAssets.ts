// CDN URLs for imagery mirrored from tdksports.in
import federalBank from "@/assets/tdk/Federal_Bank_logo.png.asset.json";
import periyarClub from "@/assets/tdk/periyarclublogo.png.asset.json";
import tdkLogo from "@/assets/tdk/TDKSportslogo.png.asset.json";
import santosTravel from "@/assets/tdk/santos.travel_logo.png.asset.json";
import dtpc from "@/assets/tdk/dtpc_logo_new.jpg.asset.json";
import keralaTourism from "@/assets/tdk/Kerala_Tourism_large.png.asset.json";
import decathlon from "@/assets/tdk/decathlon_logo.png.asset.json";
import darc from "@/assets/tdk/darc_logo.jpg.asset.json";
import aster from "@/assets/tdk/Aster_logo.png.asset.json";
import manoramaSwim from "@/assets/tdk/manorama_swimathon.png.asset.json";
import swimNews1 from "@/assets/tdk/swimathon_news1.jpg.asset.json";
import swimNews2 from "@/assets/tdk/swimathon_news2.jpg.asset.json";
import manorama from "@/assets/tdk/manorama.png.asset.json";
import madhyamam from "@/assets/tdk/Madhyamam_Press_Release.jpg.asset.json";
import swim2026 from "@/assets/tdk/swimathon2026.webp.asset.json";
import paddlers1 from "@/assets/tdk/paddlers1.jpg.asset.json";
import paddlers2 from "@/assets/tdk/paddlers2.jpg.asset.json";

export const TDK_ASSETS = {
  logos: {
    federalBank: federalBank.url,
    periyarClub: periyarClub.url,
    tdkSports: tdkLogo.url,
    santosTravel: santosTravel.url,
    dtpc: dtpc.url,
    keralaTourism: keralaTourism.url,
    decathlon: decathlon.url,
    darc: darc.url,
    aster: aster.url,
  },
  press: {
    manoramaSwim: manoramaSwim.url,
    swimNews1: swimNews1.url,
    swimNews2: swimNews2.url,
    manorama: manorama.url,
    madhyamam: madhyamam.url,
  },
  images: {
    swimathon2026: swim2026.url,
    paddlers1: paddlers1.url,
    paddlers2: paddlers2.url,
  },
};

// Map partner label -> logo url
export const PARTNER_LOGOS: Record<string, string> = {
  "Federal Bank": federalBank.url,
  "Periyar Adventure Club": periyarClub.url,
  "TDK Sports": tdkLogo.url,
  "Santos.Travel": santosTravel.url,
  "Santos King": santosTravel.url,
  "DTPC Ernakulam": dtpc.url,
  "Kerala Tourism": keralaTourism.url,
  Decathlon: decathlon.url,
  DARC: darc.url,
  "Aster Medcity": aster.url,
};
