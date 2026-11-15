// Photos used on the site, with the attribution their licenses require.
// Adding a photo? Save it under public/images/ and list it here.
export interface PhotoCredit {
  file: string;
  label: string;
  author: string;
  license: string;
  licenseUrl: string;
  source: string;
}

export const PHOTO_CREDITS: PhotoCredit[] = [
  { file: "/images/shelach.jpg", label: "מדבר יהודה, ראש טור", author: "RG TLV", license: "CC BY 2.0", licenseUrl: "https://creativecommons.org/licenses/by/2.0", source: "https://commons.wikimedia.org/wiki/File:Judean_Desert_-_Rosh_Tur_-_Flickr_-_RG_TLV.jpg" },
  { file: "/images/earth.jpg", label: "כדור הארץ מאפולו 17 (\"הגולה הכחולה\")", author: "NASA / Apollo 17", license: "Public domain", licenseUrl: "", source: "https://commons.wikimedia.org/wiki/File:The_Blue_Marble,_AS17-148-22727.jpg" },
  { file: "/images/enrichment.jpg", label: "ערפילית השדרית, טלסקופ החלל ג׳יימס ווב", author: "NASA, ESA, CSA, STScI", license: "Public domain", licenseUrl: "", source: "https://commons.wikimedia.org/wiki/File:NASA%E2%80%99s_Webb_Reveals_Cosmic_Cliffs,_Glittering_Landscape_of_Star_Birth.jpg" },
  { file: "/images/english.jpg", label: "הספרייה הישנה, טריניטי קולג׳, דבלין", author: "Diliff", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", source: "https://commons.wikimedia.org/wiki/File:Long_Room_Interior,_Trinity_College_Dublin,_Ireland_-_Diliff.jpg" },
  { file: "/images/simone-biles.jpg", label: "סימון ביילס, אולימפיאדת ריו 2016", author: "Fernando Frazão/Agência Brasil", license: "CC BY 3.0 br", licenseUrl: "https://creativecommons.org/licenses/by/3.0/br/deed.en", source: "https://commons.wikimedia.org/wiki/File:Simone_Biles_Rio_2016b.jpg" },
  { file: "/images/adjectives.jpg", label: "עפרונות צבעוניים", author: "Dietmar Rabich", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", source: "https://commons.wikimedia.org/wiki/File:Buntstifte_--_2021_--_9164.jpg" },
  { file: "/images/crossword-clash.jpg", label: "תשבץ", author: "Spaghettifier", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", source: "https://commons.wikimedia.org/wiki/File:Crossword_puzzle.jpg" },
  { file: "/images/sentence-auction.jpg", label: "פטיש עץ", author: "Santeri Viinamäki", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", source: "https://commons.wikimedia.org/wiki/File:Wooden_gavel_20170417.jpg" },
  { file: "/images/past-simple.jpg", label: "שעון כיס", author: "Dietmar Rabich", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", source: "https://commons.wikimedia.org/wiki/File:D%C3%BClmen,_Kirchspiel,_ehem._Sondermunitionslager_Visbeck,_%22What_if%22_--_2023_--_6727.jpg" },
  { file: "/images/chat-masters.jpg", label: "אותיות דפוס מעץ", author: "Michellecornelison", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", source: "https://commons.wikimedia.org/wiki/File:Wood_letterpres_type_at_Washington_University_in_St._Louis.jpg" },
];
