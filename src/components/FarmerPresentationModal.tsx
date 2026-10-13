import React, { useState, useEffect, useRef } from 'react';
import { Language } from '../types/market';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Download,
  Share2,
  Layers,
  X,
  Clock,
  DollarSign,
  Award,
  Smartphone,
  Store,
  Users,
  Music,
  Film,
  FileText
} from 'lucide-react';
import { realisticAudio } from '../utils/audioEngine';
import { generateAndDownloadVideoWebM, downloadOfflinePresentationHTML, SlideExportData } from '../utils/videoExporter';

export interface FarmerPresentationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
}

export interface SlideContent {
  id: number;
  timeRange: string;
  durationSec: number;
  badge: { en: string; hi: string; mr: string };
  title: { en: string; hi: string; mr: string };
  subtitle: { en: string; hi: string; mr: string };
  narration: { en: string; hi: string; mr: string };
  highlights: {
    icon: string;
    label: { en: string; hi: string; mr: string };
    desc: { en: string; hi: string; mr: string };
    stat?: string;
  }[];
  caseStudy?: {
    farmer: string;
    crop: string;
    oldWay: string;
    newWay: string;
    benefit: string;
  };
  visualType: 'hero' | 'prediction' | 'transport' | 'gatepass' | 'calculator' | 'summary';
}

