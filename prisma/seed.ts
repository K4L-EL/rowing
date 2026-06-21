import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("password123", 12);

  // --- Users ---
  const admin = await prisma.user.upsert({
    where: { email: "admin@rowsafe.club" },
    update: {},
    create: {
      name: "Alex Admin",
      email: "admin@rowsafe.club",
      passwordHash,
      role: "ADMIN",
      squad: "SENIOR",
      onboardingComplete: true,
    },
  });

  const coach = await prisma.user.upsert({
    where: { email: "coach@rowsafe.club" },
    update: {},
    create: {
      name: "Coach Charlie",
      email: "coach@rowsafe.club",
      passwordHash,
      role: "COACH",
      squad: "SENIOR",
      onboardingComplete: true,
    },
  });

  const welfare = await prisma.user.upsert({
    where: { email: "welfare@rowsafe.club" },
    update: {},
    create: {
      name: "Welfare Officer Wendy",
      email: "welfare@rowsafe.club",
      passwordHash,
      role: "WELFARE_OFFICER",
      squad: "SENIOR",
      onboardingComplete: true,
    },
  });

  const memberSenior = await prisma.user.upsert({
    where: { email: "member@rowsafe.club" },
    update: {},
    create: {
      name: "Member Mike",
      email: "member@rowsafe.club",
      passwordHash,
      role: "MEMBER",
      squad: "SENIOR",
      onboardingComplete: true,
    },
  });

  const memberJunior = await prisma.user.upsert({
    where: { email: "junior@rowsafe.club" },
    update: {},
    create: {
      name: "Junior Jo",
      email: "junior@rowsafe.club",
      passwordHash,
      role: "MEMBER",
      squad: "JUNIOR",
      onboardingComplete: true,
    },
  });

  const e2eWelfare = await prisma.user.upsert({
    where: { email: "e2e-welfare@test.com" },
    update: {},
    create: {
      name: "E2E Welfare Officer",
      email: "e2e-welfare@test.com",
      passwordHash,
      role: "WELFARE_OFFICER",
      squad: "SENIOR",
      onboardingComplete: true,
    },
  });

  console.log("  Users created");

  // --- Welfare reports ---
  await prisma.welfareReport.create({
    data: {
      userId: memberSenior.id,
      status: "SUBMITTED",
      payload: {
        subjectName: "Member Mike",
        subjectSquad: "SENIOR",
        subjectRole: "ROWER",
        concernType: "WELLBEING",
        factualDescription:
          "Feeling anxious about upcoming competition. Has been missing training sessions.",
        whenDescription: "During training on Monday morning",
        whereDescription: "Boathouse",
        immediateRisk: false,
        anonymousReporter: false,
      },
    },
  });

  await prisma.welfareReport.create({
    data: {
      userId: memberJunior.id,
      status: "RESOLVED",
      assignedToId: welfare.id,
      payload: {
        subjectName: "Junior Jo",
        subjectSquad: "JUNIOR",
        subjectRole: "ROWER",
        concernType: "SAFEGUARDING",
        factualDescription:
          "Resolved issue from last month regarding communication concerns.",
        whenDescription: "Previous training camp",
        whereDescription: "Off-site venue",
        immediateRisk: false,
        anonymousReporter: true,
      },
    },
  });

  console.log("  Welfare reports created");

  // --- Crew sheet ---
  await prisma.crewSheet.create({
    data: {
      name: "Senior Men's 4+ — Saturday",
      date: new Date("2026-05-09"),
      session: "AM1",
      type: "WATER",
      boatType: "4+",
      squad: "SENIOR",
      positions: {
        Stroke: memberSenior.id,
        "3": coach.id,
        "2": memberJunior.id,
        Bow: admin.id,
        Cox: null,
      },
      blades: ["Red", "White"],
      note: "First outing of the season — focus on drills",
    },
  });

  console.log("  Crew sheet created");

  // --- Availability slots for 7 training days ---
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  let slotCount = 0;

  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setUTCDate(d.getUTCDate() + i);

    // Skip weekends
    if (d.getUTCDay() === 0 || d.getUTCDay() === 6) continue;

    const sessions = ["AM1", "AM2", "PM1"] as const;
    const statuses = ["AVAILABLE", "AVAILABLE", "UNAVAILABLE"] as const;

    for (const user of [memberSenior, memberJunior]) {
      for (let s = 0; s < sessions.length; s++) {
        await prisma.availabilitySlot
          .upsert({
            where: {
              userId_date_session: {
                userId: user.id,
                date: d,
                session: sessions[s],
              },
            },
            update: { status: statuses[s] },
            create: {
              userId: user.id,
              date: d,
              session: sessions[s],
              status: statuses[s],
            },
          })
          .catch(() => {});
        slotCount++;
      }
    }
  }

  console.log(`  ${slotCount} availability slots created`);

  // --- Kit items ---
  const kitItems = [
    { id: "custom-aio", name: "Custom AIO", price: 75, description: "All-in-one rowing suit in club colours with mesh back panel.", color: "mint", badge: "New" },
    { id: "custom-singlet", name: "Custom Singlet", price: 51, description: "Lightweight racing singlet with club stripe.", color: "blush" },
    { id: "classic-hoodie", name: "Classic Hoodie", price: 37, description: "Heavyweight cotton hoodie with embroidered club crest.", color: "white" },
    { id: "custom-shorts", name: "Custom Shorts", price: 55, description: "Compression shorts in club colourway.", color: "bluePale" },
    { id: "custom-trackies", name: "Custom Trackies", price: 57, description: "Warm-up trackpants with side stripes.", color: "lavender" },
    { id: "classic-cap", name: "Classic Cap", price: 15, description: "Six-panel cap with club logo.", color: "mint" },
    { id: "essentials-kitbag", name: "Essentials Kitbag", price: 34, description: "Waterproof holdall with drawstring liner.", color: "blueLight" },
    { id: "custom-splash", name: "Custom Splash Jacket", price: 102, description: "Wind and water resistant racing jacket.", color: "blush", badge: "Popular" },
  ];

  for (const item of kitItems) {
    await prisma.kitItem.upsert({
      where: { id: item.id },
      update: { name: item.name, price: item.price, description: item.description, color: item.color, badge: item.badge ?? null },
      create: item,
    });
  }

  console.log(`  ${kitItems.length} kit items created`);

  // --- Events ---
  const events = [
    {
      id: "annual-dinner-2026",
      title: "Annual Club Dinner 2026",
      date: new Date("2026-11-14"),
      time: "7:00 PM arrival, 7:30 PM dinner",
      venue: "The Clubhouse Boat Bay, River Road",
      description: "Our flagship black-tie event celebrating the season's achievements. Three-course dinner, awards, and live music.",
      price: 65,
      capacity: 120,
      menu: [
        "Starter: Smoked salmon with horseradish crème fraîche (v option available)",
        "Main: Slow-braised beef shin with dauphinoise potatoes (v / gf options)",
        "Dessert: Sticky toffee pudding with clotted cream",
        "Coffee and petit fours",
      ],
    },
    {
      id: "winter-head-regatta",
      title: "Winter Head Regatta",
      date: new Date("2027-02-07"),
      time: "Marshalling 9:00 AM, first division 10:00 AM",
      venue: "Regatta Course, City Lake",
      description: "Club's winter head race. Crews to confirm lineup one week in advance.",
      price: 15,
    },
    {
      id: "spring-training-camp",
      title: "Spring Training Camp - Portugal",
      date: new Date("2027-04-06"),
      time: "Flight from Heathrow Terminal 5",
      venue: "Nautical Centre, Lagoa",
      description: "A week of intensive training on flat water with professional coaching support.",
      price: 620,
      capacity: 24,
    },
  ];

  for (const evt of events) {
    const { id, ...data } = evt;
    await prisma.event.upsert({
      where: { id },
      update: data,
      create: evt,
    });
  }

  console.log("  3 events created");

  console.log("\n--- Seed complete ---");
  console.log("  Users: admin, coach, welfare, member, junior");
  console.log("  All passwords: password123");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
