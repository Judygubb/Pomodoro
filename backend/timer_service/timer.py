from fastapi import FastAPI

app = FastAPI()

class Timer:
    def __init__(self, duration=1500):
        self.duration = duration
        self.time_remaining = duration
        self.is_running = False

    def start(self):
        self.is_running = True

    def pause(self):
        self.is_running = False

    def reset(self):
        self.pause()
        self.time_remaining = self.duration

    def get_state(self):
        return {
            "time_remaining": self.time_remaining,
            "is_running": self.is_running,
            "duration": self.duration,
            "formatted_time": self.get_formated_time()
        }

    def tick(self):
        if self.is_running and self.time_remaining > 0:
            self.time_remaining -= 1
            return self.get_state()
        return self.get_state()

    def get_formated_time(self):
        mins = self.time_remaining // 60
        secs = self.time_remaining % 60
        return f"{mins:02d}:{secs:02d}"


# Instantiate a global timer object for this service
timer_instance = Timer()

@app.get("/state")
def get_state():
    return timer_instance.tick()

@app.post("/start")
def start_timer():
    timer_instance.start()
    return timer_instance.get_state()

@app.post("/pause")
def pause_timer():
    timer_instance.pause()
    return timer_instance.get_state()