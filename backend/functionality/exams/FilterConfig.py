class FilterConfig:
    def __init__(self) -> None:
        self.year = None
        self.type = None
        self.topic = None

    def FilterYear(self, year):
        self.year = year
        return self
    
    def FilterType(self, type):
        self.type = type
        return self
    
    def FilterTopic(self, topic):
        self.topic = topic
        return self
    
    def HasYear(self):
        return self.year != None
    
    def HasType(self):
        return self.type != None
    
    def HasTopic(self):
        return self.topic != None
    
    
    def Encode(self) -> dict:
        return {
                "year": self.year,
                "type": self.type,
                "topic": self.topic
                }

    def Decode(filterConfig: dict):
        decoded = FilterConfig()

        for key, val in filterConfig:
            if key == "year":
                decoded.FilterYear(val)
            elif key == "type":
                decoded.FilterType(val)
            elif key == "topic":
                decoded.FilterTopic(val)
            else:
                print("Unknown key " + key)
        
        return decoded