export const SLIDES: SlideContent[] = [
  {
    id: 1,
    timeRange: '0:00 - 0:20',
    durationSec: 20,
    badge: {
      en: 'PART 1: THE PROBLEM & OPPORTUNITY',
      hi: 'भाग १: पारंपरिक नुकसान व नया अवसर',
      mr: 'भाग १: जुना तोटा आणि नवा मार्ग'
    },
    title: {
      en: 'Why Farmers Lose Money in Traditional Mandi Selling',
      hi: 'पारंपरिक मंडी में किसान भाइयों का नुकसान क्यों होता है?',
      mr: 'पारंपरिक बाजार समितीत शेतकऱ्यांचे नुकसान का होते?'
    },
    subtitle: {
      en: 'Middlemen cuts, price crashes upon arrival, and expensive single-truck freight cut farmer profits by 30-40%.',
      hi: 'दलालों का कमीशन, अचानक भाव गिरना और मनमाना गाड़ी भाड़ा आपकी मेहनत का ३० से ४० प्रतिशत मुनाफा छीन लेता है।',
      mr: 'दलालांचे भरमसाठ कमिशन, अचानक गडगडणारे भाव आणि अव्वाच्या सव्वा वाहतूक खर्च शेतकऱ्याचा नफा बुडवतो.'
    },
    narration: {
      en: 'Namaskar Kisan Bhaiyo! Every day, millions of farmers load their vegetables without knowing the exact rate at the mandi. When you arrive, distress selling and high middlemen cuts eat away up to 40% of your earnings. Krishi Bandhu is designed to protect your hard-earned income.',
      hi: 'नमस्कार किसान भाइयों! रोज़ाना हमारे अन्नदाता बिना यह जाने गाड़ी भरते हैं कि आज मंडी में क्या भाव मिलेगा। वहां पहुंचते ही आढ़तियों का कमीशन और महंगा ट्रांसपोर्ट भाड़ा आपकी मेहनत की कमाई छीन लेता है। कृषि बंधु इसी नुकसान को हमेशा के लिए खत्म करता है।',
      mr: 'नमस्कार शेतकरी बांधवांनो! दररोज आपले शेतकरी आज बाजारात नेमका काय भाव मिळणार हे न जाणताच माल गाडीत भरतात. मंडईत पोहोचल्यावर दलालांचे कमिशन आणि ट्रान्सपोर्टचा खर्च आपला ३० ते ४०% नफा बुडवतो. कृषी बंधूने हाच तोटा कायमचा थांबवला आहे.'
    },
    highlights: [
      {
        icon: 'TrendingUp',
        label: { en: 'Blind Selling Risk', hi: 'अंधेरे में बिक्री', mr: 'अंदाजे विक्रीचा धोका' },
        desc: { en: 'No advance knowledge of tomorrow\'s rates', hi: 'कल के भाव का कोई पूर्व अनुमान नहीं', mr: 'उद्याच्या बाजारभावाची पूर्वकल्पना नाही' },
        stat: '-35% Loss'
      },
      {
        icon: 'Truck',
        label: { en: 'Solo Vehicle Freight', hi: 'महंगा ट्रांसपोर्ट भाड़ा', mr: 'महाग वाहतूक खर्च' },
        desc: { en: 'Paying single full truck rate with empty return charges', hi: 'अकेले पूरे वाहन का भारी भाड़ा देना पड़ता है', mr: 'एकट्यालाच पूर्ण गाडीचे अव्वाच्या सव्वा भाडे' },
        stat: '₹4-6/kg'
      },
      {
        icon: 'ShieldCheck',
        label: { en: 'Krishi Bandhu Shield', hi: 'कृषि बंधु सुरक्षा कवच', mr: 'कृषी बंधू कवच' },
        desc: { en: 'AI rate forecasts, shared pooling & direct APMC gate pass', hi: 'AI भाव भविष्यवाणी, साझा ट्रांसपोर्ट और सीधा गेट पास', mr: 'AI भाव अंदाज, शेतकरी ग्रुप वाहतूक आणि थेट गेट पास' },
        stat: '+38% Net Gain'
      }
    ],
    visualType: 'hero'
  },
  {
    id: 2,
    timeRange: '0:20 - 0:40',
    durationSec: 20,
    badge: {
      en: 'PART 2: 7-DAY AI RATE PREDICTOR',
      hi: 'भाग २: ७-दिवसीय AI मंडी भाव भविष्यवाणी',
      mr: 'भाग २: ७ दिवसांचे AI बाजारभाव भाकीत'
    },
    title: {
      en: 'Know Exactly When to Harvest & Sell with 7-Day Forecasts',
      hi: 'कब तोड़ाई करें और कब बेचें? ७ दिन पहले सटीक भाव जानें',
      mr: 'भाजीपाला कधी तोडावा आणि कधी विकावा? ७ दिवस आधीच अचूक अंदाज'
    },
    subtitle: {
      en: 'Our 4-factor AI engine evaluates 30-day trends, seasonal cycles, market arrivals, and weather to predict daily rates.',
      hi: '३० दिनों का डेटा, पिछले वर्ष का इतिहास, दैनिक आवक और मौसम विश्लेषण से ७ दिनों का सटीक मंडी भाव पहले ही जानें।',
      mr: 'गेल्या ३० दिवसांचा ट्रेंड, गेल्या वर्षीचा इतिहास, आजची आवक आणि हवामान यांच्या अभ्यासातून ७ दिवसांचा अचूक अंदाज.'
    },
    narration: {
      en: 'Step 1: Check the 7-Day Price Predictor. If Nashik Mandi tomato is ₹32 today, but AI predicts ₹39 in 3 days due to lower festival arrivals, hold your harvest for 72 hours. That simple 3-day wait gives you an extra ₹7,000 on every ton of produce!',
      hi: 'पहला फायदा: ७-दिवसीय भाव भविष्यवाणी। यदि आज नासिक मंडी में टमाटर ३२ रुपये है, पर AI दिखाता है कि ३ दिन बाद कम आवक के कारण भाव ३९ रुपये होगा, तो ३ दिन रुक कर बेचें। प्रति टन सीधे ७,००० रुपये अधिक कमाएं!',
      mr: 'पहिली सुविधा: ७-दिवसीय भाव अंदाज. समजा नाशिक बाजारात आज टोमॅटो ३२ रु. आहे, पण AI सांगते की ३ दिवसांनी सणांमुळे भाव ३९ रु. होईल, तर ३ दिवस थांबून तोडणी करा. प्रति टन थेट ७,००० रुपयांचा निव्वळ जादा नफा!'
    },
    highlights: [
      {
        icon: 'TrendingUp',
        label: { en: '30-Day Momentum', hi: '३० दिन का मोमेंटम', mr: '३० दिवसांची गती' },
        desc: { en: 'Real-time velocity of price shifts', hi: 'हाल के दिनों में कीमतों की वास्तविक रफ्तार', mr: 'बाजारभावातील वेगाचा अचूक मागोवा' },
        stat: '94% Acc.'
      },
      {
        icon: 'Sparkles',
        label: { en: 'Year-over-Year Seasons', hi: 'मौसमी व त्योहार चक्र', mr: 'गेल्या वर्षीचा हंगाम' },
        desc: { en: 'Historical 12-month pattern analysis', hi: 'पिछले साल के त्यौहार व शादी-समारोह का डेटा', mr: 'मागील वर्षाच्या सण-उत्सवांचा डेटा' },
        stat: 'Seasonal'
      },
      {
        icon: 'DollarSign',
        label: { en: 'Optimal Harvest Day', hi: 'सर्वोत्तम तोड़ाई का दिन', mr: 'तोडणीचा सर्वोत्तम दिवस' },
        desc: { en: 'Identifies the peak realization day of the week', hi: 'सप्ताह में सबसे ऊंचे भाव वाला दिन चुनें', mr: 'आठवड्यातील सर्वोच्च भावाचा दिवस' },
        stat: '+₹7/kg'
      }
    ],
    caseStudy: {
      farmer: 'Shri Rameshwar Patil (Nashik)',
      crop: 'Tomato - 50 Quintals (5 Tons)',
      oldWay: 'Sold immediately on Tuesday at ₹32/kg = ₹1,60,000 gross',
      newWay: 'Followed AI forecast, harvested on Friday at ₹39/kg = ₹1,95,000 gross',
      benefit: 'Net extra earnings: +₹35,000 simply by timing the harvest!'
    },
    visualType: 'prediction'
  },
  {
    id: 3,
    timeRange: '0:40 - 1:00',
    durationSec: 20,
    badge: {
      en: 'PART 3: SMART LOGISTICS & RETURN LOADS',
      hi: 'भाग ३: साझा ट्रांसपोर्ट व रिटर्न लोड बचत',
      mr: 'भाग ३: शेतकरी ग्रुप वाहतूक व मोठी बचत'
    },
    title: {
      en: 'Cut Vehicle Freight by 45% with Shared Community Pooling',
      hi: 'सस्ता ट्रांसपोर्ट: शेयरिंग ट्रक व रिटर्न लोड से भाड़ा आधा करें',
      mr: 'स्वस्त वाहतूक: शेअरींग गाड्या व रिटर्न लोडने भाडे निम्म्यावर'
    },
    subtitle: {
      en: 'Never pay for an empty return truck again. Pool space with nearby farmers or book verified return-load vehicles.',
      hi: 'अकेले पूरी गाड़ी का भाड़ा देने की ज़रूरत नहीं। पड़ोस के किसानों के साथ वाहन साझा करें या खाली लौटती गाड़ियों से ४५% बचाएं।',
      mr: 'आता एकट्याला पूर्ण गाडीचे भाडे देण्याची गरज नाही. शेजारील शेतकऱ्यांसोबत जागा शेअर करा किंवा परतीच्या गाड्यांतून ४५% बचत करा.'
    },
    narration: {
      en: 'Step 2: Smart Transportation. Hiring an individual pickup costs ₹3,500. With Krishi Bandhu Community Pool, 3 farmers heading from Junnar to Vashi share one vehicle for just ₹1,100 each. You instantly save ₹2,400 in hard cash on travel alone!',
      hi: 'दूसरा बड़ा फायदा: स्मार्ट ट्रांसपोर्ट! अकेले छोटी गाड़ी करने पर ₹३,५०० भाड़ा लगता है। कृषि बंधु के कम्युनिटी पूल से तीन किसान मिलकर एक ही ट्रक में माल भेजते हैं, जिससे प्रति किसान केवल ₹१,१०० खर्च आता है। सीधे ₹२,४०० की नकद बचत!',
      mr: 'दुसरा मोठा फायदा: स्मार्ट वाहतूक! स्वतः स्वतंत्र पिकअप केल्यास ₹३,५०० खर्च येतो. कृषी बंधू कम्युनिटी पूलमुळे जुन्नरहून वाशीला जाणारे ३ शेतकरी एकच गाडी शेअर करतात, प्रत्येकी फक्त ₹१,१०० खर्च! प्रवासातच थेट ₹२,४०० ची रोख बचत!'
    },
    highlights: [
      {
        icon: 'Truck',
        label: { en: 'Community Pooling', hi: 'किसान शेयरिंग पूल', mr: 'शेतकरी ग्रुप शेअरींग' },
        desc: { en: 'Split truck hire across 2-4 neighbouring farmers', hi: 'आस-पास के किसानों के साथ मिलकर वाहन साझा करें', mr: 'शेजारील २-४ शेतकऱ्यांसोबत एकत्र ट्रक बुक करा' },
        stat: 'Save 45%'
      },
      {
        icon: 'RotateCcw',
        label: { en: 'Return Load Deals', hi: 'खाली लौटते वाहन (Return)', mr: 'परतीचे रिटर्न लोड' },
        desc: { en: 'Take advantage of empty return trucks looking for loads', hi: 'मंडी से खाली लौटते ट्रकों पर भारी रियायती दरें', mr: 'रिकाम्या परतणाऱ्या गाड्यांवर ३५-४५% सवलत' },
        stat: 'Save ₹1,850'
      },
      {
        icon: 'CheckCircle2',
        label: { en: 'Driver Tracking', hi: 'सत्यापित ड्राइवर व ट्रैकिंग', mr: 'प्रमाणित चालक व ट्रॅकिंग' },
        desc: { en: 'Verified license, departure slots, and direct calling', hi: 'वेरिफाइड ड्राइवर, तय समय और सुरक्षित डिलीवरी', mr: 'पडताळणी झालेले चालक आणि थेट फोन सुविधा' },
        stat: '100% Safe'
      }
    ],
    caseStudy: {
      farmer: 'Dattatray Shinde (Junnar)',
      crop: 'Green Chillies - 1.2 Tons',
      oldWay: 'Solo Bolero Maxi Truck hire: ₹3,800 freight',
      newWay: 'Krishi Bandhu shared pool with 2 onion farmers: ₹1,400 freight',
      benefit: 'Direct freight savings in pocket: ₹2,400 per trip!'
    },
    visualType: 'transport'
  },
  {
    id: 4,
    timeRange: '1:00 - 1:20',
    durationSec: 20,
    badge: {
      en: 'PART 4: 100% PRIVACY SHIELD',
      hi: 'भाग ४: किसान गोपनीयता कवच (नो स्पैम कॉल्स)',
      mr: 'भाग ४: १००% शेतकरी गोपनीयता कवच'
    },
    title: {
      en: 'Zero Phone Spam: Your Personal Mobile Number Stays Protected',
      hi: 'मोबाइल नंबर सुरक्षित: बिना आपकी मंज़ूरी कोई कॉल नहीं कर सकता',
      mr: 'फोन नंबर सुरक्षित: तुमच्या मंजुरीशिवाय कोणताही त्रासदायक फोन नाही'
    },
    subtitle: {
      en: 'Open classifieds lead to dozens of fake buyers calling day and night. Krishi Bandhu hides your phone until you approve an enquiry.',
      hi: 'खुले इंटरनेट पर नंबर डालने से फ़र्ज़ी लोगों के लगातार फोन आते हैं। कृषि बंधु में जब आप व्यापारी की पूछताछ स्वीकार करेंगे, तभी नंबर साझा होगा।',
      mr: 'इंटरनेटवर उघडा नंबर टाकल्यास दिवसरात्र खोट्या चौकशा येतात. कृषी बंधूमध्ये तुम्ही चौकशी मंजूर केली तरच संपर्क क्रमांक दिसतो.'
    },
    narration: {
      en: 'Step 3: Peace of mind. You never have to publish your phone number on open classified boards. Genuine buyers submit an enquiry with their expected purchase quantity. If you like the price and terms, you click approve. You maintain total control.',
      hi: 'तीसरा फायदा: पूरी मानसिक शांति। आपका फोन नंबर किसी सार्वजनिक बोर्ड पर नहीं दिखाया जाता। केवल गंभीर खरीदार ही पूछताछ भेजते हैं। भाव और शर्तें पसंद आने पर ही आप हां करते हैं, जिससे नंबर केवल उसी व्यापारी को मिलता है।',
      mr: 'तिसरा फायदा: मनःशांती आणि पूर्ण सुरक्षा. तुमचा मोबाईल नंबर कोणत्याही उघड्या पोर्टलवर दिसत नाही. अस्सल व्यापारी आधी त्यांची मागणी नोंदवतात. भाव आणि अटी पटल्या तरच तुम्ही मंजुरी देता. पूर्ण नियंत्रण तुमच्या हातात!'
    },
    highlights: [
      {
        icon: 'ShieldCheck',
        label: { en: 'Masked Numbers', hi: 'सुरक्षित मास्क नंबर', mr: 'मास्क्ड फोन नंबर' },
        desc: { en: 'Public sees only verified district and lot details', hi: 'जनता को केवल जिला व गुणवत्ता स्कोर दिखता है', mr: 'केवळ जिल्हा व शेतमालाची गुणवत्ता दिसते' },
        stat: '100% Safe'
      },
      {
        icon: 'Smartphone',
        label: { en: 'Enquiry Approval Flow', hi: 'मंज़ूरी आधारित संपर्क', mr: 'मंजुरी आधारित संपर्क' },
        desc: { en: 'Review buyer demand before sharing your phone', hi: 'व्यापारी की साख व ज़रूरत देखकर ही हां कहें', mr: 'व्यापाऱ्याची विश्वासार्हता पाहूनच होकार द्या' },
        stat: 'Zero Spam'
      },
      {
        icon: 'Award',
        label: { en: 'Verified Merchants Only', hi: 'सत्यापित व्यापारी', mr: 'प्रमाणित व्यापारी' },
        desc: { en: 'All vendors undergo APMC license validation', hi: 'केवल लाइसेंस प्राप्त और जाँचे-परखे खरीदार', mr: 'केवळ परवानाधारक व तपासलेले खरेदीदार' },
        stat: 'APMC Tied'
      }
    ],
    visualType: 'gatepass'
  },
  {
    id: 5,
    timeRange: '1:20 - 1:40',
    durationSec: 20,
    badge: {
      en: 'PART 5: DIGITAL APMC GATE PASS',
      hi: 'भाग ५: डिजिटल APMC गेट पास व टोल बचत',
      mr: 'भाग ५: डिजिटल APMC गेट पास व रांगेतून सुटका'
    },
    title: {
      en: 'Skip Mandi Toll Queues: Instant Digital Gate Pass with QR Code',
      hi: 'मंडी में घंटों की लाइन खत्म: मोबाइल पर QR कोड डिजिटल गेट पास',
      mr: 'मंडीतील ३-४ तासांच्या रांगा संपल्या: मोबाईलवर QR गेट पास'
    },
    subtitle: {
      en: 'Generate official entry permits, pre-calculated 1.05% APMC cess slips, and weighbridge passes in seconds.',
      hi: 'सौदा पक्का होते ही तुरंत डिजिटल गेट पास, १.०५% मंडी सेस पर्ची और वे-ब्रिज पास तैयार, जिसे गेट पर दिखाते ही गाड़ी अंदर।',
      mr: 'सौदा ठरताच मोबाईलवर थेट डिजिटल गेट पास, १.०५% सेस पावती व वजनकाटा पास तयार, ज्यामुळे मंडी गेटवर शून्य खोळंबा.'
    },
    narration: {
      en: 'Step 4: Say goodbye to 3-hour midnight queues at the APMC entry gate. When your deal is closed, Krishi Bandhu generates a tamper-proof digital gate pass with official QR verification. Mandi guards scan it in 5 seconds and your vehicle drives right in!',
      hi: 'चौथा फायदा: आधी रात को मंडी के गेट पर ३ घंटे लाइन में लगने की झंझट खत्म। सौदा होते ही फोन पर आधिकारिक क्यूआर कोड गेट पास बन जाता है। गेट पर सुरक्षा गार्ड ५ सेकंड में स्कैन करते हैं और गाड़ी सीधे वे-ब्रिज पर जाती है!',
      mr: 'चौथा फायदा: रात्री मंडीच्या प्रवेशद्वारावर ३ तास ट्रॅफिकमध्ये अडकणे बंद. सौदा होताच फोनवर अधिकृत QR कोड गेट पास मिळतो. गेटवर गार्ड ५ सेकंदात स्कॅन करतो आणि तुमची गाडी थेट वजन काट्यावर जाते!'
    },
    highlights: [
      {
        icon: 'Store',
        label: { en: 'Express Lane Entry', hi: 'फास्ट-ट्रैक गेट एंट्री', mr: 'फास्ट-ट्रॅक प्रवेश' },
        desc: { en: 'Direct weighbridge access without paper tokens', hi: 'बिना कागज़ी टोकन के तुरंत तौल केंद्र पर प्रवेश', mr: 'कागदी पावत्यांशिवाय थेट वजनकाट्यावर प्रवेश' },
        stat: '5 Sec Scan'
      },
      {
        icon: 'DollarSign',
        label: { en: '1.05% Mandi Cess', hi: 'पारदर्शी १.०५% सेस', mr: 'पारदर्शक १.०५% सेस' },
        desc: { en: 'No illegal deductions or unrecorded charges', hi: 'अवैध कटौतियों और रिश्वतखोरी पर पूरी रोक', mr: 'अवैध कपाती व जादा हमालीवर पूर्ण चाप' },
        stat: 'Exact 1.05%'
      },
      {
        icon: 'Users',
        label: { en: 'Direct Bank Settlement', hi: 'सीधा बैंक भुगतान', mr: 'थेट बँक खात्यात पैसे' },
        desc: { en: 'Clear proof of sale and vehicle delivery receipt', hi: 'माल सुपुर्दगी की पक्की डिजिटल रसीद', mr: 'माल पोहोचल्याचा पक्का डिजिटल पुरावा' },
        stat: 'Instant Proof'
      }
    ],
    visualType: 'gatepass'
  },
  {
    id: 6,
    timeRange: '1:40 - 2:00',
    durationSec: 20,
    badge: {
      en: 'PART 6: TOTAL FINANCIAL IMPACT',
      hi: 'भाग ६: किसान का शुद्ध अतिरिक्त मुनाफा (+₹३४,८००)',
      mr: 'भाग ६: शेतकऱ्याचा थेट निव्वळ जादा नफा (+₹३४,८००)'
    },
    title: {
      en: 'The Bottom Line: +₹34,800 More in Your Pocket Every Harvest',
      hi: 'कुल हिसाब: हर ५ टन माल पर पूरे ₹३४,८०० की सीधी अतिरिक्त कमाई',
      mr: 'एकूण हिशोब: प्रत्येक ५ टन शेतमालावर तब्बल ₹३४,८०० चा निव्वळ जादा नफा'
    },
    subtitle: {
      en: 'Combine better timing (+₹35,000), cheaper shared transport (+₹2,400), zero middlemen leakage, and complete peace of mind.',
      hi: 'सही समय पर बिक्री, आधा ट्रांसपोर्ट खर्च, शून्य दलाली और १००% सुरक्षा मिलकर आपकी कुल आय ३१% बढ़ा देती है।',
      mr: 'अचूक वेळेत विक्री, निम्म्या खर्चात वाहतूक, शून्य दलाली आणि सुरक्षित पैसे यामुळे शेतकऱ्यांचे उत्पन्न ३१ टक्क्यांनी वाढते.'
    },
    narration: {
      en: 'Summary: On an average 5-ton harvest, a farmer earns ₹35,000 extra from 7-day AI rate timing, saves ₹2,400 on shared transport, avoids ₹4,000 in unfair deductions, and saves 6 hours of time. That is an extra ₹34,800 in your family bank account! Start with Krishi Bandhu today.',
      hi: 'कुल निष्कर्ष: ५ टन प्याज या टमाटर पर ७-दिवसीय भविष्यवाणी से ₹३५,००० अधिक दर मिला, साझा ट्रांसपोर्ट से ₹२,४०० भाड़ा बचा और मंडी में बिना कटौती के सीधा भुगतान हुआ। यानी कुल ₹३४,८०० का शुद्ध मुनाफा आपके परिवार के बैंक खाते में! आज ही कृषि बंधु का उपयोग करें। जय जवान, जय किसान!',
      mr: 'थोडक्यात सांगायचे तर: ५ टन मालावर अचूक भावामुळे ₹३५,००० जादा मिळाले, शेअरींग वाहतुकीतून ₹२,४०० वाचले आणि अवैध कपात थांबली. एकूण तब्बल ₹३४,८०० थेट तुमच्या कुटुंबाच्या बँक खात्यात! आजच कृषी बंधू सुरू करा. जय जवान, जय किसान!'
    },
    highlights: [
      {
        icon: 'TrendingUp',
        label: { en: 'Peak Rate Realization', hi: 'सर्वोच्च भाव प्राप्ति', mr: 'सर्वोच्च भाव प्राप्ती' },
        desc: { en: 'Selling at peak day vs distress bottom', hi: 'मजबूरी में सस्ते बेचने के बजाय ऊंचे भाव पर बिक्री', mr: 'भाकीतानुसार योग्य दिवशी विक्री' },
        stat: '+₹35,000'
      },
      {
        icon: 'Truck',
        label: { en: 'Shared Transport Saving', hi: 'ट्रांसपोर्ट में बचत', mr: 'वाहतूक खर्चात बचत' },
        desc: { en: 'Community pooling vs solo hire', hi: 'अकेले गाड़ी करने के बजाय शेयरिंग से बचत', mr: 'ग्रुप शेअरींगने वाचलेले पैसे' },
        stat: '+₹2,400'
      },
      {
        icon: 'Award',
        label: { en: 'Total Extra Family Profit', hi: 'कुल शुद्ध अतिरिक्त लाभ', mr: 'कुटुंबाचा एकूण निव्वळ नफा' },
        desc: { en: 'Direct financial uplift per 5-ton lot', hi: 'प्रति ५ टन लॉट पर किसान को मिलने वाला शुद्ध फायदा', mr: 'प्रति ५ टन मालावर शेतकरी कुटुंबाचा नफा' },
        stat: '+₹34,800 / Lot'
      }
    ],
    caseStudy: {
      farmer: 'Comprehensive 5-Ton Onion / Tomato Lot',
      crop: '5,000 Kilograms (50 Quintals)',
      oldWay: 'Old Net Payout: ₹1,12,000 (after 8% agent cut & ₹17,500 full truck)',
      newWay: 'Krishi Bandhu Net Payout: ₹1,46,800 (AI Peak rate + ₹9,500 pooled transit)',
      benefit: 'Net extra income to farmer\'s family: +₹34,800 (+31% increase)'
    },
    visualType: 'summary'
  }
];

