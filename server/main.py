import webapp2
import jinja2

jinja_environment = jinja2.Environment(                              
        loader=jinja2.FileSystemLoader(
        os.path.dirname(__file__)))

class RootHandler(webapp2.RequestHandler):
    def get(self):
        template = jinja_environment.get_template(
            os.path.join("templates", "game.html"))
        self.response.out.write(template.render())  
    
class GameHandler(webapp2.RequestHandler):
    def get(self, level):
        template = jinja_environment.get_template(
            os.path.join("templates", "game.html"))
        self.response.out.write(template.render()) 
  
class HighScores(webapp2.RequestHandler):
    def get(self):
        pass
        
app = webapp2.WSGIApplication([
        (r'/', RootHandler),
        (r'/level/<:level>', GameHandler),
    ])