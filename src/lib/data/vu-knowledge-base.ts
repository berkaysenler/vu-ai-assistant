// Enhanced Victoria University Knowledge Base - Comprehensive & Current Data
// Based on official VU websites and verified sources (2025)

export interface KnowledgeItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  keywords: string[];
  tags: string[];
}

export const ENHANCED_VU_KNOWLEDGE_BASE: KnowledgeItem[] = [
  // GENERAL UNIVERSITY INFORMATION
  {
    id: "general-001",
    category: "general",
    question: "Tell me about Victoria University Australia",
    answer:
      "**Victoria University (VU) - Leading Global Institution**\n\n**University Overview:**\n- **Established:** 1990 (university status), originally founded 1916\n- **Type:** Public research university, dual-sector institution\n- **Rankings:** Top 2% of universities worldwide (Times Higher Education 2025)\n- **Global Ranking:** #741-750 QS World University Rankings 2025\n- **Innovation:** First Australian university to deliver VU Block Model®\n- **Students:** Over 40,000+ students from 100+ countries\n- **Alumni:** 240,000+ graduates including 30,000 overseas professionals\n\n**Key Achievements:**\n- **#1 in Victoria:** Teaching Quality, Skills Development, Peer Engagement (QILT 2023)\n- **Award Winner:** Victorian International Education Awards 2018 (university category)\n- **Industry Leader:** 4,000+ industry partnerships\n- **Acceptance Rate:** 64% (moderately competitive)\n\n**Unique Features:**\n- **VU Block Model®:** Study one subject at a time in 4-week blocks\n- **Dual Sector:** Seamless pathways from TAFE to PhD\n- **Industry Focus:** Work-integrated learning and practical experience\n- **Smaller Classes:** Interactive workshop-style learning\n- **Global Presence:** Campuses in Melbourne, Sydney, Brisbane + Asia partnerships\n\n**Contact Information:**\n- **Phone:** +61 3 9919 6100\n- **Emergency:** +61 3 9919 6666 (24/7 security)\n- **Address:** PO Box 14428, Melbourne VIC 8001\n- **Website:** vu.edu.au",
    keywords: [
      "Victoria University",
      "VU",
      "about",
      "overview",
      "ranking",
      "Melbourne",
      "Sydney",
      "education",
      "dual sector",
      "Block Model",
    ],
    tags: [
      "general",
      "about VU",
      "university overview",
      "rankings",
      "achievements",
    ],
  },

  // CAMPUS LOCATIONS & ADDRESSES (ENHANCED)
  {
    id: "campus-001",
    category: "campus-locations",
    question: "Where are Victoria University campuses located?",
    answer:
      "**Victoria University Campus Locations (2025):**\n\n**Melbourne Campuses:**\n\n**1. VU City Tower (Main City Campus)**\n- **Address:** 370 Little Lonsdale Street, Melbourne VIC 3000\n- **Additional Location:** 295 Queen Street (Law School)\n- **Features:** 32-level sustainable tower (5-star green rating), opened 2022\n- **Programs:** Business, Law, and selected postgraduate courses\n- **Transport:** Heart of Melbourne CBD, all public transport accessible\n- **VUHQ Hours:** Monday-Friday 8:30am-5:30pm\n\n**2. Footscray Park Campus (Largest Campus)**\n- **Location:** Ballarat Road, Footscray Park, next to Maribyrnong River\n- **Features:** World-class sports science facilities, extensive grounds\n- **Transport:** 10 minutes from Melbourne city by train\n- **Station Access:** Footscray Station + free shuttle bus OR 15-minute walk\n- **Specialties:** Sports science, health, engineering, general programs\n\n**3. Footscray Nicholson Campus**\n- **Focus:** TAFE courses, vocational education\n- **Environment:** Relaxed, friendly campus atmosphere\n- **Programs:** Certificate and diploma courses\n\n**4. Sunshine Campus**\n- **Specialization:** Building and construction trade courses\n- **Features:** Fully equipped practical learning facilities\n- **Programs:** Construction, building trades, apprenticeships\n\n**5. Werribee Campus**\n- **Features:** Specialized teaching and research facilities\n- **VUHQ Hours:** Mon/Wed/Fri 9am-5pm, Tue/Thu 9am-4pm\n- **Location:** Building 1B, Level 1, Room 1B102\n\n**International Campuses:**\n\n**6. VU Sydney**\n- **Address:** Ground Floor, 160-166 Sussex Street, Sydney NSW 2000\n- **Phone:** +61 2 8265 3222\n- **Students:** 45+ countries represented\n- **Location:** Heart of Sydney CBD, near Darling Harbour\n- **Programs:** Business, IT, Early Childhood Education\n- **Hours:** Monday-Friday 8:30am-5:30pm\n\n**7. VU Brisbane**\n- **Status:** Available for international students\n- **Contact:** Through main admissions channels\n\n**8. International Partner Campuses:**\n- **Asia Partnerships:** China, India, Malaysia, Vietnam, Singapore, Sri Lanka\n- **Delivery:** VU qualifications through established teaching partnerships",
    keywords: [
      "campus",
      "locations",
      "addresses",
      "Melbourne",
      "Footscray",
      "City Tower",
      "Werribee",
      "Sunshine",
      "Sydney",
      "Brisbane",
    ],
    tags: [
      "campuses",
      "locations",
      "addresses",
      "Melbourne",
      "Sydney",
      "international",
    ],
  },

  // CONTACT INFORMATION (ENHANCED)
  {
    id: "contact-001",
    category: "contact",
    question: "How can I contact Victoria University?",
    answer:
      "**Victoria University Contact Information (2025):**\n\n**General Enquiries:**\n- **Main Phone:** +61 3 9919 6100\n- **Emergency/Security:** +61 3 9919 6666 (24/7)\n- **Postal Address:** PO Box 14428, Melbourne VIC 8001\n- **Website:** vu.edu.au\n\n**International Student Enquiries:**\n\n**Melbourne Campus:**\n- **Days:** Monday-Friday\n- **Hours:** 9am-5pm AEDT\n- **Method:** Call main number or submit online study enquiry\n\n**Sydney Campus:**\n- **Phone:** +61 2 8265 3222\n- **Fax:** +61 2 9283 3646\n- **Address:** Ground Floor, 160-166 Sussex Street, Sydney NSW 2000\n- **Days:** Monday-Friday\n- **Hours:** 9am-5pm AEDT\n- **Admissions:** admissions.sydney@vu.edu.au\n- **Student Services:** studentservices.sydney@vu.edu.au\n- **General Info:** info.sydney@vu.edu.au\n- **Evening Support:** iHelpers (Mon-Fri 5pm-7pm), ihelp.sydney@vu.edu.au\n\n**Brisbane Campus:**\n- **Days:** Monday-Friday\n- **Hours:** 9am-5pm AEST\n- **Contact:** Through main VU channels\n\n**VUHQ Student Service Centres:**\n- **Available:** All campuses during business hours\n- **Services:** Student advisors, enrollment help, course guidance\n- **Virtual Queue:** Online queue system for SMS callbacks\n- **Live Chat:** Available on VU website\n- **Note:** City Queen VUHQ permanently closed - use City Campus VUHQ\n\n**Application Enquiries:**\n- **International Applications:** Online through EAAMS system\n- **Education Agents:** Available for application assistance\n- **Processing Time:** 2-3 weeks (standard), 6-8 weeks (research/credit applications)\n\n**Crisis Support Resources:**\n- **Emergency Services:** Call 000 (police, fire, ambulance)\n- **Lifeline:** 13 11 14\n- **Kids Helpline:** 1800 55 1800 (under 25s)",
    keywords: [
      "contact",
      "phone",
      "address",
      "email",
      "emergency",
      "VUHQ",
      "support",
      "international",
      "Sydney",
      "Melbourne",
    ],
    tags: [
      "contact",
      "phone numbers",
      "addresses",
      "emergency",
      "international support",
    ],
  },

  // VU BLOCK MODEL (NEW)
  {
    id: "teaching-001",
    category: "teaching-learning",
    question: "What is the VU Block Model and how does it work?",
    answer:
      "**VU Block Model® - Award-Winning Learning Approach**\n\n**What is the VU Block Model:**\n- **Unique System:** Study one subject at a time in 4-week intensive blocks\n- **Australian First:** Revolutionary teaching method exclusive to VU\n- **Award Winner:** Victorian International Education Awards 2018\n\n**How It Works:**\n- **Block Structure:** Each subject studied for 4 consecutive weeks\n- **Class Format:** Interactive workshop-style classes instead of lectures\n- **Smaller Classes:** More personalized attention and collaboration\n- **Intensive Focus:** Deep immersion in one subject at a time\n- **Assessment:** Ongoing assessment throughout the block period\n\n**Benefits:**\n- **Enhanced Focus:** Concentrate fully on one subject without distractions\n- **Better Retention:** Deep learning through intensive study periods\n- **Flexibility:** Easier to balance study with work and life commitments\n- **Industry Relevant:** Real-world application and practical learning\n- **Student Success:** Proven to improve academic outcomes\n\n**Why Students Love It:**\n- **Less Stress:** No juggling multiple subjects simultaneously\n- **Practical Learning:** Hands-on experience and immediate application\n- **Industry Connections:** Learn from practicing professionals\n- **Work-Life Balance:** Flexible scheduling options\n- **Career Ready:** Skills-focused approach\n\n**Available Across:**\n- **All Levels:** Undergraduate, postgraduate, and some TAFE courses\n- **All Campuses:** Melbourne, Sydney, and international delivery\n- **Online Options:** Real-time virtual classes available\n\n**Employer Recognition:**\n- **Industry Endorsed:** Preferred by employers for graduate readiness\n- **Practical Skills:** Students develop immediately applicable abilities\n- **Professional Networks:** Strong industry connections built during study",
    keywords: [
      "VU Block Model",
      "teaching",
      "learning",
      "method",
      "innovative",
      "four weeks",
      "one subject",
      "workshop",
      "flexible",
    ],
    tags: [
      "VU Block Model",
      "teaching method",
      "learning",
      "innovation",
      "student success",
    ],
  },

  // INTERNATIONAL STUDENTS (ENHANCED)
  {
    id: "international-001",
    category: "international-students",
    question:
      "What information do international students need about studying at Victoria University?",
    answer:
      "**Victoria University for International Students (2025):**\n\n**Why Choose VU:**\n- **Global Rankings:** Top 2% of universities worldwide (THE 2025)\n- **Diverse Community:** Students from 100+ countries\n- **Multicultural:** Over 90 nationalities at VU Sydney alone\n- **Industry Focus:** 4,000+ industry partnerships\n- **Career Ready:** Strong employment outcomes for graduates\n- **Pathways:** Easy transitions from vocational to postgraduate study\n\n**Study Options:**\n- **100+ Years Experience:** Established educational heritage\n- **Flexible Delivery:** Online real-time classes, in-person, hybrid options\n- **Multiple Intakes:** February, July, November (plus monthly starts for some programs)\n- **Pathway Programs:** Foundation studies, English language courses\n- **VU English:** Nationally-accredited English language centre\n\n**Admission Requirements:**\n\n**Academic Requirements:**\n- **Undergraduate:** Australian Year 12 equivalent with minimum grades\n- **Postgraduate:** Bachelor's degree or equivalent from approved institution\n- **Research Programs:** Honours degree or master's with research component\n- **GPA Requirement:** Minimum 2.5 GPA for undergraduate programs\n\n**English Language Requirements:**\n- **IELTS:** 6.0 overall (no band below 6.0) for most programs\n- **TOEFL iBT:** Accepted (scores vary by program)\n- **PTE Academic:** 50-65 depending on program level\n- **Test Validity:** Must be taken within 2 years of course start\n- **Exemptions:** Available if previous qualification taught in English\n\n**Application Process:**\n- **Application Fee:** AUD $75 (waived for current students/alumni)\n- **Application Methods:** Direct online or through education agents\n- **Processing Time:** 2-3 weeks (standard), 6-8 weeks (research/credit)\n- **Required Documents:** Academic transcripts, English test results, CV\n- **System:** EAAMS (online international admissions system)\n\n**Fees and Scholarships:**\n- **Tuition Range:** AUD $25,000-$45,000+ annually (varies by program)\n- **Fee Deposit:** First semester fees + OSHC (Overseas Student Health Cover)\n- **Payment:** Semester-based, invoice through MyVU portal\n- **Scholarships:** VU Block Model® International Scholarship (10-30% off tuition)\n- **Automatic Assessment:** All eligible international students considered\n\n**Support Services:**\n- **Pre-Arrival:** Guidance on health cover, accommodation, visa requirements\n- **Orientation:** Comprehensive introduction programs\n- **Student Services:** VUHQ centres at all campuses\n- **Academic Support:** Learning support, tutoring, study skills\n- **Career Services:** Employability programs, industry placements\n- **International Student Ambassadors:** Peer support and guidance\n\n**Work Rights:**\n- **Study Visa:** Up to 48 hours per fortnight during studies\n- **Post-Study:** Eligible for 2-4 years post-study work visa (subclass 485)\n- **Internships:** Work-integrated learning opportunities in many programs\n\n**Living in Australia:**\n- **Melbourne:** World's most liveable city, vibrant cultural scene\n- **Sydney:** Global business hub, iconic harbour city\n- **Living Costs:** AUD $36,000 annually (government estimate)\n- **Accommodation:** On-campus options, homestay, private rentals\n- **Transport:** Excellent public transport systems in both cities",
    keywords: [
      "international students",
      "admission",
      "requirements",
      "IELTS",
      "fees",
      "scholarships",
      "support",
      "visa",
      "work rights",
      "living costs",
    ],
    tags: [
      "international students",
      "admission",
      "requirements",
      "fees",
      "support",
      "scholarships",
    ],
  },

  // COURSES AND PROGRAMS (NEW)
  {
    id: "courses-001",
    category: "courses-programs",
    question: "What courses and programs does Victoria University offer?",
    answer:
      "**Victoria University Courses & Programs (2025):**\n\n**Program Levels Available:**\n- **TAFE/Vocational:** Certificates I-IV, Diplomas, Advanced Diplomas\n- **Foundation Studies:** Preparation for university study\n- **Undergraduate:** Bachelor degrees (3-4 years)\n- **Postgraduate:** Graduate Certificates, Graduate Diplomas, Master's degrees\n- **Research:** Masters by Research, PhD, Professional Doctorates\n- **English Language:** VU English centre programs\n\n**Study Areas:**\n\n**Business & Management:**\n- Bachelor of Business\n- Master of Business Administration (MBA) - Tier 1 ranked by CEO Magazine 2021\n- Accounting, Finance, Marketing specializations\n- Supply Chain Management, Enterprise Resource Planning\n\n**Information Technology & Cyber Security:**\n- Bachelor of Information Technology (3 years)\n- Certificate IV in Cyber Security\n- Information Systems, Web Development\n- Data Analytics, Software Development\n\n**Health & Biomedicine:**\n- Bachelor of Nursing\n- Bachelor of Paramedicine\n- Sport Science programs (world-class facilities)\n- Health Science degrees\n\n**Education:**\n- Bachelor of Early Childhood Education (VU Sydney)\n- Master of Teaching (Secondary)\n- Education studies across all levels\n\n**Engineering & Science:**\n- Engineering Technology programs\n- Applied Science degrees\n- Research opportunities in Sustainable Industries\n\n**Arts, Humanities & Law:**\n- Law degrees (delivered at Queen Street campus)\n- Creative arts programs\n- Humanities and social sciences\n\n**Construction & Trades:**\n- Building and construction programs (Sunshine Campus)\n- Trade apprenticeships\n- Practical skills training\n\n**Course Delivery Options:**\n- **VU Block Model®:** One subject at a time (4-week blocks)\n- **Traditional Semester:** Available for some programs\n- **Online Real-Time:** Live virtual classes\n- **Flexible Scheduling:** Evening and weekend options\n- **Work-Integrated Learning:** Industry placements and internships\n\n**Pathway Options:**\n- **Seamless Progression:** Certificate → Diploma → Bachelor → Master → PhD\n- **Credit Recognition:** Previous study and work experience considered\n- **English Pathway:** VU English programs for language preparation\n- **Foundation Studies:** Academic preparation for university entry\n\n**Popular Programs for International Students:**\n- MBA (multiple intakes: February, May, July, October, November)\n- Bachelor of Information Technology (February, May, July, October intakes)\n- Bachelor of Business\n- Bachelor of Early Childhood Education\n- Cyber Security programs\n- Nursing and Health Sciences\n\n**Industry Connections:**\n- **4,000+ Partnerships:** Direct industry collaboration\n- **Work Placements:** Integrated into many programs\n- **Industry Mentors:** Professional guidance and networking\n- **Accreditation:** Programs recognized by industry bodies\n- **Graduate Outcomes:** Strong employment rates\n\n**Course Information:**\n- **Course Finder:** Available on vu.edu.au with current fees\n- **Course Guides:** 2026 guide available for download\n- **International Guide:** Specific information for overseas students\n- **Open Days:** August 17 (Footscray Park), August 24 (City Tower) 2025",
    keywords: [
      "courses",
      "programs",
      "degrees",
      "bachelor",
      "master",
      "MBA",
      "TAFE",
      "business",
      "IT",
      "health",
      "education",
      "pathways",
    ],
    tags: [
      "courses",
      "programs",
      "degrees",
      "study options",
      "pathways",
      "specializations",
    ],
  },

  // FEES AND SCHOLARSHIPS (NEW)
  {
    id: "fees-001",
    category: "fees-scholarships",
    question:
      "What are the fees and scholarship options at Victoria University?",
    answer:
      "**Victoria University Fees & Scholarships (2025):**\n\n**International Student Tuition Fees:**\n\n**Fee Structure:**\n- **Calculation:** Based on course, start year, and study load\n- **Standard Load:** 48 credit points per semester (0.5 EFTSL)\n- **Fee Indexation:** Increased annually at beginning of calendar year\n- **Payment:** Required upfront each semester\n\n**Typical Fee Ranges (Annual):**\n- **Undergraduate:** AUD $25,000 - $35,000\n- **Postgraduate:** AUD $28,000 - $45,000\n- **MBA:** Premium pricing (check current rates)\n- **TAFE/Vocational:** Lower fees, charged per semester\n- **Research Degrees:** Vary by program and research area\n\n**Additional Fees:**\n- **Application Fee:** AUD $75 (international students only)\n- **Materials Fees:** Course-specific items (books, equipment, clothing)\n- **Overseas Student Health Cover (OSHC):** Mandatory for visa duration\n- **Student Services:** May apply depending on program\n\n**Payment Process:**\n- **Initial Deposit:** First semester fees + OSHC (outlined in offer letter)\n- **Subsequent Payments:** Due dates on MyVU invoices\n- **Payment Methods:** International bank transfer, credit card\n- **Fee Estimates:** Provided in International Student Written Agreement\n\n**Scholarships for International Students:**\n\n**VU Block Model® International Scholarship:**\n- **Eligibility:** All international students starting foundation, undergraduate, or postgraduate (coursework) in 2025\n- **Assessment:** Automatic based on previous academic results\n- **Value:** 10%, 20%, or 30% off first-year tuition fees\n- **Application:** No separate application required\n- **Note:** 30% scholarships are limited - apply early\n\n**Other Scholarship Options:**\n- **Global Excellence Scholarship:** Merit-based awards\n- **Global Citizen Scholarship:** For outstanding students\n- **Alumni Grant:** For children/relatives of VU graduates\n- **IT Career Launcher Scholarship:** Technology-focused programs\n- **Industry-Specific Awards:** Various fields available\n\n**Research Scholarships:**\n- **Value:** AUD $28,200 per year (graduate research)\n- **Coverage:** Living stipend plus research costs\n- **Duration:** Varies by program (typically 3-4 years)\n- **Requirements:** Research proposal and supervisor agreement\n\n**Cost of Living Estimates:**\n- **Australian Government Standard:** AUD $21,041 annually (2019 figures)\n- **Current Estimates:** AUD $36,000 annually (comprehensive living costs)\n- **Sydney/Melbourne:** Higher costs due to major city location\n- **Accommodation:** Varies from on-campus to private rental\n\n**Financial Support:**\n- **Payment Plans:** May be available in special circumstances\n- **Student Loans:** Limited options for international students\n- **Part-Time Work:** Up to 48 hours per fortnight on student visa\n- **Emergency Support:** VU student hardship programs\n\n**Fee Information Sources:**\n- **Online Course Finder:** Current fees for all programs\n- **International Course Guide:** Comprehensive fee information\n- **Letter of Offer:** Detailed breakdown of all costs\n- **VUHQ:** Personal consultation on fees and payment options\n\n**Fee Payment Tips:**\n- **Currency:** Fees quoted in Australian Dollars (AUD)\n- **Exchange Rates:** Consider fluctuations when planning\n- **Early Payment:** Recommended for visa processing\n- **Documentation:** Keep all payment receipts for visa applications",
    keywords: [
      "fees",
      "tuition",
      "scholarships",
      "international students",
      "costs",
      "payment",
      "VU Block Model scholarship",
      "financial aid",
    ],
    tags: [
      "fees",
      "scholarships",
      "tuition costs",
      "international students",
      "financial support",
    ],
  },

  // STUDENT SERVICES (ENHANCED)
  {
    id: "services-001",
    category: "student-services",
    question:
      "What student services and support does Victoria University provide?",
    answer:
      "**Victoria University Student Services & Support (2025):**\n\n**VUHQ (Victoria University Help Centre):**\n- **Purpose:** First point of contact for all student assistance\n- **Staff:** Qualified Student Advisors providing personalized help\n- **Locations:** All VU campuses\n- **Services:** Course selection, enrollment, academic guidance, fee inquiries\n\n**VUHQ Campus Hours:**\n- **City Campus:** Monday-Friday 8:30am-5:30pm\n- **Footscray Park:** Standard business hours\n- **Werribee:** Mon/Wed/Fri 9am-5pm, Tue/Thu 9am-4pm\n- **Sydney:** Monday-Friday 9am-5pm + iHelpers (Mon-Fri 5pm-7pm)\n\n**Virtual Support Options:**\n- **Virtual Queue:** Online queue system with SMS callbacks\n- **Live Chat:** Available on VU website during business hours\n- **MyVU Portal:** Online student services and account management\n- **Video Consultations:** Available by appointment\n\n**Academic Support Services:**\n- **Learning Support:** Study skills workshops and tutoring\n- **Academic Skills:** Writing, research, and presentation assistance\n- **Peer Tutoring:** Student-to-student learning support\n- **Library Services:** Research assistance and study spaces\n- **Disability Support:** Accommodations and assistive technology\n\n**International Student Support:**\n- **Pre-Arrival Services:** Visa guidance, accommodation assistance\n- **Orientation Programs:** Comprehensive introduction to VU and Australia\n- **International Student Ambassadors:** Peer support and cultural guidance\n- **Academic Integration:** Support transitioning to Australian education system\n- **Social Programs:** Cultural events and networking opportunities\n\n**Career and Employment Services:**\n- **Employability Programs:** Career preparation and job search skills\n- **Industry Placements:** Work-integrated learning opportunities\n- **Career Counseling:** Professional guidance and career planning\n- **Networking Events:** Industry connections and professional development\n- **Resume and Interview:** Workshops and personal coaching\n- **Job Portal:** Access to graduate employment opportunities\n\n**Health and Wellbeing:**\n- **Counseling Services:** Mental health support and personal counseling\n- **Health Services:** On-campus medical facilities\n- **Crisis Support:** 24/7 emergency support referrals\n- **Wellness Programs:** Stress management and healthy living initiatives\n- **Sports Facilities:** World-class sports science facilities at Footscray Park\n\n**Technology and Digital Services:**\n- **IT Help Desk:** Technical support for students\n- **Computer Labs:** Access to software and hardware\n- **WiFi Access:** High-speed internet across all campuses\n- **Digital Learning:** Online platforms and virtual classrooms\n- **Software Licenses:** Free access to professional software\n\n**Student Life and Engagement:**\n- **Student Clubs:** 50+ clubs covering interests, culture, and sports\n- **Events Calendar:** Regular social and cultural activities\n- **Student Leadership:** Opportunities for campus involvement\n- **Volunteer Programs:** Community engagement initiatives\n- **Cultural Support:** Programs for diverse student communities\n\n**Financial Support:**\n- **Scholarships:** Multiple scholarship programs available\n- **Emergency Financial Aid:** Hardship support for students in need\n- **Fee Payment Plans:** Flexible payment arrangements where possible\n- **Part-Time Work:** Career services help finding suitable employment\n\n**Accommodation Support:**\n- **Accommodation Services:** Assistance finding suitable housing\n- **Homestay Programs:** Cultural immersion with Australian families\n- **Student Housing:** On-campus and affiliated accommodation options\n- **Rental Assistance:** Support navigating private rental market\n\n**Accessibility Services:**\n- **Campus Accessibility:** All campuses designed for universal access\n- **Assistive Technology:** Specialized equipment and software\n- **Note-Taking Services:** Support for students with disabilities\n- **Exam Accommodations:** Modified testing arrangements\n\n**Emergency and Crisis Support:**\n- **24/7 Security:** Campus security services (+61 3 9919 6666)\n- **Emergency Procedures:** Clear protocols for various situations\n- **Crisis Counseling:** Immediate mental health support\n- **Referral Services:** Connections to external support agencies\n\n**Contact Methods:**\n- **In-Person:** Visit any VUHQ centre\n- **Phone:** +61 3 9919 6100 (Melbourne), +61 2 8265 3222 (Sydney)\n- **Email:** studentservices@vu.edu.au\n- **Online:** VU website contact forms and live chat",
    keywords: [
      "student services",
      "VUHQ",
      "support",
      "academic help",
      "counseling",
      "career services",
      "international support",
      "accommodation",
      "wellbeing",
    ],
    tags: [
      "student services",
      "support",
      "VUHQ",
      "academic support",
      "career services",
      "wellbeing",
    ],
  },

  // ADMISSION PROCESS (NEW)
  {
    id: "admission-001",
    category: "admission-process",
    question:
      "How do I apply to Victoria University and what is the admission process?",
    answer:
      "**Victoria University Admission Process (2025):**\n\n**Application Methods:**\n- **Direct Application:** Apply online through VU's EAAMS system\n- **Education Agents:** Apply through authorized VU education agents\n- **In-Person:** Visit VUHQ centres for application assistance\n\n**Key Admission Dates:**\n- **Semester 1 (February):** Main intake for most courses\n- **Semester 2 (July):** Second major intake\n- **Summer/November:** Limited courses available\n- **Application Deadline:** June 9, 2025 (Semester 2)\n- **MBA Intakes:** February, May, July, October, November\n- **Block Model:** Some programs offer monthly starts\n\n**Step-by-Step Application Process:**\n\n**Step 1: Choose Your Course**\n- Browse courses using VU's online course finder\n- Check entry requirements and prerequisites\n- Review fees and course duration\n- Consider pathway options if needed\n\n**Step 2: Check Eligibility**\n- **Academic Requirements:** Meet minimum educational standards\n- **English Language:** Achieve required test scores\n- **Additional Requirements:** Portfolio, interview, or work experience (if applicable)\n\n**Step 3: Prepare Documents**\n- **Academic Transcripts:** Certified copies of all qualifications\n- **English Test Results:** IELTS, TOEFL, PTE (within 2 years)\n- **CV/Resume:** Include current position description\n- **Supporting Documents:** Work experience letters, portfolios\n- **Passport Copy:** For international students\n\n**Step 4: Submit Application**\n- **Online System:** Use EAAMS for international applications\n- **Application Fee:** Pay AUD $75 (waived for current students/alumni)\n- **Document Upload:** Submit all required documentation\n- **Application Review:** Check all details before submission\n\n**Step 5: Application Processing**\n- **Processing Time:** 2-3 weeks (standard applications)\n- **Complex Applications:** 6-8 weeks (research/credit recognition)\n- **Status Updates:** Check progress through application portal\n- **Additional Information:** May be requested during review\n\n**Step 6: Receive Offer**\n- **Offer Letter:** International Student Written Agreement\n- **Conditional Offers:** May require additional requirements\n- **Offer Details:** Course, fees, start date, conditions\n- **Response Deadline:** Accept offer within specified timeframe\n\n**Step 7: Accept Offer and Pay**\n- **Accept Offer:** Confirm acceptance through portal\n- **Pay Deposit:** First semester fees + OSHC\n- **Confirmation of Enrollment (CoE):** Issued after payment\n- **Visa Application:** Use CoE for student visa application\n\n**Entry Requirements by Level:**\n\n**Undergraduate Programs:**\n- **Academic:** Australian Year 12 equivalent or completion of foundation studies\n- **GPA:** Minimum 2.5 GPA for international students\n- **English:** IELTS 6.0 (no band below 6.0) or equivalent\n\n**Postgraduate Programs:**\n- **Academic:** Bachelor's degree from approved institution\n- **English:** IELTS 6.5 (no band below 6.0) or equivalent\n- **Work Experience:** May be required for certain programs\n\n**Research Programs:**\n- **Academic:** Honours degree or Master's with research component\n- **Research Proposal:** Required for PhD applications\n- **Supervisor:** Must identify suitable research supervisor\n- **English:** Higher requirements typically apply\n\n**TAFE/Vocational Programs:**\n- **Academic:** Vary by program (may accept work experience)\n- **Practical Requirements:** Some programs have physical or skill requirements\n- **English:** Lower requirements than university programs\n\n**Special Application Categories:**\n\n**Advanced Standing/Credit Recognition:**\n- **Apply Early:** 10 business days before standard deadline\n- **Assessment:** Previous study and work experience evaluated\n- **Documentation:** Detailed transcripts and course descriptions required\n\n**Competitive Programs:**\n- **Selection Process:** Ranking based on academic merit\n- **Additional Requirements:** Interviews, portfolios, or testing\n- **Limited Places:** Meeting minimum requirements doesn't guarantee entry\n\n**Alternative Pathways:**\n- **Foundation Studies:** For students not meeting direct entry\n- **English Language:** VU English centre for language preparation\n- **TAFE Pathway:** Certificate/Diploma leading to degree\n- **Mature Age Entry:** Special consideration for work experience\n\n**Application Support:**\n- **Information Sessions:** Regular virtual and in-person sessions\n- **VUHQ Assistance:** Personal help with applications\n- **Agent Support:** Professional guidance through education agents\n- **Student Ambassadors:** Peer insights and advice\n\n**After Enrollment:**\n- **Orientation:** Mandatory for new international students\n- **Course Planning:** Academic advisory support\n- **Student Services:** Access to comprehensive support services\n- **Industry Integration:** Work placement and networking opportunities",
    keywords: [
      "application",
      "admission",
      "process",
      "EAAMS",
      "requirements",
      "deadlines",
      "documents",
      "offer letter",
      "enrollment",
    ],
    tags: [
      "admission",
      "application process",
      "requirements",
      "deadlines",
      "enrollment",
    ],
  },
];

