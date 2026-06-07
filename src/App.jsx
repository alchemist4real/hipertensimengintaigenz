import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

// Supabase Setup
const supabaseUrl = 'https://kklvtfuvxudckuxkoysc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtrbHZ0ZnV2eHVkY2t1eGtveXNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0Mjc1NzEsImV4cCI6MjA5MDAwMzU3MX0.SsBoGWSP81U6A_VR4XwsA8WafXjfO_opxeUHKFPtYvM';
const supabase = createClient(supabaseUrl, supabaseKey);

// --- DATA ---
const PRETEST = [
  {q:"Dalam video, Tuan Muda Raffin memiliki kebiasaan makan gorengan dalam jumlah banyak. Apa dampak kebiasaan ini terhadap kesehatan?",opts:["Bisa meningkatkan tekanan darah secara perlahan.","Membuat tubuh lebih berenergi sepanjang hari.","Membantu melancarkan sirkulasi darah.","Tidak ada dampaknya sama sekali."],ans:0,exp:""},
  {q:"Menurut narasi video, apa yang dimaksud dengan 'tekanan darah naik pelan-pelan'?",opts:["Tekanan darah langsung melonjak setelah bangun tidur.","Tekanan darah meningkat bertahap akibat kebiasaan buruk yang terus berulang.","Peningkatan tekanan darah yang hanya terjadi pada lansia.","Penyakit menular yang berkembang di dalam darah."],ans:1,exp:""},
  {q:"Dari video, manakah yang BUKAN termasuk faktor yang disebutkan bisa memicu tekanan darah naik?",opts:["Begadang dan kurang tidur.","Terlalu banyak makan makanan tinggi garam.","Faktor keturunan (genetik).","Sering merasa stres tidak terkontrol."],ans:2,exp:""},
  {q:"Gejala apa yang dialami Tuan Muda Raffin sebelum ia kolaps di video?",opts:["Mual dan muntah parah.","Kepala berdenyut hebat (sakit kepala tiba-tiba).","Nyeri pada persendian kaki.","Batuk yang tidak kunjung sembuh."],ans:1,exp:""},
  {q:"Menurut video, apa risiko yang terjadi jika gejala hipertensi dibiarkan terlalu lama?",opts:["Risiko penyakit jantung atau stroke.","Sakit maag yang kronis.","Gangguan pendengaran parah.","Kebutaan mendadak."],ans:0,exp:""},
  {q:"Video menyebutkan beberapa cara pencegahan hipertensi. Manakah yang TIDAK disebutkan dalam video?",opts:["Cek tekanan darah secara rutin.","Konsumsi suplemen vitamin setiap hari.","Tidur yang cukup.","Olahraga ringan secara teratur."],ans:1,exp:""},
  {q:"Apa yang dianjurkan video untuk dilakukan secara rutin sebagai langkah deteksi dini?",opts:["Minum air putih 3 liter sehari.","Cek tekanan darah secara berkala.","Menimbang berat badan setiap minggu.","Makan sayur setiap pagi."],ans:1,exp:""},
  {q:"Selain begadang dan stres, konsumsi apa yang disebut video bisa memicu tekanan darah naik?",opts:["Makanan tinggi garam dan minuman manis.","Sayuran hijau dan buah segar.","Daging ayam dan ikan laut.","Susu rendah lemak."],ans:0,exp:""},
  {q:"Menurut video, kurang gerak (sedentari) termasuk faktor risiko hipertensi. Solusi yang disarankan adalah…",opts:["Berolahraga ringan secara teratur.","Duduk santai sambil menonton TV.","Tidur lebih lama di siang hari.","Makan camilan sambil belajar."],ans:0,exp:""},
  {q:"Pesan utama yang ingin disampaikan video kepada Gen Z adalah…",opts:["Hipertensi hanya berbahaya bagi orang lanjut usia.","Hipertensi bisa mengintai siapa saja, termasuk anak muda — mulai lakukan pencegahan dari sekarang.","Tidak perlu khawatir makan apapun selama masih muda.","Tekanan darah tinggi adalah penyakit keturunan yang tidak bisa dicegah."],ans:1,exp:""}
];

const POSTTEST = [
  {q:"Berapa ambang batas tekanan darah yang dikategorikan sebagai hipertensi?",opts:["≥ 120/80 mmHg","≥ 130/85 mmHg","≥ 140/90 mmHg","≥ 150/100 mmHg"],ans:2,exp:"Nilai ≥ 140/90 mmHg adalah standar WHO/JNC untuk diagnosis hipertensi."},
  {q:"Mengapa hipertensi dijuluki 'the silent killer'?",opts:["Sebagian besar penderita tidak merasakan gejala apapun","Gejalanya hanya muncul saat malam hari","Penyakit ini tidak bisa dideteksi medis","Bisa sembuh sendiri tanpa diobati"],ans:0,exp:"Sebagian besar penderita tidak merasakan gejala apapun, seperti Raffin yang tidak sadar kondisinya hingga kolaps."},
  {q:"Menurut rekomendasi WHO, berapa batas maksimal konsumsi garam per hari?",opts:["10 gram","5 gram (±1 sendok teh)","15 gram","Tidak ada batasan"],ans:1,exp:"Melebihi batas ini meningkatkan retensi cairan dan volume darah."},
  {q:"Kebiasaan begadang memicu hipertensi melalui mekanisme apa?",opts:["Membuat aliran darah lebih lancar","Menurunkan detak jantung","Aktivasi saraf simpatis berlebihan dan gangguan mekanisme dipping malam hari","Meningkatkan penyerapan oksigen ke otak"],ans:2,exp:"Penurunan tekanan darah alami di malam hari terganggu sehingga tekanan tetap tinggi."},
  {q:"Gorengan ≥ 4 kali seminggu meningkatkan risiko hipertensi berapa kali lipat?",opts:["1,21 kali lipat","2,4 kali lipat","3 kali lipat","Tidak meningkatkan risiko"],ans:0,exp:"Akibat asam lemak trans yang merusak elastisitas dinding pembuluh darah."},
  {q:"Stres kronis meningkatkan risiko hipertensi melalui jalur biologis apa?",opts:["Aktivasi sumbu HPA berlebihan","Penurunan kadar kolesterol","Peningkatan sel darah merah","Melemahkan otot jantung"],ans:0,exp:"Sumbu HPA → kortisol dan katekolamin meningkat → vasokonstriksi → tekanan darah naik."},
  {q:"Manakah yang BUKAN faktor risiko hipertensi yang bisa diubah?",opts:["Kurang tidur","Asupan garam","Riwayat keluarga","Tingkat stres"],ans:2,exp:"Genetik dan usia adalah faktor tetap yang tidak dapat dimodifikasi."},
  {q:"Komplikasi hipertensi pada organ otak mencakup...",opts:["Gagal ginjal dan asma","Stroke dan demensia vaskular","Kebutaan dan katarak","Penyakit asam lambung"],ans:1,exp:"Tekanan tinggi merusak pembuluh darah kecil di otak secara bertahap."},
  {q:"Berdasarkan data nasional, berapa persen penderita hipertensi di Indonesia yang aktif berobat?",opts:["50%","22,5%","80%","10%"],ans:1,exp:"Angka ini sangat rendah, menunjukkan rendahnya kesadaran pengobatan aktif."},
  {q:"Langkah pencegahan hipertensi yang paling mudah dilakukan oleh Gen Z adalah…",opts:["Minum obat tiap hari","Menghindari segala macam makanan","Cek tekanan darah rutin, kurangi manis/garam, tidur cukup & olahraga","Tidur seharian penuh"],ans:2,exp:"Gabungan dari pesan penutup video dan panduan gaya hidup sehat berbasis bukti."}
];

