@echo off
REM Πηγαίνουμε στον φάκελο του project
cd /d "C:\Users\prive\KEK\ΤΟ ΙΣΤΟΛΟΓΙΟ ΜΟΥ\xrisotblogspot"

REM Προσθήκη όλων των αλλαγών
git add .

REM Commit με μήνυμα
git commit -m "Ενημέρωση APOD sidebar"

REM Push στο GitHub
git push origin main

echo.
echo Ολοκληρώθηκε το push στο GitHub!
pause