// Enhanced search function with improved accuracy and relevance
export function searchKnowledgeBase(query: string): KnowledgeItem[] {
  const lowercaseQuery = query.toLowerCase();
  const queryWords = lowercaseQuery
    .split(/\s+/)
    .filter((word) => word.length > 2)
    .map((word) => word.replace(/[^\w]/g, "")); // Remove punctuation

  return ENHANCED_VU_KNOWLEDGE_BASE.map((item) => {
    let score = 0;

    // Exact phrase matches get highest priority
    if (item.question.toLowerCase().includes(lowercaseQuery)) {
      score += 20;
    }
    if (item.answer.toLowerCase().includes(lowercaseQuery)) {
      score += 15;
    }

    // Category-specific scoring with higher weights
    if (lowercaseQuery.includes(item.category.toLowerCase())) {
      score += 12;
    }

    // Keyword matches with position-based weighting
    item.keywords.forEach((keyword) => {
      const keywordLower = keyword.toLowerCase();
      if (lowercaseQuery.includes(keywordLower)) {
        score += 8;
      }
      // Bonus for exact keyword match
      if (queryWords.includes(keywordLower)) {
        score += 5;
      }
    });

    // Tag matches
    item.tags.forEach((tag) => {
      if (lowercaseQuery.includes(tag.toLowerCase())) {
        score += 6;
      }
    });

    // Individual word matches with context weighting
    queryWords.forEach((word) => {
      const wordRegex = new RegExp(`\\b${word}\\b`, "i");

      // Title/question matches (higher weight)
      if (wordRegex.test(item.question)) score += 4;

      // Answer content matches
      if (wordRegex.test(item.answer)) score += 2;

      // Keyword partial matches
      if (item.keywords.some((k) => k.toLowerCase().includes(word))) score += 3;
    });

    // Boost scores for important query types
    const importantTerms = [
      "contact",
      "phone",
      "address",
      "location",
      "email",
      "fees",
      "admission",
      "international",
      "courses",
      "block model",
    ];
    importantTerms.forEach((term) => {
      if (lowercaseQuery.includes(term)) {
        if (
          item.keywords.some((k) => k.toLowerCase().includes(term)) ||
          item.category.toLowerCase().includes(term)
        ) {
          score += 8;
        }
      }
    });

    // Sydney campus specific boost
    if (
      lowercaseQuery.includes("sydney") &&
      item.answer.toLowerCase().includes("sydney")
    ) {
      score += 10;
    }

    // International student query boost
    if (
      (lowercaseQuery.includes("international") ||
        lowercaseQuery.includes("overseas")) &&
      item.category === "international-students"
    ) {
      score += 12;
    }

    return { ...item, score };
  })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8); // Return top 8 matches for better coverage
}

