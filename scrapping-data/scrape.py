import csv
import time

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.common.exceptions import TimeoutException, UnexpectedAlertPresentException
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import NoSuchElementException

chrome_options = Options()
chrome_options.add_experimental_option('detach', True)
chrome_options.add_argument("--disable-popup-blocking")
chrome_options.add_argument("start-maximized")
chrome_options.add_argument("disable-infobars")
chrome_options.add_argument("--disable-extensions")
URL = 'https://anime47.com/xem-phim-vua-hai-tac-ep-0277/188803.html'

driver = webdriver.Chrome(chrome_options)
wait = WebDriverWait(driver, 10)
driver.get(URL)

def to_page_watch_anime():
    btn_watch = driver.find_element(By.XPATH, "//a[@class='btn btn-red' and @id='btn-film-watch']")
    driver.execute_script("arguments[0].scrollIntoView(true);", btn_watch)
    driver.execute_script("arguments[0].click()", btn_watch)
    scrape_anime()

def skip_ads():
    
    try:
        all_iframes = wait.until(EC.presence_of_all_elements_located((By.TAG_NAME, 'iframe')))
        if len(all_iframes) > 0:
            print("Ad Found\n")
            driver.execute_script("""
                var elems = document.getElementsByTagName("iframe"); 
                for(var i = 0, max = elems.length; i < max; i++)
                    {
                        elems[i].hidden=true;
                    }
                                """)
            print('Total Ads: ' + str(len(all_iframes)))
        else:
            print('No frames found')

        running = True
        nb_tries = 0
        while running:
            btn_display = wait.until(EC.presence_of_element_located((By.XPATH, "//div[@class='jw-icon jw-icon-display jw-button-color jw-reset']")))
            driver.execute_script("arguments[0].scrollIntoView(true);", btn_display)
            driver.execute_script("arguments[0].click()", btn_display)
            if (nb_tries >= 3):
                running = False
            nb_tries += 1
            time.sleep(2)

        time.sleep(6)
        skip_wait = WebDriverWait(driver, 20)
        btn_skip = skip_wait.until(EC.presence_of_element_located((By.XPATH, "//div[@class='jw-skip jw-reset jw-skippable']")))
        driver.execute_script("arguments[0].scrollIntoView(true);", btn_skip)
        driver.execute_script("arguments[0].click()", btn_skip)
    except:
        pass

def wait_ads():
    try:
        wait.until(EC.title_contains("- Ep"))
    except UnexpectedAlertPresentException:
        wait_ads()
    except TimeoutError:
        pass

def detect_error_file():
    try:
        error_element = wait.until(EC.visibility_of_element_located((By.XPATH, "//div[@class='jw-error-text jw-reset-text']")))
        return True if error_element is not None else False
    except:
        return False

def scrape_anime():
    with open("animes.csv", "a", newline='') as outfile:
        writer = csv.writer(outfile)
        index = 276

        while index < 1074:
            time.sleep(20)
            wait_ads()
            if (detect_error_file()):
                episode = index + 1
                index += 1
                with open("fail_link.csv", "a", newline='') as failfile:
                    writerfail = csv.writer(failfile)
                    writerfail.writerow([episode])
                    user_action_container = wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR,".row >.col-lg-8 >.movie-info>.block-movie-info>.user-action")))
                    next_btn = user_action_container.find_element(By.CSS_SELECTOR, "a.autonext").get_attribute("onclick")
                    next_ep_link = ""

                    if next_btn.find("html") != -1:
                        next_ep_link = next_btn[next_btn.find("https"):next_btn.find("html")+4]
                    
                    if next_ep_link != "":
                        driver.get(next_ep_link)
                    else:
                        break
                    continue
            else:
                try: 
                    wait_ads()
                    skip_ads()
                    episode = index + 1
                    media_info = wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR,".row >.col-lg-8 >.movie-info>.block-movie-info>#page-watch>#abd_mv>#player-area>#media")))
                    media_container = media_info.find_element(By.ID, 'player')
                    link = media_container.find_element(By.CSS_SELECTOR, "video.jw-video").get_attribute("src")

                    writer.writerow([episode, link])
                    print(episode, link)
                except UnexpectedAlertPresentException:
                    wait_ads()
                    skip_ads()
                    episode = index + 1
                    media_info = wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR,".row >.col-lg-8 >.movie-info>.block-movie-info>#page-watch>#abd_mv>#player-area>#media")))
                    media_container = media_info.find_element(By.ID, 'player')
                    link = media_container.find_element(By.CSS_SELECTOR, "video.jw-video").get_attribute("src")

                    writer.writerow([episode, link])
                    print(episode, link)

                # next page
                try:
                    index += 1
                    user_action_container = wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR,".row >.col-lg-8 >.movie-info>.block-movie-info>.user-action")))
                    next_btn = user_action_container.find_element(By.CSS_SELECTOR, "a.autonext").get_attribute("onclick")
                    next_ep_link = ""

                    if next_btn.find("html") != -1:
                        next_ep_link = next_btn[next_btn.find("https"):next_btn.find("html")+4]
                    
                    if next_ep_link != "":
                        driver.get(next_ep_link)
                    else:
                        break
                    
                except TimeoutException:
                    break  # reached the end of the page


scrape_anime()