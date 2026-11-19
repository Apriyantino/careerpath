const questions = [
  {
    text: "Aktivitas mana yang paling membuatmu tertarik?",
    options: [
      { text: "Mencari tahu cara kerja teknologi atau membuat sesuatu dengan komputer", type: "technology" },
      { text: "Mengatur kegiatan, menawarkan ide, atau mencoba berjualan", type: "business" },
      { text: "Menggambar, membuat video, menulis, atau berkarya", type: "creative" },
      { text: "Membantu orang belajar atau menjaga kesehatan", type: "people" }
    ]
  },
  {
    text: "Ketika mengerjakan proyek kelompok, peran apa yang biasanya kamu sukai?",
    options: [
      { text: "Mencari solusi dan menyelesaikan masalah teknis", type: "technology" },
      { text: "Menyusun rencana dan membagi tugas", type: "business" },
      { text: "Membuat konsep dan tampilan yang menarik", type: "creative" },
      { text: "Memastikan semua anggota merasa didengar dan terbantu", type: "people" }
    ]
  },
  {
    text: "Proyek mana yang paling ingin kamu coba?",
    options: [
      { text: "Membuat situs web atau aplikasi sederhana", type: "technology" },
      { text: "Merancang ide usaha kecil dan mempromosikannya", type: "business" },
      { text: "Membuat identitas visual atau konten kreatif", type: "creative" },
      { text: "Membuat kegiatan edukasi atau sosial", type: "people" }
    ]
  }
];

const categoryInfo = {
  technology: {
    name: "Teknologi dan Komputasi",
    careers: "Web Developer, Programmer, Teknisi Komputer, Analis Data pemula",
    next: "Coba belajar HTML, CSS, atau logika pemrograman dan buat proyek kecil."
  },
  business: {
    name: "Bisnis dan Manajemen",
    careers: "Wirausaha, Staf Pemasaran, Administrasi Bisnis, Pengelola Toko Online",
    next: "Pelajari dasar pengelolaan usaha, komunikasi, dan pencatatan keuangan."
  },
  creative: {
    name: "Kreativitas dan Desain",
    careers: "Graphic Designer, Ilustrator, Content Creator, Fotografer",
    next: "Buat karya sederhana dan kumpulkan hasilnya menjadi portofolio."
  },
  people: {
    name: "Pelayanan dan Pengembangan Manusia",
    careers: "Pendidik, Pekerja Sosial, Konselor (dengan pendidikan yang sesuai), Tenaga Kesehatan",
    next: "Cari tahu jalur pendidikan profesi dan coba kegiatan sukarela atau edukasi."
  }
};

let currentQuestion = 0;
let scores = { technology: 0, business: 0, creative: 0, people: 0 };

const questionArea = document.getElementById("question");
const resultArea = document.getElementById("result");
const progressLabel = document.getElementById("quiz-progress");
const progressBar = document.getElementById("progress-bar");

document.getElementById("start-button").addEventListener("click", startTest);

function startTest() {
  currentQuestion = 0;
  scores = { technology: 0, business: 0, creative: 0, people: 0 };
  resultArea.innerHTML = "";
  showQuestion();
}

function showQuestion() {
  const question = questions[currentQuestion];
  progressLabel.textContent = `Pertanyaan ${currentQuestion + 1} dari ${questions.length}`;
  progressBar.style.width = `${(currentQuestion / questions.length) * 100}%`;

  questionArea.innerHTML = `
    <h3>${question.text}</h3>
    <div class="answer-list"></div>
  `;

  const answerList = questionArea.querySelector(".answer-list");
  question.options.forEach((option) => {
    const button = document.createElement("button");
    button.className = "answer-button";
    button.type = "button";
    button.textContent = option.text;
    button.addEventListener("click", () => chooseAnswer(option.type));
    answerList.appendChild(button);
  });
}

function chooseAnswer(type) {
  scores[type] += 1;
  currentQuestion += 1;

  if (currentQuestion < questions.length) {
    showQuestion();
  } else {
    showResult();
  }
}

function showResult() {
  progressLabel.textContent = "Tes selesai";
  progressBar.style.width = "100%";

  const ranked = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const topCategories = ranked.filter((item) => item[1] === ranked[0][1]);
  const descriptions = topCategories.map(([key]) => {
    const info = categoryInfo[key];
    return `<div class="result-category">
      <h3>${info.name}</h3>
      <p><strong>Contoh profesi:</strong> ${info.careers}.</p>
      <p><strong>Langkah awal:</strong> ${info.next}</p>
    </div>`;
  }).join("");

  questionArea.innerHTML = "<h3>Terima kasih sudah mengisi tes!</h3>";
  resultArea.innerHTML = `
    <h3>Bidang yang bisa kamu eksplorasi</h3>
    <p>Berdasarkan jawabanmu, bidang berikut memperoleh skor tertinggi. Jika ada beberapa bidang dengan skor sama, semuanya ditampilkan.</p>
    ${descriptions}
    <p>Gunakan hasil ini sebagai bahan eksplorasi, bukan sebagai batas pilihan masa depanmu.</p>
    <button class="button" id="retry-button" type="button">Ulangi Tes</button>
  `;
  document.getElementById("retry-button").addEventListener("click", startTest);
}

// Simpan progres roadmap pada browser yang sedang digunakan.
const roadmapTasks = Array.from(document.querySelectorAll(".roadmap-task"));
const savedTasks = JSON.parse(localStorage.getItem("careerpath-roadmap") || "[]");

roadmapTasks.forEach((task, index) => {
  task.checked = Boolean(savedTasks[index]);
  task.addEventListener("change", updateRoadmap);
});

function updateRoadmap() {
  const completed = roadmapTasks.map((task) => task.checked);
  localStorage.setItem("careerpath-roadmap", JSON.stringify(completed));

  const count = completed.filter(Boolean).length;
  const percent = Math.round((count / roadmapTasks.length) * 100);

  document.getElementById("roadmap-count").textContent =
    `${count} dari ${roadmapTasks.length} langkah selesai`;
  document.getElementById("roadmap-percent").textContent = `${percent}%`;
  document.getElementById("roadmap-bar").style.width = `${percent}%`;
}

updateRoadmap();
