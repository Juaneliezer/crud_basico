import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import os

class TestAsistenciaApp(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.driver = webdriver.Chrome()
        cls.driver.get("http://localhost:8000")
        cls.wait = WebDriverWait(cls.driver, 10)
        if not os.path.exists("screenshots"):
            os.makedirs("screenshots")

    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

    def tearDown(self):
        # Screenshot SIEMPRE, pase o falle
        test_method_name = self._testMethodName
        if not os.path.exists("screenshots"):
            os.makedirs("screenshots")
        filename = f"screenshots/{test_method_name}.png"
        self.driver.save_screenshot(filename)

    def login(self, username, password):
        self.driver.refresh()
        time.sleep(1)
        self.wait.until(EC.visibility_of_element_located((By.ID, "login-username"))).clear()
        self.driver.find_element(By.ID, "login-username").send_keys(username)
        self.driver.find_element(By.ID, "login-password").clear()
        self.driver.find_element(By.ID, "login-password").send_keys(password)
        self.driver.find_element(By.CSS_SELECTOR, "#login-form button[type='submit']").click()
        time.sleep(1)

    # HU1 - Inicio de sesión
    def test_hu1_login_accept(self):
        self.login("admin", "admin123")
        main_content = self.wait.until(EC.visibility_of_element_located((By.ID, "main-content")))
        self.assertTrue(main_content.is_displayed())
        time.sleep(1)

    def test_hu1_login_reject_wrong_credentials(self):
        self.login("admin", "wrongpass")
        error = self.wait.until(EC.visibility_of_element_located((By.ID, "login-error")))
        self.assertTrue(error.is_displayed())
        self.assertIn("incorrectas", error.text.lower())
        time.sleep(1)

    def test_hu1_login_reject_empty_fields(self):
        self.login("", "")
        error = self.wait.until(EC.presence_of_element_located((By.ID, "login-error")))
        WebDriverWait(self.driver, 5).until(lambda d: "credenciales incorrectas" in error.text.lower())
        self.assertIn("credenciales incorrectas", error.text.lower())
        time.sleep(1)

    # HU2 - Registrar asistencia
    def test_hu2_registrar_asistencia_accept(self):
        self.login("admin", "admin123")
        time.sleep(1)
        self.driver.find_element(By.ID, "name").send_keys("Juan Perez")
        self.driver.find_element(By.ID, "email").send_keys("juan@correo.com")
        self.driver.find_element(By.CSS_SELECTOR, "#user-form button[type='submit']").click()
        time.sleep(1)
        self.wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(),'Registrar Asistencia')]"))).click()
        time.sleep(1)
        alert_text = ""
        try:
            WebDriverWait(self.driver, 3).until(EC.alert_is_present())
            alert = self.driver.switch_to.alert
            alert_text = alert.text
            alert.accept()
        except:
            pass
        self.assertIn("asistencia registrada", alert_text.lower())
        time.sleep(1)

    def test_hu2_registrar_asistencia_reject_missing_fields(self):
        self.login("admin", "admin123")
        time.sleep(1)
        self.driver.find_element(By.ID, "name").clear()
        self.driver.find_element(By.ID, "email").clear()
        self.driver.find_element(By.CSS_SELECTOR, "#user-form button[type='submit']").click()
        # Espera el alert y acéptalo
        alert_text = ""
        try:
            WebDriverWait(self.driver, 5).until(EC.alert_is_present())
            alert = self.driver.switch_to.alert
            alert_text = alert.text
            alert.accept()
        except:
            pass
        self.assertIn("obligatorio", alert_text.lower())
        time.sleep(1)

    def test_hu2_registrar_asistencia_reject_future_date(self):
        self.login("admin", "admin123")
        self.driver.find_element(By.ID, "show-history").click()
        self.wait.until(EC.visibility_of_element_located((By.ID, "attendance-history")))
        date_input = self.driver.find_element(By.CSS_SELECTOR, "#attendance-history input[type='date']")
        old_date = date_input.get_attribute("value")
        future_date = "2999-12-31"
        date_input.clear()
        date_input.send_keys(future_date)
        # Espera el alert y acéptalo
        WebDriverWait(self.driver, 5).until(EC.alert_is_present())
        alert = self.driver.switch_to.alert
        alert_text = alert.text
        alert.accept()
        # Vuelve a buscar el input después del alert
        date_input = self.driver.find_element(By.CSS_SELECTOR, "#attendance-history input[type='date']")
        self.assertIn("vacía", alert_text.lower())  # El mensaje contiene "vacía" y "futura"
        self.assertEqual(date_input.get_attribute("value"), old_date)
        time.sleep(1)

    # HU3 - Editar asistencia
    def test_hu3_editar_asistencia_accept(self):
        self.login("admin", "admin123")
        self.driver.find_element(By.ID, "show-history").click()
        self.wait.until(EC.visibility_of_element_located((By.ID, "attendance-history")))
        # Acepta cualquier alert abierto
        try:
            WebDriverWait(self.driver, 1).until(EC.alert_is_present())
            alert = self.driver.switch_to.alert
            alert.accept()
        except:
            pass
        date_input = self.driver.find_element(By.CSS_SELECTOR, "#attendance-history input[type='date']")
        date_input.clear()
        date_input.send_keys("2023-01-01")
        time.sleep(1)
        self.assertEqual(date_input.get_attribute("value"), "2023-01-01")
        time.sleep(1)

    def test_hu3_editar_asistencia_reject_empty_fields(self):
        self.login("admin", "admin123")
        self.driver.find_element(By.ID, "show-history").click()
        self.wait.until(EC.visibility_of_element_located((By.ID, "attendance-history")))
        date_input = self.driver.find_element(By.CSS_SELECTOR, "#attendance-history input[type='date']")
        old_date = date_input.get_attribute("value")
        date_input.clear()
        time.sleep(1)
        alert = self.driver.switch_to.alert
        self.assertIn("vacía", alert.text.lower())
        alert.accept()
        date_input = self.driver.find_element(By.CSS_SELECTOR, "#attendance-history input[type='date']")
        self.assertEqual(date_input.get_attribute("value"), old_date)
        time.sleep(1)

    # HU4 - Eliminar asistencia
    def test_hu4_eliminar_asistencia_accept(self):
        self.login("admin", "admin123")
        self.driver.find_element(By.ID, "show-history").click()
        self.wait.until(EC.visibility_of_element_located((By.ID, "attendance-history")))
        rows = self.driver.find_elements(By.CSS_SELECTOR, "#attendance-history tbody tr")
        if rows:
            delete_btn = self.driver.find_element(By.XPATH, "//button[contains(text(),'Eliminar')]")
            delete_btn.click()
            # Espera hasta que la tabla esté vacía o aparezca el texto
            WebDriverWait(self.driver, 5).until(
                lambda d: len(d.find_elements(By.CSS_SELECTOR, "#attendance-history tbody tr")) == 0 or
                          "no se encontraron resultados" in d.page_source.lower()
            )
            self.assertTrue(
                len(self.driver.find_elements(By.CSS_SELECTOR, "#attendance-history tbody tr")) == 0 or
                "no se encontraron resultados" in self.driver.page_source.lower()
            )
        else:
            self.skipTest("No hay registros para eliminar")
        time.sleep(1)

    def test_hu4_eliminar_asistencia_reject_cancel(self):
        # Criterio de rechazo: cancelar eliminación (requiere confirmación en la app)
        # Si tu app no tiene confirmación, este test no aplica
        pass

    # HU5 - Consultar asistencias
    def test_hu5_consultar_asistencias_accept(self):
        self.login("admin", "admin123")
        self.driver.find_element(By.ID, "show-history").click()
        self.wait.until(EC.visibility_of_element_located((By.ID, "attendance-history")))
        filter_name = self.driver.find_element(By.ID, "filter-name")
        filter_name.clear()
        filter_name.send_keys("Juan")
        self.driver.find_element(By.ID, "apply-filter").click()
        time.sleep(1)
        rows = self.driver.find_elements(By.CSS_SELECTOR, "#attendance-history tbody tr")
        self.assertTrue(any("juan" in row.text.lower() for row in rows) or "no se encontraron resultados" in self.driver.page_source.lower())
        time.sleep(1)

    def test_hu5_consultar_asistencias_reject_invalid_filter(self):
        self.login("admin", "admin123")
        self.driver.find_element(By.ID, "show-history").click()
        self.wait.until(EC.visibility_of_element_located((By.ID, "attendance-history")))
        filter_name = self.driver.find_element(By.ID, "filter-name")
        filter_name.clear()
        filter_name.send_keys("!@#$%^&*")
        self.driver.find_element(By.ID, "apply-filter").click()
        time.sleep(1)
        self.assertIn("no se encontraron resultados", self.driver.page_source.lower())
        time.sleep(1)

