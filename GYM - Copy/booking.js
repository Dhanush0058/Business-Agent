// CKO Kickboxing Booking and Scheduling System

// Simulated Database of Classes & Slots
const instructors = ["Jessica R.", "Mike T.", "Sarah M.", "David K.", "Alex P."];
const classTypes = [
  { name: "CKO Signature Kickboxing", desc: "Our signature 45-minute full body bag workout.", difficulty: "All Levels" },
  { name: "HIIT Fit Bag Blast", desc: "High-intensity intervals mixed with heavy bag work.", difficulty: "Intermediate" },
  { name: "Cardio Kickboxing & Core", desc: "Cardio-intensive bag routines combined with core focus.", difficulty: "All Levels" },
  { name: "Power Bag & Strength", desc: "Strength training exercises combined with heavy bag power rounds.", difficulty: "Advanced" }
];

// Generate dynamic classes for the next 7 days starting from today
function generateMockClasses() {
  const mockClasses = [];
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const times = [
    { hour: "06:00 AM", period: "Morning" },
    { hour: "08:30 AM", period: "Morning" },
    { hour: "12:00 PM", period: "Midday" },
    { hour: "05:30 PM", period: "Evening" },
    { hour: "07:00 PM", period: "Evening" }
  ];

  for (let i = 0; i < 7; i++) {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + i);
    const dayName = daysOfWeek[targetDate.getDay()];
    const dateStr = targetDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });

    // Generate 4-5 slots per day
    times.forEach((t, idx) => {
      // Rotate instructors and class types based on math to vary them
      const inst = instructors[(i + idx) % instructors.length];
      const type = classTypes[(i * 2 + idx) % classTypes.length];

      // Determine dynamic spots left
      const totalBags = 30;
      let bagsLeft = 30;
      const seed = (i + idx * 7) % 7;
      if (seed === 0) {
        bagsLeft = 0; // FULL
      } else if (seed === 1) {
        bagsLeft = 3; // Filling fast
      } else {
        bagsLeft = 10 + (seed * 3);
      }

      mockClasses.push({
        id: `class-${i}-${idx}`,
        dayIndex: i,
        dayName: dayName,
        dateStr: dateStr,
        fullDate: targetDate.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        time: t.hour,
        period: t.period,
        instructor: inst,
        className: type.name,
        classDesc: type.desc,
        difficulty: type.difficulty,
        totalBags: totalBags,
        bagsLeft: bagsLeft
      });
    });
  }
  return mockClasses;
}

const scheduleData = generateMockClasses();
let activeDayIndex = 0;
let selectedClassId = null;

// Initialize the Scheduler UI
function initScheduler() {
  const tabsContainer = document.getElementById("day-tabs");
  const slotsContainer = document.getElementById("schedule-slots");

  if (!tabsContainer || !slotsContainer) return;

  // 1. Check for ZIP code / City in URL parameters to simulate studio matching
  const urlParams = new URLSearchParams(window.location.search);
  const zipQuery = urlParams.get("zip");
  if (zipQuery) {
    handleZipRouting(zipQuery);
  }

  // 2. Populate Filter Select Elements (run once)
  populateFilters();

  // 3. Render Day Tabs (run once, will re-render just tabs on click)
  renderTabs();

  // 4. Render initial slots
  renderSlots();

  // 5. Add event listeners to filter elements (attached only once)
  const typeFilter = document.getElementById("filter-class-type");
  const instFilter = document.getElementById("filter-instructor");
  const timeFilter = document.getElementById("filter-time");

  if (typeFilter) typeFilter.addEventListener("change", renderSlots);
  if (instFilter) instFilter.addEventListener("change", renderSlots);
  if (timeFilter) timeFilter.addEventListener("change", renderSlots);
}