const EDU_MATERIALS = [
  {
    icon: "ti-video",
    title: "Kisah Tuan Muda Raffin",
    sub: "Pelajaran dari narasi video tentang bahaya gaya hidup buruk",
    html: `
    <div class="edu-section animate-slide">
      <div class="edu-section-label"><i class="ti ti-alert-triangle"></i> Faktor Pemicu (Dari Video)</div>
      <p class="edu-section-text">Berdasarkan kisah Tuan Muda Raffin, berikut adalah kebiasaan yang memicu lonjakan tekanan darah:</p>
      <ul style="margin:8px 0 0 18px;font-size:14px;color:var(--text-secondary);line-height:2">
        <li><strong>Begadang</strong> — kurang tidur tingkatkan tekanan darah secara bertahap.</li>
        <li><strong>Stres</strong> — emosi tak terkontrol memicu lonjakan tekanan darah.</li>
        <li><strong>Kopi berlebihan</strong> — kafein merangsang sistem saraf.</li>
        <li><strong>Makanan tinggi garam</strong> — tubuh menahan lebih banyak air dan tekanan darah meningkat.</li>
        <li><strong>Kurang gerak (sedentari)</strong> — aktivitas fisik rendah melemahkan jantung.</li>
      </ul>
    </div>
    <div class="edu-section animate-slide">
      <div class="edu-section-label"><i class="ti ti-activity"></i> Gejala & Risiko</div>
      <p class="edu-section-text">Gejala yang dialami Raffin sebelum kolaps: <strong>sakit kepala berdenyut hebat, mudah lelah, dan jantung berdebar cepat</strong>. Jika dibiarkan, ini bisa memicu <strong>penyakit jantung</strong> dan <strong>stroke</strong>.</p>
    </div>
    <div class="edu-section animate-slide">
      <div class="edu-section-label"><i class="ti ti-shield"></i> Pencegahan</div>
      <p class="edu-section-text">Cek tekanan darah rutin, kurangi makanan instan & manis, tidur cukup, olahraga ringan teratur, dan jangan abaikan stres!</p>
    </div>
    `
  },
  {
    icon: "ti-info-circle",
    title: "Apa itu Hipertensi?",
    sub: "Mengenal definisi medis dan fakta di Indonesia",
    html: `
    <div class="edu-section animate-slide">
      <div class="edu-section-label"><i class="ti ti-stethoscope"></i> Definisi Medis</div>
      <p class="edu-section-text">Hipertensi adalah kondisi ketika tekanan darah secara konsisten berada di angka <strong>&ge; 140/90 mmHg</strong> (sistolik/diastolik).</p>
      <div class="callout" style="margin-top:12px">
        <p><strong>The Silent Killer!</strong> WHO menyebutnya pembunuh senyap karena penderita sering tidak merasakan gejala apapun hingga komplikasi serius terjadi.</p>
      </div>
    </div>
    <div class="edu-section animate-slide">
      <div class="edu-section-label"><i class="ti ti-chart-bar"></i> Fakta di Indonesia</div>
      <ul style="margin:8px 0 0 18px;font-size:14px;color:var(--text-secondary);line-height:2">
        <li>Prevalensi meningkat tajam menjadi <strong>31,6% (2023)</strong>.</li>
        <li>Mirisnya, hanya <strong>26,9%</strong> yang menyadari kondisinya.</li>
        <li>Hanya <strong>22,5%</strong> yang menjalani pengobatan aktif.</li>
      </ul>
    </div>
    `
  },
  {
    icon: "ti-alert-circle",
    title: "Mengapa Gen Z Berisiko?",
    sub: "Asupan, pola tidur, dan stres di kalangan muda",
    html: `
    <div class="edu-section animate-slide">
      <div class="edu-section-label"><i class="ti ti-salt"></i> Asupan Garam</div>
      <p class="edu-section-text">WHO membatasi konsumsi natrium maksimal <strong>5 gram (&plusmn;1 sendok teh) per hari</strong>. Terlalu banyak makan makanan asin membuat tubuh menahan lebih banyak air. Akibatnya, jumlah cairan dalam pembuluh darah bertambah sehingga tekanan darah menjadi lebih tinggi.</p>
    </div>
    <div class="edu-section animate-slide">
      <div class="edu-section-label"><i class="ti ti-pizza"></i> Gorengan</div>
      <p class="edu-section-text">Kandungan lemak trans (lemak jahat) dari gorengan memicu penumpukan plak di pembuluh darah. Akibatnya, pembuluh darah menjadi lebih kaku dan sempit sehingga tekanan darah lebih mudah meningkat.</p>
    </div>
    <div class="edu-section animate-slide">
      <div class="edu-section-label"><i class="ti ti-moon"></i> Begadang</div>
      <p class="edu-section-text">Kurang tidur mengaktifkan sistem saraf simpatis secara berlebihan, yang memicu tubuh tetap berada dalam kondisi siaga sehingga tidak dapat beristirahat dengan baik, akibatnya tekanan darah lebih mudah meningkat.</p>
    </div>
    <div class="edu-section animate-slide">
      <div class="edu-section-label"><i class="ti ti-brain"></i> Stres Kronis (FOMO)</div>
      <p class="edu-section-text">Tekanan akademik dan fenomena FOMO (Fear of Missing Out) dapat menyebabkan stres berkepanjangan. Saat stres, tubuh mengaktifkan sistem respons stres (sumbu HPA) yang meningkatkan pelepasan hormon seperti kortisol. Jika berlangsung terus-menerus, hormon tersebut dapat membuat tekanan darah lebih mudah naik dan meningkatkan risiko hipertensi.</p>
    </div>
    `
  },
  {
    icon: "ti-heart-broken",
    title: "Dampak Jangka Panjang",
    sub: "Risiko yang tidak bisa diubah dan kerusakan organ vital",
    html: `
    <div class="edu-section animate-slide">
      <div class="edu-section-label"><i class="ti ti-dna"></i> Faktor yang Tak Bisa Diubah</div>
      <p class="edu-section-text">Terdapat risiko bawaan yakni <strong>riwayat keluarga</strong> dengan hipertensi serta <strong>penambahan usia</strong> yang memicu kekakuan pembuluh darah secara alami.</p>
    </div>
    <div class="edu-section animate-slide">
      <div class="edu-section-label"><i class="ti ti-activity-heartbeat"></i> Kerusakan Organ (Komplikasi)</div>
      <p class="edu-section-text">Tekanan darah tinggi terus-menerus memicu penumpukan plak (aterosklerosis) dan merusak organ vital:</p>
      <ul style="margin:8px 0 0 18px;font-size:14px;color:var(--text-secondary);line-height:2">
        <li><strong>Jantung:</strong> Kerja jantung meningkat sehingga tekanan darah naik, memicu serangan jantung dan gagal jantung.</li>
        <li><strong>Otak:</strong> Stroke dan gangguan aliran darah ke otak (demensia vaskular).</li>
        <li><strong>Ginjal:</strong> Gagal ginjal kronis.</li>
        <li><strong>Mata:</strong> Gangguan penglihatan hingga kebutaan.</li>
      </ul>
    </div>
    `
  },
  {
    icon: "ti-pill",
    title: "Solusi Pengobatan",
    sub: "Langkah bijak menangani hipertensi",
    html: `
    <div class="edu-section animate-slide">
      <div class="edu-section-label"><i class="ti ti-check"></i> Dasar Penanganan</div>
      <p class="edu-section-text">Hipertensi bukanlah akhir dunia jika ditangani dengan tepat. Dasar pengobatannya adalah <strong>perubahan gaya hidup sehat</strong> disertai <strong>obat antihipertensi dari dokter</strong>.</p>
    </div>
    <div class="edu-section animate-slide">
      <div class="edu-section-label"><i class="ti ti-alarm"></i> Kepatuhan Minum Obat</div>
      <p class="edu-section-text">Bagi yang sudah terdiagnosis, kepatuhan minum obat secara rutin sangat menentukan keberhasilan pengobatan jangka panjang dan mencegah komplikasi mematikan. Jangan hentikan obat tanpa saran dokter!</p>
    </div>
    `
  }
];

