# 🚀 LinkedIn Post Scraper - Parasite Edition

A high-performance LinkedIn Post Scraper that automates searching posts by **keywords**, **date filters**, and collects them in structured format — ready for analysis or cloud processing!

Built with ❤️ using **Node.js**, **Puppeteer-Extra**, **Stealth Plugins**, and **Apify SDK**.

---

## ✨ Features

- 🔎 **Keyword Search** across LinkedIn posts
- 🗓️ **Date Range Filters** (Start Date, End Date)
- 🎯 **Custom Result Limits** (e.g., first 50 posts)
- 🕵️‍♂️ **Stealth Mode Browsing** (bypass bot detection)
- 📂 **Save Data** into Apify Dataset / JSON
- ☁️ **Cloud-Deployable** to AWS, Azure, GCP, Docker, Apify

---

## ☁️ Cloud Use-Case

This scraper is lightweight and fully compatible with cloud environments:

| Platform        | How to use                                              |
|-----------------|----------------------------------------------------------|
| **Apify Platform** | Deploy directly as an Actor |
| **AWS EC2 / Azure VM / GCP VM** | Run headless in production |
| **Docker Containers** | Package as scalable scraper service |

This makes it ideal for **serverless scraping tasks** or **automated cloud data pipelines**! 🚀

---

# ⚙️ Installation & Setup

## 1. Clone the repository

git clone https://github.com/Anx-06/linkedin-post-scraper-parasite.git
cd linkedin-post-scraper-parasite

## ⚙️ Configuration

Create an `input.json` file with the following structure:

```json
{
  "searchQuery": "Artificial Intelligence",
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "maxResults": 50,
  "sortBy": "recent",
  "li_at": "YOUR_LINKEDIN_LI_AT_COOKIE"
}

### 📄 Field Details

| Field**        | **Description**                                           |
|------------------|------------------------------------------------------------|
| `searchQuery`    | Keyword/topic you want to search on LinkedIn.              |
| `startDate` / `endDate` | Filter posts between these dates (**optional**).      |
| `maxResults`     | Maximum number of posts to scrape.                         |
| `sortBy`         | Sorting order: `recent` or `relevant`.                     |
| `li_at`          | Your LinkedIn session cookie 🔑 (required for authentication). |


▶️ Running the Scraper
npm start
# or
apify run --input-file=input.json
 
1) The scraper will log in to LinkedIn using your session cookie.
2) It will automatically scroll, load posts, and collect them.
3) ata will be saved in storage/datasets/default folder by default."

📦 Output Example
[
  {
    "content": "Exciting developments in AI!",
    "url": "https://www.linkedin.com/feed/update/xyz...",
    "timestamp": "2025-04-27T15:42:12.123Z"
  }
]

🛠 Requirements
1) Node.js 18+
2) npm
3) Apify CLI (optional for advanced runs)
4) LinkedIn account (with valid session)

☁️ Cloud Deployment Use-Case

Platform | Use Case
Apify Platform | Host and run this as an Actor
AWS EC2, Azure, GCP | Deploy on virtual machines for automated scraping
Docker Containers | Scale horizontally across servers

🛡 Disclaimer
⚠️ This project is for educational purposes only.
Use responsibly and comply with LinkedIn's Terms of Service.

✨ Credits
Made with ❤️ by Parasite Projects 🧠
Focused on innovation, automation, and efficient scraping!