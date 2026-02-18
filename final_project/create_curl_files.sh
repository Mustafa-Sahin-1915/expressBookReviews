#!/bin/bash

# ----------------------------
# Files and Commands
# ----------------------------

declare -A FILES_COMMANDS

# Question 1: GitHub fork check
FILES_COMMANDS["githubrepo"]="curl https://api.github.com/repos/ValkryreMalachie/expressBookReviews"

# Question 2: All books
FILES_COMMANDS["getallbooks"]="curl \"https://aidenthomas0-5500.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/\""

# Question 3: Book by ISBN
FILES_COMMANDS["getbooksbyISBN"]="curl \"https://aidenthomas0-5500.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/isbn/1\""

# Question 4: Books by author
FILES_COMMANDS["getbooksbyauthor"]="curl \"https://aidenthomas0-5500.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/author/Jane%20Austen\""

# Question 5: Books by title
FILES_COMMANDS["getbooksbytitle"]="curl \"https://aidenthomas0-5500.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/title/Pride%20and%20Prejudice\""

# Question 6: Book review
FILES_COMMANDS["getbookreview"]="curl \"https://aidenthomas0-5500.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/review/1\""

# Question 7: Register user
FILES_COMMANDS["register"]="curl -X POST \"https://aidenthomas0-5500.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/register\" -H \"Content-Type: application/json\" -d '{\"username\":\"ValkryreMalachie\",\"password\":\"pass123\"}'"

# Question 8: Login user
FILES_COMMANDS["login"]="curl -X POST \"https://aidenthomas0-5500.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/customer/login\" -H \"Content-Type: application/json\" -d '{\"username\":\"ValkryreMalachie\",\"password\":\"pass123\"}'"

# Question 9: Add/update review
FILES_COMMANDS["reviewadded"]="curl -X PUT \"https://aidenthomas0-5500.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/customer/auth/review/1?review=GreatBook\""

# Question 10: Delete review
FILES_COMMANDS["deletereview"]="curl -X DELETE \"https://aidenthomas0-5500.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/customer/auth/review/1\""

# ----------------------------
# Cleanup old files and write commands
# ----------------------------
for file in "${!FILES_COMMANDS[@]}"; do
    if [ -f "$file" ]; then
        rm "$file"
    fi
    echo "${FILES_COMMANDS[$file]}" > "$file"
    echo "Created $file with its cURL command."
done

echo "All 11 files created with cURL commands."

