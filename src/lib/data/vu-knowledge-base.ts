// src/lib/data/vu-knowledge-base.ts (UPDATED with accurate information)
// Victoria University Knowledge Base - Comprehensive and accurate data

export interface KnowledgeItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  keywords: string[];
  tags: string[];
}

export const VU_KNOWLEDGE_BASE: KnowledgeItem[] = [
  // CONTACT INFORMATION & ADDRESSES
  {
    id: "contact-001",
    category: "contact",
    question: "How can I contact Victoria University?",
    answer:
      "**Victoria University Main Contact Information:**\n\n**General Enquiries:**\n- **Phone:** +61 3 9919 6100\n- **Postal Address:** PO Box 14428, Melbourne VIC 8001\n- **Emergency (Security):** +61 3 9919 6666 (24/7)\n\n**VUHQ Student Service Centres:**\n- Your first point of contact for student assistance\n- Available at all campuses during business hours\n- **Virtual Queue:** Join online for phone callback\n- **Live Chat:** Available on VU website\n\n**International Student Enquiries:**\n- For overseas students wanting to study in Australia\n- Submit study enquiry online via VU website\n\n**Email Support:**\n- General enquiries through VU website contact forms\n- Specific department emails available on respective pages\n- Student portal (MyVU) for account-specific issues\n\n**Emergency Services:** Call 000 for police, fire, or ambulance\n**Crisis Support:** Lifeline 13 11 14, Kids Helpline 1800 55 1800 (under 25s)",
    keywords: [
      "contact",
      "phone",
      "address",
      "email",
      "emergency",
      "VUHQ",
      "support",
    ],
    tags: ["contact", "phone numbers", "addresses", "emergency"],
  },
  {
    id: "contact-002",
    category: "contact",
    question: "What is the address of Victoria University Sydney?",
    answer:
      "**VU Sydney Campus Address:**\n\n**Street Address:**\nGround Floor, 160-166 Sussex Street\nSydney NSW 2000\nAustralia\n\n**Contact Details:**\n- **Phone:** +61 2 8265 3222\n- **Fax:** +61 2 9283 3646\n- **Email (Applications):** [email protected]\n- **Email (Student Services):** [email protected]\n\n**Campus Hours:**\n- Monday to Friday: 8:30am - 5:30pm\n- Students not permitted on-site after closing time\n\n**Location Benefits:**\n- Heart of Sydney's Central Business District (CBD)\n- Short walk to Darling Harbour\n- Near Town Hall Station (train)\n- 7 levels of modern facilities\n- Close to cafes, restaurants, and attractions\n\n**Evening Support:**\n- iHelpers available Monday-Friday 5pm-7pm\n- Located at student services area on Level 1",
    keywords: [
      "Sydney",
      "address",
      "Sussex Street",
      "contact",
      "location",
      "CBD",
    ],
    tags: ["VU Sydney", "Sydney campus", "address", "contact"],
  },

  // CAMPUS LOCATIONS & ADDRESSES
  {
    id: "campus-001",
    category: "campus-locations",
    question: "Where are Victoria University campuses located?",
    answer:
      "**Victoria University Campus Locations:**\n\n**Melbourne Campuses:**\n\n**1. City Campus (VU City Tower)**\n- **Address:** 370 Little Lonsdale Street, Melbourne VIC 3000\n- **Second Building:** 295 Queen Street (Law School)\n- Features: 32-level sustainable tower, business and law programs\n- **Transport:** Heart of Melbourne CBD, all public transport options\n- **Parking:** No on-site parking, street parking available\n\n**2. Footscray Park Campus (Main Campus)**\n- **Location:** Footscray Park, next to Maribyrnong River\n- Largest campus with world-class sports science facilities\n- **Transport:** 10 minutes from Melbourne city by train\n- **Station:** Footscray Station + free shuttle bus OR 15-minute walk\n- **Parking:** Limited university parking + alternative options\n\n**3. Footscray Nicholson Campus**\n- Focus on TAFE courses, relaxed friendly environment\n\n**4. Sunshine Campus**\n- Building and construction trade courses\n- Fully equipped practical learning facilities\n\n**5. Werribee Campus**\n- Specialised teaching and research facilities\n- **VUHQ Hours:** Mon/Wed/Fri 9am-5pm, Tue/Thu 9am-4pm\n- **Location:** Building 1B, Level 1, Room 1B102\n\n**International Campuses:**\n- **VU Sydney:** 160-166 Sussex Street, Sydney NSW 2000\n- **VU Brisbane:** Available for international students",
    keywords: [
      "campus",
      "locations",
      "addresses",
      "Melbourne",
      "Footscray",
      "City",
      "Werribee",
      "Sunshine",
    ],
    tags: ["campuses", "locations", "addresses", "Melbourne"],
  },

  // VUHQ SERVICE CENTRES
  {
    id: "services-001",
    category: "student-services",
    question: "What is VUHQ and where can I find it?",
    answer:
      "**VUHQ (Victoria University Help Centre) - Your First Point of Contact**\n\n**What is VUHQ:**\n- Student service centres providing assistance, advice and support\n- Staffed by Student Advisors for personalized help\n- Available at all VU campuses\n\n**Services Provided:**\n- Course and unit selection advice\n- Enrollment and timetabling assistance\n- Fee inquiries and payment support\n- Academic guidance and support\n- Connecting you to specialized services\n- General university information\n\n**How to Access VUHQ:**\n\n**In-Person:**\n- Visit any campus VUHQ service centre\n- **Footscray Park Campus:** Standard business hours\n- **City Campus:** Monday-Friday 8:30am-5:30pm\n- **Werribee Campus:** Mon/Wed/Fri 9am-5pm, Tue/Thu 9am-4pm\n- **Note:** City Queen VUHQ has permanently closed - use City Campus VUHQ\n\n**Virtual Support:**\n- **Virtual Queue:** Join online queue for SMS callback\n- **Live Chat:** Available on VU website\n- **Phone Support:** During business hours\n- **Email:** Through VU contact forms\n\n**Available To:**\n- Current students (all inquiries)\n- Prospective students (course and enrollment information)\n- Anyone needing VU information and support",
    keywords: [
      "VUHQ",
      "student services",
      "help",
      "support",
      "advisors",
      "assistance",
    ],
    tags: ["VUHQ", "student services", "support", "help centre"],
  },

  // ACCURATE COURSE INFORMATION
  {
    id: "courses-001",
    category: "courses",
    question: "What courses are available at Victoria University Sydney?",
    answer:
      "**Victoria University Sydney Course Offerings:**\n\n**Undergraduate Programs:**\n- **Bachelor of Business**\n- **Bachelor of Early Childhood Education and Leadership**\n- **Bachelor of Information Technology**\n\n**Postgraduate Programs:**\n- **Master of Applied Information Technology**\n- **Master of Business Analytics**\n- **Master of Accounting**\n- **Master of Enterprise Resource Planning**\n- **Master of Supply Chain Management**\n- **Master of Early Childhood Education**\n\n**Diploma Programs:**\n- **Diploma of Information Technology**\n  - Duration: 1 year (2 semesters)\n  - Fee: AUD $14,900 per semester\n  - Course Code: VDIT\n  - CRICOS Code: 093392J\n  - 8 units, 96 credit points total\n\n**Learning Method:**\n- All courses use the **VU Block Model®**\n- **Undergraduate:** Study 1 subject over 4-week blocks\n- **Postgraduate:** Study 2 subjects over 8-week blocks\n- Smaller class sizes and focused learning\n- Strong industry connections and workplace learning\n\n**Graduate Support:**\n- Delivered in partnership with Education Centre of Australia (ECA)\n- Career workshops and job preparation\n- Work experience placements available\n- Industry networking opportunities",
    keywords: [
      "courses",
      "programs",
      "Sydney",
      "bachelor",
      "master",
      "diploma",
      "IT",
      "business",
      "education",
    ],
    tags: ["VU Sydney courses", "programs", "degrees", "VU Block Model"],
  },

  // ACCURATE FEES AND COSTS
  {
    id: "fees-001",
    category: "fees-scholarships",
    question: "What are the current fees at Victoria University Sydney?",
    answer:
      "**Victoria University Sydney Fees (2024-2025):**\n\n**Application Fee:**\n- **International Students:** AUD $75 per application\n- Required upfront when submitting application\n\n**Undergraduate Programs:**\n- **Average Annual Fee:** AUD $35,000 (first year)\n- **Bachelor of Business:** Check current rates on VU website\n- **Bachelor of Information Technology:** Check current rates\n- **Bachelor of Early Childhood Education:** Check current rates\n\n**Postgraduate Programs:**\n- **Average Annual Fee:** AUD $27,744 (first year)\n- **Master of Applied IT:** Verify current fee structure\n- **Master of Business Analytics:** 1.5-2 year duration\n- **Master of Accounting:** Professional accreditation included\n\n**Diploma Programs:**\n- **Diploma of Information Technology:** AUD $14,900 per semester\n\n**Payment Requirements:**\n- **International Students:** Fees paid upfront each semester\n- **Commencement Fee:** Required when accepting offer\n- **Payment Method:** Flywire payment system\n- **Materials Fees:** Additional costs may apply\n\n**Living Costs (Sydney - Government Estimates):**\n- **Minimum Annual Living Costs:** AUD $21,041 (required for visa)\n- **Accommodation:** AUD $350-370 per week (inner city)\n- **Food/Groceries:** AUD $80-200 per week\n- **Utilities:** AUD $20-50 per week\n\n**Important:** Fees subject to annual review. Confirm current rates on VU website or contact admissions.",
    keywords: [
      "fees",
      "tuition",
      "costs",
      "Sydney",
      "international",
      "payment",
      "living costs",
    ],
    tags: ["fees", "tuition", "costs", "Sydney", "payment"],
  },

  // ACCURATE ADMISSION INFORMATION
  {
    id: "admission-001",
    category: "admissions",
    question: "What are the admission requirements for Victoria University?",
    answer:
      "**Victoria University Admission Requirements:**\n\n**Recent School Leavers:**\n- **Australian:** Victorian Certificate of Education (VCE) or equivalent\n- **International:** International Baccalaureate (IB) or country equivalent\n- **ATAR Requirements:** Vary by course (check VTAC CourseSearch)\n- **Prerequisites:** Must meet specific course requirements\n\n**Mature Age Entry:**\n- **Certificate IV:** Tertiary Preparation or related discipline accepted\n- **Work Experience:** Considered for some courses\n- **Life Experience:** May qualify for certain programs\n- **No Formal Qualifications:** Some pathways available\n\n**University Transfer:**\n- **Completed Study:** 2-6 units depending on course\n- **Minimum Duration:** 6 months continuous study equivalent\n- **Credit Transfer:** Available for relevant previous study\n\n**VET Qualifications:**\n- **Diploma or Higher:** From Australian Registered Training Organisation\n- **Relevant Field:** Must align with chosen course\n\n**International Students:**\n- **English Requirements:** IELTS 6.5, TOEFL 79, PTE 58 (varies by course)\n- **Academic Qualifications:** Assessment of overseas qualifications\n- **Genuine Student:** Assessment for visa compliance\n- **Health Insurance:** OSHC required for duration of study\n\n**Special Entry:**\n- **SEAS (Special Entry Access Scheme):** For applicants with disadvantages\n- **Indigenous Programs:** Special pathways available\n- **Disability Support:** Accommodations available\n\n**Application Deadlines:**\n- **Vary by course and intake**\n- **VU Sydney Example:** Bachelor of Business - Sep 22, 2024\n- **Check specific program pages for exact dates**",
    keywords: [
      "admission",
      "requirements",
      "entry",
      "ATAR",
      "international",
      "English",
      "qualifications",
    ],
    tags: ["admissions", "requirements", "entry", "international students"],
  },

  // ACCURATE VU BLOCK MODEL INFORMATION
  {
    id: "teaching-001",
    category: "courses",
    question: "What is the VU Block Model and how does it work?",
    answer:
      "**VU Block Model® - Award-Winning Learning Approach**\n\n**What is the VU Block Model:**\n- Victoria University's innovative teaching method\n- **First Australian university** to deliver this model\n- Award-winning approach to higher education\n- Focus on **one subject at a time** instead of juggling multiple subjects\n\n**How It Works:**\n\n**Undergraduate Students:**\n- Study **1 subject over 4 weeks** (one block)\n- Complete one subject before starting the next\n- More intensive, focused learning experience\n\n**Postgraduate Students:**\n- Study **2 subjects over 8 weeks** (one block)\n- Balanced workload for advanced study\n- Allows for deeper specialization\n\n**Key Benefits:**\n- **Smaller Class Sizes:** More personalized attention\n- **Collaborative Learning:** Interactive, hands-on approach\n- **Industry Focus:** Real-world applications and connections\n- **Better Work-Life Balance:** Structured, manageable schedule\n- **Deeper Learning:** Intensive focus leads to better understanding\n- **Stronger Relationships:** Better connection with instructors and peers\n\n**Practical Advantages:**\n- **Scheduling:** Different from traditional semester system\n- **Assessment:** Concentrated evaluation periods\n- **Flexibility:** Easier to manage study commitments\n- **Support:** More targeted academic assistance\n\n**Available At:**\n- All VU campuses (Melbourne and Sydney)\n- Both undergraduate and postgraduate levels\n- TAFE to university pathway programs\n\n**Census Dates:** Different from traditional universities - check VU academic calendar for specific block dates and payment deadlines.",
    keywords: [
      "Block Model",
      "teaching",
      "learning",
      "innovative",
      "award-winning",
      "blocks",
      "intensive",
    ],
    tags: ["VU Block Model", "teaching method", "learning", "innovation"],
  },

  // COMPREHENSIVE STUDENT SERVICES
  {
    id: "services-002",
    category: "student-services",
    question: "What support services are available at Victoria University?",
    answer:
      "**Comprehensive Student Support Services at Victoria University:**\n\n**VUHQ (Primary Support Hub):**\n- First point of contact for all student needs\n- Academic advice and course guidance\n- Enrollment and administrative support\n- Fee assistance and payment plans\n- Referrals to specialized services\n\n**Academic Support:**\n- **Learning Hubs:** Collaborative study spaces with peer mentors\n- **Study Skills Workshops:** Academic writing, research, time management\n- **Peer Mentoring:** Support from successful VU students\n- **Individual Tutoring:** Subject-specific assistance\n- **Library Services:** Extensive online and physical resources\n\n**Student Wellbeing:**\n- **Counseling Services:** Professional mental health support\n- **Health Services:** On-campus health facilities\n- **Crisis Support:** 24/7 emergency assistance\n- **Wellbeing Programs:** Stress management and life skills\n\n**Financial Support:**\n- **Scholarships:** Merit and need-based awards\n- **Financial Counseling:** Budget advice and planning\n- **Emergency Assistance:** Hardship support programs\n- **Payment Plans:** Flexible fee payment options\n\n**Career Services (VU Employ):**\n- **Career Counseling:** Professional guidance and planning\n- **Resume Building:** CV writing workshops\n- **Interview Preparation:** Practice and feedback sessions\n- **Industry Connections:** Networking opportunities\n- **Job Placement:** Work experience and graduate employment\n\n**Specialized Support:**\n- **International Student Services:** Visa, accommodation, cultural support\n- **Disability Services:** Accessibility and accommodation support\n- **First-in-Family:** Programs for students whose families haven't attended university\n- **Indigenous Support:** Culturally appropriate assistance\n- **Mature Age Support:** Services for returning students\n\n**Campus Life:**\n- **Student Clubs:** Over 50 organizations and interest groups\n- **Sports and Recreation:** Gyms, aquatic centres, sports teams\n- **Events and Activities:** Social, cultural, and academic events\n- **Volunteer Opportunities:** Community engagement programs\n\n**Technology Support:**\n- **IT Help Desk:** Computer and software assistance\n- **Campus WiFi:** Free internet access across all campuses\n- **Online Learning Platforms:** VU Collaborate and MyVU portal\n- **Student Email:** Official university email accounts",
    keywords: [
      "support",
      "services",
      "counseling",
      "academic",
      "career",
      "wellbeing",
      "international",
      "disability",
    ],
    tags: [
      "student services",
      "support",
      "wellbeing",
      "academic help",
      "career services",
    ],
  },

  // ACCURATE FACILITIES INFORMATION
  {
    id: "facilities-001",
    category: "campus-life",
    question: "What facilities are available at Victoria University campuses?",
    answer:
      "**Victoria University Campus Facilities:**\n\n**Academic Facilities:**\n- **Modern Classrooms:** Interactive learning spaces with latest technology\n- **Specialized Laboratories:** Science, engineering, computer, and research labs\n- **VU City Tower:** 32-level sustainable building with purpose-built facilities\n- **Libraries:** Physical and extensive online collections\n- **Study Spaces:** Quiet zones, group study rooms, learning commons\n- **Computer Labs:** Latest software and high-speed internet access\n\n**Sports and Recreation:**\n- **Footscray Park Aquatic & Fitness Centre:**\n  - State-of-the-art facilities in Building L, Level 0\n  - AUD $68 million exercise and sport science laboratory precinct\n  - Used by students, professional sports teams, and researchers\n  - Pool, gym, sauna, and group fitness classes\n  - Age restrictions: 16+ for gym, supervised children welcome\n- **Multiple Gym Locations:** Across various campuses\n- **Sports Fields:** Professional-grade facilities\n- **Basketball Courts:** Including rooftop facilities\n\n**Student Life Facilities:**\n- **Food Courts and Cafes:** Multiple dining options on each campus\n- **Student Lounges:** Relaxation and social spaces\n- **Prayer/Meditation Rooms:** Multi-faith spiritual spaces\n- **Childcare Services:** On-campus early childhood facilities\n- **Student Accommodation:** UniLodge Victoria University (on Footscray Park Campus)\n\n**Specialized Facilities:**\n- **Law Moot Courts:** Professional legal training spaces (City Campus)\n- **Design Studios:** Creative arts and architecture facilities\n- **Engineering Workshops:** Hands-on technical training\n- **Health Science Clinics:** Practical healthcare training\n- **Music and Performance Spaces:** Recording studios and theaters\n\n**Technology and Support:**\n- **Campus-wide WiFi:** Free high-speed internet\n- **Printing Services:** Multiple locations across campuses\n- **Security:** 24/7 security operations (+61 3 9919 6666)\n- **Bicycle Hubs:** Secure bike parking, showers, and lockers\n- **Disability Access:** Accessible entrances, lifts, and specialized equipment\n\n**Transport and Parking:**\n- **Free Shuttle Buses:** Between Footscray/St Albans campuses and train stations\n- **Public Transport Access:** Excellent connections to Melbourne's transport network\n- **Limited Parking:** Available at most campuses (fees apply 8:30am-5pm)\n- **City Campus:** No university parking (street parking available)\n\n**VU Sydney Specific:**\n- **Learning Hub:** Library services and study spaces (Level 1)\n- **Student Kitchenette:** Food preparation facilities\n- **Seven-level modern campus:** Heart of Sydney CBD\n- **Evening Support:** iHelpers available 5pm-7pm weekdays",
    keywords: [
      "facilities",
      "campus",
      "library",
      "gym",
      "sports",
      "technology",
      "parking",
      "accommodation",
    ],
    tags: [
      "campus facilities",
      "sports",
      "library",
      "technology",
      "recreation",
    ],
  },

  // SCHOLARSHIPS AND FINANCIAL AID
  {
    id: "scholarships-001",
    category: "fees-scholarships",
    question:
      "What scholarships and financial aid are available at Victoria University?",
    answer:
      "**Victoria University Scholarships and Financial Aid:**\n\n**Merit-Based Scholarships:**\n- **Global Excellence Scholarship:** High-achieving international students\n- **Academic Achievement Awards:** Based on previous academic performance  \n- **IT Career Launcher Scholarship:** Information technology students\n- **Alumni Grant:** For children/relatives of VU graduates\n\n**Support-Based Scholarships:**\n- **International Scholarship:** General support for overseas students\n- **Global Citizen Scholarship:** Students from specific partner countries\n- **Hardship Scholarships:** Financial difficulty support\n- **First-in-Family Scholarships:** Students whose families haven't attended university\n\n**Specialized Scholarships:**\n- **Women in Sport Scholarship:** Female athletes combining study and sport\n- **Elite Athlete Scholarships:** High-level sporting students\n- **Indigenous Student Scholarships:** Aboriginal and Torres Strait Islander students\n- **Equity Scholarships:** Students from disadvantaged backgrounds\n\n**TAFE Scholarships:**\n- **Victoria University Polytechnic Scholarships:**\n  - Hardship-based awards\n  - Achievement-based recognition\n  - Trade and vocational training support\n- **Industry-Specific Awards:** Various professional areas\n\n**External Scholarships:**\n- **Australian Government Programs:** Study assistance schemes\n- **Industry Partnerships:** Company-sponsored awards\n- **Community Organizations:** Local and regional scholarships\n- **International Programs:** Government-to-government awards\n\n**Financial Support Services:**\n- **Financial Counseling:** Budget planning and money management\n- **Emergency Assistance:** Crisis financial support\n- **Payment Plans:** Flexible fee payment arrangements\n- **Student Loans:** Government assistance programs\n- **Work-Study Programs:** Part-time employment opportunities\n\n**How to Apply:**\n- Most scholarships require separate applications\n- Check specific eligibility criteria and deadlines\n- Submit applications through VU Admissions Centre\n- Some scholarships automatically considered with course application\n- International students: verify visa work restrictions\n\n**Additional Support:**\n- **Free Meals Program:** SecondBite partnership for healthy frozen meals\n- **Textbook Assistance:** Library lending and digital resources\n- **Transport Subsidies:** Free shuttle buses between campuses and stations\n- **Technology Support:** Equipment loans and IT assistance\n\n**Contact for Scholarships:**\n- VUHQ student service centres\n- VU Admissions Centre\n- International Student Services (for overseas students)\n- Financial Aid Office for government assistance programs",
    keywords: [
      "scholarships",
      "financial aid",
      "funding",
      "grants",
      "international",
      "merit",
      "hardship",
      "TAFE",
    ],
    tags: ["scholarships", "financial aid", "funding", "student support"],
  },

  // GENERAL UNIVERSITY INFORMATION
  {
    id: "general-001",
    category: "general",
    question: "Tell me about Victoria University Australia",
    answer:
      "**Victoria University (VU) - Leading Australian Institution**\n\n**University Overview:**\n- **Established:** 1990 (university status), originally founded 1916\n- **Type:** Public research university\n- **Rankings:** Top 2% of universities worldwide (Times Higher Education)\n- **Innovation:** First Australian university to deliver VU Block Model®\n- **Unique Feature:** Dual-sector institution (TAFE and University)\n\n**Campus Locations:**\n- **Melbourne:** Multiple campuses across CBD and western suburbs\n  - City Campus (VU City Tower): 370 Little Lonsdale Street\n  - Footscray Park Campus: Main campus, largest facility\n  - Footscray Nicholson, Sunshine, Werribee campuses\n- **Sydney:** International campus at 160-166 Sussex Street\n- **Brisbane:** International student options available\n- **Partner Institutions:** Overseas study opportunities\n\n**Academic Excellence:**\n- **CRICOS Provider:** 00124K (Melbourne), 02475D (Sydney/Brisbane)\n- **RTO Number:** 3113 (vocational training)\n- **TEQSA Provider ID:** PRV12152\n- **Awards:** Multiple teaching and research excellence recognitions\n\n**Student Body:**\n- **Diversity:** Students from over 45 countries at VU Sydney\n- **Support:** Comprehensive services for domestic and international students\n- **Pathways:** Easy transitions between TAFE, undergraduate, and postgraduate study\n- **Community:** Strong focus on western Melbourne community engagement\n\n**Teaching Philosophy:**\n- **VU Block Model®:** Study one subject at a time (revolutionary approach)\n- **Industry Connections:** Strong employer partnerships and work placements\n- **Practical Focus:** Hands-on, real-world learning experiences\n- **Smaller Classes:** Personalized attention and collaborative learning\n- **Flexible Pathways:** Multiple entry points and progression routes\n\n**Research Excellence:**\n- **Focus Areas:** Applied research with real-world impact\n- **Facilities:** World-class laboratories and research centers\n- **Partnerships:** Industry collaboration and community engagement\n- **Innovation:** Leading research in multiple disciplines\n\n**Support Services:**\n- **VUHQ:** Comprehensive student support network\n- **International Services:** Specialized support for overseas students\n- **Career Services:** Strong graduate employment outcomes\n- **Wellbeing:** Mental health and personal support services\n\n**Contact Information:**\n- **Phone:** +61 3 9919 6100\n- **Address:** PO Box 14428, Melbourne VIC 8001\n- **Website:** vu.edu.au\n- **Emergency:** +61 3 9919 6666 (24/7 security)",
    keywords: [
      "Victoria University",
      "VU",
      "about",
      "overview",
      "ranking",
      "Melbourne",
      "Sydney",
      "education",
    ],
    tags: ["general", "about VU", "university overview", "Melbourne", "Sydney"],
  },
];