export const FarmerPresentationModal: React.FC<FarmerPresentationModalProps> = ({
  isOpen,
  onClose,
  currentLang
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isAmbientScoreOn, setIsAmbientScoreOn] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [elapsedTotalSec, setElapsedTotalSec] = useState<number>(0);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Video download state
  const [isExportingVideo, setIsExportingVideo] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<number>(0);
  const [exportStatusText, setExportStatusText] = useState<string>('');

  const activeSlide = SLIDES[currentSlideIndex];

  // Helper to trigger realistic voice narration in Hindi / selected language
  const triggerVoiceNarration = (slide: SlideContent, lang: Language, muted: boolean) => {
    if (muted) {
      realisticAudio.stopSpeaking();
      setIsSpeaking(false);
      return;
    }

    const textToSpeak = slide.narration[lang] || slide.narration.hi || slide.narration.en;
    realisticAudio.speakNarration(
      textToSpeak,
      lang === 'hi' ? 'hi' : lang === 'mr' ? 'mr' : 'en',
      playbackSpeed,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false),
      () => setIsSpeaking(false)
    );
  };

  // Timer interval for 2-minute playable video simulation
  useEffect(() => {
    if (!isOpen) {
      realisticAudio.stopSpeaking();
      realisticAudio.stopAmbientAgritechScore();
      return;
    }

    // Start background ambient score if enabled
    if (isAmbientScoreOn && !isMuted) {
      realisticAudio.startAmbientAgritechScore();
    } else {
      realisticAudio.stopAmbientAgritechScore();
    }

    // Trigger speech on slide change if playing
    if (isPlaying) {
      triggerVoiceNarration(activeSlide, currentLang, isMuted);
    } else {
      realisticAudio.stopSpeaking();
    }

    const timer = setInterval(() => {
      if (!isPlaying) return;

      setElapsedTotalSec((prev) => {
        const next = prev + 1;
        // Total duration is 120 seconds (2 minutes)
        if (next >= 120) {
          setIsPlaying(false);
          return 120;
        }

        // 6 slides of 20 seconds each
        const targetSlideIndex = Math.min(Math.floor(next / 20), SLIDES.length - 1);
        if (targetSlideIndex !== currentSlideIndex) {
          setCurrentSlideIndex(targetSlideIndex);
        }
        return next;
      });
    }, 1000 / playbackSpeed);

    return () => {
      clearInterval(timer);
    };
  }, [isOpen, isPlaying, currentSlideIndex, currentLang, isMuted, playbackSpeed, isAmbientScoreOn]);

  const handleSeek = (newTotalSec: number) => {
    const clamped = Math.max(0, Math.min(120, newTotalSec));
    setElapsedTotalSec(clamped);
    const targetSlide = Math.min(Math.floor(clamped / 20), SLIDES.length - 1);
    setCurrentSlideIndex(targetSlide);
    if (isPlaying) {
      triggerVoiceNarration(SLIDES[targetSlide], currentLang, isMuted);
    }
  };

  const handleSelectSlide = (index: number) => {
    setCurrentSlideIndex(index);
    setElapsedTotalSec(index * 20);
    if (isPlaying) {
      triggerVoiceNarration(SLIDES[index], currentLang, isMuted);
    }
  };

  const togglePlay = () => {
    if (!isPlaying && elapsedTotalSec >= 120) {
      // restart from start
      setElapsedTotalSec(0);
      setCurrentSlideIndex(0);
    }
    const nextPlaying = !isPlaying;
    setIsPlaying(nextPlaying);
    if (!nextPlaying) {
      realisticAudio.stopSpeaking();
    } else {
      triggerVoiceNarration(activeSlide, currentLang, isMuted);
    }
  };

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    if (newMuted) {
      realisticAudio.stopSpeaking();
      realisticAudio.stopAmbientAgritechScore();
      setIsSpeaking(false);
    } else {
      if (isAmbientScoreOn) realisticAudio.startAmbientAgritechScore();
      triggerVoiceNarration(activeSlide, currentLang, false);
    }
  };

  const toggleAmbientScore = () => {
    const nextScore = !isAmbientScoreOn;
    setIsAmbientScoreOn(nextScore);
    if (nextScore && !isMuted) {
      realisticAudio.startAmbientAgritechScore();
    } else {
      realisticAudio.stopAmbientAgritechScore();
    }
  };

  const handleRestart = () => {
    setElapsedTotalSec(0);
    setCurrentSlideIndex(0);
    setIsPlaying(true);
    triggerVoiceNarration(SLIDES[0], currentLang, isMuted);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Prepare slides for export
  const getExportData = (): SlideExportData[] => {
    return SLIDES.map((s) => ({
      id: s.id,
      timeRange: s.timeRange,
      badge: s.badge[currentLang] || s.badge.hi || s.badge.en,
      title: s.title[currentLang] || s.title.hi || s.title.en,
      subtitle: s.subtitle[currentLang] || s.subtitle.hi || s.subtitle.en,
      narration: s.narration[currentLang] || s.narration.hi || s.narration.en,
      highlights: s.highlights.map((h) => ({
        label: h.label[currentLang] || h.label.hi || h.label.en,
        desc: h.desc[currentLang] || h.desc.hi || h.desc.en,
        stat: h.stat
      })),
      caseStudy: s.caseStudy
    }));
  };

  // Video download handler
  const handleDownloadVideoWebM = async () => {
    setIsExportingVideo(true);
    setExportProgress(5);
    setExportStatusText(
      currentLang === 'hi'
        ? 'एचडी वीडियो (1280x720) और यथार्थवादी हिंदी आवाज़ तैयार की जा रही है...'
        : 'Rendering HD video (1280x720) with realistic Hindi voice...'
    );

    try {
      const exportData = getExportData();
      await generateAndDownloadVideoWebM(exportData, currentLang, (pct, status) => {
        setExportProgress(pct);
        setExportStatusText(status);
      });
      setTimeout(() => {
        setIsExportingVideo(false);
      }, 1500);
    } catch (err) {
      console.error('Video generation error:', err);
      // Fallback: download the standalone offline player
      setExportStatusText(
        currentLang === 'hi'
          ? 'ऑफलाइन वीडियो प्लेयर डाउनलोड किया जा रहा है...'
          : 'Downloading offline interactive presentation player...'
      );
      downloadOfflinePresentationHTML(getExportData(), currentLang);
      setTimeout(() => {
        setIsExportingVideo(false);
      }, 1500);
    }
  };

  const handleDownloadOfflineHTML = () => {
    downloadOfflinePresentationHTML(getExportData(), currentLang);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-stone-900 border border-stone-800 text-white rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[96vh]">
        
        {/* Top Video Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-stone-800 bg-stone-950/80">
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 relative">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isPlaying ? 'bg-emerald-400 opacity-75' : 'bg-amber-400 opacity-40'}`}></span>
              <span className={`relative inline-flex rounded-full h-3 w-3 ${isPlaying ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
            </span>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2 flex-wrap">
                <span>{currentLang === 'hi' ? 'किसान २-मिनट वीडियो प्रस्तुति (यथार्थवादी हिंदी आवाज़)' : currentLang === 'mr' ? 'शेतकरी २-मिनिटे व्हिडिओ सादरीकरण (आवाजासह)' : 'Farmer Express Presentation: 2-Minute Video Showcase'}</span>
                <span className="text-[11px] font-semibold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  2:00 MIN HD
                </span>
                <span className="text-[11px] font-semibold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1">
                  <span>🎙️</span>
                  <span>{currentLang === 'hi' ? 'हिंदी स्वाभाविक स्वर' : 'Hindi Realistic Voice'}</span>
                </span>
              </h2>
              <p className="text-xs text-stone-400">
                {currentLang === 'hi' ? '७-दिन भविष्यवाणी + सस्ता ट्रांसपोर्ट + किसान गोपनीयता + डिजिटल APMC गेट पास' : currentLang === 'mr' ? '७ दिवसांचा भाव अंदाज + स्वस्त वाहतूक + १००% गोपनीयता + डिजिटल गेट पास' : 'AI Rate Predictor · Smart Transport Pooling · Privacy Shield · Digital APMC Gate Pass'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadVideoWebM}
              className="hidden sm:flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition shadow-sm cursor-pointer"
              title="Download 2-minute video file (.webm)"
            >
              <Film className="w-3.5 h-3.5" />
              <span>{currentLang === 'hi' ? 'वीडियो डाउनलोड (.webm)' : 'Download Video'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition cursor-pointer"
              title="Close presentation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Player Display Screen */}
        <div className="relative flex-1 bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 p-4 sm:p-6 overflow-y-auto">
          
          {/* Slide Stage Card */}
          <div className="bg-stone-800/85 border border-stone-700/60 rounded-xl p-5 sm:p-7 shadow-xl relative overflow-hidden backdrop-blur-sm">
            
            {/* Top Badge & Slide Tracker */}
            <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold tracking-wider uppercase px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {activeSlide.badge[currentLang] || activeSlide.badge.hi || activeSlide.badge.en}
                </span>
                <span className="text-xs text-stone-400 font-mono">
                  Slide {activeSlide.id} of {SLIDES.length} ({activeSlide.timeRange})
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {SLIDES.map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => handleSelectSlide(idx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      idx === currentSlideIndex
                        ? 'w-7 bg-emerald-500'
                        : idx < currentSlideIndex
                        ? 'w-3 bg-stone-500'
                        : 'w-2 bg-stone-700 hover:bg-stone-600'
                    }`}
                    title={`Slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Slide Title & Subtitle */}
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-snug mb-2">
              {activeSlide.title[currentLang] || activeSlide.title.hi || activeSlide.title.en}
            </h1>
            <p className="text-sm sm:text-base text-stone-300 mb-5 leading-relaxed max-w-4xl">
              {activeSlide.subtitle[currentLang] || activeSlide.subtitle.hi || activeSlide.subtitle.en}
            </p>

            {/* 3 Strategic Feature Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mb-5">
              {activeSlide.highlights.map((h, i) => (
                <div
                  key={i}
                  className="bg-stone-900/90 border border-stone-700/50 p-4 rounded-xl flex flex-col justify-between hover:border-emerald-500/50 transition group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-stone-300">
                      {h.label[currentLang] || h.label.hi || h.label.en}
                    </span>
                    {h.stat && (
                      <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800">
                        {h.stat}
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-stone-200 font-medium">
                    {h.desc[currentLang] || h.desc.hi || h.desc.en}
                  </p>
                </div>
              ))}
            </div>

            {/* Real Case Study / Field Calculation Box */}
            {activeSlide.caseStudy && (
              <div className="bg-emerald-950/40 border border-emerald-600/40 rounded-xl p-4 sm:p-5 mb-5">
                <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                      {currentLang === 'hi' ? 'वास्तविक किसान परिणाम (केस स्टडी)' : currentLang === 'mr' ? 'प्रत्यक्ष शेतकरी अनुभव (केस स्टडी)' : 'Verified Field Impact / Real Farmer Case Study'}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-stone-300">
                    {activeSlide.caseStudy.farmer} · {activeSlide.caseStudy.crop}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm mt-3 pt-3 border-t border-emerald-800/40">
                  <div className="bg-stone-900/60 p-2.5 rounded-lg border border-red-900/30">
                    <span className="block text-[11px] text-red-400 font-semibold mb-1">
                      {currentLang === 'hi' ? 'पारंपरिक पुराना तरीका' : currentLang === 'mr' ? 'जुनी पद्धत' : 'Traditional Way'}
                    </span>
                    <span className="text-stone-300">{activeSlide.caseStudy.oldWay}</span>
                  </div>
                  <div className="bg-stone-900/60 p-2.5 rounded-lg border border-emerald-900/40">
                    <span className="block text-[11px] text-emerald-400 font-semibold mb-1">
                      {currentLang === 'hi' ? 'कृषि बंधु के साथ' : currentLang === 'mr' ? 'कृषी बंधू वापरून' : 'With Krishi Bandhu'}
                    </span>
                    <span className="text-stone-200">{activeSlide.caseStudy.newWay}</span>
                  </div>
                  <div className="bg-emerald-900/50 p-2.5 rounded-lg border border-emerald-500/50 flex flex-col justify-center">
                    <span className="block text-[11px] text-emerald-300 font-bold mb-1">
                      {currentLang === 'hi' ? 'शुद्ध अतिरिक्त बचत / मुनाफा' : currentLang === 'mr' ? 'निव्वळ जादा नफा' : 'Direct Extra Benefit'}
                    </span>
                    <span className="font-extrabold text-white text-sm">
                      {activeSlide.caseStudy.benefit}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Video Subtitle & Voice Narration Caption */}
            <div className="bg-stone-950/90 border border-stone-800 p-3.5 sm:p-4 rounded-xl flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                <Volume2 className={`w-4 h-4 ${isSpeaking ? 'animate-pulse text-emerald-400' : 'text-stone-400'}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                      {currentLang === 'hi' ? 'यथार्थवादी हिंदी वॉयस कमेंट्री' : currentLang === 'mr' ? 'मराठी / हिंदी ऑडिओ संवाद' : 'Realistic Voice Narration'}
                    </span>
                    <span className="text-[10px] bg-stone-800 text-stone-300 px-2 py-0.5 rounded-full border border-stone-700">
                      {isSpeaking ? (currentLang === 'hi' ? 'आवाज़ सक्रिय 🎙️' : 'Voice Active 🎙️') : 'Natural Indian Cadence'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => triggerVoiceNarration(activeSlide, currentLang, false)}
                      className="text-[10px] text-amber-300 hover:text-amber-200 underline cursor-pointer"
                    >
                      {currentLang === 'hi' ? 'पुनः सुनें (Replay Voice)' : 'Replay Voice'}
                    </button>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-stone-200 italic leading-relaxed">
                  "{activeSlide.narration[currentLang] || activeSlide.narration.hi || activeSlide.narration.en}"
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* Video Scrubber & Playback Controls Bar */}
        <div className="bg-stone-950 border-t border-stone-800 px-4 sm:px-6 py-3.5">
          
          {/* Progress Timeline Scrubber */}
          <div className="mb-3">
            <div className="flex items-center justify-between text-xs font-mono text-stone-400 mb-1.5">
              <span>{formatTime(elapsedTotalSec)}</span>
              <span className="text-stone-500">
                {currentLang === 'hi' ? 'कुल वीडियो अवधि: २:०० मिनट' : currentLang === 'mr' ? 'एकूण वेळ: २:०० मिनिटे' : 'Duration: 2:00 Total'}
              </span>
              <span>2:00</span>
            </div>
            
            {/* Interactive Timeline Bar with 6 Slide Markers */}
            <div
              className="relative w-full h-3 bg-stone-800 rounded-full cursor-pointer overflow-hidden group"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const ratio = clickX / rect.width;
                handleSeek(Math.floor(ratio * 120));
              }}
            >
              {/* Completed bar */}
              <div
                className="h-full bg-emerald-500 transition-all duration-300 relative"
                style={{ width: `${(elapsedTotalSec / 120) * 100}%` }}
              />

              {/* Segment markers for the 6 slides */}
              {[20, 40, 60, 80, 100].map((sec) => (
                <div
                  key={sec}
                  className="absolute top-0 bottom-0 w-0.5 bg-stone-900/80 z-10"
                  style={{ left: `${(sec / 120) * 100}%` }}
                />
              ))}
            </div>
          </div>

          {/* Bottom Button Toolbar */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            
            {/* Left Controls: Play/Pause, Rewind, Next Slide */}
            <div className="flex items-center gap-2">
              <button
                onClick={togglePlay}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm px-4 py-2 rounded-xl transition shadow-md active:scale-95 cursor-pointer"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4 fill-white" />
                    <span>{currentLang === 'hi' ? 'रोकें (Pause)' : currentLang === 'mr' ? 'थांबवा' : 'Pause'}</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>{currentLang === 'hi' ? 'चलाएं (Play)' : currentLang === 'mr' ? 'सुरू करा' : 'Play'}</span>
                  </>
                )}
              </button>

              <button
                onClick={handleRestart}
                className="p-2 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition cursor-pointer"
                title="Restart from beginning"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <div className="h-5 w-px bg-stone-800 mx-1" />

              <button
                onClick={() => {
                  if (currentSlideIndex > 0) handleSelectSlide(currentSlideIndex - 1);
                }}
                disabled={currentSlideIndex === 0}
                className="p-2 text-stone-400 hover:text-white disabled:opacity-30 rounded-lg hover:bg-stone-800 transition cursor-pointer"
                title="Previous slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="text-xs text-stone-400 font-medium px-1">
                {currentSlideIndex + 1} / {SLIDES.length}
              </span>

              <button
                onClick={() => {
                  if (currentSlideIndex < SLIDES.length - 1) handleSelectSlide(currentSlideIndex + 1);
                }}
                disabled={currentSlideIndex === SLIDES.length - 1}
                className="p-2 text-stone-400 hover:text-white disabled:opacity-30 rounded-lg hover:bg-stone-800 transition cursor-pointer"
                title="Next slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Center: Slide Quick Jumps */}
            <div className="hidden lg:flex items-center gap-1 bg-stone-900 border border-stone-800 p-1 rounded-xl">
              {SLIDES.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => handleSelectSlide(idx)}
                  className={`text-[11px] font-medium px-2.5 py-1 rounded-lg transition cursor-pointer ${
                    idx === currentSlideIndex
                      ? 'bg-emerald-700 text-white font-bold'
                      : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'
                  }`}
                >
                  {idx + 1}. {s.badge.hi ? s.badge.hi.split(':')[1]?.trim() || s.timeRange : s.timeRange}
                </button>
              ))}
            </div>

            {/* Right Controls: Audio Mute, Ambient Score, Speed, Download Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Voice Mute Toggle */}
              <button
                onClick={toggleMute}
                className={`p-2 rounded-lg transition cursor-pointer flex items-center gap-1.5 text-xs ${
                  isMuted ? 'text-stone-500 hover:text-stone-300' : 'text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 border border-emerald-800/40'
                }`}
                title={isMuted ? 'Unmute voice' : 'Mute voice'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <span className="hidden sm:inline">{isMuted ? 'Muted' : 'हिंदी स्वर'}</span>
              </button>

              {/* Ambient Score (Tanpura / Indian Music) Toggle */}
              <button
                onClick={toggleAmbientScore}
                className={`p-2 rounded-lg transition cursor-pointer flex items-center gap-1 text-xs ${
                  isAmbientScoreOn && !isMuted
                    ? 'text-amber-400 bg-amber-950/40 border border-amber-800/40'
                    : 'text-stone-500 hover:text-stone-300'
                }`}
                title="Toggle gentle acoustic Indian background soundtrack"
              >
                <Music className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{currentLang === 'hi' ? 'संगीत' : 'Score'}</span>
              </button>

              {/* Speed selector */}
              <div className="flex items-center gap-1 bg-stone-900 border border-stone-800 p-0.5 rounded-lg text-[11px]">
                {[1, 1.25, 1.5].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => setPlaybackSpeed(speed)}
                    className={`px-1.5 py-0.5 rounded cursor-pointer ${
                      playbackSpeed === speed ? 'bg-stone-700 text-white font-bold' : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>

              {/* 1. Main Download Video (.webm) */}
              <button
                onClick={handleDownloadVideoWebM}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-2 rounded-xl transition shadow-md cursor-pointer"
                title="Download 2-minute playable video file (.webm)"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{currentLang === 'hi' ? 'वीडियो (.webm)' : 'Video (.webm)'}</span>
              </button>

              {/* 2. Download Offline HTML Video Player */}
              <button
                onClick={handleDownloadOfflineHTML}
                className="hidden sm:flex items-center gap-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs px-2.5 py-2 rounded-xl transition cursor-pointer"
                title="Download offline interactive presentation player HTML"
              >
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                <span>HTML / App</span>
              </button>

              {/* 3. Print / PDF */}
              <button
                onClick={() => window.print()}
                className="p-2 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition cursor-pointer"
                title="Print slides / Save as PDF"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Video Generation Progress Modal Overlay */}
      {isExportingVideo && (
        <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-emerald-500/50 rounded-2xl p-6 max-w-md w-full shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
              <Film className="w-6 h-6 animate-pulse" />
            </div>
            
            <h3 className="text-lg font-bold text-white">
              {currentLang === 'hi' ? 'किसान वीडियो तैयार हो रहा है' : 'Rendering Farmer Video File'}
            </h3>
            
            <p className="text-xs text-stone-300">
              {exportStatusText}
            </p>

            <div className="w-full bg-stone-800 h-3 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-amber-500 h-full transition-all duration-200"
                style={{ width: `${exportProgress}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs font-mono text-stone-400">
              <span>HD 1280x720</span>
              <span className="font-bold text-emerald-400">{exportProgress}%</span>
              <span>WebM / Audio</span>
            </div>

            <p className="text-[11px] text-stone-400">
              {currentLang === 'hi'
                ? 'वीडियो बनते ही आपके डिवाइस में स्वतः डाउनलोड हो जाएगा।'
                : 'The video will automatically download to your downloads folder.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
