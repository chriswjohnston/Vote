"""
scrape_news.py
==============
Scrapes the Nipissing Township RSS feed and saves
deduplicated results to src/news.json.

Run manually:   python scrape_news.py
Run via Actions: see .github/workflows/scrape.yml
"""

import json
import re
import requests
import xml.etree.ElementTree as ET
from datetime import datetime
from email.utils import parsedate_to_datetime
from pathlib import Path

# ── Config ─────────────────────────────────────────────────
NEWS_FILE = Path("src/news.json")
MAX_POSTS = 100

SOURCES = [
    {
        "label":    "Township of Nipissing",
        "type":     "rss",
        "url":      "https://nipissingtownship.com/feed/",
        "priority": 1,
    },
]

# ── Helpers ─────────────────────────────────────────────────

def clean_html(text):
    """Strip HTML tags and decode common entities."""
    if not text:
        return ""
    text = re.sub(r"<[^>]+>", " ", text)
    for esc, ch in [("&amp;", "&"), ("&lt;", "<"), ("&gt;", ">"), ("&nbsp;", " ")]:
        text = text.replace(esc, ch)
    text = re.sub(r"&#\d+;", "", text)
    return re.sub(r"\s+", " ", text).strip()


def make_fingerprint(text):
    """Reduce text to a set of meaningful words for deduplication."""
    text = re.sub(r"[^a-z0-9\s]", "", text.lower())
    stopwords = {
        "the", "a", "an", "and", "or", "in", "on", "at", "to",
        "for", "of", "with", "is", "was", "are", "we", "our",
        "it", "this", "that", "be", "has", "have",
    }
    words = set(text.split()) - stopwords
    return " ".join(sorted(words))


def similarity(fp1, fp2):
    """Jaccard similarity between two fingerprints."""
    if not fp1 or not fp2:
        return 0.0
    w1, w2 = set(fp1.split()), set(fp2.split())
    if not w1 or not w2:
        return 0.0
    return len(w1 & w2) / len(w1 | w2)


def excerpt_from(text, max_len=220):
    """Return a clean excerpt truncated at a word boundary."""
    text = text.strip()
    if len(text) <= max_len:
        return text
    cut = text[:max_len].rsplit(" ", 1)[0]
    return cut.rstrip(".,;:") + "…"


# ── RSS Parser ──────────────────────────────────────────────

def parse_rss(url, label, priority):
    posts = []
    try:
        resp = requests.get(
            url,
            timeout=15,
            headers={"User-Agent": "Mozilla/5.0"},
        )
        resp.raise_for_status()

        root = ET.fromstring(resp.content)
        channel = root.find("channel")
        if not channel:
            print(f"  No channel element found in feed: {url}")
            return posts

        for item in channel.findall("item"):
            title   = item.findtext("title", "").strip()
            link    = item.findtext("link", "").strip()
            pub_raw = item.findtext("pubDate", "")
            desc    = item.findtext("description", "")

            ce      = item.find("{http://purl.org/rss/1.0/modules/content/}encoded")
            content = ce.text if ce is not None else desc

            try:
                dt      = parsedate_to_datetime(pub_raw)
                pub_iso = dt.strftime("%Y-%m-%d")
                pub_fmt = dt.strftime("%B %d, %Y")
            except Exception:
                pub_iso = pub_fmt = ""

            exc = excerpt_from(clean_html(content))

            if title and link:
                posts.append({
                    "title":       title,
                    "url":         link,
                    "date":        pub_fmt,
                    "date_iso":    pub_iso,
                    "excerpt":     exc,
                    "source":      label,
                    "priority":    priority,
                    "fingerprint": make_fingerprint(title + " " + clean_html(desc)),
                })

    except Exception as e:
        print(f"  RSS error ({label}): {e}")

    return posts


# ── Deduplication ───────────────────────────────────────────

def deduplicate(posts):
    """Remove near-duplicate posts, keep highest priority, sort by date."""
    posts.sort(key=lambda p: p.get("priority", 99))
    kept = []

    for post in posts:
        fp  = post.get("fingerprint", "")
        dup = False
        for k in kept:
            if similarity(fp, k.get("fingerprint", "")) > 0.75:
                dup = True
                if post.get("priority", 99) < k.get("priority", 99):
                    kept.remove(k)
                    kept.append(post)
                break
        if not dup:
            kept.append(post)

    def sort_key(p):
        try:
            return datetime.strptime(p["date_iso"], "%Y-%m-%d")
        except Exception:
            return datetime.min

    kept.sort(key=sort_key, reverse=True)
    return kept[:MAX_POSTS]


# ── Persistence ─────────────────────────────────────────────

def load_existing():
    if NEWS_FILE.exists():
        try:
            return json.loads(NEWS_FILE.read_text(encoding="utf-8"))
        except Exception:
            pass
    return {"posts": []}


def save(posts):
    NEWS_FILE.parent.mkdir(parents=True, exist_ok=True)
    NEWS_FILE.write_text(
        json.dumps(
            {
                "updated": datetime.now().strftime("%B %d, %Y"),
                "posts":   posts,
            },
            indent=2,
            ensure_ascii=False,
        ),
        encoding="utf-8",
    )
    print(f"  Saved {len(posts)} posts → {NEWS_FILE}")


# ── Main ────────────────────────────────────────────────────

if __name__ == "__main__":
    print("=" * 55)
    print(f"News Scraper — {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    print("=" * 55)

    all_posts = []

    for src in SOURCES:
        print(f"\nFetching: {src['label']} ({src['type']})")
        if src["type"] == "rss":
            fetched = parse_rss(src["url"], src["label"], src["priority"])
        else:
            print(f"  Unsupported type: {src['type']}")
            fetched = []
        print(f"  → {len(fetched)} posts fetched")
        all_posts.extend(fetched)

    # Merge with existing so older posts aren't lost between runs
    existing     = load_existing()
    existing_fps = {p.get("fingerprint", "") for p in existing.get("posts", [])}
    new_fps      = {p.get("fingerprint", "") for p in all_posts}

    for p in existing.get("posts", []):
        if p.get("fingerprint", "") not in new_fps:
            all_posts.append(p)

    print(f"\nDeduplicating {len(all_posts)} posts…")
    deduped   = deduplicate(all_posts)
    new_count = len([p for p in deduped if p.get("fingerprint", "") not in existing_fps])
    print(f"  {len(deduped)} unique | {new_count} new this run")

    save(deduped)
    print("\n✓ Done.")
