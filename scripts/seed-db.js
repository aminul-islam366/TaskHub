const { MongoClient, ServerApiVersion } = require("mongodb");

const uri =
  "mongodb+srv://NEXT_JS:pIb1IFBjx3AI4EgE@cluster0.ty9bkxj.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function seedDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB!");

    const db = client.db("taskhub");

    // Clear existing data
    await db.collection("users").deleteMany({});
    await db.collection("tasks").deleteMany({});
    console.log("Cleared existing data");

    // Insert demo user
    await db.collection("users").insertOne({
      name: "Demo User",
      email: "demo@taskhub.com",
      password: "password123",
      createdAt: new Date(),
    });
    console.log("Created demo user");

    // Insert 5 demo tasks
    const demoTasks = [
      {
        title: "Follow @TechStartup on Twitter",
        description:
          "Help us grow our tech startup community! Follow our Twitter account and stay updated with the latest tech news and innovations.",
        category: "Twitter Follow",
        twitterHandle: "@TechStartup",
        tweetUrl: "",
        reward: 0.5,
        requiredCompletions: 100,
        completions: 23,
        status: "active",
        submissions: [],
        createdBy: "demo@taskhub.com",
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Retweet Our Product Launch",
        description:
          "We are launching our new product! Help us spread the word by retweeting our launch announcement.",
        category: "Twitter Retweet",
        twitterHandle: "@TechStartup",
        tweetUrl: "https://twitter.com/techstartup/status/123456",
        reward: 0.75,
        requiredCompletions: 50,
        completions: 12,
        status: "active",
        submissions: [],
        createdBy: "demo@taskhub.com",
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Like Our Latest Tweet",
        description:
          "Show some love! Like our latest tweet about our new feature release.",
        category: "Twitter Like",
        twitterHandle: "@TechStartup",
        tweetUrl: "https://twitter.com/techstartup/status/789012",
        reward: 0.25,
        requiredCompletions: 200,
        completions: 87,
        status: "active",
        submissions: [],
        createdBy: "demo@taskhub.com",
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Follow @CryptoNews for Updates",
        description:
          "Stay informed about the latest cryptocurrency news and market trends. Follow our account for daily updates.",
        category: "Twitter Follow",
        twitterHandle: "@CryptoNews",
        tweetUrl: "",
        reward: 0.6,
        requiredCompletions: 75,
        completions: 45,
        status: "active",
        submissions: [],
        createdBy: "demo@taskhub.com",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Retweet Our Giveaway Announcement",
        description:
          "We are giving away $500! Retweet our giveaway post for a chance to win. Winners will be announced next week.",
        category: "Twitter Retweet",
        twitterHandle: "@TechStartup",
        tweetUrl: "https://twitter.com/techstartup/status/555555",
        reward: 1.0,
        requiredCompletions: 30,
        completions: 8,
        status: "active",
        submissions: [],
        createdBy: "demo@taskhub.com",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
    ];

    await db.collection("tasks").insertMany(demoTasks);
    console.log("Created 5 demo tasks");

    console.log("\n✅ Database seeded successfully!");
    console.log("📊 Demo Data:");
    console.log("   - 1 user (demo@taskhub.com / password123)");
    console.log("   - 5 tasks");
  } catch (error) {
    console.error("❌ Seed error:", error);
  } finally {
    await client.close();
  }
}

seedDatabase();
