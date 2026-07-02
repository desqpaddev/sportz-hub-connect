import { TDK_ASSETS } from "./tdkAssets";

export type PressLink = { label: string; source?: string; date?: string; url: string; excerpt?: string; image?: string };
export type Sponsor = { label: string; role: string; logo?: string };

export type PastEventExtras = {
  youtubeId?: string;
  press?: PressLink[];
  highlights?: string[];
  about?: string;
  categories?: string[];
  sponsors?: Sponsor[];
  gallery?: string[];
  stats?: { label: string; value: string }[];
};

export const PAST_EVENTS_EXTRAS: Record<string, PastEventExtras> = {
  "Federal Bank Kochi Swimathon Ultra 2025": {
    youtubeId: "WBL8GARfsVA",
    about:
      "The 2025 edition of India's largest river swimathon on the River Periyar in Aluva — the biggest gathering to date with 727 swimmers taking on the 10M Ultra and shorter categories. Title-sponsored by Federal Bank and organised by TDK Sports, in association with DTPC Ernakulam and Kerala Tourism.",
    highlights: [
      "727 swimmers — the largest edition to date",
      "10M Ultra category on River Periyar, Aluva",
      "Title sponsored by Federal Bank",
      "In association with DTPC Ernakulam & Kerala Tourism",
      "Medical support by Aster Medcity",
    ],
    categories: ["10M Ultra", "5 km", "3 km", "1 km"],
    stats: [
      { label: "Swimmers", value: "727" },
      { label: "Ultra Distance", value: "10 M" },
      { label: "Venue", value: "River Periyar" },
    ],
    sponsors: [
      { label: "Federal Bank", role: "Title Sponsor" },
      { label: "TDK Sports", role: "Organisor" },
      { label: "Santos.Travel", role: "An Initiative By" },
      { label: "DTPC Ernakulam", role: "In Association With" },
      { label: "Kerala Tourism", role: "In Association With" },
      { label: "Decathlon", role: "Sports Partner" },
      { label: "Aster Medcity", role: "Medical Partner" },
      { label: "DARC", role: "NGO Partner" },
    ],
  },

  "Florid Kochi Swimathon Ultra 2024": {
    youtubeId: "NSbJ3ildWgI",
    about:
      "The 2024 edition scaled up the 10M Ultra format on the Periyar with 610 swimmers. Presented by Florid and organised by TDK Sports — cementing the Kochi Swimathon as India's largest river swim.",
    highlights: [
      "610 swimmers across the 10M Ultra and shorter categories",
      "Presented by Florid",
      "India's Largest River Swimathon",
      "10 km course down the River Periyar, Aluva",
    ],
    categories: ["10M Ultra", "5 km", "3 km", "1 km"],
    stats: [
      { label: "Swimmers", value: "610" },
      { label: "Ultra Distance", value: "10 M" },
      { label: "Venue", value: "River Periyar" },
    ],
    sponsors: [
      { label: "Florid", role: "Title Sponsor" },
      { label: "TDK Sports", role: "Organisor" },
      { label: "Santos.Travel", role: "An Initiative By" },
      { label: "DTPC Ernakulam", role: "In Association With" },
      { label: "Kerala Tourism", role: "In Association With" },
    ],
  },

  "Florid Kochi Swimathon 2023": {
    youtubeId: "GjXYrYR-k4M",
    about:
      "South India's first 10 km river swimathon. Held on the Periyar in Aluva, the 2023 edition drew swimmers from across the country and was covered by leading Malayalam and English news outlets.",
    highlights: [
      "South India's first 10 km river swimathon",
      "Held on the Periyar River, Aluva",
      "Featured on Mathrubhumi News, Manorama News & Manorama print",
      "In association with DTPC & Kerala Tourism",
    ],
    categories: ["10 km", "5 km", "3 km", "1 km"],
    press: [
      {
        label: "Mathrubhumi News",
        source: "Mathrubhumi",
        date: "Feb 12, 2023",
        url: "https://www.youtube.com/watch?v=-fuKy-qiTfI",
        excerpt: "ദക്ഷിണേന്ത്യയിലെ ആദ്യത്തെ ഫ്ലോറിഡ് കൊച്ചി റിവർ സ്വിംതണ്‍ പെരിയാറിൽ സംഘടിപ്പിച്ചു",
      },
      {
        label: "Manorama News",
        source: "Manorama News",
        date: "Feb 12, 2023",
        url: "https://www.youtube.com/watch?v=WV6a-F2cLE8",
        excerpt: "ഫ്ലോറിഡ് കൊച്ചി സ്വിംത്തൺ കൊച്ചിയിൽ സംഘടിപ്പിച്ചു",
      },
      {
        label: "Manorama (print)",
        source: "Manorama",
        date: "Feb 15, 2023",
        url: TDK_ASSETS.press.manoramaSwim,
        image: TDK_ASSETS.press.manoramaSwim,
      },
    ],
    gallery: [TDK_ASSETS.press.manoramaSwim, TDK_ASSETS.press.swimNews1, TDK_ASSETS.press.swimNews2],
    sponsors: [
      { label: "Florid", role: "Title Sponsor" },
      { label: "TDK Sports", role: "Organisor" },
      { label: "DTPC Ernakulam", role: "In Association With" },
      { label: "Kerala Tourism", role: "In Association With" },
    ],
  },

  "Kochi Swimathon 2022": {
    youtubeId: "Z9noe2ql_7g",
    about:
      "The inaugural Kochi Swimathon on the River Periyar — the event that set the stage for what would become India's largest river swim, growing edition after edition.",
    highlights: [
      "The inaugural edition of the Kochi Swimathon",
      "Set the stage for India's largest river swim",
      "Held on the Periyar River, Aluva",
    ],
    categories: ["5 km", "3 km", "1 km"],
    sponsors: [
      { label: "TDK Sports", role: "Organisor" },
      { label: "Santos.Travel", role: "An Initiative By" },
      { label: "DTPC Ernakulam", role: "In Association With" },
    ],
  },

  "Paddlers Meetup 2021": {
    youtubeId: "FnBdAaNv0O4",
    about:
      "A World Tourism Day gathering of kayakers and paddlers on the River Periyar, Aluva — combining a community meetup with a Periyar cleanup drive to boost adventure & eco-tourism in Kerala.",
    highlights: [
      "World Tourism Day celebration",
      "Kayakers united for a River Periyar cleanup",
      "Boost for adventure & eco-tourism in Aluva",
      "Preceded by a free Swim/Snorkel/Dive training session with Adventurist Jeroen Elout",
    ],
    categories: ["Kayak meetup", "River cleanup", "Free dive/snorkel training"],
    press: [
      {
        label: "Mathrubhumi",
        source: "Mathrubhumi",
        date: "Sep 27, 2021",
        url: "https://tdksports.in/img/gallery/paddlersmeetup/media/1.jpg",
      },
      {
        label: "Malayalam Manorama",
        source: "Malayalam Manorama",
        date: "Sep 27, 2021",
        url: "https://www.manoramaonline.com/district-news/ernakulam/2021/09/27/ernakulam-adventure-eco-tourism-project-in-aluva.html",
      },
    ],
    sponsors: [
      { label: "Periyar Adventure Club", role: "Host" },
      { label: "TDK Sports", role: "Organisor" },
      { label: "DTPC Ernakulam", role: "In Association With" },
    ],
  },

  "Kochi Duskathon 2019": {
    youtubeId: "y4um_W7ef-I",
    about:
      "The second edition of the Kochi Duskathon — a 10 km sunset beach run from Kuzhuppilly to Cherai, one of Ernakulam's longest and most picturesque beaches. Aimed for a Guinness World Record for the world's largest barefoot race, aligning with the World Tourism Day theme 'Tourism and Digital Transformation.'",
    highlights: [
      "10 km beach run from Kuzhuppilly to Cherai",
      "Aimed for the Guinness World Record — largest barefoot race",
      "Aligned with the World Tourism Day theme 'Tourism & Digital Transformation'",
      "In association with DTPC Ernakulam & Kerala Tourism",
    ],
    categories: ["10 km barefoot run", "5 km run"],
    press: [
      {
        label: "'Kochi Duskathon' held in Kuzhuppilly beach",
        source: "Times of India",
        date: "Apr 18, 2019",
        url: "https://timesofindia.indiatimes.com/entertainment/events/kochi/kochi-duskathon-held-in-kuzhupilly-beach/articleshow/68918001.cms",
        excerpt:
          "The second edition of Kochi Duskathon 2019 was held at Kuzhupilly beach in Cherai, promoting the World Tourism Day theme 'Tourism and digital transformation.'",
      },
      {
        label: "'Kochi Duskathon' beach run today",
        source: "The Hindu",
        date: "Apr 13, 2019",
        url: "https://www.thehindu.com/news/cities/Kochi/kochi-duskathon-beach-run-today/article26831091.ece",
        excerpt:
          "Expected to attract a large number of barefoot runners in a beach run from Kuzhuppilly to Cherai at 4 p.m. on Sunday.",
      },
      {
        label: "Kochi Duskathon aims for a Guinness Record",
        source: "New Indian Express",
        date: "Apr 11, 2019",
        url: "http://www.newindianexpress.com/cities/kochi/2019/apr/11/kochi-duskathon-aims-for-a-guinness-record-1962821.html",
        excerpt:
          "Aiming for the Guinness World Record of the world's largest barefoot race, Kochi Duskathon 2019 is set for its second edition on April 14 at Kuzhupilly beach.",
      },
      {
        label: "Kochi Duskathon 2019 organisers aim world record",
        source: "Deccan Chronicle",
        date: "Apr 06, 2019",
        url: "https://www.deccanchronicle.com/nation/current-affairs/060419/kochi-duskathon-2019-organisers-aim-world-record.html",
        excerpt:
          "Registrations open with DTPC targeting 3,000 runners including 600 foreign tourists on April 14 on the 10-km Kuzhuppilly–Cherai beach section.",
      },
      {
        label: "Kochi Duskathon in April",
        source: "Deccan Chronicle",
        date: "Mar 14, 2019",
        url: "https://www.deccanchronicle.com/lifestyle/travel/140319/kochi-duskathon-in-april.html",
        excerpt:
          "Following the success of Kochi Duskathon 2018, the 2019 edition to be conducted in association with DTPC Ernakulam and Kerala Tourism.",
      },
    ],
    sponsors: [
      { label: "DTPC Ernakulam", role: "In Association With" },
      { label: "Kerala Tourism", role: "In Association With" },
      { label: "TDK Sports", role: "Organisor" },
      { label: "Santos.Travel", role: "An Initiative By" },
    ],
  },

  "Kochi Duskathon 2018": {
    youtubeId: "SstpAwBCOMY",
    about:
      "The inaugural Kochi Duskathon — a sunset beach run created by Ernakulam DTPC and TDK Sports to promote beach tourism in Kerala. 1,200 barefoot runners took part along the coast at sunset, launching what would become an annual signature event.",
    highlights: [
      "The inaugural Kochi Duskathon",
      "1,200 barefoot runners on the sunset coast",
      "Launched to promote beach tourism in Kerala",
      "Held on January 13, 2018 under Ernakulam DTPC",
    ],
    categories: ["Sunset beach run"],
    press: [
      {
        label: "Kochi Duskathon: Registrations Begin",
        source: "New Indian Express",
        date: "Dec 31, 2017",
        url: "http://www.newindianexpress.com/cities/kochi/2017/dec/31/kochi-duskathon-registrations-begin-1741302.html",
        excerpt:
          "Ernakulam DTPC opens registrations for a unique sunset beach run to promote activity and adventure tourism in Kerala.",
      },
      {
        label: "Sunset Marathon to promote beach tourism in Kochi",
        source: "Times of India",
        date: "Nov 06, 2017",
        url: "https://timesofindia.indiatimes.com/city/kochi/sunset-marathon-to-promote-beach-tourism-in-kochi/articleshow/61525578.cms",
        excerpt:
          "'Kochi Duskathon', a sunset beach run, is approved in principle by the DTPC council to promote beach tourism across the district's coastline.",
      },
      {
        label: "Madhyamam (print)",
        source: "Madhyamam",
        date: "Dec 29, 2017",
        url: "https://tdksports.in/img/Madhyamam_Press_Release.jpg",
      },
    ],
    sponsors: [
      { label: "DTPC Ernakulam", role: "In Association With" },
      { label: "Kerala Tourism", role: "In Association With" },
      { label: "TDK Sports", role: "Organisor" },
    ],
  },

  "Tour de Kerala 2014": {
    youtubeId: "P0RMl5264No",
    about:
      "A 90 km cyclothon on the Perinad–Pampa–Perinad stretch of the main trunk road leading to Sabarimala. Flagged off by District Collector S. Harikishore and SP A. Srinivas, and organised by the Australia-based AICA Group in association with Fuji Bikes and Santos King.",
    highlights: [
      "90 km cyclothon on the Sabarimala trunk road",
      "Winner: Ramesh Nagarajan (Chennai) — 2h 58min, Fuji Road Bike",
      "2nd: Gokul V.R. (Chennai) — Fuji Hybrid Bike",
      "3rd: Anees (Cherthala) — Fuji MTB Bike",
      "Powered by Fuji Bikes and the AICA Group",
    ],
    categories: ["90 km cyclothon"],
    press: [
      {
        label: "Cycle marathon held on Sabarimala road",
        source: "The Hindu",
        date: "Sep 29, 2014",
        url: "https://www.thehindu.com/news/national/kerala/cycle-marathon-held-on-sabarimala-road/article6456888.ece",
        excerpt:
          "PATHANAMTHITTA: The 90-km cycle marathon was held on the Perinad-Pampa-Perinad stretch. Ramesh Nagarajan of Chennai won the first prize by finishing in 2h 58min.",
      },
    ],
    sponsors: [
      { label: "AICA Group (Australia)", role: "Organiser" },
      { label: "Fuji Bikes", role: "Powered By" },
      { label: "Santos King", role: "Travel Partner" },
    ],
  },
};