// Separate day tab rendering to update visual state without duplication
function renderTabs() {
  const tabsContainer = document.getElementById("day-tabs");
  if (!tabsContainer) return;

  tabsContainer.innerHTML = "";
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  for (let i = 0; i < 7; i++) {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + i);
    const dayName = i === 0 ? "Today" : daysOfWeek[targetDate.getDay()].substring(0, 3);
    const dateNum = targetDate.getDate();

    const tabBtn = document.createElement("button");
    tabBtn.type = "button";
    tabBtn.className = `flex flex-col items-center justify-center py-3 px-4 border rounded-sm transition-all focus:outline-none ${i === activeDayIndex
      ? "bg-accent border-accent text-black font-semibold shadow-lg shadow-[#fec400]/10 scale-105"
      : "bg-[#0c0c0c] border-white/10 text-gray-400 hover:border-white/20 hover:text-white"
      }`;
    tabBtn.innerHTML = `
      <span class="text-xs uppercase tracking-wider">${dayName}</span>
      <span class="text-lg font-heading font-bold mt-1">${dateNum}</span>
    `;
    tabBtn.addEventListener("click", () => {
      activeDayIndex = i;
      renderTabs();
      renderSlots();
    });
    tabsContainer.appendChild(tabBtn);
  }
}

// Handle routing simulation and matching for zip code searches
function handleZipRouting(zip) {
  let matchedStudio = "CKO Downtown Studio";
  const num = parseInt(zip);

  if (!isNaN(num)) {
    if (num % 3 === 1) {
      matchedStudio = "CKO Northside Studio";
    } else if (num % 3 === 2) {
      matchedStudio = "CKO Westside Studio";
    }
  } else if (zip.toLowerCase().includes("north") || zip.toLowerCase().includes("side")) {
    matchedStudio = "CKO Northside Studio";
  } else if (zip.toLowerCase().includes("west") || zip.toLowerCase().includes("east")) {
    matchedStudio = "CKO Westside Studio";
  }

  // Pre-select location in modal dropdown on load
  const selectEl = document.getElementById("studio-select");
  if (selectEl) {
    selectEl.value = matchedStudio;
  }

  // Create a beautiful premium matching banner above schedule
  const slotsContainer = document.getElementById("schedule-slots");
  if (slotsContainer) {
    const banner = document.createElement("div");
    banner.className = "mb-6 p-4 bg-accent/5 border border-accent/20 text-sm text-gray-300 rounded-sm flex items-center justify-between";
    banner.innerHTML = `
      <div class="flex items-center gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-accent"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
        <span>Displaying classes for <strong class="text-white">${matchedStudio}</strong> near <strong class="text-accent">${zip}</strong></span>
      </div>
      <button onclick="this.parentElement.remove()" class="text-gray-500 hover:text-white text-xs uppercase tracking-wider">Dismiss</button>
    `;
    slotsContainer.parentNode.insertBefore(banner, slotsContainer);
  }
}

// Populate search and filters dropdowns dynamically
function populateFilters() {
  const typeFilter = document.getElementById("filter-class-type");
  const instFilter = document.getElementById("filter-instructor");


  if (typeFilter && typeFilter.options.length <= 1) {
    classTypes.forEach(t => {
      const opt = document.createElement("option");
      opt.value = t.name;
      opt.textContent = t.name;
      typeFilter.appendChild(opt);
    });
  }

  if (instFilter && instFilter.options.length <= 1) {
    instructors.forEach(inst => {
      const opt = document.createElement("option");
      opt.value = inst;
      opt.textContent = inst;
      instFilter.appendChild(opt);
    });
  }
}

