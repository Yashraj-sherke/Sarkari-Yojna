import { Pool } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

const officialImagesKeys = [
  'mukhyamantri-arthik-kalyan-tribal-yojana',
  'mukhyamantri-swarojgar-yojana-general',
  'mukhyamantri-krishak-udyami-yojana',
  'mp-mukhyamantri-udyam-kranti-yojana',
  'yuva-annadoot-yojana',
  'ration-aapke-dwar-yojana',
  'padho-aur-padhao-yojana',
  'covid-19-bal-kalyan-yojana',
  'bal-aashirwad-yojana',
  'mukhyamantri-gas-cylinder-subsidy-yojana',
  'pm-kisan', 'ladli-behna', 'seekho-kamao', 'kisan-kalyan',
  'gaon-ki-beti', 'sambal-yojana', 'ayushman-bharat',
  'pm-awas-gramin', 'ration-support', 'pm-vishwakarma',
  'pm-surya-ghar', 'pm-mudra', 'atal-pension', 'pm-ujjwala',
  'ladli-laxmi', 'madhya-pradesh-ladli-laxmi-yojana',
  'mukhyamantri-seekho-kamao', 'mp-gaon-ki-beti',
  'social-pension', 'employment-support', 'mp-board-laptop',
  'mp-scholarship', 'sukanya-samriddhi', 'pm-jeevan-jyoti-bima',
  'pm-suraksha-bima', 'pm-awas-shahri', 'pm-fasal-bima',
  'surajdhara-yojana', 'mukhyamantri-arthik-kalyan-yojana',
  'mukhyamantri-kanya-vivah-yojana', 'mukhyamantri-teerth-darshan-yojana',
  'mausam-aadharit-fasal-bima-yojana', 'phal-paudh-ropan-yojana',
  'masala-kshetra-vistar-yojana', 'sabzi-kshetra-vistar-yojana',
  'golden-kitchen-garden-yojana', 'bhavantar-bhugtan-yojana',
  'krishak-prashikshan-bhraman-yojana', 'krishi-mela-pradarshani-yojana',
  'mahila-krishi-bhagidari-yojana', 'kisan-mitra-prashikshan-yojana',
  'jaivik-kheti-protsahan-yojana', 'balram-tal-yojana', 'annapurna-beej-yojana',
  'bailgadi-anudan-yojana', 'ambedkar-medhavi-vidyarthi-puraskar',
  'krishi-jalvayu-pilot-project', 'sinchai-kshamta-vikas-yojana',
  'satat-ganna-vikas-yojana', 'mukhyamantri-videsh-krishi-yatra',
  'mitti-parikshan-yojana', 'macro-management-scheme-krishi',
  'gramin-engineer-yojana', 'apradh-pidit-pratikar-yojana',
  'mukhyamantri-kaushal-samvardhan-yojana', 'mukhyamantri-yuva-udyami-yojana',
  'mukhyamantri-mazdoor-suraksha-yojana', 'nishaktjan-vivah-protsahan-yojana',
  'mukhyamantri-bal-hriday-upchar-yojana', 'sanrakshit-kheti-protsahan-yojana',
  'udyaniki-yantrikaran-yojana', 'swarna-jayanti-gram-swarojgar-yojana'
];

async function run() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    const res = await pool.query('SELECT data FROM schemes');
    const svgs = [];
    
    for (const row of res.rows) {
      const s = JSON.parse(row.data);
      if (s.category === 'rojgar' && !s.imageUrl && !officialImagesKeys.includes(s.slug) && s.status === 'ACTIVE') {
        svgs.push(s.title);
      }
    }
    
    console.log(JSON.stringify(svgs, null, 2));
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end();
  }
}

run();
