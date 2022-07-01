const { PrismaClient } = require("@prisma/client");
// import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
  await clearDb();
  addProfiles(dummyProfiles());
  addRestaurants(dummyRestaurants());
}

async function addProfiles(profiles) {
  for (let profile of profiles) {
    await prisma.profile.create({ data: profile });
  }
}

async function addRestaurants(restaurants) {
  for (let { restaurant, meals } of restaurants) {
    let rest = await prisma.restaurant.create({
      data: {
        name: restaurant.name,
        cuisine: restaurant.cuisine,
      },
    });

    await prisma.restaurant.update({
      where: {
        id: rest.id,
      },
      data: {
        meals: { create: meals },
      },
    });
  }
}

function dummyProfiles() {
  return [
    {
      firstname: "Jared",
      lastname: "Jewell",
      position: "Frontend Intern",
    },
    {
      firstname: "Brendan",
      lastname: "Roman",
      position: "Front-End Developer",
    },
    { firstname: "Judy", lastname: "Tan", position: "Frontend Engineer" },
    { firstname: "Jas", lastname: "Rai", position: "Frontend Eng Intern" },
    {
      firstname: "Kumaran",
      lastname: "Perinpanatan",
      position: "FE Eng Manager",
    },
    { firstname: "Israel", lastname: "Alagbe", position: "Frontend Engineer" },
    {
      firstname: "Nadia",
      lastname: "Mansuri",
      position: "Frontend Eng Intern",
    },
    { firstname: "Kevin", lastname: "Chen", position: "Frontend Developer" },
    {
      firstname: "Shuai",
      lastname: "Wang",
      position: "Senior Frontend Engineer",
    },
  ];
}

function dummyRestaurants() {
  return [
    {
      restaurant: {
        name: "McDevitt Taco Supply",
        cuisine: "Tacos",
        city: "Boulder",
      },
      meals: [
        {
          name: "Green Chiles & Chicken",
          description: "Grilled with mild green chilies from Hatch, NM",
        },
        {
          name: "Beer-Braised Beef",
          description:
            "Slow cooked beef with chipotles and local beer, topped with pickled onions, cabbage and cilantro  ~ spicy ~",
        },
        {
          name: "Cauliflower Taco",
          description: "Fried cauliflower topped with a zesty ginger slaw",
        },
      ],
    },
    {
      restaurant: {
        name: "Slyce",
        cuisine: "Pizza",
        city: "Indian Rocks Beach",
      },
      meals: [
        {
          name: "Individual Smoked Salmon Pizza",
          description: "Cream cheese, smoked salmon, onion, capers, and dill",
        },
        {
          name: "Garlic Knots",
          description:
            "A serving of meatballs topped with meatballs and a dollop of Ricotta cheese. Served with two warm knots on the side.",
        },
      ],
    },
    {
      restaurant: { name: "BarTaco", cuisine: "Tacos", city: "Boulder" },
      meals: [
        {
          name: "Seared Chorizo",
          description:
            "argentinian-style spiced ground pork w/ sweet onion + cilantro + smoky red chimichurri sauce",
        },

        {
          name: "Glazed Pork Belly",
          description: "spicy arbol chili sauce",
        },
      ],
    },
    {
      restaurant: { name: "Tasuki Bistro", cuisine: "Sushi", city: "Boulder" },
      meals: [
        {
          name: "Orgasm Roll",
          description: "Let's just say... it is aptly named.",
        },

        {
          name: "Hyanasu",
          description: "Cold Eggplant w/ Somen Noodles",
        },
        {
          name: "Karami Chicken",
          description: "Spicey Japanese chicken wing",
        },
      ],
    },
  ];
}

async function clearDb() {
  await prisma.profile.deleteMany({ where: {} }).catch((e) => {
    console.log(e);
  });
  await prisma.review.deleteMany({ where: {} }).catch((e) => {
    console.log(e);
  });
  await prisma.meal.deleteMany({ where: {} }).catch((e) => {
    console.log(e);
  });
  await prisma.restaurant.deleteMany({ where: {} }).catch((e) => {
    console.log(e);
  });
}

seed();