// Render slots for active day and selected filters
function renderSlots() {
  const slotsContainer = document.getElementById("schedule-slots");
  if (!slotsContainer) return;

  const typeFilterVal = document.getElementById("filter-class-type")?.value || "all";
  const instFilterVal = document.getElementById("filter-instructor")?.value || "all";
  const timeFilterVal = document.getElementById("filter-time")?.value || "all";

  // Filter schedules
  const filtered = scheduleData.filter(item => {
    if (item.dayIndex !== activeDayIndex) return false;
    if (typeFilterVal !== "all" && item.className !== typeFilterVal) return false;
    if (instFilterVal !== "all" && item.instructor !== instFilterVal) return false;
    if (timeFilterVal !== "all" && item.period !== timeFilterVal) return false;
    return true;
  });

  slotsContainer.innerHTML = "";

  if (filtered.length === 0) {
    slotsContainer.innerHTML = `
      <div class="col-span-full py-16 text-center border border-white/5 bg-[#0a0a0a] rounded-sm">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calendar-x w-12 h-12 text-gray-600 mx-auto mb-4"><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M16 2v4"></path><path d="M3 10h18"></path><path d="m14 14-4 4"></path><path d="m10 14 4 4"></path><path d="M8 2v4"></path></svg>
        <h4 class="font-heading text-lg text-white uppercase tracking-wider mb-1">No Classes Found</h4>
        <p class="text-sm text-gray-500 font-light max-w-sm mx-auto">Try resetting or changing your filters to see classes available on this day.</p>
      </div>
    `;
    return;
  }

  filtered.forEach(item)=> {
    const isFull = item.bagsLeft === 0;
    const isFillingFast = item.bagsLeft > 0 && item.bagsLeft <= 4;

    let badgeHtml = "";
    if (isFull) {
      badgeHtml = `<span class="bg-red-500/10 text-red-400 border border-red-500/20 text-xs px-2.5 py-1 uppercase font-semibold rounded-sm">FULL</span>`;
    } else if (isFillingFast) {
      badgeHtml = `<span class="bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs px-2.5 py-1 uppercase font-semibold rounded-sm animate-pulse">Filling Fast (${item.bagsLeft} Bags Left)</span>`;
    } else {
      badgeHtml = `<span class="bg-[#fec400]/10 text-[#fec400] border border-[#fec400]/20 text-xs px-2.5 py-1 uppercase font-semibold rounded-sm">${item.bagsLeft} Bags Left</span>`;
    }

    const slotCard = document.createElement("div");
    slotCard.className = `group border p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all duration-300 ${isFull ? "border-white/5 bg-[#080808]/50 opacity-60" : "border-white/10 bg-[#0d0d0d] hover:border-accent/40"
      }`;

    slotCard.innerHTML = `
      <div class="flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
        <!-- Time block -->
        <div class="flex flex-row md:flex-col items-baseline md:items-start gap-2 shrink-0">
          <span class="font-heading text-2xl md:text-3xl font-bold tracking-tight text-white">${item.time.split(" ")[0]}</span>
          <span class="text-xs font-semibold uppercase tracking-wider text-accent">${item.time.split(" ")[1]}</span>
        </div>
        <!-- Divider -->
        <div class="hidden md:block w-px h-12 bg-white/10"></div>
        <!-- Class details -->
        <div>
          <div class="flex flex-wrap items-center gap-3 mb-2">
            <h4 class="font-heading text-lg md:text-xl font-semibold uppercase text-white tracking-wide">${item.className}</h4>
            <span class="bg-white/5 border border-white/10 text-gray-400 text-[10px] px-2 py-0.5 uppercase tracking-wider rounded-sm">${item.difficulty}</span>
            ${badgeHtml}
          </div>
          <p class="text-xs text-gray-500 font-light mb-2 max-w-xl">${item.classDesc}</p>
          <div class="flex items-center gap-2 text-xs font-medium text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-accent"><circle cx="12" cy="8" r="5"></circle><path d="M20 21a8 8 0 0 0-16 0"></path></svg>
            <span>Instructor: <strong class="text-white">${item.instructor}</strong></span>
          </div>
        </div>
      </div>
      <!-- Booking Button -->
      <div class="shrink-0 flex items-center">
        ${isFull
        ? `<button disabled class="w-full md:w-auto px-6 py-3 bg-white/5 border border-white/5 text-gray-600 text-xs font-semibold uppercase tracking-widest cursor-not-allowed rounded-sm">Waitlist Closed</button>`
        : `<button onclick="openBookingModal('${item.id}')" class="w-full md:w-auto px-6 py-3 bg-accent hover:bg-accent-hover text-black hover:text-black font-semibold text-xs uppercase tracking-widest transition-transform group-hover:scale-105 rounded-sm">Book Free Class</button>`
      }
      </div>
    `;
    slotsContainer.appendChild(slotCard);
  }
}