const SOURCES = [
  {
    cluster: "1. Definisi Hipertensi",
    claim: "Hipertensi adalah kondisi ketika tekanan darah secara konsisten berada di angka ≥ 140/90 mmHg (sistolik/diastolik).",
    refs: [
      "Chobanian, A. V., et al. (2003). The Seventh Report of the Joint National Committee on Prevention, Detection, Evaluation, and Treatment of High Blood Pressure: The JNC 7 Report. JAMA, 289(19), 2560–2572.",
      "Abdalla, M., & Beheiry, A. (2023). Essential Hypertension. StatPearls [Internet]."
    ]
  },
  {
    cluster: "2. The Silent Killer",
    claim: "WHO menyebut hipertensi sebagai 'the silent killer' karena sebagian besar penderita tidak merasakan gejala sampai terjadi komplikasi serius.",
    refs: [
      "World Health Organization. (2023). Hypertension — Key facts. WHO Fact Sheets.",
      "Badan Kebijakan Pembangunan Kesehatan Kemenkes RI. (2024). Bahaya Hipertensi Mengintai Anak Muda Indonesia."
    ]
  },
  {
    cluster: "3. Prevalensi di Indonesia",
    claim: "Prevalensi meningkat dari 27,9% (2013) menjadi 31,6% (2023); hanya 26,9% yang menyadari; hanya 22,5% yang berobat aktif.",
    refs: [
      "Kementerian Kesehatan RI. (2013). Riset Kesehatan Dasar (Riskesdas) 2013.",
      "Kementerian Kesehatan RI. (2024). Survei Kesehatan Indonesia (SKI) 2023.",
      "Wahidin, M., et al. (2025). Overview of Hypertension Prevalence and Its Main Risk Factors in Indonesia. Amerta Nutrition, 9(3), 438–442."
    ]
  },
  {
    cluster: "4. Batas Konsumsi Garam",
    claim: "WHO membatasi konsumsi natrium maksimal 5 gram (±1 sendok teh) per hari.",
    refs: [
      "World Health Organization. (2012). Guideline: Sodium Intake for Adults and Children.",
      "Farquhar, W. B., et al. (2015). Dietary Sodium and Health: More Than Just Blood Pressure. Journal of the American College of Cardiology, 65(10), 1042–1050."
    ]
  },
  {
    cluster: "5. Gorengan & Lemak Trans",
    claim: "Konsumsi gorengan ≥ 4 kali seminggu meningkatkan risiko hipertensi sebesar 1,21 kali lipat; asam lemak trans merusak elastisitas pembuluh darah.",
    refs: [
      "Guallar-Castillón, P., et al. (2012). Reported fried food consumption and the incidence of hypertension in a Mediterranean cohort. British Journal of Nutrition, 112(6), 984–991.",
      "Gadiraju, T. V., et al. (2015). Fried Food Consumption and Cardiovascular Health: A Review of Current Evidence. Nutrients, 7(10), 8424–8430."
    ]
  },
  {
    cluster: "6. Begadang & Kualitas Tidur",
    claim: "Kurang tidur mengaktifkan sistem saraf simpatis secara berlebihan dan mengganggu mekanisme dipping (penurunan TD alami di malam hari).",
    refs: [
      "Lusardi, P., et al. (1999). Effects of insufficient sleep on blood pressure in hypertensive patients. American Journal of Hypertension, 12(1), 63–68.",
      "Dominguez-Rodriguez, A., & de la Torre-Hernandez, J. M. (2022). The Association Between Sleep Deprivation and Arterial Pressure Variations. Sleep Medicine, 90, 63–73."
    ]
  },
  {
    cluster: "7. Stres Kronis & Aktivasi HPA",
    claim: "Stres kronis (seperti tuntutan akademik atau FOMO) mengaktifkan sumbu HPA berlebihan dan meningkatkan risiko hipertensi.",
    refs: [
      "Sparrenberger, F., et al. (2009). Does Psychosocial Stress Cause Hypertension? A Systematic Review. Journal of Human Hypertension, 23(1), 12–19.",
      "Joe, M., et al. (2023). Relationship Between Psychological Distress, Health Behaviours and Future Reports of Hypertension. BMJ Open, 13(7), e068234."
    ]
  },
  {
    cluster: "8. Kafein / Kopi",
    claim: "Kafein merangsang sistem saraf simpatis dan meningkatkan tekanan darah secara akut.",
    refs: [
      "Corti, R., et al. (2002). Coffee Acutely Increases Sympathetic Nerve Activity and Blood Pressure. Circulation, 106(23), 2935–2940.",
      "Palatini, P., & Julius, S. (2019). Caffeine and Blood Pressure: A Critical Review Perspective. Nutrition Research Reviews, 32(2), 236–248."
    ]
  },
  {
    cluster: "9. Gaya Hidup Sedentari",
    claim: "Aktivitas fisik rendah (sedentari) memperlambat sirkulasi dan menjadi faktor risiko independen hipertensi.",
    refs: [
      "Liang, Z., et al. (2022). Association Between Sedentary Behavior, Physical Activity, and Cardiovascular Disease-Related Outcomes. Frontiers in Public Health, 10, 1018460.",
      "Biswas, A., et al. (2015). Sedentary Time and Its Association with Risk for Disease Incidence. Annals of Internal Medicine, 162(2), 123–132."
    ]
  },
  {
    cluster: "10. Aterosklerosis & Komplikasi",
    claim: "Tekanan darah tinggi terus-menerus memicu penumpukan plak (aterosklerosis) dan merusak organ vital (target organ damage).",
    refs: [
      "Oparil, S., et al. (2018). Hypertension. Nature Reviews Disease Primers, 4, 18014.",
      "Touyz, R. M., & Schiffrin, E. L. (2017). The Role of Endothelin in Hypertension. Current Hypertension Reports, 19(1), 4."
    ]
  },
  {
    cluster: "11. Komplikasi: Jantung & Otak",
    claim: "Hipertensi yang tidak terkontrol menyebabkan serangan jantung, gagal jantung (LVH), stroke, dan demensia vaskular.",
    refs: [
      "Shams, P., Tackling, G., & Borhade, M. B. (2024). Hypertensive Heart Disease. StatPearls.",
      "Gorelick, P. B., et al. (2011). Vascular Contributions to Cognitive Impairment and Dementia. Stroke, 42(9), 2672–2713."
    ]
  },
  {
    cluster: "12. Komplikasi: Ginjal & Mata",
    claim: "Berdampak merusak pada sirkulasi mikro, menyebabkan gagal ginjal kronis (nefropati) dan kebutaan (retinopati hipertensif).",
    refs: [
      "Weiner, D. E., & Tighiouart, H. (2020). Hypertension and Kidney Disease: The Double-Edged Sword. Clinical Journal of the American Society of Nephrology.",
      "Modi, P., & Arsiwalla, T. (2022). Hypertensive Retinopathy. StatPearls."
    ]
  },
  {
    cluster: "13. Kepatuhan Obat (Adherence)",
    claim: "Kepatuhan minum obat sangat menentukan keberhasilan pengobatan dan menurunkan risiko morbiditas kardiovaskular secara drastis.",
    refs: [
      "Peng, X., et al. (2025). The Link Between Adherence to Antihypertensive Medications and Mortality Rates. BMC Cardiovascular Disorders, 25, 145.",
      "Corrao, G., et al. (2011). Better Compliance to Antihypertensive Medications Reduces Cardiovascular Risk. Journal of Hypertension."
    ]
  },
  {
    cluster: "14. Hipertensi pada Anak Muda / Gen Z",
    claim: "Bukan hanya penyakit orang tua; SKI 2023 mencatat prevalensi hipertensi mencapai 10,7% pada rentang usia 18–24 tahun di Indonesia.",
    refs: [
      "Badan Kebijakan Pembangunan Kesehatan Kemenkes RI. (2024, Desember 2). Bahaya Hipertensi Mengintai Anak Muda Indonesia.",
      "Kementerian Kesehatan Republik Indonesia. (2024). Survei Kesehatan Indonesia (SKI) 2023."
    ]
  },
  {
    cluster: "15. Olahraga Aerobik",
    claim: "Olahraga aerobik secara teratur dan moderat efektif membantu mengontrol serta menurunkan tekanan darah.",
    refs: [
      "Ramirez-Jimenez, M., et al. (2023). Effect of Leisure-Time Physical Activity on Blood Pressure in People with Hypertension. Scientific Reports, 13, 10639.",
      "Pescatello, L. S., et al. (2019). Physical Activity to Prevent and Treat Hypertension: A Systematic Review. Medicine & Science in Sports & Exercise."
    ]
  }
];