// Get knowledge base items by category
export function getKnowledgeByCategory(category: string): KnowledgeItem[] {
  return ENHANCED_VU_KNOWLEDGE_BASE.filter(
    (item) => item.category === category
  );
}

// Get all categories with counts
export function getKnowledgeCategories(): {
  category: string;
  count: number;
}[] {
  const categoryCount = ENHANCED_VU_KNOWLEDGE_BASE.reduce(
    (acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return Object.entries(categoryCount).map(([category, count]) => ({
    category,
    count,
  }));
}

// Enhanced answer formatting with better HTML structure
export function formatKnowledgeAnswer(answer: string): string {
  return answer
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>") // Bold text
    .replace(/\n\n/g, "<br/><br/>") // Paragraph breaks
    .replace(/\n- /g, "<br/>• ") // Bullet points
    .replace(/\n([0-9]+\.)/g, "<br/>$1") // Numbered lists
    .replace(/\n([A-Z][^:]*:)/g, "<br/><strong>$1</strong>") // Headers
    .replace(/(\+61 \d+ \d{4} \d{4})/g, '<a href="tel:$1">$1</a>') // Phone numbers
    .replace(/([\w.-]+@[\w.-]+\.\w+)/g, '<a href="mailto:$1">$1</a>') // Email addresses
    .replace(/(https?:\/\/[\w.-]+)/g, '<a href="$1" target="_blank">$1</a>') // URLs
    .replace(/\n/g, "<br/>"); // Remaining line breaks
}

// Get quick facts with current 2025 information
export function getQuickFacts(): string[] {
  return [
    "VU is ranked in the top 2% of universities worldwide (THE 2025)",
    "Main phone: +61 3 9919 6100",
    "Emergency/Security: +61 3 9919 6666 (24/7)",
    "VU Sydney: Ground Floor, 160-166 Sussex Street, Sydney NSW 2000",
    "Sydney phone: +61 2 8265 3222",
    "International application fee: AUD $75",
    "VU Block Model®: Study one subject at a time in 4-week blocks",
    "Students from 100+ countries worldwide",
    "64% acceptance rate (moderately competitive)",
    "Multiple intakes: February, July, November + monthly starts",
    "Automatic scholarship assessment for international students",
    "4,000+ industry partnerships for work placements",
    "#1 in Victoria for Teaching Quality (QILT 2023)",
    "240,000+ alumni including 30,000 working overseas",
  ];
}

// Get related knowledge items based on current item
export function getRelatedKnowledge(
  currentId: string,
  limit: number = 3
): KnowledgeItem[] {
  const currentItem = ENHANCED_VU_KNOWLEDGE_BASE.find(
    (item) => item.id === currentId
  );
  if (!currentItem) return [];

  const related = ENHANCED_VU_KNOWLEDGE_BASE.filter(
    (item) => item.id !== currentId
  )
    .map((item) => {
      let score = 0;

      // Same category gets high score
      if (item.category === currentItem.category) score += 10;

      // Shared keywords
      const sharedKeywords = item.keywords.filter((k) =>
        currentItem.keywords.some((ck) => ck.toLowerCase() === k.toLowerCase())
      );
      score += sharedKeywords.length * 3;

      // Shared tags
      const sharedTags = item.tags.filter((t) =>
        currentItem.tags.some((ct) => ct.toLowerCase() === t.toLowerCase())
      );
      score += sharedTags.length * 2;

      return { ...item, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return related;
}
