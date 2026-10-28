from fastapi import FastAPI

app = FastAPI()

class Timer:
    def __init__(self, duration=1500, break_duration=300):
        self.duration = duration
        self.work_duration = duration
        self.break_duration = break_duration
        self.time_remaining = duration
        self.is_running = False
        self.is_break = False
        self.is_finished = False

    def start(self):
        self.is_running = True
        self.is_finished = False

    def pause(self):
        self.is_running = False

    def reset(self):
        self.pause()
        self.time_remaining = self.duration
        self.is_finished = False

    def break_timer(self):
        self.is_break = True
        self.duration = self.break_duration
        self.reset()

    def work_timer(self):
        self.is_break = False
        self.duration = self.work_duration
        self.reset()

    def get_state(self):
        return {
            "time_remaining": self.time_remaining,
            "is_running": self.is_running,
            "is_break": self.is_break,
            "is_finished": self.is_finished,
            "duration": self.duration,
            "break_duration": self.break_duration,
            "formatted_time": self.get_formated_time(),
            "progress": self.progress()
        }

    def progress(self):
        return 100-((self.time_remaining / self.duration) * 100)

    def tick(self):
        if self.is_running and self.time_remaining > 0:
            self.time_remaining -= 1
            return self.get_state()
        elif self.time_remaining == 0:
            self.is_finished = True
            return self.get_state()
        return self.get_state()

    def get_formated_time(self):
        mins = self.time_remaining // 60
        secs = self.time_remaining % 60
        return f"{mins:02d}:{secs:02d}"


# Global timer
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

@app.post("/reset")
def reset_timer():
    timer_instance.reset()
    return timer_instance.get_state()

@app.post("/break")
def break_timer():
    timer_instance.break_timer()
    return timer_instance.get_state()

@app.post("/work")
def work_timer():
    timer_instance.work_timer()
    return timer_instance.get_state()