// Enhanced search function with better accuracy
export function searchKnowledgeBase(query: string): KnowledgeItem[] {
  const lowercaseQuery = query.toLowerCase();
  const queryWords = lowercaseQuery
    .split(" ")
    .filter((word) => word.length > 2);

  return VU_KNOWLEDGE_BASE.map((item) => {
    let score = 0;

    // Exact phrase matches get highest priority
    if (item.question.toLowerCase().includes(lowercaseQuery)) {
      score += 15;
    }
    if (item.answer.toLowerCase().includes(lowercaseQuery)) {
      score += 10;
    }

    // Category-specific scoring
    if (lowercaseQuery.includes(item.category)) {
      score += 8;
    }

    // Keyword matches
    item.keywords.forEach((keyword) => {
      if (lowercaseQuery.includes(keyword.toLowerCase())) {
        score += 6;
      }
    });

    // Tag matches
    item.tags.forEach((tag) => {
      if (lowercaseQuery.includes(tag.toLowerCase())) {
        score += 4;
      }
    });

    // Individual word matches
    queryWords.forEach((word) => {
      if (item.question.toLowerCase().includes(word)) score += 2;
      if (item.answer.toLowerCase().includes(word)) score += 1;
      if (item.keywords.some((k) => k.toLowerCase().includes(word))) score += 2;
    });

    // Boost scores for contact/address queries
    if (
      lowercaseQuery.includes("contact") ||
      lowercaseQuery.includes("phone") ||
      lowercaseQuery.includes("address") ||
      lowercaseQuery.includes("location")
    ) {
      if (item.category === "contact" || item.category === "campus-locations") {
        score += 10;
      }
    }

    return { ...item, score };
  })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5); // Return top 5 matches
}