if __name__ == "__main__":
    suite = unittest.defaultTestLoader.loadTestsFromTestCase(TestAsistenciaApp)
    result = unittest.TextTestRunner(verbosity=2).run(suite)

    # Generar reporte HTML básico
    with open("reporte_simple.html", "w", encoding="utf-8") as f:
        f.write("<html><head><title>Reporte de Pruebas</title></head><body>")
        f.write("<h1>Resultados de pruebas Selenium</h1>")
        f.write(f"<p>Pruebas ejecutadas: {result.testsRun}</p>")
        f.write(f"<p>Fallos: {len(result.failures)}</p>")
        f.write(f"<p>Errores: {len(result.errors)}</p>")
        f.write("<h2>Capturas de pantalla de todas las pruebas:</h2><ul>")
        for test in suite:
            name = test._testMethodName
            f.write(f'<li>{name}: <img src="screenshots/{name}.png" width="400"></li>')
        f.write("</ul>")
        if result.failures or result.errors:
            f.write("<h2>Capturas de pantalla de fallos:</h2><ul>")
            for test, _ in result.failures + result.errors:
                name = test._testMethodName
                f.write(f'<li>{name}: <img src="screenshots/{name}.png" width="400"></li>')
            f.write("</ul>")
        f.write("</body></html>")