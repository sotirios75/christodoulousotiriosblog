@echo off
REM ���������� ���� ������ ��� project
cd /d "C:\Users\prive\KEK\�� ��������� ���\xrisotblogspot"

REM �������� ���� ��� �������
git add .

REM Commit �� ������
git commit -m "��������� APOD sidebar"

REM Push ��� GitHub
git push origin main

echo.
echo ������������ �� push ��� GitHub!
pause