// Get knowledge base items by category
export function getKnowledgeByCategory(category: string): KnowledgeItem[] {
  return VU_KNOWLEDGE_BASE.filter((item) => item.category === category);
}

// Get all categories
export function getKnowledgeCategories(): string[] {
  const categories = VU_KNOWLEDGE_BASE.map((item) => item.category);
  return [...new Set(categories)];
}

// Enhanced answer formatting
export function formatKnowledgeAnswer(answer: string): string {
  return answer
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>") // Bold text
    .replace(/\n\n/g, "<br/><br/>") // Paragraph breaks
    .replace(/\n/g, "<br/>") // Line breaks
    .replace(/- /g, "• ") // Bullet points
    .replace(/(\+61 \d+ \d{4} \d{4})/g, '<a href="tel:$1">$1</a>') // Phone numbers
    .replace(/([\w.-]+@[\w.-]+\.\w+)/g, '<a href="mailto:$1">$1</a>'); // Email addresses
}

// Get quick facts for common queries
export function getQuickFacts(): string[] {
  return [
    "VU is ranked in the top 2% of universities worldwide",
    "Main phone: +61 3 9919 6100",
    "VU Sydney: Ground Floor, 160-166 Sussex Street, Sydney NSW 2000",
    "Emergency/Security: +61 3 9919 6666 (24/7)",
    "VUHQ is your first point of contact for student support",
    "VU Block Model®: Study one subject at a time",
    "International student phone: +61 2 8265 3222 (Sydney)",
    "Application fee for international students: AUD $75",
  ];
}
