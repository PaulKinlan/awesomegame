import webapp2

class RootHandler(webapp2.RequestHandler):
    def get(self):
        pass
    
class GameHandler(webapp2.RequestHandler):
    def get(self, level):
      pass
  
class HighScores(webapp2.RequestHandler):
    def get(self):
        pass
        
app = webapp2.WSGIApplication([
        (r'/', RootHandler),
        (r'/level/<:level>', GameHandler),
    ])