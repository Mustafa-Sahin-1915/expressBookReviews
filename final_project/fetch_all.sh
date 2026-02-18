#!/bin/bash

# ----------------------------
# Setup
# ----------------------------

# API base URL
BASE_URL="https://aidenthomas0-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai"

# GitHub info (for Question 1)
GITHUB_USERNAME="ValkryreMalachie"
REPO_NAME="expressBookReviews"

# User credentials for register/login
USERNAME="ValkryreMalachie"
PASSWORD="mypassword"

# Output files
FILES=("githubrepo" "getallbooks" "getbooksbyISBN" "getbooksbyauthor" "getbooksbytitle" "getbookreview" "register" "login" "reviewadded" "deletereview")

# ----------------------------
# Cleanup old files
# ----------------------------
echo "Deleting old files if they exist..."
for f in "${FILES[@]}"; do
    if [ -f "$f" ]; then
        rm "$f"
        echo "Deleted $f"
    fi
done

# ----------------------------
# Question 1: GitHub fork check
# ----------------------------
echo "Checking GitHub fork..."
curl -s "https://api.github.com/repos/$GITHUB_USERNAME/$REPO_NAME" > githubrepo

# ----------------------------
# Question 2–10: API Calls
# ----------------------------
echo "Fetching data from API..."

# All books
curl -s "$BASE_URL/" > getallbooks

# Book by ISBN
curl -s "$BASE_URL/isbn/1" > getbooksbyISBN

# Books by author
curl -s "$BASE_URL/author/Jane%20Austen" > getbooksbyauthor

# Books by title
curl -s "$BASE_URL/title/Pride%20and%20Prejudice" > getbooksbytitle

# Book review
curl -s "$BASE_URL/review/1" > getbookreview

# Register user
curl -s -X POST "$BASE_URL/register" \
-H "Content-Type: application/json" \
-d "{\"username\":\"$USERNAME\",\"password\":\"$PASSWORD\"}" > register

# Login user
curl -s -X POST "$BASE_URL/customer/login" \
-H "Content-Type: application/json" \
-d "{\"username\":\"$USERNAME\",\"password\":\"$PASSWORD\"}" > login

# Add/update review
curl -s -X PUT "$BASE_URL/customer/auth/review/1?review=GreatBook" > reviewadded

# Delete review
curl -s -X DELETE "$BASE_URL/customer/auth/review/1" > deletereview

echo "All 11 API requests completed. Check the files in your current directory."