// Modal Toggle Helpers
function openBookingModal(classId) {
  selectedClassId = classId;
  const item = scheduleData.find(c => c.id === classId);
  if (!item) return;

  const modal = document.getElementById("booking-modal");
  const modalDetails = document.getElementById("modal-class-details");

  if (modalDetails) {
    modalDetails.innerHTML = `
      <div class="flex items-center gap-3 mb-2">
        <span class="text-xs font-semibold uppercase tracking-wider text-accent">${item.time}</span>
        <span class="text-xs text-gray-500">•</span>
        <span class="text-xs font-semibold uppercase text-gray-400">${item.fullDate}</span>
      </div>
      <h3 class="font-heading text-xl font-semibold uppercase text-white mb-1">${item.className}</h3>
      <div class="flex gap-4 text-xs text-gray-400">
        <span>Instructor: <strong class="text-white">${item.instructor}</strong></span>
        <span>Difficulty: <strong class="text-white">${item.difficulty}</strong></span>
      </div>
    `;
  }

  if (modal) {
    modal.classList.remove("hidden");
    document.body.classList.add("overflow-hidden");
  }
}

function closeBookingModal() {
  const modal = document.getElementById("booking-modal");
  if (modal) {
    modal.classList.add("hidden");
    document.body.classList.remove("overflow-hidden");
  }
  selectedClassId = null;
}

// Booking form submission handler
function handleBookingSubmit(event) {
  event.preventDefault();
  if (!selectedClassId) return;

  const selectedClass = scheduleData.find(c => c.id === selectedClassId);
  if (!selectedClass) return;

  const form = event.target;
  const name = form.elements["fullname"].value;
  const email = form.elements["email"].value;
  const phone = form.elements["phone"].value;
  const location = form.elements["studio-select"]?.value || "Downtown Studio";

  // Create booking object
  const booking = {
    bookingId: "CKO-" + Math.floor(100000 + Math.random() * 900000),
    className: selectedClass.className,
    classTime: selectedClass.time,
    classDate: selectedClass.fullDate,
    instructor: selectedClass.instructor,
    memberName: name,
    memberEmail: email,
    memberPhone: phone,
    studioLocation: location
  };

  // Save in local storage for details page reference
  localStorage.setItem("latestBooking", JSON.stringify(booking));

  // Close modal
  closeBookingModal();

  // Redirect to thank you page
  window.location.href = `thank-you.html`;
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  initScheduler();

  // Close modal when clicking outside content area
  const modal = document.getElementById("booking-modal");
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeBookingModal();
      }
    });
  }

  // Handle inquiry submission on Franchise Page
  const franchiseForm = document.getElementById("franchise-form");
  if (franchiseForm) {
    franchiseForm.addEventListener("submit", (e) => {
      e.preventDefault();
      // Store mock info
      const formData = {
        name: franchiseForm.elements["franchise-name"].value,
        email: franchiseForm.elements["franchise-email"].value,
        phone: franchiseForm.elements["franchise-phone"].value,
        city: franchiseForm.elements["franchise-city"].value,
        capital: franchiseForm.elements["franchise-capital"].value,
      };
      localStorage.setItem("franchiseInquiry", JSON.stringify(formData));

      // Simulate success and clear
      const formContainer = document.getElementById("form-container-card");
      if (formContainer) {
        formContainer.innerHTML = `
          <div class="text-center py-12 px-6">
            <div class="w-16 h-16 rounded-full bg-accent/10 border border-accent flex items-center justify-center text-accent mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>
            <h3 class="font-heading text-2xl uppercase font-semibold text-white mb-3">Application Received!</h3>
            <p class="text-gray-400 text-sm font-light leading-relaxed mb-6">Thank you, <strong>${formData.name}</strong>. A CKO Franchise Director will review your details and reach out to you at <strong>${formData.email}</strong> within 24-48 business hours.</p>
            <div class="h-px bg-white/10 my-6"></div>
            <a href="index.html" class="inline-block bg-accent hover:bg-accent-hover text-black px-8 py-3 uppercase text-xs font-semibold tracking-wider rounded-sm transition-all">Back to Home</a>
          </div>
        `;
      }
    });
  }
});