function MainApp() {
  const navigate = useNavigate();
  const [step, setStep] = useState('landing'); // landing, pretest, edu, posttest, result
  const [name, setName] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [zCount, setZCount] = useState(0);

  // Quiz states
  const [preCur, setPreCur] = useState(0);
  const [preAnswers, setPreAnswers] = useState([]);
  const [preScore, setPreScore] = useState(0);

  const [postCur, setPostCur] = useState(0);
  const [postAnswers, setPostAnswers] = useState([]);
  const [postScore, setPostScore] = useState(0);

  // Education states
  const [eduCur, setEduCur] = useState(0);

  // Certificate download state
  const [certDownloaded, setCertDownloaded] = useState(false);

  // Scroll effect on topbar
  useEffect(() => {
    const handleScroll = () => {
      const tb = document.getElementById('topbar');
      if (tb) {
        tb.classList.toggle('scrolled', window.scrollY > 8);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hidden admin dashboard trigger
  useEffect(() => {
    if (zCount >= 3) {
      navigate('/dashboard-admin');
    }
  }, [zCount, navigate]);

  // Start Program
  const handleStart = async () => {
    if (name.trim().length < 2) {
      alert('Silakan masukkan nama lengkap Anda (minimal 2 karakter) terlebih dahulu.');
      return;
    }
    if (!agreed) {
      alert('Anda harus menyetujui pengumpulan data (centang kotak persetujuan) untuk memulai.');
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('hipertensi_logs')
        .insert([{ name: name.trim(), progress_score: 0 }])
        .select()
        .single();

      if (error) throw error;
      setUserId(data.id);
      setStep('pretest');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      alert('Gagal menyimpan data ke database. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  // Pretest Select Option & Auto Next
  const handlePreSelect = (idx) => {
    const isCorrect = idx === PRETEST[preCur].ans;
    const updatedAnswers = [...preAnswers, { sel: idx, ok: isCorrect }];
    setPreAnswers(updatedAnswers);

    if (preCur + 1 < PRETEST.length) {
      setPreCur(preCur + 1);
    } else {
      const finalPreScore = updatedAnswers.filter(a => a.ok).length;
      setPreScore(finalPreScore);
      setStep('edu');
      setEduCur(0);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Posttest Select Option & Auto Next
  const handlePostSelect = async (idx) => {
    const isCorrect = idx === POSTTEST[postCur].ans;
    const updatedAnswers = [...postAnswers, { sel: idx, ok: isCorrect }];
    setPostAnswers(updatedAnswers);

    if (postCur + 1 < POSTTEST.length) {
      setPostCur(postCur + 1);
    } else {
      const finalPostScore = updatedAnswers.filter(a => a.ok).length;
      const finalScoreVal = finalPostScore * 10;
      setPostScore(finalPostScore);

      // Save final score to Supabase
      if (userId) {
        try {
          await supabase
            .from('hipertensi_logs')
            .update({ progress_score: finalScoreVal })
            .eq('id', userId);
        } catch (e) {
          console.error('Gagal memperbarui skor di Supabase:', e);
        }
      }
      setStep('result');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset all states
  const resetAll = () => {
    setName('');
    setAgreed(false);
    setUserId(null);
    setPreCur(0);
    setPreAnswers([]);
    setPreScore(0);
    setPostCur(0);
    setPostAnswers([]);
    setPostScore(0);
    setEduCur(0);
    setCertDownloaded(false);
    setZCount(0);
    setStep('landing');
  };

  // Download Certificate PDF/PNG Custom Canvas Red
  const downloadCert = () => {
    const total = PRETEST.length;
    const p1 = Math.round((preScore / total) * 100);
    const p2 = Math.round((postScore / total) * 100);
    const imp = Math.max(0, p2 - p1);
    
    const W = 1200, H = 850;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');

    // Background soft red tint
    ctx.fillStyle = '#FFF5F5';
    ctx.fillRect(0, 0, W, H);

    // Border pattern
    ctx.strokeStyle = '#FECACA'; 
    ctx.lineWidth = 2;
    ctx.strokeRect(20, 20, W - 40, H - 40);
    ctx.strokeStyle = '#F87171'; 
    ctx.lineWidth = 1;
    ctx.strokeRect(30, 30, W - 60, H - 60);

    // Corner ornaments
    const corners = [[35, 35], [W - 35, 35], [35, H - 35], [W - 35, H - 35]];
    ctx.strokeStyle = '#DC2626'; 
    ctx.lineWidth = 2;
    corners.forEach(([cx, cy]) => {
      ctx.beginPath();
      ctx.arc(cx, cy, 8, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Top ribbon gradient
    const grad = ctx.createLinearGradient(0, 0, W, 0);
    grad.addColorStop(0, '#EF4444');
    grad.addColorStop(1, '#B91C1C');
    ctx.fillStyle = grad;
    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(40, 40, W - 80, 90, 0);
      ctx.fill();
    } else {
      ctx.fillRect(40, 40, W - 80, 90);
    }

    // Ribbon text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 14px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '4px';
    ctx.fillText('SERTIFIKAT PENYELESAIAN', W / 2, 72);
    ctx.font = '12px Inter, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,.75)';
    ctx.fillText('PROGRAM EDUKASI KESEHATAN — #HT_GEN_Z', W / 2, 100);

    // Subtitle
    ctx.fillStyle = '#991B1B';
    ctx.font = '12px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('HIPIERTENSI MENGINTAI GEN Z — STAY YOUNG AND HEALTHY', W / 2, 162);

    // Line
    ctx.strokeStyle = '#FECACA';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(200, 178);
    ctx.lineTo(W - 200, 178);
    ctx.stroke();

    // "Diberikan kepada"
    ctx.fillStyle = '#A8A29E';
    ctx.font = '14px Inter, sans-serif';
    ctx.fillText('Diberikan kepada', W / 2, 215);

    // Name
    ctx.fillStyle = '#1C1917';
    ctx.font = 'italic bold 48px "Playfair Display", Georgia, serif';
    ctx.fillText(name, W / 2, 275);

    // Line under name
    ctx.strokeStyle = '#FECACA';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(250, 295);
    ctx.lineTo(W - 250, 295);
    ctx.stroke();

    // Description
    ctx.fillStyle = '#57534E';
    ctx.font = '14px Inter, sans-serif';
    ctx.fillText('telah menyelesaikan seluruh materi edukasi pada program', W / 2, 335);
    ctx.fillStyle = '#1C1917';
    ctx.font = 'bold 14px Inter, sans-serif';
    ctx.fillText('Hipertensi & Gaya Hidup Sehat — FK Unsoed, Blok 2.4 Etika dan Komunikasi', W / 2, 360);

    // Score boxes
    const boxes = [
      [280, 'PRETEST', p1 + '%', preScore + '/' + total + ' benar'],
      [W / 2, 'POSTTEST', p2 + '%', postScore + '/' + total + ' benar'],
      [W - 280, 'PENINGKATAN', '+' + imp + '%', 'dari pretest']
    ];
    boxes.forEach(([x, label, val, sub], idx) => {
      const bw = 200, bh = 110, bx = x - bw / 2, by = 400;
      // Box bg
      ctx.fillStyle = idx === 2 ? '#FEE2E2' : '#FEF2F2';
      if (ctx.roundRect) {
        ctx.beginPath();
        ctx.roundRect(bx, by, bw, bh, 10);
        ctx.fill();
      } else {
        ctx.fillRect(bx, by, bw, bh);
      }
      // Box border
      ctx.strokeStyle = idx === 2 ? '#F87171' : '#FECACA';
      ctx.lineWidth = 1.5;
      if (ctx.roundRect) {
        ctx.beginPath();
        ctx.roundRect(bx, by, bw, bh, 10);
        ctx.stroke();
      } else {
        ctx.strokeRect(bx, by, bw, bh);
      }
      // Label
      ctx.fillStyle = '#991B1B';
      ctx.font = 'bold 10px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(label, x, by + 24);
      // Value
      ctx.fillStyle = idx === 2 ? '#B91C1C' : '#1C1917';
      ctx.font = 'bold 38px "Playfair Display", Georgia, serif';
      ctx.fillText(val, x, by + 70);
      // Sub
      ctx.fillStyle = '#A8A29E';
      ctx.font = '11px Inter, sans-serif';
      ctx.fillText(sub, x, by + 92);
    });

    // Divider
    ctx.strokeStyle = '#FECACA';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(200, 550);
    ctx.lineTo(W - 200, 550);
    ctx.stroke();

    // Bars
    const drawBar = (y, label, val, color) => {
      ctx.fillStyle = '#A8A29E';
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(label, 200, y - 6);
      ctx.fillStyle = '#FFE3E3';
      if (ctx.roundRect) {
        ctx.beginPath();
        ctx.roundRect(200, y, W - 400, 10, 5);
        ctx.fill();
      } else {
        ctx.fillRect(200, y, W - 400, 10);
      }
      const grd = ctx.createLinearGradient(200, 0, 200 + (W - 400) * (val / 100), 0);
      grd.addColorStop(0, '#F87171');
      grd.addColorStop(1, color);
      ctx.fillStyle = grd;
      if (ctx.roundRect) {
        ctx.beginPath();
        ctx.roundRect(200, y, (W - 400) * (val / 100), 10, 5);
        ctx.fill();
      } else {
        ctx.fillRect(200, y, (W - 400) * (val / 100), 10);
      }
      ctx.fillStyle = '#991B1B';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(val + '%', W - 192, y - 6);
    };

    ctx.fillStyle = '#A8A29E';
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('VISUALISASI PERBANDINGAN NILAI', W / 2, 580);
    drawBar(594, 'Pretest', p1, '#FECACA');
    drawBar(624, 'Posttest', p2, '#B91C1C');

    // Institution
    ctx.fillStyle = '#991B1B';
    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('FAKULTAS KEDOKTERAN — UNIVERSITAS JENDERAL SOEDIRMAN', W / 2, 680);

    // Date
    const dateStr = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    ctx.fillStyle = '#A8A29E';
    ctx.font = '11px Inter, sans-serif';
    ctx.fillText('Purwokerto, ' + dateStr + '  ·  Kelompok 5 Kelas B  ·  T.A. 2025/2026', W / 2, 705);

    // Watermark
    ctx.save();
    ctx.globalAlpha = 0.03;
    ctx.font = 'bold 90px "Playfair Display", Georgia, serif';
    ctx.fillStyle = '#B91C1C';
    ctx.textAlign = 'center';
    ctx.fillText('#HTGENZ', W / 2, H - 60);
    ctx.restore();

    // Trigger download
    const link = document.createElement('a');
    link.download = 'Sertifikat_HipertensiGenZ_' + name.replace(/\s+/g, '_') + '.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
    setCertDownloaded(true);
  };

  return (
    <div className="min-h-screen">
      {/* TOPBAR */}
      <nav className="topbar" id="topbar" style={{ position: 'sticky', top: 0, zIndex: 999 }}>
        <span className="topbar-brand">
          Hipertensi Mengintai Gen <em>Z</em>.
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {name && step !== 'landing' && (
            <div className="topbar-user" id="topbar-user">
              <span className="avatar" id="topbar-avatar">{name.charAt(0).toUpperCase()}</span>
              <span id="topbar-name">{name}</span>
            </div>
          )}
        </div>
      </nav>

      {/* FLOATING SOURCE BUTTON */}
      <button
        onClick={() => navigate('/sources')}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          background: 'var(--red-600)',
          color: 'white',
          border: 'none',
          borderRadius: '50px',
          padding: '12px 20px',
          fontSize: '14px',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 4px 12px rgba(220, 38, 38, 0.4)',
          cursor: 'pointer',
          pointerEvents: 'auto',
          transition: 'transform 0.2s'
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
      >
        <i className="ti ti-book" style={{ pointerEvents: 'none' }}></i> Referensi Literatur
      </button>

      {/* PAGE: LANDING */}
      {step === 'landing' && (
        <div className="page active" id="pg-landing" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 'calc(100vh - 100px)' }}>
          <p className="eyebrow" style={{ fontSize: '13px', marginBottom: '16px' }}>Kelompok 5 Kelas B &middot; Blok 2.4 Etika &amp; Komunikasi</p>
          <h1 className="heading-xl" style={{ marginBottom: '40px' }}>
            Hipertensi Mengintai Gen <em onClick={() => setZCount(c => c + 1)}>Z</em>.
          </h1>

          <div className="input-group" style={{ marginTop: '0' }}>
            <label className="input-label" htmlFor="nameInput">Masukkan nama untuk memulai</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="input-row">
                <input
                  className="text-input"
                  id="nameInput"
                  type="text"
                  placeholder="Nama lengkap..."
                  maxLength={60}
                  autoComplete="off"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <button
                  className="btn btn-primary"
                  id="startBtn"
                  onClick={handleStart}
                  disabled={loading}
                >
                  {loading ? 'Memproses...' : 'Mulai'} <i className="ti ti-arrow-right"></i>
                </button>
              </div>
              
              <div className="consent-checkbox-wrap" onClick={() => setAgreed(!agreed)}>
                <div className={`custom-checkbox ${agreed ? 'checked' : ''}`}>
                  {agreed && <i className="ti ti-check" style={{ fontSize: '12px', fontWeight: 'bold' }}></i>}
                </div>
                <span className="consent-text">
                  Saya bersedia mengisi nama dan bersedia data pengerjaan kuis saya dikumpulkan secara anonim untuk keperluan edukasi kelompok dan penelitian Blok 2.4.
                </span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 'auto', paddingTop: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <p className="footer-note" style={{ margin: 0 }}>
              Kelompok 5 Kelas B &middot; FK Unsoed
            </p>
          </div>
        </div>
      )}

      {/* PAGE: PRETEST */}
      {step === 'pretest' && (
        <div className="page active" id="pg-pretest">
          <p className="eyebrow">Langkah 1 dari 4</p>
          <h2 className="heading-lg">Pretest</h2>
          <p className="body-lg" style={{ marginBottom: '24px' }}>Jawab 10 soal untuk mengukur pengetahuan awalmu tentang hipertensi.</p>
          
          <div className="progress">
            <div className="progress-header">
              <span className="progress-label">Soal {preCur + 1}</span>
              <span className="progress-count">{preCur + 1} / 10</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${((preCur + 1) / 10) * 100}%` }}></div>
            </div>
          </div>

          <p className="quiz-question">{PRETEST[preCur].q}</p>
          
          <div className="quiz-options">
            {['A', 'B', 'C', 'D'].map((lbl, idx) => {
              const optText = PRETEST[preCur].opts[idx];
              return (
                <button
                  key={idx}
                  className="opt"
                  onClick={() => handlePreSelect(idx)}
                >
                  <span className="opt-lbl">{lbl}</span>
                  <span className="opt-text">{optText}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* PAGE: EDUCATION */}
      {step === 'edu' && (
        <div className="page active" id="pg-edu">
          <p className="eyebrow">Langkah 2 dari 4</p>
          <h2 className="heading-lg">Materi Edukasi</h2>
          <p className="body-lg" style={{ marginBottom: '24px' }}>Pelajari seluruh materi sebelum mengerjakan posttest.</p>

          <div className="progress">
            <div className="progress-header">
              <span className="progress-label">Materi</span>
              <span className="progress-count">{eduCur + 1} / 5</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${((eduCur + 1) / 5) * 100}%` }}></div>
            </div>
          </div>

          <div id="edu-content">
            <div className="edu-card">
              <div className="edu-card-header">
                <div className="icon-circle"><i className={`ti ${EDU_MATERIALS[eduCur].icon}`}></i></div>
                <div className="header-text">
                  <div className="header-title">{EDU_MATERIALS[eduCur].title}</div>
                  <div className="header-sub">{EDU_MATERIALS[eduCur].sub}</div>
                </div>
              </div>
              <div className="edu-card-body" dangerouslySetInnerHTML={{ __html: EDU_MATERIALS[eduCur].html }} />
            </div>
          </div>

          <div className="edu-nav">
            {eduCur > 0 && (
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setEduCur(eduCur - 1)}>
                <i className="ti ti-arrow-left"></i> Sebelumnya
              </button>
            )}
            <button
              className="btn btn-primary"
              style={{ flex: eduCur > 0 ? 2 : 1 }}
              onClick={() => {
                if (eduCur < EDU_MATERIALS.length - 1) {
                  setEduCur(eduCur + 1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                  setStep('posttest');
                  setPostCur(0);
                  setPostAnswers([]);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
            >
              {eduCur < EDU_MATERIALS.length - 1 ? (
                <>Materi Berikutnya <i className="ti ti-arrow-right"></i></>
              ) : (
                <>Mulai Posttest <i className="ti ti-arrow-right"></i></>
              )}
            </button>
          </div>

          <div className="edu-dots">
            {EDU_MATERIALS.map((_, idx) => (
              <button
                key={idx}
                className={`edu-dot ${idx === eduCur ? 'active' : 'off'}`}
                aria-label={`Materi ${idx + 1}`}
                onClick={() => {
                  setEduCur(idx);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              ></button>
            ))}
          </div>
        </div>
      )}

      {/* PAGE: POSTTEST */}
      {step === 'posttest' && (
        <div className="page active" id="pg-posttest">
          <p className="eyebrow">Langkah 3 dari 4</p>
          <h2 className="heading-lg">Posttest</h2>
          <p className="body-lg" style={{ marginBottom: '24px' }}>Uji pemahamanmu setelah mempelajari seluruh materi.</p>
          
          <div className="progress">
            <div className="progress-header">
              <span className="progress-label">Soal {postCur + 1}</span>
              <span className="progress-count">{postCur + 1} / 10</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${((postCur + 1) / 10) * 100}%` }}></div>
            </div>
          </div>

          <p className="quiz-question">{POSTTEST[postCur].q}</p>
          
          <div className="quiz-options">
            {['A', 'B', 'C', 'D'].map((lbl, idx) => {
              const optText = POSTTEST[postCur].opts[idx];
              return (
                <button
                  key={idx}
                  className="opt"
                  onClick={() => handlePostSelect(idx)}
                >
                  <span className="opt-lbl">{lbl}</span>
                  <span className="opt-text">{optText}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* PAGE: RESULT */}
      {step === 'result' && (
        <div className="page active" id="pg-result">
          <p className="eyebrow">Langkah 4 dari 4</p>
          <h2 className="heading-lg">Selamat, {name}!</h2>
          <p className="body-lg" style={{ marginBottom: '28px' }}>
            Kamu telah menyelesaikan seluruh program edukasi <strong>#HT_GEN_Z</strong>.
          </p>

          <div className="score-grid">
            <div className="score-card">
              <div className="score-value">{Math.round((preScore / 10) * 100)}%</div>
              <div className="score-label">Pretest</div>
              <div className="score-sub">{preScore}/10 benar</div>
            </div>
            <div className="score-card">
              <div className="score-value">{Math.round((postScore / 10) * 100)}%</div>
              <div className="score-label">Posttest</div>
              <div className="score-sub">{postScore}/10 benar</div>
            </div>
            <div className="score-card highlight">
              <div className="score-value">
                +{Math.max(0, Math.round((postScore / 10) * 100) - Math.round((preScore / 10) * 100))}%
              </div>
              <div className="score-label">Peningkatan</div>
              <div className="score-sub">dari pretest</div>
            </div>
          </div>

          <div className="comparison-card">
            <p className="eyebrow" style={{ marginBottom: '14px' }}>Perbandingan Visual</p>
            <div className="bar-row">
              <div className="bar-header">
                <span>Pretest</span>
                <span>{Math.round((preScore / 10) * 100)}%</span>
              </div>
              <div className="bar-track">
                <div className="bar-fill" style={{ background: 'var(--red-300)', width: `${(preScore / 10) * 100}%` }}></div>
              </div>
            </div>
            <div className="bar-row">
              <div className="bar-header">
                <span>Posttest</span>
                <span>{Math.round((postScore / 10) * 100)}%</span>
              </div>
              <div className="bar-track">
                <div className="bar-fill" style={{ background: 'linear-gradient(90deg, var(--red-400), var(--red-600))', width: `${(postScore / 10) * 100}%` }}></div>
              </div>
            </div>
          </div>

          <div className="motivational">
            {postScore >= 8 ? (
              <p>
                <strong>Luar biasa!</strong> Pemahaman kamu tentang hipertensi dan faktor risikonya sangat baik. Tetap pertahankan gaya hidup sehat!
              </p>
            ) : postScore >= 6 ? (
              <p>
                <strong>Bagus!</strong> Pemahaman kamu sudah cukup baik. Ingat untuk membatasi konsumsi garam dan gorengan serta tidur cukup.
              </p>
            ) : (
              <p>
                <strong>Tetap semangat!</strong> Pengetahuan adalah langkah awal. Luangkan waktu untuk mengulas materi kembali dan kurangi begadang.
              </p>
            )}
          </div>

          <div className="cert-preview">
            <div className="cert-icon-wrap"><i className="ti ti-certificate"></i></div>
            <h3 className="cert-title">Sertifikat Penyelesaian</h3>
            <p className="cert-desc">
              Unduh sertifikat atas nama <strong>{name}</strong> yang memuat nilai pretest, posttest, dan persentase peningkatan pemahamanmu.
            </p>
            <div className="cert-actions">
              <button className="btn btn-primary" style={{ padding: '14px 32px' }} onClick={downloadCert}>
                <i className="ti ti-download"></i> Unduh Sertifikat (.png)
              </button>
              {certDownloaded && (
                <div className="cert-done" style={{ display: 'flex' }}>
                  <i className="ti ti-circle-check"></i> Sertifikat berhasil diunduh
                </div>
              )}
            </div>
          </div>

          {/* REVIEW JAWABAN POSTTEST */}
          <div className="review-section" style={{ marginTop: '36px', marginBottom: '24px', textAlign: 'left' }}>
            <h3 className="heading-md" style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="ti ti-list-check" style={{ color: 'var(--red-650)', fontSize: '20px' }}></i> Review Jawaban Posttest
            </h3>
            <p className="body-sm" style={{ marginBottom: '18px' }}>
              Berikut adalah pembahasan lengkap untuk masing-masing soal posttest yang telah kamu kerjakan:
            </p>
            
            {POSTTEST.map((qItem, idx) => {
              const userAns = postAnswers[idx];
              const isCorrect = userAns?.ok;
              return (
                <div 
                  key={idx} 
                  style={{
                    background: 'var(--surface)',
                    border: `1.5px solid ${isCorrect ? 'var(--green-500)' : 'var(--red-400)'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '20px',
                    marginBottom: '16px',
                    boxShadow: 'var(--shadow-sm)',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-tertiary)' }}>SOAL {idx + 1}</span>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: '700',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)',
                      background: isCorrect ? 'var(--green-100)' : 'var(--red-100)',
                      color: isCorrect ? 'var(--green-800)' : 'var(--red-800)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      {isCorrect ? (
                        <><i className="ti ti-check" style={{ fontSize: '12px' }}></i> Benar</>
                      ) : (
                        <><i className="ti ti-x" style={{ fontSize: '12px' }}></i> Salah</>
                      )}
                    </span>
                  </div>
                  
                  <p className="quiz-question" style={{ marginBottom: '16px', fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)' }}>
                    {qItem.q}
                  </p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {qItem.opts.map((optText, oIdx) => {
                      const isUserSelected = userAns?.sel === oIdx;
                      const isAnswerKey = qItem.ans === oIdx;
                      
                      let optBg = 'var(--surface)';
                      let optBorder = 'var(--border)';
                      let optColor = 'var(--text-primary)';
                      let optWeight = 'normal';
                      
                      if (isAnswerKey) {
                        optBg = 'var(--green-50)';
                        optBorder = 'var(--green-500)';
                        optColor = 'var(--green-800)';
                        optWeight = '600';
                      } else if (isUserSelected && !isAnswerKey) {
                        optBg = 'var(--red-50)';
                        optBorder = 'var(--red-500)';
                        optColor = 'var(--red-800)';
                      }
                      
                      return (
                        <div 
                          key={oIdx} 
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px 14px',
                            borderRadius: 'var(--radius-sm)',
                            border: `1.5px solid ${optBorder}`,
                            background: optBg,
                            color: optColor,
                            fontWeight: optWeight,
                            fontSize: '13.5px'
                          }}
                        >
                          <span style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '11px',
                            fontWeight: '700',
                            background: isAnswerKey ? 'var(--green-500)' : (isUserSelected ? 'var(--red-500)' : 'var(--bg2)'),
                            color: (isAnswerKey || isUserSelected) ? 'white' : 'var(--text-tertiary)',
                            flexShrink: 0
                          }}>
                            {['A', 'B', 'C', 'D'][oIdx]}
                          </span>
                          <span style={{ flex: 1 }}>{optText}</span>
                          {isAnswerKey && (
                            <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--green-600)', background: 'var(--green-100)', padding: '2px 8px', borderRadius: '4px' }}>
                              Kunci Jawaban
                            </span>
                          )}
                          {isUserSelected && !isAnswerKey && (
                            <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--red-600)', background: 'var(--red-100)', padding: '2px 8px', borderRadius: '4px' }}>
                              Pilihanmu
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="explanation-box" style={{
                    marginTop: '16px',
                    padding: '14px 16px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg2)',
                    borderLeft: '3px solid var(--red-500)',
                    fontSize: '13px',
                    lineHeight: '1.6',
                    color: 'var(--text-secondary)'
                  }}>
                    <span style={{ display: 'block', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--red-800)', marginBottom: '6px', letterSpacing: '0.04em' }}>
                      <i className="ti ti-info-circle"></i> Pembahasan:
                    </span>
                    {qItem.exp}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="result-actions">
            <button className="btn btn-ghost" onClick={() => { setStep('edu'); setEduCur(0); }}>
              <i className="ti ti-book"></i> Ulang Materi
            </button>
            <button className="btn btn-ghost" onClick={resetAll}>
              <i className="ti ti-refresh"></i> Mulai Ulang
            </button>
          </div>

          <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <p className="footer-note" style={{ margin: 0 }}>
              Kelompok 5 Kelas B &middot; Blok 2.4 Etika dan Komunikasi &middot; FK Unsoed &middot; T.A. 2025/2026
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// --- HIDDEN ADMIN DASHBOARD ---
function AdminDashboard() {
  const [auth, setAuth] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('hipertensi_logs')
        .select('*')
        .order('consented_at', { ascending: false });

      if (error) throw error;
      setLogs(data || []);
    } catch (e) {
      console.error('Gagal mengambil logs:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth) {
      fetchLogs();
    }
  }, [auth]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (passcode === 'fk2026' || passcode === 'admin123') {
      setAuth(true);
    } else {
      setErrorMsg('Passcode salah!');
    }
  };

  if (!auth) {
    return (
      <div className="min-h-screen" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', background: 'var(--bg)' }}>
        <div style={{ background: 'var(--surface)', padding: '32px', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)', width: '100%', maxWidth: '360px', textAlign: 'center' }}>
          <i className="ti ti-shield-lock" style={{ fontSize: '48px', color: 'var(--red-600)', marginBottom: '16px', display: 'inline-block' }}></i>
          <h2 className="heading-md" style={{ marginBottom: '8px' }}>Admin Access</h2>
          <p className="body-sm" style={{ marginBottom: '24px' }}>Masukkan passcode untuk melanjutkan</p>
          <form onSubmit={handleLogin}>
            <input 
              type="password" 
              className="text-input" 
              placeholder="Passcode..." 
              value={passcode} 
              onChange={(e) => { setPasscode(e.target.value); setErrorMsg(''); }}
              autoFocus
              style={{ marginBottom: '12px' }}
            />
            {errorMsg && <p style={{ color: 'var(--red-600)', fontSize: '13px', marginBottom: '12px', fontWeight: 'bold' }}>{errorMsg}</p>}
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>Buka Kunci</button>
          </form>
          <div style={{ marginTop: '24px' }}>
             <a href="/" style={{ color: 'var(--text-tertiary)', fontSize: '13px', textDecoration: 'none', display: 'inline-block', padding: '8px' }}>&larr; Kembali ke Beranda</a>
          </div>
        </div>
      </div>
    );
  }

  const handleDeleteAll = async () => {
    if (!confirm('Apakah Anda yakin ingin menghapus semua data peserta? Tindakan ini tidak bisa dibatalkan.')) return;
    try {
      const { error } = await supabase
        .from('hipertensi_logs')
        .delete()
        .not('id', 'is', null);

      if (error) throw error;
      fetchLogs();
    } catch (e) {
      console.error(e);
      alert('Gagal menghapus data.');
    }
  };

  const handleDeleteOne = async (id) => {
    if (!confirm('Hapus data peserta ini?')) return;
    try {
      const { error } = await supabase
        .from('hipertensi_logs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchLogs();
    } catch (e) {
      console.error(e);
      alert('Gagal menghapus data.');
    }
  };

  const downloadCSV = () => {
    if (logs.length === 0) return;
    const headers = ['Nama Peserta', 'Tanggal Masuk', 'Skor Posttest (%)'];
    const rows = logs.map(l => [
      l.name,
      new Date(l.consented_at).toLocaleString('id-ID'),
      l.progress_score
    ]);
    
    // Create CSV string with BOM for Excel compatibility
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.map(val => `"${val.toString().replace(/"/g, '""')}"`).join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Data_Peserta_HipertensiGenZ_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const averageScore = logs.length > 0 
    ? (logs.reduce((acc, curr) => acc + (curr.progress_score || 0), 0) / logs.length).toFixed(1)
    : 0;

  const filteredLogs = logs.filter(l => 
    l.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6 sm:p-12 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between border-b pb-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">HT_GEN_Z Admin</h1>
            <p className="text-sm text-slate-500 mt-1 font-mono">Database Pengumpulan Data Edukasi</p>
          </div>
          <button 
            onClick={() => window.location.href = '/'}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-semibold text-slate-600 bg-white hover:bg-slate-50 transition-colors"
          >
            <i className="ti ti-arrow-left"></i> Kembali ke Web
          </button>
        </div>

        {/* Stats Panel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Responden</span>
            <span className="text-4xl font-extrabold text-slate-900 mt-2">{logs.length}</span>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rata-Rata Skor Posttest</span>
            <span className="text-4xl font-extrabold text-red-600 mt-2">{averageScore}%</span>
          </div>
          <button 
            onClick={downloadCSV}
            disabled={logs.length === 0}
            className="bg-emerald-50 hover:bg-emerald-100 disabled:bg-slate-100 disabled:text-slate-400 text-emerald-700 font-bold p-6 rounded-xl border border-emerald-200 flex flex-col justify-center items-center gap-2 transition-all cursor-pointer"
          >
            <i className="ti ti-download" style={{ fontSize: '24px' }}></i> UNDUH EXCEL/CSV
          </button>
          <button 
            onClick={handleDeleteAll} 
            disabled={logs.length === 0}
            className="bg-red-50 hover:bg-red-100 disabled:bg-slate-100 disabled:text-slate-400 text-red-700 font-bold p-6 rounded-xl border border-red-200 flex flex-col justify-center items-center gap-2 transition-all cursor-pointer"
          >
            <i className="ti ti-trash" style={{ fontSize: '24px' }}></i> HAPUS SEMUA DATA
          </button>
        </div>

        {/* Database Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between sm:items-center">
            <span className="text-sm font-bold text-slate-700">Daftar Data Terkumpul ({filteredLogs.length} dari {logs.length})</span>
            
            <div className="flex items-center gap-3">
              {/* Search Bar */}
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <i className="ti ti-search" style={{ position: 'absolute', left: '10px', color: '#94a3b8', fontSize: '14px' }}></i>
                <input
                  type="text"
                  placeholder="Cari nama peserta..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    padding: '6px 12px 6px 30px',
                    fontSize: '13px',
                    borderRadius: '6px',
                    border: '1.5px solid #e2e8f0',
                    outline: 'none',
                    width: '200px'
                  }}
                />
                {searchTerm && (
                  <i 
                    className="ti ti-x" 
                    onClick={() => setSearchTerm('')}
                    style={{ position: 'absolute', right: '10px', color: '#94a3b8', cursor: 'pointer', fontSize: '12px' }}
                  ></i>
                )}
              </div>
              
              <button onClick={fetchLogs} className="text-xs font-bold text-red-600 hover:text-red-755 flex items-center gap-1 cursor-pointer bg-transparent border-none">
                <i className="ti ti-refresh"></i> Refresh
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-600 border-b">
                <tr>
                  <th className="px-6 py-4 font-semibold">Nama Peserta</th>
                  <th className="px-6 py-4 font-semibold">Tanggal Masuk</th>
                  <th className="px-6 py-4 font-semibold text-center">Skor Posttest</th>
                  <th className="px-6 py-4 font-semibold text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="text-center py-12 text-slate-400 font-mono">
                      Sedang memuat data...
                    </td>
                  </tr>
                ) : filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-12 text-slate-400 font-mono">
                      Tidak ada data yang cocok.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((l) => (
                    <tr key={l.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 font-bold text-slate-800">{l.name}</td>
                      <td className="px-6 py-4 text-slate-500 font-mono">
                        {new Date(l.consented_at).toLocaleString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="px-6 py-4 font-extrabold text-red-600 text-center font-mono">
                        {l.progress_score}%
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => handleDeleteOne(l.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-all bg-transparent border-none cursor-pointer"
                          title="Hapus baris ini"
                        >
                          <i className="ti ti-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
}

// --- NEW ROUTE: SOURCES PAGE ---
function SourcesPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)', padding: '40px 24px' }}>
      <div style={{ maxWidth: '660px', margin: '0 auto', background: 'var(--surface)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-xl)', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--red-50)' }}>
          <button 
            className="btn btn-ghost" 
            style={{ padding: '8px 12px', fontSize: '14px', marginRight: 'auto' }} 
            onClick={() => navigate('/')}
          >
            <i className="ti ti-arrow-left"></i> Kembali
          </button>
          <h1 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--red-800)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="ti ti-book"></i> Daftar Sumber
          </h1>
        </div>
        <div style={{ padding: '24px' }}>
          <p className="body-sm" style={{marginBottom: '20px'}}>Berikut adalah referensi literatur medis dan pedoman klinis yang mendukung klaim faktual dalam edukasi #HT_GEN_Z.</p>
          {SOURCES.map((src, i) => (
            <div key={i} className="source-item" style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px dashed var(--border)' }}>
              <div className="source-cluster" style={{ fontSize: '13px', fontWeight: '700', color: 'var(--red-600)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>{src.cluster}</div>
              <div className="source-claim" style={{ fontSize: '14.5px', fontWeight: '500', color: 'var(--text-primary)', lineHeight: 1.5, marginBottom: '8px' }}>{src.claim}</div>
              <div className="source-refs" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {src.refs.map((r, ri) => (
                  <div key={ri} className="source-ref" style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.5, background: 'var(--surface)', padding: '8px 12px', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--red-300)', border: '1px solid var(--border)', borderLeftWidth: '3px' }}>
                    <i className="ti ti-quote" style={{ marginRight: '6px', color: 'var(--slate-400)' }}></i>
                    {r}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- ROUTER ---
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainApp />} />
        <Route path="/sources" element={<SourcesPage />} />
        <Route path="/dashboard-admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
