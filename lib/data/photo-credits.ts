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
  { file: "/images/shelach-nofadam.jpg", label: "שדות ובריכות דגים בעמק, מבט מהגלבוע", author: "Tal Oz טל עוז", license: "CC BY 2.5", licenseUrl: "https://creativecommons.org/licenses/by/2.5", source: "https://commons.wikimedia.org/wiki/File:PikiWiki_Israel_14301_Gilboa_Mountain.JPG" },
  { file: "/images/shelach-mifhaz.jpg", label: "קו החוף של תל אביב מהאוויר", author: "כפיר פתחי", license: "CC BY 2.5", licenseUrl: "https://creativecommons.org/licenses/by/2.5", source: "https://commons.wikimedia.org/wiki/File:PikiWiki_Israel_14675_Clouds_hovering_over_the_coastline.jpg" },
  { file: "/images/shelach-har.jpg", label: "ירושלים, מבט על העיר העתיקה", author: "Papierdrache", license: "CC BY-SA 3.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0", source: "https://commons.wikimedia.org/wiki/File:East_Jerusalem,_Old_City,_East.jpg" },
  { file: "/images/shelach-teva.jpg", label: "עגורים בעמק החולה", author: "CarmelH1", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", source: "https://commons.wikimedia.org/wiki/File:%D7%A2%D7%92%D7%95%D7%A8%D7%99%D7%9D_%D7%91%D7%A2%D7%9E%D7%A7_%D7%94%D7%97%D7%95%D7%9C%D7%94_Cranes_in_Hula_Valley.jpg" },
  { file: "/images/shelach-tarbuyot.jpg", label: "גגות העיר העתיקה בירושלים", author: "Askii", license: "CC BY-SA 3.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0", source: "https://commons.wikimedia.org/wiki/File:Rooftops_of_the_Old_City_of_Jerusalem_2.jpg" },
  { file: "/images/shelach-gicha.jpg", label: "הרי אילת", author: "Gerda Arendt", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", source: "https://commons.wikimedia.org/wiki/File:Eilat_Mountains,_Israel,_February_2018.jpg" },
  { file: "/images/enrichment-israeli-politics.jpg", label: "משכן הכנסת", author: "Clema12", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", source: "https://commons.wikimedia.org/wiki/File:Knesset_front_side_-_2022.jpg" },
  { file: "/images/enrichment-israel-game.jpg", label: "ישראל, סיני והנילוס מתחנת החלל", author: "NASA / ISS Expedition 35", license: "Public domain", licenseUrl: "", source: "https://commons.wikimedia.org/wiki/File:ISS035-E-007148_Nile_-_Sinai_-_Dead_Sea_-_Wide_Angle_View.jpg" },
  { file: "/images/enrichment-evolution.jpg", label: "מאובן ארכאופטריקס, ברלין", author: "Emily Willoughby", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", source: "https://commons.wikimedia.org/wiki/File:Berlin_Archaeopteryx_-_detail_of_arm.jpg" },
  { file: "/images/enrichment-human-history.jpg", label: "ציורי מערת לאסקו (העתק)", author: "HTO", license: "Public domain", licenseUrl: "", source: "https://commons.wikimedia.org/wiki/File:Lascaux,_replica_03.JPG" },
  { file: "/images/enrichment-google-earth.jpg", label: "העתק סן אנדראס מהאוויר", author: "Ikluft", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", source: "https://commons.wikimedia.org/wiki/File:Kluft-photo-Carrizo-Plain-Nov-2007-Img_0327.jpg" },
  { file: "/images/enrichment-snakes.jpg", label: "צפע ארצישראלי", author: "ארבל לוי (ArbeLevy)", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", source: "https://commons.wikimedia.org/wiki/File:ArbeLevy-Vipera_palaestinae_3.jpg" },
];
