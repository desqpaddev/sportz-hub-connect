export type PastEventExtras = {
  youtubeId?: string;
  press?: { label: string; url: string }[];
  highlights?: string[];
  gallery?: string[];
};

export const PAST_EVENTS_EXTRAS: Record<string, PastEventExtras> = {
  "Federal Bank Kochi Swimathon Ultra 2025": {
    youtubeId: "WBL8GARfsVA",
    highlights: [
      "727 swimmers — the largest edition to date",
      "10M Ultra category on River Periyar",
      "Title sponsored by Federal Bank",
    ],
  },
  "Florid Kochi Swimathon Ultra 2024": {
    youtubeId: "NSbJ3ildWgI",
    highlights: [
      "610 swimmers across the 10M Ultra",
      "India's Largest River Swimathon",
      "Presented by Florid",
    ],
  },
  "Florid Kochi Swimathon 2023": {
    youtubeId: "GjXYrYR-k4M",
    press: [
      { label: "Mathrubhumi News", url: "https://www.youtube.com/watch?v=-fuKy-qiTfI" },
      { label: "Manorama News", url: "https://www.youtube.com/watch?v=WV6a-F2cLE8" },
    ],
    highlights: [
      "South India's first 10 km river swimathon",
      "Held on the Periyar River, Aluva",
      "Featured on Mathrubhumi & Manorama News",
    ],
  },
  "Kochi Swimathon 2022": {
    youtubeId: "Z9noe2ql_7g",
    highlights: [
      "The inaugural edition of the Kochi Swimathon",
      "Set the stage for India's largest river swim",
    ],
  },
  "Paddlers Meetup 2021": {
    youtubeId: "FnBdAaNv0O4",
    press: [
      { label: "Manorama Online", url: "https://www.manoramaonline.com/district-news/ernakulam/2021/09/27/ernakulam-adventure-eco-tourism-project-in-aluva.html" },
    ],
    highlights: [
      "World Tourism Day celebration",
      "Kayakers united for a River Periyar cleanup",
      "Boost for adventure & eco-tourism in Aluva",
    ],
  },
  "Kochi Duskathon 2019": {
    youtubeId: "y4um_W7ef-I",
    press: [
      { label: "Times of India", url: "https://timesofindia.indiatimes.com/entertainment/events/kochi/kochi-duskathon-held-in-kuzhupilly-beach/articleshow/68918001.cms" },
      { label: "The Hindu", url: "https://www.thehindu.com/news/cities/Kochi/kochi-duskathon-beach-run-today/article26831091.ece" },
      { label: "New Indian Express", url: "http://www.newindianexpress.com/cities/kochi/2019/apr/11/kochi-duskathon-aims-for-a-guinness-record-1962821.html" },
    ],
    highlights: [
      "10 km beach run from Kuzhuppilly to Cherai",
      "Aimed for a Guinness World Record",
      "In association with DTPC & Kerala Tourism",
    ],
  },
  "Kochi Duskathon 2018": {
    youtubeId: "SstpAwBCOMY",
    press: [
      { label: "Indian Express", url: "http://www.newindianexpress.com/cities/kochi/2017/dec/31/kochi-duskathon-registrations-begin-1741302.html" },
      { label: "Times of India", url: "https://timesofindia.indiatimes.com/city/kochi/sunset-marathon-to-promote-beach-tourism-in-kochi/articleshow/61525578.cms" },
    ],
    highlights: [
      "The inaugural Kochi Duskathon",
      "1,200 barefoot runners on the sunset coast",
      "Launched to promote beach tourism in Kerala",
    ],
  },
  "Tour de Kerala 2014": {
    youtubeId: "P0RMl5264No",
    press: [
      { label: "The Hindu", url: "https://www.thehindu.com/news/national/kerala/cycle-marathon-held-on-sabarimala-road/article6456888.ece" },
    ],
    highlights: [
      "90 km cyclothon on the Sabarimala trunk road",
      "Winner: Ramesh Nagarajan, 2h 58min",
      "Powered by Fuji Bikes & AICA Group",
    ],
  },
};
