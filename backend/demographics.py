import platform
import random
import threading
import time
import traceback as tb
from datetime import datetime
from collections import Counter
import requests
import user_agent
from selenium import webdriver
import os
import sys

cmd_folder = os.path.realpath(os.path.dirname(os.path.realpath(__file__)))
sys.path.append(cmd_folder)

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "modoom_api.settings.production")
import django

django.setup()
from django.contrib.auth.models import User


class Bot:
    def __init__(self):
        pass

    def init_driver(self):
        options = webdriver.ChromeOptions()
        options.add_argument("window-size=1920x1080")
        options.add_argument(
            "user-agent={user_agent}".format(
                user_agent=user_agent.generate_user_agent()
            )
        )
        options.add_argument("host=www.xiaohongshu.com")
        options.add_argument("--disable-blink-features=AutomationControlled")
        # options.add_argument("headless")
        driver = webdriver.Chrome("./chromedriver", options=options)
        return driver

    def parse_demographic(self, user):
        email = user.email
        email_input = self.driver.find_element_by_xpath(
            '//*[@id="gb"]/div[2]/div[2]/div[2]/form/div/div/div/div/div/div[1]/input[2]'
        )
        email_input.clear()
        email_input.send_keys(email)
        time.sleep(2)
        results = self.driver.find_elements_by_css_selector(".MkjOTb.oKubKe")
        if len(results) != 1:
            print(len(results), "개")
            return
        result = results[0]
        major_text = result.find_element_by_css_selector(".Yy5syb").text.replace(
            "­", ""
        )
        email_text = result.find_element_by_css_selector(".mf6tRb").text
        if email not in email_text:
            print("이메일 불일치", email, email_text)
            return
        user.profile.contact_info = major_text
        user.profile.save()
        print(email, major_text)

    def teardown(self):
        try:
            self.driver.quit()
        except AttributeError:
            pass

    def parse_all(self):
        self.driver = self.init_driver()
        self.driver.get("https://contacts.google.com/?hl=ko")
        input("로그인 완료하면 엔터를 누르세요:")
        for user in User.objects.filter(profile__contact_info__isnull=True):
            self.parse_demographic(user)

    def main(self):
        majors = []
        grades = []
        for user in User.objects.filter(is_superuser=False).iterator():
            try:
                splitted = user.profile.contact_info.split(" / ")
                majors.append(splitted[-1])
                grades.append(splitted[1])
            except AttributeError:
                continue
        print(Counter(majors))
        print(Counter(grades))


if __name__ == "__main__":
    bot = Bot()
    try:
        bot.main()
    finally:
        bot.teardown()
